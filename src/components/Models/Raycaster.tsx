import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export const RaycasterExample = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const InteractiveBlocks = () => {
    const raycaster = new THREE.Raycaster();
    const { camera } = useThree();
    const blocks = useRef<THREE.Group>(null);

    useEffect(() => {
      const handleMouseMove = (event: MouseEvent) => {
        const coords = new THREE.Vector2(
          (event.clientX / window.innerWidth) * 2 - 1,
          -((event.clientY / window.innerHeight) * 2 - 1)
        );

        raycaster.setFromCamera(coords, camera);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useFrame(() => {
      camera.updateProjectionMatrix();
      const intersects = raycaster.intersectObjects(
        blocks.current?.children || [],
        true
      );

      if (intersects.length > 0) {
        const firstIntersected = intersects[0].object as THREE.Mesh;
        console.log("Intersected object:", firstIntersected);
        // if (hoveredIndex !== null) {
        //     const hoveredBlock = blocks.current[hoveredIndex];
        //     if (hoveredBlock) {
        //         if (hoveredBlock.material instanceof THREE.MeshStandardMaterial) {
        //             hoveredBlock.material.color.set("orange");
        //         }
        //     }
        // }
        // const intersectedBlock = blocks.current.find(
        //     (block) => block === firstIntersected
        // );
        // if (intersectedBlock) {
        //     if (intersectedBlock.material instanceof THREE.MeshStandardMaterial) {
        //         intersectedBlock.material.color.set("hotpink");
        //     }
        //     setHoveredIndex(blocks.current.indexOf(intersectedBlock));
        // }
      }
    });

    return (
      <group ref={blocks}>
        <mesh
          position={[-1, 0, 0]}
          onPointerEnter={() => setHoveredIndex(0)}
          onPointerLeave={() => setHoveredIndex(null)}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={
              hoveredIndex === 0
                ? new THREE.Color(Math.random(), Math.random(), Math.random())
                : "blue"
            }
          />
        </mesh>
        <mesh
          position={[1, 0, 0]}
          onPointerEnter={() => setHoveredIndex(1)}
          onPointerLeave={() => setHoveredIndex(null)}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={
              hoveredIndex === 1
                ? new THREE.Color(Math.random(), Math.random(), Math.random())
                : "red"
            }
          />
        </mesh>
        <mesh
          position={[0, 1, 0]}
          onPointerEnter={() => setHoveredIndex(2)}
          onPointerLeave={() => setHoveredIndex(null)}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={
              hoveredIndex === 2
                ? new THREE.Color(Math.random(), Math.random(), Math.random())
                : "green"
            }
          />
        </mesh>
        <mesh
          position={[0, -1, 0]}
          onPointerEnter={() => setHoveredIndex(3)}
          onPointerLeave={() => setHoveredIndex(null)}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={
              hoveredIndex === 3
                ? new THREE.Color(Math.random(), Math.random(), Math.random())
                : "yellow"
            }
          />
        </mesh>
      </group>
    );
  };

  return (
    <Canvas style={{ height: "100vh" }}>
      <OrbitControls />
      <ambientLight intensity={3} />
      <InteractiveBlocks />
    </Canvas>
  );
};
