import { NextRequest } from "next/server";
import { settlePayment, facilitator } from "thirdweb/x402";
import { createThirdwebClient, defineChain } from "thirdweb";

// Initialize Thirdweb client with SECRET KEY
const client = createThirdwebClient({
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

// Configure Monad network (EVM-compatible) using defineChain
const monadNetwork = defineChain({
  id: 10143, // Monad testnet chain ID
  name: "Monad Testnet",
  rpc: process.env.MONAD_RPC_URL || "https://testnet.monad.xyz",
  nativeCurrency: {
    name: "Monad",
    symbol: "MON",
    decimals: 18,
  },
  testnet: true,
});

// Create facilitator instance with client and server wallet address
const payToAddress = process.env.PAY_TO_WALLET_ADDRESS!;
const thirdwebX402Facilitator = facilitator({
  client,
  serverWalletAddress: payToAddress,
});

export async function GET(request: NextRequest) {
  try {
    console.log("API route called:", request.url);

    if (!payToAddress) {
      throw new Error("PAY_TO_WALLET_ADDRESS not configured");
    }

    // Get payment data from request headers
    const paymentData = request.headers.get("x-payment");
    const resourceUrl = `${request.nextUrl.origin}/api/paid-content`;

    console.log("Payment data:", paymentData);
    console.log("Resource URL:", resourceUrl);

    // Use settlePayment to handle the x402 payment flow
    const result = await settlePayment({
      resourceUrl,
      method: "GET",
      paymentData: paymentData || undefined,
      payTo: payToAddress,
      network: monadNetwork,
      price: "$0.01",
      facilitator: thirdwebX402Facilitator,
    });

    console.log("settlePayment result:", result);

    // If payment is successful (status 200)
    if (result.status === 200) {
      return Response.json({
        success: true,
        message: "Welcome to the premium content!",
        data: {
          secretInfo: "This is exclusive paid content from Monad x402",
          timestamp: new Date().toISOString(),
          paymentVerified: true,
        },
      });
    } else {
      // Return 402 Payment Required or other status
      return Response.json(result.responseBody, {
        status: result.status,
        headers: result.responseHeaders,
      });
    }
  } catch (error) {
    console.error("Error in paid endpoint:", error);
    return Response.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}
