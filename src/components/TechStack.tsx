import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
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

const sphereGeometry = new THREE.SphereGeometry(1, 24, 24);

const sphereConfigs = [...Array(20)].map((_, i) => ({
  scale: [0.75, 1, 0.85, 1, 0.9][i % 5],
  techIndex: i % techData.length,
}));

type TechItem = (typeof techData)[number];

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshStandardMaterial;
  tech: TechItem;
  isActive: boolean;
  onSelect: (tech: TechItem) => void;
  isSelected: boolean;
  isMobile: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  tech,
  isActive,
  onSelect,
  isSelected,
  isMobile,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);
  const impulseTarget = useMemo(() => new THREE.Vector3(), []);
  const [hovered, setHovered] = useState(false);

  // Responsive scale adjustment: comfortable proportions for mobile
  const finalScale = isMobile ? scale * 0.85 : scale;
  const isHighlighted = hovered || isSelected;

  useFrame((_state, delta) => {
    if (!isActive || !api.current) return;
    delta = Math.min(0.05, delta);
    impulseTarget.set(
      -50 * delta * finalScale,
      -130 * delta * finalScale,
      -50 * delta * finalScale
    );

    // Gravity pull toward cluster center
    const currentTranslation = api.current.translation();
    const targetY = isMobile ? 0.2 : 0;
    vec.set(
      currentTranslation.x,
      currentTranslation.y - targetY,
      currentTranslation.z
    )
      .normalize()
      .multiply(impulseTarget);

    api.current.applyImpulse(vec, true);
  });

  const targetY = isMobile ? 0.2 : 0;

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(6), r(6) + targetY, r(4)]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[finalScale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * finalScale]}
        args={[0.15 * finalScale, 0.275 * finalScale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={isHighlighted ? finalScale * 1.15 : finalScale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onSelect(tech);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          onSelect(tech);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(tech);
        }}
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
    vec.lerp(targetVec, 0.25);
    ref.current?.setNextKinematicTranslation(vec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[1.8]} />
    </RigidBody>
  );
}

function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / size.height;
    const isNarrow = size.width < 500;
    const isTablet = size.width >= 500 && size.width <= 1024;

    if (camera instanceof THREE.PerspectiveCamera) {
      if (isNarrow) {
        // Mobile portrait framing: wide enough so entire cluster fits with comfortable margins
        camera.position.set(0, 0.2, 28);
        camera.fov = 38;
      } else if (isTablet) {
        // Tablet framing
        camera.position.set(0, 0.1, 24);
        camera.fov = 35;
      } else {
        // Desktop framing
        camera.position.set(0, 0, 20);
        camera.fov = 32.5;
      }
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    }
  }, [camera, size.width, size.height]);

  return null;
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(true);
  const [activeTech, setActiveTech] = useState<TechItem | null>(null);
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
    const el = document.getElementById("techstack");
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const materials = useMemo(() => {
    return textures.map(
      (texture) =>
        new THREE.MeshStandardMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.35,
          metalness: 0.4,
          roughness: 0.3,
        })
    );
  }, []);

  return (
    <div className="techstack" id="techstack">
      {/* Centered Heading and Interactive Technology Indicator */}
      <div className="tech-heading-container">
        <h2>My Techstack</h2>
        <div className={`tech-badge ${activeTech ? "active" : ""}`}>
          {activeTech ? (
            <div className="tech-badge-content">
              <span className="tech-badge-name">{activeTech.name}</span>
              <span className="tech-badge-dot">•</span>
              <span className="tech-badge-cat">{activeTech.category}</span>
            </div>
          ) : (
            <div className="tech-badge-placeholder">
              <span>{isMobile ? "Tap or drag spheres to interact" : "Hover or drag spheres to interact"}</span>
            </div>
          )}
        </div>
      </div>

      {/* Universal 3D Physics Canvas for Desktop, Tablet, and Mobile */}
      <Canvas
        frameloop={isActive ? "always" : "never"}
        dpr={[
          1,
          Math.min(
            typeof window !== "undefined" ? window.devicePixelRatio : 1,
            2
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
        <ResponsiveCamera />
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
          {sphereConfigs.map((config, i) => (
            <SphereGeo
              key={i}
              scale={config.scale}
              tech={techData[config.techIndex]}
              material={materials[config.techIndex]}
              isActive={isActive}
              onSelect={setActiveTech}
              isSelected={activeTech?.name === techData[config.techIndex].name}
              isMobile={isMobile}
            />
          ))}
        </Physics>
        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.5}
          environmentRotation={[0, 4, 2]}
        />
      </Canvas>
    </div>
  );
};

export default TechStack;
