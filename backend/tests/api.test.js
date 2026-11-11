import assert from "node:assert/strict";
import { once } from "node:events";
import { test } from "node:test";
import app from "../src/app.js";

test("Kampüs API REST sözleşmesi", async (t) => {
  const server = app.listen(0, "127.0.0.1");
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));
  await once(server, "listening");

  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  function post(body) {
    return fetch(`${baseUrl}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
  }

  await t.test("GET /health → 200 ve öğrenci numarası", async () => {
    const response = await fetch(`${baseUrl}/health`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /^application\/json/);
    assert.equal(response.headers.get("access-control-allow-origin"), "*");
    const { status, time, student } = await response.json();
    assert.equal(status, "ok");
    assert.equal(student, "2321032005");
    assert.equal(new Date(time).toISOString(), time);
  });

  await t.test("GET /events → 200 ve altı başlangıç kaydı", async () => {
    const response = await fetch(`${baseUrl}/events`);
    assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).map(({ id }) => id), [
      "event-1", "event-2", "event-3", "event-4", "event-5", "event-6",
    ]);
  });

  await t.test("GET /events kategoriye göre filtreler", async () => {
    const category = encodeURIComponent("Atölye");
    const response = await fetch(`${baseUrl}/events?category=${category}`);
    assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).map(({ id }) => id), ["event-2", "event-5"]);

    const noMatch = await fetch(`${baseUrl}/events?category=Konser`);
    assert.equal(noMatch.status, 200);
    assert.deepEqual(await noMatch.json(), []);
  });

  await t.test("GET /events/event-2 → 200 ve doğru kayıt", async () => {
    const response = await fetch(`${baseUrl}/events/event-2`);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).id, "event-2");
  });

  await t.test("GET /events/yok → 404 ve JSON hata", async () => {
    const response = await fetch(`${baseUrl}/events/yok`);
    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { error: { message: "Event not found" } });
  });

  await t.test("POST /events → 201 ve listede okunabilen yeni kayıt", async () => {
    const input = {
      title: "API İstemcisi Atölyesi",
      category: "Atölye",
      date: "2026-12-12",
      capacity: 16,
      time: "14:00",
      location: "B-204",
      description: "Bir REST API istemcisi geliştirme çalışması.",
    };
    const response = await post(JSON.stringify(input));
    assert.equal(response.status, 201);
    const { id, ...fields } = await response.json();
    assert.match(id, /^event-/);
    assert.deepEqual(fields, input);
    assert.equal(response.headers.get("location"), `/events/${id}`);

    const detail = await fetch(`${baseUrl}/events/${id}`);
    assert.equal(detail.status, 200);
    assert.deepEqual(await detail.json(), { id, ...input });

    const list = await fetch(`${baseUrl}/events`);
    assert.equal(list.status, 200);
    assert.equal((await list.json()).length, 7);
  });

  await t.test("POST /events → eksik alanlar ve bozuk JSON için 400", async () => {
    const missing = await post(JSON.stringify({ title: "Eksik etkinlik" }));
    assert.equal(missing.status, 400);
    assert.deepEqual(await missing.json(), {
      error: { message: "title, category and date are required" },
    });

    const invalid = await post('{"title":');
    assert.equal(invalid.status, 400);
    assert.deepEqual(await invalid.json(), { error: { message: "Invalid JSON body" } });

    const list = await fetch(`${baseUrl}/events`);
    assert.equal(list.status, 200);
    assert.equal((await list.json()).length, 7);
  });

  await t.test("POST /events zorunlu alanlarla varsayılan değerleri kullanır", async () => {
    const response = await post(JSON.stringify({
      title: "Kampüste Açık Kaynak",
      category: "Seminer",
      date: "2026-12-14",
    }));
    assert.equal(response.status, 201);
    const { capacity, time, location, description } = await response.json();
    assert.deepEqual({ capacity, time, location, description }, {
      capacity: 0, time: "", location: "", description: "",
    });
  });
});
