import { Canvas } from "@react-three/fiber";
import { Portals } from "./Portals";
import { Suspense } from "react";
import { Loader } from "./Loader";
import { OrbitControls } from "@react-three/drei";

export const PortalScene = () => {
  return (
    <div className="h-screen">
      <div className="flex items-center justify-center mt-14">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h1 className="font-semibold text-2xl">Welcome to Portals</h1>
          <p className="text-gray-500">
            Double click on the scene to navigate through different worlds
          </p>
        </div>
      </div>
      <Canvas gl={{ antialias: true }}>
        <OrbitControls enableZoom={false} />
        <Suspense fallback={<Loader />}>
          <Portals />
        </Suspense>
      </Canvas>
    </div>
  );
};
