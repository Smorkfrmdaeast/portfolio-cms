import React, { useState, useMemo } from 'react';
import { Project } from '../types';
import { ProjectRow } from '../features/projects/ProjectRow';
import { ProjectFilter } from '../features/projects/ProjectFilter';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface WorkRouteProps {
  projects: Project[];
}

export const WorkRoute: React.FC<WorkRouteProps> = ({ projects }) => {
  const [search, setSearch] = useState('');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  // Extract all unique tech tags from published projects
  const availableTechs = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.status === 'published') {
        p.tech.forEach((t) => set.add(t));
      }
    });
    return Array.from(set).sort();
  }, [projects]);

  // Filter published projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => p.status === 'published')
      .filter((p) => {
        const matchesSearch =
          search.trim() === '' ||
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.summary.toLowerCase().includes(search.toLowerCase()) ||
          p.role.toLowerCase().includes(search.toLowerCase()) ||
          p.tech.some((t) => t.toLowerCase().includes(search.toLowerCase()));

        const matchesTech =
          selectedTech === null || p.tech.includes(selectedTech);

        return matchesSearch && matchesTech;
      });
  }, [projects, search, selectedTech]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 animate-fadeIn">
      {/* Top breadcrumb */}
      <div className="mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#6B6F78] dark:text-[#8E93A0] hover:text-[#D9532B] dark:hover:text-[#D9532B] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Header */}
      <header className="mb-12">
        <span className="font-mono text-xs uppercase tracking-wider text-[#D9532B]">
          Complete Archive
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#16181D] dark:text-[#ECE8DF] tracking-tight mt-1 mb-4">
          All Projects
        </h1>
        <p className="text-base sm:text-lg text-[#6B6F78] dark:text-[#8E93A0] max-w-2xl font-sans">
          A comprehensive indexed record of developed web applications, interfaces, and open-source frontend work.
        </p>
      </header>

      {/* Filters */}
      <ProjectFilter
        searchQuery={search}
        onSearchChange={setSearch}
        selectedTech={selectedTech}
        onTechSelect={setSelectedTech}
        availableTechs={availableTechs}
        totalResults={filteredProjects.length}
      />

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="border border-[#D9D4C7] dark:border-[#22262F] rounded-[3px] p-12 text-center bg-white dark:bg-[#15181F]">
          <p className="font-serif text-xl text-[#16181D] dark:text-[#ECE8DF] mb-2">
            No projects match your filter criteria
          </p>
          <p className="font-mono text-xs text-[#6B6F78] dark:text-[#8E93A0] mb-6">
            Try adjusting your search terms or clearing the active technology filter.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedTech(null);
            }}
            className="px-4 py-2 border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] font-mono text-xs uppercase tracking-wider hover:border-[#D9532B] hover:text-[#D9532B] transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-0">
          {filteredProjects.map((project, idx) => (
            <ProjectRow key={project.id} project={project} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
};
