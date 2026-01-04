import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';

interface HeaderProps {
    onNavigate?: (page: 'home' | 'projects' | 'courses' | 'blog') => void;
    currentPage?: 'home' | 'projects' | 'courses' | 'blog';
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage = 'home' }) => {
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
        
        // Navegação para Projetos
        if (href === '#projetos') {
            e.preventDefault();
            if (onNavigate) onNavigate('projects');
            return;
        }

        // Navegação para Vídeos/Cursos
        if (href === '#cursos') {
            e.preventDefault();
            if (onNavigate) onNavigate('courses');
            return;
        }

        // Navegação para Blog
        if (href === '#blog') {
            e.preventDefault();
            if (onNavigate) onNavigate('blog');
            return;
        }

        // Se for outro link e estivermos em uma página interna, volta para home
        if ((currentPage !== 'home') && href.startsWith('#')) {
            e.preventDefault();
            if (onNavigate) {
                onNavigate('home');
                // Pequeno delay para permitir a renderização da Home antes do scroll
                setTimeout(() => {
                    const element = document.querySelector(href);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
            return;
        }
        
        // Comportamento padrão (scroll na mesma página)
    };

    const handleLogoClick = () => {
        if (onNavigate) onNavigate('home');
    };

    // Helper para determinar se o link está ativo
    const isActive = (href: string) => {
        if (href === '#projetos' && currentPage === 'projects') return true;
        if (href === '#cursos' && currentPage === 'courses') return true;
        if (href === '#blog' && currentPage === 'blog') return true;
        return false;
    };

    return (
        <header className={`fixed top-0 left-0 w-full px-8 py-4 z-50 transition-all duration-300 ${scrolled ? 'bg-dark/95 dark:bg-black/95 border-b border-white/10 dark:border-white/5 backdrop-blur-md py-3' : 'bg-transparent py-6'}`}>
            <nav className="max-w-6xl mx-auto flex justify-between items-center relative">
                {/* Logo - Left */}
                <div 
                    onClick={handleLogoClick}
                    className="text-2xl font-extrabold text-white dark:text-white transition-transform duration-300 hover:scale-105 z-50 mix-blend-difference cursor-pointer"
                >
                    VG
                </div>

                {/* Desktop Navigation - Absolute Center */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <ul className="flex gap-8 items-center">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.label}>
                                <a 
                                    href={item.href}
                                    onClick={(e) => handleNavClick(item.href, e)}
                                    className={`text-white/90 font-medium text-lg relative group py-2 mix-blend-difference ${
                                        isActive(item.href) ? 'text-blue-400' : ''
                                    }`}
                                >
                                    {item.label}
                                    <span className={`absolute bottom-0 left-0 h-0.5 bg-white transition-all duration-300 ${
                                        isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                                    }`}></span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Side Actions (Mobile Menu) */}
                <div className="flex items-center gap-4 z-50">
                    {/* Mobile Hamburger Button */}
                    <button 
                        className="flex flex-col justify-between w-8 h-5 cursor-pointer md:hidden mix-blend-difference"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span className={`h-0.5 w-full bg-white rounded transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`h-0.5 w-full bg-white rounded transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`h-0.5 w-full bg-white rounded transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`fixed top-0 right-0 w-[75%] h-screen bg-gray-900/80 backdrop-blur-2xl backdrop-saturate-150 flex flex-col justify-center items-center gap-8 transition-transform duration-500 ease-in-out border-l border-white/10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
                    <ul className="flex flex-col gap-6 items-center w-full">
                        {NAV_ITEMS.map((item) => (
                            <li key={item.label}>
                                <a 
                                    href={item.href} 
                                    onClick={(e) => handleNavClick(item.href, e)}
                                    className="text-white font-medium text-xl tracking-wide hover:text-blue-400 transition-colors drop-shadow-md"
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