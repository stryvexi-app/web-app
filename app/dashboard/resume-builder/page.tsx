"use client";

import { useEffect, useState } from "react";

type SkillGroup = { category: string; skills: string };
type ExperienceItem = {
  company: string; role: string; employmentType: string; location: string;
  startDate: string; endDate: string; responsibilities: string; achievements: string; technologies: string;
};
type ProjectItem = {
  name: string; description: string; role: string; technologies: string;
  responsibilities: string; highlights: string; url: string;
};
type EducationItem = {
  degree: string; institution: string; location: string; startYear: string;
  endYear: string; grade: string; details: string;
};
type CertificationItem = { name: string; issuer: string; year: string; url: string };
type FormState = {
    improvementInstructions: any;
  mode: "fresher" | "experienced" | "job_specific";
  name: string; email: string; phone: string; location: string;
  linkedin: string; github: string; portfolio: string; targetRole: string;
  jobDescription: string; skills: SkillGroup[]; experience: ExperienceItem[];
  projects: ProjectItem[]; education: EducationItem[]; certifications: CertificationItem[];
};
type ResumeContent = {
  professionalSummary: string;
  technicalSkills: { category: string; skills: string[] }[];
  experience: { company: string; role: string; duration: string; location: string; bullets: string[] }[];
  projects: { name: string; description: string; technologies: string[]; bullets: string[]; url: string }[];
  education: { degree: string; institution: string; year: string; details: string }[];
  certifications: { name: string; issuer: string; year: string }[];
  missingDetails: string[];
};
type ResumeRecord = {
  id: string; title: string; targetRole: string; templateId: string;
  personalDetails: Record<string, string>; content: ResumeContent;
  qualityReview?: { score?: number; strengths?: string[]; warnings?: string[] };
};


type EnhancementSection =
  | "summary"
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | "certifications";

type EnhancementResult = {
  proposedContent: ResumeContent;
  skillSuggestions: {
    skill: string;
    reason: string;
    evidenceNeeded: string;
  }[];
  recommendations: string[];
  changeSummary: string[];
  requiresReview: boolean;
};


const blankExperience = (): ExperienceItem => ({
  company: "", role: "", employmentType: "", location: "", startDate: "", endDate: "",
  responsibilities: "", achievements: "", technologies: "",
});
const blankProject = (): ProjectItem => ({
  name: "", description: "", role: "", technologies: "", responsibilities: "", highlights: "", url: "",
});
const blankEducation = (): EducationItem => ({
  degree: "", institution: "", location: "", startYear: "", endYear: "", grade: "", details: "",
});
const blankCertification = (): CertificationItem => ({ name: "", issuer: "", year: "", url: "" });

const initialForm: FormState = {
  mode: "experienced",
  name: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  portfolio: "",
  targetRole: "",
  jobDescription: "",
  improvementInstructions: "",
  skills: [{ category: "Frontend", skills: "" }],
  experience: [blankExperience()],
  projects: [blankProject()],
  education: [blankEducation()],
  certifications: [],
};

