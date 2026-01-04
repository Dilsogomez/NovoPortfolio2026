import React from 'react';

const About: React.FC = () => {
    return (
        <section id="sobre-mim" className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 font-montserrat relative text-white dark:text-black after:content-[''] after:block after:w-20 after:h-1 after:bg-white dark:after:bg-black after:mx-auto after:mt-2 after:rounded">
                    Sobre Mim
                </h2>
                
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="text-accent-dark dark:text-accent-light text-lg space-y-6">
                        <p>
                            Olá! Sou Vandilson, um profissional com experiência em relacionamento ao cliente e desenvolvimento web. Minha paixão é transformar ideias em realidade através do código e criar experiências digitais memoráveis.
                        </p>
                        <p>
                            Minha abordagem combina criatividade, atenção aos detalhes e foco no usuário para criar produtos que não apenas funcionam bem, mas também encantam.
                        </p>
                        <p>
                            Acredito que a melhor tecnologia é aquela que resolve problemas reais e cria conexões significativas entre pessoas e produtos.
                        </p>
                        <div className="pt-4">
                            <a href="#contato" className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-white dark:border-black text-white dark:text-black font-semibold hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <i className="fas fa-paper-plane"></i> Vamos conversar
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {[
                            { icon: "fas fa-handshake", title: "Experiência do Cliente", desc: "Especializado em criar relações duradouras e experiências memoráveis." },
                            { icon: "fas fa-code", title: "Desenvolvimento Web", desc: "Criação de soluções digitais modernas, responsivas e eficientes." },
                            { icon: "fas fa-chart-line", title: "Análise de Resultados", desc: "Foco em métricas e dados para otimizar estratégias." },
                            { icon: "fas fa-lightbulb", title: "Soluções Criativas", desc: "Abordagem inovadora para resolver problemas complexos." }
                        ].map((skill, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 dark:bg-black/5 dark:border-black/10 rounded-xl p-6 text-center backdrop-blur-sm hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                                <div className="text-3xl text-white dark:text-black mb-4">
                                    <i className={skill.icon}></i>
                                </div>
                                <h3 className="text-xl font-bold text-white dark:text-black mb-3">{skill.title}</h3>
                                <p className="text-accent-dark dark:text-accent-light text-sm leading-relaxed">{skill.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;