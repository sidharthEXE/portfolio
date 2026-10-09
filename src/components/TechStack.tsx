import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import "./styles/TechStack.css";

const textureLoader = new THREE.TextureLoader();
const techData = [
  { name: "React", image: "/images/react2.webp", category: "Frontend" },
  { name: "Next.js", image: "/images/next2.webp", category: "Full Stack" },
  { name: "TypeScript", image: "/images/typescript.webp", category: "Language" },
  { name: "JavaScript", image: "/images/javascript.webp", category: "Language" },
  { name: "Node.js", image: "/images/node2.webp", category: "Backend" },
  { name: "Express.js", image: "/images/express.webp", category: "Backend" },
  { name: "MongoDB", image: "/images/mongo.webp", category: "Database" },
  { name: "MySQL", image: "/images/mysql.webp", category: "Database" },
];

const imageUrls = techData.map((t) => t.image);
const textures = imageUrls.map((url) => textureLoader.load(url));

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);

const spheres = [...Array(20)].map(() => ({
  scale: [0.7, 1, 0.8, 1, 1][Math.floor(Math.random() * 5)],
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshStandardMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);
  const impulseTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.05, delta);
    impulseTarget.set(
      -50 * delta * scale,
      -150 * delta * scale,
      -50 * delta * scale
    );
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(impulseTarget);

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);
  const targetVec = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    targetVec.set(
      (pointer.x * viewport.width) / 2,
      (pointer.y * viewport.height) / 2,
      0
    );
    vec.lerp(targetVec, 0.2);
    ref.current?.setNextKinematicTranslation(vec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 900 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: ".techstack",
      start: "top bottom+=100",
      end: "bottom top-=100",
      onToggle: (self) => {
        setIsActive(self.isActive);
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const materials = useMemo(() => {
    return textures.map(
      (texture) =>
        new THREE.MeshStandardMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.3,
          metalness: 0.4,
          roughness: 0.3,
        })
    );
  }, []);

  return (
    <div className="techstack" id="techstack">
      <h2> My Techstack</h2>

      {/* Mobile & Tablet responsive grid */}
      <div className="tech-grid-wrapper">
        <div className="tech-grid">
          {techData.map((tech) => (
            <div className="tech-card" key={tech.name}>
              <div className="tech-icon-wrapper">
                <img
                  src={tech.image}
                  alt={tech.name}
                  className="tech-icon"
                  loading="lazy"
                />
              </div>
              <div className="tech-info">
                <span className="tech-name">{tech.name}</span>
                <span className="tech-category">{tech.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop 3D Canvas */}
      {!isMobile && (
        <Canvas
          frameloop={isActive ? "always" : "never"}
          dpr={[
            1,
            Math.min(
              typeof window !== "undefined" ? window.devicePixelRatio : 1,
              1.5
            ),
          ]}
          gl={{
            alpha: true,
            powerPreference: "high-performance",
            antialias: true,
          }}
          camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
          onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
          className="tech-canvas"
        >
          <ambientLight intensity={1.2} />
          <spotLight
            position={[20, 20, 25]}
            penumbra={1}
            angle={0.2}
            color="white"
          />
          <directionalLight position={[0, 5, -4]} intensity={2} />
          <Physics gravity={[0, 0, 0]} paused={!isActive}>
            <Pointer isActive={isActive} />
            {spheres.map((props, i) => (
              <SphereGeo
                key={i}
                {...props}
                material={
                  materials[Math.floor(Math.random() * materials.length)]
                }
                isActive={isActive}
              />
            ))}
          </Physics>
          <Environment
            files="/models/char_enviorment.hdr"
            environmentIntensity={0.5}
            environmentRotation={[0, 4, 2]}
          />
        </Canvas>
      )}
    </div>
  );
};

export default TechStack;
