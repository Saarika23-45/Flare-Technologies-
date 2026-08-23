import React, { useEffect, useState, memo } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// --- Type Definitions ---
type IconType = 'automation' | 'engineering' | 'growth' | 'strategy' | 'cloud' | 'ai';
type GlowColor = 'cyan' | 'purple';

interface SkillIconProps { type: IconType; }
interface SkillConfig {
  id: string;
  orbitRadius: number;
  size: number;
  speed: number;
  iconType: IconType;
  phaseShift: number;
  glowColor: GlowColor;
  label: string;
  description: string;
}
interface OrbitingSkillProps { config: SkillConfig; angle: number; onClick: (config: SkillConfig) => void; }
interface GlowingOrbitPathProps { radius: number; glowColor?: GlowColor; isDashed?: boolean; opacity?: number; }

// --- SVG Icons (Professional Service Icons) ---
const iconComponents: Record<IconType, { component: () => React.JSX.Element; color: string }> = {
  automation: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        <circle cx="12" cy="12" r="4"/>
      </svg>
    ),
    color: '#00D4FF' // Flare Cyan
  },
  engineering: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    color: '#FF00A8' // Flare Pink
  },
  growth: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
        <polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
    color: '#00FFA3' // Flare Green
  },
  strategy: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ),
    color: '#FFB800' // Flare Amber
  },
  cloud: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5 0-2.3-1.7-4.2-4-4.5V8c0-3.3-2.7-6-6-6-2.7 0-5 1.8-5.7 4.3C3.6 6.8 2 8.7 2 11c0 2.8 2.2 5 5 5h10.5"/>
      </svg>
    ),
    color: '#5B6BFF' // Flare Indigo
  },
  ai: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    color: '#A85BFF' // Flare Violet
  }
};

const SkillIcon = memo(({ type }: SkillIconProps) => {
  const IconComponent = iconComponents[type]?.component;
  return IconComponent ? <IconComponent /> : null;
});
SkillIcon.displayName = 'SkillIcon';

const skillsConfig: SkillConfig[] = [
  { 
    id: 'automation', orbitRadius: 160, size: 48, speed: 0.6, iconType: 'automation', phaseShift: 0, glowColor: 'cyan', 
    label: 'Automated Systems', 
    description: 'We help businesses streamline operations by automating repetitive tasks and improving efficiency through intelligent systems.' 
  },
  { 
    id: 'engineering', orbitRadius: 160, size: 48, speed: 0.6, iconType: 'engineering', phaseShift: (2 * Math.PI) / 3, glowColor: 'cyan', 
    label: 'Engineering & Development', 
    description: 'We design and build reliable, scalable digital products and infrastructure tailored to business needs.' 
  },
  { 
    id: 'growth', orbitRadius: 160, size: 48, speed: 0.6, iconType: 'growth', phaseShift: (4 * Math.PI) / 3, glowColor: 'cyan', 
    label: 'Growth & Marketing', 
    description: 'We support businesses in expanding their reach, improving visibility, and increasing conversions through strategic marketing solutions.' 
  },
  { 
    id: 'strategy', orbitRadius: 260, size: 56, speed: -0.3, iconType: 'strategy', phaseShift: 0, glowColor: 'purple', 
    label: 'Consulting & Strategy', 
    description: 'We provide expert guidance to help businesses implement the right systems and strategies for long-term growth.' 
  },
  { 
    id: 'cloud', orbitRadius: 260, size: 52, speed: -0.3, iconType: 'cloud', phaseShift: (2 * Math.PI) / 3, glowColor: 'purple', 
    label: 'Cloud Infrastructure', 
    description: 'We build and manage secure, high-performance cloud environments that grow with your business demands.' 
  },
  { 
    id: 'ai', orbitRadius: 260, size: 48, speed: -0.3, iconType: 'ai', phaseShift: (4 * Math.PI) / 3, glowColor: 'purple', 
    label: 'AI Solutions', 
    description: 'We integrate cutting-edge AI technologies into your business to enhance decision-making and automate complex tasks.' 
  },
];

