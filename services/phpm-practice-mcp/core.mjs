const SERVER_NAME = "phpm-practice-planner";
const SERVER_VERSION = "1.3.0";
const DEFAULT_PROTOCOL_VERSION = "2025-06-18";

const SUPPORTED_PROTOCOL_VERSIONS = new Set([
  "2025-06-18",
  "2025-03-26",
  "2024-11-05"
]);

const URLS = Object.freeze({
  hub: "https://smcarthy.github.io/PHPM-SAQ-simulator-V1.0/applied-exam.html",
  support: "https://smcarthy.github.io/PHPM-SAQ-simulator-V1.0/legal/support.html",
  privacy: "https://smcarthy.github.io/PHPM-SAQ-simulator-V1.0/legal/privacy.html",
  terms: "https://smcarthy.github.io/PHPM-SAQ-simulator-V1.0/legal/terms.html",
  royal_college_format:
    "https://www.royalcollege.ca/en/eligibility-and-exams/exam-formats/public-health-and-preventive-medicine-exam-format.html"
});

const FORMAT_LABELS = Object.freeze({
  saq: "written SAQ",
  mock_oral: "mock oral",
  figure_interpretation: "figure interpretation"
});

const TRAINING_STAGES = new Set(["PGY1", "PGY2", "PGY3", "PGY4", "PGY5"]);

export const TOOLS = Object.freeze([
  {
    name: "configure_practice_session",
    title: "Configure a PHPM practice session",
    description:
      "Validate and normalize choices for a PHPM management, leadership, and program-planning practice session. Returns a reusable prompt; it does not generate or score exam content.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        format: {
          type: "string",
          enum: ["saq", "mock_oral", "figure_interpretation"],
          description: "Practice format."
        },
        topic: {
          type: "string",
          minLength: 1,
          maxLength: 120,
          description:
            "Optional management, leadership, or program-planning focus."
        },
        training_stage: {
          type: "string",
          enum: ["PGY1", "PGY2", "PGY3", "PGY4", "PGY5"],
          description: "Resident training stage; defaults to PGY5."
        },
        question_count: {
          type: "integer",
          minimum: 4,
          maximum: 5,
          description:
            "Number of questions for SAQ or mock oral practice; defaults to 5."
        },
        region: {
          type: "string",
          minLength: 1,
          maxLength: 120,
          description: "Optional Canadian province, territory, or setting."
        },
        roleplay: {
          type: "boolean",
          description: "Whether a mock oral should include roleplay."
        }
      },
      required: ["format"]
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    }
  },
  {
    name: "get_phpm_resource_links",
    title: "Get verified PHPM resource links",
    description:
      "Return the PHPM Exam Hub, support, privacy, terms, and official Royal College PHPM examination-format links.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {}
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    }
  }
]);

function response(id, result) {
  return { jsonrpc: "2.0", id, result };
}

export function errorResponse(id, code, message, data) {
  const error = { code, message };
  if (data !== undefined) error.data = data;
  return { jsonrpc: "2.0", id, error };
}

function toolError(message) {
  return {
    isError: true,
    content: [{ type: "text", text: message }]
  };
}

function optionalText(value, field) {
  if (value === undefined) return undefined;
  if (typeof value !== "string") {
    throw new TypeError(`${field} must be a string.`);
  }
  const normalized = value.trim().replace(/\s+/g, " ");
  if (!normalized) throw new TypeError(`${field} must not be empty.`);
  if (normalized.length > 120) {
    throw new TypeError(`${field} must be 120 characters or fewer.`);
  }
  return normalized;
}

function configurePracticeSession(args) {
  if (!args || typeof args !== "object" || Array.isArray(args)) {
    return toolError("Arguments must be an object.");
  }

  const format = args.format;
  if (typeof format !== "string" || !FORMAT_LABELS[format]) {
    return toolError(
      "format must be one of: saq, mock_oral, figure_interpretation."
    );
  }

  let topic;
  let region;
  try {
    topic =
      optionalText(args.topic, "topic") ??
      "Management, Leadership and Program Planning";
    region = optionalText(args.region, "region");
  } catch (error) {
    return toolError(error.message);
  }

  const trainingStage = args.training_stage ?? "PGY5";
  if (!TRAINING_STAGES.has(trainingStage)) {
    return toolError("training_stage must be one of PGY1, PGY2, PGY3, PGY4, PGY5.");
  }

  const requestedCount = args.question_count ?? 5;
  if (!Number.isInteger(requestedCount) || requestedCount < 4 || requestedCount > 5) {
    return toolError("question_count must be the integer 4 or 5.");
  }

  if (args.roleplay !== undefined && typeof args.roleplay !== "boolean") {
    return toolError("roleplay must be true or false.");
  }

  const questionCount = format === "figure_interpretation" ? 1 : requestedCount;
  const roleplay = format === "mock_oral" ? Boolean(args.roleplay) : false;
  const label = FORMAT_LABELS[format];
  const promptParts = [
    format === "figure_interpretation"
      ? `Begin a ${label} exercise focused on ${topic}.`
      : `Begin a ${questionCount}-question ${label} exercise focused on ${topic}.`,
    `The resident is ${trainingStage}; retain the strong PGY5 examination benchmark.`
  ];
  if (region) promptParts.push(`Use a Canadian setting relevant to ${region}.`);
  if (format === "mock_oral") {
    promptParts.push(roleplay ? "Include roleplay." : "Do not require roleplay.");
  }

  const configuration = {
    format,
    topic,
    training_stage: trainingStage,
    question_count: questionCount,
    region: region ?? null,
    roleplay,
    prompt: promptParts.join(" "),
    hub_url: URLS.hub
  };

  return {
    content: [
      {
        type: "text",
        text: `${configuration.prompt}\n\nPHPM Exam Hub: ${URLS.hub}`
      }
    ],
    structuredContent: configuration
  };
}

function resourceLinks() {
  return {
    content: [
      {
        type: "text",
        text: [
          `PHPM Exam Hub: ${URLS.hub}`,
          `Support: ${URLS.support}`,
          `Privacy Policy: ${URLS.privacy}`,
          `Terms of Service: ${URLS.terms}`,
          `Royal College PHPM exam format: ${URLS.royal_college_format}`
        ].join("\n")
      }
    ],
    structuredContent: URLS
  };
}

export function handleRequest(message) {
  if (!message || typeof message !== "object" || Array.isArray(message)) {
    return errorResponse(null, -32600, "Invalid Request");
  }

  const id = Object.hasOwn(message, "id") ? message.id : undefined;
  const method = message.method;
  if (message.jsonrpc !== "2.0" || typeof method !== "string") {
    return id === undefined
      ? undefined
      : errorResponse(id, -32600, "Invalid Request");
  }

  if (method.startsWith("notifications/")) return undefined;
  if (id === undefined) return undefined;

  switch (method) {
    case "initialize": {
      const requestedVersion = message.params?.protocolVersion;
      const protocolVersion = SUPPORTED_PROTOCOL_VERSIONS.has(requestedVersion)
        ? requestedVersion
        : DEFAULT_PROTOCOL_VERSION;
      return response(id, {
        protocolVersion,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
        instructions:
          "Use the read-only planner to configure PHPM management, leadership, and program-planning practice. The instruction skill generates and evaluates the educational exercise."
      });
    }
    case "ping":
      return response(id, {});
    case "tools/list":
      return response(id, { tools: TOOLS });
    case "tools/call": {
      const toolName = message.params?.name;
      const args = message.params?.arguments ?? {};
      if (toolName === "configure_practice_session") {
        return response(id, configurePracticeSession(args));
      }
      if (toolName === "get_phpm_resource_links") {
        return response(id, resourceLinks());
      }
      return response(id, toolError(`Unknown tool: ${String(toolName)}`));
    }
    default:
      return errorResponse(id, -32601, "Method not found", { method });
  }
}

export function handlePayload(payload) {
  if (Array.isArray(payload)) {
    if (payload.length === 0) {
      return errorResponse(null, -32600, "Invalid Request");
    }
    const replies = payload.map(handleRequest).filter(Boolean);
    return replies.length ? replies : undefined;
  }

  return handleRequest(payload);
}
