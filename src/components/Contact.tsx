import React from 'react';

export const Contact: React.FC = () => {
  const contactLinks = [
    {
      name: 'Instagram',
      href: 'https://instagram.com/smork_frmdaeast',
      icon: 'fab fa-instagram',
      color: 'hover:text-pink-400',
    },
    {
      name: 'Facebook',
      href: 'https://facebook.com/share/1DhHJPTRXL/',
      icon: 'fab fa-facebook',
      color: 'hover:text-blue-500',
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/smorkfrmdaeast',
      icon: 'fab fa-linkedin',
      color: 'hover:text-sky-400',
    },
    {
      name: 'GitHub',
      href: 'https://github.com/Smorkfrmdaeast',
      icon: 'fab fa-github',
      color: 'hover:text-gray-300',
    },
    {
      name: 'Email',
      href: 'mailto:ifeanyinuels32@gmail.com',
      icon: 'fas fa-envelope',
      color: 'hover:text-red-400',
    },
    {
      name: 'WhatsApp',
      href: 'https://wa.me/2349019071679',
      icon: 'fab fa-whatsapp',
      color: 'hover:text-green-400',
    },
  ];

  return (
    <section id="contact" className="py-20 text-center px-6">
      <h2 className="text-3xl font-bold text-blue-400 mb-6 tracking-tight">Contact</h2>
      <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm">
        Feel free to reach out for collaborations, project inquiries, or freelance opportunities.
      </p>
      <div className="flex justify-center gap-6 text-2xl flex-wrap max-w-lg mx-auto">
        {contactLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.name}
            className={`glass p-4 rounded-full flex items-center justify-center w-14 h-14 transition duration-300 hover:scale-110 ${link.color}`}
            title={link.name}
          >
            <i className={link.icon} />
          </a>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-12">
        © {new Date().getFullYear()} Ifeanyi Nnamani (Smork). All rights reserved.
      </p>
    </section>
  );
};
