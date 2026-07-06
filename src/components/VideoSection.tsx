import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const VideoSection: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRefs = [
        useRef<HTMLVideoElement>(null),
        useRef<HTMLVideoElement>(null),
        useRef<HTMLVideoElement>(null)
    ];

    useGSAP(() => {
        if (!containerRef.current) return;


        // Create the master timeline for the scroll section
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: '+=300%', // 3 panels = 300% scroll
                scrub: true,
                pin: true,
                anticipatePin: 1,
            }
        });

        // Panel 1: Initial state (already visible)
        tl.to('.v-text-1', { opacity: 0, y: -50, duration: 0.5 }, 0.2);

        // Panel 2: Transition
        tl.fromTo('.video-panel-2',
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 },
            0.5
        );
        tl.to('.v-text-2', { opacity: 1, y: 0, duration: 0.5 }, 0.8);
        tl.to('.v-text-2', { opacity: 0, y: -50, duration: 0.5 }, 1.3);

        // Panel 3: Transition
        tl.fromTo('.video-panel-3',
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1 },
            1.5
        );
        tl.to('.v-text-3', { opacity: 1, y: 0, duration: 0.5 }, 1.8);

        // Play videos when they are in view
        videoRefs.forEach((ref, index) => {
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: `${index * 33}% top`,
                onEnter: () => ref.current?.play(),
                onEnterBack: () => ref.current?.play(),
            });
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="video-scroll-container">
            {/* Video Panel 1 */}
            <div className="video-panel video-panel-1">
                <video ref={videoRefs[0]} src="/videos/home_video_1.mp4" muted loop playsInline />
                <div className="video-overlay">
                    <div className="video-text v-text-1">
                        <span>Engineering Excellence</span>
                        <h2>Precision Crafted</h2>
                        <p>Every molecule designed for peak biological performance.</p>
                    </div>
                </div>
            </div>

            {/* Video Panel 2 */}
            <div className="video-panel video-panel-2">
                <video ref={videoRefs[1]} src="/videos/home_video_2.mp4" muted loop playsInline />
                <div className="video-overlay">
                    <div className="video-text v-text-2">
                        <span>Nature & Science</span>
                        <h2>Pure Extraction</h2>
                        <p>Sourcing the world's most potent ingredients for your wellness.</p>
                    </div>
                </div>
            </div>

            {/* Video Panel 3 */}
            <div className="video-panel video-panel-3">
                <video ref={videoRefs[2]} src="/videos/home_video_3.mp4" muted loop playsInline />
                <div className="video-overlay">
                    <div className="video-text v-text-3">
                        <span>Your Transformation</span>
                        <h2>The Future of You</h2>
                        <p>Join the elite circle of those who refuse to settle for average.</p>
                    </div>
                </div>
            </div>

            <style>{`
        .video-scroll-container {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #000;
        }

        .video-panel {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        .video-panel-1 { z-index: 1; }
        .video-panel-2 { z-index: 2; clip-path: inset(100% 0% 0% 0%); }
        .video-panel-3 { z-index: 3; clip-path: inset(100% 0% 0% 0%); }

        .video-panel video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px;
        }

        .video-text {
          text-align: center;
          color: white;
          max-width: 800px;
        }

        .v-text-1 { opacity: 1; transform: translateY(0); }
        .v-text-2, .v-text-3 { opacity: 0; transform: translateY(50px); }

        .video-text span {
          display: block;
          text-transform: uppercase;
          letter-spacing: 4px;
          font-size: 14px;
          margin-bottom: 20px;
          color: #e8f0e9;
        }

        .video-text h2 {
          font-size: clamp(3rem, 10vw, 6rem);
          line-height: 0.9;
          margin: 0;
          font-weight: 800;
        }

        .video-text p {
          font-size: 20px;
          margin-top: 30px;
          color: rgba(255,255,255,0.8);
          font-weight: 300;
        }
      `}</style>
        </div>
    );
};

export default VideoSection;
