import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Simple 3D bar chart using Three.js (react-three-fiber)
const Bars = ({ data, xAxis, yAxis }) => {
  if (!xAxis || !yAxis || !data.length) return null;
  const max = Math.max(...data.map(row => Number(row[yAxis]) || 0));
  return (
    <group>
      {data.map((row, i) => {
        const height = (Number(row[yAxis]) || 0) / (max || 1) * 2;
        return (
          <mesh key={i} position={[i - data.length / 2, height / 2, 0]}>
            <boxGeometry args={[0.8, height, 0.8]} />
            <meshStandardMaterial color={'#3b82f6'} />
          </mesh>
        );
      })}
    </group>
  );
};

const Excel3DChart = ({ data, xAxis, yAxis }) => {
  if (!xAxis || !yAxis || !data.length) return null;
  return (
    <div style={{ height: 400, width: '100%' }}>
      <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 7]} intensity={1} />
        <Bars data={data} xAxis={xAxis} yAxis={yAxis} />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Excel3DChart;
