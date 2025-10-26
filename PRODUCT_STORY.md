# Lynq - Your Identity, Immortalized on Sui

## About Lynq

**Lynq** is the first decentralized LinkTree alternative powered by the Sui
blockchain. Built for creators, entrepreneurs, and visionaries who believe in
true digital sovereignty. Unlike traditional link-in-bio platforms that lock
your data in corporate databases, Lynq stores your entire profile—name, avatar,
bio, links, and analytics—directly on-chain as an immutable, portable Sui
object.

### Slogan

**"Link Once. Own Forever."**

### One-Line Summary

Lynq is the decentralized LinkTree where your profile is stored on-chain, giving
you true ownership, instant gasless onboarding via zkLogin, and verified links
that can never be tampered with—all while supporting beautiful, customizable
profiles and real-time analytics.

---

## The Problem We're Solving

Traditional platforms like LinkTree own your data. Your links, analytics, and
profile settings are locked in their database. If they change their terms, get
acquired, or shut down, you lose everything. Thousands of creators have lost
years of link history due to platform closures or account deletions.

**What if your entire online identity lived on-chain—permanently, independently,
and truly yours?**

---

## Our Solution

Lynq is a Web3-native link-in-bio platform where every profile is a **Sui
blockchain object**. This means:

- **True Ownership**: Your profile is yours forever. No company can delete it or
  change your data.
- **Portable**: Your on-chain profile works across any dApp—future platforms can
  import your Lynq profile.
- **Transparent & Verifiable**: Links can be cryptographically signed and
  verified on-chain.
- **Gasless Onboarding**: Use Google zkLogin to create your profile with
  sponsored gas fees—no SUI needed for your first transaction.
- **Beautiful UI**: A modern, responsive design built with React, Radix UI, and
  cutting-edge animations.

---

## Key Features

### 1. **zkLogin + Sponsored Gas for Instant Onboarding**

First-time users can create their profile by signing in with Google—no SUI, no
wallet funding required. We sponsor the gas for your first transaction, removing
the biggest barrier to Web3 adoption.

### 2. **On-Chain Profile Storage**

Your entire profile lives in a Sui Move object:

```move
LinkTreeProfile {
    owner: address,
    name: String,
    avatar_cid: String,  // IPFS CID for your avatar
    bio: String,
    theme: String,       // Custom theme JSON
    links: vector<String>,
    links_hash: vector<u8>,  // Cryptographic hash for verification
    tags: vector<String>,    // For networking and discovery
    profile_views: u64,
    link_clicks: vector<u64>
}
```

### 3. **Verified Links (Cryptographic Integrity)**

Links are stored with a SHA-3 hash. Future updates can be verified
on-chain—ensuring your links are never tampered with. Perfect for high-security
use cases or creators who want to prove authenticity.

### 4. **Token/NFT-Gated Links (Coming Soon)**

Select links can require ownership of a specific NFT or token. Perfect for
exclusive content, member-only resources, or VIP access.

### 5. **Real-Time Analytics with Hybrid Sync**

- **Firebase**: Instant analytics updates (no blockchain delays)
- **Automatic Sync**: Every 2 days, analytics batch-sync to the blockchain
- **View Counts**: Track profile views and link clicks in real-time
- **Cost Efficient**: 99% reduction in blockchain transactions while maintaining
  permanent records

### 6. **Beautiful, Customizable Profiles**

- Dark mode optimized with glass-morphism design
- Mobile-responsive layouts
- Social platform icons (GitHub, LinkedIn, Twitter, YouTube, etc.)
- Custom themes with background patterns
- Smooth animations and transitions

### 7. **Human-Readable URLs via SuiNS**

Link your profile to a `.sui` domain (e.g., `alice.sui` → your Lynq profile).
Combined with Walrus hosting, your profile is accessible at a memorable URL.

### 8. **On-Chain View Receipts**

Every profile view and link click emits an on-chain event. Analytics are
verifiable, transparent, and auditable—perfect for sponsored content or
partnerships.

