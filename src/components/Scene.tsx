import { Float, PerspectiveCamera, useScroll } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Background } from "./BackGround";
import { Model } from "./Models/PlaneModel";

export const Scene = () => {
  const numberOfPoints = 12000;
  const cameraRef = useRef<THREE.Group>(null);
  const airplaneRef = useRef<THREE.Group>(null);
  const scroll = useScroll();

  // const getRandomPoints = useMemo(() => {
  //   const points = [];
  //   for (let i = 0; i < 20; i++) {
  //     points.push(
  //       new THREE.Vector3(
  //         Math.random()  * 20,
  //         0,
  //         i * 5
  //       )
  //     );
  //   }
  //   return points;
  // }, []);

  const points = useMemo(() => {
    return [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(-2, 0, 20),
      new THREE.Vector3(-3, 0, 30),
      new THREE.Vector3(0, 0, 40),
      new THREE.Vector3(5, 0, 50),
      new THREE.Vector3(7, 0, 60),
      new THREE.Vector3(5, 0, 70),
      new THREE.Vector3(0, 0, 80),
      new THREE.Vector3(0, 0, 90),
      new THREE.Vector3(0, 0, 100),
    ];
  }, []);

  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5),
    [points]
  );

  const linePoints = useMemo(() => {
    return curve.getPoints(numberOfPoints);
  }, [curve]);

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.2);
    shape.lineTo(0, 0.2);
    return shape;
  }, []);

  useFrame((_state, delta) => {
    const currPointIndex = Math.min(
      Math.round(scroll.offset * linePoints.length),
      linePoints.length - 1
    );
    const currPoint = linePoints[currPointIndex];
    const pointAhead =
      linePoints[Math.min(currPointIndex + 1, linePoints.length - 1)];

    const xDisplacement = (pointAhead.x - currPoint.x) * 80;

    const angleRotation =
      (xDisplacement < 0 ? 1 : -1) *
      Math.min(Math.abs(xDisplacement), Math.PI / 3);

    const targetQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        airplaneRef.current!.rotation.x,
        airplaneRef.current!.rotation.y,
        angleRotation
      )
    );

    const targetCameraQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        cameraRef.current!.rotation.x,
        angleRotation,
        cameraRef.current!.rotation.z
      )
    );

    airplaneRef.current!.quaternion.slerp(targetQuaternion, delta * 4);
    cameraRef.current!.quaternion.slerp(targetCameraQuaternion, delta * 4);

    cameraRef.current!.position.lerp(currPoint, delta * 24);
  });
  return (
    <>
      <group position-y={-3}>
        {/* <Line points={linePoints} color="blue" lineWidth={10} opacity={0.5} /> */}
        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                steps: numberOfPoints,
                bevelEnabled: false,
                extrudePath: curve,
              },
            ]}
          />
          <meshStandardMaterial color="blue" opacity={0.7} transparent />
        </mesh>
      </group>
      <group ref={cameraRef}>
        <Background />
        <PerspectiveCamera
          rotation={[0, -Math.PI, 0]}
          position={[0, 10, -40]}
          fov={40}
          makeDefault
        />
        <group ref={airplaneRef}>
          <Float floatIntensity={2} speed={2}>
            <Model />
          </Float>
        </group>
      </group>
    </>
  );
};
