import React from 'react';
import { Project } from '../types';

interface ProjectsProps {
  projects: Project[];
  onOpenAddModal: () => void;
  onSelectProject: (project: Project) => void;
  onDeleteProject?: (id?: string) => void;
}

export const Projects: React.FC<ProjectsProps> = ({
  projects,
  onOpenAddModal,
  onSelectProject,
}) => {
  return (
    <section id="projects" className="py-20 px-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-blue-400 tracking-tight">Projects</h2>
          <p className="text-xs text-gray-400 mt-1">Showing {projects.length} featured works</p>
        </div>
        <button
          id="addProjectBtn"
          onClick={onOpenAddModal}
          className="glass px-5 py-2.5 font-medium hover:bg-blue-800 transition cursor-pointer flex items-center gap-2 text-sm shadow-md"
        >
          <i className="fas fa-plus text-xs text-blue-400" />
          <span>Add Project</span>
        </button>
      </div>

      <div
        id="projectsContainer"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {projects.map((p, index) => (
          <div
            key={p.id || index}
            className="glass p-4 cursor-pointer hover:scale-105 transition duration-300 flex flex-col justify-between group"
            onClick={() => onSelectProject(p)}
          >
            <div>
              <div className="overflow-hidden rounded mb-3 bg-gray-900/50 aspect-video relative">
                <img
                  src={p.image}
                  alt={p.title}
                  className="h-44 w-full object-cover rounded group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/smorks-paydom-platform.jpg';
                  }}
                />
              </div>
              <h3 className="text-lg font-bold text-blue-400 group-hover:text-blue-300 transition">
                {p.title}
              </h3>
              <p className="text-gray-300 text-sm mt-1 line-clamp-2">
                {p.description}
              </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-blue-300">
              <span className="truncate max-w-[70%] font-medium">{p.tech}</span>
              <span className="underline hover:text-white transition">View Details →</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
