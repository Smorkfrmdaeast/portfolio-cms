import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { normalizeImagePath } from '../../lib/utils';
import { ArrowUpRight, ExternalLink } from 'lucide-react';

interface ProjectRowProps {
  project: Project;
  index: number;
}

export const ProjectRow: React.FC<ProjectRowProps> = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const formattedIndex = String(index + 1).padStart(2, '0');
  const imageUrl = normalizeImagePath(project.image);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative border-b border-[#D9D4C7] dark:border-[#22262F] transition-colors"
    >
      <div className="py-6 sm:py-8">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
          {/* Index and Title (Links to Case Study) */}
          <div className="flex items-baseline gap-4 sm:gap-6 min-w-0">
            <span className="font-mono text-xs sm:text-sm text-[#D9532B] tracking-wider select-none shrink-0">
              {formattedIndex}
            </span>
            <div className="min-w-0">
              <Link
                to={`/work/${project.slug}`}
                className="inline-flex items-center gap-2 group-hover:text-[#D9532B] dark:group-hover:text-[#D9532B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9532B]"
              >
                <h3 className="font-serif text-2xl sm:text-3xl text-[#16181D] dark:text-[#ECE8DF] tracking-tight">
                  {project.title}
                </h3>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#D9532B] shrink-0" />
              </Link>
              <p className="text-sm text-[#6B6F78] dark:text-[#8E93A0] mt-1.5 line-clamp-2 max-w-2xl font-sans">
                {project.summary}
              </p>
            </div>
          </div>

          {/* Metadata & External Website Links */}
          <div className="flex flex-col md:items-end gap-2 shrink-0 font-mono text-xs text-[#6B6F78] dark:text-[#8E93A0] pl-8 md:pl-0">
            <div className="flex items-center gap-3">
              <span className="truncate max-w-[200px]">
                {project.tech.join(' · ')}
              </span>
              <span aria-hidden="true" className="text-[#D9D4C7] dark:text-[#22262F]">/</span>
              <span>{project.year}</span>
            </div>

            {/* Direct External Website Links */}
            <div className="flex items-center gap-3 pt-1">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#D9532B] hover:underline font-mono text-[11px] font-medium"
                  title={`Open live site for ${project.title}`}
                >
                  <span>Live Site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#6B6F78] dark:text-[#8E93A0] hover:text-[#D9532B] dark:hover:text-[#D9532B] font-mono text-[11px]"
                  title={`View GitHub source code for ${project.title}`}
                >
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <Link
                to={`/work/${project.slug}`}
                className="text-[#6B6F78] dark:text-[#8E93A0] hover:text-[#16181D] dark:hover:text-[#ECE8DF] font-mono text-[11px]"
              >
                Case Study →
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile View: Inline image row */}
        <Link
          to={`/work/${project.slug}`}
          className="mt-4 block md:hidden overflow-hidden rounded-[2px] border border-[#D9D4C7] dark:border-[#22262F]"
        >
          <img
            src={imageUrl}
            alt={project.title}
            loading="lazy"
            className="w-full h-44 object-cover object-top"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/smorks-paydom-platform.jpg';
            }}
          />
        </Link>
      </div>

      {/* Desktop View: Floating smooth hover preview */}
      {isHovered && (
        <div
          aria-hidden="true"
          className="hidden md:block pointer-events-none fixed z-30 w-72 h-44 rounded-[2px] overflow-hidden border border-[#D9D4C7] dark:border-[#22262F] shadow-xl transition-opacity duration-150 right-24"
          style={{ top: 'calc(var(--mouse-y, 300px) - 90px)' }}
        >
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/smorks-paydom-platform.jpg';
            }}
          />
        </div>
      )}
    </div>
  );
};
