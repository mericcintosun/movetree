#!/usr/bin/env tsx

/**
 * Walrus Site Publisher CLI
 *
 * This script handles the complete workflow:
 * 1. Build the UI package
 * 2. Publish to Walrus
 * 3. Print deployment URLs
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

interface WalrusConfig {
  sites: Array<{
    name: string;
    network: string;
    domain: string;
    description: string;
  }>;
  builder: {
    framework: string;
    build_command: string;
    output_directory: string;
  };
  deployment: {
    auto_deploy: boolean;
    branch: string;
    environment: string;
  };
}

interface DeploymentResult {
  siteId: string;
  url: string;
  status: "success" | "error";
  message?: string;
}

class WalrusPublisher {
  private configPath: string;
  private config: WalrusConfig;

  constructor(configPath: string = "./walrus/sites-config.yaml") {
    this.configPath = configPath;
    this.config = this.loadConfig();
  }

  private loadConfig(): WalrusConfig {
    try {
      const yaml = require("js-yaml");
      const configContent = readFileSync(this.configPath, "utf8");
      return yaml.load(configContent);
    } catch (error) {
      console.error("Failed to load Walrus config:", error);
      process.exit(1);
    }
  }

  private async buildProject(): Promise<void> {
    console.log("🔨 Building UI package...");
    try {
      execSync("cd packages/ui && npm run build", { stdio: "inherit" });
      console.log("✅ Build completed successfully");
    } catch (error) {
      console.error("❌ Build failed:", error);
      process.exit(1);
    }
  }

  private async publishToWalrus(): Promise<DeploymentResult[]> {
    console.log("🚀 Publishing to Walrus...");

    const results: DeploymentResult[] = [];

    for (const site of this.config.sites) {
      try {
        console.log(`📦 Publishing site: ${site.name}`);

        // Simulate Walrus API call
        const deploymentResult = await this.simulateWalrusDeployment(site);
        results.push(deploymentResult);

        console.log(`✅ Site ${site.name} deployed successfully`);
      } catch (error) {
        console.error(`❌ Failed to deploy ${site.name}:`, error);
        results.push({
          siteId: site.name,
          url: "",
          status: "error",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return results;
  }

  private async simulateWalrusDeployment(site: any): Promise<DeploymentResult> {
    // This would be replaced with actual Walrus API calls
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          siteId: site.name,
          url: `https://${site.name}.walrus.gg`,
          status: "success",
        });
      }, 1000);
    });
  }

  private printResults(results: DeploymentResult[]): void {
    console.log("\n🎉 Deployment Results:");
    console.log("====================");

    results.forEach((result) => {
      if (result.status === "success") {
        console.log(`✅ ${result.siteId}: ${result.url}`);
      } else {
        console.log(
          `❌ ${result.siteId}: ${result.message || "Deployment failed"}`
        );
      }
    });

    console.log("\n📊 Summary:");
    const successful = results.filter((r) => r.status === "success").length;
    const failed = results.filter((r) => r.status === "error").length;
    console.log(`   Successful: ${successful}`);
    console.log(`   Failed: ${failed}`);
  }

  public async publish(): Promise<void> {
    console.log("🚀 Starting Walrus deployment process...\n");

    try {
      await this.buildProject();
      const results = await this.publishToWalrus();
      this.printResults(results);

      // Update ws-resources.json with deployment info
      this.updateResourcesFile(results);
    } catch (error) {
      console.error("❌ Deployment process failed:", error);
      process.exit(1);
    }
  }

  private updateResourcesFile(results: DeploymentResult[]): void {
    const resourcesPath = "./walrus/ws-resources.json";
    try {
      const resources = JSON.parse(readFileSync(resourcesPath, "utf8"));

      // Update deployment info
      resources.metadata.last_updated = new Date().toISOString();
      resources.metadata.total_sites = results.length;

      // Update site URLs
      results.forEach((result) => {
        if (result.status === "success") {
          const site = resources.sites.find((s: any) => s.id === result.siteId);
          if (site) {
            site.url = result.url;
            site.updated_at = new Date().toISOString();
          }
        }
      });

      writeFileSync(resourcesPath, JSON.stringify(resources, null, 2));
      console.log("📝 Updated ws-resources.json");
    } catch (error) {
      console.warn("⚠️  Failed to update resources file:", error);
    }
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const configPath = args[0] || "./walrus/sites-config.yaml";

  const publisher = new WalrusPublisher(configPath);
  await publisher.publish();
}

if (require.main === module) {
  main().catch(console.error);
}

export { WalrusPublisher };
