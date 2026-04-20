import express, { Request, Response } from "express";

const VERCEL_API = "https://api.vercel.com";
const TOKEN = process.env.VERCEL_ACCESS_TOKEN;
const PORT = Number(process.env.PORT ?? 3000);

if (!TOKEN) {
  console.error("Missing VERCEL_ACCESS_TOKEN env var.");
  process.exit(1);
}

const app = express();
app.use(express.json());

type DeploymentWebhook = {
  type: string;
  payload: { deployment: { id: string; url: string } };
};

async function vercelFetch(path: string, init: RequestInit) {
  const res = await fetch(`${VERCEL_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Vercel API ${path} failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function runTests(_previewUrl: string): Promise<"succeeded" | "failed"> {
  // Replace with your real E2E runner (Playwright, Cypress, Autonoma, etc.).
  // await runTests(previewUrl) — return "succeeded" or "failed".
  return "succeeded";
}

app.post("/webhook", async (req: Request, res: Response) => {
  const body = req.body as DeploymentWebhook;
  if (body.type !== "deployment.succeeded") {
    return res.status(200).json({ ignored: body.type });
  }

  const { id: deploymentId, url } = body.payload.deployment;
  const previewUrl = url.startsWith("http") ? url : `https://${url}`;

  const check = (await vercelFetch(`/v1/deployments/${deploymentId}/checks`, {
    method: "POST",
    body: JSON.stringify({ name: "E2E Tests", blocking: true }),
  })) as { id: string };

  res.status(202).json({ checkId: check.id });

  try {
    const conclusion = await runTests(previewUrl);
    await vercelFetch(`/v1/deployments/${deploymentId}/checks/${check.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "completed", conclusion }),
    });
    console.log(`Check ${check.id} -> ${conclusion}`);
  } catch (err) {
    await vercelFetch(`/v1/deployments/${deploymentId}/checks/${check.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "completed", conclusion: "failed" }),
    });
    console.error(`Check ${check.id} failed:`, err);
  }
});

app.listen(PORT, () => console.log(`Checks handler listening on :${PORT}`));
