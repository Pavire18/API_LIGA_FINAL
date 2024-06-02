import { describe } from "node:test";
import { mongoConnect } from "./src/domain/repositories/mongo-repository";
import mongoose from "mongoose";
import { User } from "./src/domain/entities/user-entity";
import { Team } from "./src/domain/entities/team-entity";

describe("connection", () => {
  beforeAll(async () => {
    await mongoConnect();
    await User.collection.drop();
    await Team.collection.drop();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
