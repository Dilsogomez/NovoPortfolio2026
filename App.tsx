
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Tools from './components/Tools';
import Projects from './components/Projects';
import CoursesPage from './components/CoursesPage';
import ProjectsPage from './components/ProjectsPage';
import BlogPage from './components/BlogPage';
import Metrics from './components/Metrics';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingChatbot from './components/FloatingChatbot';
import StudioAIPage from './components/BrainAIPage'; // Arquivo mantido, componente renomeado
import LabPage from './components/LabPage';

function App() {
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [currentPage, setCurrentPage] = useState<'home' | 'projects' | 'courses' | 'blog' | 'studio-ai' | 'lab'>('home');
    
    // Theme State Management
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
        }
        return 'dark';
    });

    // Apply Theme Class
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    // Scroll listener for BackToTop
    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNavigation = (page: 'home' | 'projects' | 'courses' | 'blog' | 'studio-ai' | 'lab') => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    return (
        <div className="relative min-h-screen font-sans selection:bg-blue-500 selection:text-white bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-500">
            
            {currentPage !== 'lab' && (
                <Header 
                    onNavigate={handleNavigation} 
                    currentPage={currentPage} 
                    theme={theme}
                    toggleTheme={toggleTheme}
                />
            )}
            
            <main className="relative z-10">
                {currentPage === 'home' && (
                    <>
                        <Hero />
                        <Projects />
                        <Tools />
                        <Metrics />
                        <Contact />
                    </>
                )}
                
                {currentPage === 'projects' && (
                    <ProjectsPage />
                )}

                {currentPage === 'lab' && (
                    <LabPage 
                        onBack={() => handleNavigation('home')} 
                        theme={theme}
                        toggleTheme={toggleTheme}
                    />
                )}

                {currentPage === 'courses' && (
                    <CoursesPage />
                )}

                {currentPage === 'blog' && (
                    <BlogPage />
                )}

                {currentPage === 'studio-ai' && (
                    <StudioAIPage />
                )}
            </main>

            {currentPage !== 'lab' && <Footer />}

            {/* Oculta o chat flutuante se estiver na página dedicada da IA ou no Laboratório para evitar duplicação */}
            {currentPage !== 'studio-ai' && currentPage !== 'lab' && <FloatingChatbot />}

            {/* Back To Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 left-8 w-12 h-12 rounded-full bg-white dark:bg-white/10 shadow-lg border border-gray-200 dark:border-white/20 text-gray-800 dark:text-white flex items-center justify-center text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl z-40 ${showBackToTop ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                aria-label="Back to top"
            >
                <i className="fas fa-arrow-up"></i>
            </button>
        </div>
    );
}

export default App;
