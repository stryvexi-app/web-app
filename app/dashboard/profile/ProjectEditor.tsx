
"use client";

import { useState } from "react";

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

type Props = {
  project: Project;
  index: number;
  onChange: (
    id: string,
    field: keyof Omit<Project, "id">,
    value: string | string[]
  ) => void;
  onRemove: () => void;
  onAddTechnology: (id: string, value: string) => void;
  onRemoveTechnology: (id: string, technology: string) => void;
};

export default function ProjectEditor({
  project,
  index,
  onChange,
  onRemove,
  onAddTechnology,
  onRemoveTechnology,
}: Props) {
  const [technology, setTechnology] = useState("");

  function addTechnology() {
    onAddTechnology(project.id, technology);
    setTechnology("");
  }

  return (
    <div className="profile-repeat-card profile-project-card">
      <div className="profile-repeat-heading">
        <h3>Project {index + 1}</h3>
        <button
          type="button"
          className="profile-remove-button"
          onClick={onRemove}
        >
          Remove project
        </button>
      </div>

      <div className="profile-form-grid">
        <label className="profile-field">
          Project name
          <input
            value={project.name}
            onChange={(e) => onChange(project.id, "name", e.target.value)}
            placeholder="e.g. AI-powered job portal"
            maxLength={150}
          />
        </label>

        <label className="profile-field">
          Your role
          <input
            value={project.role}
            onChange={(e) => onChange(project.id, "role", e.target.value)}
            placeholder="e.g. Full Stack Developer"
            maxLength={120}
          />
        </label>

        <label className="profile-field">
          Start date
          <input
            type="month"
            value={project.startDate}
            onChange={(e) =>
              onChange(project.id, "startDate", e.target.value)
            }
          />
        </label>

        <label className="profile-field">
          End date
          <input
            type="month"
            value={project.endDate}
            onChange={(e) => onChange(project.id, "endDate", e.target.value)}
            disabled={!project.startDate}
            min={project.startDate || undefined}
          />
          <small>Leave blank if the project is ongoing.</small>
        </label>

        <label className="profile-field profile-full-width">
          Project description
          <textarea
            value={project.description}
            onChange={(e) =>
              onChange(project.id, "description", e.target.value)
            }
            placeholder="What does the project do? What problem does it solve?"
            rows={3}
            maxLength={2000}
          />
        </label>

        <label className="profile-field">
          Live project URL
          <input
            type="url"
            value={project.projectUrl}
            onChange={(e) =>
              onChange(project.id, "projectUrl", e.target.value)
            }
            placeholder="https://your-project.com"
          />
        </label>

        <label className="profile-field">
          GitHub repository
          <input
            type="url"
            value={project.githubUrl}
            onChange={(e) =>
              onChange(project.id, "githubUrl", e.target.value)
            }
            placeholder="https://github.com/username/project"
          />
        </label>

        <label className="profile-field profile-full-width">
          Key achievements
          <textarea
            value={project.achievements}
            onChange={(e) =>
              onChange(project.id, "achievements", e.target.value)
            }
            placeholder="Describe your contribution, results, or measurable impact."
            rows={3}
            maxLength={1500}
          />
        </label>

        <div className="profile-field profile-full-width">
          Technologies used
          <div className="profile-skill-form">
            <input
              value={technology}
              onChange={(e) => setTechnology(e.target.value)}
              placeholder="e.g. React, Node.js, PostgreSQL"
              maxLength={60}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTechnology();
                }
              }}
            />
            <button
              type="button"
              className="profile-add-button"
              onClick={addTechnology}
            >
              + Add
            </button>
          </div>

          <div className="profile-skill-list">
            {project.technologies?.map((item) => (
              <span className="profile-skill-chip" key={item}>
                {item}
                <button
                  type="button"
                  aria-label={`Remove ${item}`}
                  onClick={() => onRemoveTechnology(project.id, item)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
