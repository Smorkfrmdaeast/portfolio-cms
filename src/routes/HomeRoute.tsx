import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Project, SiteSettings } from '../types';
import { ProjectRow } from '../features/projects/ProjectRow';
import { Lightbox } from '../components/Lightbox';
import { normalizeImagePath } from '../lib/utils';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

interface HomeRouteProps {
  projects: Project[];
  settings: SiteSettings;
}

export const HomeRoute: React.FC<HomeRouteProps> = ({ projects, settings }) => {
  const [isPhotoLightboxOpen, setIsPhotoLightboxOpen] = useState(false);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);

  // Filter only featured or published projects for home
  const featuredProjects = projects.filter((p) => p.featured && p.status === 'published');
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 5);

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 sm:pt-24 md:pt-32 pb-20 border-b border-[#D9D4C7] dark:border-[#22262F]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Typographic Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Status Line if enabled in admin */}
            {settings.statusLineEnabled && settings.statusLineText && (
              <div className="inline-flex items-center gap-2 font-mono text-xs text-[#D9532B] tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9532B]" aria-hidden="true" />
                <span>{settings.statusLineText}</span>
              </div>
            )}

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#16181D] dark:text-[#ECE8DF] leading-[0.95] text-balance">
              {settings.name}
            </h1>

            <p className="font-mono text-sm sm:text-base text-[#D9532B] font-medium">
              {settings.roleLine}
            </p>

            <p className="font-sans text-lg sm:text-xl text-[#2C3038] dark:text-[#8E93A0] max-w-2xl leading-relaxed">
              {settings.statement}
            </p>

            {/* Natural action links */}
            <div className="pt-4 flex flex-wrap items-center gap-6 font-mono text-xs uppercase tracking-wider">
              <a
                href="#selected-work"
                className="inline-flex items-center gap-2 text-[#16181D] dark:text-[#ECE8DF] hover:text-[#D9532B] dark:hover:text-[#D9532B] transition-colors pb-1 border-b border-[#16181D] dark:border-[#ECE8DF] hover:border-[#D9532B]"
              >
                <span>Selected Work</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-[#16181D] dark:text-[#ECE8DF] hover:text-[#D9532B] dark:hover:text-[#D9532B] transition-colors pb-1 border-b border-[#16181D] dark:border-[#ECE8DF] hover:border-[#D9532B]"
              >
                <span>Contact Details</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              {settings.resumeUrl && (
                <a
                  href={settings.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6B6F78] dark:text-[#8E93A0] hover:text-[#D9532B] transition-colors"
                >
                  Resume / CV ↗
                </a>
              )}
            </div>
          </div>

          {/* Profile Photo natural frame */}
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <div className="relative group">
              <button
                ref={avatarButtonRef}
                type="button"
                onClick={() => setIsPhotoLightboxOpen(true)}
                className="cursor-zoom-in block text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9532B]"
                aria-label="Enlarge profile photo"
              >
                <div className="w-48 sm:w-56 md:w-64 aspect-[4/5] rounded-[3px] overflow-hidden border border-[#D9D4C7] dark:border-[#22262F] bg-white dark:bg-[#15181F] p-1.5 shadow-sm group-hover:border-[#D9532B] transition-colors">
                  <img
                    src={normalizeImagePath(settings.profilePhoto)}
                    alt={settings.name}
                    className="w-full h-full object-cover rounded-[2px]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/hero.jpg';
                    }}
                  />
                </div>
                <span className="block mt-2 font-mono text-[11px] text-[#6B6F78] dark:text-[#8E93A0]">
                  {settings.handle} · Click to enlarge ↗
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Work Section (Editorial Indexed List) */}
      <section id="selected-work" className="max-w-6xl mx-auto px-6 py-20 border-b border-[#D9D4C7] dark:border-[#22262F]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#D9532B]">
              Index
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#16181D] dark:text-[#ECE8DF] tracking-tight mt-1">
              Selected Work
            </h2>
          </div>

          <Link
            to="/work"
            className="font-mono text-xs uppercase tracking-wider text-[#6B6F78] dark:text-[#8E93A0] hover:text-[#D9532B] dark:hover:text-[#D9532B] transition-colors inline-flex items-center gap-1.5"
          >
            <span>View all projects ({projects.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Project rows */}
        <div className="space-y-0">
          {displayProjects.map((project, idx) => (
            <ProjectRow key={project.id} project={project} index={idx} />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="max-w-6xl mx-auto px-6 py-20 border-b border-[#D9D4C7] dark:border-[#22262F]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          <div className="md:col-span-4">
            <span className="font-mono text-xs uppercase tracking-wider text-[#D9532B]">
              Background
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#16181D] dark:text-[#ECE8DF] tracking-tight mt-1">
              About
            </h2>
          </div>

          <div className="md:col-span-8 space-y-12">
            <p className="font-sans text-base sm:text-lg text-[#2C3038] dark:text-[#ECE8DF] leading-relaxed whitespace-pre-line">
              {settings.aboutText}
            </p>

            {/* Skills as plain grouped text lists (no percentage bars) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-[#D9D4C7]/60 dark:border-[#22262F]/60">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#D9532B] block mb-3">
                  Frontend
                </span>
                <ul className="space-y-1.5 text-sm font-mono text-[#2C3038] dark:text-[#8E93A0]">
                  {settings.skills.frontend.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#D9532B] block mb-3">
                  Backend
                </span>
                <ul className="space-y-1.5 text-sm font-mono text-[#2C3038] dark:text-[#8E93A0]">
                  {settings.skills.backend.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#D9532B] block mb-3">
                  Tools & Environment
                </span>
                <ul className="space-y-1.5 text-sm font-mono text-[#2C3038] dark:text-[#8E93A0]">
                  {settings.skills.tools.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          <div className="md:col-span-4">
            <span className="font-mono text-xs uppercase tracking-wider text-[#D9532B]">
              Direct Channels
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#16181D] dark:text-[#ECE8DF] tracking-tight mt-1">
              Contact
            </h2>
          </div>

          <div className="md:col-span-8">
            <p className="text-base sm:text-lg text-[#2C3038] dark:text-[#ECE8DF] leading-relaxed mb-8">
              Available for technical freelance contracts, frontend architecture, and engineering inquiries. You can reach out directly via email, message on WhatsApp, or connect on social platforms.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {settings.socials.email && (
                <a
                  href={settings.socials.email}
                  className="p-4 rounded-[2px] border border-[#D9D4C7] dark:border-[#22262F] bg-white dark:bg-[#15181F] hover:border-[#D9532B] transition-colors group flex items-baseline justify-between"
                >
                  <div>
                    <span className="font-mono text-xs text-[#6B6F78] dark:text-[#8E93A0] block">
                      Email
                    </span>
                    <span className="font-mono text-sm text-[#16181D] dark:text-[#ECE8DF] group-hover:text-[#D9532B] transition-colors">
                      {settings.socials.email.replace('mailto:', '')}
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#6B6F78] group-hover:text-[#D9532B] transition-colors" />
                </a>
              )}

              {settings.socials.whatsapp && (
                <a
                  href={settings.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-[2px] border border-[#D9D4C7] dark:border-[#22262F] bg-white dark:bg-[#15181F] hover:border-[#D9532B] transition-colors group flex items-baseline justify-between"
                >
                  <div>
                    <span className="font-mono text-xs text-[#6B6F78] dark:text-[#8E93A0] block">
                      WhatsApp
                    </span>
                    <span className="font-mono text-sm text-[#16181D] dark:text-[#ECE8DF] group-hover:text-[#D9532B] transition-colors">
                      +234 901 907 1679
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#6B6F78] group-hover:text-[#D9532B] transition-colors" />
                </a>
              )}

              {settings.socials.github && (
                <a
                  href={settings.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-[2px] border border-[#D9D4C7] dark:border-[#22262F] bg-white dark:bg-[#15181F] hover:border-[#D9532B] transition-colors group flex items-baseline justify-between"
                >
                  <div>
                    <span className="font-mono text-xs text-[#6B6F78] dark:text-[#8E93A0] block">
                      GitHub
                    </span>
                    <span className="font-mono text-sm text-[#16181D] dark:text-[#ECE8DF] group-hover:text-[#D9532B] transition-colors">
                      github.com/Smorkfrmdaeast
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#6B6F78] group-hover:text-[#D9532B] transition-colors" />
                </a>
              )}

              {settings.socials.linkedin && (
                <a
                  href={settings.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-[2px] border border-[#D9D4C7] dark:border-[#22262F] bg-white dark:bg-[#15181F] hover:border-[#D9532B] transition-colors group flex items-baseline justify-between"
                >
                  <div>
                    <span className="font-mono text-xs text-[#6B6F78] dark:text-[#8E93A0] block">
                      LinkedIn
                    </span>
                    <span className="font-mono text-sm text-[#16181D] dark:text-[#ECE8DF] group-hover:text-[#D9532B] transition-colors">
                      linkedin.com/in/smorkfrmdaeast
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#6B6F78] group-hover:text-[#D9532B] transition-colors" />
                </a>
              )}

              {settings.socials.instagram && (
                <a
                  href={settings.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-[2px] border border-[#D9D4C7] dark:border-[#22262F] bg-white dark:bg-[#15181F] hover:border-[#D9532B] transition-colors group flex items-baseline justify-between"
                >
                  <div>
                    <span className="font-mono text-xs text-[#6B6F78] dark:text-[#8E93A0] block">
                      Instagram
                    </span>
                    <span className="font-mono text-sm text-[#16181D] dark:text-[#ECE8DF] group-hover:text-[#D9532B] transition-colors">
                      @smork_frmdaeast
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#6B6F78] group-hover:text-[#D9532B] transition-colors" />
                </a>
              )}

              {settings.socials.facebook && (
                <a
                  href={settings.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-[2px] border border-[#D9D4C7] dark:border-[#22262F] bg-white dark:bg-[#15181F] hover:border-[#D9532B] transition-colors group flex items-baseline justify-between"
                >
                  <div>
                    <span className="font-mono text-xs text-[#6B6F78] dark:text-[#8E93A0] block">
                      Facebook
                    </span>
                    <span className="font-mono text-sm text-[#16181D] dark:text-[#ECE8DF] group-hover:text-[#D9532B] transition-colors">
                      Facebook Profile
                    </span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#6B6F78] group-hover:text-[#D9532B] transition-colors" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox for profile photo */}
      <Lightbox
        isOpen={isPhotoLightboxOpen}
        onClose={() => setIsPhotoLightboxOpen(false)}
        src={normalizeImagePath(settings.profilePhoto)}
        alt={settings.name}
        caption={`${settings.name} (${settings.handle}) — Software Engineer`}
        triggerRef={avatarButtonRef}
      />
    </div>
  );
};
