poll Sepolia → match log → trigger deduction on Arc via Circle Contract → confirm deduction succeeded → call webhook.

DeFi Track
Build stablecoin-native DeFi on Arc.
Build lending, borrowing, swaps, liquidity, FX, yield, payments, treasury or fintech infrastructure using Arc and USDC.

What we're looking for:
Meaningful use of Arc and USDC
Advanced programmable money flows such as conditional payments, onchain automation or multi-step settlement
Payment, liquidity or treasury workflows using App Kits where relevant
Applications that show why stablecoin-native infrastructure changes what is possible
Core products: Arc, USDC, App Kits, Circle Wallets, Circle Contracts, CCTP, Gateway, StableFX.





## Things left
Here's the full build checklist, in order, to take Kwala from "event listener" to a complete DeFi-track submission:

**1. Wallet & onboarding layer**
- Integrate Circle Wallets (developer-controlled or user-controlled) so users get a wallet on signup without needing MetaMask pre-installed.
- Wire this into your existing frontend signup flow.

**2. Funding flow (buying credits)**
- Add a "buy credits" screen: user sends USDC to fund their balance.
- Integrate CCTP so users funding from Ethereum/Base/other chains get native USDC minted on Arc, not a wrapped token.
- (Optional, skip if short on time) Add Gateway later for unified cross-chain balance — not required for MVP.

**3. Deploy the credit/authority contract on Arc**
- Write a Circle Contract (Solidity, same tooling you already use for Sepolia) that:
  - Holds each user's USDC allowance/balance
  - Enforces a spend condition: only your backend's authorized signer can pull funds, only up to a capped amount, only when called
  - Emits an event on each deduction (so it's auditable onchain, not just trusted in your backend)
- Deploy to Arc testnet, point your backend at Arc's testnet RPC.

**4. Migrate balance logic off Supabase**
- Keep Supabase for webhook URLs, watched contract addresses, delivery logs/retries — that's fine as-is.
- Move the *credit balance* itself so it's read from/written to the Arc contract, not a plain Supabase integer. This is what makes your "authority to deduct" claim verifiable onchain instead of just backend-trusted.

**5. Wire deduction into your existing monitoring loop**
- Current loop: `poll Sepolia → match log → call webhook`
- New loop: `poll Sepolia → match log → call deduction function on Arc contract → confirm success → call webhook`
- Add the failure branch: if deduction fails (insufficient balance), skip the webhook, notify user their credits ran out, and surface that state on the frontend.

**6. Add the settlement split (multi-step settlement criterion)**
- On each successful deduction, split the payout: e.g., 90% to a platform treasury wallet, 10% to a reserve wallet (for refunds/retry credits on failed webhook deliveries).
- This can be a second Circle Wallet plus a split inside your deduction call — small addition, but directly hits the "multi-step settlement" judging criterion.

**7. Backend signer setup**
- Confirm your backend has a hot wallet/signer that can call the Arc deduction function autonomously (this is what makes step 5 "automation" rather than requiring the user to approve every single deduction).

**8. Frontend updates**
- Show live credit balance (pulled from the Arc contract, not Supabase).
- Show funding flow (CCTP-based top-up from other chains).
- Show a deduction/activity log so judges can see the onchain trail during the demo.

**9. Demo script / pitch**
- Prepare a narrative: "user funds from any chain via CCTP → grants programmable authority on Arc → Kwala monitors Sepolia 24/7 → verified event triggers a conditional, automated, multi-step USDC settlement → webhook fires." One sentence answering "why couldn't this be done with a bank transfer or a database counter."

**10. Testing pass**
- End-to-end test: fund → deduct → webhook fires → balance updates correctly → failure case (insufficient balance) handled gracefully.
- Test CCTP funding from at least one other testnet (e.g., Ethereum Sepolia → Arc testnet) to make sure the cross-chain leg actually works before demo day.

If you want, tell me your timeline (how many days left) and I can help you prioritize which of these are must-haves vs. cuttable if you're tight on time.


