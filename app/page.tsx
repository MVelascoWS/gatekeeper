"use client";

import { useState } from "react";
import { createThirdwebClient, defineChain } from "thirdweb";
import { createWallet } from "thirdweb/wallets";
import { wrapFetchWithPayment } from "thirdweb/x402";

// Initialize Thirdweb client
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

// Define Monad network
const monadNetwork = defineChain({
  id: 10143,
  name: "Monad Testnet",
  rpc: process.env.NEXT_PUBLIC_MONAD_RPC_URL || "https://testnet.monad.xyz",
  nativeCurrency: {
    name: "Monad",
    symbol: "MON",
    decimals: 18,
  },
  testnet: true,
});

export default function Home() {
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState<any>(null);

  const testPaidEndpoint = async () => {
    try {
      setLoading(true);
      setError(null);
      setResponse(null);

      // Create and connect wallet if not already connected
      let connectedWallet = wallet;
      if (!connectedWallet) {
        connectedWallet = createWallet("io.metamask");
        await connectedWallet.connect({ client });
        setWallet(connectedWallet);
      }

      // Switch to Monad network
      await connectedWallet.switchChain(monadNetwork);

      const account = connectedWallet.getAccount();
      if (!account) {
        throw new Error("Wallet not connected");
      }

      // Use wrapFetchWithPayment to handle the payment flow automatically
      // Parameters: fetch, client, wallet (not account)
      const wrappedFetch = wrapFetchWithPayment(fetch, client, connectedWallet);

      // Make the request - SDK handles payment automatically
      const paidResponse = await wrappedFetch("/api/paid-content");

      if (paidResponse.ok) {
        const data = await paidResponse.json();
        setResponse(data);

        // Redirect to lobby after successful payment
        setTimeout(() => {
          window.location.href = "/lobby";
        }, 2000);
      } else {
        // Better error handling
        const responseText = await paidResponse.text();
        console.error("Response status:", paidResponse.status);
        console.error("Response text:", responseText);

        let errorMessage = "Request failed";
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = responseText || `Request failed with status ${paidResponse.status}`;
        }
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,0,255,0.1),transparent_50%)]"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-gray-900/80 backdrop-blur-xl border border-purple-500/30 rounded-3xl shadow-2xl p-8 md:p-12">
            {/* Glowing header */}
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 mb-4 tracking-tight">
                MONAD AGENT
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                MATCH-MAKING
              </h2>
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
            </div>

            <p className="text-gray-300 text-center mb-8 text-lg">
              Secure your spot in the game room with blockchain verification
            </p>

          <div className="space-y-6">
            {/* Access Button */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <button
                onClick={testPaidEndpoint}
                disabled={loading}
                className="relative w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-white font-bold py-6 px-8 rounded-2xl shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xl uppercase tracking-wider transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    CONNECTING...
                  </span>
                ) : (
                  "⚡ ACCESS GAME ROOM ⚡"
                )}
              </button>
              <p className="text-sm text-gray-400 mt-3 text-center">
                Entry Fee: <span className="text-cyan-400 font-semibold">$0.01 USDC</span> on Monad Network
              </p>
            </div>

            {/* Response Display */}
            {response && (
              <div className="bg-gradient-to-r from-green-900/40 to-cyan-900/40 border border-green-500/50 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <h2 className="text-xl font-bold text-green-400">
                    ✓ ACCESS GRANTED
                  </h2>
                </div>
                <p className="text-white mb-4 text-lg">Entering game lobby...</p>
                <div className="bg-black/40 p-4 rounded-xl overflow-x-auto text-sm border border-green-500/30">
                  <pre className="text-green-300">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 border border-red-500/50 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <h2 className="text-xl font-bold text-red-400">
                    ✗ ACCESS DENIED
                  </h2>
                </div>
                <p className="text-red-200">{error}</p>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="font-bold text-purple-300 mb-3 text-lg flex items-center gap-2">
                <span>🛡️</span> Anti-Bot Protection
              </h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">▹</span>
                  <span>Blockchain verification prevents bot attacks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">▹</span>
                  <span>Payment required for game room access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">▹</span>
                  <span>Secure USDC transaction on Monad testnet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-1">▹</span>
                  <span>Instant access upon payment verification</span>
                </li>
              </ul>
            </div>

            {/* Configuration Info */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="font-bold text-yellow-400 mb-3 text-lg flex items-center gap-2">
                <span>⚙️</span> Requirements
              </h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>MetaMask wallet with Monad testnet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>USDC tokens on Monad testnet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>Active internet connection</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
