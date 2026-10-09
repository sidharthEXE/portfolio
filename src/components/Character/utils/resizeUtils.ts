import * as THREE from "three";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";

export interface ResponsiveCameraSettings {
  position: { x: number; y: number; z: number };
  zoom: number;
}

export const getResponsiveCamera = (
  width: number,
  height: number = 800
): ResponsiveCameraSettings => {
  // Desktop (> 1024px): 100% preserve existing desktop camera and zoom
  if (width > 1024) {
    const desktopZoom =
      width > 1400 ? 1.1 : Math.min(1.1, Math.max(0.92, (width / 1400) * 1.1));
    return {
      position: { x: 0, y: 13.1, z: 24.7 },
      zoom: desktopZoom,
    };
  }

  // Tablet (768px - 1024px)
  if (width > 768) {
    return {
      position: { x: 0, y: 12.2, z: 24.8 },
      zoom: 0.86,
    };
  }

  // Mobile (<= 768px)
  // Perfectly frame the mascot's head, face, shoulders, arms, hands, keyboard, and tabletop
  // while naturally cutting off the underside of the desk and legs at the bottom of the frustum.
  let zoom = 0.88;
  let posY = 12.5;

  if (height < 650) {
    // Shorter viewports (e.g. 320x568, 375x667)
    zoom = 0.82;
    posY = 12.4;
  } else if (width <= 360) {
    // Narrow viewports (e.g. 360x800)
    zoom = 0.86;
    posY = 12.5;
  } else if (width >= 414) {
    // Larger mobile screens (e.g. 414x896, 430x932)
    zoom = 0.90;
    posY = 12.5;
  }

  return {
    position: { x: 0, y: posY, z: 24.8 },
    zoom,
  };
};

export const getResponsiveZoom = (width: number, height?: number): number => {
  return getResponsiveCamera(width, height || 800).zoom;
};

export default function handleResize(
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
  canvasDiv: React.RefObject<HTMLDivElement>,
  character: THREE.Object3D
) {
  if (!canvasDiv.current) return;
  const canvas3d = canvasDiv.current.getBoundingClientRect();
  const width = canvas3d.width || window.innerWidth;
  const height = canvas3d.height || window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;

  const camSettings = getResponsiveCamera(width, height);
  camera.zoom = camSettings.zoom;
  if (width <= 1024) {
    camera.position.set(
      camSettings.position.x,
      camSettings.position.y,
      camSettings.position.z
    );
  }
  camera.updateProjectionMatrix();

  setCharTimeline(character, camera);
  setAllTimeline();
}
