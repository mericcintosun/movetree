import "dotenv/config";
import express from "express";
import cors from "cors";
import { EnokiClient } from "@mysten/enoki";
import { fromB64, toB64 } from "@mysten/sui/utils";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "zklogin-jwt"],
  })
);
app.use(express.json());

const ENOKI_NETWORK = (process.env.ENOKI_NETWORK ?? "testnet") as
  | "devnet"
  | "testnet"
  | "mainnet";

console.log("🌐 Enoki Network from env:", process.env.ENOKI_NETWORK);
console.log("🌐 Final Enoki Network:", ENOKI_NETWORK);

// Validate Enoki API key format
const enokiApiKey = process.env.ENOKI_PRIVATE_KEY;
if (!enokiApiKey) {
  console.error("❌ ENOKI_PRIVATE_KEY environment variable is not set!");
  process.exit(1);
}

if (!enokiApiKey.startsWith("enoki_")) {
  console.warn(
    "⚠️ ENOKI_PRIVATE_KEY doesn't start with 'enoki_' - this might be incorrect"
  );
}

console.log("🔑 Enoki API Key format check:", {
  hasKey: !!enokiApiKey,
  startsWithEnoki: enokiApiKey.startsWith("enoki_"),
  length: enokiApiKey.length,
});

const enoki = new EnokiClient({
  apiKey: enokiApiKey,
});

app.post("/api/enoki/sponsor", async (req, res) => {
  try {
    const {
      transactionKindBytes,
      sender,
      allowedMoveCallTargets = [],
      allowedAddresses = [],
    } = req.body;

    if (!transactionKindBytes || !sender) {
      return res
        .status(400)
        .json({ error: "transactionKindBytes and sender are required" });
    }

    const zkLoginJwt = req.headers["zklogin-jwt"] as string;

    console.log(
      "🔗 Enoki API Key:",
      process.env.ENOKI_PRIVATE_KEY?.substring(0, 20) + "..."
    );
    console.log(
      "🔗 Enoki API Key length:",
      process.env.ENOKI_PRIVATE_KEY?.length
    );
    console.log(
      "🔗 Enoki API Key starts with:",
      process.env.ENOKI_PRIVATE_KEY?.substring(0, 10)
    );
    console.log("🌐 Network:", ENOKI_NETWORK);
    console.log("🔑 JWT Header:", zkLoginJwt ? "Present" : "Missing");
    console.log("📤 Request:", {
      sender,
      allowedMoveCallTargets,
      allowedAddresses,
      transactionKindBytesLength: transactionKindBytes?.length,
    });
    console.log(
      "📤 Transaction Kind Bytes (first 100 chars):",
      transactionKindBytes?.substring(0, 100)
    );

    // Validate transactionKindBytes format
    if (!transactionKindBytes) {
      return res
        .status(400)
        .json({ error: "transactionKindBytes is required" });
    }

    // Check if it's valid base64
    try {
      const decoded = Buffer.from(transactionKindBytes, "base64");
      console.log(
        "✅ Transaction Kind Bytes is valid base64, decoded length:",
        decoded.length
      );
    } catch (e) {
      console.error("❌ Transaction Kind Bytes is not valid base64:", e);
      return res
        .status(400)
        .json({ error: "transactionKindBytes must be valid base64" });
    }

    console.log("🚀 Calling Enoki API with params:", {
      network: ENOKI_NETWORK,
      transactionKindBytesLength: transactionKindBytes.length,
      sender,
      allowedMoveCallTargets,
      allowedAddresses,
    });

    // Validate allowedMoveCallTargets format
    if (allowedMoveCallTargets && allowedMoveCallTargets.length > 0) {
      console.log("🎯 Allowed Move Call Targets:", allowedMoveCallTargets);
      allowedMoveCallTargets.forEach((target, index) => {
        console.log(`  [${index}]: ${target}`);
        // Validate target format
        if (!target.includes("::")) {
          console.warn(
            `⚠️ Target ${target} doesn't contain '::' - this might be incorrect`
          );
        }
        if (!target.startsWith("0x")) {
          console.warn(
            `⚠️ Target ${target} doesn't start with '0x' - this might be incorrect`
          );
        }
      });
    } else {
      console.log("⚠️ No allowedMoveCallTargets provided");
    }

    // Normalize sender address
    const normalizedSender = sender.startsWith("0x") ? sender : `0x${sender}`;
    console.log("🔐 Original sender:", sender);
    console.log("🔐 Normalized sender:", normalizedSender);

    // Ensure allowedAddresses includes sender if not already included
    const finalAllowedAddresses =
      allowedAddresses && allowedAddresses.length > 0
        ? allowedAddresses
        : [normalizedSender];

    console.log("🔐 Final allowed addresses:", finalAllowedAddresses);

    // Try different network formats if needed
    const networkFormats = [
      ENOKI_NETWORK,
      ENOKI_NETWORK.toUpperCase(),
      ENOKI_NETWORK.toLowerCase(),
    ];
    console.log("🌐 Trying network formats:", networkFormats);

    // Try with minimal parameters first
    const sponsored = await enoki.createSponsoredTransaction({
      network: ENOKI_NETWORK,
      transactionKindBytes,
      sender: normalizedSender,
      allowedMoveCallTargets: allowedMoveCallTargets || [],
      allowedAddresses: finalAllowedAddresses,
    });

    console.log("✅ Sponsored transaction created:", sponsored.digest);
    console.log("✅ Response bytes length:", sponsored.bytes?.length);
    // bytes & digest'ı frontende gönder
    res.json({ bytesB64: sponsored.bytes, digest: sponsored.digest });
  } catch (e: any) {
    console.error("❌ Enoki API Error Details:");
    console.error("  - Error message:", e?.message);
    console.error("  - Error code:", e?.code);
    console.error("  - Error status:", e?.status);
    console.error("  - Error response:", e?.response?.data);
    console.error("  - Full error:", e);

    const errorMessage =
      e?.response?.data?.message || e?.message || "Sponsor failed";
    console.error("  - Final error message:", errorMessage);

    res.status(400).json({ error: errorMessage });
  }
});

app.post("/api/enoki/execute", async (req, res) => {
  try {
    const { digest, userSignatureB64 } = req.body;

    const exec = await enoki.executeSponsoredTransaction({
      digest,
      signature: userSignatureB64,
    });

    res.json(exec);
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Execute failed" });
  }
});

// Simple health check for load balancers and debugging
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

const PORT = Number(process.env.PORT ?? 3001);
const HOST = process.env.HOST ?? "0.0.0.0";
app.listen(PORT, HOST, () =>
  console.log(`Enoki backend listening on http://${HOST}:${PORT}`)
);
