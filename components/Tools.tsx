import React from 'react';
import { TOOLS } from '../constants';

const Tools: React.FC = () => {
    return (
        <section id="ferramentas" className="py-20 px-4 bg-gray-850 dark:bg-gray-100 border-y border-white/10 dark:border-black/5">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 font-montserrat relative text-white dark:text-black after:content-[''] after:block after:w-20 after:h-1 after:bg-white dark:after:bg-black after:mx-auto after:mt-2 after:rounded">
                    Serviços
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
                    {TOOLS.map((tool, idx) => (
                        <div key={idx} className="bg-white/5 border border-white/10 dark:bg-white dark:border-gray-200 rounded-2xl p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-accent-dark/50">
                            <div className="w-16 h-16 rounded-full border-2 border-white/10 dark:border-gray-200 flex items-center justify-center text-2xl text-white dark:text-black mb-6 mx-auto md:mx-0">
                                <i className={tool.iconClass}></i>
                            </div>
                            <h3 className="text-2xl font-bold text-white dark:text-black mb-4">{tool.title}</h3>
                            <p className="text-accent-dark dark:text-accent-light mb-6">{tool.description}</p>
                            
                            <ul className="mb-6 space-y-2">
                                {tool.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-center gap-2 text-accent-dark dark:text-accent-light text-sm">
                                        <i className="fas fa-check text-blue-500"></i> {feature}
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-wrap gap-2">
                                {tool.badges.map((badge, bIdx) => (
                                    <span key={bIdx} className="px-3 py-1 rounded-full text-xs border border-white/20 dark:border-gray-300 bg-white/5 dark:bg-gray-100 text-white dark:text-gray-700">
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Tools;