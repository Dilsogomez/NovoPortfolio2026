import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';

interface HeaderProps {
    onNavigate?: (page: 'home' | 'projects' | 'courses' | 'blog' | 'brain-ai') => void;
    currentPage?: 'home' | 'projects' | 'courses' | 'blog' | 'brain-ai';
    theme?: 'dark' | 'light';
    toggleTheme?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage = 'home', theme = 'dark', toggleTheme }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (href: string, e: React.MouseEvent) => {
        setIsMenuOpen(false);
        
        if (href === '#projetos') {
            e.preventDefault();
            if (onNavigate) onNavigate('projects');
            return;
        }

        if (href === '#cursos') {
            e.preventDefault();
            if (onNavigate) onNavigate('courses');
            return;
        }

        if (href === '#blog') {
            e.preventDefault();
            if (onNavigate) onNavigate('blog');
            return;
        }

        if ((currentPage !== 'home') && href.startsWith('#')) {
            e.preventDefault();
            if (onNavigate) {
                onNavigate('home');
                setTimeout(() => {
                    const element = document.querySelector(href);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
            return;
        }
    };

    const handleLogoClick = () => {
        if (onNavigate) onNavigate('home');
    };

    const handleBrainAIClick = () => {
        if (onNavigate) onNavigate('brain-ai');
    };

    const isActive = (href: string) => {
        if (href === '#projetos' && currentPage === 'projects') return true;
        if (href === '#cursos' && currentPage === 'courses') return true;
        if (href === '#blog' && currentPage === 'blog') return true;
        return false;
    };

    return (
        <header className={`fixed top-0 left-0 w-full px-8 py-4 z-50 transition-all duration-300 ${
            scrolled 
                ? 'bg-white/90 dark:bg-black/95 border-b border-gray-200 dark:border-white/5 backdrop-blur-md py-3 shadow-sm dark:shadow-none' 
                : 'bg-transparent py-6'
        }`}>
            <nav className="max-w-6xl mx-auto flex justify-between items-center relative">
                {/* Left Side - Logo */}
                <div className="flex items-center z-50">
                    <div 
                        onClick={handleLogoClick}
                        className="text-2xl font-extrabold text-gray-900 dark:text-white transition-transform duration-300 hover:scale-105 cursor-pointer"
                    >
                        VG
                    </div>
                </div>

                {/* Desktop Navigation - Absolute Center */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <ul className="flex gap-8 items-center">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.label}>
                                <a 
                                    href={item.href}
                                    onClick={(e) => handleNavClick(item.href, e)}
                                    className={`font-medium text-lg relative group py-2 transition-colors ${
                                        isActive(item.href) 
                                            ? 'text-blue-600 dark:text-blue-400' 
                                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                >
                                    {item.label}
                                    <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 dark:bg-white transition-all duration-300 ${
                                        isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                                    }`}></span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3 z-50">
                    
                    {/* Theme Toggle Button */}
                    {toggleTheme && (
                        <button
                            onClick={toggleTheme}
                            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-yellow-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-all"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? (
                                <i className="fas fa-moon"></i>
                            ) : (
                                <i className="fas fa-sun text-yellow-500"></i>
                            )}
                        </button>
                    )}

                    {/* Desktop Brain IA Button */}
                    <button
                        onClick={handleBrainAIClick}
                        className={`hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all duration-300 group ${
                            currentPage === 'brain-ai' 
                                ? 'bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400' 
                                : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-white hover:shadow-md dark:hover:bg-white/10 dark:hover:text-white'
                        }`}
                    >
                        <i className={`fas fa-brain text-sm ${currentPage === 'brain-ai' ? 'animate-pulse' : 'group-hover:text-blue-500 dark:group-hover:text-blue-400'}`}></i>
                        <span className="text-sm font-medium tracking-wide">Brain IA</span>
                    </button>

                    {/* Mobile Brain IA Button */}
                    <button 
                        onClick={handleBrainAIClick}
                        className="md:hidden w-9 h-9 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-800 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-600/20 transition-all"
                    >
                        <i className="fas fa-brain text-xs"></i>
                    </button>

                    {/* Mobile Hamburger Button */}
                    <button 
                        className="flex flex-col justify-between w-8 h-5 cursor-pointer md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span className={`h-0.5 w-full bg-gray-800 dark:bg-white rounded transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`h-0.5 w-full bg-gray-800 dark:bg-white rounded transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`h-0.5 w-full bg-gray-800 dark:bg-white rounded transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`fixed top-0 right-0 w-[85%] h-screen bg-white dark:bg-gray-900 flex flex-col justify-center items-center gap-8 transition-transform duration-500 ease-in-out border-l border-gray-200 dark:border-white/10 shadow-[-10px_0_30px_rgba(0,0,0,0.1)] dark:shadow-[-10px_0_30px_rgba(0,0,0,0.5)] ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
                    
                    <button
                        onClick={() => { setIsMenuOpen(false); handleBrainAIClick(); }}
                        className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold mb-4 active:scale-95 transition-transform shadow-lg shadow-blue-500/30"
                    >
                        <i className="fas fa-brain text-white"></i>
                        Acessar Brain IA
                    </button>

                    <ul className="flex flex-col gap-6 items-center w-full">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.label}>
                                <a 
                                    href={item.href} 
                                    onClick={(e) => handleNavClick(item.href, e)}
                                    className="text-gray-800 dark:text-white font-medium text-xl tracking-wide hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;