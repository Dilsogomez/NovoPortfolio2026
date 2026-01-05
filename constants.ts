
import { Project, Tool, Metric, NavItem, SocialLink, ResultItem, Course, BlogPost, LabImage, LabStudy, LabVideo } from './types';

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
        title: "Marta | Artificial Intelligence",
        description: "Uma Mente. Múltiplas Funções. Sistema de IA avançado que se adapta para atuar como Consultora Técnica, Estrategista de Vendas e Closer de Negócios. Processamento de voz e dados em tempo real.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop",
        link: "https://wa.me/5511994502134",
        status: 'Online'
    },
    {
        title: "BOLHA | Sistema de informação",
        description: "Tenha uma visão estratégica do seu negócio. Monitore sua operação em tempo real através de dados, com dashboards intuitivos, relatórios completos e análises preditivas impulsionadas por Inteligência Artificial.",
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
        description: "Descubra as soluções digitais da SEES que combinam eficiencia, design moderno, segurança robusta e inteligência artificial para impulsionar sua produtividade.",
        image: "https://github.com/Dilsogomez/Dilsogomez.github.io/blob/main/SEES%20GROUP%20FOTO.png?raw=true",
        link: "https://anjossilva.lojavirtualnuvem.com.br/",
        status: 'Online'
    },
    {
        title: "SEES | Black ",
        description: "Solução completa para gerenciamento financeiro pessoal e empresarial. Aplicativos de alta eficiência para rotina corporativa.",
        image: "https://github.com/Dilsogomez/Dilsogomez.github.io/blob/main/Captura%20de%20tela%202025-08-16%20110347.png?raw=true",
        link: "#",
        status: 'Offline'
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
        badges: ["Sites", "Landpages", "Checkout"]
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
        title: "Otimização de Investimento", 
        description: "O controle centralizado de informações e a precisão operacional otimizam significativamente os investimentos e custos.",
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
        description: "A integração de sistemas harmoniza os dados e garante a integridade das informações para relatórios gerenciais.",
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
            { title: "3. Mantenha a integridade.", url: "" }
        ]
    }
];

// --- LAB CONTENT GENERATED BY AI ---