const styles = `
*{box-sizing:border-box}
.rb{min-height:100vh;background:#f7f5f1;color:#211c20;padding:34px 22px 70px;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
.rb-wrap{max-width:1240px;margin:0 auto}
.rb-head{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;margin-bottom:28px}
.rb-kicker{font-size:11px;letter-spacing:2.5px;font-weight:800;color:#8f1239}
.rb-head h1{font-family:Georgia,serif;font-weight:500;font-size:clamp(32px,4vw,48px);letter-spacing:-1.3px;margin:9px 0 7px}
.rb-head p{margin:0;color:#756c70;font-size:14px;line-height:1.7;max-width:690px}
.rb-tag{background:#fff;border:1px solid #e9e0dc;border-radius:30px;padding:9px 13px;font-size:11px;color:#62565b;white-space:nowrap}
.rb-grid{display:grid;grid-template-columns:minmax(0,1fr) 320px;gap:22px;align-items:start}
.rb-stack{display:flex;flex-direction:column;gap:15px}
.rb-card,.rb-aside{background:#fffdf9;border:1px solid #e9e2dc;border-radius:16px;padding:22px;box-shadow:0 8px 28px rgba(40,25,28,.035)}
.rb-card-head{display:flex;justify-content:space-between;gap:15px;align-items:flex-start;margin-bottom:18px}
.rb-card h2{font-size:16px;margin:0 0 5px;font-weight:750;letter-spacing:-.2px}
.rb-sub{margin:0;color:#8a8082;font-size:12px;line-height:1.6}
.rb-count{font-size:10px;color:#9a858b;letter-spacing:1px;font-weight:800}
.rb-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.rb-field{min-width:0}
.rb-field.full{grid-column:1/-1}
.rb-field label{display:block;font-size:11px;font-weight:750;color:#574d51;margin-bottom:7px}
.rb-field input,.rb-field textarea,.rb-field select{width:100%;border:1px solid #e3dbd7;border-radius:9px;background:#fffefa;color:#292328;padding:11px 12px;font:inherit;font-size:12px;outline:none;transition:.18s}
.rb-field input,.rb-field select{height:42px}
.rb-field textarea{min-height:82px;resize:vertical;line-height:1.6}
.rb-field input:focus,.rb-field textarea:focus,.rb-field select:focus{border-color:#9a3156;box-shadow:0 0 0 3px rgba(143,18,57,.08)}
.rb-field input::placeholder,.rb-field textarea::placeholder{color:#b2a8a8}
.rb-mode{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:4px}
.rb-mode button{border:1px solid #e5dcd8;border-radius:10px;padding:12px 9px;text-align:left;background:#fff;color:#655b5e;cursor:pointer}
.rb-mode button.active{border-color:#8f1239;background:#fbf0f3;color:#7d1538;box-shadow:inset 0 0 0 1px #8f1239}
.rb-mode strong{display:block;font-size:12px;margin-bottom:4px}
.rb-mode small{display:block;font-size:10px;line-height:1.4;opacity:.8}
.rb-entry{border:1px solid #eee7e2;background:#fffefa;border-radius:12px;padding:15px;margin-top:12px}
.rb-entry-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:13px}
.rb-entry-top strong{font-size:12px}
.rb-linkbtn{border:0;background:transparent;color:#8f1239;font-weight:750;font-size:11px;cursor:pointer;padding:5px}
.rb-add{border:1px dashed #c9aab5;background:#fff9fb;color:#8f1239;border-radius:9px;padding:10px 13px;font-size:11px;font-weight:750;cursor:pointer;margin-top:12px}
.rb-aside{position:sticky;top:20px}
.rb-spark{width:42px;height:42px;border-radius:13px;background:#f8e9ef;color:#8f1239;display:grid;place-items:center;font-size:22px;margin-bottom:14px}
.rb-aside h3{font-family:Georgia,serif;font-size:23px;font-weight:500;margin:0 0 8px}
.rb-aside p{font-size:12px;color:#82777a;line-height:1.7;margin:0}
.rb-points{list-style:none;margin:18px 0;padding:0}
.rb-points li{font-size:11px;color:#61575b;padding:9px 0;border-bottom:1px solid #f0eae6}
.rb-points span{color:#8f1239;font-weight:900;margin-right:8px}
.rb-btn{border:0;border-radius:9px;padding:12px 16px;font-size:12px;font-weight:800;cursor:pointer;transition:.18s}
.rb-primary{background:#8f1239;color:#fff;width:100%}
.rb-primary:hover{background:#690d2b}
.rb-primary:disabled{opacity:.5;cursor:not-allowed}
.rb-secondary{background:#fff;border:1px solid #e3dad6;color:#51474b}
.rb-dark{background:#211b20;color:#fff}
.rb-alert{padding:12px 14px;border-radius:9px;font-size:12px;margin-bottom:15px}
.rb-error{background:#fff0f0;border:1px solid #f4caca;color:#9d2632}
.rb-success{background:#edf8f0;border:1px solid #cde8d4;color:#286642}
.rb-hint{font-size:10px;color:#9b9092;line-height:1.6;margin-top:12px}
.rb-preview-head{display:flex;justify-content:space-between;gap:15px;align-items:center;margin-bottom:18px}
.rb-preview-head h2{font-size:20px;margin:0 0 5px}
.rb-preview-head p{font-size:12px;color:#8a8082;margin:0}
.rb-actions{display:flex;gap:8px;flex-wrap:wrap}
.rb-template{display:flex;align-items:center;gap:8px;margin-bottom:15px}
.rb-template label{font-size:11px;font-weight:750;color:#665b5f}
.rb-template select{height:36px;border:1px solid #e2d9d5;border-radius:8px;padding:0 10px;background:white;font-size:11px}
.rb-paper{width:100%;max-width:900px;margin:0 auto;background:white;min-height:1050px;padding:52px 58px;box-shadow:0 10px 40px rgba(35,20,25,.09);border:1px solid #e9e5e2;color:#242126}
.rb-paper.minimal{font-family:Arial,sans-serif}
.rb-paper.executive{border-top:8px solid #8f1239}
.rb-paper.modern{border-top:5px solid #8f1239}
.rb-res-head{text-align:center;border-bottom:1px solid #ded8d8;padding-bottom:19px;margin-bottom:22px}
.rb-paper.minimal .rb-res-head{text-align:left}
.rb-paper.executive .rb-res-head{text-align:left;border-bottom:2px solid #262126}
.rb-res-name{font-family:Georgia,serif;font-size:32px;line-height:1.15;letter-spacing:-.5px;margin:0 0 6px;font-weight:600}
.rb-res-role{font-size:13px;color:#8f1239;font-weight:750;letter-spacing:.8px;text-transform:uppercase}
.rb-res-contact{display:flex;justify-content:center;flex-wrap:wrap;gap:6px 15px;margin-top:12px;font-size:10px;color:#655d60}
.rb-paper.minimal .rb-res-contact,.rb-paper.executive .rb-res-contact{justify-content:flex-start}
.rb-res-section{margin-top:20px;break-inside:avoid}
.rb-res-section h3{font-size:10px;letter-spacing:1.7px;color:#8f1239;margin:0 0 9px;padding-bottom:6px;border-bottom:1px solid #e7dfe1;font-weight:800}
.rb-summary{font-size:11px;line-height:1.7;color:#403a3e;white-space:pre-wrap}
.rb-skill-line{font-size:10.5px;line-height:1.7;margin:4px 0;color:#393337}
.rb-skill-line strong{color:#272126}
.rb-res-item{margin:0 0 13px;break-inside:avoid}
.rb-res-item-head{display:flex;justify-content:space-between;gap:12px;align-items:baseline}
.rb-res-item h4{font-size:11.5px;margin:0;font-weight:800;color:#292329}
.rb-res-meta{font-size:9.5px;color:#786e72;text-align:right}
.rb-res-item p{font-size:10.5px;line-height:1.6;margin:4px 0;color:#4c4448;white-space:pre-wrap}
.rb-res-item ul{margin:5px 0 0;padding-left:17px}
.rb-res-item li{font-size:10.5px;line-height:1.55;color:#40393d;margin:2px 0}
.rb-tech{font-size:9.5px;color:#766a70;margin-top:5px}
.rb-edit{width:100%;border:1px solid transparent;background:transparent;padding:3px 4px;border-radius:4px;font:inherit;color:inherit;outline:none}
.rb-edit:focus{border-color:#d6a9b9;background:#fffafd}
.rb-print-value{display:none}
.rb-editarea{width:100%;border:1px solid #eadfe3;border-radius:6px;padding:7px;font:inherit;font-size:10.5px;line-height:1.6;resize:vertical;color:#393337}
.rb-quality{display:grid;grid-template-columns:100px 1fr;gap:15px;align-items:center;background:#fff;border:1px solid #e9e2dc;border-radius:12px;padding:15px;margin:0 auto 15px;max-width:900px}
.rb-score{font-family:Georgia,serif;font-size:29px;color:#8f1239;text-align:center}
.rb-score small{display:block;font:9px Arial;color:#8a8082;letter-spacing:1px}
.rb-quality strong{font-size:11px}
.rb-quality p{font-size:10px;color:#807579;line-height:1.5;margin:4px 0}
.my-divider {
  border: 0;
  border-top: 1px solid #e5e7eb;
  margin: 16px 0;
}
.rb-missing{max-width:900px;margin:12px auto;color:#806b40;background:#fff9e9;border:1px solid #efe2bb;border-radius:9px;padding:12px;font-size:11px}
@media(max-width:900px){.rb-grid{grid-template-columns:1fr}.rb-aside{position:static}.rb-head{align-items:flex-start;flex-direction:column}}
@media(max-width:600px){.rb{padding:22px 12px 45px}.rb-card,.rb-aside{padding:16px}.rb-fields{grid-template-columns:1fr}.rb-field.full{grid-column:auto}.rb-mode{grid-template-columns:1fr}.rb-paper{padding:28px 20px;min-height:0}.rb-res-name{font-size:25px}.rb-preview-head{align-items:flex-start;flex-direction:column}.rb-quality{grid-template-columns:70px 1fr}}
@media print{
 @page{size:A4;margin:0}
 html,
body {
  margin: 0 !important;
  padding: 0 !important;
}

#resume-print {
  break-after: auto !important;
  page-break-after: auto !important;
}

#resume-print .rb-res-section {
  break-inside: avoid;
  page-break-inside: avoid;
}
 body *{visibility:hidden!important}
 #resume-print,#resume-print *{visibility:visible!important}
#resume-print {
  position: absolute !important;
  left: 0 !important;
  top: 0 !important;

  width: 210mm !important;
  max-width: 210mm !important;
  min-height: 0 !important;
  height: auto !important;

  margin: 0 !important;
  padding: 14mm 16mm !important;

  box-sizing: border-box !important;
  border: none !important;
  box-shadow: none !important;
  overflow: visible !important;
}
  .rb {
  padding: 0 !important;
  min-height: 0 !important;
}

.rb-wrap {
  width: 100% !important;
  max-width: none !important;
  margin: 0 !important;
}

#resume-print .rb-res-item-head {
  display: flex !important;
  justify-content: space-between !important;
  align-items: baseline !important;
  gap: 12px !important;
}

#resume-print .rb-res-meta {
  text-align: right !important;
}
 #resume-print .rb-edit,#resume-print .rb-editarea{display:none!important}
 #resume-print .rb-print-value {
  display: block !important;
  white-space: pre-wrap;
}

#resume-print .rb-skill-line .rb-print-value {
  display: inline !important;
  white-space: normal !important;
}
 .no-print{display:none!important}
}
`;

