// test/test_utils.js

const LAMBDA_URL = process.env.LAMBDA_URL;

if (!LAMBDA_URL) {
  throw new Error("Missing LAMBDA_URL environment variable");
}

// Remove undefined values recursively
const stripUndefined = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  const clean = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) clean[k] = stripUndefined(v);
  }
  return clean;
};

export const call = async (action, payload, auth = null) => {
  const body = stripUndefined({ action, payload, auth });

  const res = await fetch(LAMBDA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const json = await res.json();

  if (!res.ok || json.error) {
    console.error("❌ Action failed:", action, json.error);
    throw new Error(json.error || "Lambda error");
  }

  return json;
};
