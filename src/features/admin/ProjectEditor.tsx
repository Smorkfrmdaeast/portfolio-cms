import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus } from '../../types';
import { projectSchema } from '../../lib/validation';
import { generateSlug, processAndCompressImage, normalizeImagePath } from '../../lib/utils';
import { ArrowLeft, Save, Eye, Upload, Plus, AlertCircle } from 'lucide-react';

interface ProjectEditorProps {
  initialProject?: Project | null;
  existingProjects: Project[];
  onSave: (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
}

export const ProjectEditor: React.FC<ProjectEditorProps> = ({
  initialProject,
  existingProjects,
  onSave,
  onCancel,
}) => {
  const isEditing = Boolean(initialProject);

  // Form State
  const [title, setTitle] = useState(initialProject?.title || '');
  const [slug, setSlug] = useState(initialProject?.slug || '');
  const [isSlugManual, setIsSlugManual] = useState(Boolean(initialProject?.slug));
  const [summary, setSummary] = useState(initialProject?.summary || '');
  const [year, setYear] = useState(initialProject?.year || new Date().getFullYear().toString());
  const [role, setRole] = useState(initialProject?.role || 'Frontend Engineering');
  const [techInput, setTechInput] = useState('');
  const [techTags, setTechTags] = useState<string[]>(initialProject?.tech || ['HTML', 'CSS', 'JavaScript']);
  const [image, setImage] = useState(initialProject?.image || '/assets/smorks-paydom-platform.jpg');
  const [liveUrl, setLiveUrl] = useState(initialProject?.liveUrl || '');
  const [githubUrl, setGithubUrl] = useState(initialProject?.githubUrl || '');
  const [status, setStatus] = useState<ProjectStatus>(initialProject?.status || 'published');
  const [featured, setFeatured] = useState(initialProject?.featured ?? true);
  const [problem, setProblem] = useState(initialProject?.sections?.problem || '');
  const [approach, setApproach] = useState(initialProject?.sections?.approach || '');
  const [result, setResult] = useState(initialProject?.sections?.result || '');
  const [seoTitle, setSeoTitle] = useState(initialProject?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(initialProject?.seoDescription || '');

  // UI state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-slug when title changes unless manually customized
  useEffect(() => {
    if (!isSlugManual && title) {
      setSlug(generateSlug(title));
    }
  }, [title, isSlugManual]);

  // Track changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [title, slug, summary, year, role, techTags, image, liveUrl, githubUrl, status, featured, problem, approach, result, seoTitle, seoDescription]);

  // Prompt if navigating away with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Handle tech tag add
  const handleAddTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !techTags.includes(trimmed)) {
      setTechTags([...techTags, trimmed]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (tagToRemove: string) => {
    setTechTags(techTags.filter((t) => t !== tagToRemove));
  };

  // Handle image upload and WebP compression
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    try {
      const result = await processAndCompressImage(file, 1600, 1200, 0.85);
      setImage(result.dataUrl);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate slug uniqueness against other projects
    const otherProjects = existingProjects.filter((p) => p.id !== initialProject?.id);
    if (otherProjects.some((p) => p.slug.toLowerCase() === slug.toLowerCase())) {
      setError(`The slug "${slug}" is already in use by another project.`);
      return;
    }

    const payload = {
      title,
      slug: slug || generateSlug(title),
      summary,
      year,
      role,
      tech: techTags,
      image: normalizeImagePath(image),
      liveUrl: liveUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      status,
      featured,
      order: initialProject?.order ?? existingProjects.length + 1,
      sections: {
        problem: problem.trim() || undefined,
        approach: approach.trim() || undefined,
        result: result.trim() || undefined,
      },
      seoTitle: seoTitle.trim() || undefined,
      seoDescription: seoDescription.trim() || undefined,
    };

    const validation = projectSchema.safeParse(payload);
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Validation error');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(payload);
      setHasUnsavedChanges(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-fadeIn">
      {/* Top Bar Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[#D9D4C7] dark:border-[#22262F]">
        <button
          type="button"
          onClick={() => {
            if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Discard?')) return;
            onCancel();
          }}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#6B6F78] dark:text-[#8E93A0] hover:text-[#D9532B] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Cancel and return to list
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            className="px-3 py-1.5 border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] font-mono text-xs text-[#2C3038] dark:text-[#ECE8DF] hover:border-[#D9532B] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isPreviewOpen ? 'Hide Live Preview' : 'Show Live Preview'}</span>
          </button>

          <button
            type="submit"
            form="project-editor-form"
            disabled={isSaving || isUploading}
            className="px-4 py-1.5 bg-[#16181D] dark:bg-[#ECE8DF] text-[#F4F1EA] dark:text-[#16181D] font-mono text-xs uppercase tracking-wider rounded-[2px] hover:bg-[#D9532B] dark:hover:bg-[#D9532B] dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : isEditing ? 'Update Project' : 'Publish Project'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-8 p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-[2px] text-xs text-red-700 dark:text-red-300 flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Error:</span> {error}
          </div>
        </div>
      )}

      {/* Editor / Live Preview split or single column */}
      <div className={`grid grid-cols-1 ${isPreviewOpen ? 'lg:grid-cols-2 gap-8' : ''}`}>
        {/* Main Editor Form */}
        <form id="project-editor-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-[#15181F] border border-[#D9D4C7] dark:border-[#22262F] p-6 rounded-[3px] space-y-5">
            <h2 className="font-serif text-xl text-[#16181D] dark:text-[#ECE8DF] border-b border-[#D9D4C7]/50 dark:border-[#22262F]/50 pb-3">
              Essential Details
            </h2>

            {/* Title */}
            <div>
              <label htmlFor="p-title" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                Project Title *
              </label>
              <input
                id="p-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fintech Dashboard"
                className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF] focus:border-[#D9532B] focus:ring-1 focus:ring-[#D9532B]"
              />
            </div>

            {/* Slug & Year Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="p-slug" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                  URL Slug *
                </label>
                <input
                  id="p-slug"
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setIsSlugManual(true);
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }}
                  placeholder="e.g. fintech-dashboard"
                  className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm font-mono text-[#16181D] dark:text-[#ECE8DF] focus:border-[#D9532B] focus:ring-1 focus:ring-[#D9532B]"
                />
                <span className="text-[11px] font-mono text-[#6B6F78] dark:text-[#8E93A0] mt-1 block">
                  /work/{slug || '...'}
                </span>
              </div>

              <div>
                <label htmlFor="p-year" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                  Year *
                </label>
                <input
                  id="p-year"
                  type="text"
                  required
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2025"
                  className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm font-mono text-[#16181D] dark:text-[#ECE8DF] focus:border-[#D9532B] focus:ring-1 focus:ring-[#D9532B]"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label htmlFor="p-role" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                Role / Discipline *
              </label>
              <input
                id="p-role"
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Frontend Engineering"
                className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF] focus:border-[#D9532B] focus:ring-1 focus:ring-[#D9532B]"
              />
            </div>

            {/* Summary */}
            <div>
              <label htmlFor="p-summary" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                One-Line Summary *
              </label>
              <textarea
                id="p-summary"
                required
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Concise, plain sentence describing what the project is."
                className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF] focus:border-[#D9532B] focus:ring-1 focus:ring-[#D9532B]"
              />
            </div>

            {/* Tech Tags */}
            <div>
              <label className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                Tech Stack Tags *
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTech();
                    }
                  }}
                  placeholder="e.g. React, TypeScript (press Enter to add)"
                  className="flex-1 px-3 py-1.5 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="px-3 py-1.5 border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] font-mono text-xs hover:border-[#D9532B] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {techTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#F4F1EA] dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] font-mono text-xs rounded-[2px]"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(tag)}
                      className="text-[#6B6F78] hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Status & Featured Switch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#D9D4C7]/50 dark:border-[#22262F]/50">
              <div>
                <label className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                  Publication Status
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStatus('published')}
                    className={`px-3 py-1 text-xs font-mono rounded-[2px] border ${
                      status === 'published'
                        ? 'bg-[#16181D] dark:bg-[#ECE8DF] text-[#F4F1EA] dark:text-[#16181D] font-medium border-transparent'
                        : 'border-[#D9D4C7] dark:border-[#22262F] text-[#6B6F78]'
                    }`}
                  >
                    Published
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('draft')}
                    className={`px-3 py-1 text-xs font-mono rounded-[2px] border ${
                      status === 'draft'
                        ? 'bg-[#16181D] dark:bg-[#ECE8DF] text-[#F4F1EA] dark:text-[#16181D] font-medium border-transparent'
                        : 'border-[#D9D4C7] dark:border-[#22262F] text-[#6B6F78]'
                    }`}
                  >
                    Draft
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                  Featured on Home
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer mt-1">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="accent-[#D9532B] w-4 h-4 rounded-[2px]"
                  />
                  <span className="text-xs font-mono text-[#2C3038] dark:text-[#ECE8DF]">
                    Display in selected works
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Links & Cover Image */}
          <div className="bg-white dark:bg-[#15181F] border border-[#D9D4C7] dark:border-[#22262F] p-6 rounded-[3px] space-y-5">
            <h2 className="font-serif text-xl text-[#16181D] dark:text-[#ECE8DF] border-b border-[#D9D4C7]/50 dark:border-[#22262F]/50 pb-3">
              Media & External Links
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="p-live" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                  Live Demo URL
                </label>
                <input
                  id="p-live"
                  type="url"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
                />
              </div>

