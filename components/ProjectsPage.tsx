import React from 'react';
import { PROJECTS } from '../constants';

const ProjectsPage: React.FC = () => {
    return (
        <section className="min-h-screen pt-28 pb-20 px-4 bg-gray-900 dark:bg-black text-white relative">
            
            <div className="max-w-7xl mx-auto mb-16 text-center relative z-10">
                <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-semibold tracking-wider mb-4">
                    LABORATÓRIO
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold font-montserrat mb-6">
                    Projetos & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Ferramentas</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
                    Uma coleção detalhada de soluções e ferramentas interativas. 
                    Nesta área, você encontrará demonstrações ao vivo de automações e IAs.
                </p>
            </div>

            <div className="max-w-6xl mx-auto space-y-24">
                {PROJECTS.map((project, index) => (
                    <div key={index} className="group relative bg-gray-800/20 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-500">
                        {/* Project Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-white mb-2">
                                    {project.title}
                                </h2>
                                <div className="h-1 w-20 bg-blue-600 rounded"></div>
                            </div>
                            <div className="flex gap-3">
                                <a href={project.link} target="_blank" rel="noreferrer" className="px-6 py-2 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all text-sm font-medium">
                                    Visitar Site
                                </a>
                            </div>
                        </div>

                        {/* Layout Grid: Descrição Esquerda / Demo Direita */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            
                            {/* Coluna Esquerda: Informações */}
                            <div className="space-y-6">
                                <p className="text-gray-300 text-lg leading-relaxed border-l-4 border-blue-500/50 pl-6">
                                    {project.description}
                                </p>
                                
                                <div className="bg-black/40 rounded-xl p-6 border border-white/5">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                                        Stack Tecnológico
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {/* Badges estáticas por enquanto, podem vir do constants no futuro */}
                                        {['React', 'TypeScript', 'Node.js', 'Automação'].map(tech => (
                                            <span key={tech} className="px-3 py-1 bg-white/5 rounded-md text-xs text-blue-300 border border-blue-500/20">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Coluna Direita: Área de Demonstração (Placeholder para a ferramenta) */}
                            <div className="relative w-full min-h-[400px] bg-black/60 rounded-2xl border border-white/10 overflow-hidden flex flex-col items-center justify-center group-hover:shadow-[0_0_30px_rgba(0,102,255,0.1)] transition-shadow">
                                
                                {/* Placeholder Visual */}
                                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>
                                
                                <div className="text-center p-8 relative z-10">
                                    <div className="w-20 h-20 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center mb-4 border border-blue-500/30 animate-pulse">
                                        <i className="fas fa-tools text-3xl text-blue-400"></i>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Área de Demonstração</h3>
                                    <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                        A ferramenta interativa para "{project.title}" será carregada aqui em breve.
                                    </p>
                                    <button className="mt-6 px-6 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/50 rounded-lg text-sm hover:bg-blue-600 hover:text-white transition-all">
                                        Ativar Demonstração
                                    </button>
                                </div>

                                {/* Imagem de fundo opcional (Preview estático) */}
                                <img 
                                    src={project.image} 
                                    alt="Preview" 
                                    className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay hover:opacity-20 transition-opacity duration-700" 
                                />
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProjectsPage;