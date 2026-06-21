import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Sliders, Disc, Mic, Volume2, ArrowRight, Pause, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef(null);
  const heroTitleRef = useRef(null);
  const lightLeakRef = useRef(null);
  const horizontalSectionRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playerVisible, setPlayerVisible] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (currentTrack) {
      const timer = setTimeout(() => setPlayerVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setPlayerVisible(false);
    }
  }, [currentTrack]);


  useEffect(() => {
    // Setup audio listeners when track changes
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const handleTimeUpdate = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentTrack]);

  // Handle global audio instance creation
  useEffect(() => {
    audioRef.current = new Audio();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = (track) => {
    if (!audioRef.current) return;

    if (currentTrack && currentTrack.id === track.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
        setIsPlaying(true);
      }
    } else {
      audioRef.current.pause();
      audioRef.current.src = track.audioUrl;
      audioRef.current.load();
      setCurrentTrack(track);
      setIsPlaying(true);
      // Play after load
      audioRef.current.play().catch(e => console.error("Playback failed:", e));
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setProgress(e.target.value);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const scrollShowcase = (direction) => {
    const isDesktop = window.innerWidth >= 768;
    const cardWidth = window.innerWidth >= 1024 ? 460 : window.innerWidth >= 640 ? 412 : 352; // card size + gap
    
    if (isDesktop) {
      window.scrollBy({
        top: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth'
      });
    } else {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollBy({
          left: direction === 'left' ? -cardWidth : cardWidth,
          behavior: 'smooth'
        });
      }
    }
  };

  const tracks = [
    {
      id: 1,
      title: "Nachtvlinder",
      artist: "Yara",
      genre: "Deep House / Techno",
      service: "Volledige Productie & Mix",
      cover: "/images/cover_nachtvlinder.png",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
      id: 2,
      title: "Horizon",
      artist: "Kian",
      genre: "Melodic Hip-Hop",
      service: "Mix & Master",
      cover: "/images/cover_horizon.png",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
      id: 3,
      title: "Koper & Goud",
      artist: "Studio-collectief",
      genre: "Indie Electronic / Alt Rock",
      service: "Mastering",
      cover: "/images/cover_koper_goud.png",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
      id: 4,
      title: "Resonantie",
      artist: "DJ Yinka",
      genre: "Bass House / UKG",
      service: "Mix & Master",
      cover: "/images/cover_resonantie.png",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    }
  ];


  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero "Lichtflits Ontwaken" Animation
      const tl = gsap.timeline();
      
      // Warm light leak flikkering
      tl.fromTo(lightLeakRef.current, 
        { opacity: 0, scale: 0.8 }, 
        { opacity: 0.6, scale: 1, duration: 1.5, ease: "power2.out" }
      );
      
      // Simulated amp warmup flikkering
      tl.to(lightLeakRef.current, {
        opacity: 0.15,
        duration: 0.1,
        repeat: 3,
        yoyo: true,
        ease: "rough({ template: none.out, strength: 1, points: 20, taper: 'none', randomize: true, clamp: false })"
      });

      tl.to(lightLeakRef.current, {
        opacity: 0.4,
        duration: 0.8,
        ease: "power1.inOut"
      });

      // Staggered letters fade-up
      const titleChars = heroTitleRef.current.querySelectorAll('.char');
      tl.fromTo(titleChars, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: "power4.out" },
        "-=1.5"
      );

      // Hero content elements fade in
      tl.fromTo('.hero-fade', 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" },
        "-=0.8"
      );

      // 2. Waveform Scroll-reveal (Mission Section)
      const words = document.querySelectorAll('.mission-word');
      gsap.fromTo(words,
        { opacity: 0.15, color: '#FAFAFA' },
        {
          opacity: 1,
          color: '#E57E25',
          stagger: 0.05,
          scrollTrigger: {
            trigger: '.mission-section',
            start: 'top 75%',
            end: 'bottom 40%',
            scrub: true,
          }
        }
      );

      // Waveform line animation
      gsap.fromTo('.waveform-path', 
        { strokeDashoffset: 1000 },
        {
          strokeDashoffset: 0,
          scrollTrigger: {
            trigger: '.mission-section',
            start: 'top 80%',
            end: 'bottom 50%',
            scrub: true
          }
        }
      );

      // Mission Intro Text Reveal
      gsap.fromTo('.mission-intro-container',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: '.mission-intro-container',
            start: 'top 85%',
          }
        }
      );

      // 3. Grid elements fade-in on scroll
      gsap.fromTo('.feature-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 80%',
          }
        }
      );

      // 4. Horizontal Scroll Pinned Showcase
      const scrollContainer = scrollContainerRef.current;
      const horizontalSection = horizontalSectionRef.current;
      if (scrollContainer && horizontalSection) {
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
          gsap.fromTo(scrollContainer,
            { x: 0 },
            {
              x: () => -(scrollContainer.scrollWidth - window.innerWidth),
              ease: "none",
              scrollTrigger: {
                trigger: horizontalSection,
                pin: true,
                scrub: 1, // Smooth scrub easing to align with Lenis
                start: "top top",
                end: () => `+=${scrollContainer.scrollWidth - window.innerWidth}`,
                invalidateOnRefresh: true,
              }
            }
          );
        });

        mm.add("(max-width: 767px)", () => {
          gsap.set(scrollContainer, { x: 0 });
        });
      }
    }, containerRef);

    // Trackpad horizontal swipe gesture handler
    const horizontalSection = horizontalSectionRef.current;
    const handleWheel = (e) => {
      if (window.innerWidth >= 768 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        window.scrollBy({
          top: e.deltaX,
          behavior: 'auto'
        });
      }
    };

    if (horizontalSection) {
      horizontalSection.addEventListener('wheel', handleWheel, { passive: false });
    }

    // Refresh ScrollTrigger after a brief delay to ensure DOM is settled
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      ctx.revert();
      clearTimeout(timer);
      if (horizontalSection) {
        horizontalSection.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  // Render word with char-by-char animation support
  const renderWord = (word) => {
    return word.split("").map((char, index) => (
      <span 
        key={index} 
        className="char inline-block"
        style={{ display: 'inline-block' }}
      >
        {char}
      </span>
    ));
  };

  return (
    <div ref={containerRef} className="relative z-10 w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden">
        {/* Dynamic ambient glow behind Hero title */}
        <div 
          ref={lightLeakRef} 
          className="absolute w-[400px] h-[400px] rounded-full bg-accent/20 blur-[100px] pointer-events-none z-0 transform-gpu will-change-transform" 
        />

        <div className="max-w-4xl relative z-10">
          <span className="hero-fade font-data text-xs md:text-sm text-accent tracking-[0.4em] uppercase mb-4 block">
            LEIDEN, NEDERLAND
          </span>
          
          <h1 
            ref={heroTitleRef}
            className="font-heading text-4xl sm:text-6xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.15] text-softwhite mb-8 uppercase tracking-tight flex flex-col md:flex-row md:flex-wrap md:justify-center md:items-center gap-y-2 md:gap-y-0"
          >
            <span className="whitespace-nowrap inline-block">
              {renderWord("FOR")}
              <span className="inline-block w-3 sm:w-4" />
              {renderWord("ART")}
            </span>
            <span className="whitespace-nowrap inline-block text-accent md:ml-4">
              {renderWord("STUDIOS")}
            </span>
          </h1>

          <p className="hero-fade font-sans text-lg md:text-2xl text-softwhite/80 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            <span className="font-drama italic text-accent">Onafhankelijke creatieve hub</span> waar een nieuwe generatie artiesten muziek en content creëert zonder limieten.
          </p>

          <div className="hero-fade flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link
              to="/contact"
              className="px-8 py-4 w-full sm:w-auto rounded-full bg-accent text-bunker font-heading text-sm font-black tracking-widest uppercase hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(229,126,37,0.3)] hover:scale-105 active:scale-95 text-center"
            >
              Start Je Sessie
            </Link>
            <Link
              to="/studio"
              className="px-8 py-4 w-full sm:w-auto rounded-full border border-white/20 bg-bunker/40 text-softwhite font-heading text-sm font-black tracking-widest uppercase hover:border-accent hover:bg-bunker transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Ontdek De Studio
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Dynamic indicators at bottom */}
        <div className="absolute bottom-10 left-6 right-6 hidden md:flex justify-between items-center text-[10px] font-data text-softwhite/40 tracking-widest">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span>STUDIO ONLINE</span>
          </div>
          <span>GEVESTIGD IN LEIDEN</span>
          <span>EST. 2026</span>
        </div>
      </section>

      {/* Waveform Scroll-reveal / Mission Section */}
      <section className="mission-section py-24 md:py-40 bg-bunker/30 border-y border-white/5 relative overflow-hidden">
        {/* Dynamic Waveform SVG */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
          <svg className="w-full h-[200px]" viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              className="waveform-path"
              d="M0 100 C120 100, 120 40, 240 40 C360 40, 360 160, 480 160 C600 160, 600 80, 720 80 C840 80, 840 140, 960 140 C1080 140, 1080 60, 1200 60 C1320 60, 1320 100, 1440 100" 
              stroke="#E57E25" 
              strokeWidth="2"
              strokeDasharray="1000"
              strokeDashoffset="1000"
            />
          </svg>
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <span className="font-data text-xs text-accent tracking-[0.3em] uppercase mb-8 block">ONZE MISSIE</span>
          <h2 className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[9rem] font-black leading-[0.9] text-softwhite/90 flex flex-col items-center tracking-tighter mb-12 md:mb-16">
            {["CREATE", "WITHOUT", "LIMITS"].map((word, i) => (
              <span key={i} className={`mission-word block py-1 sm:py-2 transition-colors duration-300 ${i === 2 ? 'text-accent' : 'text-softwhite'}`}>
                {word}
              </span>
            ))}
          </h2>
          {/* Studio Introduction Text Mockup */}
          <div className="mission-intro-container max-w-2xl mx-auto text-center mt-8 md:mt-12">
            <p className="font-sans text-sm sm:text-base md:text-lg text-softwhite/70 leading-relaxed font-light">
              <span className="text-softwhite font-medium">For-Art Studios</span> is een onafhankelijke creatieve vrijplaats in Leiden, waar artiesten en makers samenkomen om hun muzikale visie werkelijkheid te maken. Wij geloven dat professionele opname, mixing en mastering toegankelijk moeten zijn voor iedereen met passie en talent. Onze studio combineert hoogwaardige gear met een inspirerende sfeer, zodat je ongestoord kunt experimenteren en creëren zonder creatieve drempels. Of je nu als producer een mix wilt perfectioneren of als artiest zoekt naar die absolute, <span className="font-drama italic text-accent font-normal text-lg md:text-xl">radio-ready sound</span>; wij bieden de tools en expertise die je nodig hebt. Bij For-Art creëren we samen de toekomst van muziek – zonder limieten.
            </p>
          </div>
        </div>
      </section>

      {/* Key Focus Sections (Grid) */}
      <section className="py-24 md:py-40 max-w-7xl mx-auto px-6">
        <div className="text-center md:text-left mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <span className="font-data text-xs text-accent tracking-[0.3em] uppercase mb-4 block">WAT WE DOEN</span>
            <h2 className="font-heading text-4xl md:text-6xl font-black tracking-tight">
              AALGLADDE KWALITEIT,<br />
              <span className="font-drama italic text-accent font-normal">ZONDER DE HOOFDPRIJS</span>
            </h2>
          </div>
          <p className="font-sans text-sm text-softwhite/50 max-w-md leading-relaxed">
            Wij geloven dat talent een podium verdient en geen financiële barrière. Onze studio in Leiden is ingericht om jouw sound naar een professioneel niveau te tillen.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Opname */}
          <div className="feature-card group rounded-[2rem] border border-white/5 bg-bunker/30 p-8 hover:border-accent/30 transition-all duration-500 flex flex-col justify-between h-96 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-accent mb-8 bg-primary">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4">Opname & Productie</h3>
              <p className="font-sans text-sm text-softwhite/60 leading-relaxed">
                Neem je vocalen en instrumenten op met hoogwaardige gear. Kies voor volledige dry-hire of laat je begeleiden door een professionele producer & engineer.
              </p>
            </div>
            <div className="relative z-10 flex justify-between items-center border-t border-white/5 pt-6 font-data text-xs">
              <span className="text-softwhite/40">VANAF €30,- / UUR</span>
              <Link to="/services" className="text-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Bekijk tarieven <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Mixing & Mastering */}
          <div className="feature-card group rounded-[2rem] border border-white/5 bg-bunker/30 p-8 hover:border-accent/30 transition-all duration-500 flex flex-col justify-between h-96 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-accent mb-8 bg-primary">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4">Mix & Mastering</h3>
              <p className="font-sans text-sm text-softwhite/60 leading-relaxed">
                Breng je tracks tot leven met een gebalanceerde en luidruchtige mix. Yinka gebruikt zijn jarenlange ervaring om jouw artistieke visie te vertalen naar een radio-ready product.
              </p>
            </div>
            <div className="relative z-10 flex justify-between items-center border-t border-white/5 pt-6 font-data text-xs">
              <span className="text-softwhite/40">BASIC MIX VANAF €100,-</span>
              <Link to="/services" className="text-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Bekijk tarieven <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* DJ Sets & Oefenen */}
          <div className="feature-card group rounded-[2rem] border border-white/5 bg-bunker/30 p-8 hover:border-accent/30 transition-all duration-500 flex flex-col justify-between h-96 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-accent mb-8 bg-primary">
                <Disc className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4">DJ Studio & Oefenen</h3>
              <p className="font-sans text-sm text-softwhite/60 leading-relaxed">
                Maak gebruik van onze professionele draaitafels. Perfect voor het opnemen van livesets, promotie-materiaal of simpelweg om ongestoord te trainen op professionele DJ-gear.
              </p>
            </div>
            <div className="relative z-10 flex justify-between items-center border-t border-white/5 pt-6 font-data text-xs">
              <span className="text-softwhite/40">PIONEER DDJ CONTROLLER</span>
              <Link to="/studio" className="text-accent flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Bekijk gear <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section - Wat er al gemaakt is */}
      <section 
        ref={horizontalSectionRef}
        className="relative w-full min-h-screen md:h-screen md:overflow-hidden bg-bunker flex flex-col justify-center items-start border-t border-accent py-16 md:py-0 md:pt-28"
      >
        {/* Background Image with blur and dark overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="/images/studio_showcase_bg.jpg" 
            alt="Studio showcase background" 
            decoding="async"
            loading="lazy"
            className="w-full h-full object-cover blur-[2px] scale-105"
          />
          <div className="absolute inset-0 bg-bunker/65" />
        </div>

        {/* Center Title - Fixed at top */}
        <div className="w-full text-center z-10 pointer-events-none mb-8 md:mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-wider text-softwhite uppercase">
            FOR ART RELEASES
          </h2>
        </div>

        {/* Horizontal scroll container */}
        <div 
          ref={scrollContainerRef}
          className="flex items-center gap-8 md:gap-12 px-6 md:px-[20vw] flex-nowrap w-max select-none overflow-x-auto md:overflow-x-visible snap-x md:snap-none no-scrollbar relative z-10 py-6 will-change-transform transform-gpu"
        >
          {/* Track Cards */}
          {tracks.map((track) => {
            const isActive = currentTrack && currentTrack.id === track.id;
            const isTrackPlaying = isActive && isPlaying;

            return (
              <div 
                key={track.id}
                className="flex-shrink-0 w-[280px] sm:w-[350px] md:w-[400px] group transition-all duration-500 relative snap-center will-change-transform transform-gpu"
              >
                {/* Album Cover Wrapper - Sharp Corners (rounded-none) */}
                <div className="relative aspect-square w-full rounded-none overflow-hidden mb-4 bg-bunker/50 shadow-2xl border border-white/5">
                  <img 
                    src={track.cover} 
                    alt={`${track.title} cover`} 
                    decoding="async"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle darkening overlay on hover */}
                  <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

                  {/* Play/Pause Button Overlay - Bottom Right corner */}
                  <div className={`absolute bottom-4 right-4 z-10 transition-all duration-300 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100'}`}>
                    <button 
                      onClick={() => handlePlayPause(track)}
                      className="w-12 h-12 rounded-none bg-bunker/90 border border-accent text-accent flex items-center justify-center hover:bg-accent hover:text-bunker active:scale-95 transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
                    >
                      {isTrackPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current translate-x-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Miniature Bouncing EQ Visualizer Overlay when playing */}
                  {isTrackPlaying && (
                    <div className="absolute bottom-4 left-4 bg-bunker/80 backdrop-blur-md px-3 py-2 rounded-full border border-white/10 flex items-end gap-1 z-10 h-7">
                      <span className="w-1 bg-accent rounded-full eq-bar-1 block" style={{ height: '25%' }}></span>
                      <span className="w-1 bg-accent rounded-full eq-bar-2 block" style={{ height: '25%' }}></span>
                      <span className="w-1 bg-accent rounded-full eq-bar-3 block" style={{ height: '25%' }}></span>
                    </div>
                  )}
                </div>

                {/* Text details - Uppercase bold format directly below */}
                <div className="flex flex-col gap-1 text-left px-1">
                  <h3 className="font-sans text-xs sm:text-sm font-bold tracking-widest text-softwhite group-hover:text-accent transition-colors duration-300 uppercase truncate">
                    {track.title} - {track.artist}
                  </h3>
                  <span className="font-data text-[9px] text-softwhite/50 tracking-wider uppercase">
                    {track.service} • {track.genre}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Call to Action Card - Claim Your Slot */}
          <Link 
            to="/contact"
            className="flex-shrink-0 w-[280px] sm:w-[350px] md:w-[400px] group transition-all duration-500 relative flex flex-col text-left snap-center will-change-transform transform-gpu"
          >
            {/* Box Wrapper - Matches album cover dimensions */}
            <div className="relative aspect-square w-full rounded-none overflow-hidden mb-4 border border-dashed border-accent/40 bg-accent/[0.02] backdrop-blur-sm flex flex-col justify-between p-8 hover:border-accent hover:bg-accent/[0.06] transition-all duration-500 shadow-2xl">
              
              {/* Decorative Tech Corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent/30 group-hover:border-accent transition-colors duration-300" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent/30 group-hover:border-accent transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent/30 group-hover:border-accent transition-colors duration-300" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent/30 group-hover:border-accent transition-colors duration-300" />
              
              {/* Dynamic light glow in background */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/[0.02] to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              {/* Top info */}
              <div className="relative z-10 flex justify-between items-start">
                <span className="font-data text-[9px] text-accent tracking-[0.2em] uppercase font-bold">
                  RELEASE 05
                </span>
                <span className="font-data text-[9px] text-softwhite/40 tracking-[0.2em] uppercase">
                  RESERVED_
                </span>
              </div>

              {/* Middle Content - Creative call to action */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto py-6">
                <div className="w-16 h-16 rounded-none border border-accent/30 flex items-center justify-center text-accent mb-6 bg-bunker group-hover:border-accent group-hover:scale-105 transition-all duration-500 relative">
                  <span className="absolute text-2xl font-light font-sans group-hover:scale-110 transition-transform duration-300">+</span>
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-black text-softwhite tracking-tight uppercase mb-3">
                  JOUW SOUND HIER?
                </h3>
                <p className="font-sans text-xs text-softwhite/60 max-w-[240px] leading-relaxed">
                  Wil je jouw track of mix hier ook tussen horen schitteren? Claim jouw plek in de studio.
                </p>
              </div>

              {/* Bottom bar */}
              <div className="relative z-10 flex justify-between items-center border-t border-white/5 pt-4">
                <span className="font-heading text-[10px] font-bold text-accent tracking-widest uppercase group-hover:text-softwhite transition-colors duration-300">
                  BOEK EEN SESSIE
                </span>
                <div className="w-8 h-8 rounded-none border border-accent/30 text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-bunker group-hover:border-accent transition-all duration-300">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Fake metadata below to match other cards */}
            <div className="flex flex-col gap-1 text-left px-1">
              <h3 className="font-sans text-xs sm:text-sm font-bold tracking-widest text-softwhite group-hover:text-accent transition-colors duration-300 uppercase truncate">
                Jouw Project - Volgende Hit
              </h3>
              <span className="font-data text-[9px] text-softwhite/50 tracking-wider uppercase">
                Productie • Mix • Master • dry-hire
              </span>
            </div>
          </Link>

          {/* Spacer to allow the CTA card to scroll fully into view on mobile */}
          <div className="flex-shrink-0 w-[10vw] md:w-0 h-1" />
        </div>

        {/* Global Floating Player Bar */}
        {currentTrack && (
          <div className={`fixed left-6 right-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-full md:max-w-2xl bg-bunker/98 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-6 shadow-[0_15px_40px_rgba(0,0,0,0.5)] z-50 transition-all duration-500 cubic-bezier(0.25, 0.8, 0.25, 1) ${playerVisible ? 'bottom-6 opacity-100 pointer-events-auto' : '-bottom-32 opacity-0 pointer-events-none'}`}>
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-bunker">
                <img src={currentTrack.cover} alt="Active track cover" decoding="async" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h4 className="font-heading text-[10px] sm:text-xs font-black text-softwhite uppercase truncate tracking-wider">
                  {currentTrack.title}
                </h4>
                <p className="font-sans text-[10px] text-softwhite/50 truncate font-light mt-0.5">
                  {currentTrack.artist} • <span className="text-accent">{currentTrack.service}</span>
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <button 
                onClick={() => handlePlayPause(currentTrack)}
                className="w-10 h-10 rounded-full bg-accent text-bunker flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-0.5" />}
              </button>

              {/* Progress Slider */}
              <div className="hidden sm:flex items-center gap-2 w-32 md:w-48">
                <span className="font-data text-[9px] text-softwhite/40">{formatTime(audioRef.current?.currentTime || 0)}</span>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={progress}
                  onChange={handleSeek}
                  className="w-full accent-accent h-1 bg-white/10 rounded-lg cursor-pointer range-sm"
                />
                <span className="font-data text-[9px] text-softwhite/40">{formatTime(duration)}</span>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
                  className="text-softwhite/60 hover:text-softwhite transition-colors"
                >
                  {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-12 md:w-16 accent-accent h-1 bg-white/10 rounded-lg cursor-pointer range-sm"
                />
              </div>

              {/* Close Button */}
              <button 
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  setIsPlaying(false);
                  setCurrentTrack(null);
                }}
                className="text-softwhite/40 hover:text-softwhite transition-colors pl-2 border-l border-white/10 font-data text-xs"
              >
                SLUIT
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Cinematic Showcase Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden border-y border-white/5 bg-bunker/40">
        <img 
          src="/images/02DAE091-F57F-4C97-BF26-A6E5307D45AE.jpeg" 
          alt="Studio gear" 
          decoding="async"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bunker via-bunker/30 to-bunker" />
        
        <div className="relative z-10 max-w-4xl text-center px-6 text-white">
          <span className="font-data text-xs text-accent tracking-[0.3em] uppercase mb-4 block">RUIMTE VOOR CO-CREATIE</span>
          <h2 className="font-heading text-3xl md:text-5xl font-black mb-6">
            KLAAR OM JE PRODUCTIE<br />
            <span className="font-drama italic text-accent font-normal">NAAR HET VOLGENDE NIVEAU</span> TE TILLEN?
          </h2>
          <p className="font-sans text-sm text-white/70 max-w-md mx-auto mb-8 leading-relaxed">
            Boek vandaag nog je sessie in onze studio in Leiden en werk samen met ervaren engineers aan jouw sound.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 rounded-full bg-accent text-bunker font-heading text-sm font-black tracking-widest uppercase hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(229,126,37,0.3)] hover:scale-105 active:scale-95"
          >
            Reserveer Direct
          </Link>
        </div>
      </section>
    </div>
  );
}
