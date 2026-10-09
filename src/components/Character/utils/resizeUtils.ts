import * as THREE from "three";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";

export const getResponsiveZoom = (width: number, _height?: number): number => {
  if (width > 1400) return 1.1;
  if (width > 1024) return Math.min(1.1, Math.max(0.92, (width / 1400) * 1.1));
  if (width > 768) return 0.85;
  if (width > 480) return 0.72;
  return 0.65;
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
  camera.zoom = getResponsiveZoom(width, height);
  camera.updateProjectionMatrix();

  setCharTimeline(character, camera);
  setAllTimeline();
}
