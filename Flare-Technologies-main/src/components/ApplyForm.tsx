import React, { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Upload, Send, CheckCircle } from 'lucide-react';

interface ApplyFormProps {
  role: string;
  onClose: () => void;
}

export default function ApplyForm({ role, onClose }: ApplyFormProps) {
  const [form, setForm] = useState({
    name: '',
    college: '',
    semester: '',
    phone: '',
    email: '',
    whyFlare: '',
    skills: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (f.size > 5 * 1024 * 1024) {
        setErrorMsg('File must be under 5MB');
        e.target.value = '';
        return;
      }
      setFile(f);
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setErrorMsg('Please attach your resume'); return; }
    setStatus('uploading');
    setErrorMsg('');

    try {
      // 1. Upload resume to Supabase Storage
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${form.name.replace(/\s+/g, '-')}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, { contentType: file.type });

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(fileName);
      const resumeUrl = urlData.publicUrl;

      // 3. Save application to database
      const { error: dbError } = await supabase.from('applications').insert([{
        name: form.name,
        email: form.email,
        phone: form.phone,
        role,
        message: form.whyFlare,
        resume_url: resumeUrl,
        college: form.college,
        semester: form.semester,
        skills: form.skills,
      }]);

      if (dbError) throw dbError;

      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      setErrorMsg((err as { message?: string }).message || 'Something went wrong. Please try again.');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '0.4rem',
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: '#0f172a',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '2rem',
        width: '100%',
        maxWidth: '480px',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.5rem' }}>Application Submitted!</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              We've received your application for <strong style={{ color: '#FF8C00' }}>{role}</strong>. We'll be in touch soon.
            </p>
            <button onClick={onClose} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1.125rem', marginBottom: '0.25rem' }}>Apply for</h3>
            <p style={{ color: '#FF8C00', fontWeight: 700, fontSize: '1rem', marginBottom: '1.5rem' }}>{role}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Full Name */}
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              {/* College / University */}
              <div>
                <label style={labelStyle}>College / University *</label>
                <input
                  required
                  name="college"
                  type="text"
                  placeholder="Your college or university"
                  value={form.college}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              {/* Semester / Year */}
              <div>
                <label style={labelStyle}>Semester / Year *</label>
                <input
                  required
                  name="semester"
                  type="text"
                  placeholder="e.g. 3rd Year / 5th Semester"
                  value={form.semester}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label style={labelStyle}>Phone Number *</label>
                <input
                  required
                  name="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phone}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              {/* Email Address */}
              <div>
                <label style={labelStyle}>Email Address *</label>
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              {/* Role Applying For — read only */}
              <div>
                <label style={labelStyle}>Role Applying For</label>
                <div style={{
                  ...inputStyle,
                  color: '#FF8C00',
                  fontWeight: 600,
                  cursor: 'default',
                  opacity: 0.9,
                }}>
                  {role}
                </div>
              </div>

              {/* Why Flare? */}
              <div>
                <label style={labelStyle}>Why Flare? *</label>
                <textarea
                  required
                  name="whyFlare"
                  rows={3}
                  placeholder="Why do you want to join Flare?"
                  value={form.whyFlare}
                  onChange={handleChange}
                  style={{ ...inputStyle, resize: 'none' }}
                />
              </div>

              {/* Key Skills */}
              <div>
                <label style={labelStyle}>Key Skills *</label>
                <input
                  required
                  name="skills"
                  type="text"
                  placeholder="e.g. React, Python, Figma"
                  value={form.skills}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              {/* Resume Upload */}
              <div>
                <label style={labelStyle}>Resume (PDF/DOC, max 1MB) *</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFile}
                  style={{ display: 'none' }}
                />
                {file ? (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: '10px', padding: '0.75rem 1rem', gap: '0.75rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                      <Upload size={14} color="#10b981" style={{ flexShrink: 0 }} />
                      <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f87171', flexShrink: 0, padding: '2px', display: 'flex', alignItems: 'center' }}
                      title="Remove file"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    style={{
                      width: '100%', background: 'rgba(255,255,255,0.05)',
                      border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '10px',
                      padding: '0.875rem', color: 'rgba(255,255,255,0.5)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: '0.5rem', fontSize: '0.875rem',
                    }}
                  >
                    <Upload size={16} />
                    Click to upload resume
                  </button>
                )}
              </div>

              {errorMsg && <p style={{ color: '#f87171', fontSize: '0.8rem', margin: 0 }}>{errorMsg}</p>}

              <button
                type="submit"
                disabled={status === 'uploading'}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {status === 'uploading' ? 'Submitting...' : (<><Send size={16} /> Submit Application</>)}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
