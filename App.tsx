import React, { useEffect, useState } from 'react';
import CanvasBackground from './components/CanvasBackground';
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

function App() {
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [currentPage, setCurrentPage] = useState<'home' | 'projects' | 'courses' | 'blog'>('home');

    // Enforce Dark Mode Always
    useEffect(() => {
        // Adiciona a classe dark ao html
        document.documentElement.classList.add('dark');
        // Garante que o localStorage fique sincronizado, caso usemos essa chave em outro lugar
        localStorage.setItem('theme', 'dark');
    }, []);

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

    const handleNavigation = (page: 'home' | 'projects' | 'courses' | 'blog') => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    return (
        <div className="relative min-h-screen font-sans selection:bg-blue-500 selection:text-white">
            <CanvasBackground />
            
            <Header onNavigate={handleNavigation} currentPage={currentPage} />
            
            <main className="relative z-10">
                {currentPage === 'home' && (
                    <>
                        <Hero />
                        <Tools />
                        <Projects />
                        <Metrics />
                        <Contact />
                    </>
                )}
                
                {currentPage === 'projects' && (
                    <ProjectsPage />
                )}

                {currentPage === 'courses' && (
                    <CoursesPage />
                )}

                {currentPage === 'blog' && (
                    <BlogPage />
                )}
            </main>

            <Footer />

            {/* Back To Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 w-12 h-12 rounded-full bg-black/20 dark:bg-white/10 backdrop-blur-md border border-white/20 text-white dark:text-white flex items-center justify-center text-lg shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-black/40 z-40 ${showBackToTop ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                aria-label="Back to top"
            >
                <i className="fas fa-arrow-up"></i>
            </button>
        </div>
    );
}

export default App;