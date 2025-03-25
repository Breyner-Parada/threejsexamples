import { ScrollControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Cloud } from "./Models/Cloud_test";
import { Scene } from "./Scene";

export const MainCanvas = () => {
  return (
    <Canvas gl={{ antialias: true }}>
      <ScrollControls pages={5} damping={0.3}>
        {/* <OrbitControls enableZoom={false} /> */}
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Scene />
        <Cloud position={[50, 20, 50]} scale={2} />
        <Cloud position={[-50, 20, 50]} scale={4} />
        <Cloud position={[-30, 10, 40]} scale={2} />
        <Cloud position={[30, 10, 40]} scale={3} />
        <Cloud position={[-20, 5, 20]} scale={2} />
      </ScrollControls>
    </Canvas>
  );
};
