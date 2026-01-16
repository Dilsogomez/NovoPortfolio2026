
import { Project, Tool, Metric, NavItem, SocialLink, ResultItem, Course, BlogPost, LabImage, LabStudy, LabVideo } from './types';

// --- SECURITY CONFIGURATION ---
// ATENÇÃO: Configure restrições de HTTP Referrer no Google Cloud Console para proteger esta chave.
// Permita apenas o domínio do seu site (ex: seusite.com e localhost).
export const GEMINI_API_KEY = 'AIzaSyDf-6k3m1ORpoHaCS3s2qmQ81w8RQ9sSOM';

export const NAV_ITEMS: NavItem[] = [
    { label: 'Serviços', href: '#ferramentas' },
    { label: 'Projetos', href: '#projetos' },
    { label: 'Vídeos', href: '#cursos' },
    { label: 'Blog', href: '#blog' },
    { label: 'Resultados', href: '#resultados' },
    { label: 'Contato', href: '#contato' },
];

export const SOCIAL_LINKS: SocialLink[] = [
    { href: 'https://www.linkedin.com/in/vandilson-gomes-492975219/', iconClass: 'fab fa-linkedin-in', label: 'LinkedIn' },
    { href: 'https://github.com/Dilsogomez', iconClass: 'fab fa-github', label: 'GitHub' },
    { href: 'https://api.whatsapp.com/send/?phone=5511994502134', iconClass: 'fab fa-whatsapp', label: 'WhatsApp' },
    { href: 'https://open.spotify.com/playlist/6fTwu0W7zpxSLmWg5sgFdU?si=_5ROjvA7RAy-P2afzYovtA', iconClass: 'fab fa-spotify', label: 'Spotify' },
];

export const PROJECTS: Project[] = [
    {
        title: "SICOM | Ecossistema Digital",
        description: "Plataforma de agência criativa com Next.js e Genkit (Google AI). Inclui SI Studio (IA Conversacional), ferramentas de desenho para 3D e geração de estratégias de marketing em tempo real.",
        image: "https://i.pinimg.com/736x/05/f4/72/05f472825f1261ca135921a705baf0b4.jpg",
        link: "https://wa.me/5511994502134",
        status: 'Online'
    },
    {
        title: "Escalter | Visão Computacional",
        description: "SaaS de análise de imagens via IA com 4 módulos: NutriScan, AutoDano, DocResumo e ItemFinder. Inclui Dashboard, Admin Financeiro e animações Three.js.",
        image: "https://i.pinimg.com/736x/ea/2d/b1/ea2db127c0c1b57c3304bbd9d75f0e10.jpg",
        link: "https://wa.me/5511994502134",
        status: 'Online'
    },
    {
        title: "Obra+ | SaaS Construção",
        description: "Plataforma multitenant completa para gestão civil. Dashboards financeiros, controle de equipes, orçamentos e IA (Genkit). Stack moderna com Next.js 15, ShadCN e Firebase.",
        image: "https://i.pinimg.com/736x/b3/d7/27/b3d7271776ea07cddac692c18494c049.jpg",
        link: "https://wa.me/5511994502134",
        status: 'Online'
    },
    {
        title: "OC+ | Oficina & Controle",
        description: "Plataforma Phygital que utiliza IA (Gemini) para revolucionar a reparação automotiva. Scanner de danos, análise jurídica e gestão de leads para oficinas.",
        image: "https://i.pinimg.com/736x/3d/58/03/3d5803f378a7b1d57a91f040376bcd2c.jpg",
        link: "https://wa.me/5511994502134",
        status: 'Online'
    },
    {
        title: "Marta | Artificial Intelligence",
        description: "Uma Mente. Múltiplas Funções. Sistema de IA avançado que se adapta para tornar processos técnicos e comerciais mais claros e fáceis. Processamento de voz e dados em tempo real.",
        image: "https://i.pinimg.com/736x/01/92/fc/0192fcddb8134c5fa7e5ff4df077a72b.jpg",
        link: "https://wa.me/5511994502134",
        status: 'Online'
    },
    {
        title: "BOLHA | Sistema de informação",
        description: "Tenha uma visão estratégica do seu negócio. Monitore sua operação em tempo real através de dados, com dashboards intuitivos que deixam a gestão mais clara.",
        image: "https://github.com/Dilsogomez/Dilsogomez.github.io/blob/main/bolhacrm.png?raw=true",
        link: "https://wa.me/5511994502134",
        status: 'Online'
    },
    {
        title: "SpaceArte",
        description: "Tudo que você precisa para ser um Artista de sucesso está aqui no SpaceArte, baixe o app e divirta-se.",
        image: "https://github.com/Dilsogomez/Dilsogomez.github.io/blob/main/arte.png?raw=true",
        link: "https://wa.me/5511994502134",
        status: 'Offline'
    },
    {
        title: "SEES | Space ",
        description: "Descubra as soluções digitais da SEES que combinam eficiência e design moderno para facilitar sua produtividade.",
        image: "https://github.com/Dilsogomez/Dilsogomez.github.io/blob/main/SEES%20GROUP%20FOTO.png?raw=true",
        link: "https://anjossilva.lojavirtualnuvem.com.br/",
        status: 'Online'
    },
    {
        title: "SEES | Black ",
        description: "Solução completa para gerenciamento financeiro pessoal e empresarial. Aplicativos eficientes para facilitar a rotina corporativa.",
        image: "https://github.com/Dilsogomez/Dilsogomez.github.io/blob/main/Captura%20de%20tela%202025-08-16%20110347.png?raw=true",
        link: "#",
        status: 'Offline'
    }
];

