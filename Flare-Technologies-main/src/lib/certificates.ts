import { supabase } from './supabase';

export interface CertificateRecord {
  id: string;
  source_application_id: number;
  name: string;
  program: string;
  start_date: string;
  end_date: string;
  issued_at: string;
  updated_at: string;
  certificate_file_url: string | null;
}

export function calculateDuration(start: string, end: string): string {
  if (!start || !end) return '—';
  const s = new Date(`${start}T00:00:00`);
  const e = new Date(`${end}T00:00:00`);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime()) || e < s) {
    return 'Invalid date range';
  }

  let months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  let days = e.getDate() - s.getDate();
  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(e.getFullYear(), e.getMonth(), 0);
    days += prevMonth.getDate();
  }

  const parts: string[] = [];
  if (months > 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (parts.length === 0) return '0 days';
  return parts.join(', ');
}

export function formatCertificateDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export async function fetchCertificateByApplicationId(
  applicationId: number,
): Promise<CertificateRecord | null> {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('source_application_id', applicationId)
    .maybeSingle();
  if (error || !data) return null;
  return data as CertificateRecord;
}

export async function fetchCertificateApplicationIds(): Promise<number[]> {
  const { data, error } = await supabase.from('certificates').select('source_application_id');
  if (error || !data) return [];
  return data.map((row) => row.source_application_id as number);
}

export async function fetchCertificateById(id: string): Promise<CertificateRecord | null> {
  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) return null;
  return data as CertificateRecord;
}

export async function upsertCertificate(record: {
  source_application_id: number;
  name: string;
  program: string;
  start_date: string;
  end_date: string;
  certificate_file_url?: string | null;
}): Promise<CertificateRecord | null> {
  const { data, error } = await supabase
    .from('certificates')
    .upsert(
      {
        ...record,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'source_application_id' },
    )
    .select()
    .single();
  if (error) {
    console.error('upsertCertificate failed:', error);
    return null;
  }
  return data as CertificateRecord;
}

export async function uploadCertificatePdf(certificateId: string, pdfBlob: Blob): Promise<string | null> {
  const path = `${certificateId}.pdf`;
  const { error } = await supabase.storage
    .from('certificates')
    .upload(path, pdfBlob, { upsert: true, contentType: 'application/pdf' });
  if (error) {
    console.error('uploadCertificatePdf failed:', error);
    return null;
  }
  const { data } = supabase.storage.from('certificates').getPublicUrl(path);
  return data.publicUrl;
}
