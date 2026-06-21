import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Music, MapPin, Radio, Activity } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import PageLoader from './PageLoader';

gsap.registerPlugin(ScrollTrigger);

// Context for managing delayed page transition loader
export const LoaderContext = createContext({
  startTransition: () => {},
  endTransition: () => {}
});

// Helper component to trigger page transitions inside React Suspense fallbacks
export function SuspenseLoaderTrigger() {
  const { startTransition, endTransition } = useContext(LoaderContext);
  
  useEffect(() => {
    startTransition();
    return () => endTransition();
  }, [startTransition, endTransition]);
  
  return null;
}

const Instagram = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);


export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showPreloader, setShowPreloader] = useState(false);
  const [showTransitionLoader, setShowTransitionLoader] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  const location = useLocation();
  const transitionTimeoutRef = useRef(null);
  const mainContentRef = useRef(null);
  const lenisRef = useRef(null);

  // Initialize Lenis smooth scroll and connect with GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.15, // Tighter lerp to prevent the 'dragged along' feeling on trackpads
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      autoRaf: false, // Prevent Lenis from running its own loop
    });

    lenisRef.current = lenis;

    // Sync GSAP ScrollTrigger updates with Lenis scrolling
    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      setIsScrolled(e.scroll > 50);
    });

    // Feed Lenis into the GSAP ticker loop
    const tickerUpdate = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerUpdate);
      lenisRef.current = null;
    };
  }, []);

  // Control scrolling state based on preloader/transition loader visibility
  useEffect(() => {
    if (showPreloader || showTransitionLoader) {
      document.documentElement.style.overflow = 'hidden';
      if (lenisRef.current) lenisRef.current.stop();
    } else {
      document.documentElement.style.overflow = '';
      if (lenisRef.current) lenisRef.current.start();
    }
    return () => {
      document.documentElement.style.overflow = '';
      if (lenisRef.current) lenisRef.current.start();
    };
  }, [showPreloader, showTransitionLoader]);

  // Navbar animation on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    setIsMenuOpen(false);
  }, [location]);

  // Trigger site-wide preloader on first session visit
  useEffect(() => {
    const hasPreloaded = sessionStorage.getItem('forArtPreloaded');
    if (!hasPreloaded) {
      setShowPreloader(true);
    }
  }, []);

  // Define transition trigger callbacks
  const startTransition = useCallback(() => {
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    setIsPageLoaded(false);

    // Only show transition loader if loading takes longer than 250ms
    transitionTimeoutRef.current = setTimeout(() => {
      setShowTransitionLoader(true);
    }, 250);
  }, []);

  const endTransition = useCallback(() => {
    if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    setIsPageLoaded(true);
  }, []);

  // Animate main content container entrance on page change (for smooth instant changes)
  useEffect(() => {
    if (mainContentRef.current) {
      gsap.fromTo(mainContentRef.current,
        { opacity: 0, y: 15 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          ease: 'power2.out', 
          delay: 0.1,
          clearProps: 'transform',
          onComplete: () => {
            ScrollTrigger.refresh();
          }
        }
      );
    }
  }, [location.pathname]);

  return (
    <LoaderContext.Provider value={{ startTransition, endTransition }}>
      <div className="relative min-h-screen bg-bunker text-softwhite select-none flex flex-col overflow-x-clip">
        {/* Site Entry Preloader */}
        {showPreloader && (
          <PageLoader
            isPreloader
            onExitComplete={() => {
              sessionStorage.setItem('forArtPreloaded', 'true');
              setShowPreloader(false);
            }}
          />
        )}

        {/* Dynamic Route Transition Loader */}
        {showTransitionLoader && (
          <PageLoader
            isVisible={showTransitionLoader}
            isLoaded={isPageLoaded}
            onExitComplete={() => setShowTransitionLoader(false)}
            pathname={location.pathname}
          />
        )}

        {/* Visual noise overlay removed to improve scroll performance */}

      {/* Global warm light leak in the background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent/5 blur-[120px] transform-gpu will-change-transform" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent/5 blur-[120px] transform-gpu will-change-transform" />
      </div>

      {/* Navigation Header */}
      <nav
        id="navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,padding,color] duration-500 border-b ${
          isScrolled 
            ? 'bg-bunker border-accent py-4 text-white' 
            : 'bg-transparent border-transparent py-6 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center group">
            <img 
              src="/images/Logo/TRANSPARENCY 02.png" 
              alt="For Art Studios Logo" 
              decoding="async"
              className="h-20 md:h-24 w-auto object-contain transition-transform duration-500 group-hover:scale-110" 
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-heading text-xs font-semibold tracking-widest uppercase">
            {[
              { path: '/', label: 'Home' },
              { path: '/studio', label: 'Studio & Gear' },
              { path: '/over-ons', label: 'Over Ons' },
              { path: '/services', label: 'Diensten & Tarieven' }
            ].map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative py-2 transition-colors duration-300 hover:text-accent ${
                    isActive ? 'text-accent' : 'text-white/75'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-full shadow-[0_0_10px_#E57E25]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}

            <Link
              to="/contact"
              className="ml-4 px-6 py-3 rounded-full bg-accent text-bunker font-heading text-xs font-black tracking-widest uppercase hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(229,126,37,0.2)] hover:shadow-[0_0_30px_rgba(229,126,37,0.4)]"
            >
              Boeken
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-full border border-white/10 ${isMenuOpen ? 'bg-primary text-bunker' : 'bg-bunker/50 text-white'} hover:text-accent transition-colors focus:outline-none z-50`}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-bunker/98 backdrop-blur-lg z-40 flex flex-col justify-center items-center gap-8 md:hidden">
            <div className="flex flex-col items-center gap-6 font-heading text-lg font-bold tracking-widest uppercase">
              {[
                { path: '/', label: 'Home' },
                { path: '/studio', label: 'Studio & Gear' },
                { path: '/over-ons', label: 'Over Ons' },
                { path: '/services', label: 'Diensten & Tarieven' },
                { path: '/contact', label: 'Boek Nu' }
              ].map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `transition-colors duration-300 ${isActive ? 'text-accent' : 'text-white/80'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
            <div className="absolute bottom-10 flex flex-col items-center gap-4 text-white/40 font-sans text-xs tracking-wider">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" /> Leiden, Nederland
              </span>
              <div className="flex gap-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  <Music className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main ref={mainContentRef} className="pt-24 z-10 relative flex-grow">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#050a1c] relative z-10 pt-20 pb-10 text-white/90">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full border border-accent/20 flex items-center justify-center bg-bunker overflow-hidden">
                  <img src="/images/Logo/TRANSPARENCY.png" alt="For Art Studios Logo" decoding="async" className="w-6 h-6 object-contain" />
                </div>
                <span className="font-heading font-black tracking-widest text-lg text-white">
                  FOR ART <span className="text-accent text-[11px] font-sans tracking-normal uppercase ml-1 font-bold">STUDIOS</span>
                </span>
              </div>
              <p className="font-sans text-sm text-white/70 leading-relaxed max-w-sm">
                Onafhankelijke creatieve hub in Leiden waar een nieuwe generatie artiesten, producers, dj's en engineers muziek en content kunnen creëren zonder limieten.
              </p>
            </div>

            <div>
              <h4 className="font-heading text-xs tracking-wider text-accent uppercase mb-6 font-bold">Navigatie</h4>
              <ul className="space-y-3 font-heading text-xs font-semibold tracking-wider uppercase">
                <li>
                  <Link to="/" className="text-white/60 hover:text-accent transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/studio" className="text-white/60 hover:text-accent transition-colors duration-200">
                    Studio & Gear
                  </Link>
                </li>
                <li>
                  <Link to="/over-ons" className="text-white/60 hover:text-accent transition-colors duration-200">
                    Over Ons
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-white/60 hover:text-accent transition-colors duration-200">
                    Diensten
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading text-xs tracking-wider text-accent uppercase mb-6 font-bold">Locatie & Contact</h4>
              <ul className="space-y-3 font-sans text-xs text-white/60">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>Leiden, Nederland (Commerciële studioruimte)</span>
                </li>
                <li className="pt-2">
                  <div className="flex gap-4">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-accent hover:border-accent transition-all duration-300"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a
                      href="https://tiktok.com"
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-accent hover:border-accent transition-all duration-300"
                    >
                      <Music className="w-4 h-4" />
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans text-white/40">
            <p>&copy; {new Date().getFullYear()} For Art Studios. Alle rechten voorbehouden.</p>
            <p className="flex items-center gap-1.5">
              Ontwikkeld voor <span className="text-accent">●</span> For Art Studios
            </p>
          </div>
        </div>
      </footer>
    </div>
  </LoaderContext.Provider>
  );
}
