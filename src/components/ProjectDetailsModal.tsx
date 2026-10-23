import React, { useEffect } from 'react';
import { Project } from '../types';

interface ProjectDetailsModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  project,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      id="detailsModal"
      className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="glass p-6 max-w-lg w-full relative bg-[#0f172a]/95 text-white shadow-2xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl text-gray-400 hover:text-white transition p-1"
          aria-label="Close details"
        >
          ✖
        </button>
        <img
          id="dImg"
          src={project.image}
          alt={project.title}
          className="w-full h-48 object-cover rounded mb-4 shadow"
          onError={(e) => {
            // Fallback in case custom URL fails
            (e.target as HTMLImageElement).src = '/assets/smorks-paydom-platform.jpg';
          }}
        />
        <h3 id="dTitle" className="text-xl font-bold text-blue-400">
          {project.title}
        </h3>
        <p id="dDesc" className="mt-2 text-gray-300 text-sm leading-relaxed">
          {project.description}
        </p>
        <p id="dTech" className="mt-2 text-blue-300 font-medium text-sm">
          Tech: {project.tech}
        </p>
        <div className="flex gap-3 mt-4 pt-2 border-t border-white/10">
          {project.live && (
            <a
              id="dLive"
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="glass px-4 py-1.5 text-sm font-semibold hover:bg-blue-600/30 transition flex items-center gap-1.5"
            >
              <i className="fas fa-external-link-alt text-xs" />
              Live
            </a>
          )}
          {project.github && (
            <a
              id="dGit"
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="glass px-4 py-1.5 text-sm font-semibold hover:bg-blue-600/30 transition flex items-center gap-1.5"
            >
              <i className="fab fa-github text-xs" />
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
