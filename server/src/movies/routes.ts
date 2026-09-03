import { Router } from "express";
import { getMovies } from "./controller.js";

const router = Router()

router.get('/', getMovies)

export default router