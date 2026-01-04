import React, { useState, useEffect } from 'react';

interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    imageUrl: string;
    content: string; // Conteúdo HTML simulado
    author: string;
    authorRole: string;
}

const POSTS: BlogPost[] = [
    {
        id: 1,
        title: "A Revolução da IA no Atendimento ao Cliente",
        excerpt: "Como chatbots inteligentes e análise de sentimentos estão transformando a experiência do consumidor e reduzindo custos operacionais.",
        category: "Inteligência Artificial",
        date: "15 Out 2023",
        readTime: "5 min",
        imageUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2000&auto=format&fit=crop",
        author: "Vandilson Gomes",
        authorRole: "Especialista em CX",
        content: `
            <p>O atendimento ao cliente está passando por uma transformação sem precedentes. Não estamos mais falando apenas de respostas automáticas baseadas em palavras-chave simples, mas de uma verdadeira revolução cognitiva impulsionada pela Inteligência Artificial Generativa.</p>
            
            <h2>O Fim das Filas de Espera</h2>
            <p>Com a implementação de agentes virtuais baseados em LLMs (Large Language Models), empresas conseguem zerar o tempo de espera para demandas de baixa e média complexidade. A IA não dorme, não faz pausas e escala infinitamente conforme a demanda sazonal.</p>
            
            <h2>Análise de Sentimento em Tempo Real</h2>
            <p>Uma das ferramentas mais poderosas hoje é a capacidade de analisar o tom de voz e a escolha de palavras do cliente em tempo real. O sistema pode:</p>
            <ul>
                <li>Detectar frustração antes que o cliente verbalize uma reclamação.</li>
                <li>Sugerir ao atendente humano a melhor abordagem empática.</li>
                <li>Priorizar tickets críticos automaticamente.</li>
            </ul>

            <h2>O Toque Humano na Era da Máquina</h2>
            <p>Paradoxalmente, quanto mais IA usamos, mais valorizado se torna o toque humano. Ao automatizar o suporte técnico repetitivo (N1), liberamos os agentes humanos para atuarem como consultores estratégicos, resolvendo problemas complexos e construindo relacionamentos reais.</p>
            
            <blockquote>"A IA não vai substituir o atendimento humano, mas os humanos que usam IA vão substituir aqueles que não usam."</blockquote>
            
            <p>O futuro é híbrido, eficiente e, acima de tudo, personalizado.</p>
        `
    },
    {
        id: 2,
        title: "Dados como Ativo Estratégico",
        excerpt: "Por que empresas orientadas a dados (Data-Driven) crescem 30% a mais que seus concorrentes e como começar essa cultura.",
        category: "Data Analytics",
        date: "22 Set 2023",
        readTime: "7 min",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop",
        author: "Equipe VG",
        authorRole: "Data Science",
        content: `
            <p>Em um mundo digital, cada clique, cada visualização e cada transação gera um rastro digital. Ignorar esses dados é como navegar um navio no meio de uma tempestade sem bússola.</p>
            
            <h2>Cultura Data-Driven vs. Intuição</h2>
            <p>Muitos gestores ainda tomam decisões baseadas no "feeling". Embora a experiência conte, os dados não mentem. Empresas Data-Driven utilizam fatos concretos para validar hipóteses antes de investir milhões em novos produtos.</p>
            
            <h2>Os Pilares da Estratégia de Dados</h2>
            <p>Para transformar sua empresa, você precisa focar em três pilares:</p>
            <ol>
                <li><strong>Coleta:</strong> Garantir que os dados certos estão sendo capturados (CRM, Analytics, ERP).</li>
                <li><strong>Tratamento:</strong> Dados "sujos" levam a conclusões erradas. A higienização é fundamental.</li>
                <li><strong>Visualização:</strong> Dashboards complexos que ninguém entende são inúteis. A simplicidade é o grau máximo da sofisticação.</li>
            </ol>

            <h2>Predição é Poder</h2>
            <p>O estágio final da maturidade de dados é a análise preditiva. Imagine saber qual produto vai vender mais no próximo mês ou qual cliente está prestes a cancelar o contrato (Churn) antes que ele o faça. Isso não é magia, é estatística aplicada aos negócios.</p>
        `
    },
    {
        id: 3,
        title: "Automação de Processos com N8N",
        excerpt: "Um guia prático para integrar suas ferramentas favoritas e eliminar tarefas repetitivas do seu dia a dia.",
        category: "Automação",
        date: "10 Ago 2023",
        readTime: "10 min",
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop",
        author: "Vandilson Gomes",
        authorRole: "Tech Lead",
        content: `
            <p>Você já parou para contar quantas horas por semana sua equipe gasta copiando dados de uma planilha para um CRM? Ou enviando e-mails de confirmação manuais? A "fadiga de tarefas repetitivas" é o maior inimigo da criatividade.</p>
            
            <h2>Por que N8N?</h2>
            <p>O N8N (Nodemation) surgiu como uma alternativa poderosa ao Zapier e Make. Sua principal vantagem é a flexibilidade. Por ser baseado em nós (nodes), você pode criar lógicas de programação complexas visualmente.</p>
            
            <h2>Exemplo Prático: Onboarding de Clientes</h2>
            <p>Imagine o seguinte fluxo automatizado:</p>
            <ul>
                <li><strong>Gatilho:</strong> Novo pagamento aprovado no Stripe/Mercado Pago.</li>
                <li><strong>Ação 1:</strong> Criar usuário na plataforma automaticamente.</li>
                <li><strong>Ação 2:</strong> Gerar contrato em PDF com os dados do cliente.</li>
                <li><strong>Ação 3:</strong> Enviar e-mail de boas-vindas com acesso e contrato anexo.</li>
                <li><strong>Ação 4:</strong> Notificar o time de vendas no Slack/WhatsApp.</li>
            </ul>
            
            <p>Tudo isso acontece em segundos, sem intervenção humana, garantindo que o cliente tenha uma experiência "Uau" imediata.</p>
            
            <h2>Segurança e Escala</h2>
            <p>Diferente de ferramentas Low-Code fechadas, o N8N permite hospedagem própria (Self-hosted), garantindo que dados sensíveis dos seus clientes nunca saiam da sua infraestrutura. Para empresas que lidam com LGPD, isso é um diferencial crucial.</p>
        `
    },
    {
        id: 4,
        title: "O Futuro do E-commerce",
        excerpt: "Tendências de personalização e logística que vão ditar as regras do comércio eletrônico nos próximos anos.",
        category: "E-commerce",
        date: "05 Jul 2023",
        readTime: "6 min",
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2000&auto=format&fit=crop",
        author: "Equipe VG",
        authorRole: "E-commerce Specialist",
        content: `
            <p>O e-commerce não é mais apenas sobre ter um site bonito. É sobre logística, experiência e, principalmente, personalização extrema. A era da "loja para todos" acabou; entramos na era da "loja para cada um".</p>
            
            <h2>Headless Commerce</h2>
            <p>A separação entre o front-end (o que o cliente vê) e o back-end (onde as regras de negócio rodam) permite que marcas vendam em qualquer lugar: no Instagram, no WhatsApp, em relógios inteligentes ou até em geladeiras conectadas, tudo gerenciado por um único cérebro central.</p>
            
            <h2>Logística como Marketing</h2>
            <p>A entrega rápida deixou de ser um diferencial para ser o padrão. O "Same Day Delivery" (entrega no mesmo dia) aumenta a conversão em até 25%. A logística reversa (trocas e devoluções) fácil também se tornou um fator decisivo de compra.</p>
            
            <h2>Live Commerce</h2>
            <p>Importado da China, o modelo de vendas via transmissões ao vivo está explodindo no ocidente. É a união do entretenimento com o consumo imediato. Influenciadores demonstram produtos ao vivo e cupons de desconto aparecem na tela, criando um senso de urgência inigualável.</p>
            
            <p>Se sua loja virtual ainda opera no modelo de 2015, cuidado. A inovação no varejo digital é exponencial.</p>
        `
    }
];

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
                            Blog <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Tech</span>
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