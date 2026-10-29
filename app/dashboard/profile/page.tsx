
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import ProjectEditor from "./ProjectEditor";
/*@ts-ignore*/
import "./profile.css";

type Experience = {
  id: string;
  company: string;
  role: string;
  years: string;
};

type Education = {
  id: string;
  institution: string;
  degree: string;
  year: string;
};

type ProfileForm = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  summary: string;
  totalExperience: string;
  currentRole: string;
  skills: string[];
  targetRole: string;
  preferredLocation: string;
  jobStatus: string;
  experiences: Experience[];
  education: Education[];
  projects: Project[];
};


type Project = {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  role: string;
  startDate: string;
  endDate: string;
  projectUrl: string;
  githubUrl: string;
  achievements: string;
};


const initialProfile: ProfileForm = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  headline: "",
  summary: "",
  totalExperience: "",
  currentRole: "",
  skills: [],
  targetRole: "",
  preferredLocation: "",
  jobStatus: "Actively looking",
  experiences: [],
  education: [],
  projects: [],
};

const newId = () => Math.random().toString(36).slice(2, 11);

export default function CareerProfilePage() {
  const [profile, setProfile] = useState<ProfileForm>(initialProfile);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState<"success" | "error">("success");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (response.status === 401) {
          window.location.replace("/");
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load your account.");
        }

        const data = await response.json();
        const user = data.user ?? {};

        if (!cancelled) {
          setProfile((previous) => ({
            ...previous,
            fullName: user.fullName ?? user.name ?? "",
            email: user.email ?? "",
            phone: user.phone ?? "",
            location: user.location ?? "",
            headline: user.headline ?? "",
            summary: user.summary ?? "",
            totalExperience: user.totalExperience ?? "",
            currentRole: user.currentRole ?? "",
            skills: Array.isArray(user.skills) ? user.skills : [],
            targetRole: user.targetRole ?? "",
            preferredLocation: user.preferredLocation ?? "",
            jobStatus: user.jobStatus ?? "Actively looking",
            experiences: Array.isArray(user.experiences)
              ? user.experiences
              : [],
            education: Array.isArray(user.education)
              ? user.education
              : [],
            projects: Array.isArray(user.projects) ? user.projects : [],
          }));
        }
      } catch {
        if (!cancelled) {
          setNotice("We couldn't load your profile. Please refresh and try again.");
          setNoticeType("error");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateField<K extends keyof ProfileForm>(
    field: K,
    value: ProfileForm[K]
  ) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  function addSkill(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const skill = skillInput.trim();
    if (!skill) return;

    if (
      profile.skills.some(
        (existing) => existing.toLowerCase() === skill.toLowerCase()
      )
    ) {
      setSkillInput("");
      return;
    }

    updateField("skills", [...profile.skills, skill]);
    setSkillInput("");
  }

  function removeSkill(skillToRemove: string) {
    updateField(
      "skills",
      profile.skills.filter((skill) => skill !== skillToRemove)
    );
  }

function addProject() {
  updateField("projects", [
    ...profile.projects,
    {
      id: newId(),
      name: "",
      description: "",
      technologies: [],
      role: "",
      startDate: "",
      endDate: "",
      projectUrl: "",
      githubUrl: "",
      achievements: "",
    },
  ]);
}

function updateProject(
  id: string,
  field: keyof Omit<Project, "id">,
  value: string | string[]
) {
  updateField(
    "projects",
    profile.projects.map((project) =>
      project.id === id ? { ...project, [field]: value } : project
    )
  );
}

function addProjectTechnology(id: string, value: string) {
  const technology = value.trim();
  if (!technology) return;

  const project = profile.projects.find((item) => item.id === id);
  if (!project) return;

  if (
    project.technologies.some(
      (item) => item.toLowerCase() === technology.toLowerCase()
    )
  ) {
    return;
  }

  updateProject(id, "technologies", [
    ...project.technologies,
    technology,
  ]);
}

function removeProjectTechnology(id: string, technology: string) {
  const project = profile.projects.find((item) => item.id === id);
  if (!project) return;

  updateProject(
    id,
    "technologies",
    project.technologies.filter((item) => item !== technology)
  );
}


  function addExperience() {
    updateField("experiences", [
      ...profile.experiences,
      { id: newId(), company: "", role: "", years: "" },
    ]);
  }

  function updateExperience(
    id: string,
    field: keyof Omit<Experience, "id">,
    value: string
  ) {
    updateField(
      "experiences",
      profile.experiences.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  function addEducation() {
    updateField("education", [
      ...profile.education,
      { id: newId(), institution: "", degree: "", year: "" },
    ]);
  }

  function updateEducation(
    id: string,
    field: keyof Omit<Education, "id">,
    value: string
  ) {
    updateField(
      "education",
      profile.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setNotice("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Profile could not be saved. Check your profile API endpoint."
        );
      }

      setNotice("Your career profile has been saved.");
      setNoticeType("success");
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Something went wrong."
      );
      setNoticeType("error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="profile-loading">
        <div className="profile-loader" />
        <p>Loading your career profile...</p>
      </main>
    );
  }

  return (
    <main className="career-profile-page">
      <div className="career-profile-container">

        <header className="profile-header">
          <div>
            <span className="profile-eyebrow">YOUR PROFESSIONAL STORY</span>
            <h1>My Career Profile<span>.</span></h1>
            <p>
              Tell us where you are today and where you want your career to go.
            </p>
          </div>
          <div className="profile-avatar" aria-hidden="true">
            {(profile.fullName.trim()[0] || "S").toUpperCase()}
          </div>
        </header>

        {notice && (
          <div
            className={`profile-notice ${noticeType}`}
            role="status"
            aria-live="polite"
          >
            {notice}
          </div>
        )}

        <form onSubmit={saveProfile}>
          <section className="profile-section">
            <div className="profile-section-heading">
              <span className="profile-section-number">01</span>
              <div>
                <h2>Personal information</h2>
                <p>Start with the details employers should know.</p>
              </div>
            </div>

            <div className="profile-form-grid">
              <label className="profile-field">
                Full name
                <input
                  value={profile.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                />
              </label>

              <label className="profile-field">
                Email address
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className="profile-readonly"
                  autoComplete="email"
                />
                <small>Your registered email address.</small>
              </label>

              <label className="profile-field">
                Phone number
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="Your contact number"
                  autoComplete="tel"
                />
              </label>

              <label className="profile-field">
                Current location
                <input
                  value={profile.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="City, country"
                  autoComplete="address-level2"
                />
              </label>
            </div>
          </section>

          <section className="profile-section">
            <div className="profile-section-heading">
              <span className="profile-section-number">02</span>
              <div>
                <h2>Professional identity</h2>
                <p>Summarize your experience and what you bring to a team.</p>
              </div>
            </div>

            <div className="profile-form-grid">
              <label className="profile-field profile-full-width">
                Professional headline
                <input
                  value={profile.headline}
                  onChange={(e) => updateField("headline", e.target.value)}
                  placeholder="e.g. Full Stack Developer | React & Node.js"
                  maxLength={160}
                />
              </label>

              <label className="profile-field">
                Current role
                <input
                  value={profile.currentRole}
                  onChange={(e) => updateField("currentRole", e.target.value)}
                  placeholder="e.g. Software Engineer"
                />
              </label>

              <label className="profile-field">
                Total experience
                <select
                  value={profile.totalExperience}
                  onChange={(e) =>
                    updateField("totalExperience", e.target.value)
                  }
                >
                  <option value="">Select experience</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Less than 1 year">Less than 1 year</option>
                  <option value="1–3 years">1–3 years</option>
                  <option value="3–5 years">3–5 years</option>
                  <option value="5–8 years">5–8 years</option>
                  <option value="8+ years">8+ years</option>
                </select>
              </label>

              <label className="profile-field profile-full-width">
                Professional summary
                <textarea
                  value={profile.summary}
                  onChange={(e) => updateField("summary", e.target.value)}
                  placeholder="Describe your expertise, achievements and the problems you enjoy solving..."
                  rows={5}
                  maxLength={2000}
                />
                <small>{profile.summary.length}/2000 characters</small>
              </label>
            </div>
          </section>

          <section className="profile-section">
            <div className="profile-section-heading">
              <span className="profile-section-number">03</span>
              <div>
                <h2>Skills & expertise</h2>
                <p>Add the skills that best represent your abilities.</p>
              </div>
            </div>

          
<div className="profile-skill-form">
  <input
    value={skillInput}
    onChange={(e) => setSkillInput(e.target.value)}
    placeholder="e.g. React, TypeScript, SQL"
    aria-label="Add a skill"
    maxLength={60}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const skill = skillInput.trim();

        if (
          skill &&
          !profile.skills.some(
            (existing) => existing.toLowerCase() === skill.toLowerCase()
          )
        ) {
          updateField("skills", [...profile.skills, skill]);
        }

        setSkillInput("");
      }
    }}
  />
  <button
    type="button"
    className="profile-add-button"
    onClick={() => {
      const skill = skillInput.trim();

      if (
        skill &&
        !profile.skills.some(
          (existing) => existing.toLowerCase() === skill.toLowerCase()
        )
      ) {
        updateField("skills", [...profile.skills, skill]);
      }

      setSkillInput("");
    }}
  >
    + Add skill
  </button>
</div>


            <div className="profile-skill-list">
              {profile.skills.length === 0 ? (
                <p className="profile-empty">
                  Your skills will appear here when you add them.
                </p>
              ) : (
                profile.skills.map((skill) => (
                  <span className="profile-skill-chip" key={skill}>
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </section>

          <section className="profile-section">
            <div className="profile-section-heading">
              <span className="profile-section-number">04</span>
              <div>
                <h2>Work experience</h2>
                <p>Highlight relevant roles and the experience you gained.</p>
              </div>
            </div>

            {profile.experiences.map((experience, index) => (
              <div className="profile-repeat-card" key={experience.id || `experience-${index}`}>
                <div className="profile-repeat-heading">
                  <h3>Experience {index + 1}</h3>
                  <button
                    type="button"
                    className="profile-remove-button"
                    onClick={() =>
                      updateField(
                        "experiences",
                        profile.experiences.filter(
                          (item) => item.id !== experience.id
                        )
                      )
                    }
                  >
                    Remove
                  </button>
                </div>

                <div className="profile-form-grid">
                  <label className="profile-field">
                    Job title
                    <input
                      value={experience.role}
                      onChange={(e) =>
                        updateExperience(experience.id, "role", e.target.value)
                      }
                      placeholder="e.g. Frontend Developer"
                    />
                  </label>
                  <label className="profile-field">
                    Company
                    <input
                      value={experience.company}
                      onChange={(e) =>
                        updateExperience(
                          experience.id,
                          "company",
                          e.target.value
                        )
                      }
                      placeholder="Company name"
                    />
                  </label>
                  <label className="profile-field">
                    Duration
                    <input
                      value={experience.years}
                      onChange={(e) =>
                        updateExperience(experience.id, "years", e.target.value)
                      }
                      placeholder="e.g. Jan 2023 – Present"
                    />
                  </label>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="profile-secondary-button"
              onClick={addExperience}
            >
              + Add experience
            </button>
          </section>


<section className="profile-section">
  <div className="profile-section-heading">
    <span className="profile-section-number">05</span>
    <div>
      <h2>Projects</h2>
      <p>
        Showcase what you have built, the technologies you used,
        and the impact you made.
      </p>
    </div>
  </div>

  {profile.projects.map((project, index) => (
    <ProjectEditor
      key={project.id || `project-${index}`}
      project={project}
      index={index}
      onChange={updateProject}
      onRemove={() =>
        updateField(
          "projects",
          profile.projects.filter((item) => item.id !== project.id)
        )
      }
      onAddTechnology={addProjectTechnology}
      onRemoveTechnology={removeProjectTechnology}
    />
  ))}

  <button
    type="button"
    className="profile-secondary-button"
    onClick={addProject}
  >
    + Add project
  </button>
</section>


          <section className="profile-section">
            <div className="profile-section-heading">
              <span className="profile-section-number">05</span>
              <div>
                <h2>Education</h2>
                <p>Add your academic qualifications.</p>
              </div>
            </div>

            {profile.education.map((education, index) => (
              <div className="profile-repeat-card" key={education.id}>
                <div className="profile-repeat-heading">
                  <h3>Qualification {index + 1}</h3>
                  <button
                    type="button"
                    className="profile-remove-button"
                    onClick={() =>
                      updateField(
                        "education",
                        profile.education.filter(
                          (item) => item.id !== education.id
                        )
                      )
                    }
                  >
                    Remove
                  </button>
                </div>

                <div className="profile-form-grid">
                  <label className="profile-field">
                    Degree or qualification
                    <input
                      value={education.degree}
                      onChange={(e) =>
                        updateEducation(education.id, "degree", e.target.value)
                      }
                      placeholder="e.g. B.Tech in Computer Science"
                    />
                  </label>
                  <label className="profile-field">
                    Institution
                    <input
                      value={education.institution}
                      onChange={(e) =>
                        updateEducation(
                          education.id,
                          "institution",
                          e.target.value
                        )
                      }
                      placeholder="College or university"
                    />
                  </label>
                  <label className="profile-field">
                    Graduation year
                    <input
                      type="number"
                      min="1950"
                      max="2100"
                      value={education.year}
                      onChange={(e) =>
                        updateEducation(education.id, "year", e.target.value)
                      }
                      placeholder="e.g. 2022"
                    />
                  </label>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="profile-secondary-button"
              onClick={addEducation}
            >
              + Add education
            </button>
          </section>

          <section className="profile-section">
            <div className="profile-section-heading">
              <span className="profile-section-number">06</span>
              <div>
                <h2>Career preferences</h2>
                <p>Help tailor your career preparation to your goals.</p>
              </div>
            </div>

            <div className="profile-form-grid">
              <label className="profile-field">
                Target role
                <input
                  value={profile.targetRole}
                  onChange={(e) => updateField("targetRole", e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                />
              </label>

              <label className="profile-field">
                Preferred location
                <input
                  value={profile.preferredLocation}
                  onChange={(e) =>
                    updateField("preferredLocation", e.target.value)
                  }
                  placeholder="e.g. Hyderabad or Remote"
                />
              </label>

              <label className="profile-field profile-full-width">
                Current job-search status
                <select
                  value={profile.jobStatus}
                  onChange={(e) => updateField("jobStatus", e.target.value)}
                >
                  <option value="Actively looking">Actively looking</option>
                  <option value="Open to opportunities">
                    Open to opportunities
                  </option>
                  <option value="Currently employed">
                    Currently employed
                  </option>
                  <option value="Not looking right now">
                    Not looking right now
                  </option>
                </select>
              </label>
            </div>
          </section>

          <div className="profile-save-bar">
            <p>Keep your profile updated as your career evolves.</p>
            <button
              type="submit"
              className="profile-save-button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save career profile"}
              {!saving && <span>→</span>}
            </button>
          </div>
        </form>

        <footer className="profile-footer">
          <Link href="/dashboard">← Back to Overview</Link>
          <span>STRYVEXI · OWN YOUR NEXT MOVE.</span>
        </footer>
      </div>
    </main>
  );
}
