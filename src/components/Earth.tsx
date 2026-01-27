'use client';

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Sphere, useTexture, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { queryMyCityFootprints } from "../api/my-city"

interface City {
  name: string;
  lat: number;
  lng: number;
  color?: string;
  isMajor?: boolean;
}

const earthRadius = 4;

const convertGeoTo3D = (radius: number, lat: number, lng: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  return {
    x: -radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  };
};

// 主要世界城市数据
const MAJOR_CITIES: City[] = [
  { name: "北京", lat: 39.9042, lng: 116.4074, isMajor: true },
  { name: "上海", lat: 31.2304, lng: 121.4737, isMajor: true },
  { name: "伦敦", lat: 51.5074, lng: -0.1278, isMajor: true },
  { name: "纽约", lat: 40.7128, lng: -74.0060, isMajor: true },
  { name: "巴黎", lat: 48.8566, lng: 2.3522, isMajor: true },
  { name: "东京", lat: 35.6762, lng: 139.6503, isMajor: true },
  { name: "悉尼", lat: -33.8688, lng: 151.2093, isMajor: true },
  { name: "迪拜", lat: 25.2048, lng: 55.2708, isMajor: true },
  { name: "里约热内卢", lat: -22.9068, lng: -43.1729, isMajor: true },
  { name: "莫斯科", lat: 55.7558, lng: 37.6173, isMajor: true },
];

function CityMarker({ city, radius = 4 }: { city: City; radius?: number }) {
  const groupRef = useRef<THREE.Group>(null!);
  const [isVisible, setIsVisible] = useState(true);
  const pos = convertGeoTo3D(radius, city.lat, city.lng);
  const position = new THREE.Vector3(pos.x, pos.y, pos.z);
  const vec = new THREE.Vector3();

  useFrame(({ camera }) => {
    if (groupRef.current) {
      vec.copy(position);
      groupRef.current.updateWorldMatrix(true, false);
      vec.applyMatrix4(groupRef.current.matrixWorld);
      const directionToCamera = vec.clone().sub(camera.position).normalize();
      const normal = vec.clone().normalize();
      const dotProduct = normal.dot(directionToCamera);
      setIsVisible(dotProduct < 0.2);
    }
  });

  const markerColor = city.isMajor ? "#60a5fa" : (city.color || "#4ade80");

  return (
    <group ref={groupRef} position={position}>
      <Float speed={city.isMajor ? 1 : 2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Sphere args={[city.isMajor ? 0.04 : 0.08, 16, 16]} visible={isVisible}>
          <meshStandardMaterial 
            color={markerColor} 
            emissive={markerColor}
            emissiveIntensity={city.isMajor ? 1 : 2}
            toneMapped={false}
          />
        </Sphere>
      </Float>
      <Html center distanceFactor={10}>
        <div
          className="pointer-events-none select-none whitespace-nowrap"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.5s ease-in-out',
            transform: 'translateY(-15px)'
          }}
        >
          <div className={`backdrop-blur-md border text-white px-2 py-0.5 rounded-full font-medium shadow-xl flex items-center gap-1.5 ${
            city.isMajor ? 'bg-blue-500/30 border-blue-400/20 text-[8px]' : 'bg-black/60 border-white/20 text-[10px]'
          }`}>
            <div className={`w-1 h-1 rounded-full animate-pulse ${city.isMajor ? 'bg-blue-400' : 'bg-green-400'}`} />
            {city.name}
          </div>
        </div>
      </Html>
    </group>
  );
}

function WorldBorders({ radius }: { radius: number }) {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch('/world-borders.json')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("Failed to load borders:", err));
  }, []);

  const borderLines = useMemo(() => {
    if (!geoData) return null;

    const lines: JSX.Element[] = [];
    geoData.features.forEach((feature: any, idx: number) => {
      const { type, coordinates } = feature.geometry;
      
      const processCoords = (coords: number[][]) => {
        const points: THREE.Vector3[] = [];
        coords.forEach(coord => {
          const pos = convertGeoTo3D(radius + 0.01, coord[1], coord[0]);
          points.push(new THREE.Vector3(pos.x, pos.y, pos.z));
        });
        return points;
      };

      if (type === "Polygon") {
        coordinates.forEach((polygon: any, pIdx: number) => {
          const points = processCoords(polygon);
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          lines.push(
            <line key={`border-${idx}-${pIdx}`} geometry={geometry}>
              <lineBasicMaterial color="#ffffff" transparent opacity={0.2} />
            </line>
          );
        });
      } else if (type === "MultiPolygon") {
        coordinates.forEach((multi: any, mIdx: number) => {
          multi.forEach((polygon: any, pIdx: number) => {
            const points = processCoords(polygon);
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            lines.push(
              <line key={`border-${idx}-${mIdx}-${pIdx}`} geometry={geometry}>
                <lineBasicMaterial color="#ffffff" transparent opacity={0.2} />
              </line>
            );
          });
        });
      }
    });
    return lines;
  }, [geoData, radius]);

  return <group>{borderLines}</group>;
}

