import { getAllShowtimes } from "./model.js";
import redisClient from "../shared/redis.js";

async function wait(ms:number) {
    return new Promise((resolve)=>setTimeout(resolve, ms))
}

async function waitForCache(cacheKey:string, retries = 3, delayMs=200) {
    for (let i = 0; i < retries; i++) {
        await wait(delayMs)
        const cached = await redisClient.get(cacheKey)
        if (cached) {
              console.log('WAITED FOR CACHE - found it, avoided a redundant Postgres query');
            return JSON.parse(cached)
        }
        
    }
      console.log('GAVE UP WAITING - falling back to Postgres');
        return null;
}

export async function fetchAllShowtimes(movie_id?: string) {
    const cacheKey = `showtimes:movie:${movie_id || 'all'}`

    const cached = await redisClient.get(cacheKey)

    if (cached) {
        console.log('CACHE HIT')
        return JSON.parse(cached)
    }

    if(!cached) {
        const gotLock = await redisClient.set(`lock:showtimes:movie:${movie_id || 'all'}`, '1', {condition: 'NX', expiration: {type: 'EX', value: 5}})

        if (gotLock){
            console.log('ACQUIRED LOCK - querying Postgres directly');
            const showtimes = await getAllShowtimes(movie_id)
            await redisClient.set(
                cacheKey, 
                JSON.stringify(showtimes), 
                {expiration: {
                    type: 'EX', 
                    value: 21600
                }}
            )
            return showtimes
            
        }else{
            const stillCached = await waitForCache(cacheKey)
            if (stillCached) return stillCached

            console.log('CACHE MISS - querying postgres')
            const showtimes = await getAllShowtimes(movie_id)

            return showtimes
        }
    }   

}