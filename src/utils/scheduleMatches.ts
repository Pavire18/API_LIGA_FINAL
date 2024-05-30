import { IMatch } from "../domain/entities/match-entity";

export const randomNumber = (max: number, min: number): number => {
  const number = Math.floor(Math.random() * (max - min)) + min;
  return number;
};

export const scheduleMatches = (matches: IMatch[]): IMatch[][] => {
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
        i--;
      }
    }

    jornadas.push(jornada);
  }

  return jornadas;
};
