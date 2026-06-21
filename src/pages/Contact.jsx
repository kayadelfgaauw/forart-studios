import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Check, Send, Activity, Power, Sliders, Layers, User, Zap, Terminal } from 'lucide-react';
import gsap from 'gsap';

export default function Contact() {
  const containerRef = useRef(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  // State for session mixer
  const [patches, setPatches] = useState({
    recEngineer: false,
    recDry: false,
    pkg4h: false,
    pkg8h: false,
    pkgComplete: false,
    mix: false,
    master: false
  });

  const [recHours, setRecHours] = useState(2); // Default to 2 hours of recording

  // Prices configuration
  const prices = {
    engineerPerHour: 50,
    dryPerHour: 30,
    pkg4h: 160,
    pkg8h: 300,
    pkgComplete: 225,
    mix: 150,
    master: 50
  };

  // Load calculator data from localStorage if redirected from Services page
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('for_art_booking_calc');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const updatedPatches = {
          recEngineer: parsed.recType === 'engineer',
          recDry: parsed.recType === 'dry',
          pkg4h: false,
          pkg8h: false,
          pkgComplete: false,
          mix: false,
          master: false
        };

        if (parsed.recHours > 0) {
          setRecHours(parsed.recHours);
        }

        parsed.services.forEach(service => {
          if (service === 'fourHourPkg') updatedPatches.pkg4h = true;
          if (service === 'eightHourPkg') updatedPatches.pkg8h = true;
          if (service === 'completeTrackPkg') updatedPatches.pkgComplete = true;
          if (service === 'basicMix' || service === 'premiumMix' || service === 'premiumMixMaster') updatedPatches.mix = true;
          if (service === 'mastering' || service === 'premiumMixMaster') updatedPatches.master = true;
        });

        setPatches(updatedPatches);
        
        // Add a pre-fill note to the message box
        let messageNote = `Gekapitaliseerde tariefschatting calculator: €${parsed.total},- excl. btw.`;
        if (parsed.recHours > 0) {
          messageNote += ` (Opnameduur: ${parsed.recHours} uur)`;
        }
        setFormData(prev => ({
          ...prev,
          message: messageNote
        }));

        // Clear after loading
        localStorage.removeItem('for_art_booking_calc');
      }
    } catch (e) {
      console.error("Fout bij laden van calculator opslag", e);
    }
  }, []);

  // Enforce studio business logic on toggle
  const toggleService = (key) => {
    setPatches(prev => {
      const next = { ...prev };
      
      if (key === 'recEngineer') {
        next.recEngineer = !prev.recEngineer;
        if (next.recEngineer) {
          next.recDry = false;
          next.pkg4h = false;
          next.pkg8h = false;
          next.pkgComplete = false;
        }
      } else if (key === 'recDry') {
        next.recDry = !prev.recDry;
        if (next.recDry) {
          next.recEngineer = false;
          next.pkg4h = false;
          next.pkg8h = false;
          next.pkgComplete = false;
        }
      } else if (key === 'pkg4h') {
        next.pkg4h = !prev.pkg4h;
        if (next.pkg4h) {
          next.pkg8h = false;
          next.pkgComplete = false;
          next.recEngineer = false;
          next.recDry = false;
        }
      } else if (key === 'pkg8h') {
        next.pkg8h = !prev.pkg8h;
        if (next.pkg8h) {
          next.pkg4h = false;
          next.pkgComplete = false;
          next.recEngineer = false;
          next.recDry = false;
        }
      } else if (key === 'pkgComplete') {
        next.pkgComplete = !prev.pkgComplete;
        if (next.pkgComplete) {
          next.pkg4h = false;
          next.pkg8h = false;
          next.recEngineer = false;
          next.recDry = false;
          next.mix = false;
          next.master = false;
        }
      } else if (key === 'mix') {
        next.mix = !prev.mix;
        if (next.mix) {
          next.pkgComplete = false;
        }
      } else if (key === 'master') {
        next.master = !prev.master;
        if (next.master) {
          next.pkgComplete = false;
        }
      }
      
      return next;
    });
  };

  // Calculate live total cost
  const getCalculatedTotal = () => {
    let sum = 0;
    if (patches.recEngineer) sum += recHours * prices.engineerPerHour;
    if (patches.recDry) sum += recHours * prices.dryPerHour;
    if (patches.pkg4h) sum += prices.pkg4h;
    if (patches.pkg8h) sum += prices.pkg8h;
    if (patches.pkgComplete) sum += prices.pkgComplete;
    if (patches.mix) sum += prices.mix;
    if (patches.master) sum += prices.master;
    return sum;
  };

  const totalCost = getCalculatedTotal();
  const activeChannelsCount = Object.values(patches).filter(Boolean).length;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate form transmission
    const tl = gsap.timeline();
    tl.to('.form-element', {
      opacity: 0,
      y: -20,
      stagger: 0.05,
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => {
        setSuccess(true);
        // Animate success screen
        gsap.fromTo('.success-element',
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }
        );
      }
    });
  };

  // Entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-intro',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
      gsap.fromTo('.mixer-console',
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
      );
      gsap.fromTo('.form-element',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out", delay: 0.4 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
      {/* Self-contained animations for VU levels */}
      <style>{`
        @keyframes vuBarAnimation {
          0%, 100% { height: 12%; opacity: 0.4; }
          25% { height: 85%; opacity: 0.95; }
          50% { height: 45%; opacity: 0.7; }
          70% { height: 100%; opacity: 1; }
          85% { height: 60%; opacity: 0.8; }
        }
        .animate-vu-bar {
          animation: vuBarAnimation 1.4s infinite ease-in-out;
        }
        @keyframes miniLedPulse {
          0%, 100% { opacity: 0.3; filter: drop-shadow(0 0 1px rgba(229,126,37,0.3)); }
          50% { opacity: 1; filter: drop-shadow(0 0 6px rgba(229,126,37,1)); }
        }
        .animate-led-active {
          animation: miniLedPulse 1s infinite ease-in-out;
        }
        @keyframes waveOscilloscope {
          0% { transform: scaleY(0.4); }
          50% { transform: scaleY(1.4); }
          100% { transform: scaleY(0.4); }
        }
        .animate-scope {
          animation: waveOscilloscope 1.8s infinite ease-in-out;
        }
      `}</style>

      {/* Intro */}
      <div className="contact-intro text-center max-w-3xl mx-auto mb-16 md:mb-20">
        <span className="font-data text-xs text-accent tracking-[0.3em] uppercase mb-4 block">RESERVERINGEN</span>
        <h1 className="font-heading text-4xl md:text-7xl font-black mb-6 tracking-tight uppercase">
          BOEK JOUW <span className="font-drama italic text-accent font-normal lowercase">sessie</span>
        </h1>
        <p className="font-sans text-base md:text-lg text-softwhite/75 leading-relaxed">
          Configureer hieronder jouw studiosessie. De virtual mixing console berekent direct de tarieven. Vul vervolgens je details in om de aanvraag te verzenden.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Studio Session Mixer Console */}
        <div className="lg:col-span-5 mixer-console space-y-6">
          <div className="border border-white/10 bg-[#050c22]/96 rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative shadow-accent/5 overflow-hidden">
            {/* Top decorative metal frame elements */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-accent/80 shadow-[0_0_15px_#E57E25] z-10" />
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-accent" />
                <span className="font-heading text-xs font-bold text-softwhite/80 tracking-wider uppercase">
                  Sessie Mixer
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full border border-white/5">
                <span className={`w-1.5 h-1.5 rounded-full ${activeChannelsCount > 0 ? 'bg-accent animate-led-active' : 'bg-white/20'}`} />
                <span className="font-sans text-[9px] text-softwhite/50 tracking-wider uppercase">
                  {activeChannelsCount > 0 ? 'Actief' : 'Standby'}
                </span>
              </div>
            </div>

            {/* Mixer Channel Strips */}
            <div className="space-y-6">
              
              {/* CHANNEL 01: RECORDING DECK */}
              <div className="bg-black/20 rounded-2xl border border-white/5 p-4 relative group hover:border-white/10 transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-heading text-xs font-black uppercase text-softwhite mt-0.5">Opnamesessies</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2.5 mb-3">
                  <button
                    type="button"
                    onClick={() => toggleService('recDry')}
                    className={`py-2.5 px-2 rounded-xl font-data text-[10px] tracking-wider text-center border uppercase transition-all duration-300 ${
                      patches.recDry
                        ? 'bg-accent/20 border-accent text-accent font-bold shadow-[0_0_12px_rgba(229,126,37,0.15)]'
                        : 'border-white/5 bg-white/5 text-softwhite/60 hover:bg-white/10 hover:text-softwhite'
                    }`}
                  >
                    Dry Hire <span className="block text-[8px] opacity-65 font-sans mt-0.5">€30 / Uur</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleService('recEngineer')}
                    className={`py-2.5 px-2 rounded-xl font-data text-[10px] tracking-wider text-center border uppercase transition-all duration-300 ${
                      patches.recEngineer
                        ? 'bg-accent/20 border-accent text-accent font-bold shadow-[0_0_12px_rgba(229,126,37,0.15)]'
                        : 'border-white/5 bg-white/5 text-softwhite/60 hover:bg-white/10 hover:text-softwhite'
                    }`}
                  >
                    Engineer <span className="block text-[8px] opacity-65 font-sans mt-0.5">€50 / Uur</span>
                  </button>
                </div>

                {/* Trim / Hour spinner if recording type active */}
                {(patches.recEngineer || patches.recDry) && (
                  <div className="flex justify-between items-center bg-black/40 border border-white/5 px-3 py-2 rounded-xl mt-2 animate-fadeIn">
                    <span className="font-sans text-[10px] text-softwhite/50 uppercase font-semibold">Uren:</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setRecHours(h => Math.max(1, h - 1))}
                        className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-sans text-xs text-softwhite hover:bg-accent hover:text-bunker hover:border-accent transition-all"
                      >
                        -
                      </button>
                      <span className="font-data text-xs font-bold text-accent min-w-[28px] text-center">
                        {recHours} Uur
                      </span>
                      <button
                        type="button"
                        onClick={() => setRecHours(h => Math.min(24, h + 1))}
                        className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-sans text-xs text-softwhite hover:bg-accent hover:text-bunker hover:border-accent transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* CHANNEL 02: FLAT-RATE BUNDLES */}
              <div className="bg-black/20 rounded-2xl border border-white/5 p-4 relative group hover:border-white/10 transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-heading text-xs font-black uppercase text-softwhite mt-0.5">Voordelige Pakketten</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'pkg4h', label: '4H Bndl', price: '€160' },
                    { id: 'pkg8h', label: '8H Bndl', price: '€300' },
                    { id: 'pkgComplete', label: 'Cmp Trk', price: '€225' }
                  ].map(bundle => (
                    <button
                      key={bundle.id}
                      type="button"
                      onClick={() => toggleService(bundle.id)}
                      className={`py-2 px-1 rounded-xl font-data text-[10px] tracking-wider text-center border uppercase transition-all duration-300 flex flex-col justify-center items-center ${
                        patches[bundle.id]
                          ? 'bg-accent/20 border-accent text-accent font-bold shadow-[0_0_12px_rgba(229,126,37,0.15)]'
                          : 'border-white/5 bg-white/5 text-softwhite/60 hover:bg-white/10 hover:text-softwhite'
                      }`}
                    >
                      <span>{bundle.label}</span>
                      <span className="text-[8px] opacity-65 font-sans mt-0.5">{bundle.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* CHANNEL 03: OUTBOARD PROCESSING */}
              <div className="bg-black/20 rounded-2xl border border-white/5 p-4 relative group hover:border-white/10 transition-all duration-300">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-heading text-xs font-black uppercase text-softwhite mt-0.5">Post-Processing & Finishing</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => toggleService('mix')}
                    className={`py-2.5 px-2 rounded-xl font-data text-[10px] tracking-wider text-center border uppercase transition-all duration-300 ${
                      patches.mix
                        ? 'bg-accent/20 border-accent text-accent font-bold shadow-[0_0_12px_rgba(229,126,37,0.15)]'
                        : 'border-white/5 bg-white/5 text-softwhite/60 hover:bg-white/10 hover:text-softwhite'
                    }`}
                  >
                    Mixing <span className="block text-[8px] opacity-65 font-sans mt-0.5">€150</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleService('master')}
                    className={`py-2.5 px-2 rounded-xl font-data text-[10px] tracking-wider text-center border uppercase transition-all duration-300 ${
                      patches.master
                        ? 'bg-accent/20 border-accent text-accent font-bold shadow-[0_0_12px_rgba(229,126,37,0.15)]'
                        : 'border-white/5 bg-white/5 text-softwhite/60 hover:bg-white/10 hover:text-softwhite'
                    }`}
                  >
                    Mastering <span className="block text-[8px] opacity-65 font-sans mt-0.5">€50</span>
                  </button>
                </div>
              </div>

              {/* MASTER SECTION & VU METERS */}
              <div className="border-t border-white/10 pt-5 mt-4 space-y-4">
                {/* Dynamic VU Meter */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-sans text-softwhite/40 px-1">
                    <span>Master Output Niveau</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-12 w-full px-3 py-1.5 bg-black/60 rounded-xl border border-white/5 overflow-hidden">
                    {Array.from({ length: 18 }).map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`w-full rounded-t-sm transition-all duration-300 ${
                          totalCost > 0 ? 'animate-vu-bar' : 'h-1 bg-white/10'
                        }`}
                        style={{
                          animationDelay: `${idx * 0.06}s`,
                          animationDuration: `${1.0 + Math.random() * 0.5}s`,
                          height: totalCost > 0 ? undefined : '3px',
                          backgroundColor: idx < 10 ? '#E57E25' : idx < 14 ? '#d2b48c' : '#EF4444' // Accent, Muted Tan, Warning Red
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* LED Digit Price Output */}
                <div className="bg-black/50 border border-white/5 p-4 rounded-2xl flex justify-between items-center relative overflow-hidden">
                  {/* Subtle amber background pulse if active */}
                  {totalCost > 0 && (
                    <div className="absolute inset-0 bg-accent/2 blur-lg pointer-events-none" />
                  )}
                  <div>
                    <span className="font-sans text-[10px] text-softwhite/50 uppercase tracking-wider block mb-1 font-semibold">
                      Totaalprijs
                    </span>
                    <span className="font-heading text-[22px] font-black tracking-tight text-accent drop-shadow-[0_0_10px_rgba(229,126,37,0.4)]">
                      € {totalCost},-
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-sans text-[9px] text-softwhite/50 uppercase">
                      Excl. 21% BTW
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Details Card */}
          <div className="border border-white/5 bg-[#050c22]/40 rounded-[2.5rem] p-6 space-y-5">
            <h3 className="font-heading text-sm font-black uppercase text-softwhite tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-accent" />
              Studio Specificaties
            </h3>
            
            <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4 font-sans text-xs">
              <li className="flex gap-3 bg-white/2 p-3 rounded-xl border border-white/5">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-sans text-[9px] text-softwhite/45 block font-semibold">LOCATIE</span>
                  <span className="text-softwhite/80">Leiden, Nederland</span>
                </div>
              </li>

              <li className="flex gap-3 bg-white/2 p-3 rounded-xl border border-white/5">
                <Mail className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-sans text-[9px] text-softwhite/45 block font-semibold">E-MAILADRES</span>
                  <span className="font-sans text-softwhite/80">info@forartstudios.nl</span>
                </div>
              </li>

              <li className="flex gap-3 bg-white/2 p-3 rounded-xl border border-white/5">
                <Phone className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="font-sans text-[9px] text-softwhite/45 block font-semibold">TELEFOON</span>
                  <span className="font-sans text-softwhite/80">+31 6 12345678</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: The Interactive Booking Intake Form or Success screen */}
        <div className="lg:col-span-7">
          <div className="border border-white/10 bg-[#050c22]/92 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative min-h-[460px]">
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="form-element font-heading text-xs text-accent tracking-wider uppercase block font-bold">
                    Boekingsformulier
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="form-element space-y-2">
                    <label htmlFor="name" className="font-sans text-xs text-softwhite/60 block font-semibold">
                      Artiesten- / Bedrijfsnaam
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-softwhite/30" />
                      <input
                        required
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="bijv. Prod. Yinka"
                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 font-sans text-sm text-softwhite placeholder-softwhite/35 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="form-element space-y-2">
                    <label htmlFor="email" className="font-sans text-xs text-softwhite/60 block font-semibold">
                      E-mailadres
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-softwhite/30" />
                      <input
                        required
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="artiest@mail.nl"
                        className="w-full bg-black/40 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 font-sans text-sm text-softwhite placeholder-softwhite/35 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="form-element space-y-2">
                  <label htmlFor="phone" className="font-sans text-xs text-softwhite/60 block font-semibold">
                    Telefoonnummer
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-softwhite/30" />
                    <input
                      required
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+31 6 12345678"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 font-sans text-sm text-softwhite placeholder-softwhite/35 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="form-element space-y-2">
                  <label htmlFor="message" className="font-sans text-xs text-softwhite/60 block font-semibold">
                    Project Omschrijving & Wensen
                  </label>
                  <div className="relative">
                    <textarea
                      required
                      id="message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Vertel ons over je track, mix-wensen of de datum waarop je sets wilt opnemen..."
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 font-sans text-sm text-softwhite placeholder-softwhite/35 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all duration-300 resize-none min-h-[120px]"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="form-element pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-accent text-bunker font-heading text-xs font-black tracking-widest uppercase hover:bg-white hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-[0_0_25px_rgba(229,126,37,0.2)] hover:shadow-[0_0_35px_rgba(229,126,37,0.45)] flex items-center justify-center gap-2"
                  >
                    Boek jouw sessie
                    <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="success-element h-full flex flex-col justify-center items-center text-center py-12 space-y-6">
                {/* Oscilloscope success visualizer */}
                <div className="flex items-center justify-center gap-1.5 h-16 w-32 border border-accent/30 bg-accent/5 rounded-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-accent/2 blur-md" />
                  <div className="w-1.5 h-6 bg-accent rounded-full animate-scope" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1.5 h-10 bg-accent rounded-full animate-scope" style={{ animationDelay: '0.3s' }} />
                  <div className="w-1.5 h-14 bg-accent rounded-full animate-scope" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1.5 h-8 bg-accent rounded-full animate-scope" style={{ animationDelay: '0.4s' }} />
                  <div className="w-1.5 h-4 bg-accent rounded-full animate-scope" style={{ animationDelay: '0.5s' }} />
                </div>
                
                <div>
                  <span className="font-heading text-xs text-accent tracking-wider uppercase block mb-2 font-bold">
                    Aanvraag ontvangen
                  </span>
                  <h2 className="font-heading text-2xl md:text-3xl font-black uppercase tracking-tight text-softwhite mb-4">
                    SESSIE GEÏNITIALISEERD
                  </h2>
                  <p className="font-sans text-sm text-softwhite/60 leading-relaxed max-w-sm mx-auto">
                    Je projectgegevens zijn succesvol verzonden. Yinka of een van de engineers neemt binnen 24 uur contact met je op om de sessie definitief in te plannen.
                  </p>
                </div>

                <div className="border border-white/5 bg-black/40 rounded-2xl p-5 w-full max-w-sm text-left font-sans text-xs text-softwhite/60 space-y-2 mt-4">
                  <div className="flex justify-between border-b border-white/5 pb-1"><span>Geschatte kosten:</span> <span className="text-accent font-bold">€ {totalCost},- excl. btw</span></div>
                  <div className="flex justify-between"><span>Tijdstip:</span> <span>{new Date().toLocaleDateString('nl-NL')}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
