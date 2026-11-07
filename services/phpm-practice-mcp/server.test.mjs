import assert from "node:assert/strict";
import { once } from "node:events";
import test from "node:test";

import { createMcpServer } from "./server.mjs";

async function withServer(run) {
  const server = createMcpServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    server.close();
    await once(server, "close");
  }
}

async function postJson(baseUrl, payload) {
  return fetch(`${baseUrl}/mcp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

test("health endpoint identifies the service", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      status: "ok",
      service: "phpm-practice-planner",
      version: "1.3.0"
    });
  });
});
test("initialize negotiates a supported MCP version", async () => {
  await withServer(async (baseUrl) => {
    const response = await postJson(baseUrl, {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2025-03-26", capabilities: {} }
    });
    const payload = await response.json();
    assert.equal(response.status, 200);
    assert.equal(payload.result.protocolVersion, "2025-03-26");
    assert.equal(payload.result.serverInfo.name, "phpm-practice-planner");
    assert.deepEqual(payload.result.capabilities, {
      tools: { listChanged: false }
    });
  });
});

test("tools/list exposes the two read-only tools", async () => {
  await withServer(async (baseUrl) => {
    const response = await postJson(baseUrl, {
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
      params: {}
    });
    const payload = await response.json();
    assert.deepEqual(
      payload.result.tools.map((tool) => tool.name),
      ["configure_practice_session", "get_phpm_resource_links"]
    );
    assert.ok(
      payload.result.tools.every((tool) => tool.annotations.readOnlyHint === true)
    );
  });
});

test("configure_practice_session normalizes a valid request", async () => {
  await withServer(async (baseUrl) => {
    const response = await postJson(baseUrl, {
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "configure_practice_session",
        arguments: {
          format: "mock_oral",
          topic: "  change   management ",
          training_stage: "PGY4",
          question_count: 4,
          region: "Ontario",
          roleplay: true
        }
      }
    });
    const payload = await response.json();
    assert.equal(payload.result.isError, undefined);
    assert.equal(payload.result.structuredContent.topic, "change management");
    assert.equal(payload.result.structuredContent.question_count, 4);
    assert.equal(payload.result.structuredContent.roleplay, true);
    assert.match(payload.result.structuredContent.prompt, /Ontario/);
  });
});

test("configure_practice_session returns a tool error for invalid input", async () => {
  await withServer(async (baseUrl) => {
    const response = await postJson(baseUrl, {
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: {
        name: "configure_practice_session",
        arguments: { format: "essay" }
      }
    });
    const payload = await response.json();
    assert.equal(payload.result.isError, true);
    assert.match(payload.result.content[0].text, /format must be one of/);
  });
});

test("notifications return an empty accepted response", async () => {
  await withServer(async (baseUrl) => {
    const response = await postJson(baseUrl, {
      jsonrpc: "2.0",
      method: "notifications/initialized"
    });
    assert.equal(response.status, 202);
    assert.equal(await response.text(), "");
  });
});

test("transport rejects unsupported methods, media types, and large bodies", async () => {
  await withServer(async (baseUrl) => {
    const getResponse = await fetch(`${baseUrl}/mcp`);
    assert.equal(getResponse.status, 405);
    assert.equal(getResponse.headers.get("allow"), "POST, OPTIONS");

    const textResponse = await fetch(`${baseUrl}/mcp`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "{}"
    });
    assert.equal(textResponse.status, 415);

    const largeResponse = await fetch(`${baseUrl}/mcp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: "x".repeat(70 * 1024) })
    });
    assert.equal(largeResponse.status, 413);
  });
});
