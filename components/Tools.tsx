import React, { useState } from 'react';
import { TOOLS } from '../constants';

const Tools: React.FC = () => {
    // Duplicamos a lista 4 vezes para garantir um loop perfeito sem buracos visuais
    const allTools = [...TOOLS, ...TOOLS, ...TOOLS, ...TOOLS];
    const [isPaused, setIsPaused] = useState(false);

    return (
        <section id="ferramentas" className="py-20 px-0 bg-white dark:bg-gray-900 transition-colors duration-500 border-y border-gray-200 dark:border-white/5 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold text-center font-montserrat relative text-gray-900 dark:text-white after:content-[''] after:block after:w-20 after:h-1 after:bg-gray-900 dark:after:bg-white after:mx-auto after:mt-2 after:rounded transition-colors">
                    Serviços
                </h2>
            </div>

            {/* Carousel Container */}
            <div 
                className="relative w-full overflow-hidden group py-4"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Gradient Fades nas laterais para suavizar a entrada/saída */}
                <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 z-20 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none transition-colors duration-500"></div>
                <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 z-20 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none transition-colors duration-500"></div>

                {/* Track de Rolagem */}
                <div 
                    className="flex gap-8 w-max px-8"
                    style={{
                        animation: `scrollLeftTools 50s linear infinite`,
                        animationPlayState: isPaused ? 'paused' : 'running',
                        transform: 'translate3d(0, 0, 0)', // Force GPU acceleration
                    }}
                >
                    {allTools.map((tool, idx) => (
                        <div 
                            key={`${tool.title}-${idx}`} 
                            className="w-[320px] md:w-[380px] flex-shrink-0 bg-gray-50 border border-gray-200 dark:bg-white/5 dark:border-white/10 rounded-2xl p-8 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-gray-300 dark:hover:border-blue-500/30"
                        >
                            <div className="w-16 h-16 rounded-full border-2 border-gray-300 dark:border-white/20 flex items-center justify-center text-2xl text-gray-900 dark:text-white mb-6">
                                <i className={tool.iconClass}></i>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{tool.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">{tool.description}</p>
                            
                            <ul className="mb-6 space-y-2 border-t border-gray-200 dark:border-white/5 pt-4">
                                {tool.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 text-sm">
                                        <i className="fas fa-check text-blue-600 dark:text-blue-400 text-xs"></i> {feature}
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-wrap gap-2 mt-auto">
                                {tool.badges.map((badge, bIdx) => (
                                    <span key={bIdx} className="px-3 py-1 rounded-full text-xs border border-gray-300 dark:border-white/10 bg-white dark:bg-white/10 text-gray-700 dark:text-gray-300 font-medium">
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes scrollLeftTools {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-25%); } /* Move 25% (um conjunto completo de ferramentas) para criar o loop */
                }
            `}</style>
        </section>
    );
};

export default Tools;