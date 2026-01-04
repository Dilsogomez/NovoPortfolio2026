import { Project, Tool, Metric, NavItem, SocialLink, ResultItem } from './types';

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

export const METRICS: Metric[] = [];