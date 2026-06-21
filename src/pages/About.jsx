import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Disc, SkipBack, Volume2, Music, CheckCircle } from 'lucide-react';
import gsap from 'gsap';

// A static waveform shape to display when the track is idle
const IDLE_WAVE = [12, 18, 14, 22, 28, 20, 16, 24, 18, 12, 22, 14, 18, 10, 16, 20, 24, 18, 14, 22, 16, 12, 18, 14, 20, 16, 10, 14, 8, 12];

export default function About() {
  const containerRef = useRef(null);
  const waveformInterval = useRef(null);

  // Player state: tracks which member's playlist is active, and which index is playing
  const [activeMemberId, setActiveMemberId] = useState(null);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [waveformBars, setWaveformBars] = useState(IDLE_WAVE);

  const team = [
    {
      id: 0,
      name: "Yinka Whenu",
      tag: "Prod. yinka",
      role: "Muziekproducent, Mix & Master Engineer & Studio Beheer",
      image: "/images/Yinka.jpeg",
      bio: [
        "Yinka beschikt over zes jaar ervaring in muziekproductie, mixing en mastering. In deze periode heeft hij een breed netwerk opgebouwd van lokale en internationale artiesten, videomakers en producers."
      ],
      skills: [
        "Creatieve Begeleiding",
        "Technische Audioproductie",
        "Studio Beheer & Zakelijke Ontwikkeling",
        "Klantbegeleiding tijdens sessies"
      ],
      tracks: [
        { title: "Warm Synth Vibe", bpm: "135 BPM", genre: "Synth Trap", duration: 92, durationStr: "01:32" },
        { title: "Midnight Chill House", bpm: "120 BPM", genre: "Lo-Fi House", duration: 85, durationStr: "01:25" },
        { title: "Golden Hour Beat", bpm: "95 BPM", genre: "Boom Bap", duration: 110, durationStr: "01:50" },
        { title: "808 Eclipse", bpm: "140 BPM", genre: "Dark Trap", duration: 78, durationStr: "01:18" }
      ]
    },
    {
      id: 1,
      name: "Tim de Kok",
      tag: "Co-Founder & Producer",
      role: "Audio Engineer & Creatief Begeleider",
      image: "/images/Tim.jpeg",
      bio: [
        "Tim de Kok richt zich binnen For Art Studios op het vormgeven van de creatieve visie van opkomende artiesten. Zijn kracht ligt in melodische opbouw en arrangementen die aansluiten bij de urban sound."
      ],
      skills: [
        "Melodische Beat-productie",
        "Vocal Editing & Tuning",
        "Arrangement & Structuur Begeleiding",
        "Urban & Contemporary Styling"
      ],
      tracks: [
        { title: "Late Night Drive", bpm: "98 BPM", genre: "Melodic Trap", duration: 90, durationStr: "01:30" },
        { title: "Neon Lights Sunset", bpm: "110 BPM", genre: "Modern R&B", duration: 105, durationStr: "01:45" },
        { title: "Vocal Afro Sunset", bpm: "105 BPM", genre: "Afrobeat", duration: 95, durationStr: "01:35" },
        { title: "Future Cloud Nine", bpm: "128 BPM", genre: "Future Bass", duration: 88, durationStr: "01:28" }
      ]
    },
    {
      id: 2,
      name: "Johann",
      tag: "Studio Partner & Engineer",
      role: "Producer, Recording Engineer, Muzikant & Partner",
      image: "/images/Johan.jpeg",
      bio: [
        "Hi, ik ben Johann, producer, recording engineer, muzikant en partner van ForArt Studio. Muziek speelt al een grote rol in mijn leven sinds ik op mijn veertiende begon met spelen in bands en het schrijven van eigen materiaal. Tegenwoordig ben ik actief als muzikant in verschillende projecten, waaronder mijn stonerrockband Pickpocketer en live-optredens en opnames met Siris Anish als onderdeel van The Excepted.",
        "Met FORART Studio help ik artiesten hun ideeën om te zetten naar professionele opnames, van compositie en pre-productie tot opname, productie en mixing. Mijn specialiteit ligt in het vastleggen van authentieke live performances en het creëren van producties die recht doen aan de artiest en zijn of haar sound.",
        "Hoewel ik mij thuis voel in veel verschillende genres, ligt mijn passie vooral bij hip hop, akoestische muziek, rock, metal, country en bluegrass."
      ],
      skills: [
        "Recording & Live Tracking",
        "Music Production & Composition",
        "Mixing & Pre-production",
        "Genre-overschrijdende expertise (Rock, Hip Hop, Metal, Country, Bluegrass)"
      ],
      tracks: [
        { title: "Stoner Rock Live Session", bpm: "112 BPM", genre: "Stoner Rock", duration: 120, durationStr: "02:00" },
        { title: "Siris Anish - The Excepted", bpm: "120 BPM", genre: "Progressive Rock", duration: 110, durationStr: "01:50" },
        { title: "Bunker Bass Jam Session", bpm: "130 BPM", genre: "Metalcore", duration: 95, durationStr: "01:35" },
        { title: "Acoustic Bluegrass Breeze", bpm: "90 BPM", genre: "Bluegrass", duration: 80, durationStr: "01:20" }
      ]
    }
  ];

  // Handle play/pause toggle for a specific track
  const handlePlayToggle = (memberId, trackIndex = 0) => {
    if (activeMemberId === memberId) {
      if (activeTrackIndex === trackIndex) {
        setIsPlaying(!isPlaying);
      } else {
        setActiveTrackIndex(trackIndex);
        setCurrentTime(0);
        setIsPlaying(true);
      }
    } else {
      setActiveMemberId(memberId);
      setActiveTrackIndex(trackIndex);
      setCurrentTime(0);
      setIsPlaying(true);
    }
  };

  // Handle track reset
  const handleTrackReset = (memberId) => {
    if (activeMemberId === memberId) {
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  // Simulate audio player ticks
  useEffect(() => {
    let timer;
    if (isPlaying && activeMemberId !== null) {
      const activeMember = team.find(m => m.id === activeMemberId);
      const activeTrack = activeMember?.tracks[activeTrackIndex];
      const maxDuration = activeTrack ? activeTrack.duration : 90;

      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= maxDuration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeMemberId, activeTrackIndex]);

  // Animate waveform bars when playing
  useEffect(() => {
    if (isPlaying) {
      waveformInterval.current = setInterval(() => {
        setWaveformBars(
          Array(30).fill(0).map(() => Math.floor(Math.random() * 32) + 6)
        );
      }, 120);
    } else {
      clearInterval(waveformInterval.current);
      setWaveformBars(IDLE_WAVE);
    }
    return () => clearInterval(waveformInterval.current);
  }, [isPlaying]);

  // GSAP entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo('.about-header',
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );

      // Staggered rows entrance animation
      const rows = document.querySelectorAll('.team-member-row');
      rows.forEach((row, rowIndex) => {
        const imgContainer = row.querySelector('.team-member-img-container');
        const imgInner = row.querySelector('.team-member-img-inner');
        const contentContainer = row.querySelector('.team-member-content');

        // Check if image is placed on the right (order-last)
        const isImageLast = imgContainer.classList.contains('lg:order-last');
        const imageXOffset = isImageLast ? 40 : -40;

        // Animate image on mount (staggered by row index)
        gsap.fromTo(imgInner,
          { opacity: 0, x: imageXOffset, scale: 0.95 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 1.2,
            delay: 0.2 + rowIndex * 0.15,
            ease: "power3.out"
          }
        );

        // Animate content block on mount (staggered by row index)
        gsap.fromTo(contentContainer,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            delay: 0.3 + rowIndex * 0.15,
            ease: "power3.out"
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-6 py-12 md:py-24 relative z-10">
      {/* Page Header */}
      <div className="about-header text-center max-w-3xl mx-auto mb-16 md:mb-28">
        <span className="font-heading text-xs text-accent tracking-wider uppercase mb-4 block font-bold">Het Creatieve Team</span>
        <h1 className="font-heading text-4xl md:text-7xl font-black mb-6 tracking-tight uppercase">
          WIE WE ZIJN <span className="font-drama italic text-accent font-normal lowercase">&</span> EXPERTISE
        </h1>
        <p className="font-sans text-base md:text-lg text-softwhite/75 leading-relaxed">
          ForArt Studio is een onafhankelijke hub in Leiden waar we artiesten helpen hun ideeën om te zetten naar professionele producties. Geen barrières, pure focus op jouw sound.
        </p>
      </div>

      {/* Team Rows Container */}
      <div className="space-y-24 md:space-y-36">
        {team.map((member, index) => {
          const isCurrentMemberActive = activeMemberId === member.id;
          const currentTrackIdx = isCurrentMemberActive ? activeTrackIndex : 0;
          const currentTrack = member.tracks[currentTrackIdx];
          const isTrackPlaying = isCurrentMemberActive && isPlaying;
          
          const progressPercent = isCurrentMemberActive ? (currentTime / currentTrack.duration) : 0;
          const activeBarsCount = Math.floor(progressPercent * 30);

          return (
            <div
              key={member.id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start py-12 border-b border-white/5 last:border-b-0 team-member-row"
            >
              {/* Image Column */}
              <div 
                className={`lg:col-span-5 flex justify-center team-member-img-container lg:sticky lg:top-28 ${
                  index % 2 === 1 ? 'lg:order-last' : ''
                }`}
              >
                <div className="relative group w-full max-w-[420px] aspect-[4/5] team-member-img-inner">
                  {/* Decorative Offset Frame */}
                  <div className="absolute -inset-3 border border-accent/20 rounded-[2.5rem] -z-10 group-hover:scale-[1.02] group-hover:border-accent/40 transition-all duration-500" />
                  
                  {/* Portrait Card */}
                  <div className="w-full h-full rounded-[2.5rem] overflow-hidden border border-white/10 bg-bunker relative z-10 shadow-2xl">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      decoding="async"
                      loading="lazy"
                      className="w-full h-full object-cover grayscale contrast-[1.05] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                    {/* Shadow Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-bunker/90 via-bunker/20 to-transparent opacity-75 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none" />
                    
                    {/* Technical Tag on Portrait */}
                    <div className="absolute bottom-6 left-6 font-sans text-[10px] text-softwhite/90 bg-bunker/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2 font-semibold">
                      <span className={`w-1.5 h-1.5 rounded-full bg-accent ${isTrackPlaying ? 'animate-ping' : 'animate-pulse'}`} />
                      <span>{member.tag}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Column */}
              <div className="lg:col-span-7 space-y-6 team-member-content">


                {/* Name & Short Tag */}
                <div className="space-y-1">
                  <h2 className="font-heading text-3xl md:text-5xl font-black text-softwhite flex flex-wrap items-baseline gap-x-3 uppercase leading-tight">
                    {member.name}
                    <span className="font-drama italic text-xl md:text-2xl text-accent font-normal lowercase tracking-normal">
                      ({member.tag})
                    </span>
                  </h2>
                  <p className="font-sans text-xs text-softwhite/50 uppercase tracking-wider font-semibold">
                    {member.role}
                  </p>
                </div>

                {/* Bio Paragraphs */}
                <div className="space-y-4 font-sans text-sm md:text-base text-softwhite/80 leading-relaxed max-w-xl">
                  {member.bio.map((paragraph, pIdx) => (
                    <p key={pIdx}>{paragraph}</p>
                  ))}
                </div>

                {/* Specialties / Skills */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-heading text-xs font-bold text-accent uppercase tracking-wider">
                    Specialisaties
                  </h4>
                  <div className="flex flex-wrap gap-2 max-w-xl">
                    {member.skills.map((skill, sIdx) => (
                      <span 
                        key={sIdx}
                        className="px-3.5 py-1.5 rounded-full border border-white/5 bg-white/[0.02] text-xs font-sans text-softwhite/70 hover:border-accent/35 hover:text-softwhite transition-colors duration-300 flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-accent/50" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Spotify-style Integrated Waveform Beat Player */}
                <div className="border border-white/5 bg-white/[0.01] rounded-3xl p-6 md:p-8 space-y-6 max-w-xl shadow-2xl relative overflow-hidden mt-8">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[40px] pointer-events-none transform-gpu will-change-transform" />

                  {/* Player header: active track info */}
                  <div className="flex justify-between items-center relative z-10 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <Disc className={`w-5 h-5 text-accent ${isTrackPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                      <div>
                        <span className="font-sans text-[10px] text-accent font-semibold block uppercase tracking-wider">Demo track</span>
                        <h4 className="font-sans text-sm font-bold text-softwhite leading-tight truncate max-w-[220px] md:max-w-[280px]">
                          {currentTrack.title}
                        </h4>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-sans text-[10px] text-softwhite/40 block">
                        {currentTrack.genre} • {currentTrack.bpm}
                      </span>
                      <span className="font-sans text-xs text-accent font-semibold">
                        {isCurrentMemberActive ? formatTime(currentTime) : "00:00"} / {currentTrack.durationStr}
                      </span>
                    </div>
                  </div>

                  {/* Waveform Visualizer */}
                  <div className="flex items-end justify-between h-10 px-1 relative z-10">
                    {waveformBars.map((height, barIdx) => {
                      // Color active bars orange if this is the active playing track
                      const isBarActive = isCurrentMemberActive && barIdx <= activeBarsCount;
                      return (
                        <div
                          key={barIdx}
                          className="flex-1 mx-[1px] rounded-t-sm transition-all duration-100"
                          style={{
                            height: `${height}px`,
                            backgroundColor: isBarActive ? '#E57E25' : 'rgba(232, 228, 221, 0.12)'
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Top Controls */}
                  <div className="flex items-center gap-4 relative z-10">
                    <button
                      onClick={() => handlePlayToggle(member.id, currentTrackIdx)}
                      className="px-5 py-2.5 rounded-full bg-accent text-bunker font-heading text-[10px] font-black tracking-widest uppercase hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_15px_rgba(229,126,37,0.15)] flex items-center gap-1.5"
                    >
                      {isTrackPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-bunker" />
                          <span>PAUZE</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-bunker ml-0.5" />
                          <span>SPEEL IN</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleTrackReset(member.id)}
                      disabled={!isCurrentMemberActive}
                      className={`p-2.5 rounded-full border transition-all duration-300 ${
                        isCurrentMemberActive 
                          ? 'border-white/10 text-softwhite hover:border-accent hover:text-accent cursor-pointer' 
                          : 'border-white/5 text-softwhite/20 cursor-not-allowed'
                      }`}
                    >
                      <SkipBack className="w-3.5 h-3.5" />
                    </button>


                  </div>

                  {/* Tracklist - Spotify Style */}
                  <div className="space-y-1 relative z-10 pt-2 border-t border-white/5">
                    <span className="font-sans text-xs font-semibold text-softwhite/50 block mb-2">Demo Samples</span>
                    
                    <div className="space-y-1">
                      {member.tracks.map((track, trackIdx) => {
                        const isThisTrackActive = isCurrentMemberActive && activeTrackIndex === trackIdx;
                        const isThisTrackPlaying = isThisTrackActive && isPlaying;
                        
                        return (
                          <div
                            key={trackIdx}
                            onClick={() => handlePlayToggle(member.id, trackIdx)}
                            className={`group/row flex items-center justify-between py-2 px-3 rounded-xl cursor-pointer transition-all duration-300 border ${
                              isThisTrackActive 
                                ? 'bg-accent/10 border-accent/25 text-softwhite' 
                                : 'border-transparent hover:bg-white/[0.03] text-softwhite/60 hover:text-softwhite'
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              {/* Track Indicator: Number, Play Icon on Hover, or Bouncing EQ when playing */}
                              <div className="w-5 h-5 flex items-center justify-center font-sans text-xs text-softwhite/40 font-semibold">
                                {isThisTrackPlaying ? (
                                  <span className="flex items-end gap-0.5 h-3 w-3">
                                    <span className="w-[2px] bg-accent eq-bar-1 h-full" />
                                    <span className="w-[2px] bg-accent eq-bar-2 h-2/3" />
                                    <span className="w-[2px] bg-accent eq-bar-3 h-full" />
                                  </span>
                                ) : isThisTrackActive ? (
                                  <Play className="w-3 h-3 text-accent fill-accent" />
                                ) : (
                                  <>
                                    <span className="group-hover/row:hidden">{`0${trackIdx + 1}`}</span>
                                    <Play className="w-3 h-3 hidden group-hover/row:block text-softwhite/80" />
                                  </>
                                )}
                              </div>

                              {/* Title & Stats */}
                              <div className="min-w-0">
                                <span className={`font-sans text-xs md:text-sm font-semibold block truncate transition-colors duration-300 ${
                                  isThisTrackActive ? 'text-accent' : ''
                                }`}>
                                  {track.title}
                                </span>
                                <span className="font-sans text-[10px] text-softwhite/45">
                                  {track.genre} • {track.bpm}
                                </span>
                              </div>
                            </div>

                            {/* Duration */}
                            <span className="font-sans text-xs text-softwhite/40">
                              {track.durationStr}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
