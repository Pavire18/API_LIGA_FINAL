import { type NextFunction, type Request, type Response } from "express";
import { teamOdm } from "../odm/team.odm";

const getAllTeams = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Asi leemos query params
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const teams = await teamOdm.getAllTeams(page, limit);
    // Num total de elementos
    const totalElements = await teamOdm.getTeamCount();

    const response = {
      pagination: {
        totalItems: totalElements,
        totalPages: Math.ceil(totalElements / limit),
        currentPage: page,
      },
      data: teams,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getTeamById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    const team = await teamOdm.getTeamById(id);
    if (team) {
      res.json(team);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

const createTeam = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user.role !== "ADMINISTRADOR") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const createdTeam = await teamOdm.createTeam(req.body);
    res.status(201).json(createdTeam);
  } catch (error) {
    next(error);
  }
};

const deleteTeam = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user.role !== "ADMINISTRADOR") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const id = req.params.id;
    const teamDeleted = await teamOdm.deleteTeam(id);
    if (teamDeleted) {
      res.json(teamDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

const updateTeam = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user.role === "JUGADOR") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }

    const id = req.params.id;
    const teamUpdated = await teamOdm.updateTeam(id, req.body);
    if (teamUpdated) {
      res.json(teamUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const teamService = {
  getAllTeams,
  getTeamById,
  createTeam,
  deleteTeam,
  updateTeam,
};
