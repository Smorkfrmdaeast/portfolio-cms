import React from 'react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#D9D4C7] dark:border-[#22262F] py-16 px-6 mt-20 transition-colors duration-200">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <span className="font-serif text-xl tracking-tight text-[#16181D] dark:text-[#ECE8DF]">
            {settings.name}
          </span>
          <p className="text-xs font-mono text-[#6B6F78] dark:text-[#8E93A0] mt-1">
            {settings.roleLine}
          </p>
          <p className="text-xs text-[#6B6F78] dark:text-[#8E93A0] mt-4">
            Hand-crafted in React & TypeScript. No templates, no AI slop.
          </p>
        </div>

        <div className="flex flex-col md:items-end gap-3">
          <div className="flex flex-wrap gap-4 text-xs font-mono">
            {settings.socials.github && (
              <a
                href={settings.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6B6F78] dark:text-[#8E93A0] hover:text-[#D9532B] dark:hover:text-[#D9532B] transition-colors"
              >
                GitHub
              </a>
            )}
            {settings.socials.linkedin && (
              <a
                href={settings.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6B6F78] dark:text-[#8E93A0] hover:text-[#D9532B] dark:hover:text-[#D9532B] transition-colors"
              >
                LinkedIn
              </a>
            )}
            {settings.socials.email && (
              <a
                href={settings.socials.email}
                className="text-[#6B6F78] dark:text-[#8E93A0] hover:text-[#D9532B] dark:hover:text-[#D9532B] transition-colors"
              >
                Email
              </a>
            )}
            {settings.socials.whatsapp && (
              <a
                href={settings.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6B6F78] dark:text-[#8E93A0] hover:text-[#D9532B] dark:hover:text-[#D9532B] transition-colors"
              >
                WhatsApp
              </a>
            )}
            {settings.resumeUrl && (
              <a
                href={settings.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D9532B] hover:underline"
              >
                Resume (PDF)
              </a>
            )}
          </div>
          <span className="text-xs font-mono text-[#6B6F78] dark:text-[#8E93A0]">
            © {currentYear} {settings.name}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};
