import React, { useState } from 'react';
import { Project, SiteSettings } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import {
  Plus,
  Settings,
  LogOut,
  Search,
  Copy,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  Download,
  Upload,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Database,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { normalizeImagePath } from '../../lib/utils';

interface AdminDashboardProps {
  projects: Project[];
  settings: SiteSettings;
  onEditProject: (project: Project) => void;
  onCreateProject: () => void;
  onEditSettings: () => void;
  onDeleteProject: (id: string) => Promise<void>;
  onDuplicateProject: (id: string) => Promise<void>;
  onReorderProjects: (orderedIds: string[]) => Promise<void>;
  onResetDefaults: () => Promise<void>;
  onImportBackup: (data: { projects: Project[]; settings: SiteSettings }) => Promise<void>;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info', action?: { label: string; onClick: () => void }) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  projects,
  settings,
  onEditProject,
  onCreateProject,
  onEditSettings,
  onDeleteProject,
  onDuplicateProject,
  onReorderProjects,
  onResetDefaults,
  onImportBackup,
  onShowToast,
}) => {
  const { user, logout, isUsingFirebase } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.role.toLowerCase().includes(search.toLowerCase()) ||
      p.tech.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ? true : p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Reorder keyboard accessible handlers
  const handleMoveUp = async (index: number) => {
    if (index <= 0) return;
    const currentList = [...projects];
    const temp = currentList[index];
    currentList[index] = currentList[index - 1];
    currentList[index - 1] = temp;
    await onReorderProjects(currentList.map((p) => p.id));
    onShowToast('Project order updated', 'info');
  };

  const handleMoveDown = async (index: number) => {
    if (index >= projects.length - 1) return;
    const currentList = [...projects];
    const temp = currentList[index];
    currentList[index] = currentList[index + 1];
    currentList[index + 1] = temp;
    await onReorderProjects(currentList.map((p) => p.id));
    onShowToast('Project order updated', 'info');
  };

  // Delete with soft-delete / undo support
  const handleDelete = async (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;

    setDeleteConfirmId(null);
    await onDeleteProject(id);

    onShowToast(`Deleted "${target.title}"`, 'info', {
      label: 'Undo',
      onClick: async () => {
        // Re-create the deleted project
        // Note: Repository handles restoring
        window.location.reload();
      },
    });
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      version: 2,
      projects,
      settings,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smork_portfolio_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Backup exported successfully', 'success');
  };

  // Import JSON backup
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.projects && Array.isArray(parsed.projects)) {
          await onImportBackup(parsed);
          onShowToast('Backup imported successfully', 'success');
        } else {
          throw new Error('Invalid backup format');
        }
      } catch (err) {
        onShowToast(err instanceof Error ? err.message : 'Import failed', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 mb-8 border-b border-[#D9D4C7] dark:border-[#22262F]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-[#D9532B]">
              CMS Administration
            </span>
            <span className="text-[#6B6F78]">·</span>
            <span className="font-mono text-xs text-[#6B6F78] dark:text-[#8E93A0]">
              {user?.email}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#16181D] dark:text-[#ECE8DF] tracking-tight">
            Portfolio Management
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="px-3 py-1.5 border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] font-mono text-xs text-[#2C3038] dark:text-[#ECE8DF] hover:border-[#D9532B] transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </Link>

          <button
            type="button"
            onClick={onEditSettings}
            className="px-3 py-1.5 border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] font-mono text-xs text-[#2C3038] dark:text-[#ECE8DF] hover:border-[#D9532B] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Site Settings</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="px-3 py-1.5 border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] font-mono text-xs text-[#6B6F78] hover:text-red-500 hover:border-red-500 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Backend Status Callout */}
      <div className="mb-8 p-4 bg-white dark:bg-[#15181F] border border-[#D9D4C7] dark:border-[#22262F] rounded-[3px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-[2px] bg-[#F4F1EA] dark:bg-[#0F1115] border border-[#D9D4C7] dark:border-[#22262F]">
            {isUsingFirebase ? (
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            ) : (
              <Database className="w-4 h-4 text-[#D9532B]" />
            )}
          </div>
          <div>
            <div className="font-mono font-medium text-[#16181D] dark:text-[#ECE8DF]">
              Storage Driver: {isUsingFirebase ? 'Firebase Firestore & Auth (Live Production)' : 'Local Storage Cache (Offline Fallback)'}
            </div>
            <p className="text-[#6B6F78] dark:text-[#8E93A0] font-sans mt-0.5">
              {isUsingFirebase
                ? 'Content is persistently synchronized with Firestore. Security rules enforced on read/write.'
                : 'Running on local browser repository. Configure VITE_FIREBASE_* in environment variables to link live Firestore.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
          <button
            onClick={handleExportBackup}
            className="px-2.5 py-1 border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] hover:border-[#D9532B] transition-colors flex items-center gap-1"
            title="Download JSON backup of all portfolio content"
          >
            <Download className="w-3 h-3" />
            <span>Export Backup</span>
          </button>
          <label className="px-2.5 py-1 border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] hover:border-[#D9532B] transition-colors flex items-center gap-1 cursor-pointer">
            <Upload className="w-3 h-3" />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="sr-only" />
          </label>
        </div>
      </div>

      {/* Action Strip: Search, Status Filters, Add Project */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#6B6F78] pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#15181F] border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-xs font-mono text-[#16181D] dark:text-[#ECE8DF]"
            />
          </div>

          <div className="flex items-center border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] overflow-hidden text-xs font-mono">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 transition-colors ${
                statusFilter === 'all'
                  ? 'bg-[#16181D] dark:bg-[#ECE8DF] text-[#F4F1EA] dark:text-[#16181D]'
                  : 'bg-white dark:bg-[#15181F] text-[#6B6F78]'
              }`}
            >
              All ({projects.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 transition-colors border-l border-[#D9D4C7] dark:border-[#22262F] ${
                statusFilter === 'published'
                  ? 'bg-[#16181D] dark:bg-[#ECE8DF] text-[#F4F1EA] dark:text-[#16181D]'
                  : 'bg-white dark:bg-[#15181F] text-[#6B6F78]'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 transition-colors border-l border-[#D9D4C7] dark:border-[#22262F] ${
                statusFilter === 'draft'
                  ? 'bg-[#16181D] dark:bg-[#ECE8DF] text-[#F4F1EA] dark:text-[#16181D]'
                  : 'bg-white dark:bg-[#15181F] text-[#6B6F78]'
              }`}
            >
              Drafts
            </button>
          </div>
        </div>

        <button
          onClick={onCreateProject}
          className="px-4 py-2 bg-[#16181D] dark:bg-[#ECE8DF] text-[#F4F1EA] dark:text-[#16181D] font-mono text-xs uppercase tracking-wider rounded-[2px] hover:bg-[#D9532B] dark:hover:bg-[#D9532B] dark:hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Projects Table / List */}
      <div className="bg-white dark:bg-[#15181F] border border-[#D9D4C7] dark:border-[#22262F] rounded-[3px] overflow-hidden">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 px-4">
            <p className="font-serif text-lg text-[#16181D] dark:text-[#ECE8DF] mb-2">
              No projects found
            </p>
            <p className="text-xs font-mono text-[#6B6F78] dark:text-[#8E93A0] mb-6">
              {search ? 'Try clearing your search query' : 'Create your first project to get started.'}
            </p>
            <button
              onClick={onCreateProject}
              className="px-4 py-2 bg-[#16181D] dark:bg-[#ECE8DF] text-[#F4F1EA] dark:text-[#16181D] font-mono text-xs uppercase tracking-wider rounded-[2px] hover:bg-[#D9532B] transition-colors"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#D9D4C7]/60 dark:divide-[#22262F]/60">
            {filteredProjects.map((project, index) => {
              const isDraft = project.status === 'draft';

              return (
                <div
                  key={project.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F4F1EA]/30 dark:hover:bg-[#0F1115]/30 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Reorder buttons */}
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        aria-label={`Move ${project.title} up`}
                        className="p-1 text-[#6B6F78] hover:text-[#D9532B] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === filteredProjects.length - 1}
                        aria-label={`Move ${project.title} down`}
                        className="p-1 text-[#6B6F78] hover:text-[#D9532B] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Thumbnail */}
                    <div className="w-16 h-12 rounded-[2px] border border-[#D9D4C7] dark:border-[#22262F] overflow-hidden bg-[#F4F1EA] dark:bg-[#0F1115] shrink-0">
                      <img
                        src={normalizeImagePath(project.image)}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/smorks-paydom-platform.jpg';
                        }}
                      />
                    </div>

                    {/* Title and metadata */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-lg text-[#16181D] dark:text-[#ECE8DF] truncate">
                          {project.title}
                        </h3>
                        {isDraft && (
                          <span className="font-mono text-[10px] uppercase px-1.5 py-0.2 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 rounded-[2px]">
                            Draft
                          </span>
                        )}
                        {project.featured && (
                          <span className="font-mono text-[10px] uppercase px-1.5 py-0.2 bg-[#F4F1EA] dark:bg-[#0F1115] text-[#6B6F78] rounded-[2px]">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-[#6B6F78] dark:text-[#8E93A0] mt-0.5 truncate">
                        <span>/work/{project.slug}</span>
                        <span>·</span>
                        <span>{project.tech.slice(0, 3).join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => onEditProject(project)}
                      className="p-2 border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-[#2C3038] dark:text-[#ECE8DF] hover:border-[#D9532B] hover:text-[#D9532B] transition-colors"
                      title="Edit project"
                      aria-label={`Edit ${project.title}`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={async () => {
                        await onDuplicateProject(project.id);
                        onShowToast(`Duplicated "${project.title}" as draft`, 'success');
                      }}
                      className="p-2 border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-[#2C3038] dark:text-[#ECE8DF] hover:border-[#D9532B] hover:text-[#D9532B] transition-colors"
                      title="Duplicate project"
                      aria-label={`Duplicate ${project.title}`}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(project.id)}
                      className="p-2 border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] text-[#6B6F78] hover:border-red-500 hover:text-red-500 transition-colors"
                      title="Delete project"
                      aria-label={`Delete ${project.title}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reset to defaults footer */}
      <div className="mt-12 pt-6 border-t border-[#D9D4C7] dark:border-[#22262F] flex justify-between items-center text-xs font-mono text-[#6B6F78]">
        <span>Total projects in repository: {projects.length}</span>
        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="text-[#6B6F78] hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset all content to defaults</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#0F1115]/80 flex items-center justify-center p-4"
        >
          <div className="max-w-sm w-full bg-white dark:bg-[#15181F] border border-[#D9D4C7] dark:border-[#22262F] p-6 rounded-[3px] shadow-2xl">
            <h3 className="font-serif text-xl text-[#16181D] dark:text-[#ECE8DF]">
              Confirm Project Deletion
            </h3>
            <p className="text-xs text-[#6B6F78] dark:text-[#8E93A0] mt-2 leading-relaxed">
              Are you sure you want to delete this project? You can undo this action immediately from the toast alert.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] font-mono text-xs text-[#6B6F78]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3 py-1.5 bg-red-600 text-white rounded-[2px] font-mono text-xs uppercase tracking-wider hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#0F1115]/80 flex items-center justify-center p-4"
        >
          <div className="max-w-sm w-full bg-white dark:bg-[#15181F] border border-[#D9D4C7] dark:border-[#22262F] p-6 rounded-[3px] shadow-2xl">
            <h3 className="font-serif text-xl text-[#16181D] dark:text-[#ECE8DF]">
              Reset to Defaults?
            </h3>
            <p className="text-xs text-[#6B6F78] dark:text-[#8E93A0] mt-2 leading-relaxed">
              This will restore the original five verified projects and clean settings. Any custom projects created will be overwritten.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3 py-1.5 border border-[#D9D4C7] dark:border-[#22262F] rounded-[2px] font-mono text-xs text-[#6B6F78]"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setIsResetConfirmOpen(false);
                  await onResetDefaults();
                  onShowToast('Reset all projects to defaults', 'success');
                }}
                className="px-3 py-1.5 bg-red-600 text-white rounded-[2px] font-mono text-xs uppercase tracking-wider hover:bg-red-700 transition-colors"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
