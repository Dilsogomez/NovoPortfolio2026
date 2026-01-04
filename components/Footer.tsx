import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="py-10 px-4 bg-gray-100 dark:bg-black border-t border-gray-200 dark:border-white/5 text-center transition-colors duration-500">
            <div className="max-w-6xl mx-auto">
                <div className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 inline-block font-montserrat">VG</div>
                
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
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
                
                <p className="text-gray-500 dark:text-gray-600 text-sm">
                    © 2024 Vandilson Gomes. Todos os direitos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;