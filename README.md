# Walrus On-Chain LinkTree on Sui

<div align="center">

![Walrus Logo](packages/ui/public/logo.png)

**A decentralized LinkTree alternative built on Sui blockchain with Walrus
hosting integration**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Sui](https://img.shields.io/badge/Built%20on-Sui-blue)](https://sui.io/)
[![Walrus](https://img.shields.io/badge/Hosted%20on-Walrus-green)](https://walrus.gg/)

</div>

## 🌟 Overview

Walrus On-Chain LinkTree is a revolutionary decentralized profile platform that
stores all profile data (name, avatar, bio, theme, links) directly on the Sui
blockchain as Move objects. Unlike traditional centralized platforms, your
profile data is truly owned by you and cannot be censored or taken down.

### 🚀 Key Features

- **🔗 On-Chain Storage**: All profile data stored as Sui Move objects
- **⚡ Instant Onboarding**: zkLogin + Sponsored Gas transactions (no SUI needed
  for first transaction)
- **🔒 Verified Links**: Cryptographic hash verification for link integrity
- **📊 Analytics**: On-chain view tracking and link click analytics
- **🎨 Customizable Themes**: Personalized profile appearance
- **🌐 SuiNS Integration**: Human-readable URLs via SuiNS domains
- **📱 Mobile-First Design**: Responsive React dApp with modern UI

### 🏆 "Wow" Features for Judges

1. **zkLogin + Sponsored Gas**: Seamless onboarding without requiring users to
   own SUI tokens
2. **Verified Links**: Cryptographic hash verification ensures link integrity
   and prevents tampering
3. **On-Chain Analytics**: Transparent view tracking and click analytics stored
   on-chain
4. **Token/NFT-Gated Links**: Future feature for exclusive content access

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React + Vite + Sui dApp Kit (`@mysten/dapp-kit`)
- **Smart Contracts**: Sui Move modules with `LinkTreeProfile` objects
- **Hosting**: Walrus site-builder for decentralized hosting
- **Domain Resolution**: SuiNS SDK for human-readable URLs
- **Authentication**: Enoki Sponsored Transactions + zkLogin
- **UI Components**: Radix UI + Tailwind CSS

### Project Structure

```
movetree/
<<<<<<< HEAD
├── packages/
│   ├── move/                 # Sui Move smart contracts
│   │   ├── sources/
│   │   │   └── profile.move   # LinkTreeProfile module
│   │   ├── Move.toml         # Move package configuration
│   │   └── build/            # Compiled Move bytecode
│   ├── ui/                   # React dApp frontend
│   │   ├── src/
│   │   │   ├── app/          # Private dashboard (create/update)
│   │   │   ├── public/       # Public profile pages
│   │   │   ├── components/   # Reusable UI components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── sui/          # Sui client & transaction helpers
│   │   │   └── hooks/        # Custom React hooks
│   │   ├── sites-config.yaml # Walrus deployment configuration
│   │   └── package.json
│   ├── api/                  # Backend API services
│   └── backend/              # Profile name registry
├── walrus/                   # Walrus deployment artifacts
│   ├── profiles/             # Generated profile pages
│   └── profiles-config.json  # Profile configuration
├── scripts/                  # Deployment and utility scripts
│   ├── publish-walrus.ts     # Walrus deployment automation
│   ├── link-suins.ts         # SuiNS domain linking
│   └── enoki-server.ts       # Enoki server setup
└── README.md
=======
├─ packages/
│  ├─ move/                 # Sui Move paketi (LinkTreeProfile)
│  │  ├─ sources/
│  │  └─ Move.toml
│  └─ ui/                   # dApp Kit ile React app (LYNQ editör + public)
│     ├─ src/
│     │  ├─ app/            # private dashboard (create/update)
│     │  ├─ public/         # public profile page (/u/:id, /@:name)
│     │  ├─ sui/            # client, queries, tx helpers
│     │  └─ components/
│     ├─ vite.config.ts
│     └─ index.html
├─ walrus/
│  ├─ sites-config.yaml     # testnet context
│  └─ ws-resources.json     # publish sonrası site objesi & blob referansları
├─ scripts/
│  ├─ publish-walrus.ts     # (ops) CLI wrap: build->publish->print URLs
│  └─ link-suins.ts         # (ops) suins SDK ile "link site" örneği
├─ README.md
└─ .github/workflows/
   └─ walrus-ci.yml         # (ops) CI/CD ile site-builder publish
>>>>>>> 15274620ab32b1f6a0471912df4e801e0ffd6e0a
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **Sui CLI** (latest version)
- **Walrus CLI** (for deployment)
- **pnpm** (package manager)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/movetree.git
cd movetree

# Install dependencies
pnpm install

# Install Sui CLI (if not already installed)
curl -fsSL https://get.sui.io | sh
```

### Development Setup

```bash
# Start the development server
pnpm dev

# In another terminal, start the API server
pnpm dev:api

# Build Move contracts
cd packages/move && sui move build

# Test Move contracts
cd packages/move && sui move test
```

### Environment Variables

Create a `.env` file in the `packages/ui` directory:

```bash
# Sui Network Configuration
VITE_SUI_NETWORK=testnet
VITE_SUI_RPC_URL=https://fullnode.testnet.sui.io:443

# Enoki Configuration (for sponsored transactions)
VITE_ENOKI_PUBLIC_KEY=your_enoki_public_key

# Backend API
VITE_BACKEND_URL=http://localhost:3001

# Firebase (optional, for analytics)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
```

## 📦 Smart Contracts

### LinkTreeProfile Object

The core smart contract defines a `LinkTreeProfile` object that stores:

```move
public struct LinkTreeProfile has key {
    id: UID,
    owner: address,
    name: String,
    avatar_cid: String,        // IPFS CID for avatar
    bio: String,
    theme: String,             // Theme configuration
    links: vector<String>,     // Profile links
    links_hash: vector<u8>,    // Cryptographic hash of links
    tags: vector<String>,      // User interests/categories
    profile_views: u64,        // Total profile views
    link_clicks: vector<u64>,  // Click count per link
}
```

### Key Functions

- `create_profile()`: Create a new profile
- `upsert_links()`: Update profile links
- `upsert_links_verified()`: Update links with hash verification
- `view_link()`: Track link clicks and emit events
- `increment_profile_view()`: Track profile views
- `update_tags()`: Update user interest tags
- `set_theme()`: Update profile theme

### Events

The contract emits events for indexing and analytics:

- `ProfileCreated`: When a new profile is created
- `LinkViewed`: When a link is clicked
- `TagsUpdated`: When profile tags are updated

## 🎨 Frontend Features

### Dashboard

- **Profile Creation**: Create and customize your LinkTree profile
- **Link Management**: Add, edit, and reorder links
- **Theme Customization**: Choose from various themes
- **Analytics**: View profile views and link click statistics
- **Tag Management**: Add interest tags for networking

### Public Profile

- **Responsive Design**: Mobile-first responsive layout
- **Theme Support**: Customizable themes and colors
- **Link Tracking**: Automatic click tracking
- **Social Sharing**: Easy sharing capabilities

### Authentication

- **zkLogin**: Passwordless authentication using OAuth providers
- **Sponsored Transactions**: No SUI required for first transaction
- **Wallet Integration**: Support for Sui wallets

## 🌐 Deployment

### Walrus Deployment

```bash
# Build and deploy to Walrus
pnpm deploy

# Deploy to specific context
walrus deploy --context testnet
walrus deploy --context mainnet
```

### SuiNS Domain Linking

```bash
# Link your site to a SuiNS domain
pnpm run link:suins link yourname https://your-site.walrus.gg
```

### Smart Contract Deployment

```bash
# Deploy Move contracts to testnet
cd packages/move
sui client publish --gas-budget 100000000

# Deploy to mainnet
sui client publish --gas-budget 100000000 --network mainnet
```

## 🔧 Configuration

### Walrus Configuration

The `sites-config.yaml` file contains deployment settings:

```yaml
contexts:
  testnet:
    portal: trwal.app
    package: 0x...
    general:
      wallet_env: testnet
      walrus_context: testnet
  mainnet:
    portal: wal.app
    package: 0x...
    general:
      wallet_env: mainnet
      walrus_context: mainnet
```

### Move Configuration

The `Move.toml` file defines the Move package:

```toml
[package]
name = "LinkTreeProfile"
version = "0.0.1"
edition = "2024"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }
```

## 🧪 Testing

### Move Contract Testing

```bash
cd packages/move
sui move test
```

### Frontend Testing

```bash
cd packages/ui
pnpm test
pnpm lint
```

### Integration Testing

```bash
# Test the complete flow
pnpm test:integration
```

## 📊 Analytics & Monitoring

### On-Chain Analytics

- **Profile Views**: Tracked on-chain via `increment_profile_view()`
- **Link Clicks**: Tracked via `view_link()` function
- **Events**: All interactions emit events for indexing

### Off-Chain Analytics

- **Firebase Integration**: Optional analytics tracking
- **Custom Hooks**: `useAnalytics` for tracking user interactions
- **Performance Monitoring**: Built-in performance metrics

## 🔒 Security Features

### Cryptographic Verification

- **Link Integrity**: SHA-3 256 hash verification for links
- **Tamper Detection**: Cryptographic proof of link authenticity
- **Owner Verification**: Only profile owners can modify their data

### Access Control

- **Ownership Model**: Each profile is owned by a single address
- **Permission System**: Owner-only modification functions
- **Public Read Access**: Anyone can view profiles and track analytics

## 🌍 Network Support

- **Testnet**: Full functionality on Sui testnet
- **Mainnet**: Production-ready for Sui mainnet
- **Multi-Network**: Easy switching between networks

## 🤝 Contributing

We welcome contributions! Please see our
[Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`pnpm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Move**: Follow Sui Move best practices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## 🙏 Acknowledgments

- **Sui Foundation**: For the amazing Sui blockchain platform
- **Mysten Labs**: For Sui dApp Kit and developer tools
- **Walrus**: For decentralized hosting infrastructure
- **Enoki**: For sponsored transaction capabilities

## 📞 Support

- **Documentation**:
  [Project Wiki](https://github.com/your-username/movetree/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/movetree/issues)
- **Discussions**:
  [GitHub Discussions](https://github.com/your-username/movetree/discussions)
- **Discord**: [Join our community](https://discord.gg/your-discord)

---

<div align="center">

**Built with ❤️ on Sui Blockchain**

[Website](https://movetree.walrus.gg) •
[Documentation](https://docs.movetree.gg) • [Demo](https://demo.movetree.gg)

</div>
