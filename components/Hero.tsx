import React from 'react';
import { SOCIAL_LINKS } from '../constants';
import ParticleNetworkBackground from './ParticleNetworkBackground';

const Hero: React.FC = () => {
    return (
        <section id="inicio" className="min-h-screen flex flex-col items-center justify-center text-center relative px-4 pt-20 overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-transparent dark:via-gray-900/50 dark:to-gray-900 transition-colors duration-500">
            
            {/* Background de Partículas Interconectadas (Efeito Neural/IA) */}
            <ParticleNetworkBackground />

            <div className="max-w-3xl z-10 animate-fade-in-up relative pointer-events-none">
                
                <h1 className="text-4xl md:text-7xl font-extrabold font-montserrat mb-6 text-gray-900 dark:text-white leading-tight drop-shadow-sm dark:drop-shadow-2xl transition-colors">
                    VANDILSON GOMES
                </h1>
                
                <h2 className="text-xl md:text-3xl text-gray-700 dark:text-gray-300 mb-8 font-light tracking-wide transition-colors">
                    Customer Experience <span className="text-blue-600 dark:text-blue-500 mx-2">|</span> Web Development
                </h2>
                
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed transition-colors">
                    Transforme idéias em realidade.
                </p>
                
                <div className="flex gap-6 justify-center flex-wrap pointer-events-auto">
                    {SOCIAL_LINKS.map((link) => (
                        <a 
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-14 h-14 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-2xl text-gray-700 dark:text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] dark:hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] group relative overflow-hidden shadow-sm dark:shadow-none"
                        >
                            <span className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <i className={`${link.iconClass} transition-transform duration-300 group-hover:scale-110 relative z-10`}></i>
                        </a>
                    ))}
                </div>
            </div>

            <a href="#ferramentas" className="absolute bottom-10 flex flex-col items-center text-gray-400 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 z-10 cursor-pointer pointer-events-auto">
                <span className="text-[10px] uppercase tracking-[0.2em] mb-2 font-mono">Role para baixo</span>
                <i className="fas fa-chevron-down text-xl animate-bounce"></i>
            </a>
        </section>
    );
};

export default Hero;