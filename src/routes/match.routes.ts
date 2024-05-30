import express from "express";
import { matchService } from "../domain/services/match.service";
import { isAuth } from "../utils/auth.middleware";

export const matchRoute = express.Router();

matchRoute.get("/", matchService.getAllMatches);
matchRoute.get("/:id", matchService.getMatchById);
matchRoute.post("/", matchService.createMatch);
matchRoute.delete("/:id", matchService.deleteMatch);
matchRoute.put("/:id", isAuth, matchService.updateMatch);
