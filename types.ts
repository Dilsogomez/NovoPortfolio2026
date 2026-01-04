export interface Project {
    title: string;
    description: string;
    image: string;
    link: string;
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