export const POSTS: BlogPost[] = [
    {
        id: 1,
        title: "A Evolução da IA no Atendimento ao Cliente",
        excerpt: "Uma análise profunda sobre como Large Language Models (LLMs) e Agentes Autônomos estão redefinindo a experiência do consumidor (CX) e otimizando o suporte.",
        category: "Tecnologia",
        date: "Atualizado",
        readTime: "12 min",
        imageUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2000&auto=format&fit=crop",
        author: "Vandilson Gomes",
        authorRole: "CX & Inovação",
        content: `
            <p>O atendimento ao cliente está passando por uma transformação significativa. Durante décadas, estivemos focados no desafio de equilibrar o triângulo do suporte: rapidez, investimento e humanização. Com a ascensão da Inteligência Artificial Generativa, especificamente os Large Language Models (LLMs), estamos vendo a superação dessas fronteiras. Não estamos mais falando apenas de respostas automáticas baseadas em árvores de decisão, mas de uma verdadeira <strong>evolução cognitiva</strong>.</p>
            
            <h2>A Nova Era do "Zero Latency"</h2>
            <p>A métrica de "Tempo Médio de Espera" (TME) está sendo otimizada. Com a implementação de agentes virtuais avançados, empresas conseguem oferecer atendimento instantâneo e simultâneo para milhares de clientes. Diferente dos chatbots tradicionais que tinham limitações ao encontrar uma palavra-chave não programada, os novos modelos entendem <em>contexto, intenção e sentimento</em>.</p>
            <p>Imagine um cenário onde a IA não apenas responde, mas resolve:</p>
            <ul>
                <li><strong>Análise de Sentimento em Tempo Real:</strong> O sistema compreende a necessidade do cliente e ajusta o tom da resposta para ser mais empático ou escala imediatamente para um humano sênior.</li>
                <li><strong>Hiper-Personalização:</strong> A IA acessa o histórico do CRM instantaneamente, sabendo que o cliente comprou um tênis semana passada e provavelmente está ligando para saber da entrega, antecipando a resposta antes mesmo da pergunta.</li>
                <li><strong>Memória de Longo Prazo:</strong> O sistema lembra de interações passadas ocorridas meses atrás, criando uma continuidade na conversa que valoriza o relacionamento.</li>
            </ul>

            <h2>Agentes Autônomos vs. Chatbots Tradicionais</h2>
            <p>A grande mudança está na capacidade "agêntica" das novas IAs. Enquanto um chatbot tradicional segue um roteiro linear, um Agente de IA tem objetivos claros. Se o objetivo é "resolver o problema de pagamento", o agente pode consultar o gateway, verificar o saldo e sugerir soluções proativas, tudo de forma autônoma via APIs.</p>
            
            <blockquote>"A IA vem para potencializar o atendimento humano. O futuro é híbrido: a máquina cuida da eficiência, o humano cuida da empatia complexa."</blockquote>

            <h2>O Impacto na Eficiência e Retenção (LTV)</h2>
            <p>Implementar IA no atendimento é sobre otimizar investimentos operacionais e elevar a eficiência. O verdadeiro valor está no aumento do <strong>Lifetime Value (LTV)</strong>. Clientes que têm suas solicitações atendidas em segundos tendem a comprar novamente e a recomendar a marca.</p>
            <p>Estamos caminhando para um futuro onde o suporte ao cliente se tornará um centro de inteligência e vendas, onde cada interação é uma oportunidade de coletar dados estruturados sobre as necessidades do consumidor e oferecer soluções proativas. As empresas que abraçam essa transição garantem relevância e liderança no mercado.</p>
        `
    },
    {
        id: 2,
        title: "Dados como Ativo Estratégico: O Novo Valor",
        excerpt: "Como transformar terabytes de informações brutas em inteligência de negócios acionável. O guia definitivo para empresas Data-Driven.",
        category: "Análise de Dados",
        date: "Atualizado",
        readTime: "10 min",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop",
        author: "Vandilson Gomes",
        authorRole: "Analista de Dados",
        content: `
            <p>Vivemos em uma era de abundância de dados e oportunidades de insights. Em um mundo digital, cada clique, rolagem de tela e transação gera um valor digital. Utilizar esses dados é como navegar com precisão. As organizações que dominam a arte de capturar, processar e agir sobre seus dados — as chamadas empresas <em>Data-Driven</em> — crescem significativamente mais rápido ao antecipar tendências.</p>

            <h2>Da Intuição à Evidência: A Decisão Assertiva</h2>
            <p>Tradicionalmente, muitas decisões corporativas eram baseadas na intuição. A cultura de dados democratiza a decisão. Quando um dashboard aponta que o produto A tem uma margem de lucro 20% superior ao produto B em uma região específica, a estratégia ganha precisão frente ao fato.</p>
            
            <h2>O Ciclo de Vida do Dado: ETL e Governança</h2>
            <p>Para que o dado se torne um ativo, ele precisa passar por um refinamento rigoroso. É necessário transformar o "Data Lake" em um oceano de dados acessíveis. O processo envolve:</p>
            <ul>
                <li><strong>Extração (Extract):</strong> Conectar fontes diversas — CRM, ERP, Google Analytics, Redes Sociais — para criar sinergia.</li>
                <li><strong>Transformação (Transform):</strong> Organizar o dado. Remover duplicatas, padronizar formatações e unificar padrões. Um dado tratado ("Quality In") leva inevitavelmente a conclusões precisas ("Quality Out").</li>
                <li><strong>Carga e Visualização (Load & Viz):</strong> Apresentar isso em ferramentas como Power BI ou Tableau. O segredo aqui não é mostrar <em>tudo</em>, mas mostrar o que <em>importa</em>. A visualização deve contar uma história e apresentar soluções.</li>
            </ul>

            <h2>Os 4 Níveis de Análise de Dados</h2>
            <p>As empresas evoluem através de quatro estágios de maturidade analítica:</p>
            <ol>
                <li><strong>Descritiva:</strong> O que aconteceu? (Relatórios históricos).</li>
                <li><strong>Diagnóstica:</strong> Por que aconteceu? (Análise de causa raiz).</li>
                <li><strong>Preditiva:</strong> O que vai acontecer? (Projeções baseadas em tendências).</li>
                <li><strong>Prescritiva:</strong> Como podemos fazer acontecer? (Ação recomendada automaticamente).</li>
            </ol>
            <p>Ao cruzar dados de sazonalidade, comportamento de navegação e indicadores econômicos, algoritmos podem prever tendências de comportamento do cliente antes mesmo da decisão de compra. Isso permite que a empresa aja preventivamente. O dado deixa de ser um retrovisor para se tornar um farol, iluminando o caminho à frente.</p>
        `
    },
    {
        id: 3,
        title: "Automação de Processos com N8N e Low-Code",
        excerpt: "A democratização da engenharia de dados. Como ferramentas visuais estão permitindo criar fluxos de trabalho complexos e escaláveis de forma ágil.",
        category: "Automação",
        date: "Atualizado",
        readTime: "11 min",
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop",
        author: "Vandilson Gomes",
        authorRole: "DevOps & Automação",
        content: `
            <p>A gestão inteligente de tarefas repetitivas é o maior aliado da criatividade e da produtividade estratégica. Transferir dados de uma planilha para um CRM, enviar e-mails transacionais ou monitorar redes sociais são tarefas que sistemas realizam com excelência e velocidade. A evolução do <strong>Low-Code</strong> e ferramentas como o N8N veio para libertar o potencial humano para atividades cognitivas de alto nível.</p>

            <h2>Por que N8N? A Vantagem do Fluxo Visual</h2>
            <p>Diferente de escrever scripts complexos que precisam de manutenção constante, o N8N oferece uma interface baseada em nós (nodes). Você visualiza o dado fluindo de um ponto A para um ponto B em tempo real. Isso traz transparência e agilidade:</p>
            <ul>
                <li><strong>Conectividade Universal:</strong> O N8N conecta praticamente qualquer plataforma via API (REST ou GraphQL). Slack, Trello, WhatsApp, Google Sheets, Bancos SQL, OpenAI.</li>
                <li><strong>Lógica Avançada:</strong> Ele permite criar ramificações, loops, fusão de dados e tratamento de exceções complexos visualmente, oferecendo flexibilidade total.</li>
                <li><strong>Privacidade e Controle:</strong> Para empresas focadas em segurança de dados, o N8N pode ser hospedado em servidores próprios, garantindo total governança da informação.</li>
            </ul>

            <h2>Conectividade Total: Exemplo Prático de Workflow</h2>
            <p>Imagine o seguinte cenário automatizado de qualificação de leads:</p>
            <ol>
                <li><strong>Gatilho:</strong> Um cliente preenche um formulário no site.</li>
                <li><strong>Verificação:</strong> O sistema verifica no banco de dados se esse contato já existe.</li>
                <li><em>Se existir:</em> Atualiza o registro com a nova data de interação e notifica a equipe de sucesso do cliente.</li>
                <li><em>Se não existir:</em> 
                    <ul>
                        <li>Cria o lead no CRM.</li>
                        <li>Enriquece o dado buscando informações públicas corporativas.</li>
                        <li>Classifica o lead usando IA para entender a demanda.</li>
                        <li>Envia uma mensagem de boas-vindas personalizada.</li>
                    </ul>
                </li>
            </ol>
            <p>Isso acontece em milissegundos, 24 horas por dia, 7 dias por semana, com precisão total. Isso não é apenas eficiência; é escalabilidade. Uma empresa pode dobrar seu volume de leads mantendo a excelência de sua equipe administrativa.</p>
        `
    },
    {
        id: 4,
        title: "O Futuro do E-commerce: Hiper-Personalização",
        excerpt: "Análise de tendências: Composible Commerce, Checkout Invisível e a era onde a loja se adapta ao usuário para oferecer a melhor experiência.",
        category: "Tendências",
        date: "Atualizado",
        readTime: "9 min",
        imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2000&auto=format&fit=crop",
        author: "Vandilson Gomes",
        authorRole: "Estratégia Comercial",
        content: `
            <p>O e-commerce tradicional, baseado em vitrines estáticas e categorias rígidas, está se transformando. Entramos na era da <strong>"Loja para Cada Um"</strong>. Com o dinamismo do mercado digital e o investimento em tráfego pago (Ads), a melhor forma de manter margens saudáveis e focar na valorização da marca é através da relevância extrema.</p>

            <h2>A Era da Hiper-Personalização</h2>
            <p>Não estamos falando apenas de saudações personalizadas. Estamos falando de vitrines dinâmicas e fluidas. Se um usuário entra no seu site e o histórico mostra preferências específicas, a home page pode ser adaptada em tempo real para refletir isso. Algoritmos de recomendação agora usam inteligência semântica para entender o gosto do usuário.</p>

            <h2>Fluidez Total e Checkout Invisível</h2>
            <p>O principal foco para a conversão é a fluidez. Simplificar formulários em telas de celular é um impulsionador de vendas. O futuro pertence às carteiras digitais e ao checkout de um clique (1-click buy) integrados nativamente nas redes sociais e no WhatsApp.</p>
            <ul>
                <li><strong>Composible Commerce:</strong> A arquitetura de e-commerce está evoluindo para microsserviços. Você conecta as melhores ferramentas de busca, checkout e gestão de conteúdo via API. Isso permite agilidade na inovação contínua.</li>
                <li><strong>Omnichannel Real:</strong> O cliente começa a compra no Instagram, tira dúvida no WhatsApp com um bot e retira na loja física, com total integração de dados.</li>
            </ul>

            <h2>Logística Inteligente e Dark Stores</h2>
            <p>O consumidor moderno valoriza a agilidade. A IA está sendo usada para prever demanda regional e posicionar estoques em "dark stores" locais antes mesmo das vendas acontecerem. O produto chega mais rápido porque já estava estrategicamente posicionado, baseado na probabilidade estatística de compra. O e-commerce do futuro é sobre vender conveniência, identidade e experiência.</p>
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
        title: "Integração Neural de APIs",
        description: "Estudo sobre como conectar múltiplos LLMs via REST e GraphQL para criar ecossistemas autônomos.",
        status: "Em Andamento",
        date: "Processando...",
        tags: ["API", "Backend", "Automação"]
    },
    {
        id: 2,
        title: "Geração de Vídeo Generativa",
        description: "Experimento utilizando modelos de vídeo (Veo) para criar narrativas visuais sem intervenção humana.",
        status: "Em Andamento",
        date: "Processando...",
        tags: ["Video AI", "Veo", "Criatividade"]
    },
    {
        id: 3,
        title: "Otimização de Fluxo Empresarial",
        description: "Análise completa sobre gargalos operacionais em empresas de tecnologia.",
        status: "Concluído",
        date: "Finalizado",
        tags: ["Análise", "Eficiência", "Dados"]
    }
];

export const LAB_VIDEOS: LabVideo[] = [
    {
        id: 1,
        title: "Demo: Agente de Vendas AI",
        description: "Demonstração de um agente negociando preços via WhatsApp.",
        thumbnailUrl: "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=1000&auto=format&fit=crop",
        videoUrl: "", 
        duration: "Automático"
    },
    {
        id: 2,
        title: "Timelapse: Workflow Autônomo",
        description: "Construção de fluxo de automação no N8N.",
        thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
        videoUrl: "",
        duration: "Automático"
    }
];
