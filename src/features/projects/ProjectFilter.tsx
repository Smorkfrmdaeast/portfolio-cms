import React from 'react';
import { Search, X } from 'lucide-react';

interface ProjectFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedTech: string | null;
  onTechSelect: (tech: string | null) => void;
  availableTechs: string[];
  totalResults: number;
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedTech,
  onTechSelect,
  availableTechs,
  totalResults,
}) => {
  return (
    <div className="space-y-6 mb-12">
      {/* Search Input */}
      <div className="relative max-w-md">
        <label htmlFor="project-search" className="sr-only">
          Search projects by name, role, or description
        </label>
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-[#6B6F78] dark:text-[#8E93A0] pointer-events-none" />
          <input
            id="project-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-8 py-2 bg-white dark:bg-[#15181F] border border-[#D9D4C7] dark:border-[#22262F] rounded-[3px] text-sm text-[#16181D] dark:text-[#ECE8DF] placeholder-[#6B6F78] focus:border-[#D9532B] focus:ring-1 focus:ring-[#D9532B] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 p-1 text-[#6B6F78] hover:text-[#16181D] dark:hover:text-[#ECE8DF]"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tech Filter Tags (Interactive segmented buttons with active state, no candy badges) */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#D9D4C7]/50 dark:border-[#22262F]/50">
        <button
          onClick={() => onTechSelect(null)}
          className={`px-3 py-1 text-xs font-mono rounded-[2px] transition-colors cursor-pointer border ${
            selectedTech === null
              ? 'bg-[#16181D] dark:bg-[#ECE8DF] text-[#F4F1EA] dark:text-[#16181D] border-[#16181D] dark:border-[#ECE8DF] font-medium'
              : 'border-[#D9D4C7] dark:border-[#22262F] text-[#6B6F78] dark:text-[#8E93A0] hover:border-[#D9532B] hover:text-[#D9532B]'
          }`}
        >
          All ({totalResults})
        </button>

        {availableTechs.map((tech) => {
          const isSelected = selectedTech === tech;
          return (
            <button
              key={tech}
              onClick={() => onTechSelect(isSelected ? null : tech)}
              className={`px-3 py-1 text-xs font-mono rounded-[2px] transition-colors cursor-pointer border ${
                isSelected
                  ? 'bg-[#16181D] dark:bg-[#ECE8DF] text-[#F4F1EA] dark:text-[#16181D] border-[#16181D] dark:border-[#ECE8DF] font-medium'
                  : 'border-[#D9D4C7] dark:border-[#22262F] text-[#6B6F78] dark:text-[#8E93A0] hover:border-[#D9532B] hover:text-[#D9532B]'
              }`}
            >
              {tech}
            </button>
          );
        })}
      </div>
    </div>
  );
};
