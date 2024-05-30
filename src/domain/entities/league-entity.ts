import mongoose from "mongoose";
import { ObjectId } from "typeorm";
const Schema = mongoose.Schema;

export interface ILeague {
  games: ObjectId[];
}

// Creamos el schema del usuario
const leagueSchema = new Schema<ILeague>(
  {
    games: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "MatchDay",
      required: true,
    }]
  },
  {
    timestamps: true,
  }
);

export const League = mongoose.model<ILeague>("League", leagueSchema);
