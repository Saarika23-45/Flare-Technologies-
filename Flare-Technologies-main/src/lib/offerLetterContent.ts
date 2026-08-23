export const OFFER_LETTER_ROLES = [
  "Founder's Office",
  "Project Management",
  "HR",
  "Data Analyst",
] as const;

export type OfferLetterRole = typeof OFFER_LETTER_ROLES[number];

export const ROLE_RESPONSIBILITIES: Record<OfferLetterRole, string[]> = {
  "Founder's Office": [
    "Support strategic initiatives and special projects.",
    "Conduct market, competitor, and business research.",
    "Prepare executive presentations, reports, and documentation.",
    "Coordinate with departments to track action items.",
    "Assist in business planning and process improvements.",
    "Analyze operational metrics and recommend improvements.",
    "Handle sensitive business information with confidentiality.",
  ],
  "Project Management": [
    "Assist in planning and execution of projects.",
    "Track milestones, timelines, and deliverables.",
    "Maintain project documentation and meeting notes.",
    "Coordinate with stakeholders for timely execution.",
    "Identify risks and follow up on action items.",
    "Support Agile/Scrum workflows where applicable.",
    "Prepare regular project status reports.",
  ],
  "HR": [
    "Source candidates through multiple channels.",
    "Screen applications and coordinate interviews.",
    "Assist with onboarding and documentation.",
    "Maintain recruitment and employee records.",
    "Support engagement initiatives and HR operations.",
    "Coordinate campus hiring and employer branding.",
    "Maintain confidentiality of employee information.",
  ],
  "Data Analyst": [
    "Collect, clean, and validate datasets.",
    "Build dashboards and recurring reports.",
    "Analyze trends and business performance.",
    "Create visualizations and presentations.",
    "Support KPI tracking and decision-making.",
    "Document datasets and analytical processes.",
    "Collaborate with teams to solve business problems using data.",
  ],
};

// Best-effort match from the applicant's free-text applied-for role
// (app.role, from f2f_applications) to one of the four defined offer
// letter roles — used only to pre-select the dropdown default. Admin
// can always change the selection manually afterward.
export function guessRoleFromApplicationRole(appRole: string | null | undefined): OfferLetterRole | null {
  if (!appRole) return null;
  const r = appRole.toLowerCase();
  if (r.includes('founder')) return "Founder's Office";
  if (r.includes('project')) return 'Project Management';
  if (r.includes('hr') || r.includes('human resources')) return 'HR';
  if (r.includes('data')) return 'Data Analyst';
  return null; // no confident match — leave the dropdown for the admin to pick
}

// Internships are fixed at exactly 3 months from the joining date.
// Returns an ISO date string (YYYY-MM-DD).
export function addThreeMonths(joiningDateISO: string): string {
  const d = new Date(`${joiningDateISO}T00:00:00`);
  d.setMonth(d.getMonth() + 3);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
