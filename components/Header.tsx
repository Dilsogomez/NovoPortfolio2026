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
        
        // Navegação para páginas dedicadas
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

        // Navegação para seções da Home (ex: #resultados, #ferramentas, #contato)
        if (href.startsWith('#')) {
            e.preventDefault();
            
            const scrollToSection = () => {
                const element = document.querySelector(href);
                if (element) {
                    const headerOffset = 90; // Ajuste para compensar o header fixo
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;
            
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            };

            if (currentPage !== 'home') {
                // Se não estiver na home, navega para home primeiro
                if (onNavigate) {
                    onNavigate('home');
                    // Timeout aumentado para garantir que a Home montou antes de buscar o elemento
                    setTimeout(scrollToSection, 300);
                }
            } else {
                // Se já estiver na home, apenas rola
                scrollToSection();
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

    const handleLabClick = () => {
        if (onNavigate) onNavigate('projects');
    };

    const isActive = (href: string) => {
        if (href === '#projetos' && currentPage === 'projects') return true;
        if (href === '#cursos' && currentPage === 'courses') return true;
        if (href === '#blog' && currentPage === 'blog') return true;
        return false;
    };

    return (
        <header className={`fixed top-0 left-0 w-full px-4 md:px-8 z-50 transition-all duration-300 ${
            scrolled 
                ? 'bg-white/90 dark:bg-black/95 border-b border-gray-200 dark:border-white/5 backdrop-blur-md py-3 shadow-sm dark:shadow-none' 
                : 'bg-transparent py-5'
        }`}>
            <nav className="max-w-7xl mx-auto flex justify-between items-center">
                
                {/* Left Side - Logo */}
                <div className="flex-shrink-0 flex items-center z-50 mr-2 md:mr-4">
                    <div 
                        onClick={handleLogoClick}
                        className="text-2xl font-extrabold text-gray-900 dark:text-white transition-transform duration-300 hover:scale-105 cursor-pointer"
                    >
                        VG
                    </div>
                </div>

                {/* Center - Desktop Navigation */}
                {/* Mudado de absolute para flex normal, hidden em telas menores que lg para evitar quebra */}
                <div className="hidden lg:flex items-center justify-center flex-1 px-4">
                    <ul className="flex gap-6 xl:gap-8 items-center">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.label}>
                                <a 
                                    href={item.href}
                                    onClick={(e) => handleNavClick(item.href, e)}
                                    className={`font-medium text-sm xl:text-base relative group py-2 transition-colors whitespace-nowrap ${
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
                <div className="flex items-center gap-2 md:gap-3 z-50 flex-shrink-0">
                    
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

                    {/* Laboratório Button - Visível em mobile (ícone), texto em xl */}
                    <button
                        onClick={handleLabClick}
                        className={`flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-full border transition-all duration-300 group ${
                            currentPage === 'projects' 
                                ? 'bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400' 
                                : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-white hover:shadow-md dark:hover:bg-white/10 dark:hover:text-white'
                        }`}
                        title="Laboratório"
                    >
                        <i className={`fas fa-flask text-sm ${currentPage === 'projects' ? 'animate-pulse' : 'group-hover:text-blue-500 dark:group-hover:text-blue-400'}`}></i>
                        <span className="hidden xl:inline text-sm font-medium tracking-wide">Laboratório</span>
                    </button>

                    {/* Brain IA Button - Visível em mobile (ícone), texto em xl */}
                    <button
                        onClick={handleBrainAIClick}
                        className={`flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-full border transition-all duration-300 group ${
                            currentPage === 'brain-ai' 
                                ? 'bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-400' 
                                : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-white hover:shadow-md dark:hover:bg-white/10 dark:hover:text-white'
                        }`}
                        title="Brain IA"
                    >
                        <i className={`fas fa-brain text-sm ${currentPage === 'brain-ai' ? 'animate-pulse' : 'group-hover:text-blue-500 dark:group-hover:text-blue-400'}`}></i>
                        <span className="hidden xl:inline text-sm font-medium tracking-wide">Brain IA</span>
                    </button>

                    {/* Mobile Hamburger Button - Visível até lg */}
                    <button 
                        className="flex flex-col justify-between w-8 h-5 cursor-pointer lg:hidden ml-1"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span className={`h-0.5 w-full bg-gray-800 dark:bg-white rounded transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`h-0.5 w-full bg-gray-800 dark:bg-white rounded transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`h-0.5 w-full bg-gray-800 dark:bg-white rounded transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`fixed top-0 right-0 w-[85%] h-screen bg-white dark:bg-gray-900 flex flex-col justify-start pt-24 items-center gap-6 transition-transform duration-500 ease-in-out border-l border-gray-200 dark:border-white/10 shadow-[-10px_0_30px_rgba(0,0,0,0.1)] dark:shadow-[-10px_0_30px_rgba(0,0,0,0.5)] ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden z-[60]`}>
                    
                    {/* Botão de Fechar (X) */}
                    <button 
                        onClick={() => setIsMenuOpen(false)}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-white transition-all duration-300"
                        aria-label="Fechar menu"
                    >
                        <i className="fas fa-times text-2xl"></i>
                    </button>

                    <div className="flex flex-col w-full px-8 gap-4 mb-2">
                        {/* Botões duplicados no menu para facilidade, caso o usuário prefira o menu grande */}
                        <button
                            onClick={() => { setIsMenuOpen(false); handleLabClick(); }}
                            className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold active:scale-95 transition-transform"
                        >
                            <i className="fas fa-flask text-blue-500"></i>
                            Acessar Laboratório
                        </button>
                        
                        <button
                            onClick={() => { setIsMenuOpen(false); handleBrainAIClick(); }}
                            className="flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold active:scale-95 transition-transform shadow-lg shadow-blue-500/30"
                        >
                            <i className="fas fa-brain text-white"></i>
                            Acessar Brain IA
                        </button>
                    </div>

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