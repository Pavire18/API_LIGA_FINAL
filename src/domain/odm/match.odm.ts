import { Document } from "mongoose";
import { IMatch, Match } from "../entities/match-entity";

const getAllMatches = async (page: number, limit: number): Promise<any> => {
  return await Match.find()
    .limit(limit)
    .skip((page - 1) * limit).populate([{ path: "team1" }, { path: "team2" }, { path: "winner" }]);
};

const getMatchesCount = async (): Promise<number> => {
  return await Match.countDocuments();
};

const getMatchById = async (id: string): Promise<Document<IMatch> | null> => {
  return await Match.findById(id).populate([{ path: "team1" }, { path: "team2" }]);
};

const createMatch = async (MatchData: any): Promise<Document<IMatch>> => {
  const match = new Match(MatchData);
  const document: Document<IMatch> = (await match.save()) as any;

  return document;
};

const deleteMatch = async (id: string): Promise<Document<IMatch> | null> => {
  return await Match.findByIdAndDelete(id);
};

const updateMatch = async (id: string, MatchData: any): Promise<Document<IMatch> | null> => {
  return await Match.findByIdAndUpdate(id, MatchData, { new: true, runValidators: true });
};

export const matchOdm = {
  getAllMatches,
  getMatchesCount,
  getMatchById,
  createMatch,
  deleteMatch,
  updateMatch
};
