import React from 'react';

interface Product {
  id: string;
  name: string;
  image: string;
  view: 'man' | 'slim' | 'glow';
  subProduct: string;
  description: string;
}

interface HomeProductGridProps {
  onSelectProduct: (view: 'man' | 'slim' | 'glow', subProduct: any) => void;
}

const products: (Product & { price: string })[] = [
  { id: 'ash', name: 'Ashwagandha Premium', price: '₹1,299', image: '/ash_summary_fixed.jpg', view: 'man', subProduct: 'ashwagandha', description: 'Stress & Inner Strength' },
  { id: 'testo', name: 'Testosterone Booster', price: '₹1,499', image: '/testo_summary.jpg', view: 'man', subProduct: 'testosterone', description: 'Peak Performance' },
  { id: 'brain', name: 'Brain Booster', price: '₹1,599', image: '/brain_summary.jpg', view: 'man', subProduct: 'brain_booster', description: 'Cognitive Focus' },
  { id: 'keto', name: 'Keto Fat Burner', price: '₹1,199', image: '/keto_summary.jpg', view: 'slim', subProduct: 'keto', description: 'Advanced Weight Loss' },
  { id: 'slim-plus', name: 'Slim Plus', price: '₹1,249', image: '/slim_plus_summary.jpg', view: 'slim', subProduct: 'slim_plus', description: 'Natural Metabolism' },
  { id: 'meta', name: 'Metabolism Support', price: '₹999', image: '/meta.jpeg', view: 'slim', subProduct: 'metabolism', description: 'Digestive Balance' },
  { id: 'biotin', name: 'Biotin Premium', price: '₹899', image: '/biotin.jpeg', view: 'glow', subProduct: 'biotin', description: 'Hair & Nail Strength' },
  { id: 'hair', name: 'Hair Vitamins', price: '₹799', image: '/hair_summary.jpg', view: 'glow', subProduct: 'hair_vitamins', description: 'Growth & Vitality' },
  { id: 'skin', name: 'Skin Radiance', price: '₹1,399', image: '/skin_radiance_summary.jpg', view: 'glow', subProduct: 'skin_radiance', description: 'Cellular Glow' },
];

