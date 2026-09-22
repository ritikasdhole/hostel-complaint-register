const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");

const app = require("../app");

let server;
let baseUrl;

beforeEach(() => {
  server = app.listen(0);

  const port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}`;
});

test("health route returns ok", async () => {
  const response = await fetch(`${baseUrl}/health`);

  assert.equal(response.status, 200);

  const data = await response.json();

  assert.equal(data.status, "ok");

  server.close();
});

test("valid complaint can be submitted", async () => {
  const response = await fetch(`${baseUrl}/complaints`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      studentName: "Test Student",
      roomNumber: "B-202",
      category: "Plumbing",
      description: "Bathroom tap is leaking",
    }),
    redirect: "manual",
  });

  assert.equal(response.status, 201);

  server.close();
});

test("invalid complaint is rejected", async () => {
  const response = await fetch(`${baseUrl}/complaints`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      studentName: "",
      roomNumber: "B-202",
      category: "Plumbing",
      description: "",
    }),
  });

  assert.equal(response.status, 400);

  server.close();
});

test("existing complaint can be resolved", async () => {
  const response = await fetch(`${baseUrl}/complaints/1/resolve`, {
    method: "POST",
    redirect: "manual",
  });

  assert.equal(response.status, 302);
  server.close();
});

test("non-existent complaint cannot be resolved", async () => {
  const response = await fetch(`${baseUrl}/complaints/99999/resolve`, {
    method: "POST",
  });

  assert.equal(response.status, 404);

  server.close();
});