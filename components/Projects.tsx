import React from 'react';
import { PROJECTS } from '../constants';

const Projects: React.FC = () => {
    return (
        <section id="projetos" className="py-32 px-0 relative overflow-hidden bg-gray-100 dark:bg-black transition-colors duration-500">
             {/* Tech Background Grid/Elements */}
            <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-20 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-100 dark:from-black to-transparent z-10"></div>
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-100 dark:from-black to-transparent z-10"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10 text-center">
                <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-sm font-semibold tracking-wider mb-4">
                    PORTFÓLIO
                </span>
                <h2 className="text-4xl md:text-6xl font-extrabold font-montserrat text-gray-900 dark:text-white mb-6 tracking-tight">
                    Projetos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-600">Inovadores</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto font-light">
                    Explore uma seleção de trabalhos desenvolvidos com foco em performance, design e experiência do usuário.
                </p>
            </div>

            {/* Manual Scroll Container */}
            <div className="relative w-full group py-10">
                {/* Side Fade Effects */}
                <div className="absolute left-0 top-0 bottom-0 w-8 md:w-16 z-20 bg-gradient-to-r from-gray-100 dark:from-black to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-8 md:w-16 z-20 bg-gradient-to-l from-gray-100 dark:from-black to-transparent pointer-events-none"></div>

                {/* The Scrolling Track */}
                <div className="flex gap-6 md:gap-10 px-8 overflow-x-auto pb-12 snap-x snap-mandatory scroll-smooth w-full">
                    {PROJECTS.map((project, idx) => (
                        <div 
                            key={`${project.title}-${idx}`}
                            className="relative w-[280px] md:w-[400px] h-[400px] md:h-[500px] flex-shrink-0 snap-center group/card perspective-1000"
                        >
                            {/* Card Container with Glassmorphism and Hover Effects */}
                            <div className="w-full h-full bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden relative transition-all duration-500 ease-out transform group-hover/card:scale-[1.03] group-hover/card:-translate-y-2 hover:shadow-2xl dark:hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]">
                                
                                {/* Image Section */}
                                <div className="h-[65%] w-full overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10 opacity-60 transition-opacity duration-300 group-hover/card:opacity-40"></div>
                                    <img 
                                        src={project.image} 
                                        alt={project.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover/card:scale-110 group-hover/card:rotate-1"
                                    />
                                    
                                    {/* Tech Badge */}
                                    <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full shadow-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                                            <span className="text-[10px] text-white font-bold tracking-widest uppercase">Online</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="absolute bottom-0 left-0 w-full p-6 z-20 bg-gradient-to-b from-transparent via-gray-900/90 to-black">
                                    <div className="transform translate-y-6 group-hover/card:translate-y-0 transition-transform duration-500">
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 font-montserrat tracking-tight leading-tight line-clamp-1 group-hover/card:text-blue-400 transition-colors">
                                            {project.title}
                                        </h3>
                                        
                                        <div className="h-0 group-hover/card:h-auto overflow-hidden transition-all duration-500 opacity-0 group-hover/card:opacity-100 mb-2">
                                            <p className="text-gray-300 text-xs md:text-sm mb-4 line-clamp-3 leading-relaxed border-l-2 border-blue-500 pl-3">
                                                {project.description}
                                            </p>
                                        </div>
                                        
                                        <div className="flex items-center justify-between pt-2">
                                            <span className="text-xs text-gray-500 font-mono group-hover/card:hidden">HOVER TO REVEAL</span>
                                            <a 
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hidden group-hover/card:inline-flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 w-full justify-center"
                                            >
                                                Ver Projeto <i className="fas fa-external-link-alt text-xs"></i>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative Border Glow */}
                                <div className="absolute inset-0 border border-gray-200 dark:border-white/5 rounded-3xl group-hover/card:border-blue-500/40 transition-colors duration-300 pointer-events-none"></div>
                            </div>
                        </div>
                    ))}
                    {/* Espaçador final */}
                    <div className="w-4 flex-shrink-0"></div>
                </div>
            </div>
        </section>
    );
};

export default Projects;