import React, { useMemo, useRef } from "react";
import { useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useFrame } from "@react-three/fiber";
import { useVideoConfig } from "remotion";
import * as THREE from "three";

const COUNT = 650;
const LIFE = 55; // frames

const Burst: React.FC = () => {
  const frame = useCurrentFrame();
  const points = useRef<THREE.Points>(null);
  const flash = useRef<THREE.Mesh>(null);

  const { pos0, vel, col, size } = useMemo(() => {
    const pos0 = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const size = new Float32Array(COUNT);
    const gold = new THREE.Color("#ffd75e");
    const deep = new THREE.Color("#c77f1a");
    const white = new THREE.Color("#fff6d8");
    for (let i = 0; i < COUNT; i++) {
      // radial burst, biased upward like a celebration eruption
      const a = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 0.5);
      const sp = 12 + Math.random() * 30;
      pos0[i * 3] = Math.cos(a) * r * 60;
      pos0[i * 3 + 1] = Math.sin(a) * r * 40 - 60;
      pos0[i * 3 + 2] = (Math.random() - 0.5) * 120;
      vel[i * 3] = Math.cos(a) * sp;
      vel[i * 3 + 1] = Math.abs(Math.sin(a)) * sp * 0.9 + 8 + Math.random() * 14;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 8;
      const c = Math.random() < 0.25 ? white : Math.random() < 0.6 ? gold : deep;
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      size[i] = 5 + Math.random() * 13;
    }
    return { pos0, vel, col, size };
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos0.slice(), 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  }, [pos0, col]);

  useFrame(() => {
    const t = Math.min(frame, LIFE) / 30; // seconds since burst
    const p = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      const damp = Math.exp(-t * 1.6);
      p.setXYZ(
        i,
        pos0[i * 3] + vel[i * 3] * t * 22 * damp + vel[i * 3] * t * 6,
        pos0[i * 3 + 1] + vel[i * 3 + 1] * t * 22 * damp - 130 * t * t,
        pos0[i * 3 + 2] + vel[i * 3 + 2] * t * 10
      );
    }
    p.needsUpdate = true;
    if (points.current) {
      const m = points.current.material as THREE.PointsMaterial;
      m.opacity = frame < 30 ? 1 : Math.max(0, 1 - (frame - 30) / (LIFE - 30));
    }
    if (flash.current) {
      const m = flash.current.material as THREE.MeshBasicMaterial;
      const fp = Math.min(1, frame / 10);
      m.opacity = 0.6 * (1 - fp);
      const s = 1 + fp * 2.4;
      flash.current.scale.set(s, s * 0.62, 1);
    }
  });

  return (
    <group>
      <mesh ref={flash}>
        <planeGeometry args={[900, 900]} />
        <meshBasicMaterial color="#ffe9a8" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <points ref={points} geometry={geo}>
        <pointsMaterial size={15} vertexColors transparent opacity={1} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>
    </group>
  );
};

/** Gold particle goal burst — transparent overlay, mount it on a goal cut. */
export const GoalBurst: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const { width, height } = useVideoConfig();
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", ...style }}>
      <ThreeCanvas width={width} height={height} gl={{ antialias: true, alpha: true }} camera={{ fov: 40, near: 10, far: 3000, position: [0, 0, 1100] }}>
        <Burst />
      </ThreeCanvas>
    </div>
  );
};
