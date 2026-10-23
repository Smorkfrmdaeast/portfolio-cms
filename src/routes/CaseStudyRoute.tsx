import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Project } from '../types';
import { CaseStudyView } from '../features/projects/CaseStudyView';
import { ArrowLeft } from 'lucide-react';

interface CaseStudyRouteProps {
  projects: Project[];
  isAdmin?: boolean;
}

export const CaseStudyRoute: React.FC<CaseStudyRouteProps> = ({ projects, isAdmin }) => {
  const { slug } = useParams<{ slug: string }>();

  // Filter projects visible to user (published, or all if admin)
  const visibleProjects = useMemo(() => {
    return isAdmin ? projects : projects.filter((p) => p.status === 'published');
  }, [projects, isAdmin]);

  // Find target project
  const currentIndex = useMemo(() => {
    if (!slug) return -1;
    return visibleProjects.findIndex((p) => p.slug.toLowerCase() === slug.toLowerCase());
  }, [visibleProjects, slug]);

  const project = currentIndex !== -1 ? visibleProjects[currentIndex] : null;
  const prevProject = currentIndex > 0 ? visibleProjects[currentIndex - 1] : null;
  const nextProject = currentIndex !== -1 && currentIndex < visibleProjects.length - 1 ? visibleProjects[currentIndex + 1] : null;

  if (!project) {
    return (
      <div className="max-w-xl mx-auto px-6 py-24 text-center">
        <span className="font-mono text-xs uppercase tracking-wider text-[#D9532B]">
          404 Not Found
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#16181D] dark:text-[#ECE8DF] mt-2 mb-4">
          Case study not found
        </h1>
        <p className="text-sm text-[#6B6F78] dark:text-[#8E93A0] mb-8 font-sans">
          The requested case study "{slug}" either does not exist or has not been published yet.
        </p>
        <Link
          to="/work"
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] font-mono text-xs uppercase tracking-wider hover:border-[#D9532B] hover:text-[#D9532B] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to all projects</span>
        </Link>
      </div>
    );
  }

  return (
    <CaseStudyView
      project={project}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
};
