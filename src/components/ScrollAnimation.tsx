import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationProps {
  frameCount: number;
  pathPrefix: string;
  productType: 'keto' | 'slim' | 'metabolism' | 'biotin' | 'hair_vitamins' | 'skin_radiance' | 'ashwagandha' | 'testosterone' | 'brain_booster';
}

const ScrollAnimation: React.FC<ScrollAnimationProps> = ({ frameCount, pathPrefix, productType }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let imagesLoaded = 0;

    const preloadImages = () => {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        const frameNum = i.toString().padStart(3, '0');
        img.src = `${pathPrefix}/frame_${frameNum}.jpg`;
        img.onload = () => {
          imagesLoaded++;
          setProgress(Math.round((imagesLoaded / frameCount) * 100));
          if (imagesLoaded === frameCount) {
            setImages(loadedImages);
            setIsLoading(false);
          }
        };
        loadedImages[i - 1] = img;
      }
    };

    preloadImages();
  }, [frameCount]);

  useGSAP(() => {
    if (isLoading || images.length === 0 || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(0);
    };

    const renderFrame = (index: number) => {
      if (images[index]) {
        const img = images[index];

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const imageWidth = img.width;
        const imageHeight = img.height;

        // Force "Cover" scaling and zoom (1.15x) to aggressively hide AI watermarks in the corners
        const scale = Math.max(canvasWidth / imageWidth, canvasHeight / imageHeight) * 1.15;
        const drawWidth = imageWidth * scale;
        const drawHeight = imageHeight * scale;

        const offsetX = (canvasWidth - drawWidth) / 2;
        // Shift down slightly to ensure bottom watermark is cut off
        const offsetY = ((canvasHeight - drawHeight) / 2) + (drawHeight * 0.03);

        context.clearRect(0, 0, canvasWidth, canvasHeight);

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';

        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Determine scroll distance based on product type
    let scrollDistance = '+=400%';
    if (productType === 'brain_booster') scrollDistance = '+=1000%';
    if (productType === 'biotin') scrollDistance = '+=800%';
    if (productType === 'hair_vitamins') scrollDistance = '+=600%';
    if (productType === 'skin_radiance') scrollDistance = '+=800%';
    if (productType === 'keto') scrollDistance = '+=800%';


    // MASTER TIMELINE: Handles both frames and text in sync
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: scrollDistance,
        scrub: 0.5,
        pin: true,
        onRefresh: () => renderFrame(0) // Start at frame 0 on refresh
      }
    });

    const airpods = { frame: 0 };

    // Bind frame scrubbing to the timeline (duration 1 covers the entire scroll)
    masterTimeline.to(airpods, {
      frame: images.length - 1,
      snap: 'frame',
      ease: 'none',
      duration: 1,
      onUpdate: () => {
        renderFrame(Math.round(airpods.frame));
      }
    }, 0);

    // BRAIN BOOSTER: Synchronized Narrative (11 Scenes)
    if (productType === 'brain_booster') {
      gsap.set('.brain-story-scene', { autoAlpha: 0, y: 20 });
      gsap.set('.stagger-line', { autoAlpha: 0 });

      // Scene 1: Mental Overload (0-9%)
      masterTimeline.to('#bb-s1', { autoAlpha: 1, duration: 0.04 }, 0.01);
      masterTimeline.to('#bb-s1-l1', { autoAlpha: 1, duration: 0.01 }, 0.015);
      masterTimeline.to('#bb-s1-l2', { autoAlpha: 1, duration: 0.01 }, 0.025);
      masterTimeline.to('#bb-s1-l3', { autoAlpha: 1, duration: 0.01 }, 0.035);
      masterTimeline.to('#bb-s1-l4', { autoAlpha: 1, duration: 0.01 }, 0.045);
      masterTimeline.to(['#bb-s1-l1', '#bb-s1-l2', '#bb-s1-l3', '#bb-s1-l4'], { autoAlpha: 0, duration: 0.01 }, 0.06);
      masterTimeline.to('#bb-s1-pause', { autoAlpha: 1, duration: 0.02 }, 0.07);
      masterTimeline.to('#bb-s1', { autoAlpha: 0, duration: 0.02 }, 0.09);

      // Scene 2: Inside Mind (9-17%)
      masterTimeline.to('#bb-s2', { autoAlpha: 1, duration: 0.04 }, 0.10);
      masterTimeline.to('#bb-s2-l1', { autoAlpha: 1, duration: 0.01 }, 0.11);
      masterTimeline.to('#bb-s2-l2', { autoAlpha: 1, duration: 0.01 }, 0.12);
      masterTimeline.to(['#bb-s2-l1', '#bb-s2-l2'], { autoAlpha: 0, duration: 0.01 }, 0.13);
      masterTimeline.to(['#bb-s2-n1', '#bb-s2-n2', '#bb-s2-n3'], { autoAlpha: 1, stagger: 0.01, duration: 0.03 }, 0.14);
      masterTimeline.to('#bb-s2', { autoAlpha: 0, duration: 0.03 }, 0.17);

      // Scene 3: Realization (18-26%)
      masterTimeline.to('#bb-s3', { autoAlpha: 1, duration: 0.04 }, 0.18);
      masterTimeline.to('#bb-s3-l1', { autoAlpha: 1, duration: 0.01 }, 0.19);
      masterTimeline.to('#bb-s3-l2', { autoAlpha: 1, duration: 0.01 }, 0.20);
      masterTimeline.to(['#bb-s3-l1', '#bb-s3-l2'], { autoAlpha: 0, duration: 0.01 }, 0.21);
      masterTimeline.to(['#bb-s3-n1', '#bb-s3-n2'], { autoAlpha: 1, stagger: 0.01, duration: 0.03 }, 0.22);
      masterTimeline.to('#bb-s3', { autoAlpha: 0, duration: 0.03 }, 0.26);

      // Scene 4: Search (27-35%)
      masterTimeline.to('#bb-s4', { autoAlpha: 1, duration: 0.04 }, 0.27);
      masterTimeline.to(['#bb-s4-l1', '#bb-s4-l2', '#bb-s4-l3'], { autoAlpha: 1, stagger: 0.01, duration: 0.04 }, 0.28);
      masterTimeline.to('#bb-s4', { autoAlpha: 0, duration: 0.04 }, 0.35);

      // Scene 5: Ayurveda (36-44%)
      masterTimeline.to('#bb-s5', { autoAlpha: 1, duration: 0.04 }, 0.36);
      masterTimeline.to(['#bb-s5-l1', '#bb-s5-l2', '#bb-s5-l3'], { autoAlpha: 1, stagger: 0.01, duration: 0.04 }, 0.37);
      masterTimeline.to('#bb-s5', { autoAlpha: 0, duration: 0.04 }, 0.44);

      // Scene 6: Discovery (45-53%)
      masterTimeline.to('#bb-s6', { autoAlpha: 1, duration: 0.04 }, 0.45);
      masterTimeline.to(['#bb-s6-l1', '#bb-s6-l2', '#bb-s6-l3', '#bb-s6-l4'], { autoAlpha: 1, stagger: 0.01, duration: 0.04 }, 0.46);
      masterTimeline.to('#bb-s6-soft', { autoAlpha: 1, duration: 0.03 }, 0.50);
      masterTimeline.to('#bb-s6', { autoAlpha: 0, duration: 0.03 }, 0.53);

      // Scene 7: Daily Routine (54-62%)
      masterTimeline.to('#bb-s7', { autoAlpha: 1, duration: 0.04 }, 0.54);
      masterTimeline.to(['#bb-s7-l1', '#bb-s7-l2'], { autoAlpha: 1, duration: 0.02 }, 0.55);
      masterTimeline.to(['#bb-s7-l1', '#bb-s7-l2'], { autoAlpha: 0, duration: 0.01 }, 0.57);
      masterTimeline.to(['#bb-s7-n1', '#bb-s7-n2'], { autoAlpha: 1, duration: 0.03 }, 0.59);
      masterTimeline.to('#bb-s7', { autoAlpha: 0, duration: 0.03 }, 0.62);

      // Scene 8: Progress (63-75%)
      masterTimeline.to('#bb-s8-d5', { autoAlpha: 1, duration: 0.03 }, 0.63);
      masterTimeline.to('#bb-s8-d5', { autoAlpha: 0, duration: 0.03 }, 0.67);
      masterTimeline.to('#bb-s8-d10', { autoAlpha: 1, duration: 0.03 }, 0.68);
      masterTimeline.to('#bb-s8-d10', { autoAlpha: 0, duration: 0.03 }, 0.71);
      masterTimeline.to('#bb-s8-d15', { autoAlpha: 1, duration: 0.03 }, 0.72);
      masterTimeline.to('#bb-s8-d15', { autoAlpha: 0, duration: 0.03 }, 0.75);

      // Scene 9: Results (76-84%)
      masterTimeline.to('#bb-s9', { autoAlpha: 1, duration: 0.04 }, 0.76);
      masterTimeline.to(['#bb-s9-l1', '#bb-s9-l2', '#bb-s9-l3', '#bb-s9-l4'], { autoAlpha: 1, stagger: 0.01, duration: 0.04 }, 0.77);
      masterTimeline.to(['#bb-s9-l1', '#bb-s9-l2', '#bb-s9-l3', '#bb-s9-l4'], { autoAlpha: 0, duration: 0.01 }, 0.81);
      masterTimeline.to(['#bb-s9-p1', '#bb-s9-p2'], { autoAlpha: 1, stagger: 0.01, duration: 0.02 }, 0.82);
      masterTimeline.to('#bb-s9', { autoAlpha: 0, duration: 0.02 }, 0.84);

      // Scene 10: Nature -> Mind (85-92%)
      masterTimeline.to('#bb-s10', { autoAlpha: 1, duration: 0.04 }, 0.85);
      masterTimeline.to(['#bb-s10-l1', '#bb-s10-l2'], { autoAlpha: 1, stagger: 0.01, duration: 0.02 }, 0.86);
      masterTimeline.to(['#bb-s10-l1', '#bb-s10-l2'], { autoAlpha: 0, duration: 0.01 }, 0.88);
      masterTimeline.to(['#bb-s10-n1', '#bb-s10-n2', '#bb-s10-n3'], { autoAlpha: 1, stagger: 0.01, duration: 0.03 }, 0.89);
      masterTimeline.to('#bb-s10', { autoAlpha: 0, duration: 0.03 }, 0.92);

      // Final Scene (93-100%)
      masterTimeline.to('#bb-s11', { autoAlpha: 1, duration: 0.05 }, 0.93);
      masterTimeline.to('#bb-s11-tagline', { autoAlpha: 1, y: 0, duration: 0.04 }, 0.96);
    }

    // HAIR VITAMINS: Synchronized Narrative (6 Scenes, 8s each)
    if (productType === 'hair_vitamins') {
      gsap.set('.hair-text-element', { autoAlpha: 0 });

      // Scene 1: Hair Fall Reality (0-16.6%)
      masterTimeline.to('#hv-s1-1', { autoAlpha: 1, duration: 0.03 }, 0.01);
      masterTimeline.to('#hv-s1-1', { autoAlpha: 0, duration: 0.02 }, 0.06);
      masterTimeline.to('#hv-s1-2', { autoAlpha: 1, duration: 0.03 }, 0.065);
      masterTimeline.to('#hv-s1-2', { autoAlpha: 0, duration: 0.02 }, 0.10);
      masterTimeline.to('#hv-s1-3', { autoAlpha: 1, duration: 0.03 }, 0.105);
      masterTimeline.to('#hv-s1-3', { autoAlpha: 0, duration: 0.03 }, 0.16);

      // Scene 2: Sad & Worried (16.6-33.3%)
      masterTimeline.to('#hv-s2-1', { autoAlpha: 1, duration: 0.06 }, 0.17);
      masterTimeline.to('#hv-s2-1', { autoAlpha: 0, duration: 0.03 }, 0.25);
      masterTimeline.to('#hv-s2-2', { autoAlpha: 1, duration: 0.06 }, 0.255);
      masterTimeline.to('#hv-s2-2', { autoAlpha: 0, duration: 0.03 }, 0.33);

      // Scene 3: Search (33.3-50%)
      masterTimeline.to('#hv-s3-1', { autoAlpha: 1, duration: 0.06 }, 0.34);
      masterTimeline.to('#hv-s3-1', { autoAlpha: 0, duration: 0.03 }, 0.42);
      masterTimeline.to('#hv-s3-2', { autoAlpha: 1, duration: 0.06 }, 0.425);
      masterTimeline.to('#hv-s3-2', { autoAlpha: 0, duration: 0.03 }, 0.50);

      // Scene 4: Discovery (50-66.6%)
      masterTimeline.to('#hv-s4-1', { autoAlpha: 1, duration: 0.06 }, 0.51);
      masterTimeline.to('#hv-s4-1', { autoAlpha: 0, duration: 0.03 }, 0.59);
      masterTimeline.to('#hv-s4-2', { autoAlpha: 1, duration: 0.06 }, 0.595);
      masterTimeline.to('#hv-s4-2', { autoAlpha: 0, duration: 0.03 }, 0.66);

      // Scene 5: Daily Use (66.6-83.3%)
      masterTimeline.to('#hv-s5-1', { autoAlpha: 1, duration: 0.06 }, 0.67);
      masterTimeline.to('#hv-s5-1', { autoAlpha: 0, duration: 0.03 }, 0.75);
      masterTimeline.to('#hv-s5-2', { autoAlpha: 1, duration: 0.06 }, 0.755);
      masterTimeline.to('#hv-s5-2', { autoAlpha: 0, duration: 0.03 }, 0.83);

      // Scene 6: Result & Trust (83.3-100%)
      masterTimeline.to('#hv-s6-1', { autoAlpha: 1, duration: 0.06 }, 0.84);
      masterTimeline.to('#hv-s6-1', { autoAlpha: 0, duration: 0.02 }, 0.92);
      masterTimeline.to('#hv-s6-2', { autoAlpha: 1, duration: 0.03 }, 0.925);
      masterTimeline.to('#hv-s6-2', { autoAlpha: 0, duration: 0.02 }, 0.96);
      masterTimeline.to('#hv-s6-3', { autoAlpha: 1, duration: 0.03 }, 0.965);
    }

    // BIOTIN: Synchronized Narrative
    if (productType === 'biotin') {
      gsap.set('.biotin-text-element', { autoAlpha: 0, y: 15 });

      // Scene 1: Dull and dry (0-12%)
      masterTimeline.to('#b-s1', { autoAlpha: 1, y: 0, duration: 0.08 }, 0.01);
      masterTimeline.to('#b-s1', { autoAlpha: 0, duration: 0.04 }, 0.12);

      // Scene 2: Start Using (14-24%)
      masterTimeline.to('#b-s2', { autoAlpha: 1, y: 0, duration: 0.08 }, 0.14);
      masterTimeline.to('#b-s2', { autoAlpha: 0, duration: 0.04 }, 0.24);

      // Scene 3: After 5 Days (26-36%)
      masterTimeline.to('#b-s3', { autoAlpha: 1, y: 0, duration: 0.08 }, 0.26);
      masterTimeline.to('#b-s3', { autoAlpha: 0, duration: 0.04 }, 0.36);

      // Scene 4: Consistency (38-48%)
      masterTimeline.to('#b-s4', { autoAlpha: 1, y: 0, duration: 0.08 }, 0.38);
      masterTimeline.to('#b-s4', { autoAlpha: 0, duration: 0.04 }, 0.48);

      // Scene 5: After 15 Days (50-60%)
      masterTimeline.to('#b-s5', { autoAlpha: 1, y: 0, duration: 0.08 }, 0.50);
      masterTimeline.to('#b-s5', { autoAlpha: 0, duration: 0.04 }, 0.60);

      // Scene 6: Trust (62-72%)
      masterTimeline.to('#b-s6', { autoAlpha: 1, y: 0, duration: 0.08 }, 0.62);
      masterTimeline.to('#b-s6', { autoAlpha: 0, duration: 0.04 }, 0.72);

      // Scene 7: Comparison (74-88%)
      masterTimeline.to('#b-s7-left', { autoAlpha: 0.6, y: 0, duration: 0.08 }, 0.74);
      masterTimeline.to('#b-s7-right', { autoAlpha: 0.6, y: 0, duration: 0.08 }, 0.76);
      masterTimeline.to(['#b-s7-left', '#b-s7-right'], { autoAlpha: 0, duration: 0.06 }, 0.88);

      // Final Product Hold (90-100%)
      masterTimeline.to('#b-final', { autoAlpha: 1, y: 0, duration: 0.08 }, 0.91);
    }

    // SKIN RADIANCE: Synchronized Narrative (8 Scenes)
    if (productType === 'skin_radiance') {
      gsap.set('.radiance-text-element', { autoAlpha: 0, y: 15 });

      // Scene 1: Before Use (0-12%)
      masterTimeline.to('#sr-s1', { autoAlpha: 1, y: 0, duration: 0.08 }, 0.01);
      masterTimeline.to('#sr-s1', { autoAlpha: 0, duration: 0.04 }, 0.12);

      // Scene 2: Start Using (14-24%)
      masterTimeline.to('#sr-s2', { autoAlpha: 1, y: 0, duration: 0.08 }, 0.14);
      masterTimeline.to('#sr-s2', { autoAlpha: 0, duration: 0.04 }, 0.24);

      // Scene 3: After 5 Days (26-36%)
      masterTimeline.to('#sr-s3', { autoAlpha: 1, y: 0, duration: 0.08 }, 0.26);
      masterTimeline.to('#sr-s3', { autoAlpha: 0, duration: 0.04 }, 0.36);

      // Scene 4: Consistency (38-48%)
      masterTimeline.to('#sr-s4', { autoAlpha: 1, y: 0, duration: 0.08 }, 0.38);
      masterTimeline.to('#sr-s4', { autoAlpha: 0, duration: 0.04 }, 0.48);

      // Scene 5: After 15 Days (50-60%)
      masterTimeline.to('#sr-s5', { autoAlpha: 1, y: 0, duration: 0.08 }, 0.50);
      masterTimeline.to('#sr-s5', { autoAlpha: 0, duration: 0.04 }, 0.60);

      // Scene 6: Trust (62-72%)
      masterTimeline.to('#sr-s6', { autoAlpha: 1, y: 0, duration: 0.08 }, 0.62);
      masterTimeline.to('#sr-s6', { autoAlpha: 0, duration: 0.04 }, 0.72);

      // Scene 7: Comparison (74-88%)
      masterTimeline.to('#sr-s7-left', { autoAlpha: 0.6, y: 0, duration: 0.08 }, 0.74);
      masterTimeline.to('#sr-s7-right', { autoAlpha: 0.6, y: 0, duration: 0.08 }, 0.76);
      masterTimeline.to(['#sr-s7-left', '#sr-s7-right'], { autoAlpha: 0, duration: 0.06 }, 0.88);

      // Final Product Hold (90-100%)
      masterTimeline.to('#sr-final', { autoAlpha: 1, y: 0, duration: 0.08 }, 0.91);
    }

    // KETO FAT BURNER: Synchronized Narrative (8 Scenes)
    if (productType === 'keto') {
      gsap.set('.keto-text-element', { autoAlpha: 0, y: 15 });

      // Scene 1: Before Use (0-12%)
      masterTimeline.to('#k-s1', { autoAlpha: 1, y: 0, duration: 0.08 }, 0.01);
      masterTimeline.to('#k-s1', { autoAlpha: 0, duration: 0.04 }, 0.12);

      // Scene 2: Start Using (14-24%)
      masterTimeline.to('#k-s2', { autoAlpha: 1, y: 0, duration: 0.08 }, 0.14);
      masterTimeline.to('#k-s2', { autoAlpha: 0, duration: 0.04 }, 0.24);

      // Scene 3: After 5 Days (26-36%)
      masterTimeline.to('#k-s3', { autoAlpha: 1, y: 0, duration: 0.08 }, 0.26);
      masterTimeline.to('#k-s3', { autoAlpha: 0, duration: 0.04 }, 0.36);

      // Scene 4: Consistency (38-48%)
      masterTimeline.to('#k-s4', { autoAlpha: 1, y: 0, duration: 0.08 }, 0.38);
      masterTimeline.to('#k-s4', { autoAlpha: 0, duration: 0.04 }, 0.48);

      // Scene 5: After 15 Days (50-60%)
      masterTimeline.to('#k-s5', { autoAlpha: 1, y: 0, duration: 0.08 }, 0.50);
      masterTimeline.to('#k-s5', { autoAlpha: 0, duration: 0.04 }, 0.60);

      // Scene 6: Trust (62-72%)
      masterTimeline.to('#k-s6', { autoAlpha: 1, y: 0, duration: 0.08 }, 0.62);
      masterTimeline.to('#k-s6', { autoAlpha: 0, duration: 0.04 }, 0.72);

      // Scene 7: Comparison (74-88%)
      masterTimeline.to('#k-s7-left', { autoAlpha: 0.6, y: 0, duration: 0.08 }, 0.74);
      masterTimeline.to('#k-s7-right', { autoAlpha: 0.6, y: 0, duration: 0.08 }, 0.76);
      masterTimeline.to(['#k-s7-left', '#k-s7-right'], { autoAlpha: 0, duration: 0.06 }, 0.88);

      // Final Product Hold (90-100%)
      masterTimeline.to('#k-final', { autoAlpha: 1, y: 0, duration: 0.08 }, 0.91);
    }

    if (productType === 'ashwagandha') {
      const ashTime = gsap.timeline({ scrollTrigger: { trigger: containerRef.current, start: 'top top', end: scrollDistance, scrub: 0.5 } });
      gsap.set('.ash-text', { autoAlpha: 0, y: 30 });
      // Scene 1
      ashTime.fromTo('#ash-1', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0);
      ashTime.to('#ash-1', { autoAlpha: 0, y: -20, duration: 0.05 }, 0.12);
      // Scene 2
      ashTime.fromTo('#ash-2', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.13);
      ashTime.to('#ash-2', { autoAlpha: 0, y: -20, duration: 0.05 }, 0.25);
      // Scene 3
      ashTime.fromTo('#ash-3', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.26);
      ashTime.to('#ash-3', { autoAlpha: 0, y: -20, duration: 0.05 }, 0.38);
      // Scene 4
      ashTime.fromTo('#ash-4', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.39);
      ashTime.to('#ash-4', { autoAlpha: 0, y: -20, duration: 0.05 }, 0.51);
      // Scene 5
      ashTime.fromTo('#ash-5', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.52);
      ashTime.to('#ash-5', { autoAlpha: 0, y: -20, duration: 0.05 }, 0.64);
      // Final
      ashTime.fromTo('#ash-final', { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.05 }, 0.66);
    }



    if (productType === 'slim') {
      const sTime = gsap.timeline({ scrollTrigger: { trigger: containerRef.current, start: 'top top', end: scrollDistance, scrub: 0.5 } });
      gsap.set('.slim-text', { autoAlpha: 0, y: 30 });
      sTime.fromTo('#slim-1', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0);
      sTime.to('#slim-1', { autoAlpha: 0, y: -20, duration: 0.05 }, 0.20);

      sTime.fromTo('#slim-2', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.21);
      sTime.to('#slim-2', { autoAlpha: 0, y: -20, duration: 0.05 }, 0.40);

      sTime.fromTo('#slim-3', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.41);
      sTime.to('#slim-3', { autoAlpha: 0, y: -20, duration: 0.05 }, 0.60);

      sTime.fromTo('#slim-final', { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.05 }, 0.62);
    }

    if (productType === 'metabolism') {
      const mTime = gsap.timeline({ scrollTrigger: { trigger: containerRef.current, start: 'top top', end: scrollDistance, scrub: 0.5 } });
      gsap.set('.meta-text', { autoAlpha: 0, y: 30 });
      mTime.fromTo('#meta-1', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0);
      mTime.to('#meta-1', { autoAlpha: 0, y: -20, duration: 0.05 }, 0.20);

      mTime.fromTo('#meta-2', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.21);
      mTime.to('#meta-2', { autoAlpha: 0, y: -20, duration: 0.05 }, 0.40);

      mTime.fromTo('#meta-3', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.41);
      mTime.to('#meta-3', { autoAlpha: 0, y: -20, duration: 0.05 }, 0.60);

      mTime.fromTo('#meta-final', { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.05 }, 0.62);
    }

    if (productType === 'testosterone') {
      const tTime = gsap.timeline({ scrollTrigger: { trigger: containerRef.current, start: 'top top', end: scrollDistance, scrub: 0.5 } });
      gsap.set('.testo-text', { autoAlpha: 0, y: 30 });
      tTime.fromTo('#testo-1', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0);
      tTime.to('#testo-1', { autoAlpha: 0, y: -20, duration: 0.05 }, 0.20);

      tTime.fromTo('#testo-2', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.21);
      tTime.to('#testo-2', { autoAlpha: 0, y: -20, duration: 0.05 }, 0.40);

      tTime.fromTo('#testo-3', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.41);
      tTime.to('#testo-3', { autoAlpha: 0, y: -20, duration: 0.05 }, 0.60);

      tTime.fromTo('#testo-final', { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.05 }, 0.62);
    }


    // Final refresh to ensure all triggers are synced
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isLoading, images]);

  return (
    <div ref={containerRef} className="animation-container">
      {isLoading && (
        <div className="loading-screen">
          <div className="loader"></div>
          <p>Forging Luxury... {progress}%</p>
        </div>
      )}
      <canvas ref={canvasRef} className="animation-canvas" />

      {/* Generic Overlay - Only if no custom story (currently all have stories, so this is effectively hidden) */}
      {false && (
        <div className="overlay-container">
          <div className="text-overlay text-overlay-1">
            <span className="subtitle">
              {productType === 'keto' ? 'The Vortex of Purity' : productType === 'slim' ? 'The Flow of Balance' : productType === 'skin_radiance' ? 'Dermal Luminosity' : productType === 'ashwagandha' ? 'Ancient Strength' : productType === 'testosterone' ? 'Prime Masculine Power' : 'The Metabolic Surge'}
            </span>
            <h2 className="title">
              {productType === 'keto' ? 'Premium Creamy Texture' : productType === 'slim' ? 'Metabolic Optimization' : productType === 'skin_radiance' ? 'Ageless Skin Radiance' : productType === 'ashwagandha' ? 'KSM-66 Premium Ashwagandha' : productType === 'testosterone' ? 'Pure Testosterone Support' : 'Natural Energy Flow'}
            </h2>
            <p className="description">
              {productType === 'keto'
                ? 'Witness the fusion of science and nature as the silk vortex begins to form.'
                : productType === 'slim'
                  ? 'Engineered for those who demand more from their metabolism. Pure, balanced, effective.'
                  : productType === 'skin_radiance'
                    ? 'Reveal your natural glow. A powerful blend of antioxidants and hydration boosters.'
                    : productType === 'ashwagandha'
                      ? 'Master your stress. Restore your focus. The worlds most researched adaptogen for the modern man.'
                      : productType === 'testosterone'
                        ? 'Unlock your peak potential. A synergistic blend designed to support natural hormonal balance and vitality.'
                        : 'Unlock your body’s latent potential with our scientifically backed metabolic support formula.'}
            </p>
          </div>

          <div className="text-overlay text-overlay-2">
            <span className="subtitle">The Reveal</span>
            <h2 className="title">
              {productType === 'keto' ? 'Biotin + Silk Protein' : productType === 'slim' ? 'Slim Plus Advanced' : productType === 'skin_radiance' ? 'JEEVIX SKIN RADIANCE' : productType === 'ashwagandha' ? 'JEEVIX ASHWAGANDHA' : productType === 'testosterone' ? 'JEEVIX TESTO BOOSTER' : 'Metabolism Max'}
            </h2>
            <p className="description">
              {productType === 'keto'
                ? 'Nourishment that goes deeper. Designed for ultimate strength and shine.'
                : productType === 'slim'
                  ? 'Our most advanced formula for sustainable weight management and natural energy.'
                  : productType === 'skin_radiance'
                    ? 'Experience the pinnacle of skin health. A scientific masterpiece for a radiant complexion.'
                    : productType === 'ashwagandha'
                      ? 'Clinically proven to reduce cortisol and boost performance. Pure strength, extracted.'
                      : productType === 'testosterone'
                        ? 'The ultimate support for masculine health. Reclaim your drive and physical excellence.'
                        : 'Pure ingredients harmonized to optimize your daily energy and cellular performance.'}
            </p>
          </div>

          <div className="text-overlay text-overlay-3">
            <div className="ingredients-showcase">
              <span className="subtitle">Molecular Assembly</span>
              <div className="ingredients-grid">
                {productType === 'keto' && (
                  <>
                    <div className="ingredient-item">
                      <span className="ingredient-icon gold">✨</span>
                      <div className="ingredient-info"><strong>Biotin Particles</strong><span>Strengthening</span></div>
                    </div>
                    <div className="ingredient-item">
                      <span className="ingredient-icon silk">🧵</span>
                      <div className="ingredient-info"><strong>Silk Protein</strong><span>Protection</span></div>
                    </div>
                    <div className="ingredient-item">
                      <span className="ingredient-icon green">🌿</span>
                      <div className="ingredient-info"><strong>Botanical</strong><span>Freshness</span></div>
                    </div>
                    <div className="ingredient-item">
                      <span className="ingredient-icon milk">💧</span>
                      <div className="ingredient-info"><strong>Cream Droplets</strong><span>Hydration</span></div>
                    </div>
                  </>
                )}
                {productType === 'slim' && (
                  <>
                    <div className="ingredient-item">
                      <span className="ingredient-icon gold">🍵</span>
                      <div className="ingredient-info"><strong>Green Tea</strong><span>Oxidation</span></div>
                    </div>
                    <div className="ingredient-item">
                      <span className="ingredient-icon silk">⚡</span>
                      <div className="ingredient-info"><strong>L-Carnitine</strong><span>Energy</span></div>
                    </div>
                    <div className="ingredient-item">
                      <span className="ingredient-icon green">🌶️</span>
                      <div className="ingredient-info"><strong>Capsicum</strong><span>Burn</span></div>
                    </div>
                    <div className="ingredient-item">
                      <span className="ingredient-icon milk">🧬</span>
                      <div className="ingredient-info"><strong>B-Vitamins</strong><span>Support</span></div>
                    </div>
                  </>
                )}
                {productType === 'metabolism' && (
                  <>
                    <div className="ingredient-item">
                      <span className="ingredient-icon gold">🔋</span>
                      <div className="ingredient-info"><strong>CoQ10</strong><span>Cellular Power</span></div>
                    </div>
                    <div className="ingredient-item">
                      <span className="ingredient-icon silk">🦾</span>
                      <div className="ingredient-info"><strong>Ashwagandha</strong><span>Stress Control</span></div>
                    </div>
                    <div className="ingredient-item">
                      <span className="ingredient-icon green">🍃</span>
                      <div className="ingredient-info"><strong>Ginseng Extract</strong><span>Vitality</span></div>
                    </div>
                    <div className="ingredient-item">
                      <span className="ingredient-icon milk">💎</span>
                      <div className="ingredient-info"><strong>Magnesium</strong><span>Enzyme Support</span></div>
                    </div>
                  </>
                )}


                {productType === 'skin_radiance' && (
                  <>
                    <div className="ingredient-item">
                      <span className="ingredient-icon gold">🍶</span>
                      <div className="ingredient-info"><strong>Glutathione</strong><span>Brightening</span></div>
                    </div>
                    <div className="ingredient-item">
                      <span className="ingredient-icon silk">💧</span>
                      <div className="ingredient-info"><strong>Hyaluronic Acid</strong><span>Hydration</span></div>
                    </div>
                    <div className="ingredient-item">
                      <span className="ingredient-icon green">🍷</span>
                      <div className="ingredient-info"><strong>Resveratrol</strong><span>Anti-Aging</span></div>
                    </div>
                    <div className="ingredient-item">
                      <span className="ingredient-icon milk">🍂</span>
                      <div className="ingredient-info"><strong>Niacinamide</strong><span>Texture</span></div>
                    </div>
                  </>
                )}
                {productType === 'ashwagandha' && (
                  <>
                    <div className="ingredient-item">
                      <span className="ingredient-icon gold">🧘</span>
                      <div className="ingredient-info"><strong>KSM-66®</strong><span>Stress Balance</span></div>
                    </div>
                    <div className="ingredient-item">
                      <span className="ingredient-icon silk">🏹</span>
                      <div className="ingredient-info"><strong>Withanolides</strong><span>Purity</span></div>
                    </div>
                    <div className="ingredient-item">
                      <span className="ingredient-icon green">🔋</span>
                      <div className="ingredient-info"><strong>Energy Boost</strong><span>Vitality</span></div>
                    </div>
                    <div className="ingredient-item">
                      <span className="ingredient-icon milk">🧠</span>
                      <div className="ingredient-info"><strong>Cognitive</strong><span>Sharpness</span></div>
                    </div>
                  </>
                )}
                {productType === 'testosterone' && (
                  <>
                    <div className="ingredient-item">
                      <span className="ingredient-icon gold">🦁</span>
                      <div className="ingredient-info"><strong>Fenugreek</strong><span>Strength</span></div>
                    </div>
                    <div className="ingredient-item">
                      <span className="ingredient-icon silk">🛡️</span>
                      <div className="ingredient-info"><strong>Zinc Magnesium</strong><span>Recovery</span></div>
                    </div>
                    <div className="ingredient-item">
                      <span className="ingredient-icon green">⚡</span>
                      <div className="ingredient-info"><strong>Tribulus</strong><span>Power</span></div>
                    </div>
                    <div className="ingredient-item">
                      <span className="ingredient-icon milk">🩸</span>
                      <div className="ingredient-info"><strong>Nitric Oxide</strong><span>Blood Flow</span></div>
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>

          <div className="text-overlay text-overlay-4">
            <h1 className="hero-title">JEEVIX</h1>
            <p className="hero-subtitle">
              {productType === 'keto' ? 'Biotin + Silk Protein' : productType === 'slim' ? 'Slim Plus Masterpiece' : productType === 'skin_radiance' ? 'Ultimate Skin Radiance' : productType === 'ashwagandha' ? 'Peak Adaptogenic Support' : productType === 'testosterone' ? 'Pure Testosterone Vitality' : 'Metabolic Excellence'}
            </p>
            <div className="product-meta">
              <span>{productType === 'keto' ? 'Natural' : 'Scientific'}</span>
              <span className="separator">•</span>
              <span>{productType === 'keto' ? 'Salon-Grade' : productType === 'slim' ? 'Doctor-Formulated' : productType === 'skin_radiance' ? 'Esthetician-Recommended' : productType === 'ashwagandha' ? 'KSM-66® Certified' : productType === 'testosterone' ? 'Performance-Grade' : 'Clinical Strength'}</span>
              <span className="separator">•</span>
              <span>Premium Care</span>
            </div>
            <button className="cta-button">Order Your Ritual</button>
          </div>
        </div>
      )}

      {productType === 'brain_booster' && (
        <div className="brain-story-container">
          {/* Scene 1: Mental Overload - LEFT */}
          <div className="brain-story-scene b-bottom-left" id="bb-s1">
            <p className="massive-bold-text stagger-line" id="bb-s1-l1">“Too many thoughts.”</p>
            <p className="massive-bold-text stagger-line" id="bb-s1-l2">“Too little clarity.”</p>
            <p className="massive-bold-text stagger-line" id="bb-s1-l3">“Mind felt heavy.”</p>
            <p className="massive-bold-text stagger-line" id="bb-s1-l4">“Focus kept slipping.”</p>
            <p className="premium-desc stagger-line" id="bb-s1-pause" style={{ marginTop: '20px' }}>“Every day felt mentally exhausting.”</p>
          </div>

          {/* Scene 2: Inside Mind - RIGHT */}
          <div className="brain-story-scene b-bottom-right" id="bb-s2">
            <p className="massive-bold-text stagger-line" id="bb-s2-l1">“His mind wasn’t weak.”</p>
            <p className="massive-bold-text stagger-line" id="bb-s2-l2">“It was overloaded.”</p>
            <p className="premium-desc stagger-line" id="bb-s2-n1">“Focus was fading.”</p>
            <p className="premium-desc stagger-line" id="bb-s2-n2">“Memory felt distant.”</p>
            <p className="premium-desc stagger-line" id="bb-s2-n3">“Mental energy was low.”</p>
          </div>

          {/* Scene 3: Realization - LEFT */}
          <div className="brain-story-scene b-bottom-left" id="bb-s3">
            <p className="massive-bold-text stagger-line" id="bb-s3-l1">“He paused.”</p>
            <p className="massive-bold-text stagger-line" id="bb-s3-l2">“He listened to himself.”</p>
            <p className="premium-desc stagger-line" id="bb-s3-n1">“More coffee wasn’t the answer.”</p>
            <h2 className="premium-title stagger-line" id="bb-s3-n2">“His brain needed nourishment.”</h2>
          </div>

          {/* Scene 4: Search - RIGHT */}
          <div className="brain-story-scene b-bottom-right" id="bb-s4">
            <h2 className="premium-title stagger-line" id="bb-s4-l1">“He searched for support.”</h2>
            <h2 className="premium-title stagger-line" id="bb-s4-l2" style={{ color: '#d4af37' }}>“Not stimulation.”</h2>
            <h2 className="premium-title stagger-line" id="bb-s4-l3" style={{ color: '#d4af37' }}>“Not shortcuts.”</h2>
          </div>

          {/* Scene 5: Ayurveda - LEFT */}
          <div className="brain-story-scene b-bottom-left" id="bb-s5">
            <h1 className="massive-bold-text stagger-line" id="bb-s5-l1">“Ayurveda believed in balance.”</h1>
            <p className="premium-desc stagger-line" id="bb-s5-l2">“Supporting the mind naturally.”</p>
            <p className="premium-desc stagger-line" id="bb-s5-l3">“Not forcing it.”</p>
          </div>

          {/* Scene 6: Discovery - RIGHT */}
          <div className="brain-story-scene b-bottom-right" id="bb-s6">
            <h1 className="massive-bold-text stagger-line" id="bb-s6-l1">“Ayurvedic Brain Support”</h1>
            <p className="premium-desc stagger-line" id="bb-s6-l2">✔ “Supports focus & memory”</p>
            <p className="premium-desc stagger-line" id="bb-s6-l3">✔ “No chemicals.”</p>
            <p className="premium-desc stagger-line" id="bb-s6-l4">✔ “No artificial stimulants.”</p>
            <p className="italic-footer stagger-line" id="bb-s6-soft">“Just natural brain care.”</p>
          </div>

          {/* Scene 7: Daily Routine - LEFT */}
          <div className="brain-story-scene b-bottom-left" id="bb-s7">
            <h1 className="massive-bold-text stagger-line" id="bb-s7-l1">“He chose consistency.”</h1>
            <h1 className="massive-bold-text stagger-line" id="bb-s7-l2">“He chose clarity.”</h1>
            <p className="premium-desc stagger-line" id="bb-s7-n1">“Calm support.”</p>
            <p className="premium-desc stagger-line" id="bb-s7-n2">“Every day.”</p>
          </div>

          {/* Scene 8: Progress - RIGHT */}
          <div className="brain-story-scene b-bottom-right" id="bb-s8-d5">
            <h2 className="premium-subtitle">Day 5</h2>
            <p className="massive-bold-text">“Mind feels lighter.”</p>
            <p className="massive-bold-text">“Thoughts more organized.”</p>
          </div>
          <div className="brain-story-scene b-bottom-right" id="bb-s8-d10">
            <h2 className="premium-subtitle">Day 10</h2>
            <p className="massive-bold-text">“Focus improved.”</p>
            <p className="massive-bold-text">“Mental energy stable.”</p>
          </div>
          <div className="brain-story-scene b-bottom-right" id="bb-s8-d15">
            <h2 className="premium-subtitle">Day 15</h2>
            <p className="massive-bold-text">“Memory sharper.”</p>
            <p className="massive-bold-text">“Thinking clearer.”</p>
            <p className="premium-desc" style={{ color: '#d4af37' }}>“Confidence quieter — but stronger.”</p>
          </div>

          {/* Scene 9: Results - LEFT */}
          <div className="brain-story-scene b-bottom-left" id="bb-s9">
            <p className="premium-desc stagger-line" id="bb-s9-l1">“Supports focus & concentration”</p>
            <p className="premium-desc stagger-line" id="bb-s9-l2">“Helps memory retention”</p>
            <p className="premium-desc stagger-line" id="bb-s9-l3">“Reduces mental fatigue”</p>
            <p className="premium-desc stagger-line" id="bb-s9-l4">“Supports long-term brain health”</p>
            <div style={{ marginTop: '20px' }}>
              <h2 className="massive-bold-text stagger-line" id="bb-s9-p1" style={{ fontSize: '2.5rem' }}>“Not instant.”</h2>
              <h2 className="massive-bold-text stagger-line" id="bb-s9-p2" style={{ fontSize: '2.5rem', color: '#d4af37' }}>“But lasting.”</h2>
            </div>
          </div>

          {/* Scene 10: Nature -> Mind Connection - RIGHT */}
          <div className="brain-story-scene b-bottom-right" id="bb-s10">
            <h1 className="massive-bold-text stagger-line" id="bb-s10-l1">“From nature.”</h1>
            <h1 className="massive-bold-text stagger-line" id="bb-s10-l2" style={{ color: '#d4af37' }}>“To the mind.”</h1>
            <div style={{ marginTop: '20px' }}>
              <p className="premium-desc stagger-line" id="bb-s10-n1">“Not caffeine.”</p>
              <p className="premium-desc stagger-line" id="bb-s10-n2">“Not instant stimulation.”</p>
              <h2 className="premium-title stagger-line" id="bb-s10-n3">“Natural brain nourishment.”</h2>
            </div>
          </div>

          {/* Final Scene: Brand Lockup - CENTER */}
          <div className="brain-story-scene" id="bb-s11" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <h1 className="massive-bold-text" style={{ color: '#d4af37', letterSpacing: '10px', fontSize: '3.5rem' }}>JEEVIX BRAIN BOOSTER</h1>
            <p className="premium-desc" id="bb-s11-tagline" style={{ marginTop: '40px', letterSpacing: '5px', visibility: 'hidden', opacity: 0 }}>“Clarity Begins Within”</p>
          </div>
        </div>
      )}

      {productType === 'hair_vitamins' && (
        <div className="story-container">
          {/* Scene 1 (0-16.6%) */}
          <div className="hair-text-element h-bottom-left" id="hv-s1-1">"Every morning…"</div>
          <div className="hair-text-element h-bottom-left" id="hv-s1-2">"the same concern."</div>
          <div className="hair-text-element h-bottom-left" id="hv-s1-3">"Hair fall."</div>

          {/* Scene 2 (16.6-33.3%) */}
          <div className="hair-text-element h-bottom-center" id="hv-s2-1">"It’s not just hair…"</div>
          <div className="hair-text-element h-bottom-center" id="hv-s2-2">"it affects confidence."</div>

          {/* Scene 3 (33.3-50%) */}
          <div className="hair-text-element h-bottom-right" id="hv-s3-1">"Looking for something natural…"</div>
          <div className="hair-text-element h-bottom-right" id="hv-s3-2">"something real."</div>

          {/* Scene 4 (50-66.6%) */}
          <div className="hair-text-element h-bottom-center" id="hv-s4-1">"That’s when I found"</div>
          <div className="hair-text-element h-bottom-center" id="hv-s4-2">"JEEVIX Hair Vitamins"</div>

          {/* Scene 5 (66.6-83.3%) */}
          <div className="hair-text-element h-bottom-left" id="hv-s5-1">"One capsule a day."</div>
          <div className="hair-text-element h-bottom-left" id="hv-s5-2">"Consistency matters."</div>

          {/* Scene 6 (83.3-100%) */}
          <div className="hair-text-element h-bottom-center" id="hv-s6-1">"Less hair fall."</div>
          <div className="hair-text-element h-bottom-center" id="hv-s6-2">"Stronger, healthier hair."</div>
          <div className="hair-text-element h-bottom-center" id="hv-s6-3" style={{ color: '#d4af37' }}>"JEEVIX Hair Vitamins"</div>
        </div>
      )}

      {productType === 'biotin' && (
        <div className="biotin-story-container">
          {/* Scene 1 (0-12%) */}
          <div className="biotin-text-element b-bottom-left" id="b-s1">
            “My skin started feeling dull and dry.”
          </div>

          {/* Scene 2 (14-24%) */}
          <div className="biotin-text-element b-bottom-right" id="b-s2">
            “I wanted something gentle and nourishing.”
          </div>

          {/* Scene 3 (26-36%) */}
          <div className="biotin-text-element b-bottom-left" id="b-s3">
            “In a few days, my skin felt more hydrated.”
          </div>

          {/* Scene 4 (38-48%) */}
          <div className="biotin-text-element b-bottom-right" id="b-s4">
            “I stayed consistent with my routine.”
          </div>

          {/* Scene 5 (50-60%) */}
          <div className="biotin-text-element b-bottom-left" id="b-s5">
            “My skin looked healthier and smoother.”
          </div>

          {/* Scene 6 (62-72%) */}
          <div className="biotin-text-element b-bottom-right" id="b-s6">
            “Simple care made a real difference.”
          </div>

          {/* Scene 7 (74-88%): Comparison */}
          <div className="biotin-text-element b-bottom-left" id="b-s7-left" style={{ fontSize: '18px', bottom: '12%', opacity: 0.6, color: '#aaa' }}>
            Before
          </div>
          <div className="biotin-text-element b-bottom-right" id="b-s7-right" style={{ fontSize: '18px', bottom: '12%', opacity: 0.6, color: '#aaa' }}>
            After
          </div>

          {/* Scene 8 (90-100%): Final Hold */}
          <div className="biotin-text-element b-center" id="b-final" style={{ top: '65%', fontSize: '36px', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase' }}>
            JEEVIX Biotin Cream
          </div>
        </div>
      )}
      {productType === 'skin_radiance' && (
        <div className="story-container">
          <div className="radiance-text-element r-bottom-left" id="sr-s1">“My skin looked tired and uneven.”</div>
          <div className="radiance-text-element r-bottom-right" id="sr-s2">“I wanted gentle care for natural glow.”</div>
          <div className="radiance-text-element r-bottom-left" id="sr-s3">“My skin started feeling fresher and softer.”</div>
          <div className="radiance-text-element r-bottom-right" id="sr-s4">“I followed my routine every day.”</div>
          <div className="radiance-text-element r-bottom-left" id="sr-s5">“My skin looked brighter and more even.”</div>
          <div className="radiance-text-element r-bottom-right" id="sr-s6">“Simple care brought visible radiance.”</div>

          <div className="radiance-text-element r-bottom-left" id="sr-s7-left" style={{ fontSize: '18px', bottom: '12%', opacity: 0.6, color: '#666' }}>Before</div>
          <div className="radiance-text-element r-bottom-right" id="sr-s7-right" style={{ fontSize: '18px', bottom: '12%', opacity: 0.6, color: '#666' }}>After</div>

          <div className="radiance-text-element r-center" id="sr-final" style={{ top: '65%', fontSize: '36px', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase' }}>JEEVIX Skin Radiance</div>
        </div>
      )}

      {productType === 'ashwagandha' && (
        <div className="story-container">
          <div className="biotin-text-element b-bottom-left ash-text" id="ash-1">Stress weighs heavy.</div>
          <div className="biotin-text-element b-bottom-right ash-text" id="ash-2">Find your balance.</div>
          <div className="biotin-text-element b-bottom-left ash-text" id="ash-3">Ancient strength.</div>
          <div className="biotin-text-element b-bottom-right ash-text" id="ash-4">Calm the storm.</div>
          <div className="biotin-text-element b-bottom-left ash-text" id="ash-5">Focused. Powerful.</div>
          <div className="biotin-text-element b-center ash-text" id="ash-final" style={{ color: '#d4af37', fontSize: '40px' }}>JEEVIX Ashwagandha</div>
        </div>
      )}

      {productType === 'keto' && (
        <div className="story-container">
          <div className="keto-text-element k-bottom-left" id="k-s1">“I felt heavy and low on energy.”</div>
          <div className="keto-text-element k-bottom-right" id="k-s2">“I wanted clean support for my routine.”</div>
          <div className="keto-text-element k-bottom-left" id="k-s3">“My energy felt more stable.”</div>
          <div className="keto-text-element k-bottom-right" id="k-s4">“I stayed consistent with my plan.”</div>
          <div className="keto-text-element k-bottom-left" id="k-s5">“My body felt lighter and more active.”</div>
          <div className="keto-text-element k-bottom-right" id="k-s6">“Simple habits made real progress.”</div>

          <div className="keto-text-element k-bottom-left" id="k-s7-left" style={{ fontSize: '18px', bottom: '12%', opacity: 0.6, color: '#666' }}>Before</div>
          <div className="keto-text-element k-bottom-right" id="k-s7-right" style={{ fontSize: '18px', bottom: '12%', opacity: 0.6, color: '#666' }}>After</div>

          <div className="keto-text-element k-center" id="k-final" style={{ top: '65%', fontSize: '36px', fontWeight: 800, letterSpacing: '4px', textTransform: 'uppercase' }}>JEEVIX Keto Fat Burner</div>
        </div>
      )}

      {productType === 'slim' && (
        <div className="story-container">
          <div className="biotin-text-element b-bottom-left slim-text" id="slim-1">Shape your future.</div>
          <div className="biotin-text-element b-bottom-right slim-text" id="slim-2">Light. Active. Fit.</div>
          <div className="biotin-text-element b-bottom-left slim-text" id="slim-3">Natural balance.</div>
          <div className="biotin-text-element b-center slim-text" id="slim-final" style={{ color: '#d4af37', fontSize: '40px' }}>JEEVIX Slim</div>
        </div>
      )}

      {productType === 'metabolism' && (
        <div className="story-container">
          <div className="biotin-text-element b-bottom-left meta-text" id="meta-1">Wake up your body.</div>
          <div className="biotin-text-element b-bottom-right meta-text" id="meta-2">Burn more.</div>
          <div className="biotin-text-element b-bottom-left meta-text" id="meta-3">All day energy.</div>
          <div className="biotin-text-element b-center meta-text" id="meta-final" style={{ color: '#d4af37', fontSize: '40px' }}>JEEVIX Metabolism</div>
        </div>
      )}

      {productType === 'testosterone' && (
        <div className="story-container">
          <div className="biotin-text-element b-bottom-left testo-text" id="testo-1">Energy dipping?</div>
          <div className="biotin-text-element b-bottom-right testo-text" id="testo-2">Reclaim your drive.</div>
          <div className="biotin-text-element b-bottom-left testo-text" id="testo-3">Peak performance.</div>
          <div className="biotin-text-element b-center testo-text" id="testo-final" style={{ color: '#d4af37', fontSize: '40px' }}>JEEVIX Testo Booster</div>
        </div>
      )}



      <style>{`
        .animation-container {
          width: 100vw;
          height: 100vh;
          position: relative;
          background: #000; /* Dark background to prevent white flashes */
          overflow: hidden;
          margin: 0;
          padding: 0;
        }

        .animation-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: block;
          z-index: 1;
        }

        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #e8f0e9;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 100;
          font-family: 'Outfit', sans-serif;
        }

        .loader {
          width: 48px;
          height: 48px;
          border: 3px solid #2d4a3e;
          border-bottom-color: transparent;
          border-radius: 50%;
          display: inline-block;
          box-sizing: border-box;
          animation: rotation 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .overlay-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }

        .text-overlay {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          opacity: 0;
          transform: translateY(30px);
          padding: 0 40px;
        }

        .subtitle {
          text-transform: uppercase;
          letter-spacing: 5px;
          font-size: 12px;
          color: #2d4a3e;
          margin-bottom: 20px;
          font-weight: 700;
        }

        .title {
          font-size: clamp(2.5rem, 6vw, 5rem);
          color: #1a1a1a;
          margin: 0;
          line-height: 1;
          font-weight: 700;
        }

        .description {
          max-width: 600px;
          font-size: 20px;
          color: #4a4a4a;
          margin-top: 30px;
          line-height: 1.6;
          font-weight: 300;
        }

        .ingredients-showcase {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          padding: 60px;
          border-radius: 40px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
        }

        .ingredients-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 40px;
          margin-top: 20px;
        }

        .ingredient-item {
          display: flex;
          align-items: center;
          gap: 20px;
          text-align: left;
        }

        .ingredient-icon {
          font-size: 32px;
          width: 60px;
          height: 60px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px rgba(0,0,0,0.03);
        }

        .ingredient-info {
          display: flex;
          flex-direction: column;
        }

        .ingredient-info strong {
          font-size: 18px;
          color: #2d4a3e;
        }

        .ingredient-info span {
          font-size: 14px;
          color: #666;
        }

        .hero-title {
          font-size: clamp(5rem, 18vw, 12rem);
          font-weight: 800;
          color: #2d4a3e;
          margin: 0;
          letter-spacing: -4px;
          line-height: 1;
        }

        .hero-subtitle {
          letter-spacing: 15px;
          font-weight: 600;
          color: #1a1a1a;
          margin-top: 0;
          margin-bottom: 20px;
          text-transform: uppercase;
          font-size: 14px;
        }

        .product-meta {
          display: flex;
          gap: 20px;
          color: #666;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 50px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .separator {
          color: #d4af37;
        }

        .cta-button {
          padding: 22px 60px;
          background: #2d4a3e;
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 20px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          pointer-events: auto;
          box-shadow: 0 15px 30px rgba(45, 74, 62, 0.2);
        }

        .cta-button:hover {
          background: #1e332a;
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 20px 40px rgba(45, 74, 62, 0.3);
        }

        /* BRAIN BOOSTER STORY STYLES - CINEMATIC 11 SCENE */
        .brain-story-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 3000;
          pointer-events: none;
        }

        .brain-story-scene {
          position: absolute;
          width: 100%;
          max-width: 1200px;
          padding: 0 40px;
          display: flex;
          flex-direction: column;
          opacity: 0;
          z-index: 3000;
        }

        .brain-story-scene.b-bottom-left {
          bottom: 12%;
          left: 10%;
          align-items: flex-start;
          text-align: left;
        }

        .brain-story-scene.b-bottom-right {
          bottom: 12%;
          right: 10%;
          align-items: flex-end;
          text-align: right;
        }

        .massive-bold-text {
          font-size: clamp(1.8rem, 5vw, 3.5rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -2px;
          color: #fff;
          text-transform: uppercase;
          margin: 5px 0;
          text-shadow: 0 4px 20px rgba(0,0,0,0.8);
        }

        .premium-title {
          font-size: clamp(1.5rem, 4vw, 3rem);
          font-weight: 800;
          letter-spacing: -1px;
          color: #fff;
          margin-top: 15px;
          text-transform: uppercase;
        }

        .premium-subtitle {
          font-size: 1.2rem;
          font-weight: 900;
          letter-spacing: 10px;
          text-transform: uppercase;
          color: #d4af37;
          margin-bottom: 20px;
        }

        .premium-desc {
          font-size: clamp(1.1rem, 2.5vw, 2rem);
          font-weight: 500;
          line-height: 1.4;
          color: rgba(255,255,255,0.9);
          margin: 8px 0;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .italic-footer {
          font-style: italic;
          font-size: 1.2rem;
          color: rgba(255,255,255,0.6);
          margin-top: 25px;
          font-weight: 400;
        }

        /* HAIR STORY STYLES */
        .hair-story-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 20;
        }

        .hair-text-element {
          position: absolute;
          opacity: 0;
          color: #f0f0f0; /* Soft white / light grey */
          font-family: 'Outfit', sans-serif;
          font-weight: 300; /* Thin weight */
          font-size: clamp(24px, 3vw, 32px); /* Responsive size */
          text-shadow: 0 4px 12px rgba(0,0,0,0.4); /* Subtle shadow */
          letter-spacing: 2px;
        }

        .p-bottom-left {
          bottom: 12%; /* Safe margin */
          left: 10%;
          text-align: left;
        }

        .p-bottom-center {
          bottom: 12%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
        }

        .p-bottom-right {
          bottom: 12%;
          right: 10%;
          text-align: right;
        }

        /* BRAIN SCATTER TEXT */
        .scatter-text {
           position: absolute;
           font-size: clamp(18px, 2vw, 24px);
           color: #f0f0f0;
           width: 300px;
           text-shadow: 0 0 20px rgba(0,0,0,0.8);
        }

        .top-left { top: 20%; left: 15%; text-align: left; }
        .top-right { top: 20%; right: 15%; text-align: right; }
        .bottom-left { bottom: 35%; left: 15%; text-align: left; }
        .bottom-right { bottom: 35%; right: 15%; text-align: right; }
        
        .center-summary {
           position: absolute;
           bottom: 15%;
           left: 50%;
           transform: translateX(-50%);
           width: 100%;
           text-align: center;
        }

        /* BIOTIN STORY STYLES */
        .biotin-story-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 3000;
        }

        .biotin-text-element {
          position: absolute;
          opacity: 0;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: clamp(20px, 2.5vw, 32px);
          text-shadow: 0 4px 20px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.5);
          letter-spacing: 0.5px;
          max-width: 500px;
          line-height: 1.4;
          z-index: 2500;
        }

        .b-bottom-left {
          bottom: 15%;
          left: 10%;
          text-align: left;
        }

        .b-bottom-right {
          bottom: 15%;
          right: 10%;
          text-align: right;
        }

        .hair-text-element {
          position: absolute;
          opacity: 0;
          color: #000;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: clamp(32px, 4.5vw, 56px);
          text-shadow: 0 4px 15px rgba(255,255,255,0.2);
          letter-spacing: 0.5px;
          line-height: 1.2;
          z-index: 3000;
          pointer-events: none;
        }

        .h-bottom-left {
          bottom: 12%;
          left: 10%;
          text-align: left;
        }

        .h-bottom-center {
          bottom: 12%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          width: 100%;
          max-width: 800px;
        }

        .h-bottom-right {
          bottom: 12%;
          right: 10%;
          text-align: right;
        }

        .radiance-text-element {
          position: absolute;
          opacity: 0;
          color: #000;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: clamp(28px, 4vw, 48px);
          text-shadow: 0 4px 15px rgba(255,255,255,0.2);
          letter-spacing: 0.5px;
          line-height: 1.2;
          z-index: 3000;
          pointer-events: none;
          max-width: 600px;
        }

        .r-bottom-left {
          bottom: 12%;
          left: 10%;
          text-align: left;
        }

        .r-bottom-right {
          bottom: 12%;
          right: 10%;
          text-align: right;
        }

        .r-center {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          width: 100%;
        }

        .keto-text-element {
          position: absolute;
          opacity: 0;
          color: #000;
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          font-size: clamp(28px, 4vw, 48px);
          text-shadow: 0 4px 15px rgba(255,255,255,0.2);
          letter-spacing: 0.5px;
          line-height: 1.2;
          z-index: 3000;
          pointer-events: none;
          max-width: 600px;
        }

        .k-bottom-left {
          bottom: 12%;
          left: 10%;
          text-align: left;
        }

        .k-bottom-right {
          bottom: 12%;
          right: 10%;
          text-align: right;
        }

        .k-center {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          width: 100%;
        }

        .b-center {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          width: 100%;
          max-width: 800px;
        }

        .radiance-text, .ash-text, .keto-text, .slim-text, .meta-text, .testo-text {
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 700;
          color: #fff;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
          position: absolute;
          z-index: 2000;
        }

        .story-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 1000;
        }

        .b-center-left {
          top: 50%;
          left: 10%;
          transform: translateY(-50%);
          text-align: left;
           font-weight: 500;
        }

        .b-bottom-center {
          bottom: 10%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          width: 100%;
        }

      `}</style>

    </div >
  );
};

export default ScrollAnimation;
