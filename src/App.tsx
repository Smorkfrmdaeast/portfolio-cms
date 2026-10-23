import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useProjects } from './hooks/useProjects';
import { useSettings } from './hooks/useSettings';
import { useTheme } from './hooks/useTheme';
import { useToast } from './hooks/useToast';
import { useAuth } from './hooks/useAuth';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { ErrorBoundary } from './components/ErrorBoundary';

// Routes
import { HomeRoute } from './routes/HomeRoute';
import { WorkRoute } from './routes/WorkRoute';
import { CaseStudyRoute } from './routes/CaseStudyRoute';
import { ResumeRoute } from './routes/ResumeRoute';
import { AdminRoute } from './routes/AdminRoute';
import { NotFoundRoute } from './routes/NotFoundRoute';

export const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const { toasts, addToast, removeToast } = useToast();
  const { settings, updateSettings } = useSettings();

  // Load all projects including drafts for admin, or published for public
  const {
    projects,
    loading: projectsLoading,
    createProject,
    updateProject,
    deleteProject,
    reorderProjects,
    duplicateProject,
    resetProjects,
  } = useProjects({ includeDrafts: true });

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#F4F1EA] dark:bg-[#0F1115] text-[#16181D] dark:text-[#ECE8DF] transition-colors duration-200">
          {/* Global Header */}
          <Header
            theme={theme}
            onToggleTheme={toggleTheme}
            isAdmin={isAuthenticated}
          />

          {/* Main Content Area */}
          <main id="main-content" className="flex-1">
            {projectsLoading ? (
              <div className="max-w-6xl mx-auto px-6 py-24 text-center">
                <span className="font-mono text-xs uppercase tracking-wider text-[#D9532B]">
                  Loading...
                </span>
                <div className="mt-4 flex justify-center">
                  <div className="w-6 h-6 border-2 border-[#D9532B] border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            ) : (
              <Routes>
                {/* Home */}
                <Route
                  path="/"
                  element={<HomeRoute projects={projects} settings={settings} />}
                />

                {/* Work Archive */}
                <Route
                  path="/work"
                  element={<WorkRoute projects={projects} />}
                />

                {/* Case Study */}
                <Route
                  path="/work/:slug"
                  element={
                    <CaseStudyRoute
                      projects={projects}
                      isAdmin={isAuthenticated}
                    />
                  }
                />

                {/* Resume / CV */}
                <Route
                  path="/resume"
                  element={<ResumeRoute settings={settings} />}
                />

                {/* Admin CMS */}
                <Route
                  path="/admin/*"
                  element={
                    <AdminRoute
                      projects={projects}
                      settings={settings}
                      onCreateProject={createProject}
                      onUpdateProject={updateProject}
                      onDeleteProject={deleteProject}
                      onDuplicateProject={duplicateProject}
                      onReorderProjects={reorderProjects}
                      onUpdateSettings={updateSettings}
                      onResetDefaults={resetProjects}
                      onShowToast={addToast}
                    />
                  }
                />

                {/* 404 */}
                <Route path="*" element={<NotFoundRoute />} />
              </Routes>
            )}
          </main>

          {/* Global Footer on public routes */}
          <Footer settings={settings} />

          {/* Global Toast Container */}
          <ToastContainer toasts={toasts} onDismiss={removeToast} />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
