import React from 'react';

const Contact: React.FC = () => {
    return (
        <section id="contato" className="py-20 px-4 bg-gray-850 dark:bg-gray-50 border-t border-white/10 dark:border-black/5">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 font-montserrat relative text-white dark:text-black after:content-[''] after:block after:w-20 after:h-1 after:bg-white dark:after:bg-black after:mx-auto after:mt-2 after:rounded">
                    Contato
                </h2>

                <div className="grid md:grid-cols-2 gap-12">
                    <div className="flex flex-col gap-6">
                         {[
                            { icon: "fas fa-envelope", label: "Email", value: "vandilsogomez.silva@gmail.com", href: "mailto:vandilsogomez.silva@gmail.com" },
                            { icon: "fas fa-phone", label: "Telefone / WhatsApp", value: "+55 11 99450-2134", href: "tel:+5511994502134" },
                            { icon: "fas fa-map-marker-alt", label: "Localização", value: "São Paulo, Brasil", href: null },
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-6 bg-white/5 border border-white/10 dark:bg-white dark:border-gray-200 rounded-xl hover:-translate-y-1 hover:shadow-lg hover:border-accent-dark transition-all duration-300">
                                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl text-white dark:text-black flex-shrink-0">
                                    <i className={item.icon}></i>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white dark:text-black mb-1">{item.label}</h3>
                                    {item.href ? (
                                        <a href={item.href} className="text-accent-dark dark:text-accent-light hover:text-white dark:hover:text-black transition-colors">
                                            {item.value}
                                        </a>
                                    ) : (
                                        <p className="text-accent-dark dark:text-accent-light">{item.value}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex items-start gap-4 p-6 bg-white/5 border border-white/10 dark:bg-white dark:border-gray-200 rounded-xl hover:-translate-y-1 hover:shadow-lg hover:border-accent-dark transition-all duration-300">
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl text-white dark:text-black flex-shrink-0">
                                <i className="fas fa-calendar-check"></i>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white dark:text-black mb-2">Agendar Reunião</h3>
                                <a href="https://wa.me/5511994502134?text=Olá! Gostaria de agendar uma reunião" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full border border-white dark:border-black text-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all duration-300">
                                    <i className="fas fa-calendar-alt"></i> Agendar por WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;