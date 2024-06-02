import request from "supertest";
import { describe } from "node:test";
import { IUser, User } from "../src/domain/entities/user-entity";
import { ITeam } from "../src/domain/entities/team-entity";
import { app } from "../src/server";

describe("Team controller", () => {
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

  let adminToken: string;
  let delegadoToken: string;
  let jugadorToken: string;
  let createdTeamId: string;

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

  it("POST /team", async () => {
    // Logged with admin -> 201
    const response = await request(app).post("/team").set("Authorization", `Bearer ${adminToken}`).send(teamMock).expect(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.name).toBe(teamMock.name);

    createdTeamId = response.body._id;
  });

  it("GET /team", async () => {
    // Not logged -> 200
    const generalResponse = await request(app).get("/team").expect(200);
    expect(generalResponse.body.data?.length).toBeDefined();

    // Logged with jugador -> 200
    const jugadorResponse = await request(app).get("/team").set("Authorization", `Bearer ${jugadorToken}`).expect(200);
    expect(jugadorResponse.body.data?.length).toBeDefined();

    // Logged with delegado -> 200
    const delegadoResponse = await request(app).get("/team").set("Authorization", `Bearer ${delegadoToken}`).expect(200);
    expect(delegadoResponse.body.data?.length).toBeDefined();

    // Logged with admin -> 200
    const adminResponse = await request(app).get("/team").set("Authorization", `Bearer ${adminToken}`).expect(200);
    expect(adminResponse.body.data?.length).toBeDefined();
  });

  it("GET /team/:id", async () => {
    // Not logged -> 200
    const generalResponse = await request(app).get(`/team/${createdTeamId}`).expect(200);
    expect(generalResponse.body.name).toBeDefined();

    // Logged with jugador -> 200
    const jugadorResponse = await request(app).get(`/team/${createdTeamId}`).set("Authorization", `Bearer ${jugadorToken}`).expect(200);
    expect(jugadorResponse.body.name).toBeDefined();

    // Logged with delegado -> 200
    const delegadoResponse = await request(app).get(`/team/${createdTeamId}`).set("Authorization", `Bearer ${delegadoToken}`).expect(200);
    expect(delegadoResponse.body.name).toBeDefined();

    // Logged with admin -> 200
    const adminResponse = await request(app).get(`/team/${createdTeamId}`).set("Authorization", `Bearer ${adminToken}`).expect(200);
    expect(adminResponse.body.name).toBeDefined();
  });

  it("PUT /team/id", async () => {
    const updatedData = { name: "MODIFIED" };

    // Not logged -> 401
    await request(app).put(`/team/${createdTeamId}`).send(updatedData).expect(401);

    // Logged with jugador -> 401
    await request(app).put(`/team/${createdTeamId}`).send(updatedData).set("Authorization", `Bearer ${jugadorToken}`).expect(401);

    // Logged with admin -> 200
    const adminResponse = await request(app).put(`/team/${createdTeamId}`).send(updatedData).set("Authorization", `Bearer ${adminToken}`).expect(200);
    expect(adminResponse.body.name).toBe(updatedData.name);

    const updatedData2 = { name: "MODIFIED2" };
    // Logged with delegado -> 200
    const delegadoResponse = await request(app).put(`/team/${createdTeamId}`).send(updatedData2).set("Authorization", `Bearer ${delegadoToken}`).expect(200);
    expect(delegadoResponse.body.name).toBe(updatedData2.name);
  });

  it("DELETE /user/id", async () => {
    // Not logged -> 401
    await request(app).delete(`/team/${createdTeamId}`).expect(401);

    // Logged with jugador -> 401
    await request(app).delete(`/team/${createdTeamId}`).set("Authorization", `Bearer ${jugadorToken}`).expect(401);

    // Logged with delegado -> 401
    await request(app).delete(`/team/${createdTeamId}`).set("Authorization", `Bearer ${delegadoToken}`).expect(401);

    // Logged with admin -> 200
    const adminResponse = await request(app).delete(`/team/${createdTeamId}`).set("Authorization", `Bearer ${adminToken}`).expect(200);
    expect(adminResponse.body._id).toBe(createdTeamId);
  });
});
