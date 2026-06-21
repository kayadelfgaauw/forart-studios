import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check, Info, Sliders, Settings, DollarSign, ArrowRight } from 'lucide-react';
import gsap from 'gsap';

export default function Services() {
  const containerRef = useRef(null);
  
  // Calculator State
  const [recType, setRecType] = useState('none'); // 'engineer', 'dry', 'none'
  const [recHours, setRecHours] = useState(1);
  const [selectedServices, setSelectedServices] = useState({
    basicMix: false,
    premiumMix: false,
    mastering: false,
    premiumMixMaster: false,
    completeTrackPkg: false,
    fourHourPkg: false,
    eightHourPkg: false
  });

  // Base prices
  const prices = {
    engineerPerHour: 50,
    dryPerHour: 30,
    fourHourPkg: 160,
    eightHourPkg: 300,
    completeTrack: 225,
    basicMix: 100,
    premiumMix: 150,
    mastering: 50,
    premiumMixMaster: 190
  };

  // State calculations
  const [total, setTotal] = useState(0);

  // Toggle checklist options and handle mutually exclusive packages
  const handleToggle = (service) => {
    setSelectedServices(prev => {
      const updated = { ...prev, [service]: !prev[service] };

      // Mutual exclusions to avoid invalid double charging
      if (service === 'completeTrackPkg' && updated.completeTrackPkg) {
        updated.basicMix = false;
        updated.premiumMix = false;
        updated.mastering = false;
        updated.premiumMixMaster = false;
        updated.fourHourPkg = false;
        updated.eightHourPkg = false;
        setRecType('none');
      }
      if (service === 'fourHourPkg' && updated.fourHourPkg) {
        updated.completeTrackPkg = false;
        updated.eightHourPkg = false;
        setRecType('none');
      }
      if (service === 'eightHourPkg' && updated.eightHourPkg) {
        updated.completeTrackPkg = false;
        updated.fourHourPkg = false;
        setRecType('none');
      }
      if (service === 'basicMix' && updated.basicMix) {
        updated.premiumMix = false;
        updated.premiumMixMaster = false;
        updated.completeTrackPkg = false;
      }
      if (service === 'premiumMix' && updated.premiumMix) {
        updated.basicMix = false;
        updated.premiumMixMaster = false;
        updated.completeTrackPkg = false;
      }
      if (service === 'premiumMixMaster' && updated.premiumMixMaster) {
        updated.basicMix = false;
        updated.premiumMix = false;
        updated.mastering = false;
        updated.completeTrackPkg = false;
      }
      if (service === 'mastering' && updated.mastering) {
        updated.premiumMixMaster = false;
        updated.completeTrackPkg = false;
      }

      return updated;
    });
  };

  // Set recording type and reset conflicting package deals
  const handleRecTypeChange = (type) => {
    setRecType(type);
    if (type !== 'none') {
      setSelectedServices(prev => ({
        ...prev,
        completeTrackPkg: false,
        fourHourPkg: false,
        eightHourPkg: false
      }));
    }
  };

  // Calculate Total
  useEffect(() => {
    let sum = 0;
    
    // Hourly recording
    if (recType === 'engineer') {
      sum += recHours * prices.engineerPerHour;
    } else if (recType === 'dry') {
      sum += recHours * prices.dryPerHour;
    }

    // Individual packages
    if (selectedServices.fourHourPkg) sum += prices.fourHourPkg;
    if (selectedServices.eightHourPkg) sum += prices.eightHourPkg;
    if (selectedServices.completeTrackPkg) sum += prices.completeTrack;
    if (selectedServices.basicMix) sum += prices.basicMix;
    if (selectedServices.premiumMix) sum += prices.premiumMix;
    if (selectedServices.mastering) sum += prices.mastering;
    if (selectedServices.premiumMixMaster) sum += prices.premiumMixMaster;

    setTotal(sum);
  }, [recType, recHours, selectedServices]);

  // Save selection to localStorage so it can be parsed on Contact page
  const handleBookNowClick = () => {
    const summary = {
      recType,
      recHours: recType !== 'none' ? recHours : 0,
      services: Object.keys(selectedServices).filter(k => selectedServices[k]),
      total
    };
    localStorage.setItem('for_art_booking_calc', JSON.stringify(summary));
  };

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.service-card',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
      {/* Intro */}
      <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
        <span className="font-heading text-xs text-accent tracking-wider uppercase mb-4 block font-bold">Diensten & Tarieven</span>
        <h1 className="font-heading text-4xl md:text-7xl font-black mb-6 tracking-tight uppercase">
          TARIEVEN <span className="font-drama italic text-accent font-normal lowercase">&</span> DEALS
        </h1>
        <p className="font-sans text-base md:text-lg text-softwhite/75 leading-relaxed">
          Kwaliteit hoeft niet onbetaalbaar te zijn. Bekijk hieronder onze transparante tarieven of gebruik de interactieve calculator om direct jouw projectsessie samen te stellen.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: The Services & Packages Details */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <h2 className="font-heading text-xl md:text-2xl font-black uppercase tracking-wider">
              LOSSE DIENSTEN & PAKKETTEN
            </h2>
            <p className="font-sans text-sm text-softwhite/50">
              Alle genoemde tarieven zijn exclusief 21% btw.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Opname met engineer */}
            <div className="service-card rounded-[2rem] border border-white/5 bg-bunker/30 p-6 flex flex-col justify-between min-h-[180px]">
              <div>
                <h3 className="font-heading text-lg font-bold text-softwhite">Opname (incl. engineer)</h3>
                <p className="font-sans text-xs text-softwhite/50 mb-4">Inclusief professionele begeleiding</p>
                <p className="font-sans text-sm text-softwhite/70">Zing, rap of speel in onder technische en creatieve begeleiding van onze studio engineer.</p>
              </div>
              <div className="border-t border-white/5 pt-4 mt-4 flex justify-between items-center">
                 <span className="font-sans text-xs text-accent font-semibold">€ 50,- / UUR</span>
              </div>
            </div>

            {/* Dry hire */}
            <div className="service-card rounded-[2rem] border border-white/5 bg-bunker/30 p-6 flex flex-col justify-between min-h-[180px]">
              <div>
                <h3 className="font-heading text-lg font-bold text-softwhite">Opname (Dry-Hire)</h3>
                <p className="font-sans text-xs text-softwhite/50 mb-4">Voor externe engineers & producers</p>
                <p className="font-sans text-sm text-softwhite/70">Huur de studio en maak zelfstandig gebruik van de ruimte en de aangesloten apparatuur.</p>
              </div>
              <div className="border-t border-white/5 pt-4 mt-4 flex justify-between items-center">
                 <span className="font-sans text-xs text-accent font-semibold">€ 30,- / UUR</span>
              </div>
            </div>

            {/* 4-hour bundle */}
            <div className="service-card rounded-[2rem] border border-white/5 bg-bunker/30 p-6 flex flex-col justify-between min-h-[180px]">
              <div>
                <h3 className="font-heading text-lg font-bold text-softwhite">4-Uur Pakket</h3>
                <p className="font-sans text-xs text-softwhite/50 mb-4">Pakketdeal</p>
                <p className="font-sans text-sm text-softwhite/70">Huur de studio voor een dagdeel van 4 uur en bespaar op je uurtarief.</p>
              </div>
              <div className="border-t border-white/5 pt-4 mt-4 flex justify-between items-center">
                 <span className="font-sans text-xs text-accent font-semibold">€ 160,-</span>
              </div>
            </div>

            {/* 8-hour bundle */}
            <div className="service-card rounded-[2rem] border border-white/5 bg-bunker/30 p-6 flex flex-col justify-between min-h-[180px]">
              <div>
                <h3 className="font-heading text-lg font-bold text-softwhite">8-Uur Pakket</h3>
                <p className="font-sans text-xs text-softwhite/50 mb-4">Pakketdeal</p>
                <p className="font-sans text-sm text-softwhite/70">Huur de studio voor een volledige dag van 8 uur voor maximale creativiteit en de beste prijs.</p>
              </div>
              <div className="border-t border-white/5 pt-4 mt-4 flex justify-between items-center">
                 <span className="font-sans text-xs text-accent font-semibold">€ 300,-</span>
              </div>
            </div>

            {/* Complete Track */}
            <div className="service-card rounded-[2rem] border border-white/5 bg-bunker/30 p-6 flex flex-col justify-between min-h-[180px] md:col-span-2">
              <div>
                <h3 className="font-heading text-lg font-bold text-softwhite">Complete Track Pakket</h3>
                <p className="font-sans text-xs text-softwhite/50 mb-4">Alles-in-één deal</p>
                <p className="font-sans text-sm text-softwhite/70">Ontvang een volledige track-productie inclusief opnamesessies, uitgebreide mixing en professionele mastering.</p>
              </div>
              <div className="border-t border-white/5 pt-4 mt-4 flex justify-between items-center">
                 <span className="font-sans text-xs text-accent font-semibold">€ 225,- / COMPLETED TRACK</span>
              </div>
            </div>

            {/* Mixing options */}
            <div className="service-card rounded-[2rem] border border-white/5 bg-bunker/30 p-6 flex flex-col justify-between min-h-[180px]">
              <div>
                <h3 className="font-heading text-lg font-bold text-softwhite">Mixing & Mastering</h3>
                <p className="font-sans text-xs text-softwhite/50 mb-3">Losse mix & master opties</p>
                <ul className="space-y-2 font-sans text-xs text-softwhite/70">
                   <li className="flex justify-between"><span>Basic Mix:</span> <span className="font-sans text-accent font-semibold">€100,-</span></li>
                  <li className="flex justify-between"><span>Premium Mix:</span> <span className="font-sans text-accent font-semibold">€150,-</span></li>
                  <li className="flex justify-between"><span>Mastering:</span> <span className="font-sans text-accent font-semibold">€50,-</span></li>
                  <li className="flex justify-between"><span>Premium Mix + Master:</span> <span className="font-sans text-accent font-semibold">€190,-</span></li>
                </ul>
              </div>
            </div>

            {/* Custom Beat-productie */}
            <div className="service-card rounded-[2rem] border border-white/5 bg-bunker/30 p-6 flex flex-col justify-between min-h-[180px]">
              <div>
                <h3 className="font-heading text-lg font-bold text-softwhite">Beat-Productie</h3>
                <p className="font-sans text-xs text-softwhite/50 mb-4">Custom beats</p>
                <p className="font-sans text-sm text-softwhite/70">Laat een beat op maat maken, volledig afgestemd op jouw stem, stijl en creatieve wensen.</p>
              </div>
              <div className="border-t border-white/5 pt-4 mt-4 flex justify-between items-center">
                 <span className="font-sans text-xs text-accent font-semibold">€ 400,- tot € 1000,-</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: The Dynamic Console Price Calculator */}
        <div className="lg:col-span-5">
          <div className="border border-white/10 bg-bunker rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative overflow-hidden">
            {/* Ambient led strip effect at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-accent/40 shadow-[0_0_15px_#E57E25]" />

             <span className="font-heading text-xs text-accent tracking-wider uppercase block mb-6 font-bold">
              Studio Calculator
            </span>

            {/* Config section */}
            <div className="space-y-6">
              {/* Opnametype selector */}
              <div className="space-y-3">
                 <label className="font-sans text-xs text-softwhite/60 uppercase block font-semibold">
                  1. Selecteer Opnametype
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'none', label: 'GEEN' },
                    { id: 'dry', label: 'DRY-HIRE' },
                    { id: 'engineer', label: 'ENGINEER' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleRecTypeChange(opt.id)}
                       className={`py-2 px-1 rounded-lg font-sans text-[10px] tracking-wider text-center border uppercase transition-all ${
                        recType === opt.id
                          ? 'bg-accent border-accent text-bunker font-bold shadow-[0_0_10px_rgba(229,126,37,0.15)]'
                          : 'border-white/5 bg-primary/40 text-softwhite/60 hover:bg-bunker'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hours slider if recType active */}
              {recType !== 'none' && (
                <div className="space-y-2 bg-primary/20 border border-white/5 p-4 rounded-2xl animate-fadeIn">
                   <div className="flex justify-between items-center text-xs font-sans">
                    <span className="text-softwhite/50 font-semibold">Aantal uren:</span>
                    <span className="text-accent font-bold">{recHours} Uur</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="24"
                    value={recHours}
                    onChange={(e) => setRecHours(parseInt(e.target.value))}
                    className="w-full h-1 bg-primary rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                   <div className="flex justify-between text-[9px] font-sans text-softwhite/30 pt-1">
                    <span>1 UUR</span>
                    <span>24 UUR</span>
                  </div>
                </div>
              )}

              {/* Pakketten & Additionele Services Checklist */}
              <div className="space-y-3">
                 <label className="font-sans text-xs text-softwhite/60 uppercase block font-semibold">
                  2. Kies Pakketten & Services
                </label>
                
                <div className="space-y-2">
                  {[
                    { id: 'fourHourPkg', label: '4-Uur Studio Pakket', price: `€${prices.fourHourPkg},-` },
                    { id: 'eightHourPkg', label: '8-Uur Studio Pakket', price: `€${prices.eightHourPkg},-` },
                    { id: 'completeTrackPkg', label: 'Complete Track Pakket', price: `€${prices.completeTrack},-` },
                    { id: 'basicMix', label: 'Basic Mix', price: `€${prices.basicMix},-` },
                    { id: 'premiumMix', label: 'Premium Mix', price: `€${prices.premiumMix},-` },
                    { id: 'mastering', label: 'Mastering', price: `€${prices.mastering},-` },
                    { id: 'premiumMixMaster', label: 'Premium Mix + Master', price: `€${prices.premiumMixMaster},-` }
                  ].map(item => {
                    const isSelected = selectedServices[item.id];
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggle(item.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-accent/40 bg-bunker/60'
                            : 'border-white/5 bg-primary/20 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isSelected ? 'border-accent bg-accent text-bunker' : 'border-white/20 bg-bunker'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="font-sans text-xs text-softwhite/90">{item.label}</span>
                        </div>
                         <span className="font-sans text-xs text-accent font-semibold">{item.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Total Display in Retro LED style */}
            <div className="border-t border-white/5 pt-6 mt-8 space-y-6">
              <div className="bg-bunker border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
                 <span className="font-sans text-[10px] text-softwhite/50 uppercase tracking-wider mb-2 block font-semibold">
                  Geschatte Kosten
                </span>
                <div className="flex justify-between items-baseline">
                  <span className="font-sans text-2xl font-black text-accent tracking-tighter">
                    € {total},-
                  </span>
                  <span className="font-sans text-[10px] text-softwhite/45">
                    Excl. 21% btw
                  </span>
                </div>
              </div>

              <Link
                to="/contact"
                onClick={handleBookNowClick}
                className="w-full py-4 rounded-full bg-accent text-bunker font-heading text-xs font-black tracking-widest uppercase hover:bg-white transition-all duration-300 shadow-[0_0_25px_rgba(229,126,37,0.15)] flex items-center justify-center gap-2 group"
              >
                Nu Boeken Met Deze Selectie
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