export const TOOLS: Tool[] = [
    {
        title: "Análise de Dados",
        description: "Ferramentas para visualização de dados que tornam a interpretação de informações mais fácil.",
        iconClass: "fas fa-chart-line",
        features: ["Dashboards claros", "Análises intuitivas", "Relatórios simplificados", "Visualizações interativas"],
        badges: ["Power BI", "Excel", "Sheets"]
    },
    {
        title: "Otimização de Processos",
        description: "Sistemas para tornar tarefas repetitivas mais fáceis e fluxos de trabalho mais claros.",
        iconClass: "fas fa-cogs",
        features: ["Chatbots auxiliares", "IA Facilitadora", "Workflows organizados", "Integração de sistemas", "Gestão de tarefas"],
        badges: ["IA", "N8N", "API"]
    },
    {
        title: "E-commerce Solutions",
        description: "Plataformas completas para gestão de lojas virtuais de forma clara e eficiente.",
        iconClass: "fas fa-shopping-cart",
        features: ["Gestão de inventário", "Processamento facilitado", "Logística integrada", "CRM organizado"],
        badges: ["Sites", "Landpages", "Checkout"]
    },
    {
        title: "Marca Solutions",
        description: "Produção de videos e imagens para deixar sua comunicação mais clara e atraente.",
        iconClass: "fas fa-photo-video",
        features: ["Produção Audiovisual", "Design Gráfico & Banners", "Copywriting", "Sites & Web Apps"],
        badges: ["Desenvolvimento web", "Api de integração", "Google Ferramentas"]
    }
];

export const RESULTS: ResultItem[] = [
    { 
        value: 40, 
        suffix: "%", 
        title: "Aumento de Produtividade", 
        description: "Empresas que simplificam processos observam um ganho significativo na eficiência das equipes.",
        iconClass: "fas fa-tachometer-alt" 
    },
    { 
        value: 30, 
        suffix: "%", 
        title: "Otimização de Investimento", 
        description: "O controle centralizado de informações e a clareza operacional otimizam significativamente os investimentos.",
        iconClass: "fas fa-coins" 
    },
    { 
        value: 5, 
        suffix: "x", 
        title: "Tomada de Decisão", 
        description: "Organizações orientadas a dados tomam decisões estratégicas mais rápidas e com mais clareza.",
        iconClass: "fas fa-bolt" 
    },
    { 
        value: 95, 
        suffix: "%", 
        title: "Precisão da Informação", 
        description: "A integração de sistemas facilita o acesso e garante a integridade das informações.",
        iconClass: "fas fa-check-double" 
    },
];

export const COURSES: Course[] = [
    {
        title: "Inteligência de Dados",
        institution: "Análise & Estratégia",
        description: "Aprenda a transformar dados brutos em decisões claras e fáceis.",
        tags: ["Dados", "Analytics", "Estratégia"],
        completed: true,
        videos: [
            { title: "1. Como analisar informações?", url: "" },
            { title: "2. Como usar informações coletadas?", url: "" },
            { title: "3. Chegando a um resultado.", url: "" }
        ]
    },
    {
        title: "Presença Digital",
        institution: "Web & E-commerce",
        description: "O caminho completo para estabelecer sua marca de forma clara na internet.",
        tags: ["Web Design", "E-commerce", "Vendas"],
        completed: true,
        videos: [
            { title: "1. Como construir um site.", url: "" },
            { title: "2. Como construir uma loja.", url: "" },
            { title: "3. Como vender na internet.", url: "" }
        ]
    },
    {
        title: "Escala & Marketing",
        institution: "Otimização & Tráfego",
        description: "Escale sua operação tornando processos mais fáceis e atingindo o público certo.",
        tags: ["Processos", "Ads", "CRM"],
        completed: true,
        videos: [
            { title: "1. Como organizar processos.", url: "" },
            { title: "2. Como veicular anúncios.", url: "" },
            { title: "3. Estude seu cliente.", url: "" }
        ]
    },
    {
        title: "Gestão & Ética",
        institution: "Finanças & Carreira",
        description: "Fundamentos sólidos para crescimento financeiro claro e ético.",
        tags: ["Finanças", "Investimento", "Mindset"],
        completed: true,
        videos: [
            { title: "1. Investimento básico", url: "" },
            { title: "2. Aplique para os anos seguintes.", url: "" },
            { title: "3. Mantenha a integridade.", url: "" }
        ]
    }
];

