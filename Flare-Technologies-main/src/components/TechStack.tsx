import React from 'react';

const trustPoints = [
  {
    icon: '⚙️',
    title: 'Scalable Systems',
    desc: 'We design every system to grow with your business — no rebuilding required as your volume, users, or operations scale.',
  },
  {
    icon: '🛠️',
    title: 'Modern Tech Stack',
    desc: 'Built on industry-standard tools like React, Node.js, and AWS so your product is maintainable, secure, and future-proof.',
  },
  {
    icon: '🎯',
    title: 'Business-Focused Execution',
    desc: 'Every technical decision is made with your revenue and operations in mind. We build what creates real-world results.',
  },
];

const logos = [
  {
    name: 'React',
    svg: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <ellipse cx="20" cy="20" rx="3.5" ry="3.5" fill="#61DAFB" />
        <ellipse cx="20" cy="20" rx="18" ry="7" stroke="#61DAFB" strokeWidth="1.5" fill="none" />
        <ellipse cx="20" cy="20" rx="18" ry="7" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(60 20 20)" />
        <ellipse cx="20" cy="20" rx="18" ry="7" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(120 20 20)" />
      </svg>
    ),
  },
  {
    name: 'Next.js',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="40" cy="40" r="36" fill="#111" />
        <path d="M24 56V24l32 38h-8L24 36V56H24z" fill="white" />
        <path d="M48 24h8v32" stroke="white" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    name: 'Node.js',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M40 8L70 24V56L40 72L10 56V24L40 8Z" stroke="#539E43" strokeWidth="2" fill="none" />
        <text x="40" y="45" textAnchor="middle" fill="#539E43" fontSize="11" fontWeight="bold" fontFamily="sans-serif">node</text>
      </svg>
    ),
  },
  {
    name: 'AWS',
    svg: (
      <svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <text x="40" y="28" textAnchor="middle" fill="#FF9900" fontSize="20" fontWeight="bold" fontFamily="sans-serif">AWS</text>
        <path d="M16 34c6 4 42 4 48 0" stroke="#FF9900" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M60 30l4 4-4 4" stroke="#FF9900" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Vercel',
    svg: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M40 14L70 66H10L40 14Z" fill="white" />
      </svg>
    ),
  },
];

const TechStack: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 section-padding" style={{ background: 'linear-gradient(180deg, #060b17 0%, #0a0f1e 100%)' }}>
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Section heading */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white">
            Why Choose Flare Technologies
          </h2>
          <p className="text-sm text-gray-400 text-center mt-3 max-w-xl mx-auto leading-relaxed">
            We build scalable systems using proven technologies and modern engineering practices.
          </p>
        </div>

        {/* Trust cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {trustPoints.map((point) => (
            <div
              key={point.title}
              className="p-5 rounded-xl"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="text-2xl mb-3">{point.icon}</div>
              <h3 className="text-base font-semibold text-white mb-2">{point.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{point.desc}</p>
            </div>
          ))}
        </div>

        {/* Context text above logos */}
        <p className="text-xs text-gray-500 text-center mt-10">
          Powered by trusted technologies used across modern digital systems.
        </p>

        {/* Logo strip */}
        <div className="flex flex-wrap justify-center gap-8 mt-6">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="flex flex-col items-center gap-1.5 opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-default"
              title={logo.name}
            >
              <div className="h-6 sm:h-8 w-8 sm:w-10 flex items-center justify-center">
                {logo.svg}
              </div>
              <span className="text-xs text-gray-600 tracking-wide">{logo.name}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TechStack;
