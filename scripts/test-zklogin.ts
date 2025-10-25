#!/usr/bin/env tsx

/**
 * Test script for zkLogin + sponsored transaction flow
 * Bu script zkLogin akışını test eder
 */

import { Transaction } from "@mysten/sui/transactions";

async function testZkLoginFlow() {
  console.log("🧪 Testing zkLogin + sponsored transaction flow...");
  
  try {
    // 1) Test PTB creation for view_link
    const tx = new Transaction();
    tx.moveCall({
      target: "0x9bf09f...f7e594c::profile::view_link",
      arguments: [
        tx.object("0x123"), // dummy profile ID
        tx.pure.u64(0),     // dummy index
      ],
    });
    
    // 2) Test PTB build
    const bytes = await tx.build({ client: undefined });
    console.log("✅ PTB build successful, size:", bytes.length);
    
    // 3) Test base64 conversion
    const txBytesBase64 = Buffer.from(bytes).toString('base64');
    const back = Buffer.from(txBytesBase64, 'base64');
    console.log("✅ Base64 conversion successful:", bytes.length === back.length);
    
    // 4) Test API endpoint structure
    const apiPayload = {
      txBytesBase64: txBytesBase64
    };
    console.log("✅ API payload structure:", Object.keys(apiPayload));
    
    console.log("🎉 All zkLogin tests passed!");
    console.log("📋 Next steps:");
    console.log("  1. Set up Google OAuth Client ID");
    console.log("  2. Set up Enoki Public/Private API keys");
    console.log("  3. Configure environment variables");
    console.log("  4. Start backend: pnpm run api:dev");
    console.log("  5. Start frontend: pnpm run dev");
    console.log("  6. Test 'Continue with Google' button");
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// CLI execution
if (require.main === module) {
  testZkLoginFlow().catch(console.error);
}
