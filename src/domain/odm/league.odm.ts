import { Document } from "mongoose";
import { ILeague, League } from "../entities/league-entity";
import { ITeam, Team } from "../entities/team-entity";
import { IMatch, Match } from "../entities/match-entity";
import { randomNumber, scheduleMatches } from "../../utils/scheduleMatches";
import { MatchDay, MatchDayA } from "../entities/matchDay-entity";
import { matchOdm } from "./match.odm";
import { teamOdm } from "./team.odm";

const getAllLeagues = async (page: number, limit: number): Promise<any> => {
  return await League.find()
    .limit(limit)
    .skip((page - 1) * limit)
    .populate("games");
};

const getLeaguesCount = async (): Promise<number> => {
  return await League.countDocuments();
};

const createLeague = async (LeagueData: any): Promise<Document<ILeague>> => {
  const league = new League(LeagueData);
  const document: Document<ILeague> = (await league.save()) as any;

  return document;
};

// REINICAR LIGA
const updateLeague = async (id: string, LeagueData: any): Promise<Document<ILeague> | null> => {
  // return await League.findByIdAndUpdate(id, LeagueData, { new: true, runValidators: true });
  return null;
};

const resetLeague = async (): Promise<Document<ILeague> | null> => {
  await Match.collection.drop();
  await League.collection.drop();
  await MatchDay.collection.drop();
  const teams = await Team.find();

  // MATCHES
  const matches: IMatch[] = [];
  for (let i = 0; i < teams.length; i++) {
    const team = teams[i];
    for (let j = 0; j < teams.length; j++) {
      if (team !== teams[j]) {
        const gamePlayed = Math.random() < 0.5;
        const match = new Match({
          team1: team._id,
          team2: teams[j]._id,
          goalsTeam1: gamePlayed ? randomNumber(4, 0) : 0,
          goalsTeam2: gamePlayed ? randomNumber(4, 0) : 0,
          matchPlayed: gamePlayed,
        });
        await match.save();
        matches.push(match);
      }
    }
  }

  const jornadas = scheduleMatches(matches);
  const fecha = new Date();
  const matchDayDocuments: MatchDayA[] = jornadas.map((match, index) => {
    fecha.setDate(index !== 0 ? fecha.getDate() + 7 : fecha.getDate());

    return new MatchDay({
      matches: match,
      matchDate: fecha,
    });
  });
  await MatchDay.insertMany(matchDayDocuments);
  const league = new League({ games: matchDayDocuments.map((match) => match._id) });
  await league.save();
  const document: Document<ILeague> = (await league.save()) as any;
  return document;
};

const getClasification = async (): Promise<any> => {
  const equipos: ITeam[] = await teamOdm.getAllTeams(0, 0);
  const partidos = await matchOdm.getAllMatches(0, 0);
  const clasification: any = [];
  console.log(partidos);
  equipos.forEach((team) => {
    const equipo = {
      teamName: team.name,
      pg: 0,
      pp: 0,
      pt: 0,
    };
    clasification.push(equipo);
  });

  partidos.forEach(async (partido: any) => {
    if (partido.matchPlayed) {
      if (partido.winner !== null) {
        const indice = clasification.findIndex((equipo: any) => equipo.teamName === partido.winner?.name);
        const pt: number = clasification[indice].pt;
        const pg: number = clasification[indice].pg;
        clasification[indice].pt = pt + 3;
        clasification[indice].pg = pg + 1;
      }
    }
  });

  clasification.forEach(equipo => {
    equipo.pp = equipos.length
  });
  console.log(clasification);

  return clasification.sort((a: any, b: any) => (a.pt > b.pt ? 1 : b.pt > a.pt ? -1 : 0));
};

export const leagueOdm = {
  getAllLeagues,
  createLeague,
  updateLeague,
  getLeaguesCount,
  resetLeague,
  getClasification,
};
