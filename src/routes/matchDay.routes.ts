import express from "express";
import { matchDayService } from "../domain/services/matchDay.service";

export const matchDayRoute = express.Router();

matchDayRoute.get("/", matchDayService.getAllMatchDays);