function splitLines(value: string) {
  return value.split(/\n|,/).map((v) => v.trim()).filter(Boolean);
}

function splitBullets(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((line) =>
      line.trim().replace(/^(?:[•*-]|\d+[.)])\s*/, "")
    )
    .filter(Boolean);
}

function joinLines(value: unknown) {
  return Array.isArray(value) ? value.join("\n") : "";
}
function asText(value: unknown) {
  return typeof value === "string" ? value : "";
}
function cleanContent(value: any): ResumeContent {
  return {
    professionalSummary: asText(value?.professionalSummary),
    technicalSkills: Array.isArray(value?.technicalSkills) ? value.technicalSkills : [],
    experience: Array.isArray(value?.experience) ? value.experience : [],
    projects: Array.isArray(value?.projects) ? value.projects : [],
    education: Array.isArray(value?.education) ? value.education : [],
    certifications: Array.isArray(value?.certifications) ? value.certifications : [],
    missingDetails: Array.isArray(value?.missingDetails) ? value.missingDetails : [],
  };
}

function toInputText(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  return "";
}

function toTextarea(value: unknown): string {
  if (Array.isArray(value)) {
    return value
      .filter((item) => typeof item === "string")
      .join("\n");
  }

  return toInputText(value);
}

function mapSavedResumeToForm(resume: any): FormState {
  const source = resume?.sourceDetails || {};
  const personal = source.personalDetails || resume?.personalDetails || {};

  const skills = Array.isArray(source.skills)
    ? source.skills.map((item: any) => ({
        category: toInputText(item.category),
        skills: Array.isArray(item.skills)
          ? item.skills.join(", ")
          : toInputText(item.skills),
      }))
    : [];

  const experience = Array.isArray(source.experience)
    ? source.experience.map((item: any) => ({
        company: toInputText(item.company),
        role: toInputText(item.role),
        employmentType: toInputText(item.employmentType),
        location: toInputText(item.location),
        startDate: toInputText(item.startDate),
        endDate: toInputText(item.endDate),
        responsibilities: toTextarea(item.responsibilities),
        achievements: toTextarea(item.achievements),
        technologies: toTextarea(item.technologies),
      }))
    : [];

  const projects = Array.isArray(source.projects)
    ? source.projects.map((item: any) => ({
        name: toInputText(item.name),
        description: toInputText(item.description),
        role: toInputText(item.role),
        technologies: toTextarea(item.technologies),
        responsibilities: toTextarea(item.responsibilities),
        highlights: toTextarea(item.highlights),
        url: toInputText(item.url),
      }))
    : [];

  const education = Array.isArray(source.education)
    ? source.education.map((item: any) => ({
        degree: toInputText(item.degree),
        institution: toInputText(item.institution),
        location: toInputText(item.location),
        startYear: toInputText(item.startYear),
        endYear: toInputText(item.endYear),
        grade: toInputText(item.grade),
        details: toInputText(item.details),
      }))
    : [];

  const certifications = Array.isArray(source.certifications)
    ? source.certifications.map((item: any) => ({
        name: toInputText(item.name),
        issuer: toInputText(item.issuer),
        year: toInputText(item.year),
        url: toInputText(item.url),
      }))
    : [];

  return {
    mode: ["fresher", "experienced", "job_specific"].includes(source.mode)
      ? source.mode
      : "experienced",

    name: toInputText(personal.name),
    email: toInputText(personal.email),
    phone: toInputText(personal.phone),
    location: toInputText(personal.location),
    linkedin: toInputText(personal.linkedin),
    github: toInputText(personal.github),
    portfolio: toInputText(personal.portfolio),

    targetRole: toInputText(source.targetRole || resume?.targetRole),
    jobDescription: toInputText(source.jobDescription),

    skills: skills.length ? skills : [{ category: "Frontend", skills: "" }],
    experience: experience.length ? experience : [blankExperience()],
    projects: projects.length ? projects : [blankProject()],
    education: education.length ? education : [blankEducation()],
    certifications,
    improvementInstructions: toInputText(source.improvementInstructions),
  };
}

function mapResumeContentToForm(resume: any): FormState {
  const sourceForm = mapSavedResumeToForm(resume);
  const content = cleanContent(resume?.content);

  return {
    ...sourceForm,

    skills: content.technicalSkills.length
      ? content.technicalSkills.map((group) => ({
          category: group.category,
          skills: group.skills.join(", "),
        }))
      : sourceForm.skills,

    experience: content.experience.length
      ? content.experience.map((item, index) => {
          const original = sourceForm.experience[index];

          return {
            ...blankExperience(),
            ...original,
            company: item.company || original?.company || "",
            role: item.role || original?.role || "",
            location: item.location || original?.location || "",
            responsibilities: item.bullets.join("\n"),
          };
        })
      : sourceForm.experience,

    projects: content.projects.length
      ? content.projects.map((item, index) => {
          const original = sourceForm.projects[index];

          return {
            ...blankProject(),
            ...original,
            name: item.name || original?.name || "",
            description: item.description || original?.description || "",
            technologies: item.technologies.join(", "),
            responsibilities: item.bullets.join("\n"),
            url: item.url || original?.url || "",
          };
        })
      : sourceForm.projects,

    education: content.education.length
      ? content.education.map((item, index) => {
          const original = sourceForm.education[index];

          return {
            ...blankEducation(),
            ...original,
            degree: item.degree || original?.degree || "",
            institution: item.institution || original?.institution || "",
            details: item.details || original?.details || "",
          };
        })
      : sourceForm.education,

    certifications: content.certifications.length
      ? content.certifications.map((item, index) => ({
          ...blankCertification(),
          ...sourceForm.certifications[index],
          name: item.name || "",
          issuer: item.issuer || "",
          year: item.year || "",
        }))
      : sourceForm.certifications,
  };
}


export default function ResumeBuilderPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [resume, setResume] = useState<ResumeRecord | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [template, setTemplate] = useState("modern");
const [enhancing, setEnhancing] = useState(false);
const [enhancement, setEnhancement] = useState<EnhancementResult | null>(null);
const [enhancementInstructions, setEnhancementInstructions] = useState("");
const [selectedEnhancementSections, setSelectedEnhancementSections] =
  useState<EnhancementSection[]>([
    "summary",
    "skills",
    "experience",
    "projects",
    "education",
    "certifications",
  ]);

const [acceptedSections, setAcceptedSections] = useState<EnhancementSection[]>([
  "summary",
  "skills",
  "experience",
  "projects",
  "education",
  "certifications",
]);

const [confirmedSkills, setConfirmedSkills] = useState<string[]>([]);



