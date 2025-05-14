import React, { JSX, useEffect, useState } from "react";
import {
  CameraControls,
  Environment,
  MeshPortalMaterial,
  RoundedBox,
  useCursor,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import { WomanOffice } from "./Models/Indian_office_woman";
import { Phoenix } from "./Models/Phoenix_bird";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";

export const Portals = () => {
  const [activeScene, setActiveScene] = useState<string>("");
  const [isHovered, setIsHovered] = useState<string>("");
  const controlCamera = React.useRef<CameraControls>(null);
  const scene = useThree((state) => state.scene);

  useCursor(isHovered !== "");

  useEffect(() => {
    if (activeScene) {
      const targetPosition = new THREE.Vector3();
      scene.getObjectByName(activeScene)?.getWorldPosition(targetPosition);
      controlCamera.current?.setLookAt(
        0,
        0,
        4,
        targetPosition.x,
        targetPosition.y,
        targetPosition.z,
        true
      );
    } else {
      controlCamera.current?.setLookAt(0, 0, 6, 0, 0, 0, true);
    }
  }, [activeScene, scene]);

  return (
    <>
      <CameraControls
        ref={controlCamera}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 8}
      />
      <ambientLight intensity={0.5} />
      <Environment preset="city" />
      <pointLight position={[10, 10, 10]} />
      <SceneStage
        textureImg="/textures/office.jpeg"
        name="Woman"
        color="white"
        activeScene={activeScene}
        setActiveScene={setActiveScene}
        setIsHovered={setIsHovered}
      >
        <WomanOffice props={{ position: [0, -2.5, 0] }} isHovered={isHovered} />
      </SceneStage>

      <SceneStage
        textureImg="/textures/sky.jpg"
        position-x={-3}
        rotation-y={Math.PI / 8}
        name="Phoenix"
        activeScene={activeScene}
        setActiveScene={setActiveScene}
        setIsHovered={setIsHovered}
      >
        <Phoenix
          props={{ scale: 0.004, position: [0, -1, 0] }}
          isHovered={isHovered}
        />
      </SceneStage>

      <SceneStage
        textureImg="/textures/street.jpg"
        position-x={3}
        rotation-y={-Math.PI / 8}
        name="Fountain"
        activeScene={activeScene}
        setActiveScene={setActiveScene}
        setIsHovered={setIsHovered}
      >
        <Phoenix
          props={{ scale: 0.004, position: [0, -1, 0] }}
          isHovered={isHovered}
        />
      </SceneStage>
    </>
  );
};

type SceneStageProps = JSX.IntrinsicElements["group"] & {
  children: React.ReactNode;
  textureImg: string;
  name: string;
  color?: string;
  activeScene: string;
  setActiveScene: (scene: string) => void;
  setIsHovered: (hovered: string) => void;
};

const SceneStage = ({
  children,
  textureImg,
  name,
  activeScene,
  setActiveScene,
  setIsHovered,
  ...props
}: SceneStageProps) => {
  const texture = useTexture(textureImg);
  const portalMaterial = React.useRef(null);

  useFrame((_, delta) => {
    const worldOpen = activeScene === name;
    if (portalMaterial.current) {
      easing.damp(
        portalMaterial.current,
        "blend",
        worldOpen ? 1 : 0,
        0.1,
        delta
      );
    }
  });

  return (
    <group {...props}>
      <RoundedBox
        args={[2, 3, 0.1]}
        onDoubleClick={() => setActiveScene(activeScene === name ? "" : name)}
        name={name}
        onPointerEnter={() => setIsHovered(name)}
        onPointerLeave={() => setIsHovered("")}
      >
        <MeshPortalMaterial
          resolution={256}
          blur={0}
          side={THREE.BackSide}
          ref={portalMaterial}
        >
          <ambientLight intensity={0.5} />
          <Environment preset="city" />
          {children}
          <mesh>
            <sphereGeometry args={[5, 64, 64]} />
            <meshStandardMaterial map={texture} side={THREE.BackSide} />
          </mesh>
        </MeshPortalMaterial>
      </RoundedBox>
    </group>
  );
};
