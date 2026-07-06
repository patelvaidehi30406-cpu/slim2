import { useState, useEffect } from 'react'
import ScrollAnimation from './components/ScrollAnimation'
import HomeHero from './components/HomeHero'
import HomeProductGrid from './components/HomeProductGrid'
import WellnessQuiz from './components/WellnessQuiz'
import SkinScanner from './components/SkinScanner'
import './App.css'

function App() {
  const [activeView, setActiveView] = useState('home');
  const [activeSlimProduct, setActiveSlimProduct] = useState('keto');
  const [activeGlowProduct, setActiveGlowProduct] = useState('biotin');
  const [activeManProduct, setActiveManProduct] = useState('ashwagandha');

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [buyNowItem, setBuyNowItem] = useState<{ id: string; name: string; price: number; image: string; quantity: number } | null>(null);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<{ id: string; name: string; price: number; quantity: number; image: string }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const addToCart = (product: { id: string; name: string; price: number; image: string }) => {
    setCartItems((prev: any[]) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev: any[]) => prev.filter(item => item.id !== id));
  };

  const handleBuyNow = (product: { id: string; name: string; price: number; image: string }) => {
    const item = { ...product, quantity: 1 };
    setBuyNowItem(item);

    if (!isLoggedIn) {
      setRedirectAfterLogin('checkout');
      setActiveView('login-required');
    } else {
      setActiveView('checkout');
    }
    window.scrollTo(0, 0);
  };

  const handleLogin = (email: string, name: string) => {
    setIsLoggedIn(true);
    setUser({ email, name });
    if (redirectAfterLogin) {
      setActiveView(redirectAfterLogin);
      setRedirectAfterLogin(null);
    } else {
      setActiveView('home');
    }
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setActiveView('home');
  };

  const cartTotal = cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);

  const infoPages: Record<string, { title: string; content: React.ReactNode }> = {
    about: {
      title: "About JEEVIX",
      content: (
        <>
          <p>JEEVIX is a pioneer in luxury wellness and precision nutrition. Founded on the principle that your body deserves the highest standard of care, we have spent decades perfecting formulations that bridge the gap between ancient botanical wisdom and clinical laboratory science.</p>
          <div className="info-grid">
            <div className="info-card">
              <h4>Our Heritage</h4>
              <p>With a legacy rooted in research, we focus on providing bioavailable solutions for the modern achiever. Our journey began in a boutique laboratory with a single goal: to solve the bioavailability crisis in the supplement industry.</p>
            </div>
            <div className="info-card">
              <h4>Our Vision</h4>
              <p>To redefine the limit of human potential through uncompromising purity and personalized wellness protocols. We believe that health is the ultimate luxury and should be managed with precision.</p>
            </div>
          </div>
          <div className="science-highlight" style={{ marginTop: '30px' }}>
            <h4>The JEEVIX Lab</h4>
            <p>Our research facility is equipped with state-of-the-art HPLC and Mass Spectrometry equipment to ensure every batch meets our "Gold-Standard" purity profile. We don't outsource our testing; we lead it.</p>
          </div>
          <p style={{ marginTop: '20px' }}>Today, JEEVIX stands as a symbol of integrity in an industry often clouded by ambiguity. We serve a global community of thinkers, creators, and athletes who refuse to settle for anything less than perfection.</p>
        </>
      )
    },
    science: {
      title: "Our Science & Innovation",
      content: (
        <>
          <p>The "Science-First™" philosophy at JEEVIX ensures that every ingredient is selected based on its proven physiological impact. We don't follow trends; we set the standards for efficacy.</p>
          <div className="science-highlight">
            <h4>Molecular Optimization</h4>
            <p>Our patented processes ensure that every raw extract is stabilized at the molecular level, ensuring that the final product is as potent in the bottle as it was in the research lab. We utilize cold-press extraction to avoid thermal degradation of sensitive lipophilic compounds.</p>
          </div>
          <ul className="science-list">
            <li><strong>Bio-Enhance™ Technology:</strong> Our proprietary delivery system increases the absorption rate of fat-soluble nutrients by up to 400% compared to standard powders.</li>
            <li><strong>Synergistic Blends:</strong> Every formula is designed to work in harmony with your body’s natural metabolic pathways, avoiding the "overload" effect common in generic multivitamins.</li>
            <li><strong>Zero Adulteration:</strong> Absolutely no synthetic fillers, heavy metals, or GMO-derived components. Every ingredient is 100% traceable to its source.</li>
            <li><strong>Certified Facilities:</strong> Manufactured in ISO-9001 and cGMP-certified facilities that exceed international safety standards for nutraceutical production.</li>
          </ul>
          <p style={{ marginTop: '20px' }}>We invest over 30% of our revenue back into R&D, ensuring that our customers always have access to the most advanced nutritional science available on the market.</p>
        </>
      )
    },
    careers: {
      title: "Careers at JEEVIX",
      content: (
        <>
          <p>At JEEVIX, we are always looking for visionary scientists, creative storytellers, and operational experts who want to shape the future of human wellness. We offer a high-performance environment where innovation is the core currency.</p>
          <div className="info-grid">
            <div className="info-card">
              <h4>Why JEEVIX?</h4>
              <ul className="info-list" style={{ textAlign: 'left', paddingLeft: '20px' }}>
                <li>Competitive equity packages for key roles.</li>
                <li>Unlimited wellness stipend for you and your family.</li>
                <li>Access to our internal bio-hacking laboratory.</li>
                <li>Flexible, remote-first global culture.</li>
              </ul>
            </div>
            <div className="info-card">
              <h4>Our Culture</h4>
              <p>We value radical transparency and data-driven decision making. We believe that small, elite teams move faster and achieve more than large hierarchies.</p>
            </div>
          </div>
          <div className="info-card" style={{ marginTop: '30px' }}>
            <h4>Open Positions</h4>
            <p><strong>Senior Bio-Chemists:</strong> Specialized in plant-based peptide synthesis.</p>
            <p><strong>Growth Marketing Leads:</strong> Data-obsessed specialists for our D2C expansion.</p>
            <p><strong>Logistics Coordinators:</strong> Managing our carbon-neutral supply chain.</p>
            <p style={{ marginTop: '15px' }}>Send your Portfolio or CV to <strong>careers@jeevix.com</strong></p>
          </div>
        </>
      )
    },
    contact: {
      title: "Contact Our Concierge",
      content: (
        <>
          <p>Our dedicated wellness concierge team is here to assist you with personalized product advice, order inquiries, or scientific deep-dives. We aim to respond within 24 hours.</p>
          <div className="contact-details-grid">
            <div>
              <strong>India Headquarters</strong>
              <p>Level 14, Wellness Center, Cyber City<br />Gurugram, HR 122002</p>
            </div>
            <div>
              <strong>Global Support</strong>
              <p>Email: support@jeevix.com<br />Phone: +91 (800) JEEVIX-0<br />WhatsApp: +91 91234 56789</p>
            </div>
          </div>
          <div className="info-card" style={{ marginTop: '30px' }}>
            <h4>Wholesale & Partnerships</h4>
            <p>Interested in stocking JEEVIX at your luxury spa, clinic, or gym? Contact our business development team at <strong>partners@jeevix.com</strong></p>
          </div>
          <p style={{ marginTop: '20px', fontSize: '14px', color: '#888' }}>Support Hours: Mon-Fri, 9:00 AM - 6:00 PM IST</p>
        </>
      )
    },
    track: {
      title: "Track Your Journey",
      content: (
        <>
          <p>Enter your order ID below to see the current stage of your JEEVIX delivery. Our logistics network ensures priority handling for every wellness package.</p>
          <div className="placeholder-input-container">
            <input type="text" placeholder="Order ID: #JVX-9821" className="styled-input" id="tracking-id" />
            <button
              className="styled-button"
              onClick={() => {
                const id = (document.getElementById('tracking-id') as HTMLInputElement)?.value;
                if (!id) return alert('Please enter an Order ID');
                alert(`Order ${id} Status: DISPATCHED. Your package has cleared our quality terminal and is currently in transit via BlueDart Priority. Estimated arrival: Tomorrow before 8 PM.`);
              }}
            >
              Track Now
            </button>
          </div>
          <div className="info-grid" style={{ marginTop: '40px' }}>
            <div className="info-card">
              <h4>Shipping Stages</h4>
              <p><strong>Processing:</strong> Quality control and batch verification.</p>
              <p><strong>Dispatched:</strong> Handed over to our premium courier partner.</p>
              <p><strong>In Transit:</strong> Moving through the hub network to your city.</p>
              <p><strong>Delivered:</strong> Safely arrived at your destination.</p>
            </div>
          </div>
        </>
      )
    },
    shipping: {
      title: "Shipping & Delivery Policy",
      content: (
        <>
          <p>We pride ourselves on a logistics network that is as efficient as our formulations. Every JEEVIX order is handled with "Fragile-Gold" priority to ensure no damage to the bi-active ingredients during transit.</p>
          <ul className="info-list">
            <li><strong>Complimentary Shipping:</strong> Every order over ₹5,000 qualifies for free carbon-neutral express shipping.</li>
            <li><strong>Domestic (India):</strong> 2-4 business days via air-express for major metros; 5-7 days for other regions.</li>
            <li><strong>International:</strong> 7-12 business days. Recipients are responsible for any local customs duties or taxes.</li>
            <li><strong>Eco-Packaging:</strong> Our bottles are shipped in 100% biodegradable corn-starch buffers, reducing environmental impact without compromising safety.</li>
          </ul>
          <div className="science-highlight" style={{ marginTop: '20px' }}>
            <h4>Carbon Neutrality</h4>
            <p>For every shipment made, JEEVIX invests in carbon offset projects. Your wellness journey doesn't cost the earth.</p>
          </div>
        </>
      )
    },
    refunds: {
      title: "Cancellations & Refunds",
      content: (
        <>
          <p>Your satisfaction is our cornerstone. We understand that wellness is a personal journey, and we stand behind the efficacy of our products with the "JEEVIX Trust Mandate".</p>
          <div className="info-card">
            <h4>30-Day Money Back Guarantee</h4>
            <p>If you are not satisfied with your results, you can return the product within 30 days of receipt. Opened containers are eligible for a partial refund or store credit, while unopened bottles qualify for a 100% refund.</p>
          </div>
          <div className="info-grid" style={{ marginTop: '30px' }}>
            <div className="info-card">
              <h4>Return Process</h4>
              <p>1. Email support@jeevix.com with your Order ID.</p>
              <p>2. Our team will arrange a reverse pickup (available in selective PIN codes).</p>
              <p>3. Once inspected, the refund is processed within 5-7 working days to the original payment source.</p>
            </div>
            <div className="info-card">
              <h4>Cancellations</h4>
              <p>Orders can be cancelled anytime before dispatch. Once the shipment has left our laboratory, the standard return policy applies.</p>
            </div>
          </div>
        </>
      )
    },
    help: {
      title: "Help Center & FAQs",
      content: (
        <>
          <p>Find answers to common questions about JEEVIX protocols. For more technical scientific inquiries, please contact our research desk.</p>
          <div className="faq-item">
            <strong>Are JEEVIX products vegan and safe?</strong>
            <p>Yes, our entire line is 100% plant-based, gluten-free, and tested for heavy metals. We do not use any artificial colors or synthetic preservatives.</p>
          </div>
          <div className="faq-item">
            <strong>When is the best time to take my supplements?</strong>
            <p>Most JEEVIX products are optimized for morning consumption with food for better metabolic absorption. Please check the "Usage" section on the product page for specific timings.</p>
          </div>
          <div className="faq-item">
            <strong>How do I manage my subscription?</strong>
            <p>You can adjust, pause, or cancel your subscription at any time through your member dashboard under the "My Journeys" tab.</p>
          </div>
          <div className="faq-item">
            <strong>What makes JEEVIX different from generic brands?</strong>
            <p>It's our Bio-Enhance™ technology. Standard supplements often pass through the body without absorption; our molecular stabilization ensures that what you pay for actually reaches your cells.</p>
          </div>
          <div className="faq-item">
            <strong>Do you offer a doctor's consultation?</strong>
            <p>Our wellness concierge includes senior nutritionists who can guide you. However, for specific medical conditions, always consult your physician.</p>
          </div>
        </>
      )
    },
    privacy: {
      title: "Privacy Governance",
      content: (
        <>
          <p>Effective Date: January 1, 2026. We prioritize the security of your biological and personal data with the same intensity as our product purity.</p>
          <p>We utilize AES-256 bit encryption for all personal data and never share your wellness profile with third-party insurance or marketing agencies. You have the full right to request data deletion at any time.</p>
        </>
      )
    },
    terms: {
      title: "Terms of Service",
      content: (
        <>
          <p>By accessing JEEVIX platforms, you agree to our terms of conduct and intellectual property rights. All content, formulations, and cinematic assets are the sole property of JEEVIX Health Inc.</p>
          <p>We reserve the right to modify pricing or formulations based on the availability of the highest-grade raw materials to ensure consistent product performance.</p>
        </>
      )
    },
    cookies: {
      title: "Cookie Policy",
      content: <p>We use essential cookies to personalize your cinematic experience on our platform. Analytical cookies help us understand how you interact with our journeys to improve our digital interface.</p>
    },
    disclaimers: {
      title: "Medical Disclaimers",
      content: (
        <>
          <p>The statements made on this website have not been evaluated by the Food and Drug Administration. These products are not intended to diagnose, treat, cure, or prevent any disease.</p>
          <p>Individual results may vary. Always consult with a licensed healthcare professional before starting any new dietary supplement program, especially if you have pre-existing conditions or are taking medication.</p>
        </>
      )
    },
    'login-required': {
      title: "Authentication Required",
      content: (
        <div className="auth-gate-container">
          <div className="gate-icon">🔒</div>
          <h2 className="gate-title">Login required to continue</h2>
          <p className="gate-subtitle">Please login or create an account to complete your purchase. Your selected product is safely saved.</p>

          <div className="auth-redirect-buttons">
            <button className="styled-button primary" onClick={() => setActiveView('login')}>Log In</button>
            <button className="styled-button secondary" onClick={() => setActiveView('signup')}>Create Account</button>
          </div>

          <div className="gate-footer">
            <button className="text-btn" onClick={() => setActiveView('home')}>Continue as Guest (Browsing only)</button>
          </div>
        </div>
      )
    },
    login: {
      title: "Member Login",
      content: (
        <div className="auth-form-container">
          <p className="form-desc">Welcome back to your wellness journey.</p>
          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); handleLogin('user@example.com', 'Alex'); }}>
            <div className="form-group">
              <label>Email or Mobile</label>
              <input type="text" placeholder="Enter your credentials" required className="styled-input full" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" required className="styled-input full" />
              <button type="button" className="forgot-pass">Forgot password?</button>
            </div>
            <button type="submit" className="styled-button full">Login & Continue</button>
          </form>
          <p className="form-footer">Don't have an account? <span className="link" onClick={() => setActiveView('signup')}>Sign up</span></p>
        </div>
      )
    },
    signup: {
      title: "Create Your Profile",
      content: (
        <div className="auth-form-container">
          <p className="form-desc">Join the elite circle of JEEVIX members.</p>
          <form className="auth-form" onSubmit={(e) => { e.preventDefault(); handleLogin('newuser@example.com', 'New Member'); }}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" required className="styled-input full" />
            </div>
            <div className="form-group">
              <label>Email or Mobile</label>
              <input type="email" placeholder="email@example.com" required className="styled-input full" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Min 8 characters" required className="styled-input full" />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" placeholder="Re-type password" required className="styled-input full" />
            </div>
            <button type="submit" className="styled-button full">Create Account & Continue</button>
          </form>
          <p className="form-footer">Already a member? <span className="link" onClick={() => setActiveView('login')}>Login</span></p>
        </div>
      )
    },
    'order-success': {
      title: "Order Confirmed",
      content: (
        <div className="success-container">
          <div className="success-check">✓</div>
          <h2 className="success-msg">Your Journey Begins Today</h2>
          <p className="success-desc">Thank you for your trust. Your order <strong>#JVX-9821</strong> has been successfully placed and is now being prepared for priority dispatch.</p>
          <div className="order-details-summary">
            <p>Verification email sent to: <strong>{user?.email}</strong></p>
          </div>
          <button className="styled-button" onClick={() => setActiveView('home')}>Return to Home</button>
        </div>
      )
    },
    checkout: {
      title: "Secure Purchase",
      content: (
        <div className="checkout-main-container">
          <div className="checkout-grid">
            <div className="checkout-left">
              <div className="checkout-section">
                <h3>1. Delivery Address</h3>
                <div className="address-form">
                  <input type="text" placeholder="Full Name" className="styled-input full" defaultValue={user?.name} />
                  <input type="text" placeholder="Street Address" className="styled-input full" />
                  <div className="input-row">
                    <input type="text" placeholder="City" className="styled-input" />
                    <input type="text" placeholder="State/Province" className="styled-input" />
                  </div>
                  <div className="input-row">
                    <input type="text" placeholder="ZIP Code" className="styled-input" />
                    <input type="text" placeholder="Country" className="styled-input" />
                  </div>
                </div>
              </div>

              <div className="checkout-section">
                <h3>2. Payment Method</h3>
                <div className="payment-options">
                  <label className="payment-option">
                    <input type="radio" name="payment" defaultChecked />
                    <div className="payment-info">
                      <strong>UPI / Instant Transfer</strong>
                      <p>Google Pay, PhonePe, etc.</p>
                    </div>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" />
                    <div className="payment-info">
                      <strong>Credit / Debit Card</strong>
                      <p>Visa, Mastercard, AMEX</p>
                    </div>
                  </label>
                  <label className="payment-option">
                    <input type="radio" name="payment" />
                    <div className="payment-info">
                      <strong>COD (Cash on Delivery)</strong>
                      <p>Pay when you receive</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="checkout-right">
              <div className="order-summary-card">
                <h3>Order Summary</h3>
                <div className="summary-items">
                  {buyNowItem ? (
                    <div className="summary-item">
                      <img src={buyNowItem.image} alt={buyNowItem.name} />
                      <div className="item-meta">
                        <strong>{buyNowItem.name}</strong>
                        <p>₹{buyNowItem.price} x 1</p>
                      </div>
                    </div>
                  ) : cartItems.map(item => (
                    <div className="summary-item" key={item.id}>
                      <img src={item.image} alt={item.name} />
                      <div className="item-meta">
                        <strong>{item.name}</strong>
                        <p>₹{item.price} x {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="summary-totals">
                  <div className="total-row"><span>Subtotal</span><span>₹{buyNowItem ? buyNowItem.price : cartTotal}</span></div>
                  <div className="total-row"><span>Shipping</span><span className="free">FREE</span></div>
                  <div className="total-row grand-total"><span>Grand Total</span><span>₹{buyNowItem ? buyNowItem.price : cartTotal}</span></div>
                </div>
                <button
                  className="place-order-btn"
                  onClick={() => {
                    setBuyNowItem(null);
                    setCartItems([]);
                    setActiveView('order-success');
                    window.scrollTo(0, 0);
                  }}
                >
                  Place Order & Pay
                </button>
                <p className="secure-note">🛡️ All transfers are encrypted and 100% secure.</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  // Sync URL on initial load and handle browser navigation (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const segments = path.substring(1).split('/');
      const mainView = segments[0] || 'home';
      const subProduct = segments[1];

      const allowedViews = ['home', 'man', 'slim', 'glow', 'contact', 'about', 'science', 'careers', 'track', 'shipping', 'refunds', 'help', 'privacy', 'terms', 'cookies', 'disclaimers', 'checkout'];
      if (allowedViews.includes(mainView)) {
        setActiveView(mainView);
        if (mainView === 'man' && subProduct) setActiveManProduct(subProduct);
        if (mainView === 'slim' && subProduct) setActiveSlimProduct(subProduct);
        if (mainView === 'glow' && subProduct) setActiveGlowProduct(subProduct);
      }
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update URL when activeView or products change
  useEffect(() => {
    let path = '/';
    if (activeView !== 'home') {
      path = `/${activeView}`;
      if (activeView === 'man') path += `/${activeManProduct}`;
      if (activeView === 'slim') path += `/${activeSlimProduct}`;
      if (activeView === 'glow') path += `/${activeGlowProduct}`;
    }

    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    // Scroll to top when view changes (optional, but good for UX)
    if (activeView !== 'home') {
      // window.scrollTo(0, 0); // User might want to stay at scroll position if switching sub-products? Let's keep it off for sub-products, on for main views?
      // Let's leave it off for now to not be annoying, or only if view changes.
    }
  }, [activeView, activeManProduct, activeSlimProduct, activeGlowProduct]);

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo" onClick={() => setActiveView('home')}>JEEVIX</div>
          <div className="category-group">
            <a href="/man" className={activeView === 'man' ? 'active-cat' : ''} onClick={(e) => { e.preventDefault(); setActiveView('man'); }}>MAN</a>
            <a href="/slim" className={activeView === 'slim' ? 'active-cat' : ''} onClick={(e) => { e.preventDefault(); setActiveView('slim'); }}>SLIM</a>
            <a href="/glow" className={activeView === 'glow' ? 'active-cat' : ''} onClick={(e) => { e.preventDefault(); setActiveView('glow'); }}>GLOW</a>
            <a href="#" className="scan-nav-link" onClick={(e) => { e.preventDefault(); setIsScannerOpen(true); }}>SCAN ✨</a>
          </div>
        </div>
        <div className="nav-links">
          <a href="/" className={activeView === 'home' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveView('home'); }}>Home</a>
          <a href="/author" className={activeView === 'author' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveView('author'); }}>Author</a>
          <a href="/contact" className={activeView === 'contact' ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveView('contact'); }}>Contact Us</a>
          <div className="cart-trigger" onClick={() => setIsCartOpen(true)}>
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </div>
          {isLoggedIn ? (
            <div className="user-nav">
              <span className="user-welcome">Hello, {user?.name.split(' ')[0]}</span>
              <button className="nav-cta logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <button
              className="nav-cta"
              onClick={() => { setActiveView('login'); window.scrollTo(0, 0); }}
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Areas */}
      <main className="main-content">
        {activeView === 'home' && (
          <>
            <HomeHero onExplore={(view) => { setActiveView(view); window.scrollTo(0, 0); }} />
            <HomeProductGrid
              onSelectProduct={(view, subProduct) => {
                setActiveView(view);
                if (view === 'man') setActiveManProduct(subProduct);
                if (view === 'slim') setActiveSlimProduct(subProduct);
                if (view === 'glow') setActiveGlowProduct(subProduct);
                window.scrollTo(0, 0);
              }}
            />
            <WellnessQuiz
              onSelectProduct={(view, subProduct) => {
                setActiveView(view);
                if (view === 'man') setActiveManProduct(subProduct);
                if (view === 'slim') setActiveSlimProduct(subProduct);
                if (view === 'glow') setActiveGlowProduct(subProduct);
                window.scrollTo(0, 0);
              }}
            />
          </>
        )}

        {activeView === 'man' && (
          <section className="man-hub">
            <div className="sub-nav">
              <button
                className={activeManProduct === 'ashwagandha' ? 'active-sub' : ''}
                onClick={() => setActiveManProduct('ashwagandha')}
              >
                Ashwagandha
              </button>
              <button
                className={activeManProduct === 'testosterone' ? 'active-sub' : ''}
                onClick={() => setActiveManProduct('testosterone')}
              >
                Testosterone Booster
              </button>
              <button
                className={activeManProduct === 'brain_booster' ? 'active-sub' : ''}
                onClick={() => setActiveManProduct('brain_booster')}
              >
                Brain Booster
              </button>
            </div>

            <div className="hub-content">
              {activeManProduct === 'ashwagandha' && (
                <ScrollAnimation frameCount={808} pathPrefix="/man_ashwagandha_sequence" productType="ashwagandha" />
              )}
              {activeManProduct === 'testosterone' && <ScrollAnimation frameCount={222} pathPrefix="/man_testo_sequence" productType="testosterone" />}
              {activeManProduct === 'brain_booster' && <ScrollAnimation frameCount={236} pathPrefix="/man_brain_sequence" productType="brain_booster" />}
            </div>
          </section>
        )}

        {activeView === 'slim' && (
          <section className="slim-hub">
            <div className="sub-nav">
              <button
                className={activeSlimProduct === 'keto' ? 'active-sub' : ''}
                onClick={() => setActiveSlimProduct('keto')}
              >
                Keto Fat Burner
              </button>
              <button
                className={activeSlimProduct === 'slim_plus' ? 'active-sub' : ''}
                onClick={() => setActiveSlimProduct('slim_plus')}
              >
                Slim Plus
              </button>
              <button
                className={activeSlimProduct === 'metabolism' ? 'active-sub' : ''}
                onClick={() => setActiveSlimProduct('metabolism')}
              >
                Metabolism Support
              </button>
            </div>

            <div className="hub-content">
              {activeSlimProduct === 'keto' && <ScrollAnimation frameCount={272} pathPrefix="/sequence" productType="keto" />}
              {activeSlimProduct === 'slim_plus' && <ScrollAnimation frameCount={240} pathPrefix="/slim_plus_sequence" productType="slim" />}
              {activeSlimProduct === 'metabolism' && <ScrollAnimation frameCount={240} pathPrefix="/metabolism_sequence" productType="metabolism" />}
            </div>
          </section>
        )}

        {activeView === 'glow' && (
          <section className="glow-hub">
            <div className="sub-nav">
              <button
                className={activeGlowProduct === 'biotin' ? 'active-sub' : ''}
                onClick={() => setActiveGlowProduct('biotin')}
              >
                Biotin
              </button>
              <button
                className={activeGlowProduct === 'hair_vitamins' ? 'active-sub' : ''}
                onClick={() => setActiveGlowProduct('hair_vitamins')}
              >
                Hair Vitamins
              </button>
              <button
                className={activeGlowProduct === 'skin_radiance' ? 'active-sub' : ''}
                onClick={() => setActiveGlowProduct('skin_radiance')}
              >
                Skin Radiance
              </button>
            </div>

            <div className="hub-content">
              {activeGlowProduct === 'biotin' && <ScrollAnimation frameCount={240} pathPrefix="/glow_biotin_sequence" productType="biotin" />}
              {activeGlowProduct === 'hair_vitamins' && <ScrollAnimation frameCount={278} pathPrefix="/glow_hair_vitamins_sequence" productType="hair_vitamins" />}
              {activeGlowProduct === 'skin_radiance' && <ScrollAnimation frameCount={280} pathPrefix="/glow_skin_radiance_sequence" productType="skin_radiance" />}
            </div>
          </section>
        )}

        {activeView === 'contact' && (
          <section className="view-section contact-view">
            <div className="contact-card glass-morphism">
              <h2>Contact Our Experts</h2>
              <p>Have questions about your wellness journey? We're here to help.</p>
              <div className="contact-info">
                <p>Email: support@jeevix.com</p>
                <p>Hotline: +1 (800) JEEVIX-0</p>
              </div>
            </div>
          </section>
        )}

        {activeView === 'author' && (
          <section className="view-section author-view animate-fade-in">
            <div className="author-page-container glass-morphism">
              <div className="author-main">
                <div className="author-visual">
                  <div className="author-portrait-mock team-visual">
                    <span>JX</span>
                  </div>
                  <div className="author-credentials-scroll">
                    <div className="cred-tag">Multidisciplinary Team</div>
                    <div className="cred-tag">Clinical Lab</div>
                    <div className="cred-tag">Global Experts</div>
                  </div>
                </div>
                <div className="author-text-content">
                  <span className="sc-badge">Founding Visionary</span>
                  <h1 className="author-page-title">The Scientific Team</h1>
                  <p className="author-subtitle">Chief Formulator & Wellness Architect</p>

                  <div className="author-full-bio">
                    <p>Our formulations are the result of a collaborative effort between world-class experts in pharmacy, dermal biology, performance science, and metabolic research. Led by <strong>Dr. Arjan Singh</strong>, our team dedicated their lives to solving the crisis of bioavailability in modern supplements.</p>
                    <p>Together, we've engineered the most potent, most absorbable natural energy catalysts on the planet.</p>

                    <div className="philosophy-card">
                      <h3>"Health is not the absence of fatigue; it is the presence of absolute vitality. We don't just sell formulas; we engineer human potential."</h3>
                    </div>
                  </div>

                  <div className="expert-team-showcase">
                    <div className="expert-mini-card">
                      <strong>Dr. Elena Vance</strong>
                      <span>Dermal Biology</span>
                    </div>
                    <div className="expert-mini-card">
                      <strong>Marcus Thorne</strong>
                      <span>Performance Lead</span>
                    </div>
                    <div className="expert-mini-card">
                      <strong>Dr. Sarah Chen</strong>
                      <span>Metabolic Research</span>
                    </div>
                  </div>

                  <button className="back-home-btn" onClick={() => setActiveView('home')}>Explore My Formulas</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {infoPages[activeView] && (
          <section className="view-section info-section">
            <div className="info-content-wrapper glass-morphism">
              <h1 className="info-title">{infoPages[activeView].title}</h1>
              <div className="info-body">
                {infoPages[activeView].content}
              </div>
              <button className="back-home-btn" onClick={() => setActiveView('home')}>Back to Home</button>
            </div>
          </section>
        )}
      </main>

      {/* Pre-Footer Product Showcase - Only for Ashwagandha */}
      {activeView === 'man' && activeManProduct === 'ashwagandha' && (
        <section className="pre-footer-showcase">
          <div className="showcase-content">
            {/* Left: Product Image */}
            <div className="showcase-left">
              <img
                src="/ash_summary_fixed.jpg"
                alt="JEEVIX Ashwagandha - Stronger Mind, Calmer Body"
                className="showcase-image"
              />

              {/* Action Buttons */}
              <div className="product-actions">
                <button
                  className="action-btn primary-btn"
                  onClick={() => addToCart({
                    id: 'ash-premium',
                    name: 'JEEVIX Ashwagandha Premium',
                    price: 2499,
                    image: '/ash_summary_fixed.jpg'
                  })}
                >
                  Add to Cart - ₹2,499
                </button>
                <button
                  className="action-btn secondary-btn"
                  onClick={() => handleBuyNow({
                    id: 'ash-premium',
                    name: 'JEEVIX Ashwagandha Premium',
                    price: 2499,
                    image: '/ash_summary_fixed.jpg'
                  })}
                >
                  Buy Now
                </button>
              </div>

              {/* Author Section */}
              <div className="author-section">
                <div className="author-content">
                  <div className="author-image-wrapper">
                    <div className="author-avatar-placeholder">AS</div>
                  </div>
                  <div className="author-info">
                    <h4 className="author-name">Dr. Arjan Singh</h4>
                    <p className="author-title">Chief Formulator & Wellness Lead</p>
                    <blockquote className="author-quote">
                      "We didn't just create a supplement; we engineered a catalyst for your body's innate strength."
                    </blockquote>
                    <div className="author-signature">Arjan Singh</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Information Content */}
            <div className="showcase-right">
              <div className="info-section-header">
                <h2 className="section-title">Complete Product Information</h2>
              </div>

              <div className="info-columns">
                {/* Column 1 */}
                <div className="info-col">
                  <div className="info-card">
                    <h3>How It Works</h3>
                    <p>Ashwagandha works by balancing the hypothalamic-pituitary-adrenal (HPA) axis, which regulates your body's stress response. It helps lower cortisol levels and promotes a state of calm focus.</p>
                  </div>

                  <div className="info-card">
                    <h3>Recommended For</h3>
                    <ul>
                      <li>Individuals dealing with daily stress and anxiety.</li>
                      <li>Athletes looking for better recovery.</li>
                      <li>Anyone seeking improved sleep quality and mental wellness.</li>
                    </ul>
                  </div>

                  <div className="info-card">
                    <h3>Usage Instructions</h3>
                    <div className="instruction-item">
                      <span className="num">1</span>
                      <div>
                        <strong>Daily Dosage</strong>
                        <p>Take 1-2 capsules daily.</p>
                      </div>
                    </div>
                    <div className="instruction-item">
                      <span className="num">2</span>
                      <div>
                        <strong>Optimal Timing</strong>
                        <p>Best taken with meals.</p>
                      </div>
                    </div>
                    <div className="instruction-item">
                      <span className="num">3</span>
                      <div>
                        <strong>Commitment</strong>
                        <p>Daily use is recommended for long-term adaptogenic benefits.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="info-col">
                  <div className="info-card">
                    <h3>Pure Ingredients</h3>
                    <div className="ingredient-item">
                      <strong>Standardized Ashwagandha Root Extract</strong>
                      <p>Rich in Withanolides for stress and cortisol support.</p>
                    </div>
                    <div className="ingredient-item">
                      <strong>Black Pepper Extract</strong>
                      <p>Enhanced absorption for maximum effectiveness.</p>
                    </div>
                  </div>

                  <div className="info-card standards-card">
                    <h3>JEEVIX Standards</h3>
                    <div className="badge-row">
                      <div className="badge">🛡️ Standardized for high potency</div>
                      <div className="badge">🌾 Non-GMO and Gluten-Free</div>
                      <div className="badge">🌱 Pure root extract only</div>
                    </div>
                    <div className="disclaimer">
                      <h4>MEDICAL DISCLAIMER</h4>
                      <p>These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pre-Footer Product Showcase - For Testosterone */}
      {activeView === 'man' && activeManProduct === 'testosterone' && (
        <section className="pre-footer-showcase">
          <div className="showcase-content">
            {/* Left: Product Image */}
            <div className="showcase-left">
              <img
                src="/testo_summary.jpg"
                alt="JEEVIX Testosterone Booster - Peak Performance"
                className="showcase-image"
              />

              {/* Action Buttons */}
              <div className="product-actions">
                <button
                  className="action-btn primary-btn"
                  onClick={() => addToCart({
                    id: 'testo-premium',
                    name: 'JEEVIX Testosterone Premium',
                    price: 2999,
                    image: '/testo_summary.jpg'
                  })}
                >
                  Add to Cart - ₹2,999
                </button>
                <button
                  className="action-btn secondary-btn"
                  onClick={() => handleBuyNow({
                    id: 'testo-premium',
                    name: 'JEEVIX Testosterone Premium',
                    price: 2999,
                    image: '/testo_summary.jpg'
                  })}
                >
                  Buy Now
                </button>
              </div>

              {/* Author Section */}
              <div className="author-section">
                <div className="author-content">
                  <div className="author-image-wrapper">
                    <div className="author-avatar-placeholder">VR</div>
                  </div>
                  <div className="author-info">
                    <h4 className="author-name">Dr. Vikram Rathore</h4>
                    <p className="author-title">Elite Performance Coach & Endocrinologist</p>
                    <blockquote className="author-quote">
                      "Peak performance isn't just about training; it's about optimizing your internal chemistry. We engineered this for the modern elite man."
                    </blockquote>
                    <div className="author-signature">Vikram Rathore</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Information Content */}
            <div className="showcase-right">
              <div className="info-section-header">
                <h2 className="section-title">Peak Performance Information</h2>
              </div>

              <div className="info-columns">
                {/* Column 1 */}
                <div className="info-col">
                  <div className="info-card">
                    <h3>How It Works</h3>
                    <p>Our formula works by optimizing the body's natural hormone production pathways. It utilizes synergistic Ayurvedic herbs to support free testosterone levels and metabolic efficiency.</p>
                  </div>

                  <div className="info-card">
                    <h3>Recommended For</h3>
                    <ul>
                      <li>Men looking to increase strength and stamina.</li>
                      <li>Individuals aiming for improved muscle growth.</li>
                      <li>Those seeking natural energy and vitality throughout the day.</li>
                    </ul>
                  </div>

                  <div className="info-card">
                    <h3>Usage Instructions</h3>
                    <div className="instruction-item">
                      <span className="num">1</span>
                      <div>
                        <strong>Daily Routine</strong>
                        <p>Take 2 capsules daily with water.</p>
                      </div>
                    </div>
                    <div className="instruction-item">
                      <span className="num">2</span>
                      <div>
                        <strong>Training Days</strong>
                        <p>Take 30 minutes before your workout session.</p>
                      </div>
                    </div>
                    <div className="instruction-item">
                      <span className="num">3</span>
                      <div>
                        <strong>Consistency</strong>
                        <p>For best results, use consistently for at least 8-12 weeks.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="info-col">
                  <div className="info-card">
                    <h3>Pure Ingredients</h3>
                    <div className="ingredient-item">
                      <strong>Shilajit & Safed Musli</strong>
                      <p>Traditional enhancers for strength and male performance.</p>
                    </div>
                    <div className="ingredient-item">
                      <strong>Tribulus Terrestris</strong>
                      <p>Supports healthy hormone balance and libido.</p>
                    </div>
                  </div>

                  <div className="info-card standards-card">
                    <h3>JEEVIX Standards</h3>
                    <div className="badge-row">
                      <div className="badge">🔋 100% Ayurvedic Power Formula</div>
                      <div className="badge">💪 Enhances Energy & Vitality</div>
                      <div className="badge">📉 Reduces Fatigue & Stress</div>
                    </div>
                    <div className="disclaimer">
                      <h4>MEDICAL DISCLAIMER</h4>
                      <p>These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pre-Footer Product Showcase - For Brain Booster */}
      {activeView === 'man' && activeManProduct === 'brain_booster' && (
        <section className="pre-footer-showcase">
          <div className="showcase-content">
            {/* Left: Product Image */}
            <div className="showcase-left">
              <img
                src="/brain_summary.jpg"
                alt="JEEVIX Brain Booster - Mental Clarity & Focus"
                className="showcase-image"
              />

              {/* Action Buttons */}
              <div className="product-actions">
                <button
                  className="action-btn primary-btn"
                  onClick={() => addToCart({
                    id: 'brain-premium',
                    name: 'JEEVIX Brain Booster Premium',
                    price: 2799,
                    image: '/brain_summary.jpg'
                  })}
                >
                  Add to Cart - ₹2,799
                </button>
                <button
                  className="action-btn secondary-btn"
                  onClick={() => handleBuyNow({
                    id: 'brain-premium',
                    name: 'JEEVIX Brain Booster Premium',
                    price: 2799,
                    image: '/brain_summary.jpg'
                  })}
                >
                  Buy Now
                </button>
              </div>

              {/* Author Section */}
              <div className="author-section">
                <div className="author-content">
                  <div className="author-image-wrapper">
                    <div className="author-avatar-placeholder">EV</div>
                  </div>
                  <div className="author-info">
                    <h4 className="author-name">Dr. Elena Vance</h4>
                    <p className="author-title">Cognitive Neuroscientist</p>
                    <blockquote className="author-quote">
                      "Brain Booster is a surgical-grade approach to cognitive enhancement, clearing neural pathways for absolute focus and mental speed."
                    </blockquote>
                    <div className="author-signature">Elena Vance</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Information Content */}
            <div className="showcase-right">
              <div className="info-section-header">
                <h2 className="section-title">Cognitive Performance Info</h2>
              </div>

              <div className="info-columns">
                {/* Column 1 */}
                <div className="info-col">
                  <div className="info-card">
                    <h3>How It Works</h3>
                    <p>JEEVIX Brain Booster provides essential neuro-nutrients that support neurotransmitter function and cerebral blood flow, leading to enhanced focus and mental sharpess.</p>
                  </div>

                  <div className="info-card">
                    <h3>Key Benefits</h3>
                    <ul>
                      <li>Mental Clarity & Improved Alertness.</li>
                      <li>Better Focus & Concentration during long hours.</li>
                      <li>Memory Support & Recall Enhancement.</li>
                    </ul>
                  </div>

                  <div className="info-card">
                    <h3>Usage Instructions</h3>
                    <div className="instruction-item">
                      <span className="num">1</span>
                      <div>
                        <strong>Daily Intake</strong>
                        <p>Take 1-2 capsules in the morning.</p>
                      </div>
                    </div>
                    <div className="instruction-item">
                      <span className="num">2</span>
                      <div>
                        <strong>Peak Focus</strong>
                        <p>For high-intensity tasks, take 30 minutes prior.</p>
                      </div>
                    </div>
                    <div className="instruction-item">
                      <span className="num">3</span>
                      <div>
                        <strong>Natural Cycle</strong>
                        <p>Works best when paired with a consistent sleep schedule.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="info-col">
                  <div className="info-card">
                    <h3>Pure Ingredients</h3>
                    <div className="ingredient-item">
                      <strong>Bacopa Monnieri & Ginkgo Biloba</strong>
                      <p>Clinically studied herbs for memory and cognitive speed.</p>
                    </div>
                    <div className="ingredient-item">
                      <strong>Natural Neuro-factors</strong>
                      <p>Selected for brain nourishment and reducing brain fog.</p>
                    </div>
                  </div>

                  <div className="info-card standards-card">
                    <h3>JEEVIX Standards</h3>
                    <div className="badge-row">
                      <div className="badge">🧠 Mental Clarity Boost</div>
                      <div className="badge">🚀 Cognitive Performance</div>
                      <div className="badge">🌙 Stress & Memory Support</div>
                    </div>
                    <div className="disclaimer">
                      <h4>MEDICAL DISCLAIMER</h4>
                      <p>These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pre-Footer Product Showcase - For Keto Fat Burner */}
      {activeView === 'slim' && activeSlimProduct === 'keto' && (
        <section className="pre-footer-showcase">
          <div className="showcase-content">
            {/* Left: Product Image */}
            <div className="showcase-left">
              <img
                src="/keto_summary.jpg"
                alt="JEEVIX Keto Fat Burner - Advanced Metabolism"
                className="showcase-image"
              />

              {/* Action Buttons */}
              <div className="product-actions">
                <button
                  className="action-btn primary-btn"
                  onClick={() => addToCart({
                    id: 'keto-premium',
                    name: 'JEEVIX Keto Fat Burner',
                    price: 2499,
                    image: '/keto_summary.jpg'
                  })}
                >
                  Add to Cart - ₹2,499
                </button>
                <button
                  className="action-btn secondary-btn"
                  onClick={() => handleBuyNow({
                    id: 'keto-premium',
                    name: 'JEEVIX Keto Fat Burner',
                    price: 2499,
                    image: '/keto_summary.jpg'
                  })}
                >
                  Buy Now
                </button>
              </div>

              {/* Author Section */}
              <div className="author-section">
                <div className="author-content">
                  <div className="author-image-wrapper">
                    <div className="author-avatar-placeholder">JS</div>
                  </div>
                  <div className="author-info">
                    <h4 className="author-name">Dr. Julian Scott</h4>
                    <p className="author-title">Leading Metabolic Specialist</p>
                    <blockquote className="author-quote">
                      "Our Keto precision-signals the body to use fat as its primary fuel source, ensuring consistent energy without the metabolic crash."
                    </blockquote>
                    <div className="author-signature">Julian Scott</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Information Content */}
            <div className="showcase-right">
              <div className="info-section-header">
                <h2 className="section-title">Metabolic Advantage Info</h2>
              </div>

              <div className="info-columns">
                {/* Column 1 */}
                <div className="info-col">
                  <div className="info-card">
                    <h3>How It Works</h3>
                    <p>JEEVIX Keto triggers ketosis faster by providing exogenous metabolic factors that signal your body to prioritize fat stores for fuel, resulting in rapid energy release.</p>
                  </div>

                  <div className="info-card">
                    <h3>Key Benefits</h3>
                    <ul>
                      <li>Burns Fat Fast by supporting ketosis.</li>
                      <li>Improves Metabolism & calorie burning speed.</li>
                      <li>Appetite Control for reduced cravings.</li>
                      <li>Enhances Stamina for workouts and activities.</li>
                    </ul>
                  </div>

                  <div className="info-card">
                    <h3>Usage Instructions</h3>
                    <div className="instruction-item">
                      <span className="num">1</span>
                      <div>
                        <strong>Serving Size</strong>
                        <p>Take 2 capsules daily with water.</p>
                      </div>
                    </div>
                    <div className="instruction-item">
                      <span className="num">2</span>
                      <div>
                        <strong>Optimal Timing</strong>
                        <p>Best taken 30 minutes before your largest meal.</p>
                      </div>
                    </div>
                    <div className="instruction-item">
                      <span className="num">3</span>
                      <div>
                        <strong>Keto Lifestyle</strong>
                        <p>Maximum results when paired with a low-carb or Keto diet.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="info-col">
                  <div className="info-card">
                    <h3>Pure Ingredients</h3>
                    <div className="ingredient-item">
                      <strong>Garcinia Cambogia & Green Coffee</strong>
                      <p>Natural fat burners that help inhibit fat production and boost energy.</p>
                    </div>
                    <div className="ingredient-item">
                      <strong>Metabolic Complex</strong>
                      <p>A synergistic blend designed for appetite suppression and stamina enhancement.</p>
                    </div>
                  </div>

                  <div className="info-card standards-card">
                    <h3>JEEVIX Standards</h3>
                    <div className="badge-row">
                      <div className="badge">🔥 Burns Fat Fast</div>
                      <div className="badge">⚡ Boosts Energy Levels</div>
                      <div className="badge">🍽️ Advanced Appetite Control</div>
                    </div>
                    <div className="disclaimer">
                      <h4>MEDICAL DISCLAIMER</h4>
                      <p>These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pre-Footer Product Showcase - For Metabolism Support */}
      {activeView === 'slim' && activeSlimProduct === 'metabolism' && (
        <section className="pre-footer-showcase">
          <div className="showcase-content">
            {/* Left: Product Image */}
            <div className="showcase-left">
              <img
                src="/meta.jpeg"
                alt="JEEVIX Metabolism Support - Natural Vitality"
                className="showcase-image"
              />

              {/* Action Buttons */}
              <div className="product-actions">
                <button
                  className="action-btn primary-btn"
                  onClick={() => addToCart({
                    id: 'metabolism-premium',
                    name: 'JEEVIX Metabolism Support',
                    price: 2299,
                    image: '/meta.jpeg'
                  })}
                >
                  Add to Cart - ₹2,299
                </button>
                <button
                  className="action-btn secondary-btn"
                  onClick={() => handleBuyNow({
                    id: 'metabolism-premium',
                    name: 'JEEVIX Metabolism Support',
                    price: 2299,
                    image: '/meta.jpeg'
                  })}
                >
                  Buy Now
                </button>
              </div>

              {/* Author Section */}
              <div className="author-section">
                <div className="author-content">
                  <div className="author-image-wrapper">
                    <div className="author-avatar-placeholder">RL</div>
                  </div>
                  <div className="author-info">
                    <h4 className="author-name">Dr. Robert Low</h4>
                    <p className="author-title">Professor of Endocrinology</p>
                    <blockquote className="author-quote">
                      "True metabolic health is about cellular efficiency. We've optimized this blend to support the body's natural baseline expenditure."
                    </blockquote>
                    <div className="author-signature">Robert Low</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Information Content */}
            <div className="showcase-right">
              <div className="info-section-header">
                <h2 className="section-title">Metabolism Support Benefits</h2>
              </div>

              <div className="info-columns">
                {/* Column 1 */}
                <div className="info-col">
                  <div className="info-card">
                    <h3>How It Works</h3>
                    <p>JEEVIX Metabolism Support works by enhancing the metabolic rate and improving digestion. It helps the body convert food into energy more efficiently while managing hunger hormones.</p>
                  </div>

                  <div className="info-card">
                    <h3>Key Benefits</h3>
                    <ul>
                      <li>Boosts Energy Levels naturally.</li>
                      <li>Supports Weight Management through caloric efficiency.</li>
                      <li>Improved Digestion & Gut Health.</li>
                      <li>Appetite Control & Craving Management.</li>
                      <li>Natural Vitality without synthetic stimulants.</li>
                    </ul>
                  </div>

                  <div className="info-card">
                    <h3>Usage Instructions</h3>
                    <div className="instruction-item">
                      <span className="num">1</span>
                      <div>
                        <strong>Daily Serving</strong>
                        <p>Take 1-2 capsules daily.</p>
                      </div>
                    </div>
                    <div className="instruction-item">
                      <span className="num">2</span>
                      <div>
                        <strong>Best Results</strong>
                        <p>Take consistently morning or afternoon for sustained energy.</p>
                      </div>
                    </div>
                    <div className="instruction-item">
                      <span className="num">3</span>
                      <div>
                        <strong>Wellness Sync</strong>
                        <p>Pair with balanced nutrition for optimal gut health benefits.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="info-col">
                  <div className="info-card">
                    <h3>Pure Ingredients</h3>
                    <div className="ingredient-item">
                      <strong>Herbal & Botanical Extracts</strong>
                      <p>Natural ingredients selected for their ability to improve digestion and metabolism.</p>
                    </div>
                    <div className="ingredient-item">
                      <strong>Natural Neuro-factors</strong>
                      <p>Synergistic blend to reduce fatigue and support active lifestyle.</p>
                    </div>
                  </div>

                  <div className="info-card standards-card">
                    <h3>JEEVIX Standards</h3>
                    <div className="badge-row">
                      <div className="badge">🌿 Natural Vitality Boost</div>
                      <div className="badge">⚖️ Caloric Efficiency</div>
                      <div className="badge">🩹 Gut Health Support</div>
                    </div>
                    <div className="disclaimer">
                      <h4>MEDICAL DISCLAIMER</h4>
                      <p>These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Pre-Footer Product Showcase - For Slim Plus */}
      {activeView === 'slim' && activeSlimProduct === 'slim_plus' && (
        <section className="pre-footer-showcase">
          <div className="showcase-content">
            {/* Left: Product Image */}
            <div className="showcase-left">
              <img
                src="/slim_plus_summary.jpg"
                alt="JEEVIX Slim Plus - For Women's Health & Vitality"
                className="showcase-image"
              />

              {/* Action Buttons */}
              <div className="product-actions">
                <button
                  className="action-btn primary-btn"
                  onClick={() => addToCart({
                    id: 'slim-plus-premium',
                    name: 'JEEVIX Slim Plus Premium',
                    price: 2599,
                    image: '/slim_plus_summary.jpg'
                  })}
                >
                  Add to Cart - ₹2,599
                </button>
                <button
                  className="action-btn secondary-btn"
                  onClick={() => handleBuyNow({
                    id: 'slim-plus-premium',
                    name: 'JEEVIX Slim Plus Premium',
                    price: 2599,
                    image: '/slim_plus_summary.jpg'
                  })}
                >
                  Buy Now
                </button>
              </div>

              {/* Author Section */}
              <div className="author-section">
                <div className="author-content">
                  <div className="author-image-wrapper">
                    <div className="author-avatar-placeholder">AI</div>
                  </div>
                  <div className="author-info">
                    <h4 className="author-name">Dr. Ananya Iyer</h4>
                    <p className="author-title">Women's Health & Wellness Specialist</p>
                    <blockquote className="author-quote">
                      "Slim Plus respects the female body's rhythm, providing metabolic support that works in harmony with hormonal balance."
                    </blockquote>
                    <div className="author-signature">Ananya Iyer</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Information Content */}
            <div className="showcase-right">
              <div className="info-section-header">
                <h2 className="section-title">Slim Plus Health Benefits</h2>
              </div>

              <div className="info-columns">
                {/* Column 1 */}
                <div className="info-col">
                  <div className="info-card">
                    <h3>How It Works</h3>
                    <p>JEEVIX Slim Plus combines Ayurvedic wisdom with modern science to target stubborn belly and thigh fat, while supporting hormonal balance and faster digestion.</p>
                  </div>

                  <div className="info-card">
                    <h3>Key Benefits</h3>
                    <ul>
                      <li>Healthy Weight Management naturally.</li>
                      <li>Boosts Fat Burning & Calorie usage.</li>
                      <li>Targets Stubborn Fat (Belly & Thigh).</li>
                      <li>Appetite Control & reduces overeating.</li>
                      <li>Supports Hormonal Balance for women.</li>
                    </ul>
                  </div>

                  <div className="info-card">
                    <h3>Usage Instructions</h3>
                    <div className="instruction-item">
                      <span className="num">1</span>
                      <div>
                        <strong>Recommended Dose</strong>
                        <p>Take 1-2 capsules daily.</p>
                      </div>
                    </div>
                    <div className="instruction-item">
                      <span className="num">2</span>
                      <div>
                        <strong>Daily Energy</strong>
                        <p>Keeps you active and refreshed throughout the day.</p>
                      </div>
                    </div>
                    <div className="instruction-item">
                      <span className="num">3</span>
                      <div>
                        <strong>Pure Formula</strong>
                        <p>Made with safe, 100% natural herbal ingredients.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="info-col">
                  <div className="info-card">
                    <h3>Pure Ingredients</h3>
                    <div className="ingredient-item">
                      <strong>Ayurvedic Herb Blend</strong>
                      <p>Natural extracts focused on female metabolic health.</p>
                    </div>
                    <div className="ingredient-item">
                      <strong>Nutrient Optimizer</strong>
                      <p>Enhances nutrient usage and supports overall vitality.</p>
                    </div>
                  </div>

                  <div className="info-card standards-card">
                    <h3>JEEVIX Standards</h3>
                    <div className="badge-row">
                      <div className="badge">🌸 Female Health Design</div>
                      <div className="badge">🌊 Stubborn Fat Target</div>
                      <div className="badge">♻️ Hormonal Balance</div>
                    </div>
                    <div className="disclaimer">
                      <h4>MEDICAL DISCLAIMER</h4>
                      <p>These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeView === 'glow' && activeGlowProduct === 'skin_radiance' && (
        <section className="pre-footer-showcase">
          <div className="showcase-content">
            {/* Left: Product Image */}
            <div className="showcase-left">
              <img
                src="/skin_radiance_summary.jpg"
                alt="JEEVIX Skin Radiance - Pure Luminosity"
                className="showcase-image"
              />

              {/* Action Buttons */}
              <div className="product-actions">
                <button
                  className="action-btn primary-btn"
                  onClick={() => addToCart({
                    id: 'skin-radiance-premium',
                    name: 'JEEVIX Skin Radiance Premium',
                    price: 3499,
                    image: '/skin_radiance_summary.jpg'
                  })}
                >
                  Add to Cart - ₹3,499
                </button>
                <button
                  className="action-btn secondary-btn"
                  onClick={() => handleBuyNow({
                    id: 'skin-radiance-premium',
                    name: 'JEEVIX Skin Radiance Premium',
                    price: 3499,
                    image: '/skin_radiance_summary.jpg'
                  })}
                >
                  Buy Now
                </button>
              </div>

              {/* Author Section */}
              <div className="author-section">
                <div className="author-content">
                  <div className="author-image-wrapper">
                    <div className="author-avatar-placeholder">SR</div>
                  </div>
                  <div className="author-info">
                    <h4 className="author-name">Dr. Sofia Rossi</h4>
                    <p className="author-title">Dermatological Scientist</p>
                    <blockquote className="author-quote">
                      "Skin Radiance is a molecular masterpiece, designed to illuminate from within and restore your skin's innate, healthy glow."
                    </blockquote>
                    <div className="author-signature">Sofia Rossi</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Information Content */}
            <div className="showcase-right">
              <div className="info-section-header">
                <h2 className="section-title">Skin Radiance Benefits</h2>
              </div>

              <div className="info-columns">
                {/* Column 1 */}
                <div className="info-col">
                  <div className="info-card">
                    <h3>How It Works</h3>
                    <p>Our specialized delivery system targets pigmentation at the source while providing multi-level hydration to revive tired and lifeless skin for a radiant look.</p>
                  </div>

                  <div className="info-card">
                    <h3>Key Benefits</h3>
                    <ul>
                      <li>Enhances Natural Glow & Radiance.</li>
                      <li>Reduces Dark Spots & Pigmentation.</li>
                      <li>Deep Hydration prevents dryness.</li>
                      <li>Improves Skin Texture (Smooth & Supple).</li>
                      <li>Anti-Aging & Fine Line Support.</li>
                    </ul>
                  </div>

                  <div className="info-card">
                    <h3>Usage Instructions</h3>
                    <div className="instruction-item">
                      <span className="num">1</span>
                      <div>
                        <strong>Application</strong>
                        <p>Apply 3-4 drops to clean skin.</p>
                      </div>
                    </div>
                    <div className="instruction-item">
                      <span className="num">2</span>
                      <div>
                        <strong>Absorption</strong>
                        <p>Lightweight, non-sticky formula absorbs quickly.</p>
                      </div>
                    </div>
                    <div className="instruction-item">
                      <span className="num">3</span>
                      <div>
                        <strong>Frequency</strong>
                        <p>Can be used morning and night for best results.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="info-col">
                  <div className="info-card">
                    <h3>Pure Ingredients</h3>
                    <div className="ingredient-item">
                      <strong>Bio-active Glow Complex</strong>
                      <p>Revives dull skin and targets uneven skin tone.</p>
                    </div>
                    <div className="ingredient-item">
                      <strong>Multi-Molecular Hydrators</strong>
                      <p>Deeply moisturizes and improves elasticity.</p>
                    </div>
                  </div>

                  <div className="info-card standards-card">
                    <h3>JEEVIX Standards</h3>
                    <div className="badge-row">
                      <div className="badge">✨ Enhances Natural Glow</div>
                      <div className="badge">💧 Deep Cellular Hydration</div>
                      <div className="badge">🛡️ Anti-Aging Support</div>
                    </div>
                    <div className="disclaimer">
                      <h4>MEDICAL DISCLAIMER</h4>
                      <p>These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeView === 'glow' && activeGlowProduct === 'biotin' && (
        <section className="pre-footer-showcase">
          <div className="showcase-content">
            {/* Left: Product Image */}
            <div className="showcase-left">
              <img
                src="/biotin.jpeg"
                alt="JEEVIX Biotin - Ultimate Strength & Shine"
                className="showcase-image"
              />

              {/* Action Buttons */}
              <div className="product-actions">
                <button
                  className="action-btn primary-btn"
                  onClick={() => addToCart({
                    id: 'biotin-premium',
                    name: 'JEEVIX Biotin Premium',
                    price: 2799,
                    image: '/biotin.jpeg'
                  })}
                >
                  Add to Cart - ₹2,799
                </button>
                <button
                  className="action-btn secondary-btn"
                  onClick={() => handleBuyNow({
                    id: 'biotin-premium',
                    name: 'JEEVIX Biotin Premium',
                    price: 2799,
                    image: '/biotin.jpeg'
                  })}
                >
                  Buy Now
                </button>
              </div>

              {/* Author Section */}
              <div className="author-section">
                <div className="author-content">
                  <div className="author-image-wrapper">
                    <div className="author-avatar-placeholder">MD</div>
                  </div>
                  <div className="author-info">
                    <h4 className="author-name">Dr. Marcus Dupont</h4>
                    <p className="author-title">Leading Cosmetic Chemist</p>
                    <blockquote className="author-quote">
                      "Our Biotin formula is engineered to fortify the cellular foundation of your hair, delivering visible strength and effortless shine."
                    </blockquote>
                    <div className="author-signature">Marcus Dupont</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Information Content */}
            <div className="showcase-right">
              <div className="info-section-header">
                <h2 className="section-title">Biotin Strength Benefits</h2>
              </div>

              <div className="info-columns">
                {/* Column 1 */}
                <div className="info-col">
                  <div className="info-card">
                    <h3>How It Works</h3>
                    <p>JEEVIX Biotin uses micro-encapsulated Vitamin B7 to penetrate deeper, supporting the keratin production necessary for hair and nail integrity.</p>
                  </div>

                  <div className="info-card">
                    <h3>Key Benefits</h3>
                    <ul>
                      <li>Maximum Strength Keratin Support.</li>
                      <li>Reduces Hair Thinning & Fall.</li>
                      <li>Promotes Glowing, Clear Skin.</li>
                      <li>Strengthens Brittle Nails.</li>
                      <li>Improves Overall Nutrient Absorption.</li>
                    </ul>
                  </div>

                  <div className="info-card">
                    <h3>Usage Instructions</h3>
                    <div className="instruction-item">
                      <span className="num">1</span>
                      <div>
                        <strong>Daily Serving</strong>
                        <p>One capsule with breakfast.</p>
                      </div>
                    </div>
                    <div className="instruction-item">
                      <span className="num">2</span>
                      <div>
                        <strong>Consistency</strong>
                        <p>Essential for 3 months to see full cellular renewal.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="info-col">
                  <div className="info-card">
                    <h3>Pure Ingredients</h3>
                    <div className="ingredient-item">
                      <strong>10,000mcg Pure Biotin</strong>
                      <p>High-potency concentration for maximum physiological impact.</p>
                    </div>
                    <div className="ingredient-item">
                      <strong>Zinc & Selenium cofactor</strong>
                      <p>Essential minerals that work synergistically with Biotin.</p>
                    </div>
                  </div>

                  <div className="info-card standards-card">
                    <h3>JEEVIX Standards</h3>
                    <div className="badge-row">
                      <div className="badge">💪 Keratin Boost</div>
                      <div className="badge">💎 Silk Shine</div>
                      <div className="badge">🛡️ Root Strength</div>
                    </div>
                    <div className="disclaimer">
                      <h4>MEDICAL DISCLAIMER</h4>
                      <p>These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeView === 'glow' && activeGlowProduct === 'hair_vitamins' && (
        <section className="pre-footer-showcase">
          <div className="showcase-content">
            {/* Left: Product Image */}
            <div className="showcase-left">
              <img
                src="/hair_summary.jpg"
                alt="JEEVIX Hair Vitamins - Ultimate Growth & Shine"
                className="showcase-image"
              />

              {/* Action Buttons */}
              <div className="product-actions">
                <button
                  className="action-btn primary-btn"
                  onClick={() => addToCart({
                    id: 'hair-vitamins-premium',
                    name: 'JEEVIX Hair Vitamins Premium',
                    price: 2799,
                    image: '/hair_summary.jpg'
                  })}
                >
                  Add to Cart - ₹2,799
                </button>
                <button
                  className="action-btn secondary-btn"
                  onClick={() => handleBuyNow({
                    id: 'hair-vitamins-premium',
                    name: 'JEEVIX Hair Vitamins Premium',
                    price: 2799,
                    image: '/hair_summary.jpg'
                  })}
                >
                  Buy Now
                </button>
              </div>

              {/* Author Section */}
              <div className="author-section">
                <div className="author-content">
                  <div className="author-image-wrapper">
                    <div className="author-avatar-placeholder">JW</div>
                  </div>
                  <div className="author-info">
                    <h4 className="author-name">Dr. James Wu</h4>
                    <p className="author-title">Trichology & Hair Growth Specialist</p>
                    <blockquote className="author-quote">
                      "Our Hair Vitamins formula focuses on the foundation: the hair roots. By strengthening them at the structural level, we ensure vitality."
                    </blockquote>
                    <div className="author-signature">James Wu</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Information Content */}
            <div className="showcase-right">
              <div className="info-section-header">
                <h2 className="section-title">Hair Vitality Benefits</h2>
              </div>

              <div className="info-columns">
                {/* Column 1 */}
                <div className="info-col">
                  <div className="info-card">
                    <h3>How It Works</h3>
                    <p>JEEVIX Hair Vitamins provide a concentrated dose of Biotin and Collagen to nourish hair follicles, improve scalp health, and stimulate faster, healthier hair growth.</p>
                  </div>

                  <div className="info-card">
                    <h3>Key Benefits</h3>
                    <ul>
                      <li>Promotes Faster & Healthier Hair Growth.</li>
                      <li>Strengthens Hair Roots to reduce breakage.</li>
                      <li>Creates Thicker & Fuller-looking hair.</li>
                      <li>Improves Scalp Health & balance.</li>
                      <li>Boosts Natural Glossy Shine.</li>
                    </ul>
                  </div>

                  <div className="info-card">
                    <h3>Usage Instructions</h3>
                    <div className="instruction-item">
                      <span className="num">1</span>
                      <div>
                        <strong>Daily Serving</strong>
                        <p>Take 2 capsules daily with a meal.</p>
                      </div>
                    </div>
                    <div className="instruction-item">
                      <span className="num">2</span>
                      <div>
                        <strong>Consistency</strong>
                        <p>Best results seen after 60-90 days of consistent use.</p>
                      </div>
                    </div>
                    <div className="instruction-item">
                      <span className="num">3</span>
                      <div>
                        <strong>Full Support</strong>
                        <p>Pair with a healthy diet for maximum nutrient absorption.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="info-col">
                  <div className="info-card">
                    <h3>Pure Ingredients</h3>
                    <div className="ingredient-item">
                      <strong>Biotin & Collagen Blend</strong>
                      <p>Essential proteins and B-vitamins for structural hair integrity.</p>
                    </div>
                    <div className="ingredient-item">
                      <strong>Scalp Nourishing Complex</strong>
                      <p>Natural botanical extracts to maintain a healthy growth environment.</p>
                    </div>
                  </div>

                  <div className="info-card standards-card">
                    <h3>JEEVIX Standards</h3>
                    <div className="badge-row">
                      <div className="badge">💇 Promotes Growth</div>
                      <div className="badge">💎 Boosts Shine</div>
                      <div className="badge">🛡️ Reduces Breakage</div>
                    </div>
                    <div className="disclaimer">
                      <h4>MEDICAL DISCLAIMER</h4>
                      <p>These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-col brand-col">
            <div className="footer-logo">JEEVIX<span className="dot">.</span></div>
            <p className="footer-desc">
              Premium health supplements tailored for your unique lifestyle needs.
              Science-backed formulations for men, weight management, and beauty.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/profile.php?id=61587218860812" className="social-icon" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://x.com/jeevix212934" className="social-icon" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="https://www.instagram.com/jeevix1/" className="social-icon" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://www.linkedin.com/in/jeevix-p-64549b3aa/" className="social-icon" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h3>Company</h3>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('about'); window.scrollTo(0, 0); }}>About Us</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('science'); window.scrollTo(0, 0); }}>Our Science</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('careers'); window.scrollTo(0, 0); }}>Careers</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('contact'); window.scrollTo(0, 0); }}>Contact</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Support</h3>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('track'); window.scrollTo(0, 0); }}>Track Order</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('shipping'); window.scrollTo(0, 0); }}>Shipping & Delivery</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('refunds'); window.scrollTo(0, 0); }}>Cancellations & Refunds</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('help'); window.scrollTo(0, 0); }}>Help Center</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>Legal</h3>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('privacy'); window.scrollTo(0, 0); }}>Privacy Policy</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('terms'); window.scrollTo(0, 0); }}>Terms of Service</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('cookies'); window.scrollTo(0, 0); }}>Cookie Policy</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveView('disclaimers'); window.scrollTo(0, 0); }}>Disclaimers</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Jeevix Health Inc. All rights reserved.</p>
        </div>
      </footer>

      <SkinScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSelectProduct={(view, subProduct) => {
          setActiveView(view);
          if (view === 'man') setActiveManProduct(subProduct);
          if (view === 'slim') setActiveSlimProduct(subProduct);
          if (view === 'glow') setActiveGlowProduct(subProduct);
          window.scrollTo(0, 0);
        }}
      />

      {/* Cart Overlay */}
      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-panel" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Your Selection</h2>
              <button className="close-cart" onClick={() => setIsCartOpen(false)}>✕</button>
            </div>

            <div className="cart-items">
              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <p>Your journey is currently empty.</p>
                  <button className="styled-button" onClick={() => setIsCartOpen(false)}>Continue Exploring</button>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>₹{item.price} x {item.quantity}</p>
                      <button className="remove-item" onClick={() => removeFromCart(item.id)}>Remove</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total Investment</span>
                  <span>₹{cartTotal}</span>
                </div>
                <button
                  className="checkout-btn"
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveView('checkout');
                    window.scrollTo(0, 0);
                  }}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .app-container {
          width: 100%;
          min-height: 100vh;
          background: #f8f9fa;
          overflow-x: hidden;
        }

        .scan-nav-link {
          color: #d4af37 !important;
          font-weight: 700;
          position: relative;
          padding: 8px 16px;
          border-radius: 20px;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          transition: all 0.3s ease;
          letter-spacing: 1px;
          animation: subtleBlink 2s infinite ease-in-out;
        }

        .scan-nav-link:hover {
          background: #d4af37;
          color: white !important;
           box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
           transform: translateY(-2px);
         }

         @keyframes subtleBlink {
           0% { opacity: 1; }
           50% { opacity: 0.8; }
           100% { opacity: 1; }
         }

        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 20px 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 100;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 60px;
        }

        .category-group {
          display: flex;
          gap: 25px;
          border-left: 1px solid #ddd;
          padding-left: 25px;
        }

        .category-group a {
          text-decoration: none;
          color: #888;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 2px;
          transition: all 0.3s ease;
        }

        .category-group a:hover, .category-group a.active-cat {
          color: #2d4a3e;
        }

        .navbar .logo {
          font-family: 'Outfit', sans-serif;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 2px;
          color: #2d4a3e;
          cursor: pointer;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .nav-links a {
          text-decoration: none;
          color: #666;
          font-weight: 500;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: color 0.3s ease;
          position: relative;
        }

        .nav-links a:hover, .nav-links a.active {
          color: #2d4a3e;
        }

        .nav-links a.active::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 100%;
          height: 2px;
          background: #2d4a3e;
        }

        /* Slim Hub Styles */
        .slim-hub {
          width: 100%;
          min-height: 100vh;
          background: #000;
        }

        /* Man Hub Styles */
        .man-hub {
          width: 100%;
          min-height: 100vh;
          background: #000;
        }

        .ashwagandha-full-journey {
          display: flex;
          flex-direction: column;
          background: #dbccae; /* Ensuring no black gaps between sequences */
        }

        .ashwagandha-summary-reveal {
          width: 100%;
          min-height: 100vh;
          background: #dbccae;
          display: flex;
          justify-content: flex-start; /* Aligns container to the left */
          align-items: center;
          padding: 80px 60px;
          border-top: 1px solid rgba(0,0,0,0.02); /* Soft blend */
        }

        .summary-reveal-container {
          width: 100%;
          max-width: 1400px;
          padding-left: 20px;
        }

        .summary-reveal-image {
          width: 55%;
          max-width: 900px;
          height: auto;
          border-radius: 24px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.12);
          opacity: 0.98;
          transition: transform 0.4s ease;
        }

        .summary-reveal-image:hover {
          /* Hover effect removed as per user request */
        }









        /* Glow Hub Styles */

        .sub-nav {
          position: fixed;
          top: 80px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 90;
          display: flex;
          gap: 10px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          padding: 5px;
          border-radius: 40px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 20px;
        }

        .sub-nav button {
          padding: 8px 20px;
          border-radius: 30px;
          border: none;
          background: transparent;
          color: white;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .sub-nav button.active-sub {
          background: #2d4a3e;
          box-shadow: 0 4px 15px rgba(45, 74, 62, 0.4);
        }

        .hub-content {
          width: 100%;
        }

        .nav-cta {
          padding: 10px 25px;
          border-radius: 30px;
          border: 1px solid #2d4a3e;
          background: #2d4a3e;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-cta:hover {
          background: transparent;
          color: #2d4a3e;
        }

        .view-section {
          padding: 160px 60px 80px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .home-view {
          background: radial-gradient(circle at top right, #e8f0e9, #ffffff);
          position: relative;
        }

        .hero-text h1 {
          font-size: clamp(3rem, 8vw, 6rem);
          line-height: 1;
          color: #2d4a3e;
          margin: 20px 0;
        }

        .hero-text p {
          font-size: 20px;
          color: #666;
          max-width: 600px;
          margin-bottom: 40px;
        }

        .explore-btn {
          padding: 18px 45px;
          background: #2d4a3e;
          color: white;
          border: none;
          border-radius: 40px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .explore-btn:hover {
          transform: translateY(-5px);
        }

        .product-placeholder h1 {
          font-size: 4rem;
          color: #2d4a3e;
        }

        .contact-card {
          padding: 60px;
          max-width: 600px;
          width: 100%;
        }

        .contact-info {
          margin-top: 30px;
          font-size: 20px;
        }

        .hero-animation {
          width: 100%;
        }

        .pre-footer-showcase {
          width: 100%;
          background: linear-gradient(to bottom, #dbccae 0%, #c9b896 100%);
          padding: 100px 80px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .showcase-content {
          max-width: 1600px;
          width: 100%;
          display: grid;
          grid-template-columns: 0.7fr 1.3fr;
          gap: 60px;
          align-items: flex-start;
        }

        .showcase-left {
          position: sticky;
          top: 120px;
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .showcase-image {
          width: 100%;
          height: auto;
          border-radius: 28px;
          box-shadow: 0 30px 80px rgba(0,0,0,0.2);
          transition: transform 0.4s ease;
        }

        .showcase-image:hover {
          /* Hover effect removed as per user request */
        }

        .product-actions {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 30px;
        }

        .action-btn {
          width: 100%;
          padding: 18px 30px;
          font-size: 16px;
          font-weight: 600;
          font-family: 'Outfit', sans-serif;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .primary-btn {
          background: #2d4a3e;
          color: white;
          box-shadow: 0 8px 25px rgba(45, 74, 62, 0.3);
        }

        .primary-btn:hover {
          background: #1f3329;
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(45, 74, 62, 0.4);
        }

        .primary-btn:active {
          transform: translateY(-1px);
        }

        .secondary-btn {
          background: white;
          color: #2d4a3e;
          border: 2px solid #2d4a3e;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .secondary-btn:hover {
          background: #2d4a3e;
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(45, 74, 62, 0.3);
        }

        .secondary-btn:active {
          transform: translateY(-1px);
        }

        .author-section {
          margin-top: 30px;
          padding: 25px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(25px);
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 15px 45px rgba(0,0,0,0.04);
        }

        .author-content {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .author-image-wrapper {
          flex-shrink: 0;
        }

        .author-avatar-placeholder {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #2d4a3e 0%, #1a2a23 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 20px;
          letter-spacing: 1px;
          box-shadow: 0 5px 15px rgba(45, 74, 62, 0.2);
        }

        .author-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .author-name {
          font-size: 18px;
          font-weight: 700;
          color: #2d4a3e;
          margin: 0;
          font-family: 'Outfit', sans-serif;
        }

        .author-title {
          font-size: 13px;
          color: #666;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }

        .author-quote {
          margin: 12px 0;
          font-style: italic;
          color: #444;
          font-size: 14px;
          line-height: 1.6;
          position: relative;
          padding-left: 0;
          border: none;
        }

        .author-signature {
          font-family: 'Great Vibes', cursive, 'Dancing Script', serif;
          font-size: 28px;
          color: #2d4a3e;
          opacity: 0.9;
          margin-top: 5px;
          font-weight: 400;
        }

        .showcase-right {
          display: flex;
          flex-direction: column;
          gap: 35px;
        }

        .info-section-header {
          margin-bottom: 25px;
        }

        .section-title {
          font-size: 42px;
          font-weight: 800;
          color: #2d4a3e;
          font-family: 'Outfit', sans-serif;
          margin: 0;
          line-height: 1.1;
          letter-spacing: -1px;
        }

        .info-columns {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 25px;
        }

        .info-col {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.02);
          backdrop-filter: blur(20px);
          padding: 25px;
          border-radius: 24px;
          box-shadow: none;
          border: 1px solid rgba(255,255,255,0.3);
          height: 100%;
          transition: all 0.3s ease;
        }

        .info-card:hover {
          /* Hover effect removed as per user request to keep transparency perfectly still */
        }

        .info-card h3 {
          font-size: 22px;
          font-weight: 700;
          color: #2d4a3e;
          margin: 0 0 18px 0;
          font-family: 'Outfit', sans-serif;
        }

        .info-card p {
          font-size: 16px;
          line-height: 1.8;
          color: #444;
          margin: 0;
        }

        .info-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .info-card ul li {
          padding: 12px 0 12px 30px;
          position: relative;
          font-size: 16px;
          color: #444;
          line-height: 1.7;
        }

        .info-card ul li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #2d4a3e;
          font-weight: bold;
          font-size: 18px;
        }

        .instruction-item {
          display: flex;
          gap: 15px;
          align-items: flex-start;
          margin-bottom: 18px;
        }

        .instruction-item:last-child {
          margin-bottom: 0;
        }

        .instruction-item .num {
          background: rgba(45, 74, 62, 0.4);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 15px;
          flex-shrink: 0;
        }

        .instruction-item strong {
          display: block;
          color: #2d4a3e;
          margin-bottom: 4px;
          font-size: 16px;
          font-weight: 700;
        }

        .instruction-item p {
          margin: 0;
          color: #555;
          font-size: 14px;
          line-height: 1.5;
        }

        .ingredient-item {
          padding: 15px 0;
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }

        .ingredient-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .ingredient-item strong {
          display: block;
          color: #2d4a3e;
          margin-bottom: 6px;
          font-size: 16px;
          font-weight: 600;
        }

        .ingredient-item p {
          color: #666;
          font-size: 15px;
          line-height: 1.6;
        }

        .standards-card {
          background: rgba(255, 255, 255, 0.03);
        }

        .badge-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;
        }

        .badge {
          background: rgba(255, 255, 255, 0.03);
          padding: 12px 15px;
          border-radius: 14px;
          font-size: 14px;
          color: #2d4a3e;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1 1 calc(50% - 10px);
          min-width: 140px;
          border: 1px solid rgba(45, 74, 62, 0.05);
        }

        .disclaimer {
          background: rgba(45, 74, 62, 0.08);
          padding: 20px;
          border-radius: 12px;
          border-left: 4px solid #2d4a3e;
        }

        .disclaimer h4 {
          font-size: 12px;
          font-weight: 700;
          color: #2d4a3e;
          margin: 0 0 10px 0;
          letter-spacing: 1.5px;
        }

        .disclaimer p {
          font-size: 12px;
          color: #666;
          line-height: 1.6;
        }

        @media (max-width: 1024px) {
          .pre-footer-showcase {
            padding: 60px 40px;
          }

          .showcase-content {
            grid-template-columns: 1fr;
            gap: 50px;
          }

          .showcase-left {
            position: relative;
            top: 0;
          }

          .info-columns {
            grid-template-columns: 1fr;
          }

          .section-title {
            font-size: 32px;
          }
        }

        .site-footer {
          background: #000;
          color: #fff;
          padding: 80px 60px 40px;
          font-family: 'Outfit', sans-serif;
          margin-top: 0;
        }

        .footer-main {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr;
          gap: 60px;
          padding-bottom: 60px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          text-align: left;
        }

        .footer-col h3 {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 25px;
          text-transform: capitalize;
          letter-spacing: 0.5px;
          color: #fff;
        }

        .footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-col ul li {
          margin-bottom: 12px;
        }

        .footer-col ul li a {
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s ease;
        }

        .footer-col ul li a:hover {
          color: #fff;
        }

        .brand-col .footer-logo {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 20px;
          color: #fff;
          text-align: left;
        }

        .brand-col .footer-logo .dot {
          color: #2d4a3e;
        }

        .footer-desc {
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          line-height: 1.6;
          max-width: 320px;
          margin-bottom: 30px;
          text-align: left;
        }

        .social-links {
          display: flex;
          gap: 15px;
          justify-content: flex-start;
        }

        .social-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .social-icon:hover {
          background: #fff;
          color: #000;
          transform: translateY(-3px);
        }

        .footer-bottom {
          max-width: 1400px;
          margin: 0 auto;
          padding-top: 30px;
          text-align: center;
        }

        .footer-bottom p {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
        }



        .info-section {
          background: radial-gradient(circle at center, #f8f9fa, #e9ecef);
          padding: 120px 20px;
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Auth & Checkout Styles */
        .auth-gate-container, .auth-form-container, .success-container {
          max-width: 500px;
          margin: 0 auto;
          text-align: center;
          padding: 40px;
          background: white;
          border-radius: 32px;
          border: 1px solid rgba(45, 74, 62, 0.1);
          box-shadow: 0 40px 100px rgba(0,0,0,0.05);
        }

        .gate-icon { font-size: 64px; margin-bottom: 20px; }
        .gate-title, .success-msg { font-size: 32px; color: #2d4a3e; margin-bottom: 15px; }
        .gate-subtitle, .form-desc, .success-desc { color: #666; font-size: 16px; margin-bottom: 30px; line-height: 1.6; }

        .auth-redirect-buttons { display: flex; flex-direction: column; gap: 15px; }
        .auth-form { display: flex; flex-direction: column; gap: 20px; text-align: left; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 14px; font-weight: 600; color: #2d4a3e; }
        .forgot-pass { background: none; border: none; color: #888; font-size: 12px; align-self: flex-end; cursor: pointer; padding: 0; }
        .form-footer { margin-top: 30px; font-size: 14px; color: #666; }
        .link { color: #2d4a3e; font-weight: 700; cursor: pointer; text-decoration: underline; }

        .success-check {
          width: 80px; height: 80px; background: #2d4a3e; color: white; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 40px; margin: 0 auto 30px;
        }

        /* Checkout Page Enhancement */
        .checkout-main-container { width: 100%; max-width: 1200px; margin: 0 auto; }
        .checkout-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 40px; align-items: flex-start; }
        
        .checkout-section {
          background: white; padding: 30px; border-radius: 24px; margin-bottom: 20px;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .checkout-section h3 { font-size: 20px; margin-bottom: 25px; color: #2d4a3e; border-bottom: 1px solid #eee; padding-bottom: 10px; }

        .address-form { display: flex; flex-direction: column; gap: 15px; }
        .input-row { display: flex; gap: 15px; }
        .styled-input {
          padding: 15px 20px; border-radius: 12px; border: 1px solid #ddd;
          font-family: 'Outfit', sans-serif; font-size: 15px; width: 100%;
          transition: border-color 0.3s ease;
        }
        .styled-input:focus { outline: none; border-color: #2d4a3e; }

        .payment-options { display: flex; flex-direction: column; gap: 15px; }
        .payment-option {
          display: flex; gap: 15px; align-items: center; padding: 15px;
          border: 1px solid #eee; border-radius: 14px; cursor: pointer; transition: all 0.3s ease;
        }
        .payment-option:hover { border-color: #2d4a3e; background: rgba(45,74,62,0.02); }
        .payment-info strong { display: block; font-size: 15px; color: #333; }
        .payment-info p { font-size: 12px; color: #888; margin: 0; }

        .order-summary-card {
          background: white; padding: 30px; border-radius: 24px; position: sticky; top: 120px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.05); border: 1px solid rgba(45,74,62,0.1);
        }
        .summary-items { max-height: 300px; overflow-y: auto; margin-bottom: 25px; }
        .summary-item { display: flex; gap: 15px; align-items: center; padding: 15px 0; border-bottom: 1px solid #eee; }
        .summary-item img { width: 60px; height: 60px; border-radius: 10px; object-fit: cover; }
        .item-meta strong { font-size: 14px; color: #2d4a3e; display: block; }
        .item-meta p { font-size: 13px; color: #666; margin: 0; }

        .summary-totals { margin-bottom: 25px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; color: #666; }
        .total-row.grand-total { border-top: 2px solid #eee; margin-top: 10px; padding-top: 15px; font-weight: 800; color: #2d4a3e; font-size: 20px; }
        .free { color: #27ae60; font-weight: 700; }

        .place-order-btn {
          width: 100%; padding: 20px; background: #2d4a3e; color: white; border: none;
          border-radius: 16px; font-weight: 800; font-size: 18px; cursor: pointer;
          transition: all 0.3s ease; box-shadow: 0 10px 30px rgba(45, 74, 62, 0.3);
        }
        .place-order-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(45, 74, 62, 0.4); }
        .secure-note { text-align: center; font-size: 12px; color: #aaa; margin-top: 15px; }

        .user-nav { display: flex; align-items: center; gap: 20px; }
        .user-welcome { font-size: 14px; font-weight: 600; color: #2d4a3e; }
        .logout-btn { background: transparent; color: #888; border-color: #ddd; }
        .logout-btn:hover { color: #e74c3c; border-color: #e74c3c; }

        .info-title {
          font-size: 48px;
          color: #2d4a3e;
          margin-bottom: 30px;
          font-weight: 800;
        }

        .info-body p {
          font-size: 18px;
          line-height: 1.8;
          color: #444;
          margin-bottom: 20px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-top: 40px;
        }

        .info-card {
          background: rgba(255, 255, 255, 0.02);
          padding: 30px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow: none;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .info-card:hover {
          transform: scale(1.03);
          background: rgba(255, 255, 255, 0.08);
          border-color: #d4af37;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .info-card h4 {
          color: #2d4a3e;
          margin-bottom: 15px;
          font-size: 20px;
        }

        .science-list {
          list-style: none;
          padding: 0;
          margin-top: 30px;
        }

        .science-list li {
          padding: 15px 0;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          font-size: 17px;
          color: #555;
        }

        .back-home-btn {
          margin-top: 50px;
          padding: 15px 35px;
          background: #2d4a3e;
          color: white;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .science-highlight {
          background: #f1f3f5;
          padding: 25px;
          border-left: 4px solid #2d4a3e;
          border-radius: 8px;
          margin: 30px 0;
        }

        .science-highlight h4 {
          margin-bottom: 10px;
          color: #2d4a3e;
        }

        .contact-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 30px;
        }

        .placeholder-input-container {
          display: flex;
          gap: 10px;
          margin-top: 30px;
        }

        .styled-input {
          flex: 1;
          padding: 15px 20px;
          border-radius: 30px;
          border: 1px solid #ddd;
          font-size: 16px;
          outline: none;
        }

        .styled-button {
          padding: 15px 30px;
          background: #2d4a3e;
          color: white;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          cursor: pointer;
        }

        .info-list {
          margin-top: 20px;
          padding-left: 20px;
        }

        .info-list li {
          margin-bottom: 10px;
          font-size: 17px;
          color: #444;
        }

        .faq-item {
          margin-top: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
        }

        .faq-item strong {
          display: block;
          margin-bottom: 10px;
          font-size: 19px;
          color: #2d4a3e;
        }

        @media (max-width: 1024px) {
          .navbar { padding: 20px; }
          .nav-links { display: none; } /* Mobile nav should be implemented properly */
        }

        /* Cart Overlay Styles */
        .cart-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(5px);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
          align-items: flex-start;
        }

        .cart-panel {
          background: #fff;
          width: 100%;
          max-width: 450px;
          height: 100%;
          box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          padding: 30px;
          position: relative;
          animation: slideIn 0.3s ease-out forwards;
        }

        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
          margin-bottom: 20px;
        }

        .cart-header h2 {
          font-size: 24px;
          color: #2d4a3e;
          margin: 0;
        }

        .close-cart {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          transition: color 0.2s ease;
        }

        .close-cart:hover {
          color: #2d4a3e;
        }

        .cart-items {
          flex-grow: 1;
          overflow-y: auto;
          padding-right: 10px; /* For scrollbar */
        }

        .empty-cart {
          text-align: center;
          padding: 50px 20px;
          color: #777;
        }

        .empty-cart p {
          font-size: 18px;
          margin-bottom: 30px;
        }

        .empty-cart .styled-button {
          padding: 12px 25px;
          font-size: 16px;
        }

        .cart-item {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #f5f5f5;
        }

        .cart-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .cart-item img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 10px;
        }

        .item-details {
          flex-grow: 1;
        }

        .item-details h4 {
          margin: 0 0 5px 0;
          font-size: 16px;
          color: #2d4a3e;
        }

        .item-details p {
          margin: 0;
          font-size: 14px;
          color: #666;
        }

        .remove-item {
          background: none;
          border: none;
          color: #e74c3c;
          font-size: 12px;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
        }

        .cart-footer {
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .cart-total {
          display: flex;
          justify-content: space-between;
          font-size: 18px;
          font-weight: 700;
          color: #2d4a3e;
          margin-bottom: 20px;
        }

        .checkout-btn {
          width: 100%;
          padding: 15px 20px;
          background: #2d4a3e;
          color: white;
          border: none;
          border-radius: 30px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .checkout-btn:hover {
          background: #1f3329;
        }
        .cart-trigger {
          position: relative;
          cursor: pointer;
          font-size: 20px;
          margin: 0 15px;
          display: flex;
          align-items: center;
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #e74c3c;
          color: white;
          font-size: 10px;
          font-weight: 700;
          min-width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          border: 2px solid white;
        }
        /* Author Page Styles */
        .author-view {
          padding: 80px 5%;
          background: #fdfdfd;
          min-height: 100vh;
        }

        .author-page-container {
          max-width: 1200px;
          margin: 40px auto;
          background: #fff;
          padding: 80px;
          border-radius: 40px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.05);
        }

        .author-main {
          display: flex;
          gap: 80px;
          align-items: flex-start;
        }

        .author-visual {
          width: 40%;
          position: sticky;
          top: 150px;
        }

        .author-portrait-mock {
          width: 100%;
          aspect-ratio: 4/5;
          background: #f5f5f5;
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 80px;
          color: #d4af37;
          font-weight: 800;
          border: 1px solid #eee;
          background-image: linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%);
        }

        .author-credentials-scroll {
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .cred-tag {
          padding: 8px 16px;
          background: #f8fbf9;
          border: 1px solid #e8f0ed;
          border-radius: 50px;
          font-size: 13px;
          color: #2d4a3e;
          font-weight: 600;
        }

        .author-text-content {
          width: 60%;
          text-align: left;
        }

        .author-page-title {
          font-size: 64px;
          color: #2d4a3e;
          margin: 10px 0;
          font-weight: 800;
        }

        .author-subtitle {
          font-size: 24px;
          color: #d4af37;
          margin-bottom: 40px;
          font-weight: 500;
        }

        .author-full-bio p {
          font-size: 18px;
          line-height: 1.8;
          color: #666;
          margin-bottom: 25px;
        }

        .philosophy-card {
          margin: 50px 0;
          padding: 40px;
          background: #2d4a3e;
          color: white;
          border-radius: 25px;
          position: relative;
        }

        .philosophy-card h3 {
          font-size: 28px;
          font-style: italic;
          font-weight: 300;
          line-height: 1.4;
          margin: 0;
        }

        .author-achievements {
          display: flex;
          gap: 40px;
          margin: 50px 0;
          padding-top: 40px;
          border-top: 1px solid #eee;
        }

        .achievement {
          display: flex;
          flex-direction: column;
        }

        .achievement strong {
          font-size: 32px;
          color: #2d4a3e;
        }

        .achievement span {
          font-size: 14px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        @media (max-width: 1024px) {
          .author-main { flex-direction: column; gap: 40px; }
          .author-visual, .author-text-content { width: 100%; }
          .author-visual { position: static; }
          .author-page-container { padding: 40px; }
          .author-page-title { font-size: 48px; }
        }
        .expert-team-showcase {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid #eee;
        }

        .expert-mini-card {
          padding: 15px;
          background: #f8fbf9;
          border-radius: 12px;
          border: 1px solid #e8f0ed;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .expert-mini-card:hover {
          transform: translateY(-5px) scale(1.05);
          border-color: #d4af37;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }

        .expert-mini-card strong {
          display: block;
          font-size: 15px;
          color: #2d4a3e;
          margin-bottom: 4px;
        }

        .expert-mini-card span {
          font-size: 12px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .team-visual {
          background-image: linear-gradient(135deg, #2d4a3e 0%, #1f3329 100%) !important;
          color: #d4af37 !important;
        }

        @media (max-width: 768px) {
          .expert-team-showcase { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}

export default App
