import { type NextFunction, type Request, type Response } from "express";
import { matchDayOdm } from "../odm/matchDay.odm";

const getAllMatchDays = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Asi leemos query params
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const matches = await matchDayOdm.getAllMatchDays(page, limit);
    // Num total de elementos
    const totalElements = await matchDayOdm.getMatchDaysCount();

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

export const matchDayService = {
  getAllMatchDays
};
