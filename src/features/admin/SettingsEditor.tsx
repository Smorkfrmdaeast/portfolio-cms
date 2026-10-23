import React, { useState } from 'react';
import { SiteSettings } from '../../types';
import { settingsSchema } from '../../lib/validation';
import { processAndCompressImage, normalizeImagePath } from '../../lib/utils';
import { ArrowLeft, Save, Upload, AlertCircle } from 'lucide-react';

interface SettingsEditorProps {
  settings: SiteSettings;
  onSave: (updates: Partial<SiteSettings>) => Promise<void>;
  onBack: () => void;
}

export const SettingsEditor: React.FC<SettingsEditorProps> = ({
  settings,
  onSave,
  onBack,
}) => {
  const [name, setName] = useState(settings.name);
  const [handle, setHandle] = useState(settings.handle);
  const [roleLine, setRoleLine] = useState(settings.roleLine);
  const [statement, setStatement] = useState(settings.statement);
  const [statusLineText, setStatusLineText] = useState(settings.statusLineText || '');
  const [statusLineEnabled, setStatusLineEnabled] = useState(settings.statusLineEnabled);
  const [aboutText, setAboutText] = useState(settings.aboutText);
  const [profilePhoto, setProfilePhoto] = useState(settings.profilePhoto);
  const [resumeUrl, setResumeUrl] = useState(settings.resumeUrl || '');

  // Skills
  const [frontendSkills, setFrontendSkills] = useState(settings.skills.frontend.join(', '));
  const [backendSkills, setBackendSkills] = useState(settings.skills.backend.join(', '));
  const [toolsSkills, setToolsSkills] = useState(settings.skills.tools.join(', '));

  // Socials
  const [instagram, setInstagram] = useState(settings.socials.instagram);
  const [facebook, setFacebook] = useState(settings.socials.facebook);
  const [linkedin, setLinkedin] = useState(settings.socials.linkedin);
  const [github, setGithub] = useState(settings.socials.github);
  const [email, setEmail] = useState(settings.socials.email);
  const [whatsapp, setWhatsapp] = useState(settings.socials.whatsapp);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploadingPhoto(true);
    try {
      const res = await processAndCompressImage(file, 800, 800, 0.9);
      setProfilePhoto(res.dataUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to process profile photo');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload: Partial<SiteSettings> = {
      name,
      handle,
      roleLine,
      statement,
      statusLineText: statusLineText.trim() || undefined,
      statusLineEnabled,
      aboutText,
      profilePhoto: normalizeImagePath(profilePhoto),
      resumeUrl: resumeUrl.trim() || undefined,
      skills: {
        frontend: frontendSkills.split(',').map((s) => s.trim()).filter(Boolean),
        backend: backendSkills.split(',').map((s) => s.trim()).filter(Boolean),
        tools: toolsSkills.split(',').map((s) => s.trim()).filter(Boolean),
      },
      socials: {
        instagram: instagram.trim(),
        facebook: facebook.trim(),
        linkedin: linkedin.trim(),
        github: github.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim(),
      },
    };

    const validation = settingsSchema.safeParse({ ...settings, ...payload });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Validation error');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(payload);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-fadeIn">
      <div className="flex items-center justify-between gap-4 mb-8 pb-6 border-b border-[#D9D4C7] dark:border-[#22262F]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#6B6F78] dark:text-[#8E93A0] hover:text-[#D9532B] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </button>

        <button
          type="submit"
          form="settings-editor-form"
          disabled={isSaving}
          className="px-4 py-1.5 bg-[#16181D] dark:bg-[#ECE8DF] text-[#F4F1EA] dark:text-[#16181D] font-mono text-xs uppercase tracking-wider rounded-[2px] hover:bg-[#D9532B] dark:hover:bg-[#D9532B] dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving...' : 'Save Site Settings'}</span>
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-8 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-[2px] text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form id="settings-editor-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Profile & Name */}
        <div className="bg-white dark:bg-[#15181F] border border-[#D9D4C7] dark:border-[#22262F] p-6 rounded-[3px] space-y-5">
          <h2 className="font-serif text-xl text-[#16181D] dark:text-[#ECE8DF] border-b border-[#D9D4C7]/50 dark:border-[#22262F]/50 pb-3">
            Identity & Hero Content
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="s-name" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                Full Name *
              </label>
              <input
                id="s-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
              />
            </div>

            <div>
              <label htmlFor="s-handle" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                Handle / Alias *
              </label>
              <input
                id="s-handle"
                type="text"
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="s-role" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
              Role Line *
            </label>
            <input
              id="s-role"
              type="text"
              required
              value={roleLine}
              onChange={(e) => setRoleLine(e.target.value)}
              className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
            />
          </div>

          <div>
            <label htmlFor="s-statement" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
              Hero Sentence (Clear, unpretentious statement of what you build) *
            </label>
            <textarea
              id="s-statement"
              required
              rows={2}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
            />
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
              Profile Photo
            </label>
            <div className="flex items-center gap-4">
              <img
                src={normalizeImagePath(profilePhoto)}
                alt="Profile"
                className="w-20 h-20 rounded-[2px] object-cover border border-[#D9D4C7] dark:border-[#22262F]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/hero.jpg';
                }}
              />
              <div className="space-y-1.5">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] font-mono text-xs cursor-pointer hover:border-[#D9532B] transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingPhoto ? 'Uploading...' : 'Replace Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="sr-only"
                  />
                </label>
                <p className="text-[11px] font-mono text-[#6B6F78] dark:text-[#8E93A0]">
                  Max 8MB. Automatically resized and compressed.
                </p>
              </div>
            </div>
          </div>

          {/* Status Line Toggle */}
          <div className="pt-3 border-t border-[#D9D4C7]/50 dark:border-[#22262F]/50">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="s-status" className="font-mono text-xs text-[#2C3038] dark:text-[#8E93A0]">
                Status Line
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={statusLineEnabled}
                  onChange={(e) => setStatusLineEnabled(e.target.checked)}
                  className="accent-[#D9532B] w-4 h-4 rounded-[2px]"
                />
                <span className="text-xs font-mono text-[#2C3038] dark:text-[#ECE8DF]">
                  Show on public homepage
                </span>
              </label>
            </div>
            <input
              id="s-status"
              type="text"
              value={statusLineText}
              onChange={(e) => setStatusLineText(e.target.value)}
              placeholder="e.g. Available for select freelance and contract projects"
              className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
            />
          </div>
        </div>

        {/* About & Skills */}
        <div className="bg-white dark:bg-[#15181F] border border-[#D9D4C7] dark:border-[#22262F] p-6 rounded-[3px] space-y-5">
          <h2 className="font-serif text-xl text-[#16181D] dark:text-[#ECE8DF] border-b border-[#D9D4C7]/50 dark:border-[#22262F]/50 pb-3">
            About Section & Skills
          </h2>

          <div>
            <label htmlFor="s-about" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
              About Bio (Editorial prose in your honest voice) *
            </label>
            <textarea
              id="s-about"
              required
              rows={5}
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF] leading-relaxed"
            />
          </div>

          <div className="space-y-3 pt-3 border-t border-[#D9D4C7]/50 dark:border-[#22262F]/50">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#D9532B]">
              Skill Groups (Comma-separated text lists — no percentage bars)
            </h3>

            <div>
              <label htmlFor="s-front" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                Frontend Technologies
              </label>
              <input
                id="s-front"
                type="text"
                value={frontendSkills}
                onChange={(e) => setFrontendSkills(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
              />
            </div>

            <div>
              <label htmlFor="s-back" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                Backend Technologies
              </label>
              <input
                id="s-back"
                type="text"
                value={backendSkills}
                onChange={(e) => setBackendSkills(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
              />
            </div>

            <div>
              <label htmlFor="s-tools" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                Tools & Practices
              </label>
              <input
                id="s-tools"
                type="text"
                value={toolsSkills}
                onChange={(e) => setToolsSkills(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
              />
            </div>
          </div>
        </div>

        {/* Contact Links & Resume */}
        <div className="bg-white dark:bg-[#15181F] border border-[#D9D4C7] dark:border-[#22262F] p-6 rounded-[3px] space-y-4">
          <h2 className="font-serif text-xl text-[#16181D] dark:text-[#ECE8DF] border-b border-[#D9D4C7]/50 dark:border-[#22262F]/50 pb-3">
            Contact Channels & Resume
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="s-email" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                Email
              </label>
              <input
                id="s-email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
              />
            </div>

            <div>
              <label htmlFor="s-wa" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                WhatsApp Link
              </label>
              <input
                id="s-wa"
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
              />
            </div>

            <div>
              <label htmlFor="s-gh" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                GitHub URL
              </label>
              <input
                id="s-gh"
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
              />
            </div>

            <div>
              <label htmlFor="s-li" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                LinkedIn URL
              </label>
              <input
                id="s-li"
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
              />
            </div>

            <div>
              <label htmlFor="s-ig" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                Instagram URL
              </label>
              <input
                id="s-ig"
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
              />
            </div>

            <div>
              <label htmlFor="s-fb" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                Facebook URL
              </label>
              <input
                id="s-fb"
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#D9D4C7]/50 dark:border-[#22262F]/50">
            <label htmlFor="s-resume" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
              Resume / CV Link (URL or PDF path — hidden publicly if empty)
            </label>
            <input
              id="s-resume"
              type="text"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="e.g. /assets/resume.pdf or Google Drive link"
              className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
            />
          </div>
        </div>
      </form>
    </div>
  );
};
