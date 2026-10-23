import React, { useState } from 'react';
import { Project, SiteSettings, ToastType } from '../types';
import { useAuth } from '../hooks/useAuth';
import { AdminLogin } from '../features/admin/AdminLogin';
import { AdminDashboard } from '../features/admin/AdminDashboard';
import { ProjectEditor } from '../features/admin/ProjectEditor';
import { SettingsEditor } from '../features/admin/SettingsEditor';

interface AdminRouteProps {
  projects: Project[];
  settings: SiteSettings;
  onCreateProject: (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Project>;
  onUpdateProject: (id: string, updates: Partial<Project>) => Promise<Project>;
  onDeleteProject: (id: string) => Promise<void>;
  onDuplicateProject: (id: string) => Promise<Project>;
  onReorderProjects: (orderedIds: string[]) => Promise<void>;
  onUpdateSettings: (updates: Partial<SiteSettings>) => Promise<SiteSettings>;
  onResetDefaults: () => Promise<void>;
  onShowToast: (msg: string, type?: ToastType, action?: { label: string; onClick: () => void }) => void;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({
  projects,
  settings,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  onDuplicateProject,
  onReorderProjects,
  onUpdateSettings,
  onResetDefaults,
  onShowToast,
}) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Subview states
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [isEditingSettings, setIsEditingSettings] = useState(false);

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <span className="font-mono text-xs uppercase tracking-wider text-[#D9532B]">
          Verifying session...
        </span>
        <div className="mt-4 flex justify-center">
          <div className="w-6 h-6 border-2 border-[#D9532B] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Not signed in as admin
  if (!isAuthenticated || !user) {
    return <AdminLogin />;
  }

  // Editing Project view
  if (editingProject) {
    return (
      <ProjectEditor
        initialProject={editingProject}
        existingProjects={projects}
        onSave={async (data) => {
          await onUpdateProject(editingProject.id, data);
          onShowToast(`Updated "${data.title}"`, 'success');
          setEditingProject(null);
        }}
        onCancel={() => setEditingProject(null)}
      />
    );
  }

  // Creating new project view
  if (isCreatingProject) {
    return (
      <ProjectEditor
        initialProject={null}
        existingProjects={projects}
        onSave={async (data) => {
          await onCreateProject(data);
          onShowToast(`Created and published "${data.title}"`, 'success');
          setIsCreatingProject(false);
        }}
        onCancel={() => setIsCreatingProject(false)}
      />
    );
  }

  // Editing site settings view
  if (isEditingSettings) {
    return (
      <SettingsEditor
        settings={settings}
        onSave={async (updates) => {
          await onUpdateSettings(updates);
          onShowToast('Site settings updated successfully', 'success');
          setIsEditingSettings(false);
        }}
        onBack={() => setIsEditingSettings(false)}
      />
    );
  }

  // Main Dashboard
  return (
    <AdminDashboard
      projects={projects}
      settings={settings}
      onEditProject={(project) => setEditingProject(project)}
      onCreateProject={() => setIsCreatingProject(true)}
      onEditSettings={() => setIsEditingSettings(true)}
      onDeleteProject={onDeleteProject}
      onDuplicateProject={async (id) => {
        await onDuplicateProject(id);
      }}
      onReorderProjects={onReorderProjects}
      onResetDefaults={onResetDefaults}
      onImportBackup={async (data) => {
        for (const p of data.projects) {
          const existing = projects.find((ep) => ep.id === p.id);
          if (existing && p.id) {
            await onUpdateProject(p.id, p);
          } else {
            await onCreateProject(p);
          }
        }
        if (data.settings) {
          await onUpdateSettings(data.settings);
        }
      }}
      onShowToast={onShowToast}
    />
  );
};