const HomeProductGrid: React.FC<HomeProductGridProps> = ({ onSelectProduct }) => {
  const sectionRef = React.useRef<HTMLElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const extendedProducts = React.useMemo(() => [...products, ...products, ...products], []);
  // Initialize activeIndex to the middle of the middle set (approx index 13 corresponding to middle of total 27 items)
  // products.length = 9. Start of middle set is index 9.
  const [activeIndex, setActiveIndex] = React.useState(Math.floor(extendedProducts.length / 2));
  const [scrollProgress, setScrollProgress] = React.useState(0);

  // Initialize Scroll Position
  React.useEffect(() => {
    if (scrollRef.current) {
      const cardWidth = 380 + 40;
      // We want index 9 (start of middle set) to be roughly centered or just present
      // Let's scroll to the start of the middle set
      scrollRef.current.scrollLeft = (products.length * cardWidth);
    }
  }, [extendedProducts]);

  React.useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const scrollEl = scrollRef.current;
      const scrollPos = scrollEl.scrollLeft;
      const cardWidth = 380 + 40;
      const singleSetWidth = products.length * cardWidth;

      // Infinite Loop Logic: Jump scroll position implicitly
      if (scrollPos < singleSetWidth / 2) {
        scrollEl.scrollLeft = scrollPos + singleSetWidth;
        return;
      } else if (scrollPos > singleSetWidth * 2.5) {
        scrollEl.scrollLeft = scrollPos - singleSetWidth;
        return;
      }

      // Active Index Logic
      const containerWidth = scrollEl.offsetWidth;
      const centerPoint = scrollPos + (containerWidth / 2);

      // Calculate index based on card centers
      // i * cardWidth + cardWidth/2 = centerPoint
      const index = Math.round((centerPoint - (cardWidth / 2)) / cardWidth);

      // Bounds check just in case
      const safeIndex = Math.max(0, Math.min(extendedProducts.length - 1, index));

      // Parallax Text Loop
      // Normalize progress to one set width (0 to 1) for looping effect
      const relativeProgress = (scrollPos % singleSetWidth) / singleSetWidth;
      setScrollProgress(relativeProgress);

      if (safeIndex !== activeIndex) {
        setActiveIndex(safeIndex);
      }
    };

    const scrollEl = scrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', handleScroll);
      // Trigger once to set initial state correctly
      handleScroll();
    }
    return () => scrollEl?.removeEventListener('scroll', handleScroll);
  }, [activeIndex, extendedProducts]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="home-product-grid" ref={sectionRef}>
      {/* BACKGROUND FLOATING TEXT */}
      <div
        className="parallax-bg-text"
        style={{ transform: `translateX(${-scrollProgress * 20}%)` }}
      >
        JEEVIX PRECISION JEEVIX PRECISION
      </div>

      <div className="section-header">
        <span className="subtitle">Curated Nutrition</span>
        <h2 className="title">Magnetic Precision</h2>
        <div className="header-line"></div>
        <p className="desc">Explore our bio-active formulations with a premium sensory experience.</p>
      </div>

      {/* ATMOSPHERIC ORBS */}
      <div className="atmospheric-layer">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <div className="magnetic-scroll-container" ref={scrollRef}>
        <div className="magnetic-track">
          {extendedProducts.map((product, idx) => {
            const distanceFromCenter = Math.abs(idx - activeIndex);

            // Limit distance impact for far cards so they don't break
            const rotation = (idx - activeIndex) * 15;
            const clampedRotation = Math.max(-45, Math.min(45, rotation));

            return (
              <div
                key={`${product.id}-${idx}`}
                className={`magnetic-card ${idx === activeIndex ? 'active' : 'inactive'}`}
                style={{
                  '--stagger-idx': idx,
                  '--dist': distanceFromCenter,
                  transform: idx === activeIndex
                    ? `scale(1.15) translateZ(0)`
                    : `scale(0.85) rotateY(${clampedRotation}deg) translateZ(-100px)`
                } as React.CSSProperties}
                onClick={() => onSelectProduct(product.view, product.subProduct)}
              >
                <div className="image-container">
                  <img src={product.image} alt={product.name} />
                  <div className="snap-glow"></div>
                  <div className="product-atmosphere"></div>
                </div>

                <div className="card-content">
                  <span className="cat-pill">{product.view.toUpperCase()}</span>
                  <h3>{product.name}</h3>
                  <p className="description">{product.description}</p>

                  <div className="active-details">
                    <span className="price">{product.price}</span>
                    <button className="buy-now-btn">Add to Laboratory</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .home-product-grid {
          padding: 150px 0;
          background: #080808; /* Dark premium background */
          overflow: hidden;
          position: relative;
          color: white;
          perspective: 1000px;
        }

        /* BACKGROUND PARALLAX TEXT */
        .parallax-bg-text {
          position: absolute;
          top: 20%;
          left: 0;
          font-size: 15vw;
          font-weight: 900;
          color: rgba(255, 255, 255, 0.03);
          white-space: nowrap;
          pointer-events: none;
          z-index: 1;
          letter-spacing: -5px;
          transition: transform 0.1s linear;
        }

        /* ATMOSPHERIC ORBS */
        .atmospheric-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 2;
        }

        .orb {
          position: absolute;
          width: 400px;
          height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%);
          filter: blur(80px);
          animation: floatOrb 15s infinite alternate ease-in-out;
        }

        .orb-1 { top: -10%; left: -10%; animation-delay: 0s; }
        .orb-2 { bottom: -10%; right: -10%; animation-delay: -5s; }
        .orb-3 { top: 40%; left: 40%; width: 200px; height: 200px; background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%); animation-delay: -8s; }

        @keyframes floatOrb {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(50px, 30px) scale(1.1); }
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
          padding: 0 5%;
          position: relative;
          z-index: 10;
        }

        .subtitle {
          color: #d4af37;
          letter-spacing: 6px;
          text-transform: uppercase;
          font-size: 12px;
          font-weight: 700;
          opacity: 0.8;
          display: block;
          margin-bottom: 15px;
        }

        .title {
          font-size: 48px;
          font-weight: 800;
          margin: 0;
          letter-spacing: -1px;
          background: linear-gradient(180deg, #fff 0%, #a8a8a8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .header-line {
          width: 60px;
          height: 2px;
          background: #d4af37;
          margin: 25px auto;
          opacity: 0.8;
        }

        .desc {
          font-size: 16px;
          color: #888;
          max-width: 500px;
          margin: 0 auto;
        }

        /* MAGNETIC SCROLL */
        .magnetic-scroll-container {
          width: 100%;
          padding: 80px 0;
          scroll-snap-type: x mandatory;
          overflow-x: auto;
          scrollbar-width: none;
          perspective: 1500px; /* Essential for 3D effect */
          position: relative;
          z-index: 10;
        }

        .magnetic-scroll-container::-webkit-scrollbar { display: none; }

        .magnetic-track {
          display: flex;
          padding-left: 0; /* Removed large padding for infinite loop */
          gap: 40px;
          transform-style: preserve-3d;
          width: fit-content; /* Ensure it takes necessary width */
        }

        .magnetic-card {
          flex: 0 0 380px;
          height: 540px;
          background: #111;
          border-radius: 30px;
          scroll-snap-align: center;
          transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
          position: relative;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          transform-style: preserve-3d;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }

        .magnetic-card.inactive {
          filter: grayscale(1) brightness(0.6);
        }

        .magnetic-card.active {
          filter: grayscale(0) brightness(1);
          border-color: rgba(212, 175, 55, 0.5);
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.15), 0 30px 60px rgba(0,0,0,0.6);
          z-index: 5;
        }

        .image-container {
          width: 100%;
          height: 340px;
          background: #0a0a0a;
          position: relative;
          overflow: hidden;
        }

        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .active .image-container img { 
          transform: scale(1.1); 
        }

        /* GLOW EFFECTS */
        .snap-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(212, 175, 55, 0.15) 100%);
          opacity: 0;
          transition: 0.5s;
        }
        .active .snap-glow { opacity: 1; }

        .product-atmosphere {
          position: absolute;
          top: 50%; left: 50%;
          width: 150%; height: 150%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 60%);
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0;
          transition: 1s;
          pointer-events: none;
        }
        .active .product-atmosphere {
          opacity: 1;
          animation: pulseAtmosphere 4s infinite alternate;
        }

        @keyframes pulseAtmosphere {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
        }

        .card-content {
          padding: 30px;
          flex: 1;
          background: #111;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 2;
        }

        .cat-pill {
          color: #d4af37;
          border: 1px solid rgba(212, 175, 55, 0.3);
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-bottom: 15px;
        }

        .card-content h3 {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 10px 0;
          color: #fff;
        }

        .description {
          font-size: 14px;
          color: #888;
          margin: 0;
        }

        .active-details {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          opacity: 0;
          transform: translateY(20px);
          transition: 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0.2s;
        }

        .active .active-details {
          opacity: 1;
          transform: translateY(0);
        }

        .price {
          font-size: 20px;
          font-weight: 700;
          color: #fff;
        }

        .buy-now-btn {
          background: #d4af37;
          color: #000;
          border: none;
          padding: 12px 30px;
          border-radius: 50px;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 2px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .buy-now-btn:hover {
          background: #fff;
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(255,255,255,0.3);
        }

        /* Spacer no longer needed for infinite loop */
        /* .scroll-spacer { flex: 0 0 calc(50% - 190px); } */

        @media (max-width: 768px) {
          .magnetic-card { flex: 0 0 320px; height: 500px; }
          .title { font-size: 36px; }
          .parallax-bg-text { font-size: 25vw; top: 15%; }
          .scroll-spacer { flex: 0 0 calc(50% - 160px); }
        }
      `}</style>
    </section>
  );
};

export default HomeProductGrid;