// --- LAB CONTENT GENERATED BY AI ---

export const POSTS: BlogPost[] = [
    {
        id: 1,
        title: "A Evolução da IA no Atendimento",
        excerpt: "Uma análise sobre como Large Language Models (LLMs) estão ajudando a deixar a experiência do consumidor (CX) mais clara e fácil.",
        category: "Tecnologia",
        date: "Atualizado",
        readTime: "12 min",
        imageUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2000&auto=format&fit=crop",
        author: "Vandilson Gomes",
        authorRole: "CX & Inovação",
        content: `
            <p>O atendimento ao cliente está passando por uma evolução. Durante décadas, estivemos focados no desafio de equilibrar rapidez e qualidade. Com a Inteligência Artificial Generativa, estamos vendo novas formas de facilitar essas interações. Não estamos falando de substituir o humano, mas de oferecer ferramentas que tornam tudo mais claro.</p>
            
            <h2>A Nova Era da Clareza</h2>
            <p>Com agentes virtuais avançados, empresas conseguem oferecer suporte instantâneo que ajuda a esclarecer dúvidas complexas. Diferente de sistemas antigos, os novos modelos entendem contexto e intenção, facilitando a vida do cliente.</p>
            <p>Imagine um cenário onde a IA facilita:</p>
            <ul>
                <li><strong>Entendimento em Tempo Real:</strong> O sistema compreende a necessidade do cliente e fornece informações precisas de forma simples.</li>
                <li><strong>Personalização:</strong> A IA acessa o histórico para tornar a conversa mais relevante e fácil, sem perguntas repetitivas.</li>
            </ul>

            <h2>Facilitadores vs. Ferramentas Tradicionais</h2>
            <p>A grande mudança está na capacidade de facilitar processos. Se o objetivo é "resolver um problema", o agente ajuda a encontrar a solução de forma mais direta.</p>
            
            <blockquote>"A IA vem para potencializar. O futuro é sobre tornar processos complexos em experiências simples e claras."</blockquote>

            <h2>O Impacto na Experiência</h2>
            <p>Implementar IA é sobre tornar a jornada do cliente mais fácil. Clientes que têm suas solicitações esclarecidas rapidamente tendem a ficar mais satisfeitos.</p>
        `
    },
    {
        id: 2,
        title: "Dados como Ativo: Clareza Estratégica",
        excerpt: "Como transformar informações brutas em inteligência fácil de entender. O guia para empresas que buscam clareza.",
        category: "Análise de Dados",
        date: "Atualizado",
        readTime: "10 min",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop",
        author: "Vandilson Gomes",
        authorRole: "Analista de Dados",
        content: `
            <p>Vivemos em uma era de abundância de dados. As organizações que sabem organizar essas informações ganham clareza para navegar no mercado.</p>

            <h2>Da Complexidade à Clareza</h2>
            <p>Tradicionalmente, dados eram difíceis de interpretar. A cultura de dados facilita a decisão. Quando um dashboard mostra claramente as métricas, a estratégia fica óbvia.</p>
            
            <h2>O Ciclo da Informação</h2>
            <p>Para que o dado ajude, ele precisa ser fácil de acessar:</p>
            <ul>
                <li><strong>Organização:</strong> Conectar fontes diversas para criar sinergia.</li>
                <li><strong>Simplificação:</strong> Remover o que não importa e padronizar. Um dado claro leva a conclusões precisas.</li>
                <li><strong>Visualização:</strong> Apresentar isso de forma que qualquer um entenda a história por trás dos números.</li>
            </ul>
        `
    },
    {
        id: 3,
        title: "Engenharia de Agentes: A Nova Automação",
        excerpt: "A evolução dos fluxos de trabalho: de scripts lineares para agentes de IA autônomos que raciocinam, decidem e executam tarefas complexas.",
        category: "Engenharia de IA",
        date: "Novo",
        readTime: "8 min",
        imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop",
        author: "Vandilson Gomes",
        authorRole: "AI Engineer",
        content: `
            <p>A automação tradicional baseada em regras (RPA) atingiu um teto. O futuro pertence à Engenharia de Agentes (Agentic Workflows).</p>

            <h2>Do Script ao Raciocínio</h2>
            <p>Enquanto a automação clássica segue um "se isso, então aquilo", os Agentes de IA possuem capacidade de raciocínio. Eles não apenas seguem instruções; eles avaliam o contexto, decidem a melhor ferramenta a usar e corrigem seus próprios erros em tempo real.</p>

            <h2>Orquestração Multi-Agente</h2>
            <p>Imagine uma equipe digital onde um agente analisa dados, outro redige o relatório e um terceiro envia o email. Frameworks modernos como Google Genkit permitem criar esses ecossistemas colaborativos.</p>
            
            <blockquote>"Não estamos mais programando passos. Estamos programando objetivos e dando aos agentes as ferramentas para alcançá-los."</blockquote>

            <h2>Aplicação Prática</h2>
            <p>Isso transforma operações complexas, como triagem jurídica ou análise financeira, em processos fluidos e autônomos, liberando o potencial humano para a estratégia criativa.</p>
        `
    },
    {
        id: 4,
        title: "E-commerce: A Era da Facilidade",
        excerpt: "Como tornar a experiência de compra mais clara e fácil para oferecer a melhor jornada ao usuário.",
        category: "Tendências",
        date: "Atualizado",
        readTime: "9 min",
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2000&auto=format&fit=crop",
        author: "Vandilson Gomes",
        authorRole: "Estratégia Comercial",
        content: `
            <p>O e-commerce está evoluindo para ser mais fácil. Entramos na era da conveniência e clareza.</p>

            <h2>A Era da Facilidade</h2>
            <p>Não estamos falando apenas de tecnologia, mas de deixar a vida do usuário mais fácil. Se um usuário entra no site, a navegação deve ser intuitiva e clara.</p>

            <h2>Fluidez Total</h2>
            <p>O foco é remover barreiras. Simplificar formulários torna a compra mais agradável. O futuro é sobre processos que fluem sem atrito.</p>
        `
    }
];

