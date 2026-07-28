import { describe, it } from "node:test";
import assert from "node:assert";
import request from "supertest";
import app from "../api/server.mjs";

const ORIGIN = "https://andrewford.co.nz";

describe("POST /api/chatrag", () => {
  it("should return 400 for missing question", async () => {
    const response = await request(app)
      .post("/api/chatrag")
      .set("Origin", ORIGIN)
      .send({});

    assert.strictEqual(response.status, 400);
    assert.strictEqual(response.body.error, "Question is required");
  });

  it("should return 400 for a question that is too short", async () => {
    const response = await request(app)
      .post("/api/chatrag")
      .set("Origin", ORIGIN)
      .send({ question: "Hi" });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(
      response.body.error,
      "Question must be at least 10 characters long",
    );
  });

  it("should return 400 for a question that is too long", async () => {
    const response = await request(app)
      .post("/api/chatrag")
      .set("Origin", ORIGIN)
      .send({ question: "a".repeat(501) });

    assert.strictEqual(response.status, 400);
    assert.strictEqual(
      response.body.error,
      "Question must be no more than 500 characters long",
    );
  });

  it("should include CORS headers on the response", async () => {
    const response = await request(app)
      .post("/api/chatrag")
      .set("Origin", ORIGIN)
      .send({ question: "Hi" });

    assert.strictEqual(response.headers["access-control-allow-origin"], ORIGIN);
  });
});
