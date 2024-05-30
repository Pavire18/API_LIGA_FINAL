import { MatchDay } from "../entities/matchDay-entity";

const getAllMatchDays = async (page: number, limit: number): Promise<any> => {
  return await MatchDay.find()
    .limit(limit)
    .skip((page - 1) * limit).populate("matches");
};

const getMatchDaysCount = async (): Promise<number> => {
  return await MatchDay.countDocuments();
};

export const matchDayOdm = {
  getAllMatchDays,
  getMatchDaysCount
};
