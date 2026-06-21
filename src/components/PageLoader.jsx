import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

// Maps pathname to elegant Dutch page names
const getPageName = (path) => {
  switch (path) {
    case '/':
      return 'HOME';
    case '/studio':
      return 'STUDIO & GEAR';
    case '/over-ons':
      return 'OVER ONS';
    case '/services':
      return 'DIENSTEN & TARIEVEN';
    case '/contact':
      return 'BOEKEN';
    default:
      return 'FOR ART';
  }
};

// Music studio themed status messages
const getStatusText = (progress) => {
  if (progress < 15) return 'Sessie initialiseren...';
  if (progress < 35) return 'Analoge circuits opwarmen...';
  if (progress < 55) return 'Kanalen patchen & routen...';
  if (progress < 75) return 'Frequenties & EQ afstellen...';
  if (progress < 90) return 'Acoustische ruimte tunen...';
  if (progress < 100) return 'Tape deck starten...';
  return 'Sessie gereed. Ready to record.';
};

export default function PageLoader({
  isVisible = true,
  isLoaded = false,
  isPreloader = false,
  onExitComplete,
  pathname = window.location.pathname
}) {
  const [progress, setProgress] = useState(0);
  const [renderComponent, setRenderComponent] = useState(isVisible);
  
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const progressBarRef = useRef(null);
  const statusRef = useRef(null);
  const progressNumRef = useRef(null);
  const overlayLayerRef = useRef(null);

  const progressTweenRef = useRef(null);

  // Prevent scroll during loading
  useEffect(() => {
    if (renderComponent) {
      document.documentElement.classList.add('lenis-stopped');
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.documentElement.classList.remove('lenis-stopped');
      document.body.style.overflow = '';
    };
  }, [renderComponent]);

  // Handle visibility changes
  useEffect(() => {
    if (isVisible) {
      setRenderComponent(true);
      setProgress(0);
    }
  }, [isVisible]);

  // Main animation effect
  useEffect(() => {
    if (!renderComponent) return;

    const ctx = gsap.context(() => {
      // 1. Initial entrance animation of the content elements
      gsap.fromTo(
        [logoRef.current, textRef.current, progressBarRef.current, statusRef.current, progressNumRef.current],
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out' }
      );

      const progressObj = { value: 0 };

      if (isPreloader) {
        // --- SITE PRELOADER MODE ---
        // Run self-contained animation from 0 to 100
        progressTweenRef.current = gsap.to(progressObj, {
          value: 100,
          duration: 1.2,
          ease: 'power2.out',
          onUpdate: () => {
            setProgress(Math.round(progressObj.value));
          },
          onComplete: () => {
            triggerExitWipe();
          }
        });
      } else {
        // --- TRANSITION LOADER MODE ---
        // Animate up to 90% and wait for the page to be loaded
        progressTweenRef.current = gsap.to(progressObj, {
          value: 90,
          duration: 2.0, // Slow progress bar
          ease: 'power1.out',
          onUpdate: () => {
            setProgress(Math.round(progressObj.value));
          }
        });
      }
    });

    return () => ctx.revert();
  }, [renderComponent, isPreloader]);

  // Monitor the isLoaded prop in transition mode
  useEffect(() => {
    if (isPreloader || !renderComponent || !isLoaded) return;

    // The page has loaded! Accelerate from current progress to 100%
    if (progressTweenRef.current) progressTweenRef.current.kill();

    const progressObj = { value: progress };
    gsap.to(progressObj, {
      value: 100,
      duration: 0.25,
      ease: 'power2.out',
      onUpdate: () => {
        setProgress(Math.round(progressObj.value));
      },
      onComplete: () => {
        triggerExitWipe();
      }
    });
  }, [isLoaded, isPreloader, renderComponent]);

  // Exit wipe animation
  const triggerExitWipe = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setRenderComponent(false);
        if (onExitComplete) onExitComplete();
      }
    });

    // Animate text & logo sliding up slightly faster (parallax)
    tl.to([logoRef.current, textRef.current, progressBarRef.current, statusRef.current, progressNumRef.current], {
      y: -50,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in'
    }, 0);

    // Orange secondary wipe
    tl.to(overlayLayerRef.current, {
      yPercent: -100,
      duration: 0.6,
      ease: 'power3.inOut'
    }, 0.1);

    // Main Bunker wipe
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 0.7,
      ease: 'power4.inOut'
    }, 0.15);
  };

  if (!renderComponent) return null;

  const pageName = getPageName(pathname);
  const statusText = getStatusText(progress);

  return (
    <>
      {/* Orange accent curtain that slides up just before the main container */}
      <div 
        ref={overlayLayerRef}
        className="fixed inset-0 z-[9998] bg-accent pointer-events-none transform translate-y-0"
      />

      {/* Main Loader Container */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-[9999] bg-bunker flex flex-col justify-center items-center px-6 overflow-hidden select-none transform translate-y-0"
      >
        {/* Subtle background glow grid/ambient leak */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,126,37,0.08)_0%,transparent_70%)] pointer-events-none" />
        
        {/* Decorative corner lines for studio rack/gear design */}
        <div className="absolute top-8 left-8 w-4 h-4 border-t-2 border-l-2 border-white/10" />
        <div className="absolute top-8 right-8 w-4 h-4 border-t-2 border-r-2 border-white/10" />
        <div className="absolute bottom-8 left-8 w-4 h-4 border-b-2 border-l-2 border-white/10" />
        <div className="absolute bottom-8 right-8 w-4 h-4 border-b-2 border-r-2 border-white/10" />

        <div className="relative z-10 flex flex-col items-center max-w-md w-full">
          {/* Logo */}
          <div ref={logoRef} className="mb-6 transform">
            <img
              src="/images/Logo/TRANSPARENCY 02.png"
              alt="For Art Studios Logo"
              className="h-16 md:h-20 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(229,126,37,0.15)]"
            />
          </div>

          {/* Subheading / Page title */}
          <div ref={textRef} className="text-center mb-8">
            <span className="text-[10px] font-sans tracking-[0.25em] text-accent uppercase block mb-1 font-bold">
              FOR ART STUDIOS
            </span>
            <h2 className="font-heading text-lg md:text-xl font-bold tracking-widest text-softwhite">
              {pageName}
            </h2>
          </div>

          {/* Progress bar container */}
          <div className="w-full flex items-center justify-between gap-4 mb-3">
            <div ref={progressBarRef} className="flex-1 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-accent transition-all duration-75 ease-out shadow-[0_0_8px_#E57E25]"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Monospace progress percentage */}
            <span
              ref={progressNumRef}
              className="font-sans text-xs font-bold text-accent min-w-[36px] text-right"
            >
              {progress.toString().padStart(3, '0')}%
            </span>
          </div>

          {/* Dynamic Dutch status message */}
          <div 
            ref={statusRef} 
            className="font-sans text-[10px] text-white/40 tracking-wider flex items-center gap-2 font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping shrink-0" />
            <span className="uppercase">{statusText}</span>
          </div>
        </div>

        {/* Vintage VU meter grid details on sides */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-1.5 items-center opacity-20">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className={`h-0.5 w-4 rounded-full ${
                i < 3 ? 'bg-red-500' : i < 6 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ opacity: progress > (11 - i) * 8 ? 1 : 0.2 }}
            />
          ))}
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-1.5 items-center opacity-20">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className={`h-0.5 w-4 rounded-full ${
                i < 3 ? 'bg-red-500' : i < 6 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ opacity: progress > (11 - i) * 8 ? 1 : 0.2 }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
