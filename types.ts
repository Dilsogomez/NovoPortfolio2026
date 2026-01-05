
export interface Project {
    title: string;
    description: string;
    image: string;
    link: string;
    status?: 'Online' | 'Offline';
}

export interface Tool {
    title: string;
    description: string;
    iconClass: string;
    features: string[];
    badges: string[];
}

export interface Metric {
    value: number;
    suffix: string;
    label: string;
    iconClass: string;
}

export interface ResultItem {
    value: number;
    suffix: string;
    title: string;
    description: string;
    iconClass: string;
}

export interface NavItem {
    label: string;
    href: string;
}

export interface SocialLink {
    href: string;
    iconClass: string;
    label: string;
}

export interface Video {
    title: string;
    url: string;
}

export interface Course {
    title: string;
    institution: string;
    description: string;
    tags: string[];
    videos: Video[];
    completed: boolean;
}

export interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    imageUrl: string;
    content: string;
    author: string;
    authorRole: string;
}

// Novos tipos para o Laboratório
export interface LabImage {
    id: number;
    title: string;
    url: string;
    tool: string; // ex: Midjourney, DALL-E
    prompt?: string;
}

export interface LabVideo {
    id: number;
    title: string;
    description: string;
    thumbnailUrl: string;
    videoUrl: string;
    duration: string;
}

export interface LabStudy {
    id: number;
    title: string;
    description: string;
    status: 'Em Andamento' | 'Concluído' | 'Conceito';
    date: string;
    tags: string[];
}