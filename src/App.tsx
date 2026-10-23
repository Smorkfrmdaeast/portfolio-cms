import React, { useState, useEffect } from 'react';
import { Project, Theme } from './types';
import { initialProjects } from './data/initialProjects';
import { ThemeToggle } from './components/ThemeToggle';
import { Hero } from './components/Hero';
import { HeroModal } from './components/HeroModal';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { ProjectDetailsModal } from './components/ProjectDetailsModal';
import { AddProjectModal } from './components/AddProjectModal';
import { Contact } from './components/Contact';
import { Toast } from './components/Toast';

const PROJECTS_STORAGE_KEY = 'smork_portfolio_projects';
const THEME_STORAGE_KEY = 'smork_portfolio_theme';

export const App: React.FC = () => {
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'light' ? 'light' : 'dark';
  });

  // Projects state
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback on parse failure
    }
    return initialProjects;
  });

  // Modals state
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Apply theme to body
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  // Persist projects to localStorage
  useEffect(() => {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2200);
  };

  const handleAddProject = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
    triggerToast('Project Added!');
  };

  const handleResetProjects = () => {
    setProjects(initialProjects);
    triggerToast('Projects reset to default!');
  };

  return (
    <div className="min-h-screen selection:bg-blue-600 selection:text-white">
      {/* Theme Toggle Button */}
      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      {/* Hero Section */}
      <Hero onOpenHeroModal={() => setIsHeroModalOpen(true)} />

      {/* About Section */}
      <About />

      {/* Projects Section */}
      <Projects
        projects={projects}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onSelectProject={(project) => setSelectedProject(project)}
      />

      {/* Quick Reset option if user modified project list */}
      {projects.length !== initialProjects.length && (
        <div className="text-center pb-6">
          <button
            onClick={handleResetProjects}
            className="text-xs text-gray-500 hover:text-blue-400 underline cursor-pointer"
          >
            Reset projects to default list
          </button>
        </div>
      )}

      {/* Contact Section */}
      <Contact />

      {/* Modals */}
      <HeroModal
        isOpen={isHeroModalOpen}
        onClose={() => setIsHeroModalOpen(false)}
        imageSrc="/assets/hero.jpg"
      />

      <ProjectDetailsModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProject={handleAddProject}
      />

      {/* Toast Notification */}
      <Toast message={toastMessage} show={showToast} />
    </div>
  );
};

export default App;
