import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="py-10 px-4 bg-gray-850 dark:bg-gray-100 border-t border-white/10 dark:border-black/5 text-center">
            <div className="max-w-6xl mx-auto">
                <div className="text-3xl font-extrabold text-white dark:text-black mb-6 inline-block font-montserrat">VG</div>
                
                <div className="flex flex-wrap justify-center gap-8 mb-8">
                    {[
                        { label: 'Início', href: '#inicio' },
                        { label: 'Ferramentas', href: '#ferramentas' },
                        { label: 'Projetos', href: '#projetos' },
                        { label: 'Vídeos', href: '#cursos' },
                        { label: 'Blog', href: '#blog' },
                        { label: 'Contato', href: '#contato' },
                    ].map((link) => (
                        <a 
                            key={link.label}
                            href={link.href}
                            className="text-accent-dark dark:text-accent-light hover:text-white dark:hover:text-black transition-colors duration-300 font-medium"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
                
                <p className="text-accent-dark/60 dark:text-accent-light/80 text-sm">
                    © 2024 Vandilson Gomes. Todos os direitos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;