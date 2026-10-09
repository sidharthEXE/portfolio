import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  let intensity: number = 0;
  setInterval(() => {
    intensity = Math.random();
  }, 200);
  ScrollTrigger.getById("char-tl1")?.kill();
  ScrollTrigger.getById("char-tl2")?.kill();
  ScrollTrigger.getById("char-tl3")?.kill();
  ScrollTrigger.getById("char-tl-mobile")?.kill();

  const tl1 = gsap.timeline({
    scrollTrigger: {
      id: "char-tl1",
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  const tl2 = gsap.timeline({
    scrollTrigger: {
      id: "char-tl2",
      trigger: ".about-section",
      start: "center 55%",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  const tl3 = gsap.timeline({
    scrollTrigger: {
      id: "char-tl3",
      trigger: ".whatIDO",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  let screenLight: any = null, monitor: any = null;
  character?.children.forEach((object: any) => {
    if (object.name === "Plane004") {
      object.children.forEach((child: any) => {
        if (child.material) {
          child.material.transparent = true;
          child.material.opacity = 0;
          if (child.material.name === "Material.027") {
            monitor = child;
            child.material.color.set("#FFFFFF");
          }
        }
      });
    }
    if (object.name === "screenlight") {
      if (object.material) {
        object.material.transparent = true;
        object.material.opacity = 0;
        object.material.emissive.set("#C8BFFF");
        gsap.timeline({ repeat: -1, repeatRefresh: true }).to(object.material, {
          emissiveIntensity: () => intensity * 8,
          duration: () => Math.random() * 0.6,
          delay: () => Math.random() * 0.1,
        });
      }
      screenLight = object;
    }
  });

  if (!monitor) {
    const p4: any = character?.getObjectByName("Plane004");
    if (p4) {
      if (p4.material) {
        p4.material.transparent = true;
        p4.material.opacity = 0;
        if (p4.material.name === "Material.027") {
          monitor = p4;
          p4.material.color?.set("#FFFFFF");
        }
      }
      p4.children?.forEach((child: any) => {
        if (child.material) {
          child.material.transparent = true;
          child.material.opacity = 0;
          if (child.material.name === "Material.027") {
            monitor = child;
            child.material.color?.set("#FFFFFF");
          }
        }
      });
    }
  }

  if (!screenLight) {
    const sl: any = character?.getObjectByName("screenlight");
    if (sl && sl.material) {
      sl.material.transparent = true;
      sl.material.opacity = 0;
      sl.material.emissive?.set("#C8BFFF");
      gsap.timeline({ repeat: -1, repeatRefresh: true }).to(sl.material, {
        emissiveIntensity: () => intensity * 8,
        duration: () => Math.random() * 0.6,
        delay: () => Math.random() * 0.1,
      });
      screenLight = sl;
    }
  }

  let neckBone = character?.getObjectByName("spine005");
  if (window.innerWidth > 1024) {
    if (character) {
      character.rotation.set(0, 0, 0);
      character.position.set(0, 0, 0);

      tl1
        .fromTo(
          character.rotation,
          { y: 0 },
          { y: 0.7, duration: 1, immediateRender: true },
          0
        )
        .to(camera.position, { z: 22 }, 0)
        .fromTo(
          ".character-model",
          { x: 0 },
          { x: "-25%", duration: 1, immediateRender: true },
          0
        )
        .to(".landing-container", { opacity: 0, duration: 0.4 }, 0)
        .to(".landing-container", { y: "40%", duration: 0.8 }, 0)
        .fromTo(".about-me", { y: "-50%" }, { y: "0%", immediateRender: false }, 0);

      tl2
        .to(
          camera.position,
          { z: 75, y: 8.4, duration: 6, delay: 2, ease: "power3.inOut" },
          0
        )
        .to(".about-section", { y: "30%", duration: 6 }, 0)
        .to(".about-section", { opacity: 0, delay: 3, duration: 2 }, 0)
        .fromTo(
          ".character-model",
          { x: "-25%", pointerEvents: "inherit" },
          { pointerEvents: "none", x: "-12%", delay: 2, duration: 5, immediateRender: false },
          0
        )
        .to(character.rotation, { y: 0.92, x: 0.12, delay: 3, duration: 3 }, 0);

      if (neckBone) {
        tl2.to(neckBone.rotation, { x: 0.6, delay: 2, duration: 3 }, 0);
      }
      if (monitor?.material) {
        tl2.to(monitor.material, { opacity: 1, duration: 0.8, delay: 3.2 }, 0);
      }
      if (screenLight?.material) {
        tl2.to(screenLight.material, { opacity: 1, duration: 0.8, delay: 4.5 }, 0);
      }

      tl2.fromTo(
        ".what-box-in",
        { display: "none" },
        { display: "flex", duration: 0.1, delay: 6, immediateRender: false },
        0
      );

      if (monitor?.position) {
        tl2.fromTo(
          monitor.position,
          { y: -10, z: 2 },
          { y: 0, z: 0, delay: 1.5, duration: 3, immediateRender: false },
          0
        );
      }

      tl2.fromTo(
        ".character-rim",
        { opacity: 1, scaleX: 1.4 },
        { opacity: 0, scale: 0, y: "-70%", duration: 5, delay: 2, immediateRender: false },
        0.3
      );

      tl3
        .fromTo(
          ".character-model",
          { x: "-12%", y: "0%" },
          { x: "-12%", y: "-100%", duration: 4, ease: "none", delay: 1, immediateRender: false },
          0
        )
        .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 2, immediateRender: false }, 0)
        .to(character.rotation, { x: -0.04, duration: 2, delay: 1 }, 0);

      // Explicitly guarantee initial resting position is centered and facing straight
      gsap.set(".character-model", { x: 0, y: 0 });
      character.rotation.set(0, 0, 0);
      character.position.set(0, 0, 0);
      tl1.progress(0);
    }
  } else {
    ScrollTrigger.getById("char-tl1")?.kill();
    ScrollTrigger.getById("char-tl2")?.kill();
    ScrollTrigger.getById("char-tl3")?.kill();
    ScrollTrigger.getById("char-tl-mobile")?.kill();

    if (character) {
      character.rotation.set(0, 0, 0);
      character.position.set(0, 0, 0);
      gsap.set(".character-model", { x: 0, y: 0, scale: 1 });

      const mobileTl = gsap.timeline({
        scrollTrigger: {
          id: "char-tl-mobile",
          trigger: ".landing-section",
          start: "top top",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      mobileTl
        .to(
          character.rotation,
          { y: 0.38, x: 0.07, duration: 1, ease: "power1.out" },
          0
        )
        .to(
          camera.position,
          { z: 26.2, duration: 1, ease: "power1.out" },
          0
        )
        .to(
          ".character-model",
          { y: "-6%", scale: 0.94, duration: 1, ease: "power1.out" },
          0
        )
        .to(
          ".landing-intro",
          { opacity: 0, y: "-35%", duration: 0.5, ease: "power2.in" },
          0
        )
        .to(
          ".landing-info",
          { opacity: 0, y: "30%", duration: 0.5, ease: "power2.in" },
          0
        )
        .to(
          ".character-rim",
          { opacity: 0.25, scale: 0.85, duration: 0.7 },
          0
        );

      const tM2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".what-box-in",
          start: "top 70%",
          end: "bottom top",
        },
      });
      tM2.to(".what-box-in", { display: "flex", duration: 0.1, delay: 0 }, 0);

      mobileTl.progress(0);
    }
  }
}

export function setAllTimeline() {
  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 30%",
      end: "100% center",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  careerTimeline
    .fromTo(
      ".career-timeline",
      { maxHeight: "10%" },
      { maxHeight: "100%", duration: 0.5 },
      0
    )

    .fromTo(
      ".career-timeline",
      { opacity: 0 },
      { opacity: 1, duration: 0.1 },
      0
    )
    .fromTo(
      ".career-info-box",
      { opacity: 0 },
      { opacity: 1, stagger: 0.1, duration: 0.5 },
      0
    )
    .fromTo(
      ".career-dot",
      { animationIterationCount: "infinite" },
      {
        animationIterationCount: "1",
        delay: 0.3,
        duration: 0.1,
      },
      0
    );

  if (window.innerWidth > 1024) {
    careerTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: "20%", duration: 0.5, delay: 0.2 },
      0
    );
  } else {
    careerTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: 0, duration: 0.5, delay: 0.2 },
      0
    );
  }
}
