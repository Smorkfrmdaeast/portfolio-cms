import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types';
import { Lightbox } from '../../components/Lightbox';
import { normalizeImagePath } from '../../lib/utils';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';

interface CaseStudyViewProps {
  project: Project;
  prevProject?: Project | null;
  nextProject?: Project | null;
}

export const CaseStudyView: React.FC<CaseStudyViewProps> = ({
  project,
  prevProject,
  nextProject,
}) => {
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string; caption?: string } | null>(null);

  const hasProblem = Boolean(project.sections?.problem?.trim());
  const hasApproach = Boolean(project.sections?.approach?.trim());
  const hasResult = Boolean(project.sections?.result?.trim());
  const hasAnySection = hasProblem || hasApproach || hasResult;

  return (
    <article className="max-w-4xl mx-auto px-6 py-12 md:py-20 animate-fadeIn">
      {/* Back to Work link */}
      <div className="mb-10">
        <Link
          to="/work"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#6B6F78] dark:text-[#8E93A0] hover:text-[#D9532B] dark:hover:text-[#D9532B] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all projects
        </Link>
      </div>

      {/* Header & Metadata */}
      <header className="border-b border-[#D9D4C7] dark:border-[#22262F] pb-12 mb-12">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#D9532B] mb-4">
          <span>{project.year}</span>
          <span aria-hidden="true">/</span>
          <span>{project.role}</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#16181D] dark:text-[#ECE8DF] tracking-tight leading-[1.1] mb-6">
          {project.title}
        </h1>

        <p className="text-lg sm:text-xl text-[#2C3038] dark:text-[#8E93A0] leading-relaxed max-w-3xl mb-8">
          {project.summary}
        </p>

        {/* Tech Stack & Links Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-[#D9D4C7]/60 dark:border-[#22262F]/60">
          <div className="font-mono text-xs text-[#6B6F78] dark:text-[#8E93A0]">
            <span className="text-[#16181D] dark:text-[#ECE8DF] font-medium mr-2">Tech:</span>
            {project.tech.join(' · ')}
          </div>

          <div className="flex items-center gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#16181D] dark:bg-[#ECE8DF] text-[#F4F1EA] dark:text-[#16181D] rounded-[2px] hover:bg-[#D9532B] dark:hover:bg-[#D9532B] dark:hover:text-white transition-colors"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-mono uppercase tracking-wider border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-[#16181D] dark:text-[#ECE8DF] hover:border-[#D9532B] hover:text-[#D9532B] transition-colors"
              >
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Cover Image with Lightbox Trigger */}
      <div className="mb-16">
        <button
          type="button"
          onClick={() => setLightboxImage({ src: normalizeImagePath(project.image), alt: project.title })}
          className="w-full text-left cursor-zoom-in group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9532B]"
          aria-label="Click to enlarge project cover photo"
        >
          <div className="overflow-hidden rounded-[3px] border border-[#D9D4C7] dark:border-[#22262F] bg-[#16181D]/5 dark:bg-[#000000]/40">
            <img
              src={normalizeImagePath(project.image)}
              alt={project.title}
              className="w-full max-h-[550px] object-cover object-top transition duration-300 group-hover:scale-[1.01]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/smorks-paydom-platform.jpg';
              }}
            />
          </div>
          <span className="block mt-2 font-mono text-[11px] text-[#6B6F78] dark:text-[#8E93A0] text-right">
            Click image to enlarge ↗
          </span>
        </button>
      </div>

      {/* Case Study Sections (Problem, Approach, Result) */}
      {hasAnySection && (
        <section className="space-y-16 mb-20">
          {hasProblem && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 pt-8 border-t border-[#D9D4C7]/60 dark:border-[#22262F]/60">
              <div className="md:col-span-4">
                <span className="font-mono text-xs uppercase tracking-wider text-[#D9532B]">
                  01 / Problem
                </span>
                <h2 className="font-serif text-2xl text-[#16181D] dark:text-[#ECE8DF] mt-1">
                  Context & Challenge
                </h2>
              </div>
              <div className="md:col-span-8">
                <p className="text-base sm:text-lg text-[#2C3038] dark:text-[#ECE8DF] leading-relaxed whitespace-pre-line">
                  {project.sections?.problem}
                </p>
              </div>
            </div>
          )}

          {hasApproach && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 pt-8 border-t border-[#D9D4C7]/60 dark:border-[#22262F]/60">
              <div className="md:col-span-4">
                <span className="font-mono text-xs uppercase tracking-wider text-[#D9532B]">
                  02 / Approach
                </span>
                <h2 className="font-serif text-2xl text-[#16181D] dark:text-[#ECE8DF] mt-1">
                  Engineering & Strategy
                </h2>
              </div>
              <div className="md:col-span-8">
                <p className="text-base sm:text-lg text-[#2C3038] dark:text-[#ECE8DF] leading-relaxed whitespace-pre-line">
                  {project.sections?.approach}
                </p>
              </div>
            </div>
          )}

          {hasResult && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 pt-8 border-t border-[#D9D4C7]/60 dark:border-[#22262F]/60">
              <div className="md:col-span-4">
                <span className="font-mono text-xs uppercase tracking-wider text-[#D9532B]">
                  03 / Result
                </span>
                <h2 className="font-serif text-2xl text-[#16181D] dark:text-[#ECE8DF] mt-1">
                  Outcome & Delivery
                </h2>
              </div>
              <div className="md:col-span-8">
                <p className="text-base sm:text-lg text-[#2C3038] dark:text-[#ECE8DF] leading-relaxed whitespace-pre-line">
                  {project.sections?.result}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Gallery (if provided) */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="mb-20 pt-8 border-t border-[#D9D4C7] dark:border-[#22262F]">
          <h2 className="font-serif text-2xl text-[#16181D] dark:text-[#ECE8DF] mb-6">
            Project Gallery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {project.gallery.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightboxImage({ src: item.url, alt: item.alt, caption: item.caption })}
                className="text-left group cursor-zoom-in"
              >
                <div className="overflow-hidden rounded-[2px] border border-[#D9D4C7] dark:border-[#22262F] aspect-video">
                  <img
                    src={item.url}
                    alt={item.alt}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                {item.caption && (
                  <p className="mt-1.5 font-mono text-xs text-[#6B6F78] dark:text-[#8E93A0]">
                    {item.caption}
                  </p>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Previous / Next Project Navigation */}
      <nav className="border-t border-[#D9D4C7] dark:border-[#22262F] pt-8 mt-16 flex justify-between items-center" aria-label="Project pagination">
        {prevProject ? (
          <Link
            to={`/work/${prevProject.slug}`}
            className="group flex flex-col items-start text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D9532B]"
          >
            <span className="font-mono text-xs text-[#6B6F78] dark:text-[#8E93A0] flex items-center gap-1 group-hover:text-[#D9532B] transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Previous Project
            </span>
            <span className="font-serif text-lg text-[#16181D] dark:text-[#ECE8DF] group-hover:text-[#D9532B] transition-colors mt-0.5">
              {prevProject.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextProject && (
          <Link
            to={`/work/${nextProject.slug}`}
            className="group flex flex-col items-end text-right focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D9532B]"
          >
            <span className="font-mono text-xs text-[#6B6F78] dark:text-[#8E93A0] flex items-center gap-1 group-hover:text-[#D9532B] transition-colors">
              Next Project
              <ArrowRight className="w-3 h-3" />
            </span>
            <span className="font-serif text-lg text-[#16181D] dark:text-[#ECE8DF] group-hover:text-[#D9532B] transition-colors mt-0.5">
              {nextProject.title}
            </span>
          </Link>
        )}
      </nav>

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={Boolean(lightboxImage)}
        onClose={() => setLightboxImage(null)}
        src={lightboxImage?.src || ''}
        alt={lightboxImage?.alt || ''}
        caption={lightboxImage?.caption}
      />
    </article>
  );
};
