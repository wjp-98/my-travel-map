'use client';

import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html, Sphere, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { queryMyCityFootprints } from "../api/my-city"

interface City {
  name: string;
  lat: number;
  lng: number;
  color?: string;
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

function CityMarker({ city, radius = 2 }: { city: City; radius?: number }) {
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

  return (
    <group ref={groupRef} position={position}>
      <Sphere args={[0.05, 16, 16]} visible={isVisible}>
        <meshBasicMaterial color={city.color || "red"} transparent opacity={0.8} />
      </Sphere>
      <Html center distanceFactor={6}>
        <div
          className="font-bold text-white text-xs px-2 py-1 rounded"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.3s',
            backgroundColor: 'rgba(0,0,0,0.5)',
            transform: 'scale(1.2)'
          }}
        >
          {city.name}
        </div>
      </Html>
    </group>
  );
}

function Earth3D() {
  const earthRef = useRef<THREE.Mesh>(null);
  const [isautorotate, setIsautorotate] = useState(true);
  const [cities, setCities] = useState<City[]>([])

  // 定义地轴倾角（23.5度）
  const axialTilt = THREE.MathUtils.degToRad(23.5);
  // 创建倾斜的旋转轴
  const rotationAxis = new THREE.Vector3(
    Math.sin(axialTilt),
    Math.cos(axialTilt),
    0
  ).normalize();

  const earthTexture = useTexture({
    map: '/images/earth-texture.jpg',
    // normalMap: '/images/earth-normal.jpg',
    // specularMap: '/images/earth-specular.jpg',
  });


  // const cities: City[] = [
  //   { name: "北京", lat: 39.9042, lng: 116.4074, color: "red" },
  //   { name: "武汉", lat: 30.593, lng: 114.3053, color: "red" },
  //   { name: "荆州", lat: 30.3351, lng: 112.2397, color: "red" },
  //   { name: "纽约", lat: 40.7128, lng: -74.006, color: "blue" },
  //   { name: "伦敦", lat: 51.5074, lng: -0.1278, color: "green" },
  // ];


  const getMyTravelCity = async () => {
    const response = await queryMyCityFootprints();
    const arr = response.data.data.map(it => {
      return {
        name: it.cityName,
        lat: it.location.coordinates[1],
        lng: it.location.coordinates[0],
        color: 'green',
      }
    })
    setCities(arr)
  }


  useEffect(() => {
    getMyTravelCity();
    if (earthRef.current) {
      // 调整地球旋转以使中国位于上半球
      earthRef.current.rotation.x = THREE.MathUtils.degToRad(-60); // 北极朝上
      earthRef.current.rotation.y = THREE.MathUtils.degToRad(100); // 调整经度，使中国区域朝向观察者
      earthRef.current.rotation.z = THREE.MathUtils.degToRad(-23.5); // 地轴倾斜
    }
  }, []);

  useFrame(() => {
    if (earthRef.current && isautorotate) {
      earthRef.current.rotateOnAxis(rotationAxis, 0.002);
    }
  });

  return (
    <group rotation={[THREE.MathUtils.degToRad(45), 0, 0]}>
      <mesh
        ref={earthRef}
        onPointerOver={() => setIsautorotate(false)}
        onPointerOut={() => setIsautorotate(true)}
      >
        <sphereGeometry args={[earthRadius, 64, 64]} />
        <meshPhongMaterial
          {...earthTexture}
          normalScale={[0.05, 0.05] as unknown as THREE.Vector2}
          shininess={5}
        />
        {cities.map((city, index) => (
          <CityMarker key={index} city={city} radius={earthRadius} />
        ))}
      </mesh>
    </group>
  );
}

const EarthScene = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div className="w-full h-[700px]">
      <Canvas
        camera={{
          position: [0, 6, 10],
          fov: 45,
          up: [0, 1, 0]
        }}
      >
        <color attach="background" args={["#000"]} />
        <Stars
          radius={100}
          depth={50}
          count={10000}
          factor={4}
          saturation={0}
          fade
          speed={0.5}
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <Earth3D />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={8}
          maxDistance={16}
          zoomSpeed={0.5}
          minPolarAngle={Math.PI * 0.1}
          maxPolarAngle={Math.PI * 0.5}
          target={[0, 0, 0]}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
};

export default EarthScene;