import React, { useRef, useState, useEffect } from 'react';

const HomeHero: React.FC<{ onExplore: (view: string) => void }> = ({ onExplore }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const sections = [
    { src: '/videos/home_video_1.mp4', title: 'GLOW', subtitle: 'Inner Radiance', desc: 'Illuminate your beauty from the cellular level.', view: 'glow' },
    { src: '/videos/home_video_2.mp4', title: 'MAN', subtitle: 'Prime Vitality', desc: 'Precision-engineered supplements for the modern man.', view: 'man' },
    { src: '/videos/home_video_3.mp4', title: 'SLIM', subtitle: 'Pure Balance', desc: 'Metabolic optimization for a balanced lifestyle.', view: 'slim' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sliderRef.current) return;
      const scrollPos = sliderRef.current.scrollLeft;
      const width = sliderRef.current.offsetWidth;
      if (width === 0) return;
      const index = Math.round(scrollPos / width);
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    };

    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', handleScroll);
    }

    // Play/Pause logic based on activeIndex
    const vids = slider?.querySelectorAll('video');
    vids?.forEach((vid, i) => {
      if (i === activeIndex) {
        vid.currentTime = 0;
        vid.play().catch(() => { });
      } else {
        vid.pause();
      }
    });

    return () => slider?.removeEventListener('scroll', handleScroll);
  }, [activeIndex]);

  const handleSliderClick = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;

    // Ignore clicks on the explore button itself
    if ((e.target as HTMLElement).closest('.hero-cta-btn')) return;

    const width = sliderRef.current.offsetWidth;
    const clickX = e.clientX;
    const isRightClick = clickX > width / 2;

    if (isRightClick && activeIndex < sections.length - 1) {
      sliderRef.current.scrollTo({
        left: (activeIndex + 1) * width,
        behavior: 'smooth'
      });
    } else if (!isRightClick && activeIndex > 0) {
      sliderRef.current.scrollTo({
        left: (activeIndex - 1) * width,
        behavior: 'smooth'
      });
    }
  };

  const [videoProgress, setVideoProgress] = useState(0);

  useEffect(() => {
    const activeVid = sliderRef.current?.querySelector(`.hero-section:nth-child(${activeIndex + 1}) video`) as HTMLVideoElement;
    if (!activeVid) return;

    const updateProgress = () => {
      const p = (activeVid.currentTime / activeVid.duration) * 100;
      setVideoProgress(p);
    };

    activeVid.addEventListener('timeupdate', updateProgress);
    return () => activeVid.removeEventListener('timeupdate', updateProgress);
  }, [activeIndex]);

  return (
    <div
      className="full-frame-slider"
      ref={sliderRef}
      onClick={handleSliderClick}
    >
      <div className="slider-track">
        {sections.map((section, index) => (
          <section key={index} className={`hero-section ${index === activeIndex ? 'active' : ''}`}>
            <div className={`video-background ${index === activeIndex ? 'zoom-active' : ''}`}>
              <video
                src={section.src}
                autoPlay
                muted
                playsInline
                onEnded={() => {
                  if (index !== activeIndex) return; // Only active slide triggers auto-slide
                  if (!sliderRef.current) return;
                  const width = sliderRef.current.offsetWidth;
                  const nextIndex = (index + 1) % sections.length;
                  sliderRef.current.scrollTo({
                    left: nextIndex * width,
                    behavior: 'smooth'
                  });
                }}
              />
              <div className="video-shade"></div>
            </div>

            <div className={`hero-content-wrapper ${index === activeIndex ? 'active' : ''}`}>
              <div className="content-inner">
                <span className="hero-category">{section.subtitle}</span>
                <h1 className="hero-title">{section.title}</h1>
                <p className="hero-desc">{section.desc}</p>
                <button
                  onClick={() => onExplore(section.view)}
                  className="hero-cta-btn"
                >
                  Explore {section.title}
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="progress-meter" style={{ width: `${videoProgress}%` }}></div>

      <div className="horizontal-nav-hint">
        <div className="nav-line">
          {sections.map((_, i) => (
            <div key={i} className={`nav-dot ${i === activeIndex ? 'active' : ''}`}></div>
          ))}
        </div>
        <span>Click or Slide to Explore</span>
      </div>

      <style>{`
        .full-frame-slider {
          width: 100%;
          height: 100vh;
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
          background: #000;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .full-frame-slider::-webkit-scrollbar {
          display: none;
        }

        .slider-track {
          display: flex;
          width: 300%;
          height: 100%;
        }

        .hero-section {
          position: relative;
          width: 100vw;
          height: 100vh;
          flex-shrink: 0;
          scroll-snap-align: start;
          scroll-snap-stop: always;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #050505;
        }

        /* ANIMATED AMBIENT BLOBS */
        .hero-section::before, .hero-section::after {
          content: '';
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
          filter: blur(80px);
          z-index: 3;
          pointer-events: none;
          opacity: 0;
          transition: opacity 2s ease;
        }

        .active.hero-section::before {
          opacity: 1;
          animation: orbit 20s linear infinite;
          top: -10%; left: -10%;
        }
        .active.hero-section::after {
          opacity: 1;
          animation: orbit 25s linear infinite reverse;
          bottom: -10%; right: -10%;
        }

        @keyframes orbit {
          from { transform: rotate(0deg) translateX(100px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
        }

        .video-background video {
          width: 120%;
          height: 120%;
          object-fit: cover;
          position: absolute;
          top: -10%;
          left: -10%;
          transition: transform 12s cubic-bezier(0.1, 0, 0.2, 1);
          filter: brightness(0.7) contrast(1.2) saturate(1.1);
        }

        .video-background.zoom-active video {
          transform: scale(1.15) rotate(0.001deg);
          animation: videoPulse 10s ease-in-out infinite alternate;
        }

        @keyframes videoPulse {
          from { filter: brightness(0.7) contrast(1.2); }
          to { filter: brightness(0.85) contrast(1.3); }
        }

        .video-shade {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.9) 100%);
          z-index: 2;
        }

        .hero-content-wrapper {
          position: relative;
          z-index: 10;
          text-align: center;
          color: white;
          padding: 20px;
          perspective: 2000px;
        }

        .hero-category {
          display: inline-block;
          text-transform: uppercase;
          letter-spacing: 15px;
          font-size: 13px;
          color: #d4af37;
          margin-bottom: 30px;
          font-weight: 700;
          opacity: 0;
          transform: translateY(30px) rotateX(-90deg);
          transition: all 1.2s cubic-bezier(0.19, 1, 0.22, 1);
          background: rgba(212, 175, 55, 0.1);
          padding: 8px 25px;
          border-radius: 4px;
          border: 1px solid rgba(212, 175, 55, 0.2);
        }

        .active .hero-category {
          opacity: 1;
          transform: translateY(0) rotateX(0);
          animation: categoryGlow 4s ease-in-out infinite;
        }

        @keyframes categoryGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(212,175,55,0); border-color: rgba(212,175,55,0.2); }
          50% { box-shadow: 0 0 40px rgba(212,175,55,0.2); border-color: rgba(212,175,55,0.5); }
        }

        .hero-title {
          font-size: clamp(4rem, 18vw, 12rem);
          font-weight: 950;
          line-height: 0.8;
          margin: 0;
          letter-spacing: -6px;
          opacity: 0;
          transform: translateZ(200px) scale(0.7);
          transition: all 1.5s cubic-bezier(0.23, 1, 0.32, 1) 0.3s;
          background: linear-gradient(180deg, #fff 30%, #a5a5a5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 30px 50px rgba(0,0,0,0.8));
        }

        .active .hero-title {
          opacity: 1;
          transform: translateZ(0) scale(1);
          animation: titleFloating 6s ease-in-out infinite;
        }

        @keyframes titleFloating {
          0%, 100% { transform: translateY(0) rotate(0deg); filter: drop-shadow(0 30px 50px rgba(0,0,0,0.8)); }
          50% { transform: translateY(-15px) rotate(0.5deg); filter: drop-shadow(0 50px 70px rgba(212, 175, 55, 0.2)); }
        }

        .hero-desc {
          font-size: 22px;
          max-width: 650px;
          margin: 45px auto;
          font-weight: 300;
          color: rgba(255,255,255,0.6);
          line-height: 1.8;
          opacity: 0;
          transform: translateY(40px);
          transition: all 1.2s ease-out 0.7s;
          letter-spacing: 1px;
        }

        .active .hero-desc {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-cta-btn {
          padding: 22px 70px;
          border-radius: 2px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(25px);
          color: white;
          font-size: 14px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 6px;
          cursor: pointer;
          position: relative;
          opacity: 0;
          transform: translateY(50px);
          transition: all 1s cubic-bezier(0.19, 1, 0.22, 1) 1s;
        }

        .active .hero-cta-btn {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .hero-cta-btn:hover::before {
          transform: translateX(100%);
        }

        .hero-cta-btn:hover {
          border-color: #d4af37;
          background: #d4af37;
          color: #000;
          box-shadow: 0 0 50px rgba(212, 175, 55, 0.5);
          transform: scale(1.05) translateY(-5px);
        }

        /* LIVE PROGRESS BAR */
        .progress-meter {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 4px;
          background: #d4af37;
          box-shadow: 0 0 20px #d4af37;
          z-index: 100;
          transition: width 0.1s linear;
        }

        .horizontal-nav-hint {
          position: absolute;
          bottom: 50px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          color: white;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 3px;
          pointer-events: none;
        }

        .nav-line {
          display: flex;
          gap: 15px;
        }

        .nav-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
        }

        .nav-dot.active {
          background: #d4af37;
          box-shadow: 0 0 10px #d4af37;
        }

        @media (max-width: 768px) {
          .hero-title { font-size: 4rem; }
          .hero-desc { font-size: 16px; }
        }
      `}</style>
    </div>
  );
};

export default HomeHero;
