
import React from 'react';
import { PROJECTS } from '../constants';

const ProjectsPage: React.FC = () => {
    return (
        <section className="min-h-screen pt-28 pb-20 px-4 bg-gray-50 dark:bg-[#131314] text-gray-900 dark:text-white relative transition-colors duration-500 font-sans">
            <div className="max-w-7xl mx-auto animate-fade-in-up">
                
                <div className="text-center mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-sm font-semibold tracking-wider mb-4">
                        PORTFÓLIO
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold font-montserrat text-gray-900 dark:text-white mb-6">
                        Projetos <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Desenvolvidos</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400 text-lg font-light">
                        Soluções reais aplicadas para transformar negócios e experiências digitais.
                    </p>
                </div>

                <div className="space-y-24">
                    {PROJECTS.map((project, index) => (
                        <div key={index} className="group relative bg-white dark:bg-[#1e1f20] border border-gray-200 dark:border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-500 shadow-xl dark:shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                <div>
                                    <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-gray-900 dark:text-white mb-2">
                                        {project.title}
                                    </h2>
                                    <div className="h-1 w-20 bg-blue-500 rounded"></div>
                                </div>
                                <div className="flex gap-3">
                                    <a href={project.link} target="_blank" rel="noreferrer" className="px-6 py-2 rounded-full border border-gray-300 dark:border-white/20 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black text-gray-700 dark:text-white transition-all text-sm font-medium">
                                        Visitar Site
                                    </a>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed border-l-4 border-blue-500/50 pl-6">
                                        {project.description}
                                    </p>
                                    <div className="bg-gray-50 dark:bg-black/40 rounded-xl p-6 border border-gray-200 dark:border-white/5 transition-colors">
                                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
                                            Stack Tecnológico
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {['React', 'TypeScript', 'Node.js', 'Automação'].map(tech => (
                                                <span key={tech} className="px-3 py-1 bg-white dark:bg-white/5 rounded-md text-xs text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="relative w-full min-h-[300px] bg-gray-100 dark:bg-black/60 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col items-center justify-center group-hover:shadow-[0_0_30px_rgba(0,102,255,0.1)] transition-shadow">
                                    <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>
                                    <div className="text-center p-8 relative z-10">
                                        <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/30 animate-pulse">
                                            <i className="fas fa-desktop text-2xl text-blue-500 dark:text-blue-400"></i>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Preview Interativo</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-xs max-w-xs mx-auto mb-4">
                                            Demonstração do projeto em tempo real.
                                        </p>
                                        <button className="px-5 py-2 bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/50 rounded-lg text-xs hover:bg-blue-600 hover:text-white transition-all uppercase font-bold tracking-wider">
                                            Carregar
                                        </button>
                                    </div>
                                    <img src={project.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectsPage;
