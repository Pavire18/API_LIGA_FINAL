
import mongoose from "mongoose";
import { ObjectId } from "typeorm";
const Schema = mongoose.Schema;

export interface ITeam {
  name: string;
  alias: string;
  delegate: ObjectId;
  players: ObjectId[];
}

// Creamos el schema del usuario
const teamSchema = new Schema<ITeam>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    alias: {
      type: String,
      trim: true,
      required: true,
    },
    delegate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    players: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }]
  },
  {
    timestamps: true,
  }
);

export const Team = mongoose.model<ITeam>("Team", teamSchema);
