import { Router } from "express";
import { postBooking } from "./controller.js";

const router = Router()

router.post('/', postBooking)

export default router