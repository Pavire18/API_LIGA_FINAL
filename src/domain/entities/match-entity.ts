
import mongoose, { Document } from "mongoose";
import { ObjectId } from "typeorm";
const Schema = mongoose.Schema;

export interface IMatch {
  team1: ObjectId;
  team2: ObjectId;
  goalsTeam1: number;
  goalsTeam2: number;
  matchPlayed: boolean;
}

// Creamos el schema del usuario
const matchSchema = new Schema<IMatch>(
  {
    team1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    team2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },
    goalsTeam1: {
      type: Number,
      required: true,
    },
    goalsTeam2: {
      type: Number,
      required: true,
    },
    matchPlayed: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  {
    timestamps: true,
  }
);

export const Match = mongoose.model<IMatch>("Match", matchSchema);
export type MatchA = IMatch & Document;
