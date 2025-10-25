import "dotenv/config";
import express from "express";
import cors from "cors";
import { z } from "zod";
import { EnokiClient } from "@mysten/enoki";
import { fromB64, toB64 } from "@mysten/sui/utils";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const enoki = new EnokiClient({
  apiKey: process.env.ENOKI_PRIVATE_KEY!, // Private key -> backend
});

const ENOKI_NETWORK = process.env.ENOKI_NETWORK || "testnet";

const SponsorBody = z.object({
  txBytesB64: z.string(),
  sender: z.string().optional(),
  allowedMoveCallTargets: z.array(z.string()).optional(),
  allowedAddresses: z.array(z.string()).optional(),
});

const ExecuteBody = z.object({
  digest: z.string(),
  signatureB64: z.string(),
});

app.post("/sponsor", async (req, res) => {
  try {
    const {
      txBytesB64,
      sender,
      allowedMoveCallTargets = [],
      allowedAddresses = [],
    } = SponsorBody.parse(req.body);

    const sponsored = await enoki.createSponsoredTransaction({
      network: ENOKI_NETWORK,
      transactionKindBytes: txBytesB64,
      sender,
      allowedMoveCallTargets,
      allowedAddresses,
    });

    res.json(sponsored);
  } catch (e: any) {
    console.error("Sponsor error:", e);
    res.status(400).json({ error: e?.message ?? "sponsor failed" });
  }
});

app.post("/execute", async (req, res) => {
  try {
    const { digest, signatureB64 } = ExecuteBody.parse(req.body);

    const resp = await enoki.executeSponsoredTransaction({
      digest,
      signature: fromB64(signatureB64),
    });

    res.json(resp);
  } catch (e: any) {
    console.error("Execute error:", e);
    res.status(400).json({ error: e?.message ?? "execute failed" });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`[api] listening on http://localhost:${port}`);
  console.log(`[api] Enoki network: ${ENOKI_NETWORK}`);
  console.log(
    `[api] API Key: ${process.env.ENOKI_PRIVATE_KEY ? "✅ Set" : "❌ Missing"}`
  );
});
