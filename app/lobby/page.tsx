"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Float, Text3D, Center } from "@react-three/drei";
import { useState, useEffect } from "react";

function FloatingPlatform() {
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh position={[0, -1, 0]} receiveShadow>
        <cylinderGeometry args={[4, 4, 0.5, 32]} />
        <meshStandardMaterial
          color="#7c3aed"
          metalness={0.8}
          roughness={0.2}
          emissive="#7c3aed"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Platform glow ring */}
      <mesh position={[0, -1.25, 0]}>
        <torusGeometry args={[4.2, 0.1, 16, 100]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={1}
        />
      </mesh>
    </Float>
  );
}

function PlayerModel() {
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
      <mesh position={[0, 0, 0]} castShadow>
        {/* Body */}
        <boxGeometry args={[0.8, 1.5, 0.5]} />
        <meshStandardMaterial
          color="#ec4899"
          metalness={0.6}
          roughness={0.3}
          emissive="#ec4899"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#06b6d4"
          metalness={0.8}
          roughness={0.2}
          emissive="#06b6d4"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Glow effect */}
      <pointLight position={[0, 1.2, 0]} intensity={2} distance={3} color="#06b6d4" />
    </Float>
  );
}

function Scene3D() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7c3aed" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow
        color="#06b6d4"
      />

      {/* Stars background */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Platform */}
      <FloatingPlatform />

      {/* Player */}
      <PlayerModel />

      {/* Particle effects */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Float
          key={i}
          speed={2 + Math.random() * 2}
          rotationIntensity={1}
          floatIntensity={2}
        >
          <mesh
            position={[
              (Math.random() - 0.5) * 10,
              Math.random() * 8 - 2,
              (Math.random() - 0.5) * 10,
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color={Math.random() > 0.5 ? "#7c3aed" : "#06b6d4"}
              emissive={Math.random() > 0.5 ? "#7c3aed" : "#06b6d4"}
              emissiveIntensity={2}
            />
          </mesh>
        </Float>
      ))}

      {/* Camera controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={5}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

export default function LobbyPage() {
  const [players, setPlayers] = useState(1);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    // Simulate players joining
    const playerInterval = setInterval(() => {
      setPlayers((prev) => (prev < 8 ? prev + Math.floor(Math.random() * 2) : prev));
    }, 3000);

    // Countdown timer
    const timerInterval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(playerInterval);
      clearInterval(timerInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 3, 10], fov: 50 }} shadows>
          <Scene3D />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top Bar */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="bg-gray-900/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl px-6 py-3">
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                GAME LOBBY
              </h1>
            </div>

            <div className="bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl px-6 py-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-bold">CONNECTED</span>
                </div>
                <div className="w-px h-6 bg-gray-700"></div>
                <div className="text-white font-mono">
                  Players: <span className="text-cyan-400 font-bold">{players}/8</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Message */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="bg-gray-900/80 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-12 max-w-2xl">
              <div className="mb-6">
                <div className="inline-block bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full p-1 mb-4">
                  <div className="bg-gray-900 rounded-full px-8 py-3">
                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                      {timer}
                    </span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Waiting for Players
                </h2>
                <p className="text-gray-400">
                  Game will start when lobby is full or timer reaches zero
                </p>
              </div>

              {/* Player Grid */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-xl border-2 transition-all duration-500 ${
                      i < players
                        ? "border-cyan-500 bg-gradient-to-br from-cyan-900/40 to-purple-900/40"
                        : "border-gray-700 bg-gray-800/40"
                    }`}
                  >
                    <div className="h-full flex items-center justify-center">
                      {i < players ? (
                        <div className="text-center">
                          <div className="w-8 h-8 bg-cyan-400 rounded-full mx-auto mb-1"></div>
                          <div className="text-xs text-cyan-400 font-bold">P{i + 1}</div>
                        </div>
                      ) : (
                        <div className="text-gray-600 text-2xl">?</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider"
                onClick={() => (window.location.href = "/")}
              >
                ← Leave Lobby
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gray-900/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Anti-Bot:</span>
                    <span className="text-green-400 font-bold">✓ ACTIVE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Network:</span>
                    <span className="text-purple-400 font-bold">Monad Testnet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Payment:</span>
                    <span className="text-cyan-400 font-bold">✓ VERIFIED</span>
                  </div>
                </div>
                <div className="text-gray-500 font-mono text-xs">
                  Lobby ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
