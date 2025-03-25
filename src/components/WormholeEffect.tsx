import { useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  ScrollControls,
  useScroll,
} from "@react-three/drei";
import * as THREE from "three";
import { generateTunnelPoints } from "./utils/TunnelPathPoint";
import { Overlay } from "./Overlay";

const Tunnel = () => {
  const points = useMemo(() => generateTunnelPoints(500, 5, 30), []);

  const printValue = <T,>(value: Array<T>): Array<T> => {
    console.log(value);
    return value;
  };


  printValue([1, 2, 3, 4, 5]);

  // useFrame(({ camera }) => {
  //   const time = performance.now() * 0.0003;
  //   const loopTime = 20;
  //   const t = (time % loopTime) / loopTime;

  //   const position = new THREE.Vector3();
  //   const tangent = new THREE.Vector3();

  //   const curve = new THREE.CatmullRomCurve3(points);
  //   curve.getPointAt(t, position);
  //   curve.getTangentAt(t, tangent);

  //   camera.position.copy(position);
  //   camera.lookAt(position.clone().add(tangent));

  // });

  const scroll = useScroll();
  const curve = new THREE.CatmullRomCurve3(points);

  useFrame(({ camera }) => {
    const t = scroll.offset;
    const position = new THREE.Vector3();
    const tangent = new THREE.Vector3();

    curve.getPointAt(t, position);
    curve.getTangentAt(t, tangent);

    camera.position.copy(position);
    camera.lookAt(position.clone().add(tangent));
  });

  // create edges geometry
  const edgesGeometry = new THREE.EdgesGeometry(
    new THREE.TubeGeometry(curve, 100, 0.8, 20, false),
    0.008
  );
  const edgesMaterial = new THREE.LineBasicMaterial({
    color: "black",
    linewidth: 2,
  });
  const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

  return (
    <mesh>
      <primitive object={edges} />
      <tubeGeometry args={[curve, 100, 0.8, 20, false]} />
      {/* <meshStandardMaterial
        color="white"
        wireframe
        // metalness={0.5}
        side={THREE.DoubleSide}
      /> */}
    </mesh>
  );
};

export const WormHoleCanvas = () => {
  return (
    <Canvas>
      <Environment preset="apartment" />
      <ScrollControls pages={3} damping={0.3}>
        <Overlay />
        <Tunnel />
      </ScrollControls>
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
};
