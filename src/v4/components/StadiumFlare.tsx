import React, { useMemo, useRef } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Radial glow sprite texture, generated in code. Hot core + warm halo. */
function glowTexture(): THREE.Texture {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, "rgba(255,252,240,1)");
  grad.addColorStop(0.12, "rgba(255,244,200,1)");
  grad.addColorStop(0.35, "rgba(255,214,120,0.55)");
  grad.addColorStop(1, "rgba(255,190,80,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

const LightRig: React.FC = () => {
  const frame = useCurrentFrame();
  const group = useRef<THREE.Group>(null);
  const tex = useMemo(() => glowTexture(), []);

  // Two arcs of stadium floodlights + crowd glints. Each light = hot core + halo.
  const lights = useMemo(() => {
    const arr: { pos: [number, number, number]; s: number; cool?: boolean }[] = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 15 - 0.5) * Math.PI * 0.85;
      arr.push({ pos: [Math.sin(a) * 1500, 430 - Math.cos(a) * 150, -950], s: 200 + (i % 3) * 50 });
    }
    for (let i = 0; i < 8; i++) {
      const a = (i / 7 - 0.5) * Math.PI * 1.1;
      arr.push({ pos: [Math.sin(a) * 1800, 560 - Math.cos(a) * 100, -1150], s: 150, cool: true });
    }
    for (let i = 0; i < 110; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 2700, 200 + Math.random() * 220, -400 - Math.random() * 500],
        s: 10 + Math.random() * 18,
      });
    }
    return arr;
  }, []);

  useFrame(({ camera }) => {
    const p = frame / 30;
    // slow majestic drift: push in + tiny sway
    camera.position.set(Math.sin(p * 0.25) * 40, Math.sin(p * 0.18) * 20, 60 - p * 6);
    camera.lookAt(0, 120, -800);
    if (group.current) group.current.rotation.z = Math.sin(p * 0.1) * 0.01;
  });

  const intensity = Math.min(1, frame / 45); // fade up over 1.5s

  return (
    <group ref={group}>
      <fog attach="fog" args={["#05070c", 700, 2600]} />
      {lights.map((l, i) => (
        <group key={i} position={l.pos}>
          {/* halo */}
          <sprite scale={[l.s, l.s, 1]}>
            <spriteMaterial
              map={tex} color={l.cool ? "#bcd6ff" : "#ffffff"} transparent
              opacity={intensity * (l.cool ? 0.4 : 0.75)}
              blending={THREE.AdditiveBlending} depthWrite={false} fog={false}
            />
          </sprite>
          {/* hot core */}
          <sprite scale={[l.s * 0.28, l.s * 0.28, 1]}>
            <spriteMaterial
              map={tex} color={l.cool ? "#dcebff" : "#fffbe8"} transparent
              opacity={intensity}
              blending={THREE.AdditiveBlending} depthWrite={false} fog={false}
            />
          </sprite>
        </group>
      ))}
      {/* volumetric shafts from the rigs */}
      {[-700, -350, 0, 350, 700].map((x, i) => (
        <mesh key={`shaft${i}`} position={[x, 100, -700]} rotation={[0.25, 0, (i - 2) * 0.09]}>
          <coneGeometry args={[180, 1400, 20, 1, true]} />
          <meshBasicMaterial
            color="#ffedb8" transparent opacity={0.06 * intensity}
            blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      {/* dark stands silhouette */}
      <mesh position={[0, -40, -500]}>
        <planeGeometry args={[3600, 700]} />
        <meshBasicMaterial color="#070b12" transparent opacity={0.88} depthWrite={false} />
      </mesh>
      {/* pitch glow at the bottom */}
      <mesh position={[0, -330, -600]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3200, 900]} />
        <meshBasicMaterial color="#1d5c34" transparent opacity={0.5 * intensity} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* crowd shimmer band */}
      <mesh position={[0, -120, -490]}>
        <planeGeometry args={[3400, 260]} />
        <meshBasicMaterial color="#3a2c14" transparent opacity={0.5 * intensity} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
};

/** WebGL stadium light flare — prologue. Fades up, slow push-in. */
export const StadiumFlare: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const { width, height } = useVideoConfig();
  return (
    <div style={{ position: "absolute", inset: 0, ...style }}>
      <ThreeCanvas width={width} height={height} gl={{ antialias: true, alpha: false }} flat camera={{ fov: 42, near: 10, far: 4000, position: [0, 0, 60] }}>
        <color attach="background" args={["#05070c"]} />
        <LightRig />
      </ThreeCanvas>
    </div>
  );
};
