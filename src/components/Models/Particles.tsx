import { useRef, useEffect } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const Particles = () => {
  const particlesRef = useRef<THREE.Points>(null);

  useEffect(() => {
    const particles = particlesRef.current;
    if (particles) {
      const positions = new Float32Array(1000 * 3); // 1000 particles
      for (let i = 0; i < 1000; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10; // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
      }
      particles.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
    }
  }, []);

useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
        const particles = particlesRef.current;
        if (particles) {
            const rect = document.body.getBoundingClientRect();
            const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            const positions = particles.geometry.attributes.position
                .array as Float32Array;
            for (let i = 0; i < positions.length; i += 3) {
                const dx = positions[i] - mouseX * 5;
                const dy = positions[i + 1] - mouseY * 5;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const force = Math.max(0, 1 - distance / 2);
                positions[i] += dx * force * 0.05;
                positions[i + 1] += dy * force * 0.05;
            }
            particles.geometry.attributes.position.needsUpdate = true;
        }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
        window.removeEventListener("mousemove", handleMouseMove);
    };
}, []);

  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial size={0.05} color="black" />
    </points>
  );
};

export const ParticleCursor = () => {
  return (
    <Canvas style={{ height: "100vh", width: "100vw" }}>
      <ambientLight />
      <OrbitControls />
      <Particles />
    </Canvas>
  );
};
