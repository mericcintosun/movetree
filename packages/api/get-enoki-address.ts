import { EnokiClient } from "@mysten/enoki";
import "dotenv/config";

const enoki = new EnokiClient({
  apiKey: process.env.ENOKI_PRIVATE_KEY!,
});

// Enoki sponsorship wallet address'ini almak için
console.log("Enoki API Key:", process.env.ENOKI_PRIVATE_KEY);
console.log("Enoki Network:", process.env.ENOKI_NETWORK);
console.log("\nNot: Enoki'nin kendi sponsorship sistemi var.");
console.log("Portal: https://portal.enoki.mystenlabs.com/");