function Atmosphere({ radius }: { radius: number }) {
  return (
    <mesh>
      <sphereGeometry args={[radius * 1.02, 64, 64]} />
      <meshPhongMaterial
        color="#4ca9ff"
        transparent
        opacity={0.1}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function Earth3D() {
  const earthRef = useRef<THREE.Mesh>(null);
  const [isautorotate, setIsautorotate] = useState(true);
  const [cities, setCities] = useState<City[]>([])

  const axialTilt = THREE.MathUtils.degToRad(23.5);
  const rotationAxis = new THREE.Vector3(
    Math.sin(axialTilt),
    Math.cos(axialTilt),
    0
  ).normalize();

  const earthTexture = useTexture({
    map: '/images/earth-texture.jpg',
  });

  const getMyTravelCity = async () => {
    try {
      const response = await queryMyCityFootprints();
      if (response?.data?.data) {
        const arr = response.data.data.map(it => ({
          name: it.cityName,
          lat: it.location.coordinates[1],
          lng: it.location.coordinates[0],
          color: '#4ade80',
        }));
        setCities(arr);
      }
    } catch (error) {
      console.error("Failed to fetch cities:", error);
    }
  }

  useEffect(() => {
    getMyTravelCity();
    if (earthRef.current) {
      // 调整初始姿态：北半球朝上
      // x 轴设为 0，确保地轴垂直（或接近垂直）
      earthRef.current.rotation.x = 0;
      // y 轴调整到约 110 度，使中国区域（东经 110-120 度左右）正对相机
      earthRef.current.rotation.y = THREE.MathUtils.degToRad(110);
    }
  }, []);

  useFrame(() => {
    if (earthRef.current && isautorotate) {
      earthRef.current.rotateOnAxis(rotationAxis, 0.0015);
    }
  });

  return (
    <group>
      <Atmosphere radius={earthRadius} />
      <mesh
        ref={earthRef}
        onPointerOver={() => setIsautorotate(false)}
        onPointerOut={() => setIsautorotate(true)}
      >
        <sphereGeometry args={[earthRadius, 64, 64]} />
        <meshStandardMaterial
          {...earthTexture}
          roughness={0.7}
          metalness={0.2}
        />
        <WorldBorders radius={earthRadius} />
        {/* 我的足迹 */}
        {cities.map((city, index) => (
          <CityMarker key={`footprint-${index}`} city={city} radius={earthRadius} />
        ))}
        {/* 世界大城市 */}
        {MAJOR_CITIES.map((city, index) => (
          <CityMarker key={`major-${index}`} city={city} radius={earthRadius} />
        ))}
      </mesh>
      {/* 云层效果 */}
      <mesh rotation={[0, 0, 0.1]}>
        <sphereGeometry args={[earthRadius * 1.01, 64, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

const EarthScene = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div className="w-full h-[700px] relative bg-slate-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
      
      <Canvas
        camera={{
          position: [0, 4, 10], // 稍微抬高相机位置，俯视北半球
          fov: 45,
          up: [0, 1, 0]
        }}
        gl={{ antialias: true, alpha: true }}
        shadows
      >
        <color attach="background" args={["#020617"]} />
        
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        
        <ambientLight intensity={0.4} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={2} 
          castShadow 
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4ca9ff" />
        
        <Earth3D />
        
        <ContactShadows 
          position={[0, -5, 0]} 
          opacity={0.4} 
          scale={20} 
          blur={2.4} 
          far={4.5} 
        />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={7}
          maxDistance={15}
          zoomSpeed={0.6}
          rotateSpeed={0.5}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>

      <div className="absolute bottom-8 left-8 p-4 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl text-white/80 text-sm pointer-events-none">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
          <span className="font-semibold text-white">全球足迹与地理标注</span>
        </div>
        <div className="flex flex-col gap-1 text-[10px] text-white/60">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span>我的足迹</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span>世界主要城市</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-px bg-white/40" />
            <span>国际边界线</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarthScene;