              <div>
                <label htmlFor="p-github" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                  GitHub Repository URL
                </label>
                <input
                  id="p-github"
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
                />
              </div>
            </div>

            {/* Cover Image Upload and WebP Conversion */}
            <div>
              <label className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                Cover Image (Auto WebP compression) *
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="w-full sm:w-48 h-32 rounded-[2px] border border-[#D9D4C7] dark:border-[#22262F] overflow-hidden bg-[#F4F1EA] dark:bg-[#0F1115] shrink-0">
                  <img
                    src={normalizeImagePath(image)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/smorks-paydom-platform.jpg';
                    }}
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] font-mono text-xs cursor-pointer hover:border-[#D9532B] transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? 'Compressing WebP...' : 'Upload Image File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="text-[11px] font-mono text-[#6B6F78] dark:text-[#8E93A0]">
                    Files are compressed to WebP on the client before saving. Max 8MB.
                  </p>
                  <div>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="Or paste image path/URL"
                      className="w-full px-3 py-1.5 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-xs font-mono text-[#16181D] dark:text-[#ECE8DF]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Case Study Sections (Problem, Approach, Result) */}
          <div className="bg-white dark:bg-[#15181F] border border-[#D9D4C7] dark:border-[#22262F] p-6 rounded-[3px] space-y-5">
            <div>
              <h2 className="font-serif text-xl text-[#16181D] dark:text-[#ECE8DF]">
                Case Study Narrative
              </h2>
              <p className="text-xs font-mono text-[#6B6F78] dark:text-[#8E93A0] mt-1">
                Sections left empty will be hidden automatically on the public case study page.
              </p>
            </div>

            <div>
              <label htmlFor="p-problem" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                01 / The Problem & Context
              </label>
              <textarea
                id="p-problem"
                rows={3}
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="What challenge, usability issue, or architectural bottleneck did this address?"
                className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
              />
            </div>

            <div>
              <label htmlFor="p-approach" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                02 / The Approach & Engineering
              </label>
              <textarea
                id="p-approach"
                rows={3}
                value={approach}
                onChange={(e) => setApproach(e.target.value)}
                placeholder="How was it implemented? What architectural and design decisions were made?"
                className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
              />
            </div>

            <div>
              <label htmlFor="p-result" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                03 / The Result & Delivery
              </label>
              <textarea
                id="p-result"
                rows={3}
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="What was the concrete outcome? How does it behave now?"
                className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
              />
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="bg-white dark:bg-[#15181F] border border-[#D9D4C7] dark:border-[#22262F] p-6 rounded-[3px] space-y-4">
            <h2 className="font-serif text-xl text-[#16181D] dark:text-[#ECE8DF] border-b border-[#D9D4C7]/50 dark:border-[#22262F]/50 pb-3">
              SEO & Social Sharing
            </h2>
            <div>
              <label htmlFor="p-seotitle" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                SEO Meta Title (Optional)
              </label>
              <input
                id="p-seotitle"
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="e.g. Fintech Dashboard — Case Study | Ifeanyi Nnamani"
                className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
              />
            </div>

            <div>
              <label htmlFor="p-seodesc" className="block font-mono text-xs text-[#2C3038] dark:text-[#8E93A0] mb-1">
                SEO Meta Description (Optional)
              </label>
              <textarea
                id="p-seodesc"
                rows={2}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Brief summary for Google search and social share cards..."
                className="w-full px-3 py-2 bg-[#F4F1EA]/50 dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-sm text-[#16181D] dark:text-[#ECE8DF]"
              />
            </div>
          </div>
        </form>

        {/* Live Preview Pane */}
        {isPreviewOpen && (
          <div className="border border-[#D9D4C7] dark:border-[#22262F] bg-white dark:bg-[#15181F] p-6 rounded-[3px] sticky top-24 self-start max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#D9D4C7] dark:border-[#22262F]">
              <span className="font-mono text-xs uppercase tracking-wider text-[#D9532B]">
                Public Preview Mode
              </span>
              <span className="font-mono text-xs text-[#6B6F78]">
                {status === 'draft' ? '(Draft Preview)' : '(Published Preview)'}
              </span>
            </div>

            <div className="space-y-4">
              <span className="font-mono text-xs text-[#D9532B]">
                {year} / {role}
              </span>
              <h3 className="font-serif text-3xl text-[#16181D] dark:text-[#ECE8DF]">
                {title || 'Untitled Project'}
              </h3>
              <p className="text-sm text-[#6B6F78] dark:text-[#8E93A0]">
                {summary || 'No summary provided.'}
              </p>

              <div className="overflow-hidden rounded-[2px] border border-[#D9D4C7] dark:border-[#22262F]">
                <img
                  src={normalizeImagePath(image)}
                  alt={title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/smorks-paydom-platform.jpg';
                  }}
                />
              </div>

              {problem && (
                <div className="pt-3 border-t border-[#D9D4C7]/50">
                  <span className="font-mono text-xs text-[#D9532B]">01 / Problem</span>
                  <p className="text-xs text-[#2C3038] dark:text-[#ECE8DF] mt-1">{problem}</p>
                </div>
              )}

              {approach && (
                <div className="pt-3 border-t border-[#D9D4C7]/50">
                  <span className="font-mono text-xs text-[#D9532B]">02 / Approach</span>
                  <p className="text-xs text-[#2C3038] dark:text-[#ECE8DF] mt-1">{approach}</p>
                </div>
              )}

              {result && (
                <div className="pt-3 border-t border-[#D9D4C7]/50">
                  <span className="font-mono text-xs text-[#D9532B]">03 / Result</span>
                  <p className="text-xs text-[#2C3038] dark:text-[#ECE8DF] mt-1">{result}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
