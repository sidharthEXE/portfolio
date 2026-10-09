import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize, { getResponsiveZoom } from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    const containerEl = canvasDiv.current;
    if (!containerEl) return;

    let isCancelled = false;

    // Clean out any pre-existing canvas to prevent duplicate / ghost overlapping models
    const oldCanvases = containerEl.querySelectorAll("canvas");
    oldCanvases.forEach((c) => c.remove());

    const rect = containerEl.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || window.innerHeight;
    const aspect = width / height;

    // Fresh Three.js Scene and Renderer
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    containerEl.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = getResponsiveZoom(width, height);
    camera.updateProjectionMatrix();

    let headBone: THREE.Object3D | null = null;
    let screenLight: any | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let charMesh: THREE.Object3D | null = null;

    const clock = new THREE.Clock();
    const light = setLighting(scene);
    const progress = setProgress((value) => setLoading(value));
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    loadCharacter()
      .then((gltf) => {
        if (isCancelled || !gltf) return;

        // Guarantee only ONE character mesh in the scene
        const existingChars: THREE.Object3D[] = [];
        scene.children.forEach((child) => {
          if (child.name === "character_root") {
            existingChars.push(child);
          }
        });
        existingChars.forEach((c) => scene.remove(c));

        const animations = setAnimations(gltf);
        if (hoverDivRef.current) {
          animations.hover(gltf, hoverDivRef.current);
        }
        mixer = animations.mixer;
        charMesh = gltf.scene;
        charMesh.name = "character_root";
        charMesh.rotation.set(0, 0, 0);
        charMesh.position.set(0, 0, 0);
        scene.add(charMesh);

        headBone = charMesh.getObjectByName("spine006") || null;
        screenLight = charMesh.getObjectByName("screenlight") || null;

        progress.loaded().then(() => {
          if (isCancelled) return;
          setTimeout(() => {
            light.turnOnLights();
            animations.startIntro();
          }, 2500);
        });
      })
      .catch((err) => {
        console.error("Failed to load character model:", err);
        progress.loaded();
      });

    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };

    const onMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => (mouse = { x, y }));
    };

    let debounce: number | undefined;
    const onTouchStart = (event: TouchEvent) => {
      const element = event.target as HTMLElement;
      debounce = window.setTimeout(() => {
        element?.addEventListener("touchmove", (e: TouchEvent) =>
          handleTouchMove(e, (x, y) => (mouse = { x, y }))
        );
      }, 200);
    };

    const onTouchEnd = () => {
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y };
        interpolation = { x: interpolationX, y: interpolationY };
      });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    const landingDiv = document.getElementById("landingDiv");
    if (landingDiv) {
      landingDiv.addEventListener("touchstart", onTouchStart, { passive: true });
      landingDiv.addEventListener("touchend", onTouchEnd);
    }

    const onResize = () => {
      if (canvasDiv.current) {
        const rect = canvasDiv.current.getBoundingClientRect();
        const w = rect.width || window.innerWidth;
        const h = rect.height || window.innerHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.zoom = getResponsiveZoom(w, h);
        camera.updateProjectionMatrix();
      }
      if (charMesh) {
        handleResize(renderer, camera, canvasDiv, charMesh);
      }
    };
    window.addEventListener("resize", onResize, { passive: true });

    let isVisible = true;
    const charScrollTrigger = ScrollTrigger.create({
      trigger: ".career-section",
      start: "top 80%",
      onEnter: () => {
        isVisible = false;
      },
      onLeaveBack: () => {
        isVisible = true;
      },
      onRefresh: (self) => {
        isVisible = self.progress === 0 && !self.isActive;
      },
    });

    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;
      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
        light.setPointLight(screenLight);
      }
      const delta = Math.min(clock.getDelta(), 0.1);
      if (mixer) {
        mixer.update(delta);
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      isCancelled = true;
      cancelAnimationFrame(rafId);
      charScrollTrigger.kill();
      clearTimeout(debounce);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      if (landingDiv) {
        landingDiv.removeEventListener("touchstart", onTouchStart);
        landingDiv.removeEventListener("touchend", onTouchEnd);
      }
      scene.clear();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="character-container">
      <div className="character-model" ref={canvasDiv}>
        <div className="character-rim"></div>
        <div className="character-hover" ref={hoverDivRef}></div>
      </div>
    </div>
  );
};

export default Scene;
