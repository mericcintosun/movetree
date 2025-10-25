#!/usr/bin/env tsx

/**
 * SuiNS Linker Script
 *
 * This script demonstrates how to link a Walrus site to a SuiNS domain
 * using the SuiNS SDK for domain management.
 */

import { SuiClient } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";

interface SuiNSConfig {
  network: "testnet" | "mainnet";
  packageId: string;
  registryId: string;
  reverseRegistryId: string;
}

interface DomainLink {
  domain: string;
  siteUrl: string;
  owner: string;
}

class SuiNSLinker {
  private client: SuiClient;
  private keypair: Ed25519Keypair;
  private config: SuiNSConfig;

  constructor(rpcUrl: string, privateKey: string, config: SuiNSConfig) {
    this.client = new SuiClient({ url: rpcUrl });
    this.keypair = Ed25519Keypair.fromSecretKey(privateKey);
    this.config = config;
  }

  /**
   * Link a Walrus site to a SuiNS domain
   */
  async linkSiteToDomain(domain: string, siteUrl: string): Promise<string> {
    console.log(`🔗 Linking domain ${domain} to site ${siteUrl}`);

    try {
      // Create transaction to set domain record
      const txb = new TransactionBlock();

      // Set the domain record pointing to the Walrus site
      txb.moveCall({
        target: `${this.config.packageId}::domain::set_record`,
        arguments: [
          txb.object(this.config.registryId),
          txb.pure.string(domain),
          txb.pure.string("walrus_site"),
          txb.pure.string(siteUrl),
        ],
      });

      // Execute transaction
      const result = await this.client.signAndExecuteTransactionBlock({
        transactionBlock: txb,
        signer: this.keypair,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      console.log(`✅ Domain ${domain} linked successfully`);
      console.log(`📋 Transaction: ${result.digest}`);

      return result.digest;
    } catch (error) {
      console.error(`❌ Failed to link domain ${domain}:`, error);
      throw error;
    }
  }

  /**
   * Get domain information
   */
  async getDomainInfo(domain: string): Promise<DomainLink | null> {
    try {
      const domainObject = await this.client.getObject({
        id: `${this.config.registryId}::${domain}`,
        options: { showContent: true },
      });

      if (domainObject.data?.content && "fields" in domainObject.data.content) {
        const fields = domainObject.data.content.fields as any;
        return {
          domain,
          siteUrl: fields.walrus_site || "",
          owner: fields.owner || "",
        };
      }

      return null;
    } catch (error) {
      console.error(`❌ Failed to get domain info for ${domain}:`, error);
      return null;
    }
  }

  /**
   * List all domains owned by the current keypair
   */
  async listOwnedDomains(): Promise<string[]> {
    try {
      const address = this.keypair.getPublicKey().toSuiAddress();
      const objects = await this.client.getOwnedObjects({
        owner: address,
        filter: {
          StructType: `${this.config.packageId}::domain::Domain`,
        },
      });

      return objects.data.map((obj) => obj.data?.objectId || "");
    } catch (error) {
      console.error("❌ Failed to list owned domains:", error);
      return [];
    }
  }

  /**
   * Create a sample domain link for testing
   */
  async createSampleLink(): Promise<void> {
    const sampleDomain = "movetree-test";
    const sampleSiteUrl = "https://movetree-test.walrus.gg";

    try {
      console.log("🧪 Creating sample domain link...");

      // Check if domain already exists
      const existingInfo = await this.getDomainInfo(sampleDomain);
      if (existingInfo) {
        console.log(
          `ℹ️  Domain ${sampleDomain} already exists: ${existingInfo.siteUrl}`
        );
        return;
      }

      // Create the link
      const txDigest = await this.linkSiteToDomain(sampleDomain, sampleSiteUrl);

      console.log("🎉 Sample link created successfully!");
      console.log(`📋 Transaction: ${txDigest}`);
      console.log(`🌐 Domain: ${sampleDomain}.sui`);
      console.log(`🔗 Site: ${sampleSiteUrl}`);
    } catch (error) {
      console.error("❌ Failed to create sample link:", error);
    }
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "sample";

  // Configuration - these would typically come from environment variables
  const rpcUrl =
    process.env.SUI_RPC_URL || "https://fullnode.testnet.sui.io:443";
  const privateKey = process.env.SUI_PRIVATE_KEY || "";

  if (!privateKey) {
    console.error("❌ SUI_PRIVATE_KEY environment variable is required");
    process.exit(1);
  }

  const config: SuiNSConfig = {
    network: "testnet",
    packageId: "0x2", // SuiNS package ID on testnet
    registryId: "0x1", // Registry object ID
    reverseRegistryId: "0x1", // Reverse registry object ID
  };

  const linker = new SuiNSLinker(rpcUrl, privateKey, config);

  switch (command) {
    case "sample":
      await linker.createSampleLink();
      break;

    case "link":
      const domain = args[1];
      const siteUrl = args[2];
      if (!domain || !siteUrl) {
        console.error("❌ Usage: link <domain> <site-url>");
        process.exit(1);
      }
      await linker.linkSiteToDomain(domain, siteUrl);
      break;

    case "info":
      const infoDomain = args[1];
      if (!infoDomain) {
        console.error("❌ Usage: info <domain>");
        process.exit(1);
      }
      const info = await linker.getDomainInfo(infoDomain);
      if (info) {
        console.log("📋 Domain Info:", info);
      } else {
        console.log("❌ Domain not found");
      }
      break;

    case "list":
      const domains = await linker.listOwnedDomains();
      console.log("📋 Owned Domains:", domains);
      break;

    default:
      console.log("Available commands:");
      console.log("  sample  - Create a sample domain link");
      console.log("  link    - Link domain to site");
      console.log("  info    - Get domain information");
      console.log("  list    - List owned domains");
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { SuiNSLinker };
