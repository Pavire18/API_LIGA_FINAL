import request from "supertest";
import { describe } from "node:test";
import { IUser, User } from "../src/domain/entities/user-entity";
import { ITeam, Team } from "../src/domain/entities/team-entity";
import { app } from "../src/server";
import { IMatch } from "../src/domain/entities/match-entity";

describe("Match controller", () => {
  const adminUserMock: IUser = {
    email: "admin3@gmail.com",
    password: "12345678",
    name: "SUPER",
    lastName: "ADMIN",
    role: "ADMINISTRADOR",
    image: "admin.jpg",
  };

  const delegadoUserMock: IUser = {
    email: "delegado3@gmail.com",
    password: "12345678",
    name: "Delegado",
    lastName: "Dlg",
    role: "DELEGADO",
    image: "prueba.jpg",
  };

  const jugadorUserMock: IUser = {
    email: "jugador3@gmail.com",
    password: "12345678",
    name: "Jugador",
    lastName: "Dlg",
    role: "JUGADOR",
    image: "prueba.jpg",
  };

  const teamMock: ITeam = {
    name: "prueba",
    alias: "test",
    delegate: new User(delegadoUserMock).id,
    players: [new User(jugadorUserMock).id]
  };

  const teamMock2: ITeam = {
    name: "prueba2",
    alias: "test2",
    delegate: new User(delegadoUserMock).id,
    players: [new User(jugadorUserMock).id]
  };

  const matchMock: IMatch = {
    team1: new Team(teamMock).id,
    team2: new Team(teamMock2).id,
    goalsTeam1: 0,
    goalsTeam2: 0,
    matchPlayed: false,
    winner: null
  }

  let adminToken: string;
  let delegadoToken: string;
  let jugadorToken: string;
  let createdMatchId: string;

  beforeAll(async () => {
    await new User(adminUserMock).save();
    await new User(delegadoUserMock).save();
    await new User(jugadorUserMock).save();
    console.log("Eliminados todos los usuarios");
  });

  it("POST /user/login", async () => {
    // WRONG LOGIN -> 401
    const wrongCredentials = { email: adminUserMock.email, password: "NOT VALID" };
    const wrongResponse = await request(app).post("/user/login").send(wrongCredentials).expect(401);
    expect(wrongResponse.body.token).toBeUndefined();
    console.log("WRONG LOGIN");

    // JUGADOR LOGIN OK -> 200
    const jugadorCredential = { email: jugadorUserMock.email, password: jugadorUserMock.password };
    const jugadorResponse = await request(app).post("/user/login").send(jugadorCredential).expect(200);
    expect(jugadorResponse.body.token).toBeDefined();
    jugadorToken = jugadorResponse.body.token;
    console.log("LOGIN JUGADOR");

    // DELEGADO LOGIN OK -> 200
    const delegadoCredential = { email: delegadoUserMock.email, password: delegadoUserMock.password };
    const delegadoResponse = await request(app).post("/user/login").send(delegadoCredential).expect(200);
    expect(delegadoResponse.body.token).toBeDefined();
    delegadoToken = delegadoResponse.body.token;
    console.log("LOGIN DELEGADO");

    // ADMIN LOGIN OK -> 200
    const adminCredentials = { email: adminUserMock.email, password: adminUserMock.password };
    const adminResponse = await request(app).post("/user/login").send(adminCredentials).expect(200);
    expect(adminResponse.body.token).toBeDefined();
    adminToken = adminResponse.body.token;
    console.log("LOGIN ADMIN");
  });

  it("POST /match", async () => {
    // Logged with admin -> 201
    const response = await request(app).post("/match").set("Authorization", `Bearer ${adminToken}`).send(matchMock).expect(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.team1).toBe(matchMock.team1);

    createdMatchId = response.body._id;
  });

  it("GET /match", async () => {
    // Not logged -> 200
    const generalResponse = await request(app).get("/match").expect(200);
    expect(generalResponse.body.data?.length).toBeDefined();

    // Logged with jugador -> 200
    const jugadorResponse = await request(app).get("/match").set("Authorization", `Bearer ${jugadorToken}`).expect(200);
    expect(jugadorResponse.body.data?.length).toBeDefined();

    // Logged with delegado -> 200
    const delegadoResponse = await request(app).get("/match").set("Authorization", `Bearer ${delegadoToken}`).expect(200);
    expect(delegadoResponse.body.data?.length).toBeDefined();

    // Logged with admin -> 200
    const adminResponse = await request(app).get("/match").set("Authorization", `Bearer ${adminToken}`).expect(200);
    expect(adminResponse.body.data?.length).toBeDefined();
  });

  it("GET /match/:id", async () => {
    // Not logged -> 200
    const generalResponse = await request(app).get(`/match/${createdMatchId}`).expect(200);
    expect(generalResponse.body.team1).toBeDefined();

    // Logged with jugador -> 200
    const jugadorResponse = await request(app).get(`/match/${createdMatchId}`).set("Authorization", `Bearer ${jugadorToken}`).expect(200);
    expect(jugadorResponse.body.team1).toBeDefined();

    // Logged with delegado -> 200
    const delegadoResponse = await request(app).get(`/match/${createdMatchId}`).set("Authorization", `Bearer ${delegadoToken}`).expect(200);
    expect(delegadoResponse.body.team1).toBeDefined();

    // Logged with admin -> 200
    const adminResponse = await request(app).get(`/match/${createdMatchId}`).set("Authorization", `Bearer ${adminToken}`).expect(200);
    expect(adminResponse.body.team1).toBeDefined();
  });

  it("PUT /match/id", async () => {
    const updatedData = { team1: new Team(teamMock2).id };

    // Not logged -> 401
    await request(app).put(`/match/${createdMatchId}`).send(updatedData).expect(401);

    // Logged with jugador -> 401
    await request(app).put(`/match/${createdMatchId}`).send(updatedData).set("Authorization", `Bearer ${jugadorToken}`).expect(401);

    // Logged with jugador -> 401
    await request(app).put(`/match/${createdMatchId}`).send(updatedData).set("Authorization", `Bearer ${delegadoToken}`).expect(401);

    // Logged with admin -> 200
    const adminResponse = await request(app).put(`/match/${createdMatchId}`).send(updatedData).set("Authorization", `Bearer ${adminToken}`).expect(200);
    expect(adminResponse.body.team1).toBe(updatedData.team1);
  });
});
