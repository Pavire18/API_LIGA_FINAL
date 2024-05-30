import { type NextFunction, type Request, type Response } from "express";
import { leagueOdm } from "../odm/league.odm";

const getAllLeagues = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Asi leemos query params
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const leagues = await leagueOdm.getAllLeagues(page, limit);
    // Num total de elementos
    const totalElements = await leagueOdm.getLeaguesCount();

    const response = {
      pagination: {
        totalItems: totalElements,
        totalPages: Math.ceil(totalElements / limit),
        currentPage: page,
      },
      data: leagues,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const createLeague = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const createdMatch = await leagueOdm.createLeague(req.body);
    res.status(201).json(createdMatch);
  } catch (error) {
    next(error);
  }
};

const updateLeague = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    const matchUpdated = await leagueOdm.updateLeague(id, req.body);
    if (matchUpdated) {
      res.json(matchUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

const resetLeague = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user.role !== "ADMINISTRADOR") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }
    const league = await leagueOdm.resetLeague();
    res.status(201).json(league);
  } catch (error) {
    next(error);
  }
};

export const leagueService = {
  getAllLeagues,
  createLeague,
  updateLeague,
  resetLeague,
};
