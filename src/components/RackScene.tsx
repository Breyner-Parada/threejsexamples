import { Canvas } from "@react-three/fiber";
// import { Rack } from "./Models/Rack";
import { SwitchRackModel } from "./Models/Switch_rack";
import { Environment, OrbitControls, ScrollControls } from "@react-three/drei";

export const RackScene = () => {
  return (
    <Canvas camera={{ position: [-1, 0.5, 1.5], fov: 50 }}>
      <OrbitControls enableZoom={false} />
      <ScrollControls pages={3} damping={0.1}>
        <Environment preset="apartment" />
        {/* <Rack /> */}
        <SwitchRackModel />
      </ScrollControls>
    </Canvas>
  );
};
