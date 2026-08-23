import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import { GlobePulse } from "@/components/ui/cobe-globe-pulse";
import SEO from "@/components/SEO";

const contactSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "name": "Contact Flare Technologies",
      "url": "https://www.flaretechnologies.in/contact",
      "description": "Contact Flare Technologies to discuss B2B technical marketing, web development, or AI automation projects."
    },
    {
      "@type": "LocalBusiness",
      "name": "Flare Technologies",
      "url": "https://www.flaretechnologies.in/",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bengaluru",
        "addressRegion": "Karnataka",
        "addressCountry": "IN"
      },
      "areaServed": ["Bengaluru", "Karnataka", "India"],
      "serviceType": [
        "B2B Technical Marketing",
        "Web Development",
        "AI Automation",
        "Video Production",
        "Marketing Automation"
      ]
    }
  ]
};

export default function Contact() {
    const [formState, setFormState] = useState<'idle' | 'sending' | 'success'>('idle');
    const [goal, setGoal] = useState('Save Time/Automation');
    const [otherGoal, setOtherGoal] = useState('');
    const seoEl = (
        <SEO
            title="Contact Flare Technologies | Book a Consultation"
            description="Get in touch with Flare Technologies to discuss your B2B technical marketing needs. Book a free consultation."
            canonical="https://www.flaretechnologies.in/contact"
        />
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('sending');
        setTimeout(() => setFormState('success'), 1500);
    };

    return (
        <>
        {seoEl}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
        <main className="min-h-screen pt-24 pb-20 overflow-hidden relative" style={{ backgroundColor: 'var(--theme-bg-main)' }}>
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full filter blur-[120px] -z-10" style={{ background: 'color-mix(in srgb, var(--theme-primary) 10%, transparent)' }} />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full filter blur-[120px] -z-10" style={{ background: 'color-mix(in srgb, var(--theme-accent) 10%, transparent)' }} />

            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row-reverse gap-16 items-center">
                    {/* Right Side: Copy & Info */}
                    <div className="w-full lg:w-1/2 text-left">
                        <div className="w-full max-w-sm mb-8 animate-fade-in-up">
                            <GlobePulse className="w-full h-full opacity-60 hover:opacity-100 transition-opacity" />
                        </div>


                        <div className="space-y-8">
                            <div className="flex items-center gap-6 group">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#7DD3FC] group-hover:bg-[#00D4FF]/10 transition-all">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Email Us</p>
                                    <p className="text-white font-medium text-lg">marketing@flaretechnologies.in</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#7DD3FC] group-hover:bg-[#00D4FF]/10 transition-all">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Call Us</p>
                                    <p className="text-white font-medium text-lg">+91 78991 04311</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#7DD3FC] group-hover:bg-[#00D4FF]/10 transition-all shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Visit Us</p>
                                    <p className="text-white font-medium text-sm sm:text-base leading-relaxed max-w-xs">
                                        Flare Technologies<br />
                                        2nd Floor, Abhyudhaya Complex,<br />
                                        No. 912, 28th Main Rd, Putlanpalya,<br />
                                        Jayanagara 9th Block, Jayanagar,<br />
                                        Bengaluru, Karnataka 560041, India
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <a href="https://www.linkedin.com/company/flaretechnologiespvtltd/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#00D4FF] hover:border-[#00D4FF]/50 transition-all">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                                </a>
                                <a href="https://www.instagram.com/flare_technologies/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-[#7DD3FC] hover:border-[#7DD3FC]/50 transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Left Side: Form */}
                    <div className="w-full lg:w-1/2">
                        <div className="mb-10 lg:mb-12">
                            <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight">
                                Start Your B2B Marketing{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#06B6D4]">Transformation</span>.
                            </h1>
                            <p className="text-gray-400 text-lg sm:text-xl max-w-lg leading-relaxed">
                                Stop fighting with disconnected systems. Tell us about your business goals, and we'll show you exactly how we can automate your growth.
                            </p>
                        </div>
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-3xl p-8 sm:p-12 rounded-[40px] shadow-2xl relative overflow-hidden"
                        >
                            {formState === 'success' ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
                                        <Send className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-4">Message Sent!</h2>
                                    <p className="text-gray-400">We'll get back to you within 24 hours. Get ready to grow.</p>
                                    <button 
                                        onClick={() => setFormState('idle')}
                                        className="mt-8 text-sm font-bold text-[#2563EB] uppercase tracking-widest hover:underline"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                            <input 
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#00D4FF]/50 transition-all"
                                                placeholder="Your full name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                            <input 
                                                required
                                                type="email"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#00D4FF]/50 transition-all"
                                                placeholder="Your email address"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Business Website (Optional)</label>
                                        <input 
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#00D4FF]/50 transition-all"
                                            placeholder="www.yourbusiness.com"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Your Primary Goal</label>
                                        <select
                                            value={goal}
                                            onChange={e => setGoal(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#00D4FF]/50 transition-all appearance-none cursor-pointer"
                                        >
                                            <option style={{ background: 'var(--theme-bg-main)' }}>Save Time/Automation</option>
                                            <option style={{ background: 'var(--theme-bg-main)' }}>Build New Website</option>
                                            <option style={{ background: 'var(--theme-bg-main)' }}>Connect Different Tools</option>
                                            <option style={{ background: 'var(--theme-bg-main)' }}>Custom Software Solution</option>
                                            <option style={{ background: 'var(--theme-bg-main)' }}>Other</option>
                                        </select>
                                        {goal === 'Other' && (
                                            <input
                                                value={otherGoal}
                                                onChange={e => setOtherGoal(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#00D4FF]/50 transition-all mt-3"
                                                placeholder="Please describe your goal"
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Tell us more</label>
                                        <textarea 
                                            rows={4}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#00D4FF]/50 transition-all resize-none"
                                            placeholder="How can we help your business today?"
                                        />
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={formState === 'sending'}
                                        className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {formState === 'sending' ? (
                                            "TRANSMITTING..."
                                        ) : (
                                            <>
                                                SUBMIT MESSAGE
                                                <Send className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </main>
        </>
    );
}