### 9. **Networking & Discovery via Tags**

Add tags to your profile (e.g., "#blockchain-developer", "#web3-designer").
Future discovery features will let users explore profiles by interest.

---

## Technical Architecture

### Frontend Stack

- **React + TypeScript**: Modern, type-safe UI
- **Vite**: Lightning-fast build tool
- **Sui dApp Kit**: Wallet integration, RPC hooks, transaction management
- **Radix UI**: Accessible, customizable components
- **TanStack Query**: Efficient data fetching and caching
- **Framer Motion**: Smooth animations
- **Firebase Firestore**: Analytics caching layer

### Smart Contracts

- **Sui Move**: Type-safe, secure smart contracts
- **LinkTreeProfile Object**: Core on-chain profile data structure
- **Entry Functions**: `create_profile`, `upsert_links`,
  `upsert_links_verified`, `view_link`, `increment_profile_view`, `update_tags`
- **Events**: Blockchain-indexable events for analytics and discovery

### Infrastructure

- **Walrus**: Decentralized hosting on Sui blockchain
- **SuiNS**: Domain name service for human-readable URLs
- **Enoki**: zkLogin and sponsored transaction infrastructure
- **Firebase**: Analytics caching and real-time updates

### Developer Experience

- **Monorepo**: `pnpm` workspace for unified development
- **GitHub Actions**: CI/CD for automated testing and deployment
- **TypeScript**: End-to-end type safety
- **Modern Tooling**: ESLint, Prettier, and structured project layout

---

## Our Team

### Meriç Cintosun - Blockchain Developer

