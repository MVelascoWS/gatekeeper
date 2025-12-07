# Monad x402 Protocol Demo

A simple Next.js application demonstrating the x402 payment protocol implementation with Monad blockchain.

## What is x402?

x402 is an open-source protocol that uses HTTP 402 (Payment Required) status code to create an on-chain payment layer for APIs. It enables:

- Pay-per-use API endpoints
- Automatic payment handling with crypto wallets
- Support for 170+ EVM-compatible chains (including Monad)
- Seamless integration with existing applications

## Project Structure

```
monad-x402-app/
├── app/
│   ├── api/
│   │   └── paid-content/
│   │       └── route.ts          # Backend: Payment-required API endpoint
│   └── page.tsx                  # Frontend: Test interface
├── .env.example                  # Environment configuration template
└── package.json
```

## Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- A Thirdweb account and client ID
- A wallet with Monad testnet tokens
- Monad testnet RPC access

### 2. Installation

```bash
# Install dependencies
npm install
```

### 3. Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Get your client ID from https://thirdweb.com/dashboard
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id_here

# Get your secret key from https://thirdweb.com/dashboard/settings/api-keys
# IMPORTANT: Keep this secret! Never expose it in frontend code
THIRDWEB_SECRET_KEY=your_thirdweb_secret_key_here

# Your wallet address that will receive payments
PAY_TO_WALLET_ADDRESS=0xYourWalletAddressHere

# Monad testnet RPC URL (update with actual URL)
MONAD_RPC_URL=https://testnet.monad.xyz
```

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Backend (`app/api/paid-content/route.ts`)

The backend API endpoint:

1. Checks for payment data in the `x-payment` header
2. Returns HTTP 402 if no payment is provided
3. Verifies payment using `settlePayment()` from thirdweb/x402
4. Returns premium content after successful payment verification

Key features:
- Price: $0.01 per request
- Network: Monad testnet
- Payment verification on-chain

### Frontend (`app/page.tsx`)

The frontend test interface:

1. Uses `wrapFetchWithPayment()` to wrap fetch with automatic payment handling
2. Displays a button to access paid content
3. Automatically prompts for wallet connection and payment
4. Shows response data or error messages

## Usage

1. Click "Access Paid Content" button
2. Connect your wallet when prompted
3. Approve the payment transaction
4. View the premium content after payment verification

## API Endpoint

### GET `/api/paid-content`

**Payment Required**: $0.01

**Success Response** (200):
```json
{
  "success": true,
  "message": "Welcome to the premium content!",
  "data": {
    "secretInfo": "This is exclusive paid content from Monad x402",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "paymentVerified": true,
    "transactionHash": "0x..."
  }
}
```

**Payment Required** (402):
```json
{
  "error": "Payment required",
  "message": "This endpoint requires payment to access"
}
```

## Configuration Options

### Monad Network Settings

Update the network configuration in `app/api/paid-content/route.ts`:

```typescript
const monadNetwork = {
  id: 41454,                                    // Monad chain ID
  rpc: process.env.MONAD_RPC_URL || "...",     // RPC endpoint
  name: "Monad Testnet",                       // Network name
};
```

### Price Configuration

Adjust the price in `app/api/paid-content/route.ts`:

```typescript
price: "$0.01",  // Change to your desired price
```

## Development

### Key Files to Modify

1. **Backend Logic**: `app/api/paid-content/route.ts`
   - Modify payment verification logic
   - Change pricing structure
   - Add custom business logic

2. **Frontend Interface**: `app/page.tsx`
   - Customize UI/UX
   - Add more API endpoints
   - Enhance error handling

## Troubleshooting

### Common Issues

1. **"Payment verification failed"**
   - Ensure your wallet has sufficient Monad testnet tokens
   - Verify the network configuration matches Monad testnet
   - Check that PAY_TO_WALLET_ADDRESS is set correctly

2. **"Thirdweb client ID not found"** or **"Client secret key is required"**
   - Create a `.env.local` file
   - Add NEXT_PUBLIC_THIRDWEB_CLIENT_ID from your Thirdweb dashboard (for frontend)
   - Add THIRDWEB_SECRET_KEY from your Thirdweb dashboard (for backend facilitator)

3. **Network connection errors**
   - Verify MONAD_RPC_URL is correct
   - Check that Monad testnet is accessible

## Resources

- [x402 Protocol Documentation](https://portal.thirdweb.com/x402)
- [Thirdweb Dashboard](https://thirdweb.com/dashboard)
- [Monad Documentation](https://docs.monad.xyz)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT
