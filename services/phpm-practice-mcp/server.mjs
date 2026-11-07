import http from "node:http";
import { pathToFileURL } from "node:url";

import { errorResponse, handlePayload } from "./core.mjs";

const MAX_BODY_BYTES = 64 * 1024;

function setCommonHeaders(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, MCP-Protocol-Version");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("X-Content-Type-Options", "nosniff");
}

function sendJson(response, statusCode, payload) {
  setCommonHeaders(response);
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(`${JSON.stringify(payload)}\n`);
}

function sendEmpty(response, statusCode, extraHeaders = {}) {
  setCommonHeaders(response);
  response.writeHead(statusCode, extraHeaders);
  response.end();
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    let size = 0;
    let tooLarge = false;

    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      size += Buffer.byteLength(chunk);
      if (size > MAX_BODY_BYTES) {
        tooLarge = true;
        body = "";
        return;
      }
      if (!tooLarge) body += chunk;
    });
    request.on("end", () => {
      if (tooLarge) {
        const error = new Error("Request body exceeds 64 KiB.");
        error.code = "BODY_TOO_LARGE";
        reject(error);
        return;
      }
      resolve(body);
    });
    request.on("error", reject);
  });
}
export function createMcpServer() {
  return http.createServer(async (request, response) => {
    const requestUrl = new URL(request.url ?? "/", "http://localhost");

    if (request.method === "GET" && requestUrl.pathname === "/health") {
      sendJson(response, 200, {
        status: "ok",
        service: "phpm-practice-planner",
        version: "1.3.0"
      });
      return;
    }

    if (requestUrl.pathname !== "/mcp") {
      sendJson(response, 404, { error: "Not found" });
      return;
    }

    if (request.method === "OPTIONS") {
      sendEmpty(response, 204);
      return;
    }

    if (request.method !== "POST") {
      sendEmpty(response, 405, { Allow: "POST, OPTIONS" });
      return;
    }

    const contentType = request.headers["content-type"] ?? "";
    if (!contentType.toLowerCase().startsWith("application/json")) {
      sendJson(response, 415, {
        error: "Content-Type must be application/json."
      });
      return;
    }

    let body;
    try {
      body = await readBody(request);
    } catch (error) {
      if (error.code === "BODY_TOO_LARGE") {
        sendJson(response, 413, { error: error.message });
        return;
      }
      sendJson(response, 400, { error: "Unable to read request body." });
      return;
    }

    let payload;
    try {
      payload = JSON.parse(body);
    } catch (error) {
      sendJson(
        response,
        400,
        errorResponse(null, -32700, "Parse error", { message: error.message })
      );
      return;
    }

    const reply = handlePayload(payload);
    if (reply === undefined) {
      sendEmpty(response, 202);
      return;
    }

    sendJson(response, 200, reply);
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number.parseInt(process.env.PORT ?? "3000", 10);
  const server = createMcpServer();
  server.listen(port, "0.0.0.0", () => {
    process.stdout.write(`PHPM practice MCP listening on port ${port}\n`);
  });
}