**LinkedIn**: [@mericcintosun](https://linkedin.com/in/mericcintosun)  
**Role**: Sui Move smart contracts, blockchain architecture, gas optimization  
**Expertise**: Rust, Move, Web3, Cryptography

Meriç is the mastermind behind Lynq's blockchain infrastructure. With deep
expertise in Sui Move and Rust, he architected the on-chain profile system,
designed the gas-efficient data structures, and implemented the cryptographic
link verification system that sets Lynq apart from traditional platforms.

### Melis Çildir - Designer & Researcher

**LinkedIn**: [@meliscildir](https://linkedin.com/in/meliscildir)  
**Role**: UX/UI design, user research, product strategy  
**Expertise**: Design systems, user experience, Web3 onboarding

Melis crafted Lynq's beautiful, intuitive interface and identified the critical
problem traditional link-in-bio platforms create. Her research into creator
needs and blockchain user experience shaped every design decision, ensuring Lynq
is both powerful and accessible to Web2 users.

### Muhsin Ali Kulbak - Frontend Developer

**LinkedIn**: [@muhsinalikulbak](https://linkedin.com/in/muhsinalikulbak)  
**Role**: React development, UI implementation, performance optimization  
**Expertise**: React, TypeScript, Vite, Modern web development

Muhsin brought Lynq's design to life with pixel-perfect precision. He built the
dashboard, public profile views, analytics components, and integrated the Sui
dApp Kit seamlessly. His focus on performance and user experience ensures Lynq
loads instantly and runs smoothly on all devices.

### Samet Özgişi - AI Developer

**LinkedIn**: [@sametozgisi](https://linkedin.com/in/sametozgisi)  
**Role**: AI integration, data analysis, future ML features  
**Expertise**: Machine learning, data science, LLM integration

Samet is building the future of Lynq—AI-powered features like content
suggestions, automated profile optimization, and intelligent link
recommendations. His expertise in ML will help creators maximize their profile's
impact.

---

## Why Sui Blockchain?

### Performance

- **Sub-second finality**: Your profile updates instantly
- **High throughput**: Handle millions of profiles without congestion
- **Low gas fees**: Fractional SUI costs for transactions

### Developer Experience

- **Move Language**: Type-safe smart contracts with formal verification support
- **Object-Centric Model**: Perfect for profiles and ownership
- **Composability**: Your Lynq profile can integrate with other Sui dApps

### Ecosystem

- **Growing Network**: Rapid adoption in gaming, DeFi, and social dApps
- **Strong Infrastructure**: Enoki, SuiNS, Walrus—all production-ready
- **Community**: Active, supportive builder community

---

## Use Cases

### 1. **Content Creators**

Never lose your link history. Your Lynq profile is permanent and portable across
platforms.

### 2. **Entrepreneurs & Founders**

Professional landing page with verified credentials. Add your email, Twitter,
company website, and pitch deck—all on one beautiful, customizable page.

### 3. **Web3 Developers**

Showcase your GitHub, portfolio, and latest dApps. Use verified links to prove
project authenticity. Perfect for hackathons and job applications.

### 4. **NFT Artists**

Link to your OpenSea, art portfolio, and social media. Future features will let
you gate certain links behind NFT ownership.

### 5. **Job Seekers**

Single URL for your resume, portfolio, and contact info. Send `yourname.sui` to
potential employers—they can verify your credentials on-chain.

### 6. **Influencers & Brands**

Real-time analytics on profile views and link clicks. Future monetization
features will let you charge for sponsored link slots.

---

## Roadmap

### ✅ Completed (v1.0)

- [x] On-chain profile storage on Sui
- [x] Google zkLogin + sponsored gas onboarding
- [x] Basic link management (add, remove, reorder)
- [x] Public profile display with custom themes
- [x] Real-time analytics via Firebase + blockchain sync
- [x] Human-readable URLs via name registry
- [x] Beautiful, responsive UI with dark mode
- [x] Walrus deployment with CI/CD

### 🚧 In Progress (v1.1)

- [ ] Verified links with cryptographic hashing (UI implementation)
- [ ] SuiNS domain integration (`.sui` URLs)
- [ ] Profile tags and discovery features
- [ ] Analytics dashboard with charts and insights
- [ ] Mobile app (React Native)

### 🔮 Planned (v2.0)

- [ ] Token/NFT-gated links
- [ ] Multi-profile support per wallet
- [ ] Collaborative profiles (shared ownership)
- [ ] AI-powered content suggestions
- [ ] Sponsored link marketplace
- [ ] Farcaster integration
- [ ] ENS/SNS cross-chain compatibility

---

## Why Choose Lynq?

### vs. LinkTree

- ✅ You own your data (on-chain)
- ✅ Verified link integrity
- ✅ Gasless onboarding
- ✅ Decentralized hosting (can't be shut down)
- ✅ Real-time analytics

### vs. Other Web3 Link-Bio Platforms

- ✅ Sui's performance advantage (sub-second finality)
- ✅ zkLogin reduces friction to near-zero
- ✅ Beautiful, modern UI
- ✅ Production-ready infrastructure (Walrus, Enoki, SuiNS)

### vs. Generic Sui dApps

- ✅ Purpose-built for link-in-bio use case
- ✅ Optimized UX for creators (not just DeFi)
- ✅ Cost-effective hybrid analytics (Firebase + blockchain)
- ✅ Active development and support

---

## Getting Started

### For Users

1. Visit lynq.trwal.app (or your custom `.sui` domain)
2. Click "Connect with Google" (zkLogin)
3. Create your profile (name, bio, avatar)
4. Add your links
5. Share your profile URL

### For Developers

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start the dev server: `pnpm dev`
4. Run Move tests: `cd packages/move && sui move test`

See [README.md](README.md) for full setup instructions.

---

## Open Source & Community

Lynq is open source and built for the Sui ecosystem. We welcome contributions,
feedback, and partnerships.

**GitHub**: [github.com/autonomys/lynq](https://github.com/autonomys/lynq)  
**Demo**: [lynq.trwal.app](https://lynq.trwal.app)  
**Discord**: [discord.gg/autonomys](https://discord.gg/autonomys)  
**Twitter**: [@lynq_sui](https://twitter.com/lynq_sui)

---

## License

MIT License - Build freely, innovate boldly.

---

**Built with ❤️ by the Lynq team on Sui Blockchain**

_"Link Once. Own Forever."_
