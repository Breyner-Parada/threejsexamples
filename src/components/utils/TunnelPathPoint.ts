import * as THREE from "three";

export const generateTunnelPoints = (numPoints = 10, radius = 5, height = 30) => {
  const points = [];

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2; // Spiral effect
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const z = (i / numPoints) * height - height / 2; // Spread points in Z

    points.push(new THREE.Vector3(x, y, z));
  }

  // Create a smooth tunnel curve
  const curve = new THREE.CatmullRomCurve3(points, false); // `false` keeps it open
  return curve.getPoints(4500); // Get smooth interpolated points
};

// Example usage:
const tunnelPoints = generateTunnelPoints();
console.log(tunnelPoints); // Array of Vector3 points