const OrbitingSkill = memo(({ config, angle, onClick }: OrbitingSkillProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { orbitRadius, size, iconType, label } = config;
  const x = Math.cos(angle) * orbitRadius;
  const y = Math.sin(angle) * orbitRadius;

  return (
    <div
      className="absolute top-1/2 left-1/2 transition-all duration-300 ease-out"
      style={{ width: `${size}px`, height: `${size}px`, transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`, zIndex: isHovered ? 20 : 10 }}
      onMouseEnter={() => {
        setIsHovered(true);
        onClick(config); // Trigger the card on hover
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <div
        className="relative w-full h-full p-3 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer overflow-hidden"
        style={{
          background: 'rgba(10, 14, 24, 0.95)',
          border: `2px solid ${isHovered ? iconComponents[iconType]?.color : 'rgba(255,255,255,0.08)'}`,
          transform: isHovered ? 'scale(1.25)' : 'scale(1)',
          boxShadow: isHovered 
            ? `0 0 40px ${iconComponents[iconType]?.color}70, 0 0 80px ${iconComponents[iconType]?.color}30, inset 0 0 15px ${iconComponents[iconType]?.color}40` 
            : '0 8px 32px rgba(0,0,0,0.6)',
        }}
      >
        <div className="absolute inset-0 opacity-10 transition-opacity duration-300" 
             style={{ background: `radial-gradient(circle, ${iconComponents[iconType]?.color} 0%, transparent 70%)`, opacity: isHovered ? 0.3 : 0.1 }} />
        
        <SkillIcon type={iconType} />
        
        {isHovered && (
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md text-[0.65rem] text-white whitespace-nowrap pointer-events-none uppercase tracking-widest z-50 shadow-xl"
            style={{ background: 'rgba(10,14,24,0.98)', border: `1px solid ${iconComponents[iconType]?.color}40`, fontWeight: 800 }}>
            {label}
          </div>
        )}
      </div>
    </div>
  );
});
OrbitingSkill.displayName = 'OrbitingSkill';

const GlowingOrbitPath = memo(({ radius, glowColor = 'cyan', isDashed = false, opacity = 1 }: GlowingOrbitPathProps) => {
  const colors = {
    cyan: { border: 'rgba(0, 212, 255, 0.15)', glow: 'rgba(0, 212, 255, 0.04)' },
    purple: { border: 'rgba(168, 91, 255, 0.15)', glow: 'rgba(168, 91, 255, 0.04)' },
  }[glowColor];

  return (
    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none scale-100 transition-all duration-700`}
      style={{ 
        width: `${radius * 2}px`, 
        height: `${radius * 2}px`, 
        border: `${isDashed ? '1px dashed' : '1px solid'} ${colors.border}`, 
        boxShadow: `0 0 60px ${colors.glow}, inset 0 0 60px ${colors.glow}`,
        opacity: opacity
      }}
    />
  );
});
GlowingOrbitPath.displayName = 'GlowingOrbitPath';

export default function OrbitingSkills() {
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSkill, setActiveSkill] = useState<SkillConfig | null>(null);

  useEffect(() => {
    if (isPaused || activeSkill) return;
    let animId: number;
    let last = performance.now();
    const tick = (now: number) => {
      setTime(t => t + (now - last) / 1000);
      last = now;
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, activeSkill]);

  return (
    <div
      className="relative flex items-center justify-center p-16"
      style={{ width: '650px', height: '650px' }}
      onMouseLeave={() => {
        setIsPaused(false);
        setActiveSkill(null);
      }}
    >
      {/* Decorative Outer Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.02] w-[580px] h-[580px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.01] w-[640px] h-[640px] animate-pulse" />

      {/* Main Orbit Paths */}
      <GlowingOrbitPath radius={160} glowColor="cyan" />
      <GlowingOrbitPath radius={260} glowColor="purple" />
      
      {/* Sub-paths for tech look */}
      <GlowingOrbitPath radius={180} glowColor="cyan" isDashed opacity={0.2} />
      <GlowingOrbitPath radius={240} glowColor="purple" isDashed opacity={0.2} />

      {/* Central Hub Animated Lottie (Larger) */}
      <div className="relative z-10 w-44 h-44 rounded-full flex items-center justify-center pointer-events-none"
           style={{ 
             background: 'radial-gradient(circle, rgba(18,24,38,0.5) 0%, transparent 70%)',
           }}>
        <div className="absolute inset-0 scale-[1.4]">
          <DotLottieReact
            src="https://lottie.host/f345e48a-0873-49a3-8865-e85926ab7268/1RKO4GVXpD.lottie"
            loop
            autoplay
          />
        </div>
        
        {/* Core Center Glow */}
        <div className="absolute w-16 h-16 rounded-full blur-3xl animate-pulse"
             style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.3) 0%, rgba(168,91,255,0.3) 100%)' }} />
      </div>

      {/* Orbiting Icons */}
      {skillsConfig.map((config) => (
        <OrbitingSkill key={config.id} config={config} angle={time * config.speed + config.phaseShift} onClick={setActiveSkill} />
      ))}

      {/* Detail Card Overlay */}
      {activeSkill && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-500 backdrop-blur-[1px]"
             onMouseEnter={() => setIsPaused(true)}
             onMouseLeave={() => {
                // If they leave the card, we'll check if they are back on the container
             }}>
           {/* Backdrop (Light) */}
           <div className="absolute inset-0 bg-black/40 rounded-full pointer-events-none" />
           
           {/* Card Content */}
           <div className="relative w-full max-w-[320px] bg-[#0d1117]/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-[0_64px_128px_-12px_rgba(0,0,0,0.9)] overflow-hidden group pointer-events-auto">
             {/* Dynamic Ambient Glow */}
             <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full blur-[110px] opacity-40 transition-all duration-700 pointer-events-none"
                  style={{ background: iconComponents[activeSkill.iconType].color }} />
             
             <div className="flex flex-col gap-8">
               <div className="w-16 h-16 rounded-2xl flex items-center justify-center p-4 bg-white/5 border border-white/10 shadow-inner"
                    style={{ color: iconComponents[activeSkill.iconType].color }}>
                 <SkillIcon type={activeSkill.iconType} />
               </div>
               
               <div>
                 <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: iconComponents[activeSkill.iconType].color }} />
                    <span className="text-[0.65rem] font-black uppercase tracking-[0.25em] opacity-50">Service Insights</span>
                 </div>
                 <h3 className="text-2xl font-bold text-white leading-tight mb-4 tracking-tight">
                   {activeSkill.label}
                 </h3>
                 <p className="text-[1rem] text-gray-400 leading-relaxed font-medium">
                   {activeSkill.description}
                 </p>
               </div>

               <a href="/methodology" className="flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-white/5 border border-white/10 text-[0.7rem] font-black uppercase tracking-[0.2em] transition-all duration-300 group/link hover:bg-white/10"
                  style={{ color: iconComponents[activeSkill.iconType].color }}>
                 <span>Explore Methodology</span>
                 <svg className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                   <path d="M5 12h14M12 5l7 7-7 7"/>
                 </svg>
               </a>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}

