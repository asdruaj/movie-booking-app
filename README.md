# 🎬 TicketRush

A movie theater ticket booking system built as a deliberate practice project in system design and DevOps — race conditions, caching, load balancing, sharding trade-offs, CI/CD, Docker, and real deployment, all reasoned through and built from scratch.

**Live demo:** _(spin up via `./redeploy.sh`, see Deployment below — kept offline between demos to control cost)_

![CI](https://github.com/asdruaj/movie-booking-app/actions/workflows/ci.yaml/badge.svg)

---

## What this is

A full-stack booking app: browse movies, pick a showtime, select seats (single or multiple), and book — with the concurrency guarantees a real booking system actually needs. Built specifically to practice the parts of backend/infra engineering that don't show up in a typical CRUD tutorial: what happens when two people click the same seat at the same time, how a cache invalidates correctly, what a load balancer actually proves, and what real deployment infrastructure looks like once you leave `localhost`.

**Stack:** React + TypeScript + Vite (client) · Express + TypeScript (server) · PostgreSQL · Redis · Nginx · Docker · GitHub Actions

---

## The core engineering problem: preventing double-booking

This is the project's centerpiece. Two people click the same seat within milliseconds of each other — only one should get it.

**The naive approach fails predictably:** check if a seat is booked, then insert a booking — two separate queries. Under concurrency, both requests can read "available" before either commits. Reproduced this for real: 5 simultaneous requests → 1 success, 4 raw `500`s (the database's own constraint caught the collision, but the application never anticipated it).

**The fix:** a single transaction with `SELECT ... FOR UPDATE`, locking the *seat* row — not the booking row, which doesn't exist yet at check-time. Locking the seat serializes every concurrent request for that seat through one connection at a time; the losers get a clean `409 SEAT_UNAVAILABLE` instead of a raw database error.

```sql
BEGIN;
SELECT * FROM seats WHERE id = $1 FOR UPDATE;
-- check if already booked, insert if not
COMMIT;
```

**Idempotency keys** protect against network retries double-booking the same request — a client-supplied UUID, checked *inside* the same seat lock (an ordering bug where the idempotency check ran before the lock was found and fixed independently during development).

**Multi-seat booking** extends this to atomic groups: book 3 seats together, get all 3 or none. The real addition here is **lock ordering** — every transaction sorts its seat IDs before locking, so two overlapping bookings can never form a deadlock by acquiring locks in opposite order. Verified with three real tests: happy path, atomicity under conflict (with rollback verification), and true concurrent overlapping groups.

---

## Caching, load balancing, and the sharding decision

**Redis caching** — cache-aside pattern, write-through invalidation on booking (chosen deliberately over invalidate-then-refetch after reasoning through the read/write ratio), with **stampede protection**: a Redis `NX` lock ensures only one request repopulates a cold cache while others wait and retry, rather than every concurrent request hammering Postgres simultaneously.

**Load balancing** — two app instances behind Nginx, round-robin. Verified at real scale (200 requests) after small-sample tests turned out to be misleadingly skewed by nginx's worker-process distribution.

**Sharding — explored, then deliberately not implemented.** Built a working shard router (MD5 hash → modulo → shard index) and a real second Postgres instance to prove the mechanism, then removed it. `bookings` has too many load-bearing foreign keys (`showtimes`, `seats`, `users`) to shard cleanly — foreign keys can't be enforced across separate database instances, and this project's scale doesn't justify moving referential integrity into application code. Knowing when *not* to add complexity was the actual lesson here.

---

## The deployment story (the honest version)

This didn't go as planned, and the pivot is worth documenting rather than hiding.

**Attempt 1 — DigitalOcean:** account signup worked, got a $5 credit — but the payment-method step rejected the card with no specific reason. Also confirmed DigitalOcean has **no hard spending cap** (only email alerts), which factored into declining to risk a borrowed card.

**Fallback — Cloudflare Tunnel:** self-hosted the whole stack (2 app instances + Nginx LB, containerized) behind Cloudflare's free Quick Tunnels. Fully working, including a real finding from load testing: **free Quick Tunnels cap out around ~160 concurrent connections** — a genuine infrastructure constraint of that approach, not an app bug.

**Later — a real VPS:** tried more providers (Vultr, HOSTKEY) — all rejected the same card. Cloudzy, finally accepted it. From there, built genuine **SSH-based CD**: `deploy.yaml` uses `appleboy/ssh-action` to SSH into the droplet and redeploy automatically on every push to `main` — the real, representative pattern, not a workaround.

**Automated provisioning, stress-tested for real:** rather than pay ~$1.17/mo to keep a snapshot around between demos, built `provision.sh` (full remote setup: Docker, clone, migrate, seed) + `redeploy.sh` (one local command that provisions a fresh droplet *and* updates GitHub's deploy secret automatically). Ran the full destroy-and-recreate cycle twice for real and found four genuine infrastructure bugs neither of us could have predicted on paper:
- Docker's daemon wasn't started yet on a fresh image (package installed ≠ daemon running)
- `curl ifconfig.me` returned an IPv6 address on this VPS, baking a malformed URL into the frontend build
- Migrations ran before Postgres finished starting inside its own container
- SSH correctly flagged a changed host key when Cloudzy reused an IP for a new droplet

Every one of these follows the same real lesson: **"container reported started" is not the same as "service is actually ready"** — seen here in three different layers (Docker's daemon, Postgres, and earlier in this project, the CI server-readiness check) and fixed the same way each time: an explicit retry loop, not a fixed `sleep`.

---

## CI/CD

GitHub Actions runs Postgres and Redis as real service containers (with `pg_isready`/`redis-cli ping` health checks), seeds a test database, starts the app, and fires a genuine concurrency test against it — asserting exactly one booking succeeds out of five simultaneous attempts. Getting this pipeline to actually pass surfaced five real bugs across the codebase (a stale lockfile, a broken `dev` script path, an undefined env var, a caching bug in the runner setup) — CI's job is exactly to catch things like this before they reach production, and it did.

---

## Deliberate scope decisions (not oversights)

A few things were consciously left out, with real reasoning, the same way sharding was:

- **Real session-based auth** — the design was decided on Day 1 (`express-session` + `connect-redis`, not JWT, specifically to exercise more Redis) and the dependencies are already installed, but implementing a full login/registration flow was disproportionate scope this close to finishing. Solved differently instead: a `UserSelector` dropdown lets you pick from real seeded users — honest about what it is, no fake auth pretense, and it actually demonstrates the concurrency story better (switch users, race two "different people" for the same seat).
- **QA not deployed to the real VPS** — checked actual RAM usage before deciding (`free -h`: only 269MB free on a 1GB droplet, Prod already at ~72%) — running QA's own stack alongside it risked destabilizing the live site. The QA/Prod environment split is already proven twice over: locally, and on the earlier Cloudflare Tunnel deployment.
- **A hardcoded database password** across compose files — a real, accepted trade-off for a project with no actual data or financial stakes behind it; would need to become a real secret before this pattern touched anything sensitive.

---

## Local setup

```bash
git clone https://github.com/asdruaj/movie-booking-app.git
cd movie-booking-app
docker compose up -d --build
cd server && pnpm migrate up && pnpm seed
```

Client: `http://localhost:5173` · API: `http://localhost:5001/api/v1`

## Deployment

```bash
./redeploy.sh <droplet-ip>
```

Provisions a fresh droplet end-to-end — Docker, clone, build, migrate, seed — and updates the GitHub deploy secret automatically. From then on, every push to `main` deploys automatically via `deploy.yaml`.

---

## What I'd build next

Real session-based auth, a fully sharded write-path if the domain ever genuinely needed it, and a dedicated reserved IP so the deploy target never has to change between demos.