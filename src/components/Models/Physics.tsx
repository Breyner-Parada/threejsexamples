import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Physics, RigidBody, RapierRigidBody, quat } from "@react-three/rapier";
import {
  OrbitControls,
  Box,
  KeyboardControls,
  useKeyboardControls,
  Html,
} from "@react-three/drei";
import * as THREE from "three";

const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  jump: "jump",
};

const Model = () => {
  const cubeRef = useRef<RapierRigidBody>(null);
  const kickerRef = useRef<RapierRigidBody>(null);
  const [hover, setHover] = useState<boolean>(false);
  const [start, setStart] = useState<boolean>(false);
  const isOnGround = useRef<boolean>(true);
  const speed = useRef<number>(0.1);

  const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
  const forwardPressed = useKeyboardControls(
    (state) => state[Controls.forward]
  );
  const backPressed = useKeyboardControls((state) => state[Controls.back]);
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);

  const handleMovement = () => {
    if (!isOnGround.current) {
      return;
    }
    if (rightPressed && cubeRef.current) {
      cubeRef.current.applyImpulse({ x: 0.1, y: 0, z: 0 }, true);
    }
    if (leftPressed && cubeRef.current) {
      cubeRef.current.applyImpulse({ x: -0.1, y: 0, z: 0 }, true);
    }

    if (forwardPressed && cubeRef.current) {
      cubeRef.current.applyImpulse({ x: 0, y: 0, z: -0.1 }, true);
    }
    if (backPressed && cubeRef.current) {
      cubeRef.current.applyImpulse({ x: 0, y: 0, z: 0.1 }, true);
    }
  };

  useEffect(() => {
    const checkRef = setInterval(() => {
      if (cubeRef.current) {
        console.log("RigidBody finally available", cubeRef.current);
        clearInterval(checkRef);
      }
    }, 100);

    return () => clearInterval(checkRef);
  }, []);

  useFrame((_, delta) => {
    if (jumpPressed) {
      jump();
    }

    handleMovement();

    if (!start) return;

    const curRotation = quat(kickerRef.current?.rotation());
    const incrementRotation = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      delta * speed.current
    );
    curRotation.multiply(incrementRotation);
    kickerRef.current?.setNextKinematicRotation(curRotation);

    speed.current += delta;
  });

  const jump = () => {
    if (!isOnGround.current) return;
    if (cubeRef.current) {
      const impulse = new THREE.Vector3(0, 5, 0);
      cubeRef.current.applyImpulse(impulse, true);
    }
    console.log("Jumping!");
  };

  return (
    <>
      <Html>
        <button
          className="absolute top-4 left-4 bg-blue-500 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setStart(false);
            speed.current = 0.1;
            if (cubeRef.current) {
              cubeRef.current.setTranslation({ x: -2.5, y: 1, z: 0 }, true);
              cubeRef.current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
            }
            if (kickerRef.current) {
              kickerRef.current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
            }
            isOnGround.current = true;
            setHover(false);
          }}
        >
          RESET
        </button>
      </Html>
      <ambientLight intensity={1} />
      <OrbitControls enableZoom={false} />
      <RigidBody
        ref={cubeRef}
        colliders="cuboid"
        position={[-2.5, 1, 0]}
        onCollisionEnter={({ other }) => {
          if (other.rigidBodyObject && other.rigidBodyObject.name === "floor") {
            isOnGround.current = true;
          }
        }}
        onCollisionExit={({ other }) => {
          if (other.rigidBodyObject && other.rigidBodyObject.name === "floor") {
            isOnGround.current = false;
          }
        }}
      >
        <Box
          onClick={() => setStart(true)}
          onPointerEnter={() => setHover(true)}
          onPointerLeave={() => setHover(false)}
        >
          <meshStandardMaterial color={hover ? "hotpink" : "royalblue"} />
        </Box>
      </RigidBody>

      <RigidBody
        type="kinematicPosition"
        ref={kickerRef}
        position={[0, 0.75, 0]}
      >
        <group position={[2.5, 0, 0]}>
          <Box args={[5, 0.5, 0.5]} position={[0, 0, 0]}>
            <meshStandardMaterial color="orange" />
          </Box>
        </group>
      </RigidBody>

      <RigidBody type="fixed" name="floor">
        <Box args={[10, 1, 10]} position={[0, 0, 0]}>
          <meshStandardMaterial color="springgreen" />
        </Box>
      </RigidBody>
    </>
  );
};

export const PhysicsModel = () => {
  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
    ],
    []
  );
  return (
    <KeyboardControls map={map}>
      <div className="mt-16">
        <h1 className="text-3xl text-center text-black font-bold">
          <span className="text-5xl">🕹️</span> Click on the box to start. Use
          WASD keys to move and Space to jump.
        </h1>
      </div>
      <Canvas
        shadows
        camera={{ position: [10, 10, 10], fov: 30 }}
        style={{ height: "100vh", width: "100vw" }}
      >
        <Suspense fallback={null}>
          <Physics>
            <Model />
          </Physics>
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
};
