
import { Document } from "mongoose";
import { ITeam, Team } from "../entities/team-entity";

const getAllTeams = async (page: number, limit: number): Promise<any> => {
  return await Team.find()
    .limit(limit)
    .skip((page - 1) * limit).populate("players");
};

const getTeamCount = async (): Promise<number> => {
  return await Team.countDocuments();
};

const getTeamById = async (id: string): Promise<Document<ITeam> | null> => {
  return await Team.findById(id).populate("players");
};

const createTeam = async (TeamData: any): Promise<Document<ITeam>> => {
  const team = new Team(TeamData);
  const document: Document<ITeam> = (await team.save()) as any;

  return document;
};

const deleteTeam = async (id: string): Promise<Document<ITeam> | null> => {
  return await Team.findByIdAndDelete(id);
};

const updateTeam = async (id: string, TeamData: any): Promise<Document<ITeam> | null> => {
  return await Team.findByIdAndUpdate(id, TeamData, { new: true, runValidators: true });
};

export const teamOdm = {
  getAllTeams,
  getTeamCount,
  getTeamById,
  createTeam,
  deleteTeam,
  updateTeam
};
