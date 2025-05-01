// import { OrbitControls } from "@react-three/drei";
import { Environment } from "@react-three/drei";
import { ThreeEvent, useThree, Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface DraggableObjectProps {
  children: React.ReactNode;
  position?: [number, number, number];
  name?: string;
  onDragStart?: (event: ThreeEvent<PointerEvent>) => void;
  onDragEnd?: (event: ThreeEvent<PointerEvent>) => void;
}

const DraggableObject = ({
  children,
  position,
  name,
}: DraggableObjectProps) => {
  const ref = useRef<THREE.Group>(null);
  const planeRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const raycaster = new THREE.Raycaster();
  const clickMouse = new THREE.Vector2();
  const dragMouse = new THREE.Vector2();
  const objectDragging = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    if (!ref.current || !planeRef.current) return;

    const handleDrag = (event: PointerEvent) => {
      if (!ref.current) return;

      if (isDragging && objectDragging.current) {
        dragMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        dragMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(dragMouse, camera);
        const intersects = planeRef.current
          ? raycaster.intersectObject(planeRef.current, true)
          : [];

        if (intersects.length > 0) {
          for (const child of intersects) {
            if (objectDragging.current) {
              objectDragging.current.position.x = child.point.x; // Offset to avoid intersection with the plane
            }
            if (objectDragging.current) {
              objectDragging.current.position.z = child.point.z;
            }
          }
        }
      }
    };

    const handleDragEnd = () => {
      if (isDragging) {
        setIsDragging(false);
        objectDragging.current = null;
        console.log("Dragging ended");
      }
    };

    const clickHandler = (event: PointerEvent) => {
      clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(clickMouse, camera);
      const intersects = raycaster.intersectObjects(
        ref.current?.children || [],
        true
      );

      if (intersects.length > 0) {
        objectDragging.current = intersects[0].object;
        setIsDragging(true);
        console.log("Dragging started:", objectDragging.current?.name);
      }
    };

    window.addEventListener("pointerdown", clickHandler);
    window.addEventListener("pointermove", handleDrag);
    window.addEventListener("pointerup", handleDragEnd);
    window.addEventListener("pointerleave", handleDragEnd);

    return () => {
      window.removeEventListener("pointerdown", clickHandler);
      window.removeEventListener("pointermove", handleDrag);
      window.removeEventListener("pointerup", handleDragEnd);
      window.removeEventListener("pointerleave", handleDragEnd);
    };
  }, [isDragging]);

  return (
    <>
      {/* Plane */}
      <mesh ref={planeRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <boxGeometry args={[10, 10, 0.3]} />
        <meshStandardMaterial color="lightgray" />
      </mesh>
      <group ref={ref} name={name} position={position}>
        {children}
      </group>
    </>
  );
};

export const DraggableObjects = () => {
  return (
    <Canvas
      style={{ height: "100vh" }}
      shadows
      camera={{ position: [0, 5, 10], fov: 50 }}
    >
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} />
      <Environment preset="city" />
      {/* <OrbitControls /> */}
      <DraggableObject>
        {/* Draggable Sphere */}
        <mesh position={[0, 0.66, 0]} name="sphere" castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="red" />
        </mesh>

        {/* Draggable Cylinder */}
        <mesh position={[2, 0.66, 0]} name="cylinder" castShadow>
          <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
          <meshStandardMaterial color="blue" />
        </mesh>

        {/* Draggable Box */}

        <mesh position={[-2, 0.66, 0]} name="box" castShadow>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="green" />
        </mesh>
      </DraggableObject>
    </Canvas>
  );
};
