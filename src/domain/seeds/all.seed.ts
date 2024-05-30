import mongoose from "mongoose";
import { mongoConnect } from "../repositories/mongo-repository";
import { User } from "../entities/user-entity";
import { userList } from "./users.data";
import { teamList } from "./teams.data";
import { Team } from "../entities/team-entity";
import { IMatch, Match } from "../entities/match-entity";
import { League } from "../entities/league-entity";
import { MatchDay, MatchDayA } from "../entities/matchDay-entity";

const scheduleMatches = (matches: IMatch[]): IMatch[][] => {
  const jornadas: IMatch[][] = [];
  let teamPlayed: Record<string, boolean> = {};

  while (matches.length > 0) {
    const jornada: IMatch[] = [];
    teamPlayed = {};

    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const team1Id = match.team1.toString();
      const team2Id = match.team2.toString();

      if (!teamPlayed[team1Id] && !teamPlayed[team2Id]) {
        jornada.push(match);
        teamPlayed[team1Id] = true;
        teamPlayed[team2Id] = true;
        matches.splice(i, 1);
        i--; // Ajustar el índice después de eliminar el partido
      }
    }

    jornadas.push(jornada);
  }

  return jornadas;
};

const randomNumber = (max: number, min: number): number => {
  const number = Math.floor(Math.random() * (max - min)) + min;
  return number;
};

async function populateBBDD() {
  try {
    await mongoConnect();
    console.log("Tenemos conexión");

    // BORRADO DE DATOS
    await User.collection.drop();
    await Team.collection.drop();
    await Match.collection.drop();
    await League.collection.drop();
    await MatchDay.collection.drop();
    // USERS
    const userDocuments = userList.map((user) => new User(user));
    for (let i = 0; i < userDocuments.length; i++) {
      const user = userDocuments[i];
      await user.save();
    }

    // TEAMS
    const teamsDocuments = teamList.map((team) => new Team(team));
    // ASSIGN USERS TO TEAMS
    const usersToAssign = userDocuments.slice(0, 12);
    const teamCount = teamsDocuments.length;

    for (let i = 0; i < teamsDocuments.length; i++) {
      const team = teamsDocuments[i];
      team.delegate = userDocuments[12 + i]._id;
    }

    for (let i = 0; i < usersToAssign.length; i++) {
      const teamIndex = Math.floor(i / 2) % teamCount;
      teamsDocuments[teamIndex].players.push(usersToAssign[i]._id);
    }

    // MATCHES
    const matches: IMatch[] = [];
    for (let i = 0; i < teamsDocuments.length; i++) {
      const team = teamsDocuments[i];
      for (let j = 0; j < teamsDocuments.length; j++) {
        if (team !== teamsDocuments[j]) {
          const gamePlayed = Math.random() < 0.5;
          const match = new Match({
            team1: team._id,
            team2: teamsDocuments[j]._id,
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

    // INSERTS
    await Team.insertMany(teamsDocuments);
    await MatchDay.insertMany(matchDayDocuments);

    const league = new League({ games: matchDayDocuments.map((match) => match._id) });
    await league.save();
    console.log("Datos guardados correctamente!");
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
}

void populateBBDD();