export const METRICS: Metric[] = [];

// --- CONSTANTES DO LABORATÓRIO (NOVAS) ---

export const LAB_IMAGES: LabImage[] = [
    {
        id: 1,
        title: "Arquitetura Neural",
        url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop",
        tool: "Gerado via Imagen",
        prompt: "Futuristic data center architecture, neon lights, isometric view"
    },
    {
        id: 2,
        title: "Cidade Cyberpunk",
        url: "https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=1000&auto=format&fit=crop",
        tool: "Gerado via Imagen",
        prompt: "Cyberpunk city street at night, rain, neon signs, highly detailed"
    },
    {
        id: 3,
        title: "Fluxo Abstrato",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
        tool: "Gerado via Imagen",
        prompt: "Abstract liquid metal flow, gold and black, 8k resolution"
    },
    {
        id: 4,
        title: "Conceito de Cérebro IA",
        url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
        tool: "Gerado via Imagen",
        prompt: "Artificial intelligence brain concept, glowing nodes, network connections"
    }
];

export const LAB_STUDIES: LabStudy[] = [
    {
        id: 1,
        title: "Integração Facilitada",
        description: "Estudo sobre como conectar múltiplos sistemas para criar ecossistemas mais organizados.",
        status: "Em Andamento",
        date: "Processando...",
        tags: ["API", "Backend", "Facilitação"]
    },
    {
        id: 2,
        title: "Geração de Vídeo Assistida",
        description: "Experimento utilizando modelos de vídeo para ajudar na criação de narrativas visuais.",
        status: "Em Andamento",
        date: "Processando...",
        tags: ["Video AI", "Veo", "Criatividade"]
    },
    {
        id: 3,
        title: "Otimização de Fluxo",
        description: "Análise completa sobre como deixar processos operacionais mais fluídos.",
        status: "Concluído",
        date: "Finalizado",
        tags: ["Análise", "Clareza", "Dados"]
    }
];

export const LAB_VIDEOS: LabVideo[] = [
    {
        id: 1,
        title: "Visão Computacional na Prática",
        description: "IA identificando peças automotivas e danos em tempo real para o projeto OC+.",
        thumbnailUrl: "https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1000&auto=format&fit=crop",
        videoUrl: "",
        duration: "02:14"
    },
    {
        id: 2,
        title: "Dashboard em Tempo Real",
        description: "Visualização de dados complexos do sistema BOLHA transformados em insights claros.",
        thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
        videoUrl: "",
        duration: "01:45"
    },
    {
        id: 3,
        title: "Automação de Atendimento",
        description: "Fluxo automatizado no N8N gerenciando leads simultâneos com personalização via LLM.",
        thumbnailUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop",
        videoUrl: "",
        duration: "03:20"
    }
];
