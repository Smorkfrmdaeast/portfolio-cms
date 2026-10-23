import React, { useState, useEffect } from 'react';
import { Project } from '../types';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: Project) => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onAddProject,
}) => {
  const [title, setTitle] = useState('');
  const [tech, setTech] = useState('');
  const [live, setLive] = useState('');
  const [github, setGithub] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setTech('');
      setLive('');
      setGithub('');
      setDescription('');
      setImageUrl('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProject: Project = {
      id: Date.now().toString(),
      title: title.trim(),
      tech: tech.trim(),
      live: live.trim(),
      github: github.trim(),
      description: description.trim(),
      image: imageUrl.trim() || '/assets/smorks-paydom-platform.jpg',
    };

    onAddProject(newProject);
    onClose();
  };

  return (
    <div
      id="projectModal"
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="glass p-6 w-full max-w-md bg-[#0f172a]/95 text-white shadow-2xl border border-white/20 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-blue-400">Add Project</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ✖
          </button>
        </div>

        <form id="projectForm" onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Project Title *
            </label>
            <input
              id="projectTitle"
              type="text"
              required
              placeholder="e.g. AI PORTFOLIO"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-gray-800 rounded border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Tech Stack
            </label>
            <input
              id="projectTech"
              type="text"
              placeholder="e.g. React, Tailwind CSS, TypeScript"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              className="w-full p-2.5 bg-gray-800 rounded border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Live Demo URL
            </label>
            <input
              id="projectLive"
              type="url"
              placeholder="https://..."
              value={live}
              onChange={(e) => setLive(e.target.value)}
              className="w-full p-2.5 bg-gray-800 rounded border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              GitHub Repository URL
            </label>
            <input
              id="projectGit"
              type="url"
              placeholder="https://github.com/..."
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full p-2.5 bg-gray-800 rounded border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Image URL (optional)
            </label>
            <input
              type="text"
              placeholder="Leave empty for default image or paste image link"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full p-2.5 bg-gray-800 rounded border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="projectDesc"
              rows={3}
              placeholder="Brief description of the application..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-gray-800 rounded border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-gray-700/50">
            <button
              type="button"
              id="closeProjectModal"
              onClick={onClose}
              className="glass px-4 py-2 hover:bg-gray-700/50 text-sm font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="glass px-4 py-2 hover:bg-blue-600 bg-blue-600/30 text-white font-medium text-sm transition cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
