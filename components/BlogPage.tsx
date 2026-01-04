import React, { useState, useEffect } from 'react';
import { POSTS } from '../constants';
import { BlogPost } from '../types';

const BlogPage: React.FC = () => {
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    useEffect(() => {
        // Scroll to top whenever layout changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [selectedPost]);

    return (
        <section className="min-h-screen pt-28 pb-20 px-4 bg-gray-900 dark:bg-black relative overflow-hidden">
             {/* Background Elements */}
             <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* Header Section - Only visible on list view */}
                {!selectedPost && (
                    <div className="text-center mb-16 animate-fade-in-up">
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-semibold tracking-wider mb-4">
                            INSIGHTS & ARTIGOS
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold font-montserrat text-white mb-6">
                            Blog <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">VG</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-gray-400 text-lg font-light">
                            Explorando as fronteiras da tecnologia, gestão de dados e inovação digital.
                        </p>
                    </div>
                )}

                {/* View Switcher */}
                {selectedPost ? (
                    // --- Single Post View ---
                    <article className="max-w-4xl mx-auto animate-fade-in-up">
                        <button 
                            onClick={() => setSelectedPost(null)}
                            className="group mb-8 flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
                        >
                            <i className="fas fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                            Voltar para o Blog
                        </button>

                        <div className="relative h-[400px] w-full rounded-3xl overflow-hidden mb-10 shadow-2xl shadow-blue-900/20">
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10"></div>
                            <img 
                                src={selectedPost.imageUrl} 
                                alt={selectedPost.title} 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 p-8 z-20 w-full">
                                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wider mb-4 inline-block">
                                    {selectedPost.category}
                                </span>
                                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight font-montserrat">
                                    {selectedPost.title}
                                </h1>
                                <div className="flex items-center gap-6 text-sm text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center border border-white/20">
                                            <i className="fas fa-user text-xs"></i>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white leading-none">{selectedPost.author}</p>
                                            <p className="text-xs text-gray-400 leading-none mt-1">{selectedPost.authorRole}</p>
                                        </div>
                                    </div>
                                    <span className="flex items-center gap-2"><i className="far fa-calendar"></i> {selectedPost.date}</span>
                                    <span className="flex items-center gap-2"><i className="far fa-clock"></i> {selectedPost.readTime} de leitura</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
                            {/* Render simulated HTML content */}
                            <div 
                                className="prose prose-lg prose-invert max-w-none 
                                [&>p]:mb-6 [&>p]:text-gray-300 [&>p]:leading-relaxed
                                [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:font-montserrat
                                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul]:text-gray-300 [&>ul>li]:mb-2
                                [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6 [&>ol]:text-gray-300 [&>ol>li]:mb-2
                                [&>blockquote]:border-l-4 [&>blockquote]:border-blue-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-400 [&>blockquote]:my-8 [&>blockquote]:bg-white/5 [&>blockquote]:p-4 [&>blockquote]:rounded-r-lg"
                                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                            />

                            {/* Post Footer */}
                            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                                <div className="text-center md:text-left">
                                    <p className="text-gray-400 text-sm mb-2">Gostou deste artigo?</p>
                                    <div className="flex gap-4">
                                        <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-blue-600 hover:text-white text-gray-400 transition-all flex items-center justify-center border border-white/10">
                                            <i className="fab fa-linkedin-in"></i>
                                        </button>
                                        <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-green-500 hover:text-white text-gray-400 transition-all flex items-center justify-center border border-white/10">
                                            <i className="fab fa-whatsapp"></i>
                                        </button>
                                        <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-sky-500 hover:text-white text-gray-400 transition-all flex items-center justify-center border border-white/10">
                                            <i className="fab fa-twitter"></i>
                                        </button>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedPost(null)}
                                    className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-blue-400 hover:text-white transition-all shadow-lg hover:shadow-blue-500/50"
                                >
                                    Ler outros artigos
                                </button>
                            </div>
                        </div>
                    </article>
                ) : (
                    // --- Grid View ---
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {POSTS.map((post) => (
                            <article key={post.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 flex flex-col h-full cursor-pointer" onClick={() => setSelectedPost(post)}>
                                
                                {/* Image Container */}
                                <div className="h-48 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors z-10"></div>
                                    <img 
                                        src={post.imageUrl} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 z-20">
                                        <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 text-xs font-bold text-white rounded-full uppercase tracking-wider">
                                            {post.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 font-mono">
                                        <span><i className="far fa-calendar mr-1"></i> {post.date}</span>
                                        <span><i className="far fa-clock mr-1"></i> {post.readTime}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    
                                    <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                                        {post.excerpt}
                                    </p>

                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedPost(post);
                                        }}
                                        className="text-blue-400 text-sm font-semibold uppercase tracking-wider flex items-center gap-2 group-hover:gap-3 transition-all mt-auto"
                                    >
                                        Ler Artigo <i className="fas fa-arrow-right"></i>
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default BlogPage;