import express from "express";
import { teamService } from "../domain/services/team.service";
import { isAuth } from "../utils/auth.middleware";
// import multer from "multer";
// const upload = multer({ dest: "public" });

export const teamRoute = express.Router();

teamRoute.get("/", teamService.getAllTeams);
teamRoute.get("/:id", teamService.getTeamById);
teamRoute.post("/", isAuth, teamService.createTeam);
teamRoute.delete("/:id", isAuth, teamService.deleteTeam);
teamRoute.put("/:id", isAuth, teamService.updateTeam);
