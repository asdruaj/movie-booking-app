import { Router } from "express";
import { getShowtimes } from "./controller.js";

const router = Router()

router.get('/', getShowtimes)

export default router