import React, { useState } from 'react';
import { PROJECTS, POSTS, LAB_IMAGES, LAB_STUDIES, LAB_VIDEOS } from '../constants';

type LabTab = 'projetos' | 'artigos' | 'videos' | 'imagens' | 'estudos' | 'solicitar';

const ProjectsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<LabTab>('projetos');
    
    // State para o formulário de solicitação
    const [selectedService, setSelectedService] = useState<string>('');
    const [description, setDescription] = useState('');

    const handleWhatsAppRedirect = () => {
        if (!selectedService) return;
        
        const message = encodeURIComponent(
            `Olá! Gostaria de solicitar um serviço no Laboratório VG.\n\n*Tipo:* ${selectedService}\n*Detalhes:* ${description}`
        );
        window.open(`https://wa.me/5511994502134?text=${message}`, '_blank');
    };

    const serviceOptions = [
        { id: 'dev', label: 'Desenvolvimento Web/App', icon: 'fas fa-code', desc: 'Sites, Landing Pages, Sistemas Web.' },
        { id: 'ai', label: 'Automação & IA', icon: 'fas fa-robot', desc: 'Chatbots, Integração de APIs, Workflows.' },
        { id: 'design', label: 'Design & Criativo', icon: 'fas fa-paint-brush', desc: 'Identidade Visual, Vídeos, UI/UX.' },
        { id: 'data', label: 'Consultoria de Dados', icon: 'fas fa-chart-pie', desc: 'Dashboards, Análise, BI.' },
    ];

    return (
        <section className="min-h-screen pt-28 pb-20 px-4 bg-gray-50 dark:bg-black text-gray-900 dark:text-white relative transition-colors duration-500">
            
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-12 text-center relative z-10">
                <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-sm font-semibold tracking-wider mb-4">
                    LABORATÓRIO VG
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold font-montserrat mb-6 text-gray-900 dark:text-white">
                    Espaço de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">Criação</span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto font-light">
                    Onde a tecnologia transforma idéias em realidade.
                </p>
            </div>

            {/* Navigation Tabs */}
            <div className="max-w-5xl mx-auto mb-16 relative z-20">
                <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-3xl backdrop-blur-md shadow-sm dark:shadow-none transition-colors">
                    {[
                        { id: 'projetos', label: 'Projetos', icon: 'fas fa-code' },
                        { id: 'artigos', label: 'Artigos', icon: 'fas fa-newspaper' },
                        { id: 'videos', label: 'Vídeos', icon: 'fas fa-play' },
                        { id: 'imagens', label: 'Imagens', icon: 'fas fa-image' },
                        { id: 'estudos', label: 'Estudos', icon: 'fas fa-microscope' },
                        { id: 'solicitar', label: 'Contratar', icon: 'fas fa-hand-sparkles' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as LabTab)}
                            className={`px-4 md:px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                                activeTab === tab.id 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                            }`}
                        >
                            <i className={tab.icon}></i>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-6xl mx-auto min-h-[500px] animate-fade-in-up">
                
                {/* --- PROJETOS --- */}
                {activeTab === 'projetos' && (
                    <div className="space-y-24">
                        {PROJECTS.map((project, index) => (
                            <div key={index} className="group relative bg-white dark:bg-gray-800/20 border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-500 shadow-sm dark:shadow-none">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                    <div>
                                        <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-gray-900 dark:text-white mb-2">
                                            {project.title}
                                        </h2>
                                        <div className="h-1 w-20 bg-blue-600 rounded"></div>
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
                                        <div className="bg-gray-100 dark:bg-black/40 rounded-xl p-6 border border-gray-200 dark:border-white/5 transition-colors">
                                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
                                                Stack Tecnológico
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {['React', 'TypeScript', 'Node.js', 'Automação'].map(tech => (
                                                    <span key={tech} className="px-3 py-1 bg-white dark:bg-white/5 rounded-md text-xs text-blue-600 dark:text-blue-300 border border-blue-500/20">
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
                                            <button className="px-5 py-2 bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/50 rounded-lg text-xs hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all uppercase font-bold tracking-wider">
                                                Carregar
                                            </button>
                                        </div>
                                        <img src={project.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay dark:mix-blend-overlay" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- ARTIGOS --- */}
                {activeTab === 'artigos' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {POSTS.map((post) => (
                            <article key={post.id} className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 hover:bg-gray-50 dark:hover:bg-white/[0.07] transition-all group flex flex-col shadow-sm dark:shadow-none">
                                <div className="h-48 overflow-hidden relative">
                                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full border border-white/10 text-xs font-bold uppercase text-white">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <span className="text-blue-600 dark:text-blue-400 text-xs font-mono mb-2">{post.date}</span>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{post.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">{post.excerpt}</p>
                                    <button className="text-gray-900 dark:text-white text-sm font-semibold border-b border-blue-500 pb-1 self-start hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        Ler Artigo Completo
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* --- VÍDEOS --- */}
                {activeTab === 'videos' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {LAB_VIDEOS.map((video) => (
                            <div key={video.id} className="group bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-colors">
                                <div className="relative aspect-video bg-gray-200 dark:bg-gray-900 overflow-hidden">
                                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover opacity-90 dark:opacity-60 group-hover:opacity-100 dark:group-hover:opacity-40 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <button className="w-14 h-14 rounded-full bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/40 dark:border-white/20 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300 shadow-lg">
                                            <i className="fas fa-play ml-1"></i>
                                        </button>
                                    </div>
                                    <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs font-mono text-white">
                                        {video.duration}
                                    </span>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{video.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{video.description}</p>
                                </div>
                            </div>
                        ))}
                         {/* Placeholder para preencher visualmente se tiver poucos videos */}
                         <div className="border border-dashed border-gray-300 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 text-center text-gray-500 bg-gray-50 dark:bg-white/5 min-h-[200px]">
                            <i className="fas fa-video-slash text-2xl mb-2"></i>
                            <p className="text-sm">Mais experimentos em vídeo sendo processados...</p>
                        </div>
                    </div>
                )}

                {/* --- IMAGENS --- */}
                {activeTab === 'imagens' && (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {LAB_IMAGES.map((img) => (
                            <div key={img.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-gray-900">
                                <img src={img.url} alt={img.title} className="w-full h-auto transform transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <h3 className="text-white font-bold">{img.title}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs bg-white/20 px-2 py-1 rounded backdrop-blur text-white">{img.tool}</span>
                                    </div>
                                    {img.prompt && (
                                        <p className="text-gray-300 text-xs mt-3 italic line-clamp-2 border-l-2 border-blue-500 pl-2">
                                            "{img.prompt}"
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- ESTUDOS --- */}
                {activeTab === 'estudos' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {LAB_STUDIES.map((study) => (
                            <div key={study.id} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/40 dark:to-black border border-gray-200 dark:border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all hover:-translate-y-1 shadow-sm dark:shadow-none">
                                <div className="flex justify-between items-start mb-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                        study.status === 'Concluído' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' : 
                                        study.status === 'Em Andamento' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' : 
                                        'bg-gray-500/10 text-gray-500 dark:text-gray-400 border-gray-500/20'
                                    }`}>
                                        {study.status}
                                    </span>
                                    <span className="text-gray-500 text-xs font-mono">{study.date}</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{study.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8">{study.description}</p>
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {study.tags.map((tag, i) => (
                                        <span key={i} className="text-xs text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/20 px-2 py-1 rounded border border-purple-200 dark:border-purple-500/10">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- SOLICITAR SERVIÇO (CONTRATAR) --- */}
                {activeTab === 'solicitar' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/50 dark:to-black/80 border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl relative overflow-hidden shadow-xl dark:shadow-none">
                            
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                            <div className="text-center mb-10 relative z-10">
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Inicie seu <span className="text-blue-600 dark:text-blue-500">Próprio Projeto</span></h2>
                                <p className="text-gray-600 dark:text-gray-400">Selecione o tipo de serviço que você precisa e envie uma solicitação direta para o laboratório.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                {serviceOptions.map((service) => (
                                    <button
                                        key={service.id}
                                        onClick={() => setSelectedService(service.label)}
                                        className={`p-6 rounded-2xl border text-left transition-all duration-300 group ${
                                            selectedService === service.label
                                                ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/20'
                                                : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/30'
                                        }`}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xl ${
                                            selectedService === service.label ? 'bg-white text-blue-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                                        }`}>
                                            <i className={service.icon}></i>
                                        </div>
                                        <h3 className={`font-bold mb-1 ${selectedService === service.label ? 'text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                                            {service.label}
                                        </h3>
                                        <p className={`text-xs ${selectedService === service.label ? 'text-blue-100' : 'text-gray-500'}`}>
                                            {service.desc}
                                        </p>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Detalhes da Solicitação</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Descreva brevemente o que você precisa..."
                                        className="w-full h-32 bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    onClick={handleWhatsAppRedirect}
                                    disabled={!selectedService}
                                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                                        selectedService
                                            ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-green-500/30 cursor-pointer'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    <i className="fab fa-whatsapp text-2xl"></i>
                                    Enviar Solicitação
                                </button>
                                
                                {!selectedService && (
                                    <p className="text-center text-xs text-gray-500 mt-2">
                                        * Selecione um serviço acima para habilitar o envio.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
};

export default ProjectsPage;