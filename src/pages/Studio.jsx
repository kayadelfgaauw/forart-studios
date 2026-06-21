import React, { useState, useEffect, useRef } from 'react';
import { Sliders, Volume2, HardDrive, Cpu, Radio, Disc, Mic, Square } from 'lucide-react';
import gsap from 'gsap';

export default function Studio() {
  const [activeUnit, setActiveUnit] = useState(0);
  const [gainValue, setGainValue] = useState(65);
  const [leds, setLeds] = useState(Array(15).fill(false));
  const containerRef = useRef(null);

  // Simulate LED meters reacting to gain value and noise
  useEffect(() => {
    const calculateLeds = () => {
      const activeCount = Math.round((gainValue / 100) * 15);
      // Add a tiny bit of random jitter to make it feel alive
      const jitter = Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0;
      const finalCount = Math.max(0, Math.min(15, activeCount + jitter));
      
      setLeds(Array(15).fill(false).map((_, i) => i < finalCount));
    };

    const interval = setInterval(calculateLeds, 100);
    return () => clearInterval(interval);
  }, [gainValue]);

  // Entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.rack-unit',
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
      );
      gsap.fromTo('.studio-intro',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const gearList = [
    {
      id: 0,
      name: "Audio-Technica AT2020",
      category: "Opname & Microfoons",
      type: "Cardioïde Condensatormicrofoon",
      specs: [
        "Cardioïde richtingskarakteristiek voor uitstekende isolatie",
        "Ideaal voor vocalen, voice-overs en akoestische instrumenten",
        "Brede frequentierespons en superieure transiënte respons"
      ],
      icon: Mic,
      val: "98 dB"
    },
    {
      id: 1,
      name: "Focusrite Audio Interface",
      category: "Conversie & Interfaces",
      type: "High-Fidelity Audio Interface",
      specs: [
        "Hoogwaardige 24-bit/192kHz AD-DA converters",
        "Ultra-low latency voor perfecte timing",
        "Kristalheldere voorversterkers met Air-modus"
      ],
      icon: Cpu,
      val: "192 kHz"
    },
    {
      id: 2,
      name: "KRK ROKIT RP5 G4",
      category: "Monitoring & Speakers",
      type: "Actieve Studio Monitoren",
      specs: [
        "Professionele DSP-gestuurde grafische EQ",
        "Kevlar® drivers voor minimale vervorming",
        "Nauwkeurige geluidsweergave over het hele spectrum"
      ],
      icon: Volume2,
      val: "+4 dBu"
    },
    {
      id: 3,
      name: "Pioneer DDJ-400",
      category: "DJ Controller & Performance",
      type: "2-kanaals DJ Controller",
      specs: [
        "Club-style lay-out voor dj set opnames en oefensessies",
        "Ingebouwde geluidskaart met microfooningang",
        "Naadloze integratie met professionele DJ software"
      ],
      icon: Disc,
      val: "Rekordbox"
    },
    {
      id: 4,
      name: "FL Studio DAW Suite",
      category: "Software & Sequencing",
      type: "Producer Software Suite",
      specs: [
        "Professionele sequencer en piano-roll",
        "Uitgebreide ondersteuning voor VST/AU plugins",
        "State-of-the-art mixing engine en mastering effecten"
      ],
      icon: HardDrive,
      val: "v21.2"
    }
  ];

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
      {/* Intro */}
      <div className="studio-intro text-center max-w-3xl mx-auto mb-16 md:mb-24">
        <span className="font-heading text-xs text-accent tracking-wider uppercase mb-4 block font-bold">De Specs</span>
        <h1 className="font-heading text-4xl md:text-7xl font-black mb-6 tracking-tight uppercase">
          DE STUDIO <span className="font-drama italic text-accent font-normal lowercase">&</span> GEAR
        </h1>
        <p className="font-sans text-base md:text-lg text-softwhite/75 leading-relaxed">
          Onze fysieke studio in Leiden combineert een rauwe, industriële bunker-sfeer met zorgvuldig geselecteerde, professionele apparatuur. Ontworpen voor een efficiënte en hoogwaardige creatieve workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: The Virtual Rack Mount */}
        <div className="lg:col-span-7 space-y-6">


          <div className="border border-white/10 bg-bunker rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
            {/* Wooden side panels effect */}
            <div className="absolute top-0 bottom-0 left-0 w-3 bg-[#3d2417] border-r border-black/50 rounded-l-[2rem] hidden md:block" />
            <div className="absolute top-0 bottom-0 right-0 w-3 bg-[#3d2417] border-l border-black/50 rounded-r-[2rem] hidden md:block" />

            <div className="md:px-4 space-y-4">
              {gearList.map((unit) => {
                const IconComponent = unit.icon;
                const isActive = activeUnit === unit.id;
                return (
                  <div
                    key={unit.id}
                    onClick={() => setActiveUnit(unit.id)}
                    className={`rack-unit group relative cursor-pointer border ${
                      isActive
                        ? 'border-accent/40 bg-primary/10 shadow-[0_0_20px_rgba(229,126,37,0.15)]'
                        : 'border-black/5 bg-primary/5 hover:border-primary/10'
                    } rounded-2xl p-5 md:p-6 transition-all duration-300 flex items-center justify-between overflow-hidden`}
                  >
                    {/* Mounting screws */}
                    <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-white/20 border border-black/40" />
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-white/20 border border-black/40" />
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white/20 border border-black/40" />
                    <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-white/20 border border-black/40" />

                    <div className="flex items-center gap-4 relative z-10 pl-2">
                      <div className={`p-3 rounded-xl border ${isActive ? 'border-accent/30 text-accent' : 'border-white/10 text-softwhite/50'} bg-bunker`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-sans text-[10px] text-accent tracking-wider block uppercase mb-0.5 font-bold">
                          {unit.category}
                        </span>
                        <h3 className="font-heading text-base md:text-lg font-black tracking-tight">
                          {unit.name}
                        </h3>
                      </div>
                    </div>

                    {/* Led indicator on right */}
                    <div className="flex items-center gap-4 relative z-10 pr-2">
                       <span className="font-sans text-[11px] text-softwhite/40 hidden md:block">{unit.val}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-accent shadow-[0_0_10px_#E57E25]' : 'bg-primary/10'}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: The Interactive Control Panel & Specs */}
        <div className="lg:col-span-5 space-y-8">
          {/* Active Unit Specs */}
          <div className="border border-white/5 bg-bunker/30 rounded-[2.5rem] p-8 relative overflow-hidden flex flex-col justify-between min-h-[380px]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-[60px] pointer-events-none transform-gpu will-change-transform" />

            <div>
               <span className="font-heading text-xs text-accent tracking-wider uppercase block mb-4 font-bold">
                Gear Specificaties
              </span>
              <h2 className="font-heading text-2xl md:text-3xl font-black mb-1">
                {gearList[activeUnit].name}
              </h2>
              <p className="font-sans text-xs text-softwhite/50 mb-8 font-semibold">
                {gearList[activeUnit].type}
              </p>

              <ul className="space-y-4">
                {gearList[activeUnit].specs.map((spec, i) => (
                  <li key={i} className="flex items-start gap-3 font-sans text-sm text-softwhite/75 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>


          </div>

          {/* Interactive Digital Instrument / Signal Mixer */}
          <div className="border border-white/5 bg-bunker/30 rounded-[2.5rem] p-8 relative overflow-hidden">
             <span className="font-heading text-xs text-accent tracking-wider uppercase block mb-6 font-bold">
              Signaal Niveau
            </span>

            <div className="space-y-8">
              {/* Gain dial/slider */}
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-xs font-sans">
                  <span className="text-softwhite/60 font-semibold">Gain</span>
                  <span className="text-accent font-bold">{gainValue} dB</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={gainValue}
                  onChange={(e) => setGainValue(parseInt(e.target.value))}
                  className="w-full h-1 bg-primary rounded-lg appearance-none cursor-pointer accent-accent"
                />
              </div>

              {/* LED signal bar */}
              <div className="space-y-2">
                 <span className="font-sans text-[10px] text-softwhite/40 block font-semibold">Signaal niveau</span>
                <div className="flex gap-1 h-5 items-center justify-between bg-bunker border border-white/5 p-1 rounded-md">
                  {leds.map((active, i) => {
                    // Color transitions: 0-9 green/cyan (accent), 10-12 orange, 13-14 red (signal peak)
                    let activeColor = 'bg-accent';
                    if (i >= 12) activeColor = 'bg-red-500 shadow-[0_0_8px_#ef4444]';
                    else if (i >= 9) activeColor = 'bg-accent shadow-[0_0_8px_#E57E25]';
                    else if (active) activeColor = 'bg-accent shadow-[0_0_8px_#E57E25]';

                    return (
                      <div
                        key={i}
                        className={`flex-1 h-full rounded-[1px] transition-all duration-100 ${
                          active ? activeColor : 'bg-primary/10'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>

      {/* Additional Studio Info Section */}
      <div className="mt-20 md:mt-32 rounded-[2.5rem] border border-white/5 bg-bunker/10 p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-heading text-2xl md:text-3xl font-black mb-4">
              AKOESTIEK & LOUNGE VIBE
            </h3>
            <p className="font-sans text-sm text-softwhite/60 leading-relaxed mb-6">
              Muziek maken vereist focus en een sfeer die inspireert. Onze studio is daarom uitgerust met een zorgvuldig berekende akoestische behandeling (absorptie- en diffusiepanelen) voor een eerlijke geluidsweergave. 
            </p>
            <p className="font-sans text-sm text-softwhite/60 leading-relaxed">
              Tussen de opnames door kun je relaxen in onze comfortabele zithoek. Er is altijd koffie, thee en een studiomanager aanwezig om de vibe te bewaken en je creatieve flow te ondersteunen.
            </p>
          </div>
          <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-white/10">
            <img 
              src="/images/WhatsApp Image 2026-06-10 at 15.59.30.jpeg" 
              alt="Studio lounge and monitoring" 
              decoding="async"
              loading="lazy"
              className="w-full h-full object-cover grayscale brightness-90 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bunker/80 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
