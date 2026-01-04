import React, { useState } from 'react';
import { COURSES } from '../constants';
import { Video } from '../types';

// Componente do Carrossel de Vídeo Individual
const VideoCarousel: React.FC<{ videos: Video[] }> = ({ videos }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextVideo = () => {
        setCurrentIndex((prev) => (prev + 1) % videos.length);
    };

    const prevVideo = () => {
        setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
    };

    const currentVideo = videos[currentIndex];

    return (
        <div className="mt-6 bg-black/40 rounded-xl overflow-hidden border border-white/10 relative group/carousel">
            {/* Header do Player */}
            <div className="bg-black/60 px-4 py-2 flex justify-between items-center border-b border-white/5">
                <span className="text-xs font-mono text-blue-400">
                    AULA {currentIndex + 1}/{videos.length}
                </span>
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                </div>
            </div>

            {/* Área do Vídeo (Placeholder ou Iframe) */}
            <div className="relative aspect-video bg-gray-900 flex items-center justify-center group-hover/carousel:bg-gray-800 transition-colors">
                {currentVideo.url ? (
                    <iframe 
                        src={currentVideo.url} 
                        className="w-full h-full" 
                        title={currentVideo.title}
                        allowFullScreen
                    ></iframe>
                ) : (
                    // Placeholder visual quando não tem link ainda
                    <div className="text-center p-6 relative z-10">
                        <div className="w-12 h-12 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-3 border border-blue-500/50 group-hover/carousel:scale-110 transition-transform duration-300">
                            <i className="fas fa-play text-blue-400 ml-1"></i>
                        </div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Vídeo em breve</p>
                    </div>
                )}

                {/* Grid decorativo de fundo */}
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] pointer-events-none"></div>
            </div>

            {/* Título do Vídeo e Controles */}
            <div className="p-4 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 w-full">
                <p className="text-white font-medium text-sm mb-3 drop-shadow-md truncate">
                    {currentVideo.title}
                </p>
                
                <div className="flex justify-between items-center">
                    <button 
                        onClick={prevVideo}
                        className="p-2 rounded-full bg-white/10 hover:bg-blue-600 text-white transition-all backdrop-blur-md border border-white/10 hover:border-blue-400"
                        title="Aula anterior"
                    >
                        <i className="fas fa-chevron-left text-xs"></i>
                    </button>
                    
                    <div className="flex gap-1">
                        {videos.map((_, idx) => (
                            <div 
                                key={idx} 
                                className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-blue-500' : 'w-2 bg-gray-600'}`}
                            ></div>
                        ))}
                    </div>

                    <button 
                        onClick={nextVideo}
                        className="p-2 rounded-full bg-white/10 hover:bg-blue-600 text-white transition-all backdrop-blur-md border border-white/10 hover:border-blue-400"
                        title="Próxima aula"
                    >
                        <i className="fas fa-chevron-right text-xs"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

const CoursesPage: React.FC = () => {
    return (
        <section className="min-h-screen pt-28 pb-20 px-4 bg-gray-900 dark:bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-sm font-semibold tracking-wider mb-4">
                        ACADEMIA VG
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold font-montserrat text-white mb-6">
                        Sessões de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Vídeo</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-gray-400 text-lg font-light">
                        Acesse conteúdos exclusivos divididos em sessões estratégicas para alavancar seu desenvolvimento profissional e empresarial.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {COURSES.map((course, idx) => (
                        <div key={idx} className="flex flex-col h-full bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.07] hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10">
                            
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-1 font-montserrat">
                                        {course.title}
                                    </h3>
                                    <p className="text-blue-400 text-sm font-medium uppercase tracking-wide">
                                        {course.institution}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">{idx + 1}</span>
                                </div>
                            </div>
                            
                            <p className="text-gray-300 text-base leading-relaxed mb-6 flex-grow">
                                {course.description}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {course.tags.map((tag, tIdx) => (
                                    <span key={tIdx} className="text-xs text-gray-400 bg-black/40 px-3 py-1 rounded-full border border-white/5">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* Video Carousel Component */}
                            <VideoCarousel videos={course.videos} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CoursesPage;