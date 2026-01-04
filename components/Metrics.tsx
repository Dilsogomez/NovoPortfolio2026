import React, { useEffect, useRef, useState } from 'react';
import { RESULTS } from '../constants';
import { ResultItem } from '../types';

const MetricCard: React.FC<{ item: ResultItem }> = ({ item }) => {
    const [count, setCount] = useState(0);
    const cardRef = useRef<HTMLDivElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimated.current) {
                hasAnimated.current = true;
                let start = 0;
                const end = item.value;
                const duration = 2000;
                const startTime = performance.now();

                const animate = (currentTime: number) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out quart
                    const ease = 1 - Math.pow(1 - progress, 4);
                    
                    setCount(Math.floor(start + (end - start) * ease));

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };
                requestAnimationFrame(animate);
            }
        }, { threshold: 0.5 });

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [item.value]);

    return (
        <div ref={cardRef} className="bg-white border border-gray-200 dark:bg-gray-800/50 dark:border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-300 flex flex-col h-full shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-6">
                <div className="text-3xl text-blue-600 dark:text-blue-400">
                    <i className={item.iconClass}></i>
                </div>
                <div className="text-4xl font-extrabold text-gray-900 dark:text-white font-montserrat">
                    {count}{item.suffix}
                </div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {item.title}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {item.description}
            </p>
        </div>
    );
};

const Metrics: React.FC = () => {
    return (
        <section id="resultados" className="py-20 px-4 bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-white/5 transition-colors duration-500">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold font-montserrat relative text-gray-900 dark:text-white inline-block mb-6 transition-colors">
                        Resultados
                        <span className="block h-1 w-20 bg-blue-600 dark:bg-blue-500 mx-auto mt-2 rounded"></span>
                    </h2>
                    <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-400 text-lg transition-colors">
                        O impacto da gestão eficiente da informação. Estudos de mercado comprovam que o controle de dados e a automação de processos são os principais motores de crescimento para empresas modernas.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {RESULTS.map((item, idx) => (
                        <MetricCard key={idx} item={item} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Metrics;