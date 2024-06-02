import { type NextFunction, type Request, type Response } from "express";
import { matchOdm } from "../odm/match.odm";
import { IMatch, Match } from "../entities/match-entity";

const getAllMatches = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Asi leemos query params
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const matches = await matchOdm.getAllMatches(page, limit);
    // Num total de elementos
    const totalElements = await matchOdm.getMatchesCount();

    const response = {
      pagination: {
        totalItems: totalElements,
        totalPages: Math.ceil(totalElements / limit),
        currentPage: page,
      },
      data: matches,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

const getMatchById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    const match = await matchOdm.getMatchById(id);
    if (match) {
      res.json(match);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

const createMatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const createdMatch = await matchOdm.createMatch(req.body);
    res.status(201).json(createdMatch);
  } catch (error) {
    next(error);
  }
};

const deleteMatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    const matchDeleted = await matchOdm.deleteMatch(id);
    if (matchDeleted) {
      res.json(matchDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

const updateMatch = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user.role !== "ADMINISTRADOR") {
      res.status(401).json({ error: "No tienes autorización para realizar esta operación" });
      return;
    }
    const id = req.params.id;
    let matchUpdated = null;
    const matchToUpdate: IMatch = new Match(await matchOdm.getMatchById(id));
    if (matchToUpdate?.matchPlayed) {
      const winnerTeam = matchToUpdate.goalsTeam1 > matchToUpdate.goalsTeam2 ? matchToUpdate.team1 : matchToUpdate.team2;
      const newMatch: IMatch = {
        ...req.body,
        winner: winnerTeam
      };

      matchUpdated = await matchOdm.updateMatch(id, newMatch);
    } else {
      matchUpdated = await matchOdm.updateMatch(id, req.body);
    }

    if (matchUpdated) {
      res.json(matchUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    next(error);
  }
};

export const matchService = {
  getAllMatches,
  getMatchById,
  createMatch,
  deleteMatch,
  updateMatch,
};
