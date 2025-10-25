import "dotenv/config";
import express from "express";
import cors from "cors";
import { EnokiClient } from "@mysten/enoki";
import { fromB64, toB64 } from "@mysten/sui/utils";

const app = express();
app.use(cors());
app.use(express.json());

const ENOKI_NETWORK = (process.env.ENOKI_NETWORK ?? "testnet") as
  | "devnet"
  | "testnet"
  | "mainnet";

const enoki = new EnokiClient({
  apiKey: process.env.ENOKI_PRIVATE_KEY!,
  network: ENOKI_NETWORK,
});

app.post("/api/enoki/sponsor", async (req, res) => {
  try {
    const {
      transactionBlockKindBytesB64,
      sender,
      allowedMoveCallTargets,
      allowedAddresses,
      zkLoginJwt,
    } = req.body;

    console.log(
      "🔗 Enoki API Key:",
      process.env.ENOKI_PRIVATE_KEY?.substring(0, 20) + "..."
    );
    console.log("🌐 Network:", ENOKI_NETWORK);
    console.log("📤 Request:", {
      sender,
      allowedMoveCallTargets,
      allowedAddresses,
    });

    const sponsored = await enoki.createSponsoredTransaction({
      network: ENOKI_NETWORK,
      transactionBlockKindBytes: transactionBlockKindBytesB64,
      sender,
      allowedMoveCallTargets, // örn: [`${PKG_ID}::profile::create_profile`]
      allowedAddresses, // varsa alıcı adresleri
      headers: zkLoginJwt ? { "zklogin-jwt": zkLoginJwt } : undefined,
    });

    console.log("✅ Sponsored transaction created:", sponsored.digest);
    // bytes & digest'ı frontende gönder
    res.json({ bytesB64: sponsored.bytes, digest: sponsored.digest });
  } catch (e: any) {
    console.error("❌ Enoki API Error:", e.message);
    res.status(400).json({ error: e.message });
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
    res.status(400).json({ error: e.message });
  }
});

app.listen(process.env.PORT ?? 3001, () =>
  console.log(`Enoki backend listening on :${process.env.PORT ?? 3001}`)
);
