const request = require("supertest");
require("dotenv").config();
const { Genres } = require("../../models/Genres");
const { User } = require("../../models/User");

let server;

describe("/api/genres", () => {
  beforeEach(async () => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genres.deleteMany({});
  });

  describe("Get /", () => {
    it("should return all genres", async () => {
      await Genres.collection.insertMany([
        { name: "Love" },
        { name: "Comedy" },
      ]);

      const res = await request(server).get("/api/genres");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "Love")).toBeTruthy();
      expect(res.body.some((g) => g.name === "Comedy")).toBeTruthy();
    });
  });

  describe("Post /", () => {
    it("should return 401 if client token not found", async () => {
      const res = await request(server)
        .post("/api/genres")
        .send({ name: "Comedy" });

      expect(res.status).toBe(401);
    });

    it("should return 400 if got validation < 5 character", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "12" });

      expect(res.status).toBe(400);
    });
    it("should return 400 if got validation > 255character", async () => {
      const token = new User().generateAuthToken();
      const name = new Array(256).join("aa");
      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: name });

      expect(res.status).toBe(400);
    });

    it("should return 200 if valid", async () => {
      const token = new User().generateAuthToken();

      await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "Ganre 1" });

      const genres = await Genres.find({ name: "Genre 1" });

      expect(genres).not.toBeNull();
    });
    it("should return genre if valid", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "Ganre 1" });

      expect(res.body).toHaveProperty("message");
    });
  });

  describe("Get/:id", () => {
    it("should return genres by id", async () => {
      const genre = new Genres({ name: "Love" });
      genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty("name", genre.name);
    });
  });

  it("should 404 if id not found", async () => {
    const res = await request(server).get("/api/genres/123");
    expect(res.status).toBe(404);
  });
});
