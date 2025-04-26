import { Routes, Route, HashRouter  } from "react-router-dom";
import { Home } from "./components/Home";
import { Navbar } from "./components/Navbar";
import { WormHoleCanvas } from "./components/WormholeEffect";
import { MainCanvas } from "./components/MainCanvas";
import { PortalScene } from "./components/PortalScene";
import { RaycasterExample } from "./components/Models/Raycaster";

function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/curvepath"
          element={
            <div className="h-screen">
              <MainCanvas />
            </div>
          }
        />
        <Route
          path="/tunnel"
          element={
            <div className="h-screen">
              <WormHoleCanvas />
            </div>
          }
        />
        <Route path="/portals" element={<PortalScene />} />
        <Route path="/raycaster" element={<RaycasterExample />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
