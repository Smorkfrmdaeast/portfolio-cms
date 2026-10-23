import React from 'react';
import { SiteSettings } from '../types';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Mail } from 'lucide-react';

interface ResumeRouteProps {
  settings: SiteSettings;
}

export const ResumeRoute: React.FC<ResumeRouteProps> = ({ settings }) => {
  const hasResume = Boolean(settings.resumeUrl?.trim());

  return (
    <div className="max-w-xl mx-auto px-6 py-20 animate-fadeIn text-center">
      <div className="mb-8 text-left">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#6B6F78] dark:text-[#8E93A0] hover:text-[#D9532B] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
      </div>

      <div className="border border-[#D9D4C7] dark:border-[#22262F] bg-white dark:bg-[#15181F] p-8 rounded-[3px] shadow-sm">
        <div className="w-12 h-12 mx-auto rounded-[2px] bg-[#F4F1EA] dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] flex items-center justify-center text-[#D9532B] mb-4">
          <FileText className="w-6 h-6" />
        </div>

        <span className="font-mono text-xs uppercase tracking-wider text-[#D9532B]">
          Curriculum Vitae
        </span>
        <h1 className="font-serif text-3xl text-[#16181D] dark:text-[#ECE8DF] mt-1 mb-3">
          {settings.name}
        </h1>
        <p className="font-mono text-xs text-[#6B6F78] dark:text-[#8E93A0] mb-6">
          {settings.roleLine}
        </p>

        {hasResume ? (
          <div className="space-y-4">
            <p className="text-sm text-[#2C3038] dark:text-[#ECE8DF] leading-relaxed">
              Official technical resume and qualifications summary.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <a
                href={settings.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#16181D] dark:bg-[#ECE8DF] text-[#F4F1EA] dark:text-[#16181D] font-mono text-xs uppercase tracking-wider rounded-[2px] hover:bg-[#D9532B] dark:hover:bg-[#D9532B] dark:hover:text-white transition-colors inline-flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Resume</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-[#6B6F78] dark:text-[#8E93A0] leading-relaxed">
              A downloadable PDF resume has not been attached yet in the CMS settings. Please contact directly via email for a complete copy.
            </p>
            <div className="pt-2">
              <a
                href={settings.socials.email}
                className="px-4 py-2 bg-[#16181D] dark:bg-[#ECE8DF] text-[#F4F1EA] dark:text-[#16181D] font-mono text-xs uppercase tracking-wider rounded-[2px] hover:bg-[#D9532B] transition-colors inline-flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Request Resume by Email</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
