import express from "express";
import { leagueService } from "../domain/services/league.service";
import { isAuth } from "../utils/auth.middleware";

export const leagueRoute = express.Router();

leagueRoute.post("/", leagueService.createLeague);
leagueRoute.get("/", leagueService.getAllLeagues);
leagueRoute.put("/", leagueService.updateLeague);
leagueRoute.get("/clasification", leagueService.getClasification);
leagueRoute.post("/reset", isAuth, leagueService.resetLeague);
