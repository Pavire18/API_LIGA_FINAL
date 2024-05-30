
import mongoose, { Document, ObjectId } from "mongoose";
const Schema = mongoose.Schema;

export interface IMatchDay {
  matches: ObjectId[];
  matchDate: Date;
}

// Creamos el schema del usuario
const matchDaySchema = new Schema<IMatchDay>(
  {
    matches: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    }],
    matchDate: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

export const MatchDay = mongoose.model<IMatchDay>("MatchDay", matchDaySchema);
export type MatchDayA = IMatchDay & Document;
