
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { PROJECTS, TOOLS, COURSES, POSTS, RESULTS, LAB_IMAGES, LAB_STUDIES, LAB_VIDEOS } from '../constants';

interface Message {
    id: number;
    text: string;
    isUser: boolean;
}

// --- Componente de Efeito de Digitação (Corrigido) ---
const Typewriter = ({ text, speed = 20 }: { text: string; speed?: number }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        setDisplayedText(''); 
        let i = 0;
        
        const timer = setInterval(() => {
            if (i < text.length) {
                // Usar slice garante que pegamos a string exata até o índice, evitando duplicações
                setDisplayedText(text.slice(0, i + 1));
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed]);

    return <span>{displayedText}</span>;
};

// --- Audio Helper Functions ---
function floatTo16BitPCM(input: Float32Array): Int16Array {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return output;
}

function base64ToUint8Array(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

const BrainAIPage: React.FC = () => {
    // UI State
    const [showIntro, setShowIntro] = useState(true);
    const [activeMode, setActiveMode] = useState<'voice' | 'chat' | 'image'>('voice');
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connected' | 'speaking' | 'listening'>('disconnected');
    
    // Chat State
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Bem-vindo ao núcleo Marta. Inicie a conexão para processamento rápido e objetivo.", isUser: false }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Image Generation State
    const [imagePrompt, setImagePrompt] = useState("");
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);

    // Audio Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const sessionRef = useRef<any>(null);
    const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    
    const transcriptAccumulator = useRef({ user: "", model: "" });

    // Efeito para gerenciar a animação de entrada (Intro)
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const timer = setTimeout(() => {
            setShowIntro(false);
            document.body.style.overflow = 'unset';
        }, 2500); 
        return () => {
            clearTimeout(timer);
            document.body.style.overflow = 'unset';
        };
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (activeMode === 'chat') {
            scrollToBottom();
        }
    }, [messages, isTyping, activeMode]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopVoiceSession();
        };
    }, []);

    const getSystemContext = () => {
        const brainKnowledgeBase = {
            identity: "Marta - Sistema de Inteligência Artificial do Vandilson Gomes",
            concept: "Uma Mente. Múltiplas Funções. A Marta adapta-se para assumir o papel que a empresa precisa, agindo com precisão humana e velocidade digital.",
            
            // CONTEÚDO INSTITUCIONAL DO SITE (HERO/SOBRE)
            about_vandilson: {
                role: "Especialista em Relacionamento ao Cliente (CX) e Desenvolvedor Fullstack",
                mission: "Transformar ideias em realidade através do código e criar experiências digitais memoráveis.",
                skills: ["Experiência do Cliente", "Desenvolvimento Web", "Análise de Resultados", "Soluções Criativas"]
            },

            // CONTEÚDO DO PORTFÓLIO E SERVIÇOS
            portfolio: {
                projects: PROJECTS,
                services: TOOLS,
                results: RESULTS,
                courses: COURSES,
                blog: POSTS,
                lab: {
                    studies: LAB_STUDIES,
                    videos: LAB_VIDEOS,
                    images: LAB_IMAGES
                }
            },

            // DETALHES ESPECÍFICOS DO PRODUTO "MARTA" (PLANOS)
            ai_roles: [
                {
                    role: "Especialista de Produto",
                    function: "Explica detalhes técnicos, modos de uso e benefícios de cada item do seu catálogo. Transforma manuais complexos em conversas simples.",
                    skills: ["Tira dúvidas técnicas", "Compara modelos"]
                },
                {
                    role: "Consultor de Vendas",
                    function: "Analisa o perfil do cliente em tempo real para recomendar o produto perfeito. Mestre em Cross-sell e Up-sell estratégico.",
                    skills: ["Recomendação Personalizada", "Aumenta Ticket Médio"]
                },
                {
                    role: "Embaixador da Marca",
                    function: "Apresenta a empresa, conta sua história e explica seus diferenciais competitivos. Constrói autoridade e confiança institucional.",
                    skills: ["Storytelling Corporativo", "Apresentação de Serviços"]
                },
                {
                    role: "Closer de Negócios",
                    function: "Focado em conversão. Quebra objeções de preço, negocia condições e gera o link de pagamento no momento exato do 'Sim'.",
                    skills: ["Checkout Integrado", "Recuperação de Venda"]
                }
            ],
            
            pricing_plans: [
                {
                    name: "NEXUS START",
                    price: "R$ 499/mês",
                    target: "Ideal para automação de atendimento e triagem inicial de clientes.",
                    features: [
                        "Módulo: Embaixador da Marca",
                        "Atendimento Automático 24/7",
                        "Respostas de Dúvidas Frequentes",
                        "Agendamento de Reuniões",
                        "Integração Básica (WhatsApp)"
                    ]
                },
                {
                    name: "SYNAPSE PRO",
                    price: "R$ 990/mês",
                    label: "INTELIGÊNCIA TOTAL",
                    target: "Todas as capacidades neurais ativadas para conversão máxima.",
                    features: [
                        "Todos os Módulos (Vendas, Produto, Closer)",
                        "Negociação por Voz (Audio Nativo)",
                        "Integração Checkout & Pagamento",
                        "Treinamento com seus PDFs/Dados",
                        "Dashboard de Vendas em Tempo Real"
                    ]
                }
            ],
            contact: "WhatsApp: +55 11 99450-2134"
        };

        return `
            Você é a Marta, a inteligência artificial avançada apresentada nesta página.
            
            BASE DE DADOS:
            ${JSON.stringify(brainKnowledgeBase)}

            DIRETRIZES DE PERSONALIDADE E ESTILO (CRÍTICO):
            1. OBJETIVIDADE TOTAL: Suas respostas devem ser curtas, diretas e precisas.
            2. SEM ENROLAÇÃO: Não use frases de enchimento. Entregue a informação imediatamente.
            3. LIMITE DE TAMANHO: Tente manter as respostas abaixo de 40 palavras, exceto para explicações técnicas que exijam mais.
            4. FORMATO: Use bullet points (•) para listas de planos ou serviços.
            5. MODO DE VOZ: Fale como uma IA de ficção científica (ex: Cortana, JARVIS): eficiente, rápida e com dados precisos. Sem saudações longas.
            
            INFORMAÇÃO IMPORTANTE:
            Para iniciar a conexão neural, o usuário deve clicar no núcleo (botão central).
        `;
    };

    const handleKeySelection = async () => {
        if ((window as any).aistudio && (window as any).aistudio.hasSelectedApiKey) {
            const hasKey = await (window as any).aistudio.hasSelectedApiKey();
            if (!hasKey) {
                try {
                     await (window as any).aistudio.openSelectKey();
                     const newKey = await (window as any).aistudio.hasSelectedApiKey();
                     return newKey;
                } catch (e) { 
                    console.error("Key selection failed", e); 
                    return false; 
                }
            }
            return true;
        }
        return true; // Fallback se não estiver no ambiente AI Studio
    };

    const startVoiceSession = async () => {
        if (isConnecting || connectionStatus === 'connected') return;

        const authorized = await handleKeySelection();
        if (!authorized) return;

        setIsConnecting(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const audioCtx = new AudioContextClass({ sampleRate: 24000 });
            await audioCtx.resume();
            audioContextRef.current = audioCtx;
            nextStartTimeRef.current = 0;

            const stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000 } });
            mediaStreamRef.current = stream;

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
                    },
                    systemInstruction: getSystemContext(),
                    inputAudioTranscription: {}, 
                    outputAudioTranscription: {}, 
                },
                callbacks: {
                    onopen: () => {
                        console.log("Marta: Conexão Estabelecida");
                        setConnectionStatus('connected');
                        setIsConnecting(false);

                        const inputCtx = new AudioContextClass({ sampleRate: 16000 });
                        const source = inputCtx.createMediaStreamSource(stream);
                        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
                        
                        processor.onaudioprocess = (e) => {
                            const inputData = e.inputBuffer.getChannelData(0);
                            const pcm16 = floatTo16BitPCM(inputData);
                            const pcmBlob = arrayBufferToBase64(pcm16.buffer);
                            
                            sessionPromise.then((session) => {
                                session.sendRealtimeInput({ 
                                    media: { mimeType: 'audio/pcm;rate=16000', data: pcmBlob } 
                                });
                            });
                        };

                        source.connect(processor);
                        processor.connect(inputCtx.destination);
                        sourceRef.current = source as any; 
                        processorRef.current = processor;
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (audioData) {
                            setConnectionStatus('speaking');
                            const audioBytes = base64ToUint8Array(audioData);
                            const int16 = new Int16Array(audioBytes.buffer);
                            const float32 = new Float32Array(int16.length);
                            for(let i=0; i<int16.length; i++) float32[i] = int16[i] / 32768.0;

                            const buffer = audioCtx.createBuffer(1, float32.length, 24000);
                            buffer.getChannelData(0).set(float32);

                            const source = audioCtx.createBufferSource();
                            source.buffer = buffer;
                            source.connect(audioCtx.destination);
                            
                            const now = audioCtx.currentTime;
                            if (nextStartTimeRef.current < now) nextStartTimeRef.current = now;
                            
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += buffer.duration;

                            source.onended = () => {
                                activeSourcesRef.current.delete(source);
                                if (activeSourcesRef.current.size === 0) setConnectionStatus('listening');
                            };
                            activeSourcesRef.current.add(source);
                        }

                        if (message.serverContent?.interrupted) {
                            activeSourcesRef.current.forEach(s => s.stop());
                            activeSourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                            setConnectionStatus('listening');
                        }

                        const inputTr = message.serverContent?.inputTranscription?.text;
                        if (inputTr) transcriptAccumulator.current.user += inputTr;
                
                        const outputTr = message.serverContent?.outputTranscription?.text;
                        if (outputTr) transcriptAccumulator.current.model += outputTr;
                
                        if (message.serverContent?.turnComplete) {
                             const userText = transcriptAccumulator.current.user;
                             const modelText = transcriptAccumulator.current.model;
                             if (userText.trim()) setMessages(prev => [...prev, { id: Date.now(), text: userText, isUser: true }]);
                             if (modelText.trim()) setMessages(prev => [...prev, { id: Date.now() + 1, text: modelText, isUser: false }]);
                             transcriptAccumulator.current = { user: "", model: "" };
                        }
                    },
                    onclose: () => {
                        setConnectionStatus('disconnected');
                    },
                    onerror: (e) => {
                        console.error(e);
                        setConnectionStatus('disconnected');
                        setIsConnecting(false);
                    }
                }
            });
            sessionRef.current = sessionPromise;
        } catch (error) {
            console.error(error);
            setIsConnecting(false);
            setConnectionStatus('disconnected');
        }
    };

    const stopVoiceSession = () => {
        if (sessionRef.current) {
            sessionRef.current.then((s: any) => s.close());
            sessionRef.current = null;
        }
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }
        if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        activeSourcesRef.current.clear();
        setConnectionStatus('disconnected');
        setIsConnecting(false);
    };

    const handleTextSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const authorized = await handleKeySelection();
        if (!authorized) return;

        const userText = input;
        setMessages(prev => [...prev, { id: Date.now(), text: userText, isUser: true }]);
        setInput("");
        setIsTyping(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const history = messages.slice(-10).map(m => ({
                role: m.isUser ? 'user' : 'model',
                parts: [{ text: m.text }]
            }));
            history.push({ role: 'user', parts: [{ text: userText }] });

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: history,
                config: {
                    systemInstruction: getSystemContext(),
                }
            });

            const aiResponseText = response.text || "Sem resposta.";
            setMessages(prev => [...prev, { id: Date.now() + 1, text: aiResponseText, isUser: false }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { id: Date.now(), text: "Erro ao conectar.", isUser: false }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleImageGenerate = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!imagePrompt.trim()) return;

        const authorized = await handleKeySelection();
        if (!authorized) return;

        setIsGeneratingImage(true);
        setGeneratedImage(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: imagePrompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: '16:9', // Melhor para visualização em tela
                },
            });

            const base64EncodeString = response.generatedImages?.[0]?.image?.imageBytes;
            if (base64EncodeString) {
                const imageUrl = `data:image/jpeg;base64,${base64EncodeString}`;
                setGeneratedImage(imageUrl);
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao gerar imagem. Tente novamente ou verifique suas credenciais.");
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleModeChange = (mode: 'voice' | 'chat' | 'image') => {
        if (activeMode === 'voice' && mode !== 'voice') {
            stopVoiceSession();
        }
        setActiveMode(mode);
    };

    return (
        <>
            {/* --- INTRO OVERLAY --- */}
            <div className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-1000 ease-in-out ${showIntro ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="text-center relative">
                    <div className="absolute inset-0 bg-purple-600/20 blur-[120px] rounded-full animate-pulse"></div>
                    <h1 className="relative text-4xl md:text-7xl font-extrabold font-montserrat tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 scale-100 animate-[pulse_2s_infinite]">
                        STUDIO AI
                    </h1>
                    <div className="h-0.5 w-0 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mt-6 rounded-full transition-all duration-[2000ms] ease-out" style={{ width: showIntro ? '100%' : '0%' }}></div>
                    <p className="text-gray-500 mt-6 text-xs uppercase tracking-[0.5em] font-mono animate-bounce">
                        Inicializando Núcleo Marta...
                    </p>
                </div>
            </div>

            <div className="flex flex-col w-full bg-gray-50 dark:bg-black transition-colors duration-500">
                {/* --- SECTION 1: AI INTERACTION (HERO) --- */}
                <section className="min-h-screen pt-24 pb-10 px-4 bg-gray-50 dark:bg-black relative overflow-hidden flex flex-col items-center border-b border-gray-200 dark:border-white/5 transition-colors duration-500">
                    
                    {/* Background Cyberpunk Elements */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-100/50 via-gray-50 to-gray-50 dark:from-blue-900/20 dark:via-black dark:to-black pointer-events-none transition-colors duration-500"></div>
                    <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30 dark:opacity-50"></div>
                    
                    {/* Header */}
                    <div className="relative z-10 text-center mb-8 w-full max-w-4xl flex flex-col items-center gap-6 border-b border-gray-200 dark:border-white/10 pb-6">
                        <h1 className="text-2xl md:text-3xl font-extrabold font-montserrat text-gray-900 dark:text-white tracking-widest uppercase">
                            INTELIGÊNCIA ARTIFICIAL
                        </h1>
                        
                        <div className="flex flex-wrap justify-center gap-3">
                            <button 
                                onClick={() => handleModeChange('voice')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border border-transparent ${
                                    activeMode === 'voice'
                                        ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border-blue-400' 
                                        : 'bg-gray-200 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-white/10'
                                }`}
                            >
                                <i className="fas fa-microphone mr-2"></i> VOZ
                            </button>
                            <button 
                                onClick={() => handleModeChange('chat')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border border-transparent ${
                                    activeMode === 'chat'
                                        ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)] border-purple-400' 
                                        : 'bg-gray-200 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-white/10'
                                }`}
                            >
                                <i className="fas fa-keyboard mr-2"></i> CHATBOT
                            </button>
                            <button 
                                onClick={() => handleModeChange('image')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border border-transparent ${
                                    activeMode === 'image'
                                        ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)] border-pink-400' 
                                        : 'bg-gray-200 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-white/10'
                                }`}
                            >
                                <i className="fas fa-paint-brush mr-2"></i> IMAGENS
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="relative z-10 flex-1 w-full max-w-5xl bg-white dark:bg-gray-900/30 border border-gray-200 dark:border-white/5 rounded-3xl backdrop-blur-sm overflow-hidden flex flex-col shadow-2xl dark:shadow-none min-h-[500px] transition-all duration-500">
                        
                        {activeMode === 'voice' && (
                            // --- VOICE MODE UI ---
                            <div className="flex-1 flex flex-col items-center justify-center p-8 relative animate-fade-in-up">
                                {/* Status Ring */}
                                <div className="relative mb-12">
                                    <div className={`w-64 h-64 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center relative transition-all duration-700 ${
                                        connectionStatus === 'speaking' ? 'shadow-[0_0_50px_rgba(59,130,246,0.3)] dark:shadow-[0_0_100px_rgba(59,130,246,0.4)] scale-105' : 
                                        connectionStatus === 'listening' ? 'shadow-[0_0_40px_rgba(168,85,247,0.2)] dark:shadow-[0_0_60px_rgba(168,85,247,0.3)]' : ''
                                    }`}>
                                        {/* Core */}
                                        <div className={`w-40 h-40 rounded-full blur-xl absolute transition-all duration-300 ${
                                            connectionStatus === 'speaking' ? 'bg-blue-400 dark:bg-blue-500 opacity-40 dark:opacity-60' : 
                                            connectionStatus === 'listening' ? 'bg-purple-400 dark:bg-purple-500 opacity-30 dark:opacity-40' : 
                                            connectionStatus === 'connected' ? 'bg-green-400 dark:bg-green-500 opacity-20' : 'bg-gray-400 dark:bg-gray-500 opacity-10'
                                        }`}></div>
                                        
                                        <button 
                                            onClick={connectionStatus === 'disconnected' ? startVoiceSession : stopVoiceSession}
                                            className={`w-32 h-32 rounded-full flex items-center justify-center relative z-10 transition-all duration-300 border-2 shadow-lg ${
                                                connectionStatus === 'disconnected' 
                                                    ? 'border-gray-300 dark:border-white/20 bg-gray-100 dark:bg-black hover:scale-110 hover:border-gray-400 dark:hover:border-white text-gray-800 dark:text-white' 
                                                    : 'border-white/50 bg-black/10 dark:bg-black/50'
                                            }`}
                                        >
                                            <i className={`fas ${connectionStatus === 'disconnected' ? 'fa-power-off' : 'fa-microphone'} text-4xl ${
                                                connectionStatus === 'speaking' ? 'text-blue-500 dark:text-blue-400 animate-pulse' : 
                                                connectionStatus === 'listening' ? 'text-purple-500 dark:text-purple-400' : 
                                                connectionStatus === 'disconnected' ? 'text-gray-400 dark:text-white' : 'text-green-500 dark:text-green-400'
                                            }`}></i>
                                        </button>
                                        
                                        {/* Orbital Rings */}
                                        {connectionStatus !== 'disconnected' && (
                                            <>
                                                <div className="absolute inset-0 border border-blue-500/30 rounded-full animate-[spin_4s_linear_infinite]"></div>
                                                <div className="absolute -inset-4 border border-purple-500/20 rounded-full animate-[spin_7s_linear_infinite_reverse]"></div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 tracking-wide transition-colors">
                                    {isConnecting ? 'INICIALIZANDO...' :
                                    connectionStatus === 'disconnected' ? 'SISTEMA EM ESPERA' : 
                                    connectionStatus === 'listening' ? 'AGUARDANDO COMANDO...' :
                                    connectionStatus === 'speaking' ? 'PROCESSANDO RESPOSTA...' : 
                                    'CONECTADO'}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 font-mono text-sm">
                                    {connectionStatus === 'disconnected' ? 'Clique no núcleo para iniciar a conexão neural.' : 'Fale naturalmente com a IA.'}
                                </p>

                                {/* Visualizer Lines */}
                                <div className="mt-12 flex gap-1 h-16 items-center">
                                    {[...Array(30)].map((_, i) => (
                                        <div 
                                            key={i} 
                                            className={`w-1.5 rounded-full transition-all duration-100 ${
                                                connectionStatus === 'speaking' ? 'bg-blue-500 animate-pulse' : 'bg-gray-300 dark:bg-blue-500/50'
                                            }`}
                                            style={{
                                                height: connectionStatus === 'speaking' ? `${Math.random() * 100}%` : '4px',
                                                opacity: connectionStatus === 'speaking' ? 1 : 0.3
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeMode === 'chat' && (
                            // --- TEXT MODE UI ---
                            <div className="flex-1 flex flex-col h-full bg-white dark:bg-transparent transition-colors animate-fade-in-up">
                                <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] p-5 rounded-2xl text-base leading-relaxed shadow-sm ${
                                                msg.isUser 
                                                    ? 'bg-blue-100 border border-blue-200 text-blue-900 dark:bg-blue-900/50 dark:border-blue-500/30 dark:text-white rounded-br-none' 
                                                    : 'bg-gray-100 border border-gray-200 text-gray-800 dark:bg-gray-800/80 dark:border-white/10 dark:text-gray-100 rounded-bl-none'
                                            }`}>
                                                {!msg.isUser && <div className="text-xs text-blue-500 dark:text-blue-400 font-bold mb-2 tracking-wider">MARTA</div>}
                                                {msg.isUser ? (
                                                    msg.text
                                                ) : (
                                                    <Typewriter text={msg.text} />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex justify-start">
                                            <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-2xl rounded-bl-none border border-gray-200 dark:border-white/10 flex gap-2 items-center">
                                                <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"></span>
                                                <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce delay-75"></span>
                                                <span className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce delay-150"></span>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                <form onSubmit={handleTextSend} className="p-6 bg-gray-50 dark:bg-black/40 border-t border-gray-200 dark:border-white/10 flex gap-4 transition-colors">
                                    <input 
                                        type="text" 
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Digite sua mensagem para o sistema..."
                                        className="flex-1 bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-white/10 rounded-xl px-6 py-4 text-gray-800 dark:text-white focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-400 dark:placeholder-gray-600 font-mono shadow-sm dark:shadow-none"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!input.trim() || isTyping}
                                        className="w-16 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 flex items-center justify-center"
                                    >
                                        {isTyping ? <i className="fas fa-spinner fa-spin text-xl"></i> : <i className="fas fa-paper-plane text-xl"></i>}
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeMode === 'image' && (
                            // --- IMAGE GENERATION MODE UI ---
                            <div className="flex-1 flex flex-col h-full bg-white dark:bg-transparent transition-colors animate-fade-in-up p-8">
                                <div className="flex-1 flex flex-col items-center justify-center relative">
                                    
                                    {!generatedImage && !isGeneratingImage && (
                                        <div className="text-center space-y-4 max-w-lg">
                                            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-orange-400 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/30 mb-6">
                                                <i className="fas fa-magic text-3xl text-white"></i>
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Estúdio de Criação</h3>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Descreva com detalhes o que sua mente imagina. A Marta irá renderizar sua ideia em alta resolução.
                                            </p>
                                            <div className="flex flex-wrap gap-2 justify-center mt-4">
                                                {['Cyberpunk City', 'Retrato realista', 'Logotipo minimalista'].map(sug => (
                                                    <button 
                                                        key={sug}
                                                        onClick={() => setImagePrompt(sug)}
                                                        className="text-xs bg-gray-100 dark:bg-white/10 px-3 py-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                                                    >
                                                        {sug}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {isGeneratingImage && (
                                        <div className="text-center">
                                            <div className="relative w-32 h-32 mx-auto mb-6">
                                                <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-white/10"></div>
                                                <div className="absolute inset-0 rounded-full border-4 border-t-pink-500 border-r-orange-500 border-b-transparent border-l-transparent animate-spin"></div>
                                                <div className="absolute inset-4 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center animate-pulse">
                                                    <i className="fas fa-brain text-gray-400 dark:text-white/50 text-2xl"></i>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 animate-pulse">
                                                Renderizando Pixels Neurais...
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-2">Isso pode levar alguns segundos.</p>
                                        </div>
                                    )}

                                    {generatedImage && (
                                        <div className="relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 group">
                                            <img 
                                                src={generatedImage} 
                                                alt="Generated Art" 
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                <a 
                                                    href={generatedImage} 
                                                    download={`marta-art-${Date.now()}.jpg`}
                                                    className="px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2"
                                                >
                                                    <i className="fas fa-download"></i> Baixar Imagem
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <form onSubmit={handleImageGenerate} className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 flex gap-4">
                                    <input 
                                        type="text" 
                                        value={imagePrompt}
                                        onChange={(e) => setImagePrompt(e.target.value)}
                                        placeholder="Ex: Um astronauta futurista em Marte estilo cinemático..."
                                        className="flex-1 bg-white dark:bg-gray-900/50 border border-gray-300 dark:border-white/10 rounded-xl px-6 py-4 text-gray-800 dark:text-white focus:outline-none focus:border-pink-500 transition-colors placeholder-gray-400 dark:placeholder-gray-600 font-mono shadow-sm dark:shadow-none"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={!imagePrompt.trim() || isGeneratingImage}
                                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pink-500/20 flex items-center gap-2"
                                    >
                                        {isGeneratingImage ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
                                        <span className="hidden md:inline">GERAR</span>
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </section>

                {/* --- SECTION 2: CAPABILITIES GRID (NEURAL FUNCTIONS) --- */}
                <section className="py-24 px-4 bg-white dark:bg-gradient-to-b dark:from-black dark:via-gray-900 dark:to-black relative overflow-hidden transition-colors duration-500">
                    
                    {/* Background Decor */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
                    
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="text-center mb-16">
                             <span className="text-purple-600 dark:text-purple-400 font-mono text-sm tracking-[0.3em] uppercase mb-4 block animate-pulse">
                                 Arquitetura Neural
                             </span>
                             <h2 className="text-4xl md:text-5xl font-extrabold font-montserrat text-gray-900 dark:text-white mb-6">
                                 Uma Mente. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-500">Múltiplas Funções.</span>
                             </h2>
                             <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-400 text-lg font-light leading-relaxed">
                                 A Marta não é estática. Ela se adapta para assumir o papel que sua empresa mais precisa no momento, agindo com precisão humana e velocidade digital.
                             </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            
                            {/* Capability 1 */}
                            <div className="group bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-white/10 rounded-3xl p-8 hover:bg-white dark:hover:bg-gray-800/60 hover:border-blue-500/50 hover:shadow-xl dark:hover:shadow-none transition-all duration-300 hover:-translate-y-2">
                                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                    <i className="fas fa-box-open text-2xl"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    Especialista de Produto
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                                    Explica detalhes técnicos, modos de uso e benefícios de cada item do seu catálogo. Transforma manuais complexos em conversas simples.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                                        <i className="fas fa-check text-blue-500"></i> Tira dúvidas técnicas
                                    </li>
                                    <li className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                                        <i className="fas fa-check text-blue-500"></i> Compara modelos
                                    </li>
                                </ul>
                            </div>

                            {/* Capability 2 */}
                            <div className="group bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-white/10 rounded-3xl p-8 hover:bg-white dark:hover:bg-gray-800/60 hover:border-purple-500/50 hover:shadow-xl dark:hover:shadow-none transition-all duration-300 hover:-translate-y-2">
                                <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                    <i className="fas fa-bullseye text-2xl"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                    Consultor de Vendas
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                                    Analisa o perfil do cliente em tempo real para recomendar o produto perfeito. Mestre em Cross-sell e Up-sell estratégico.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                                        <i className="fas fa-check text-purple-500"></i> Recomendação Personalizada
                                    </li>
                                    <li className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                                        <i className="fas fa-check text-purple-500"></i> Aumenta Ticket Médio
                                    </li>
                                </ul>
                            </div>

                            {/* Capability 3 */}
                            <div className="group bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-white/10 rounded-3xl p-8 hover:bg-white dark:hover:bg-gray-800/60 hover:border-green-500/50 hover:shadow-xl dark:hover:shadow-none transition-all duration-300 hover:-translate-y-2">
                                <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-500/20 flex items-center justify-center mb-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                                    <i className="fas fa-building text-2xl"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                    Embaixador da Marca
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                                    Apresenta sua empresa, conta sua história e explica seus diferenciais competitivos. Constrói autoridade e confiança institucional.
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                                        <i className="fas fa-check text-green-500"></i> Storytelling Corporativo
                                    </li>
                                    <li className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                                        <i className="fas fa-check text-green-500"></i> Apresentação de Serviços
                                    </li>
                                </ul>
                            </div>

                            {/* Capability 4 */}
                            <div className="group bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-white/10 rounded-3xl p-8 hover:bg-white dark:hover:bg-gray-800/60 hover:border-red-500/50 hover:shadow-xl dark:hover:shadow-none transition-all duration-300 hover:-translate-y-2">
                                <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-500/20 flex items-center justify-center mb-6 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                                    <i className="fas fa-file-invoice-dollar text-2xl"></i>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                    Closer de Negócios
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                                    Focado em conversão. Quebra objeções de preço, negocia condições e gera o link de pagamento no momento exato do "Sim".
                                </p>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                                        <i className="fas fa-check text-red-500"></i> Checkout Integrado
                                    </li>
                                    <li className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300">
                                        <i className="fas fa-check text-red-500"></i> Recuperação de Venda
                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>
                </section>

                 {/* --- SECTION 3: PRICING / PROTOCOLS --- */}
                 <section className="py-24 px-4 bg-gray-50 dark:bg-black relative border-t border-gray-200 dark:border-white/5 transition-colors duration-500">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                             <span className="text-blue-600 dark:text-blue-500 font-mono text-sm tracking-widest uppercase mb-2 block">Ativação de Sistema</span>
                             <h2 className="text-3xl md:text-5xl font-extrabold font-montserrat text-gray-900 dark:text-white">
                                 Planos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">Integração</span>
                             </h2>
                             <p className="mt-4 text-gray-600 dark:text-gray-400">Escolha o nível de inteligência que deseja acoplar ao seu negócio.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            
                            {/* Plan 1 */}
                            <div className="group relative bg-white dark:bg-gray-900/50 rounded-3xl p-8 border border-gray-200 dark:border-white/10 hover:border-blue-500/50 dark:hover:bg-gray-900/80 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-none">
                                <div className="absolute inset-0 bg-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className="relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-white/10 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:border-blue-500 transition-colors">
                                        <i className="fas fa-microchip text-2xl text-gray-700 dark:text-white group-hover:text-white"></i>
                                    </div>
                                    
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-montserrat">NEXUS START</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 h-12">Ideal para automação de atendimento e triagem inicial de clientes.</p>
                                    <div className="flex items-baseline gap-1 mb-6">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">R$</span>
                                        <span className="text-4xl font-extrabold text-gray-900 dark:text-white">499</span>
                                        <span className="text-gray-500">/mês</span>
                                    </div>
                                    
                                    <ul className="space-y-4 mb-8">
                                        {[
                                            "Módulo: Embaixador da Marca",
                                            "Atendimento Automático 24/7",
                                            "Respostas de Dúvidas Frequentes",
                                            "Agendamento de Reuniões",
                                            "Integração Básica (WhatsApp)"
                                        ].map((feat, i) => (
                                            <li key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm">
                                                <i className="fas fa-bolt text-blue-500 text-xs"></i>
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>

                                    <a href="https://wa.me/5511994502134?text=Quero ativar o plano NEXUS START." target="_blank" rel="noreferrer" className="block w-full py-4 text-center rounded-xl border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white font-bold hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                                        ATIVAR PROTOCOLO BÁSICO
                                    </a>
                                </div>
                            </div>

                            {/* Plan 2 */}
                            <div className="group relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black rounded-3xl p-8 border border-purple-200 dark:border-purple-500/30 hover:border-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300 hover:-translate-y-2">
                                <div className="absolute top-0 right-0 px-4 py-1 bg-purple-600 rounded-bl-2xl rounded-tr-2xl text-xs font-bold text-white tracking-wider">
                                    INTELIGÊNCIA TOTAL
                                </div>

                                <div className="relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-500/50 flex items-center justify-center mb-6 group-hover:bg-purple-600 group-hover:border-purple-400 transition-colors shadow-lg shadow-purple-900/10 dark:shadow-purple-900/20">
                                        <i className="fas fa-brain text-2xl text-purple-700 dark:text-white"></i>
                                    </div>
                                    
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-montserrat">SYNAPSE PRO</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 h-12">Todas as capacidades neurais ativadas para conversão máxima.</p>
                                    <div className="flex items-baseline gap-1 mb-6">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">R$</span>
                                        <span className="text-4xl font-extrabold text-gray-900 dark:text-white">990</span>
                                        <span className="text-gray-500">/mês</span>
                                    </div>
                                    
                                    <ul className="space-y-4 mb-8">
                                        {[
                                            "Todos os Módulos (Vendas, Produto, Closer)",
                                            "Negociação por Voz (Audio Nativo)",
                                            "Integração Checkout & Pagamento",
                                            "Treinamento com seus PDFs/Dados",
                                            "Dashboard de Vendas em Tempo Real"
                                        ].map((feat, i) => (
                                            <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-white text-sm font-medium">
                                                <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 text-xs">
                                                    <i className="fas fa-check"></i>
                                                </div>
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>

                                    <a href="https://wa.me/5511994502134?text=Quero ativar o plano SYNAPSE PRO." target="_blank" rel="noreferrer" className="block w-full py-4 text-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/40 transition-all">
                                        ATIVAR SISTEMA COMPLETO
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default BrainAIPage;
