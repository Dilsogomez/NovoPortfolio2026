import { Project, Tool, Metric, NavItem, SocialLink, ResultItem, Course, BlogPost } from './types';

export const NAV_ITEMS: NavItem[] = [
    { label: 'Ferramentas', href: '#ferramentas' },
    { label: 'Projetos', href: '#projetos' },
    { label: 'Vídeos', href: '#cursos' },
    { label: 'Blog', href: '#blog' },
    { label: 'Resultados', href: '#resultados' },
    { label: 'Contato', href: '#contato' },
];

export const SOCIAL_LINKS: SocialLink[] = [
    { href: 'https://www.linkedin.com/in/vandilson-gomes-492975219/', iconClass: 'fab fa-linkedin-in', label: 'LinkedIn' },
    { href: 'https://www.instagram.com/dilsogomez/', iconClass: 'fab fa-instagram', label: 'Instagram' },
    { href: 'https://api.whatsapp.com/send/?phone=5511994502134', iconClass: 'fab fa-whatsapp', label: 'WhatsApp' },
    { href: 'https://open.spotify.com/playlist/6fTwu0W7zpxSLmWg5sgFdU?si=_5ROjvA7RAy-P2afzYovtA', iconClass: 'fab fa-spotify', label: 'Spotify' },
];

export const PROJECTS: Project[] = [
    {
        title: "BOLHA | Sistema de informação",
        description: "Tenha uma visão estratégica do seu negócio. Monitore sua operação em tempo real através de dados, com dashboards intuitivos, relatórios completos e análises preditivas impulsionadas por Inteligência Artificial.",
        image: "https://github.com/Dilsogomez/Dilsogomez.github.io/blob/main/bolhacrm.png?raw=true",
        link: "https://wa.me/5511994502134"
    },
    {
        title: "SpaceArte",
        description: "Tudo que você precisa para ser um Artista de sucesso está aqui no SpaceArte, baixe o app e divirta-se.",
        image: "https://github.com/Dilsogomez/Dilsogomez.github.io/blob/main/arte.png?raw=true",
        link: "https://wa.me/5511994502134"
    },
    {
        title: "SEES | Space ",
        description: "Descubra as soluções digitais da SEES que combinam eficiencia, design moderno, segurança robusta e inteligência artificial para impulsionar sua produtividade.",
        image: "https://github.com/Dilsogomez/Dilsogomez.github.io/blob/main/SEES%20GROUP%20FOTO.png?raw=true",
        link: "https://anjossilva.lojavirtualnuvem.com.br/"
    },
    {
        title: "SEES | Black ",
        description: "Solução completa para gerenciamento financeiro pessoal e empresarial. Aplicativos de alta eficiência para rotina corporativa.",
        image: "https://github.com/Dilsogomez/Dilsogomez.github.io/blob/main/Captura%20de%20tela%202025-08-16%20110347.png?raw=true",
        link: "#"
    }
];

export const TOOLS: Tool[] = [
    {
        title: "Análise de Dados",
        description: "Ferramentas para análise e visualização de dados em tempo real com dashboards interativos.",
        iconClass: "fas fa-chart-line",
        features: ["Dashboards em tempo real", "Análises preditivas", "Relatórios automáticos", "Visualizações interativas"],
        badges: ["Power BI", "Excel", "Sheets"]
    },
    {
        title: "Automação de Processos",
        description: "Sistemas para automatizar tarefas repetitivas, chatbots inteligentes e IA segmentada.",
        iconClass: "fas fa-cogs",
        features: ["Chatbots", "IA Segmentada", "Automação de workflows", "Integração de sistemas", "Gestão de tarefas"],
        badges: ["IA", "N8N", "API"]
    },
    {
        title: "E-commerce Solutions",
        description: "Plataformas completas para gestão de lojas virtuais e marketplaces.",
        iconClass: "fas fa-shopping-cart",
        features: ["Gestão de inventário", "Processamento de pagamentos", "Logística integrada", "CRM para clientes"],
        badges: ["Shopify", "WooCommerce", "Nuvemshop"]
    },
    {
        title: "Marca Solutions",
        description: "Produção de videos e imagens em alta resolução, banners, copys, sites, web apps.",
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
        description: "Empresas que implementam automação de processos repetitivos observam um ganho significativo na eficiência das equipes.",
        iconClass: "fas fa-tachometer-alt" 
    },
    { 
        value: 30, 
        suffix: "%", 
        title: "Redução de Custos", 
        description: "O controle centralizado de informações e a eliminação de erros manuais reduzem drasticamente os custos operacionais.",
        iconClass: "fas fa-coins" 
    },
    { 
        value: 5, 
        suffix: "x", 
        title: "Tomada de Decisão", 
        description: "Organizações orientadas a dados (Data-Driven) tomam decisões estratégicas até 5 vezes mais rápidas que a concorrência.",
        iconClass: "fas fa-bolt" 
    },
    { 
        value: 95, 
        suffix: "%", 
        title: "Precisão da Informação", 
        description: "A integração de sistemas elimina a redundância e garante a integridade dos dados para relatórios gerenciais.",
        iconClass: "fas fa-check-double" 
    },
];

export const COURSES: Course[] = [
    {
        title: "Inteligência de Dados",
        institution: "Análise & Estratégia",
        description: "Aprenda a transformar dados brutos em decisões inteligentes para o seu negócio.",
        tags: ["Dados", "Analytics", "Estratégia"],
        completed: true,
        videos: [
            { title: "1. Como analisar informações?", url: "" },
            { title: "2. Como usar informações coletadas?", url: "" },
            { title: "3. Chegando a um resultado a partir de uma informação.", url: "" }
        ]
    },
    {
        title: "Presença Digital",
        institution: "Web & E-commerce",
        description: "O caminho completo para estabelecer sua marca e vender produtos na internet.",
        tags: ["Web Design", "E-commerce", "Vendas"],
        completed: true,
        videos: [
            { title: "1. Como construir um site.", url: "" },
            { title: "2. Como construir uma loja online.", url: "" },
            { title: "3. Como vender na internet.", url: "" }
        ]
    },
    {
        title: "Escala & Marketing",
        institution: "Automação & Tráfego",
        description: "Escale sua operação automatizando processos e atingindo o público certo.",
        tags: ["Automação", "Ads", "CRM"],
        completed: true,
        videos: [
            { title: "1. Como automatizar processos.", url: "" },
            { title: "2. Como veicular seus anúncios.", url: "" },
            { title: "3. Estude seu cliente.", url: "" }
        ]
    },
    {
        title: "Gestão & Ética",
        institution: "Finanças & Carreira",
        description: "Fundamentos sólidos para crescimento financeiro sustentável e ético.",
        tags: ["Finanças", "Investimento", "Mindset"],
        completed: true,
        videos: [
            { title: "1. Investimento básico", url: "" },
            { title: "2. Aplique para os anos seguintes.", url: "" },
            { title: "3. Desvie da imoralidade.", url: "" }
        ]
    }
];

export const POSTS: BlogPost[] = [
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

export const METRICS: Metric[] = [];