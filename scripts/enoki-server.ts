#!/usr/bin/env tsx

/**
 * Enoki Sponsored Transaction Backend Server
 *
 * Bu server Enoki'nin PRIVATE API key'ini kullanarak
 * sponsored transaction'ları güvenli şekilde yönetir.
 * Frontend'te PRIVATE key tutulmaz - sadece backend'te.
 */

import express from "express";
import cors from "cors";
import { EnokiClient } from "@mysten/enoki";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Enoki client - PRIVATE key sadece backend'te
const enoki = new EnokiClient({
  apiKey: process.env.ENOKI_API_KEY!, // PRIVATE KEY
  network: (process.env.ENOKI_NETWORK as "testnet" | "mainnet") || "testnet",
});

// 1) Sadece PTB'nin "onlyTransactionKind" bytes'ını alır, sponsorlu tx hazırlar
app.post("/api/enoki/sponsor", async (req, res) => {
  try {
    const { kindBytesBase64, sender, allowedMoveCallTargets } = req.body as {
      kindBytesBase64: string;
      sender?: string;
      allowedMoveCallTargets?: string[]; // Örn: ["<pkg>::profile::view_link"]
    };

    const kindBytes = Uint8Array.from(atob(kindBytesBase64), (c) =>
      c.charCodeAt(0)
    );

    const out = await enoki.createSponsoredTransaction({
      transactionKindBytes: kindBytes,
      sender, // sender UI'dan gelecek (wallet/zkLogin)
      allowedMoveCallTargets, // güvenlik: sadece izinli fonksiyonlar
    });

    // out.bytes: imzalanacak tx bytes, out.digest: tx digest
    res.json({
      bytesBase64: btoa(String.fromCharCode(...out.bytes)),
      digest: out.digest,
    });
  } catch (e: any) {
    console.error("Sponsor error:", e);
    res.status(500).json({ error: e?.message || "sponsor failed" });
  }
});

// 2) Kullanıcı imzasını alır, finalize eder
app.post("/api/enoki/execute", async (req, res) => {
  try {
    const { digest, userSignatureBase64 } = req.body as {
      digest: string;
      userSignatureBase64: string; // wallet/zkLogin imzası
    };

    const sig = Uint8Array.from(atob(userSignatureBase64), (c) =>
      c.charCodeAt(0)
    );

    const execOut = await enoki.executeSponsoredTransaction({
      digest,
      signature: sig,
    });

    res.json(execOut);
  } catch (e: any) {
    console.error("Execute error:", e);
    res.status(500).json({ error: e?.message || "execute failed" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const port = process.env.PORT ? Number(process.env.PORT) : 8787;
app.listen(port, () => {
  console.log(`🚀 Enoki sponsor server running on :${port}`);
  console.log(`📡 Network: ${process.env.ENOKI_NETWORK || "testnet"}`);
  console.log(
    `🔑 API Key: ${process.env.ENOKI_API_KEY ? "✅ Set" : "❌ Missing"}`
  );
});
