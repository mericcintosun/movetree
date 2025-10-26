# LYNQ 🦑

> **Own Your Digital DNA**

A decentralized identity and link sharing platform built on Sui blockchain with Walrus hosting integration. Create your on-chain profile, share your links, and truly own your digital presence.

## 🏗️ Project Structure

```
movetree/
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
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Sui CLI
- Walrus API access

### Installation

```bash
# Install all dependencies
npm run install:all

# Install Sui CLI (if not already installed)
curl -fsSL https://get.sui.io | sh
```

### Development

```bash
# Start UI development server
npm run dev

# Test Move package
npm run move:test

# Build Move package
npm run move:build
```

### Deployment

```bash
# Deploy to Walrus
npm run deploy:walrus

# Link to SuiNS domain
npm run link:suins
```

## 📦 Packages

### UI Package (`packages/ui/`)

React application built with:

- **dApp Kit**: Sui blockchain integration
- **Radix UI**: Modern component library
- **TanStack Query**: Data fetching and caching
- **Vite**: Fast build tool

### Move Package (`packages/move/`)

Sui Move smart contracts for:

- **LinkTreeProfile**: Core profile object
- **Link Management**: Add/update/remove links
- **Events**: Profile creation and updates

## 🛠️ Scripts

### `scripts/publish-walrus.ts`

CLI tool for Walrus deployment:

- Builds UI package
- Publishes to Walrus
- Updates resource tracking
- Prints deployment URLs

### `scripts/link-suins.ts`

SuiNS domain linking:

- Links Walrus sites to SuiNS domains
- Manages domain records
- Provides domain information

## 🔧 Configuration

### Walrus (`walrus/`)

- `sites-config.yaml`: Site configuration
- `ws-resources.json`: Resource tracking

### GitHub Actions (`.github/workflows/`)

- `walrus-ci.yml`: CI/CD pipeline
- Automated testing and deployment
- Security scanning

## 🌐 Deployment URLs

After deployment, your sites will be available at:

- **Testnet**: `https://movetree-testnet.walrus.gg`
- **Mainnet**: `https://movetree-mainnet.walrus.gg`

## 🔗 SuiNS Integration

Link your Walrus sites to SuiNS domains:

```bash
# Link testnet site
npm run link:suins link movetree-test https://movetree-testnet.walrus.gg

# Link mainnet site
npm run link:suins link movetree https://movetree-mainnet.walrus.gg
```

## 🧪 Testing

```bash
# Test Move contracts
npm run move:test

# Test UI components
cd packages/ui && npm run lint
```

## 📝 Environment Variables

Required for deployment:

```bash
WALRUS_API_KEY=your_walrus_api_key
WALRUS_API_URL=https://api.walrus.gg
SUI_PRIVATE_KEY=your_sui_private_key
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.