useEffect(() => {
  let active = true;

async function loadProfile() {
  try {
    const [profileResponse, resumesResponse] = await Promise.all([
      fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      }),
      fetch("/api/resume-builder", {
        credentials: "include",
        cache: "no-store",
      }),
    ]);

    if (!profileResponse.ok) {
      throw new Error("Unable to load profile.");
    }

    if (!resumesResponse.ok) {
      throw new Error("Unable to load saved resumes.");
    }

    const profileData = await profileResponse.json();
    const resumesData = await resumesResponse.json();

    if (!active) return;

    const user = profileData.user || {};

    const profile = {
      name: user.name || user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      location: user.location || "",
      targetRole: user.targetRole || user.currentRole || "",
    };

    const savedResumes = Array.isArray(resumesData.resumes)
      ? resumesData.resumes
      : [];

    const latestResume = savedResumes
      .filter((item: any) => item?.id && item?.content)
      .sort(
        (a: any, b: any) =>
          Number(b.updatedAt || b.createdAt || 0) -
          Number(a.updatedAt || a.createdAt || 0)
      )[0];

    if (latestResume) {
      const restoredForm = mapSavedResumeToForm(latestResume);

      setResume({
        ...latestResume,
        content: cleanContent(latestResume.content),
      });

      setTemplate(latestResume.templateId || "modern");

      setForm({
        ...restoredForm,
        name: restoredForm.name || profile.name,
        email: restoredForm.email || profile.email,
        phone: restoredForm.phone || profile.phone,
        location: restoredForm.location || profile.location,
        targetRole: restoredForm.targetRole || profile.targetRole,
      });

      setNotice("Your latest saved resume has been restored.");
    } else {
      setResume(null);

      setForm((old) => ({
        ...old,
        ...profile,
        skills:
          Array.isArray(user.skills) && user.skills.length
            ? [{
                category: "Skills",
                skills: user.skills.join(", "),
              }]
            : old.skills,
      }));
    }
  } catch (error) {
    console.error("Resume restoration error:", error);

    if (active) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to restore your saved resume."
      );
    }
  } finally {
    if (active) {
      setLoadingProfile(false);
    }
  }
}

  loadProfile();

  return () => {
    active = false;
  };
}, []);


async function enhanceResume() {
  console.log("Resume object:", resume);
  console.log("Resume ID:", resume?.id);

  const resumeId = resume?.id;

  if (
    !resumeId ||
    resumeId === "undefined" ||
    resumeId === "null"
  ) {
    setError("Resume ID is missing. Please generate or load your resume again.");
    return;
  }

  if (!selectedEnhancementSections.length) {
    setError("Select at least one section to improve.");
    return;
  }

  setEnhancing(true);
  setError("");
  setNotice("");
  setEnhancement(null);
  setConfirmedSkills([]);

  try {
    const response = await fetch(
      `/api/resume-builder/${encodeURIComponent(resume.id)}/enhance`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sections: selectedEnhancementSections,
          instructions: enhancementInstructions,
          currentContent: resume.content,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to enhance resume.");
    }

    if (!data.proposedContent) {
      throw new Error("AI returned an incomplete enhancement.");
    }

    setEnhancement({
      proposedContent: cleanContent(data.proposedContent),
      skillSuggestions: Array.isArray(data.skillSuggestions)
        ? data.skillSuggestions
        : [],
      recommendations: Array.isArray(data.recommendations)
        ? data.recommendations
        : [],
      changeSummary: Array.isArray(data.changeSummary)
        ? data.changeSummary
        : [],
      requiresReview: true,
    });

    setAcceptedSections([...selectedEnhancementSections]);
    setNotice("AI improvements are ready. Review them before applying.");
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Unable to enhance resume."
    );
  } finally {
    setEnhancing(false);
  }
}

