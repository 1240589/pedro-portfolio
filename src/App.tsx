/* eslint-disable prefer-const */
import React, { useState, useEffect, useCallback } from 'react';
import { Code2, Github, Linkedin, Mail, ChevronDown, Globe, Terminal, Coffee, Star, Sparkles } from 'lucide-react';
import { getGithubProjects } from './services/github';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleSystem from './components/ParticleSystem';
import { submitContactForm } from './services/contact';

function AppContent() {
  const [isVisible, setIsVisible] = useState(false);
  const [trailElements, setTrailElements] = useState<Array<{ x: number; y: number; id: number; color: string }>>([]);
  const [explosions, setExplosions] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  interface Project {
    id: number;
    title: string;
    description: string;
    stars: number;
    topics: string[];
    language: string;
    url: string;
  }

  const [projects, setProjects] = useState<Project[]>([]);
  const [showScrollMessage, setShowScrollMessage] = useState(false);
  const [lastScrollTime, setLastScrollTime] = useState(Date.now());
  const [lastScrollY, setLastScrollY] = useState(0);

  const getRandomColor = () => {
    const colors = [
      'rgba(59, 130, 246, 0.6)',   // blue
      'rgba(16, 185, 129, 0.6)',   // green
      'rgba(236, 72, 153, 0.6)',   // pink
      'rgba(245, 158, 11, 0.6)',   // amber
      'rgba(139, 92, 246, 0.6)',   // purple
      'rgba(14, 165, 233, 0.6)',   // sky
      'rgba(248, 113, 113, 0.6)',  // red
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    let trailCleanupInterval: number;

    const handleMouseMove = (e: MouseEvent) => {
      setTrailElements(prev => [
        {
          x: e.clientX,
          y: e.clientY,
          id: Date.now(),
          color: getRandomColor()
        },
        ...prev.slice(0, 10)  // Reduce trail length
      ]);
    };

    // Automatically clean up old trail elements
    trailCleanupInterval = window.setInterval(() => {
      setTrailElements(prev => prev.filter(elem => Date.now() - elem.id < 1000));
    }, 1000);

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(trailCleanupInterval);
      setTrailElements([]); // Clear all trails on unmount
    };
  }, []);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);
        const githubProjects = await getGithubProjects();
        if (githubProjects.length === 0) {
          setError('No projects found. They might be private or not available.');
        }
        setProjects(githubProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);


  const handleClick = (e: React.MouseEvent) => {
    const newExplosion = {
      x: e.clientX,
      y: e.clientY,
      id: Date.now(),
    };
    setExplosions(prev => [...prev, newExplosion]);
    setTimeout(() => {
      setExplosions(prev => prev.filter(exp => exp.id !== newExplosion.id));
    }, 1000);
  };

  const handleFastScroll = useCallback(() => {
    const currentTime = Date.now();
    const currentScroll = window.scrollY;
    const timeDiff = currentTime - lastScrollTime;
    const scrollDiff = Math.abs(currentScroll - lastScrollY);
    const scrollSpeed = scrollDiff / timeDiff;

    if (scrollSpeed > 2) { // Adjust this threshold as needed
      setShowScrollMessage(true);
      setTimeout(() => setShowScrollMessage(false), 3000);
    }

    setLastScrollTime(currentTime);
    setLastScrollY(currentScroll);
  }, [lastScrollTime, lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleFastScroll);
    return () => window.removeEventListener('scroll', handleFastScroll);
  }, [handleFastScroll]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: null, message: '' });

    // Basic validation
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setFormStatus({ type: 'error', message: 'Please fill in all fields.' });
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      setFormStatus({ type: 'error', message: 'Please enter a valid email address.' });
      setIsSubmitting(false);
      return;
    }

    try {
      await submitContactForm(contactForm);
      setFormStatus({ type: 'success', message: 'Message sent successfully!' });
      setContactForm({ name: '', email: '', message: '' });
    } catch {
      setFormStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative" onClick={handleClick}>
      <ParticleSystem />
      
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center relative px-4">
        <div 
          className={`text-center max-w-4xl mx-auto transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="mb-6 inline-block relative">
            <Code2 
              size={48} 
              className="text-blue-400 animate-pulse" 
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
            Pedro Cruz
          </h1>
          <h2 className="text-2xl md:text-3xl text-gray-300 mb-8">
            Informatics Engineering Student @ ISEP Porto
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Transforming complex challenges into elegant solutions through innovative engineering
          </p>
          <div className="flex justify-center gap-6">
            <a href="https://github.com/1240589" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110">
              <Github size={24} />
            </a>
            <a href="https://www.linkedin.com/in/pruz19/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110">
              <Linkedin size={24} />
            </a>
            <a href="mailto:pedrocruz1910@gmail.com" className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110">
              <Mail size={24} />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors transform hover:scale-110">
              <Globe size={24} />
            </a>
          </div>
        </div>
        <button 
          onClick={() => scrollToSection('projects')}
          className="absolute bottom-10 animate-bounce text-gray-400 hover:text-blue-400 transition-colors"
        >
          <ChevronDown size={32} />
        </button>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
            Featured Projects
          </h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-400"></div>
            </div>
          ) : error ? (
            <div className="text-center text-gray-400 py-10">
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-slate-800/50 rounded-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300 border border-slate-700/50 hover:border-blue-400/50"
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-yellow-400">
                          <Star size={16} />
                          {project.stars}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4 flex-grow">
                      {project.description || 'No description available'}
                    </p>
                    <div className="space-y-4">
                      {project.topics.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.topics.map((topic) => (
                            <span key={topic} className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full">
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          {project.language}
                        </span>
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <Github size={16} />
                          View Project
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
            Let's Connect
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-blue-400">Get in Touch</h3>
              <p className="text-gray-300">
                I'm always interested in hearing about new projects and opportunities.
                Let's discuss how we can work together!
              </p>
              <div className="space-y-4">
                <a href="mailto:pedrocruz1910@gmail.com" className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors">
                  <Mail size={20} />
                  pedrocruz1910@gmail.com
                </a>
                <a href="https://www.linkedin.com/in/pruz19/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors">
                  <Linkedin size={20} />
                  linkedin.com/in/pruz19
                </a>
                <a href="https://github.com/1240589" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors">
                  <Terminal size={20} />
                  github.com/1240589
                </a>
              </div>
            </div>
            <form className="space-y-6" onSubmit={handleContactSubmit}>
              <div>
                <label htmlFor="name" className="block text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-white"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-white"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-300 mb-2">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 text-white"
                  disabled={isSubmitting}
                ></textarea>
              </div>
              {formStatus.message && (
                <div className={`p-3 rounded-lg ${
                  formStatus.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {formStatus.message}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold 
                  hover:from-blue-600 hover:to-teal-600 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-gray-400 border-t border-slate-700/50">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Coffee className="text-blue-400" />
          <span>Made in Porto, Portugal</span>
        </div>
        <p>© 2024 Pedro Cruz. All rights reserved.</p>
      </footer>

      {/* Trail Effect */}
      {trailElements.map((element, index) => (
        <div
          key={element.id}
          className="fixed pointer-events-none"
          style={{
            left: element.x,
            top: element.y,
            transform: 'translate(-50%, -50%)',
            width: `${14 - index * 0.7}px`,  // Smoother size reduction
            height: `${14 - index * 0.7}px`,
            borderRadius: '50%',
            backgroundColor: element.color,
            opacity: 1 - (index * 0.06),     // Slower fade
            filter: 'blur(1px)',             // Add slight blur
            zIndex: 9999,
          }}
        />
      ))}

      {/* Click Explosions */}
      {explosions.map(explosion => (
        <div
          key={explosion.id}
          className="fixed pointer-events-none"
          style={{
            position: 'fixed',
            left: explosion.x,
            top: explosion.y,
            width: 0,
            height: 0,
          }}
        >
          <div 
            className="explosion" 
            style={{ 
              background: `radial-gradient(circle, 
                ${getRandomColor()} 0%, 
                rgba(59, 130, 246, 0.2) 70%, 
                transparent 100%
              )` 
            }} 
          />
        </div>
      ))}

      <AnimatePresence>
        {showScrollMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-lg shadow-lg max-w-sm"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="text-yellow-300" />
              <p className="font-medium">
                Whoa! You're scrolling faster than my deadlines. Let's slow down and appreciate this masterpiece! 
              </p>
            </div>
            <button
              onClick={() => setShowScrollMessage(false)}
              className="mt-2 text-sm text-blue-200 hover:text-white transition-colors"
            >
              Got it, I'll take it easy!
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;