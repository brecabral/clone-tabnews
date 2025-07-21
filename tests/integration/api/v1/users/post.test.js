import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "usuario1",
          email: "u1@email.com",
          password: "senha",
        }),
      });
      expect(response.status).toBe(201);

      const respondeBody = await response.json();
      expect(respondeBody).toEqual({
        id: respondeBody.id,
        username: "usuario1",
        email: "u1@email.com",
        password: "senha",
        created_at: respondeBody.created_at,
        update_at: respondeBody.update_at,
      });

      expect(uuidVersion(respondeBody.id)).toBe(4);
      expect(Date.parse(respondeBody.created_at)).not.toBeNaN();
      expect(Date.parse(respondeBody.update_at)).not.toBeNaN();
    });
    test("With duplicated 'email'", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado1",
          email: "duplicado@email.com",
          password: "senha",
        }),
      });
      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado2",
          email: "Duplicado@email.com",
          password: "senha",
        }),
      });
      expect(response2.status).toBe(400);

      const responde2Body = await response2.json();

      expect(responde2Body).toEqual({
        name: "ValidationError",
        message: "O email informado já esta em uso.",
        action: "Use outro email.",
        status_code: 400,
      });
    });
    test("With duplicated 'username'", async () => {
      const response1 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "usernameduplicado",
          email: "usernameduplicado1@email.com",
          password: "senha",
        }),
      });
      expect(response1.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Usernameduplicado",
          email: "usernameduplicado2@email.com",
          password: "senha",
        }),
      });
      expect(response2.status).toBe(400);

      const responde2Body = await response2.json();

      expect(responde2Body).toEqual({
        name: "ValidationError",
        message: "O usuário informado já esta em uso.",
        action: "Use outro usuário.",
        status_code: 400,
      });
    });
  });
});