function applyEnhancements() {
  if (!resume || !enhancement) return;

  const proposed = enhancement.proposedContent;
  const current = resume.content;

  // Identify AI-suggested skills.
  const suggestedSkillNames = new Set(
    enhancement.skillSuggestions.map((item: any) =>
      String(
        typeof item === "string"
          ? item
          : item.skill || item.name || item.title || ""
      )
        .trim()
        .toLowerCase()
    ).filter(Boolean)
  );

  // Only explicitly confirmed suggestions are allowed.
  const confirmedSet = new Set(
    confirmedSkills.map((skill) => skill.trim().toLowerCase())
  );

  const updated: ResumeContent = {
    ...current,

    professionalSummary: acceptedSections.includes("summary")
      ? proposed.professionalSummary
      : current.professionalSummary,

    technicalSkills: acceptedSections.includes("skills")
      ? proposed.technicalSkills.map((group) => ({
          ...group,
          skills: group.skills.filter((skill) => {
            const normalized = skill.trim().toLowerCase();

            // Keep existing/non-suggested skills.
            // Keep suggested skills only when confirmed.
            return (
              !suggestedSkillNames.has(normalized) ||
              confirmedSet.has(normalized)
            );
          }),
        }))
      : current.technicalSkills.map((group) => ({
          ...group,
          skills: [...group.skills],
        })),

    experience: acceptedSections.includes("experience")
      ? proposed.experience
      : current.experience,

    projects: acceptedSections.includes("projects")
      ? proposed.projects
      : current.projects,

    education: acceptedSections.includes("education")
      ? proposed.education
      : current.education,

    certifications: acceptedSections.includes("certifications")
      ? proposed.certifications
      : current.certifications,

    missingDetails: proposed.missingDetails,
  };

  // Add explicitly confirmed skills.
  if (acceptedSections.includes("skills") && confirmedSkills.length) {
    const existing = new Set(
      updated.technicalSkills.flatMap((group) =>
        group.skills.map((skill) => skill.trim().toLowerCase())
      )
    );

    const additions = confirmedSkills.filter(
      (skill) => !existing.has(skill.trim().toLowerCase())
    );

    if (additions.length) {
      const existingGroup = updated.technicalSkills.find(
        (group) => group.category === "Additional Skills"
      );

      if (existingGroup) {
        existingGroup.skills.push(...additions);
      } else {
        updated.technicalSkills.push({
          category: "Additional Skills",
          skills: additions,
        });
      }
    }
  }

 const updatedResume = {
  ...resume,
  content: updated,
};

setResume(updatedResume);
setForm(mapResumeContentToForm(updatedResume));

  setEnhancement(null);

  setNotice(
    "Selected AI improvements have been applied. Save changes to store your updated resume."
  );
}
function discardEnhancements() {
  setEnhancement(null);
  setConfirmedSkills([]);
  setNotice("AI suggestions discarded. Your original resume is unchanged.");
}





  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((old) => ({ ...old, [key]: value }));

  function updateList<K extends "skills" | "experience" | "projects" | "education" | "certifications">(
    key: K, index: number, field: string, value: string
  ) {
    setForm((old) => {
      const items = [...old[key]] as any[];
      items[index] = { ...items[index], [field]: value };
      return { ...old, [key]: items } as FormState;
    });
  }
  function addItem(key: "skills" | "experience" | "projects" | "education" | "certifications") {
    const factories = {
      skills: () => ({ category: "", skills: "" }),
      experience: blankExperience, projects: blankProject,
      education: blankEducation, certifications: blankCertification,
    };
    setForm((old) => ({ ...old, [key]: [...old[key], factories[key]()] }) as FormState);
  }
  function removeItem(key: "skills" | "experience" | "projects" | "education" | "certifications", index: number) {
    setForm((old) => ({ ...old, [key]: old[key].filter((_, i) => i !== index) }) as FormState);
  }

  async function generateResume() {
    setError(""); setNotice("");
    if (!form.name.trim() || !form.email.trim() || !form.targetRole.trim()) {
      setError("Add your name, email address and target role to continue."); return;
    }
    if (form.mode === "job_specific" && !form.jobDescription.trim()) {
      setError("Add the job description to create a job-specific resume."); return;
    }
    const payload = {
      mode: form.mode,
      personalDetails: {
        name: form.name, email: form.email, phone: form.phone, location: form.location,
        linkedin: form.linkedin, github: form.github, portfolio: form.portfolio,
      },
      targetRole: form.targetRole,
      jobDescription: form.jobDescription,
      skills: form.skills.filter((x) => x.category.trim() || x.skills.trim()).map((x) => ({
        category: x.category, skills: splitLines(x.skills),
      })),
      experience: form.experience.filter((x) => x.company || x.role || x.responsibilities || x.achievements).map((x) => ({
        ...x, responsibilities: splitBullets(x.responsibilities), achievements: splitBullets(x.achievements),
        technologies: splitLines(x.technologies),
      })),
      projects: form.projects.filter((x) => x.name || x.description || x.responsibilities || x.highlights).map((x) => ({
        ...x, technologies: splitLines(x.technologies),
        responsibilities: splitBullets(x.responsibilities), highlights: splitBullets(x.highlights),
      })),
      education: form.education.filter((x) => x.degree || x.institution).map((x) => x),
      certifications: form.certifications.filter((x) => x.name || x.issuer).map((x) => x),
      improvementInstructions: form.improvementInstructions.trim(),
    };
    if (!payload.skills.length && !payload.experience.length && !payload.projects.length && !payload.education.length) {
      setError("Add at least one skill, work experience, project or education entry."); return;
    }
    setGenerating(true);
    try {
      const response = await fetch("/api/resume-builder/generate", {
        method: "POST", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Resume generation failed.");
      const record = data.resume;
      if (!record?.id || !record?.content) throw new Error("The server returned an incomplete resume.");
      setTemplate(record.templateId || "modern");
      setResume({ ...record, content: cleanContent(record.content) });
      setNotice("Your resume is ready. Review every section before downloading.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to generate your resume.");
    } finally { setGenerating(false); }
  }

  function updateContent<K extends keyof ResumeContent>(key: K, value: ResumeContent[K]) {
    setResume((old) => old ? { ...old, content: { ...old.content, [key]: value } } : old);
  }
  function updateArrayItem(
    key: "experience" | "projects" | "education" | "technicalSkills" | "certifications",
    index: number, patch: Record<string, any>
  ) {
    setResume((old) => {
      if (!old) return old;
      const items = [...(old.content[key] as any[])];
      items[index] = { ...items[index], ...patch };
      return { ...old, content: { ...old.content, [key]: items } };
    });
  }

  async function saveResume() {
    if (!resume?.id) return;
    setSaving(true); setError(""); setNotice("");
    try {
      const response = await fetch(`/api/resume-builder/${encodeURIComponent(resume.id)}`, {
        method: "PUT", credentials: "include", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${resume.targetRole} Resume`, targetRole: resume.targetRole,
          templateId: template, content: resume.content,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to save your resume.");
      setResume((old) => old ? { ...old, ...(data.resume || {}), content: cleanContent(data.resume?.content || old.content) } : old);
      setNotice("Your changes have been saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save your resume.");
    } finally { setSaving(false); }
  }

  function resetToForm() { setResume(null); setError(""); setNotice(""); }
  function downloadPDF() { window.print(); }

  return (
    <>
      <style>{styles}</style>
      <main className="rb">
        <div className="rb-wrap">
          <header className="rb-head no-print">
            <div>
              <div className="rb-kicker">STRYVEXI / CAREER TOOLS</div>
              <h1>Your experience deserves a better resume.</h1>
              <p>Build a recruiter-ready resume from your own information. Stryvexi improves the writing and structure without adding fictional experience or achievements.</p>
            </div>
            <div className="rb-tag">✦ AI-ASSISTED · YOU STAY IN CONTROL</div>
          </header>

          {error && <div className="rb-alert rb-error no-print">{error}</div>}
          {notice && <div className="rb-alert rb-success no-print">{notice}</div>}

          {!resume ? (
            <div className="rb-grid">
              <div className="rb-stack">
                <section className="rb-card">
                  <div className="rb-card-head"><div><h2>Choose your resume goal</h2><p className="rb-sub">The writing approach changes based on the opportunity you're targeting.</p></div><span className="rb-count">01 / 06</span></div>
                  <div className="rb-mode">
                    {([
                      ["fresher", "Fresher", "Lead with education, skills and projects."],
                      ["experienced", "Experienced", "Show career progression and impact."],
                      ["job_specific", "Target a job", "Tailor your resume to a job description."],
                    ] as const).map(([value, title, desc]) => (
                      <button type="button" key={value} className={form.mode === value ? "active" : ""} onClick={() => update("mode", value)}>
                        <strong>{title}</strong><small>{desc}</small>
                      </button>
                    ))}
                  </div>
                  {form.mode === "job_specific" && <div className="rb-fields" style={{ marginTop: 15 }}><Field label="Job description *" full><textarea value={form.jobDescription} onChange={(e) => update("jobDescription", e.target.value)} placeholder="Paste the job description. Stryvexi will match only the skills and experience you actually provide." rows={7}/></Field></div>}
                </section>

                <section className="rb-card">
                  <CardHead count="02 / 06" title="Personal information" desc="Prefilled from your Stryvexi account where available. All fields remain editable."/>
                  {loadingProfile && <p className="rb-sub">Loading your profile…</p>}
                  <div className="rb-fields">
                    <Field label="Full name *"><input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your full name"/></Field>
                    <Field label="Email address *"><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com"/></Field>
                    <Field label="Phone"><input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91…"/></Field>
                    <Field label="Location"><input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="City, Country"/></Field>
                    <Field label="Target job role *"><input value={form.targetRole} onChange={(e) => update("targetRole", e.target.value)} placeholder="e.g. Full Stack Developer"/></Field>
                    <Field label="LinkedIn URL"><input value={form.linkedin} onChange={(e) => update("linkedin", e.target.value)} placeholder="linkedin.com/in/…"/></Field>
                    <Field label="GitHub URL"><input value={form.github} onChange={(e) => update("github", e.target.value)} placeholder="github.com/…"/></Field>
                    <Field label="Portfolio / Website"><input value={form.portfolio} onChange={(e) => update("portfolio", e.target.value)} placeholder="yourportfolio.com"/></Field>
                  </div>
                </section>

                <section className="rb-card">
                  <CardHead count="03 / 06" title="Technical skills" desc="Group related skills. Add only technologies and tools you can confidently discuss."/>
                  {form.skills.map((item, i) => <div className="rb-entry" key={i}>
                    <div className="rb-entry-top"><strong>Skill group {i + 1}</strong>{form.skills.length > 1 && <button className="rb-linkbtn" type="button" onClick={() => removeItem("skills", i)}>Remove</button>}</div>
                    <div className="rb-fields">
                      <Field label="Category"><input value={item.category} onChange={(e) => updateList("skills", i, "category", e.target.value)} placeholder="Frontend, Backend, Databases…"/></Field>
                      <Field label="Skills (comma or new-line separated)"><textarea rows={2} value={item.skills} onChange={(e) => updateList("skills", i, "skills", e.target.value)} placeholder="React, Next.js, TypeScript"/></Field>
                    </div>
                  </div>)}
                  <button type="button" className="rb-add" onClick={() => addItem("skills")}>+ Add skill category</button>
                </section>

                <section className="rb-card">
                  <CardHead count="04 / 06" title="Work experience" desc="Describe what you did, the systems you worked on, and any outcomes you can substantiate. Leave unknown fields blank."/>
                  {form.experience.map((item, i) => <div className="rb-entry" key={i}>
                    <div className="rb-entry-top"><strong>Experience {i + 1}</strong>{form.experience.length > 1 && <button type="button" className="rb-linkbtn" onClick={() => removeItem("experience", i)}>Remove</button>}</div>
                    <div className="rb-fields">
                      <Field label="Company"><input value={item.company} onChange={(e) => updateList("experience", i, "company", e.target.value)} placeholder="Company name"/></Field>
                      <Field label="Job title"><input value={item.role} onChange={(e) => updateList("experience", i, "role", e.target.value)} placeholder="Your designation"/></Field>
                      <Field label="Employment type"><input value={item.employmentType} onChange={(e) => updateList("experience", i, "employmentType", e.target.value)} placeholder="Full-time, Contract…"/></Field>
                      <Field label="Location"><input value={item.location} onChange={(e) => updateList("experience", i, "location", e.target.value)} placeholder="City / Remote"/></Field>
                      <Field label="Start date"><input value={item.startDate} onChange={(e) => updateList("experience", i, "startDate", e.target.value)} placeholder="MM/YYYY"/></Field>
                      <Field label="End date"><input value={item.endDate} onChange={(e) => updateList("experience", i, "endDate", e.target.value)} placeholder="MM/YYYY or Present"/></Field>
                      <Field label="Responsibilities" full><textarea rows={4} value={item.responsibilities} onChange={(e) => updateList("experience", i, "responsibilities", e.target.value)} placeholder={"What did you build, maintain, improve or support?\nOne responsibility per line."}/></Field>
                      <Field label="Achievements / outcomes" full><textarea rows={3} value={item.achievements} onChange={(e) => updateList("experience", i, "achievements", e.target.value)} placeholder={"What changed because of your work? Add verified numbers only if you know them."}/></Field>
                      <Field label="Technologies used" full><input value={item.technologies} onChange={(e) => updateList("experience", i, "technologies", e.target.value)} placeholder="React, Node.js, PostgreSQL…"/></Field>
                    </div>
                  </div>)}
                  <button type="button" className="rb-add" onClick={() => addItem("experience")}>+ Add another role</button>
                </section>

                <section className="rb-card">
                  <CardHead count="05 / 06" title="Projects" desc="Include projects you actually contributed to. Explain your role, technical work and the product's purpose."/>
                  {form.projects.map((item, i) => <div className="rb-entry" key={i}>
                    <div className="rb-entry-top"><strong>Project {i + 1}</strong>{form.projects.length > 1 && <button type="button" className="rb-linkbtn" onClick={() => removeItem("projects", i)}>Remove</button>}</div>
                    <div className="rb-fields">
                      <Field label="Project name"><input value={item.name} onChange={(e) => updateList("projects", i, "name", e.target.value)} placeholder="Project name"/></Field>
                      <Field label="Your role"><input value={item.role} onChange={(e) => updateList("projects", i, "role", e.target.value)} placeholder="Frontend Developer…"/></Field>
                      <Field label="Project description" full><textarea rows={3} value={item.description} onChange={(e) => updateList("projects", i, "description", e.target.value)} placeholder="What does the project do? Describe it in your own words."/></Field>
                      <Field label="Your contributions" full><textarea rows={3} value={item.responsibilities} onChange={(e) => updateList("projects", i, "responsibilities", e.target.value)} placeholder="What features, modules or technical work did you personally deliver?"/></Field>
                      <Field label="Outcomes / highlights" full><textarea rows={2} value={item.highlights} onChange={(e) => updateList("projects", i, "highlights", e.target.value)} placeholder="Verified outcomes, notable functionality or complexity."/></Field>
                      <Field label="Technologies"><input value={item.technologies} onChange={(e) => updateList("projects", i, "technologies", e.target.value)} placeholder="React, Node.js…"/></Field>
                      <Field label="Project URL"><input value={item.url} onChange={(e) => updateList("projects", i, "url", e.target.value)} placeholder="https://…"/></Field>
                    </div>
                  </div>)}
                  <button type="button" className="rb-add" onClick={() => addItem("projects")}>+ Add another project</button>
                </section>

                <section className="rb-card">
                  <CardHead count="06 / 06" title="Education & certifications" desc="Add your academic background and relevant certifications. These sections are optional where not applicable."/>
                  {form.education.map((item, i) => <div className="rb-entry" key={i}>
                    <div className="rb-entry-top"><strong>Education {i + 1}</strong>{form.education.length > 1 && <button type="button" className="rb-linkbtn" onClick={() => removeItem("education", i)}>Remove</button>}</div>
                    <div className="rb-fields">
                      <Field label="Degree"><input value={item.degree} onChange={(e) => updateList("education", i, "degree", e.target.value)} placeholder="B.Tech, B.Sc…"/></Field>
                      <Field label="Institution"><input value={item.institution} onChange={(e) => updateList("education", i, "institution", e.target.value)} placeholder="University / College"/></Field>
                      <Field label="Start year"><input value={item.startYear} onChange={(e) => updateList("education", i, "startYear", e.target.value)} placeholder="2019"/></Field>
                      <Field label="End year"><input value={item.endYear} onChange={(e) => updateList("education", i, "endYear", e.target.value)} placeholder="2022"/></Field>
                      <Field label="Grade (optional)"><input value={item.grade} onChange={(e) => updateList("education", i, "grade", e.target.value)} placeholder="CGPA / Percentage"/></Field>
                      <Field label="Location"><input value={item.location} onChange={(e) => updateList("education", i, "location", e.target.value)} placeholder="City"/></Field>
                      <Field label="Additional details" full><input value={item.details} onChange={(e) => updateList("education", i, "details", e.target.value)} placeholder="Relevant coursework, honors…"/></Field>
                    </div>
                  </div>)}
                  <button type="button" className="rb-add" onClick={() => addItem("education")}>+ Add education</button>
                  {form.certifications.map((item, i) => <div className="rb-entry" key={`cert-${i}`}>
                    <div className="rb-entry-top"><strong>Certification {i + 1}</strong><button type="button" className="rb-linkbtn" onClick={() => removeItem("certifications", i)}>Remove</button></div>
                    <div className="rb-fields">
                      <Field label="Certification"><input value={item.name} onChange={(e) => updateList("certifications", i, "name", e.target.value)} placeholder="Certification name"/></Field>
                      <Field label="Issuer"><input value={item.issuer} onChange={(e) => updateList("certifications", i, "issuer", e.target.value)} placeholder="Issuing organization"/></Field>
                      <Field label="Year"><input value={item.year} onChange={(e) => updateList("certifications", i, "year", e.target.value)} placeholder="2025"/></Field>
                      <Field label="Credential URL"><input value={item.url} onChange={(e) => updateList("certifications", i, "url", e.target.value)} placeholder="https://…"/></Field>
                    </div>
                  </div>)}
                  <button type="button" className="rb-add" onClick={() => addItem("certifications")}>+ Add certification</button>
                </section>
              </div>

              <aside className="rb-aside">
                <div className="rb-spark">✦</div>
                <h3>Make your next move count.</h3>
                <p>Our AI rewrites and organizes the details you provide into a clear, relevant resume. You review and approve every line.</p>
                <ul className="rb-points">
                  <li><span>✓</span> Strong, role-focused summary</li>
                  <li><span>✓</span> Clear achievement-led bullets</li>
                  <li><span>✓</span> Structured technical skills</li>
                  <li><span>✓</span> ATS-readable section hierarchy</li>
                  <li><span>✓</span> Editable professional templates</li>
                  <li><span>✓</span> Save and download as PDF</li>
                </ul>
                <button type="button" className="rb-btn rb-primary" disabled={generating || loadingProfile} onClick={generateResume}>
                  {generating ? "Building your resume…" : "Generate my resume →"}
                </button>
                <div className="rb-hint">AI will not invent employers, projects, qualifications, metrics or skills. Add detail where you can; blank information stays blank.</div>
              </aside>
            </div>
          ) : (
            <div>
              <div className="rb-preview-head no-print">
                <div><h2>Your resume preview</h2><p>Make edits, save your changes, then export your final PDF.</p></div>
                <div className="rb-actions">
                  <button className="rb-btn rb-secondary" type="button" onClick={resetToForm}>← Edit details</button>
                  <button className="rb-btn rb-secondary" type="button" onClick={saveResume} disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
                  <button className="rb-btn rb-dark" type="button" onClick={downloadPDF}>Download PDF ↓</button>
                  <button
  className="rb-btn rb-secondary"
  type="button"
  onClick={enhanceResume}
  disabled={enhancing || saving}
>
  {enhancing ? "Improving resume…" : "✦ AI Enhance Resume"}
</button>
                </div>
              </div>

<div className="rb-card no-print" style={{ maxWidth: 900, margin: "0 auto 16px" }}>
  <h2>✦ AI Resume Enhancement</h2>
  <p className="rb-sub">
    Improve your resume for your target role. Review all suggestions before applying.
  </p>

  <div className="rb-fields" style={{ marginTop: 14 }}>
    {([
      ["summary", "Professional summary"],
      ["skills", "Technical skills"],
      ["experience", "Work experience"],
      ["projects", "Projects"],
      ["education", "Education"],
      ["certifications", "Certifications"],
    ] as [EnhancementSection, string][]).map(([key, label]) => (
      <label key={key} style={{ fontSize: 12, display: "flex", gap: 8 }}>
        <input
          type="checkbox"
          checked={selectedEnhancementSections.includes(key)}
          onChange={(e) =>
            setSelectedEnhancementSections((old) =>
              e.target.checked
                ? [...old, key]
                : old.filter((item) => item !== key)
            )
          }
        />
        {label}
      </label>
    ))}
  </div>

  <Field label="Additional instructions (optional)" full>
    <textarea
      rows={4}
      value={enhancementInstructions}
      onChange={(e) => setEnhancementInstructions(e.target.value)}
      placeholder="Example: Improve ATS relevance for Senior React Developer roles, strengthen project contributions, highlight my actual technical ownership, and identify missing skills I should confirm."
    />
  </Field>

  <button
    className="rb-btn rb-primary"
    type="button"
    onClick={enhanceResume}
    disabled={enhancing || saving || selectedEnhancementSections.length === 0}
  >
    {enhancing ? "Analyzing and improving…" : "✦ Generate AI improvements"}
  </button>

  <p className="rb-hint">
    Suggestions are not applied automatically. Skills and other factual additions
    require your confirmation.
  </p>
</div>


              {resume.qualityReview && <div className="rb-quality no-print">
                <div className="rb-score">{resume.qualityReview.score ?? "—"}<small>AI REVIEW</small></div>
                <div><strong>Resume quality review</strong><p>{(resume.qualityReview.strengths || []).join(" · ") || "Review the content carefully before applying."}</p>{(resume.qualityReview.warnings || []).length > 0 && <p>Review: {(resume.qualityReview.warnings || []).join(" · ")}</p>}</div>
              </div>}

{enhancement && (
  <section className="rb-card no-print" style={{ maxWidth: 900, margin: "0 auto 16px" }}>
    <div className="rb-card-head">
      <div>
        <h2>✦ Review AI Improvements</h2>
        <p className="rb-sub">
          Compare the proposed improvements and choose which sections
          you want to apply. Your saved resume has not been changed yet.
        </p>
      </div>
      <span className="rb-count">REVIEW REQUIRED</span>
    </div>

    <div className="rb-entry">
      <strong>Section changes</strong>

      {([
        ["summary", "Professional Summary"],
        ["skills", "Technical Skills"],
        ["experience", "Work Experience"],
        ["projects", "Projects"],
        ["education", "Education"],
        ["certifications", "Certifications"],
      ] as [EnhancementSection, string][]).map(([key, label]) => (
        <label
          key={key}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 0",
            borderBottom: "1px solid #eee7e2",
            fontSize: 12,
          }}
        >
          <input
            type="checkbox"
            checked={acceptedSections.includes(key)}
            onChange={(e) =>
              setAcceptedSections((old) =>
                e.target.checked
                  ? [...old, key]
                  : old.filter((item) => item !== key)
              )
            }
          />
          **{label}**
        </label>
      ))}
    </div>

    {acceptedSections.includes("summary") && (
      <div className="rb-entry">
        <strong>Professional Summary</strong>
        <p className="rb-hint">Current version</p>
        <div className="rb-summary">{resume.content.professionalSummary || "Not provided"}</div>

        <hr className="my-divider" />

        <p className="rb-hint">AI proposal</p>
        <div className="rb-summary">
          {enhancement.proposedContent.professionalSummary || "No proposed changes"}
        </div>
      </div>
    )}

    {acceptedSections.includes("skills") && (
      <div className="rb-entry">
        <strong>Technical Skills</strong>

        <p className="rb-hint">Proposed skill categories</p>
        {enhancement.proposedContent.technicalSkills.map((group, i) => (
          <p key={i} className="rb-skill-line">
            <strong>{group.category}: </strong>
            {group.skills.join(", ")}
          </p>
        ))}

        {enhancement.skillSuggestions.length > 0 && (
          <>
            <hr className="my-divider" />
            <strong>Potential ATS skill additions</strong>
            <p className="rb-hint">
              Only confirm skills you genuinely know and can discuss in an interview.
            </p>

            {enhancement.skillSuggestions.map((item, i) => (
              <label
                key={`${item.skill}-${i}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 9,
                  padding: "9px 0",
                  fontSize: 12,
                  borderBottom: "1px solid #eee7e2",
                }}
              >
                <input
                  type="checkbox"
                  checked={confirmedSkills.includes(item.skill)}
                  onChange={(e) =>
                    setConfirmedSkills((old) =>
                      e.target.checked
                        ? [...old, item.skill]
                        : old.filter((skill) => skill !== item.skill)
                    )
                  }
                />
                <span>
                  <strong>{item.skill}</strong>
                  <br/>
                  <span style={{ color: "#82777a" }}>{item.reason}</span>
                  {item.evidenceNeeded && (
                    <span style={{ display: "block", color: "#9a7130", marginTop: 3 }}>
                      Confirm: {item.evidenceNeeded}
                    </span>
                  )}
                </span>
              </label>
            ))}
          </>
        )}
      </div>
    )}

    {acceptedSections.includes("experience") && (
      <div className="rb-entry">
        <strong>Work Experience</strong>
        {enhancement.proposedContent.experience.map((item, i) => (
          <div key={i} style={{ marginTop: 12 }}>
            <strong>{item.role} · {item.company}</strong>
            <ul>
              {item.bullets.map((bullet, j) => (
                <li key={j} style={{ fontSize: 12, lineHeight: 1.6, marginTop: 4 }}>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )}

    {acceptedSections.includes("projects") && (
      <div className="rb-entry">
        <strong>Projects</strong>
        {enhancement.proposedContent.projects.map((item, i) => (
          <div key={i} style={{ marginTop: 12 }}>
            <strong>{item.name}</strong>
            <p className="rb-summary">{item.description}</p>
            <ul>
              {item.bullets.map((bullet, j) => (
                <li key={j} style={{ fontSize: 12, lineHeight: 1.6, marginTop: 4 }}>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )}

    {acceptedSections.includes("education") && (
      <div className="rb-entry">
        <strong>Education</strong>
        {enhancement.proposedContent.education.map((item, i) => (
          <p key={i} className="rb-skill-line">
            <strong>{item.degree}</strong> · {item.institution} · {item.year}
          </p>
        ))}
      </div>
    )}

    {acceptedSections.includes("certifications") && (
      <div className="rb-entry">
        <strong>Certifications</strong>
        {enhancement.proposedContent.certifications.map((item, i) => (
          <p key={i} className="rb-skill-line">
            <strong>{item.name}</strong> · {item.issuer} · {item.year}
          </p>
        ))}
      </div>
    )}

    {enhancement.changeSummary.length > 0 && (
      <div className="rb-entry">
        <strong>AI change summary</strong>
        <ul>
          {enhancement.changeSummary.map((item, i) => (
            <li key={i} style={{ fontSize: 12, marginTop: 5 }}>{item}</li>
          ))}
        </ul>
      </div>
    )}

    {enhancement.recommendations.length > 0 && (
      <div className="rb-missing">
        <strong>Additional recommendations</strong>
        <ul>
          {enhancement.recommendations.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    )}

    <div className="rb-actions" style={{ marginTop: 16 }}>
      <button
        className="rb-btn rb-secondary"
        type="button"
        onClick={discardEnhancements}
      >
        Discard
      </button>

      <button
        className="rb-btn rb-primary"
        type="button"
        disabled={!acceptedSections.length}
        onClick={applyEnhancements}
      >
        Apply selected changes
      </button>
    </div>
  </section>
)}

              <div className="rb-template no-print"><label>Resume design</label><select value={template} onChange={(e) => setTemplate(e.target.value)}><option value="modern">Modern Burgundy</option><option value="minimal">Clean Minimal</option><option value="executive">Executive</option></select></div>
              <article id="resume-print" className={`rb-paper ${template}`}>
                <header className="rb-res-head">
                  <h1 className="rb-res-name">{resume.personalDetails?.name || "Your Name"}</h1>
                  <div className="rb-res-role">{resume.targetRole}</div>
                  <div className="rb-res-contact">
                    {[resume.personalDetails?.email, resume.personalDetails?.phone, resume.personalDetails?.location, resume.personalDetails?.linkedin, resume.personalDetails?.github, resume.personalDetails?.portfolio].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}
                  </div>
                </header>

                <section className="rb-res-section">
                  <h3>PROFESSIONAL SUMMARY</h3>
                  <textarea className="rb-editarea" rows={4} value={resume.content.professionalSummary} onChange={(e) => updateContent("professionalSummary", e.target.value)}/>
                  <div className="rb-summary rb-print-value">{resume.content.professionalSummary}</div>
                </section>

                {resume.content.technicalSkills.length > 0 && (
  <section className="rb-res-section">
    <h3>TECHNICAL SKILLS</h3>

    {resume.content.technicalSkills.map((item, i) => (
      <div className="rb-skill-line" key={i}>
        <strong>{item.category}: </strong>

        <input
          className="rb-edit"
          value={item.skills.join(", ")}
          onChange={(e) =>
            updateArrayItem("technicalSkills", i, {
              skills: splitLines(e.target.value),
            })
          }
        />

        <span className="rb-print-value">
          {item.skills.join(", ")}
        </span>
      </div>
    ))}
  </section>
)}

                {resume.content.experience.length > 0 && <section className="rb-res-section">
                  <h3>PROFESSIONAL EXPERIENCE</h3>
                  {resume.content.experience.map((item, i) => <div className="rb-res-item" key={i}>
                    <div className="rb-res-item-head"><h4>{item.role}{item.company ? ` · ${item.company}` : ""}</h4><span className="rb-res-meta">{item.duration}</span></div>
                    {item.location && <p>{item.location}</p>}
                    <textarea className="rb-editarea" rows={Math.max(3, item.bullets.length)} value={joinLines(item.bullets)} onChange={(e) => updateArrayItem("experience", i, { bullets: splitBullets(e.target.value) })}/>
                    <ul className="rb-print-value">{item.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
                  </div>)}
                </section>}

                {resume.content.projects.length > 0 && <section className="rb-res-section">
                  <h3>SELECTED PROJECTS</h3>
                  {resume.content.projects.map((item, i) => <div className="rb-res-item" key={i}>
                    <div className="rb-res-item-head"><h4>{item.name}</h4><span className="rb-res-meta">{item.url}</span></div>
                    <p>{item.description}</p>
                    <textarea className="rb-editarea" rows={Math.max(2, item.bullets.length)} value={joinLines(item.bullets)} onChange={(e) => updateArrayItem("projects", i, { bullets: splitBullets(e.target.value) })}/>
                    <ul className="rb-print-value">{item.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
                    {item.technologies?.length > 0 && <div className="rb-tech"><strong>Technologies:</strong> {item.technologies.join(", ")}</div>}
                  </div>)}
                </section>}

                {resume.content.education.length > 0 && <section className="rb-res-section">
                  <h3>EDUCATION</h3>
                  {resume.content.education.map((item, i) => <div className="rb-res-item" key={i}>
                    <div className="rb-res-item-head"><h4>{item.degree}</h4><span className="rb-res-meta">{item.year}</span></div>
                    <p>{item.institution}{item.details ? ` · ${item.details}` : ""}</p>
                  </div>)}
                </section>}

                {resume.content.certifications.length > 0 && <section className="rb-res-section">
                  <h3>CERTIFICATIONS</h3>
                  {resume.content.certifications.map((item, i) => <div className="rb-res-item" key={i}><div className="rb-res-item-head"><h4>{item.name}</h4><span className="rb-res-meta">{item.year}</span></div><p>{item.issuer}</p></div>)}
                </section>}
              </article>
              {resume.content.missingDetails.length > 0 && <div className="rb-missing no-print"><strong>Details you may want to add</strong><ul>{resume.content.missingDetails.map((item, i) => <li key={i}>{item}</li>)}</ul></div>}
              <p className="rb-hint no-print" style={{textAlign:"center"}}>Choose Save changes before downloading if you edited the resume. In the print dialog, select “Save as PDF”.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <div className={`rb-field${full ? " full" : ""}`}><label>{label}</label>{children}</div>;
}
function CardHead({ count, title, desc }: { count: string; title: string; desc: string }) {
  return <div className="rb-card-head"><div><h2>{title}</h2><p className="rb-sub">{desc}</p></div><span className="rb-count">{count}</span></div>;
}


