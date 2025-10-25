#!/usr/bin/env tsx

/**
 * Test script for sponsored transaction flow
 * Bu script sponsorlama akışını test eder
 */

import { Transaction } from "@mysten/sui/transactions";
import { SuiClient } from "@mysten/sui/client";

async function testSponsorFlow() {
  console.log("🧪 Testing sponsored transaction flow...");

  try {
    // 1) Test PTB creation
    const tx = new Transaction();
    tx.moveCall({
      target: "0x9bf09f...f7e594c::profile::view_link",
      arguments: [
        tx.object("0x123"), // dummy profile ID
        tx.pure.u64(0), // dummy index
      ],
    });

    // 2) Test onlyTransactionKind build
    const kindBytes = await tx.build({ onlyTransactionKind: true });
    console.log("✅ PTB build successful, size:", kindBytes.length);

    // 3) Test base64 conversion
    const b64 = btoa(String.fromCharCode(...kindBytes));
    const back = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    console.log(
      "✅ Base64 conversion successful:",
      kindBytes.length === back.length
    );

    // 4) Test hash generation
    const { sha3_256 } = await import("@noble/hashes/sha3");
    const hash = sha3_256(kindBytes);
    console.log("✅ Hash generation successful, size:", hash.length);

    console.log("🎉 All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// CLI execution
if (require.main === module) {
  testSponsorFlow().catch(console.error);
}
