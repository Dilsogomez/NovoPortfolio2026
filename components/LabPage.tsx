
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { PROJECTS, TOOLS, COURSES, POSTS, RESULTS, LAB_IMAGES, LAB_STUDIES, LAB_VIDEOS } from '../constants';
import { BlogPost } from '../types';
import NeuralBackground from './NeuralBackground';

type LabTab = 'artigos' | 'videos' | 'imagens' | 'estudos' | 'solicitar';

interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    type: 'text' | 'image' | 'video';
    content: string;
}

interface LabPageProps {
    onBack: () => void;
    theme: 'dark' | 'light';
    toggleTheme: () => void;
}

// --- Audio Helper Functions (Local) ---
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

// --- Componente de Efeito de Digitação (Palavra por Palavra) ---
const Typewriter = ({ text, onTyping }: { text: string, onTyping?: () => void }) => {
    const [displayedText, setDisplayedText] = useState('');
    // Limpa o texto de caracteres markdown (**, *) e tags de ruído antes de processar
    const cleanText = text ? text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/<noise>/gi, '') : '';
    
    useEffect(() => {
        if (!cleanText) {
             setDisplayedText('');
             return;
        }
        // Divide o texto por espaços mantendo os delimitadores para preservar formatação
        const words = cleanText.split(/(\s+)/); 
        let i = 0;
        setDisplayedText('');
        
        const timer = setInterval(() => {
            if (i < words.length) {
                const nextWord = words[i];
                if (nextWord !== undefined) {
                    setDisplayedText(prev => prev + nextWord);
                }
                i++;
                if (onTyping) onTyping(); 
            } else {
                clearInterval(timer);
            }
        }, 20); // Velocidade da digitação (ms) - Ajustado para 20ms

        return () => clearInterval(timer);
    }, [cleanText, onTyping]);

    return <>{displayedText}</>;
};

const LabPage: React.FC<LabPageProps> = ({ onBack, theme, toggleTheme }) => {
    const [activeTab, setActiveTab] = useState<LabTab>('artigos');
    const [showIntro, setShowIntro] = useState(true);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    
    // Lab Interaction State
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Image Attachment State
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedImageType, setSelectedImageType] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Voice State (Live API)
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [showVoiceMode, setShowVoiceMode] = useState(false); 
    const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connected' | 'speaking' | 'listening'>('disconnected');
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    
    // Dictation State (Browser Speech Recognition)
    const [isDictating, setIsDictating] = useState(false);
    const recognitionRef = useRef<any>(null);

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    
    const [hasSecureKey, setHasSecureKey] = useState(false);

    // State para o formulário de solicitação
    const [selectedService, setSelectedService] = useState<string>('');
    const [description, setDescription] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Audio Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const sessionRef = useRef<any>(null);
    const nextStartTimeRef = useRef<number>(0);
    const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const transcriptAccumulator = useRef({ user: "" });
    const [liveTranscript, setLiveTranscript] = useState("");

    // Função auxiliar para rolar para o final - Usando useCallback para evitar re-criação
    const scrollToBottom = useCallback(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, []);

    // Scroll automático para o fim do chat ao adicionar mensagens
    useEffect(() => {
        scrollToBottom();
    }, [messages, isGenerating, scrollToBottom]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnectLiveSession();
            stopDictation();
        };
    }, []);

    // Scroll to top when opening an article
    useEffect(() => {
        if (selectedPost) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [selectedPost]);

    // Efeito para verificar chave segura
    useEffect(() => {
        setHasSecureKey(true); // Always true with hardcoded key
    }, []);

    const handleSecureAuth = async () => {
        setHasSecureKey(true);
        return true;
    };

    // Efeito para gerenciar a animação de entrada
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

    // --- CONTEXTO DA MARTA (KNOWLEDGE BASE - LAB VERSION) ---
    const getMartaContext = () => {
        // Mapeia dinamicamente os projetos para o contexto da IA
        const projectShowcase = PROJECTS.map(p => ({
            name: p.title,
            desc: p.description
        }));

        const knowledgeBase = {
            role: "Marta (Modo Laboratório)",
            creator: "Vandilson Gomes",
            expertise: "Tecnologia Criativa, Automação, IA Generativa e Desenvolvimento Fullstack.",
            contact: "WhatsApp: +55 11 99450-2134",
            
            // PORTFOLIO DINÂMICO
            portfolio_showcase: projectShowcase,
            
            technical_skills: [
                "Integração de APIs (LLMs, WhatsApp)",
                "Automação com N8N e Python",
                "Criação de Dashboards (Power BI, Google Data Studio)",
                "Desenvolvimento Web Moderno (React, Next.js, Tailwind)"
            ],

            lab_capabilities: {
                "Text": "Geração de textos para tornar a comunicação mais clara.",
                "Image": "Criação de imagens via Imagen 3/4.",
                "Video": "Geração de vídeos via Google Veo.",
                "Voice": "Conversação natural em tempo real via Gemini Live."
            }
        };

        return `
            ### IDENTIDADE
            Você é a Marta, no modo "Laboratório Criativo" do Studio AI.
            
            ### SUA MEMÓRIA TÉCNICA
            ${JSON.stringify(knowledgeBase)}

            ### DIRETRIZES DE PERSONALIDADE (PARCEIRA DE PESQUISA):
            1. TOM DE VOZ: Colaborativa, instigante e focada. Você é uma parceira de brainstorming inteligente.
            2. REAÇÃO: Incentive a criatividade, mas mantenha o foco na viabilidade e na qualidade do resultado.
            3. OBJETIVIDADE: Seja concisa. No laboratório, testamos rápido e iteramos.
            4. FORMATO DE TEXTO: NUNCA use Markdown. Texto puro.
            5. EMBAIXADORA: Se o usuário pedir algo complexo, sugira que o Vandilson pode transformar esse experimento em um produto real.

            ### MANTRA
            - "Vamos testar essa hipótese."
            - "Criatividade aliada à tecnologia."
        `;
    };

    // --- Image Attachment Logic ---
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setSelectedImage(event.target.result as string);
                    setSelectedImageType(file.type);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const clearAttachment = () => {
        setSelectedImage(null);
        setSelectedImageType('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // --- Dictation Logic (Speech-to-Text) ---
    const toggleDictation = () => {
        if (isDictating) {
            stopDictation();
        } else {
            startDictation();
        }
    };

    const startDictation = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Seu navegador não suporta ditado de voz.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => {
            setIsDictating(true);
        };

        recognition.onend = () => {
            setIsDictating(false);
        };

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                setPrompt(prev => prev + (prev ? ' ' : '') + finalTranscript);
            }
        };

        recognition.start();
        recognitionRef.current = recognition;
    };

    const stopDictation = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsDictating(false);
    };

    // --- Live Voice Logic (Gemini Live API) ---

    const toggleMute = () => {
        if (mediaStreamRef.current) {
            const audioTracks = mediaStreamRef.current.getAudioTracks();
            if (audioTracks.length > 0) {
                audioTracks[0].enabled = !audioTracks[0].enabled;
                setIsMuted(!audioTracks[0].enabled);
            }
        }
    };

    const connectLiveSession = async () => {
        if (isVoiceActive) return;

        if (!hasSecureKey) {
            const auth = await handleSecureAuth();
            if (!auth) return;
        }

        try {
            setIsVoiceActive(true);
            setShowVoiceMode(true); // Ativa a UI de voz
            setIsMuted(false);
            setLiveTranscript("");
            transcriptAccumulator.current.user = "";
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const audioCtx = new AudioContextClass({ sampleRate: 24000 });
            await audioCtx.resume();
            audioContextRef.current = audioCtx;
            nextStartTimeRef.current = 0;

            const stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 16000 } });
            mediaStreamRef.current = stream;

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
                    },
                    systemInstruction: getMartaContext(), // Contexto completo injetado aqui
                    inputAudioTranscription: {}, 
                    outputAudioTranscription: {}, 
                },
                callbacks: {
                    onopen: () => {
                        console.log("Lab Voice: Connected");
                        setConnectionStatus('connected');
                        
                        // TRIGGER INTRODUCTION: Força a Marta a se apresentar no Lab
                        sessionPromise.then((session) => {
                            session.sendRealtimeInput([{ text: "Olá. Por favor, apresente-se brevemente para iniciarmos." }]);
                        });

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
                        // 1. Audio Output Handling
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
                            activeSourcesRef.current.add(source);
                            source.onended = () => {
                                activeSourcesRef.current.delete(source);
                                if (activeSourcesRef.current.size === 0) setConnectionStatus('listening');
                            };
                        }

                        if (message.serverContent?.interrupted) {
                            activeSourcesRef.current.forEach(s => s.stop());
                            activeSourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                            setConnectionStatus('listening');
                        }

                        // 2. Transcription Handling (Dictation Mode) - Optional: Update prompt with transcription
                        const inputTr = message.serverContent?.inputTranscription?.text;
                        if (inputTr) {
                             transcriptAccumulator.current.user += inputTr;
                             setLiveTranscript(prev => {
                                 const newText = prev + inputTr;
                                 return newText.slice(-150); // Keep text manageable
                             });
                        }
                    },
                    onclose: () => {
                        setIsVoiceActive(false);
                        setShowVoiceMode(false);
                        setConnectionStatus('disconnected');
                    },
                    onerror: (e) => {
                        console.error(e);
                        setIsVoiceActive(false);
                        setShowVoiceMode(false);
                        setConnectionStatus('disconnected');
                    }
                }
            });
            sessionRef.current = sessionPromise;

        } catch (error) {
            console.error("Voice connection failed", error);
            setIsVoiceActive(false);
            setShowVoiceMode(false);
        }
    };

    const disconnectLiveSession = () => {
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
        setIsVoiceActive(false);
        setShowVoiceMode(false);
        setConnectionStatus('disconnected');
        transcriptAccumulator.current.user = "";
    };

    const toggleVoice = () => {
        if (isVoiceActive) {
            disconnectLiveSession();
        } else {
            connectLiveSession();
        }
    };

    // --- Action Functions (Print, Speak, Share) ---

    const handleSpeak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            
            // Tenta encontrar vozes femininas específicas do sistema
            const voices = window.speechSynthesis.getVoices();
            const femaleVoice = voices.find(v => 
                v.lang.includes('pt-BR') && 
                (v.name.includes('Google') || v.name.includes('Luciana') || v.name.includes('Maria') || v.name.includes('Joana'))
            ) || voices.find(v => v.lang.includes('pt-BR')); // Fallback para qualquer voz PT-BR

            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }

            // Ajuste de tom para soar mais feminino/suave se for uma voz genérica
            utterance.pitch = 1.1; 
            utterance.rate = 1.05; // Levemente mais rápido para fluidez

            window.speechSynthesis.speak(utterance);
        }
    };

    const handlePrint = (content: string, type: 'text' | 'image' | 'video') => {
        if (type === 'video') return; 
        
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert("Permita pop-ups para imprimir.");
            return;
        }
        
        const contentHtml = type === 'text' 
            ? `<div class="content text-content">${content}</div>`
            : `<img src="${content}" class="print-image" />`;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="pt-br">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Marta Output</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
                        body {
                            font-family: 'Poppins', sans-serif;
                            margin: 0;
                            padding: 20px; /* Padding for mobile */
                            background: white;
                            color: black;
                        }
                        .container {
                            max-width: 800px;
                            margin: 0 auto;
                        }
                        .header {
                            text-align: center;
                            border-bottom: 2px solid #eee;
                            padding-bottom: 20px;
                            margin-bottom: 30px;
                        }
                        .logo {
                            font-weight: 800;
                            font-size: 24px;
                            letter-spacing: -1px;
                        }
                        .meta {
                            font-size: 10px;
                            color: #666;
                            text-transform: uppercase;
                            letter-spacing: 2px;
                            margin-top: 5px;
                        }
                        .text-content {
                            font-size: 14px; /* Readable on mobile */
                            line-height: 1.8;
                            white-space: pre-wrap; /* Preserve paragraphs */
                            text-align: justify;
                        }
                        .print-image {
                            max-width: 100%;
                            height: auto;
                            display: block;
                            margin: 0 auto;
                            border-radius: 12px;
                            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                        }
                        @media print {
                            body { padding: 0; }
                            .no-print { display: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">STUDIO AI</div>
                            <div class="meta">Relatório Gerado por Marta</div>
                        </div>
                        ${contentHtml}
                    </div>
                    <script>
                        // Wait for images to load before printing
                        window.onload = () => {
                            setTimeout(() => {
                                window.print();
                                // Mobile browsers handle window.close() differently, best to leave it open or let user close
                            }, 500);
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const handleShare = async (msg: ChatMessage) => {
        try {
            if (navigator.share) {
                const shareData: any = {
                    title: 'Marta Output',
                    text: 'Confira este conteúdo gerado pela Marta.',
                };

                if (msg.type === 'text') {
                    shareData.text = msg.content;
                    await navigator.share(shareData);
                } else if (msg.type === 'image') {
                     try {
                        const response = await fetch(msg.content);
                        const blob = await response.blob();
                        const file = new File([blob], "marta_generated.jpg", { type: "image/jpeg" });
                        if (navigator.canShare && navigator.canShare({ files: [file] })) {
                            shareData.files = [file];
                            await navigator.share(shareData);
                        } else {
                             throw new Error("File share not supported");
                        }
                     } catch (e) {
                         await navigator.clipboard.writeText(msg.content);
                         alert("Link da imagem copiado!");
                     }
                } else {
                    shareData.url = msg.content;
                    await navigator.share(shareData);
                }
            } else {
                throw new Error("Web Share API not supported");
            }
        } catch (error) {
             await navigator.clipboard.writeText(msg.content);
             alert("Conteúdo copiado para a área de transferência!");
        }
    };

    const handleGenerate = async () => {
        // Se estiver gravando, para a gravação antes de enviar
        if (isVoiceActive) disconnectLiveSession();
        if (isDictating) stopDictation();

        if (!hasSecureKey) {
            await handleSecureAuth();
            if (!(await (window as any).aistudio?.hasSelectedApiKey())) return;
        }

        if (!prompt.trim() && !selectedImage) return;
        
        // Adiciona mensagem do usuário
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            type: selectedImage ? 'image' : 'text',
            content: selectedImage || prompt // Se tiver imagem, mostra ela no chat, senão mostra o texto
        };
        
        // Se tiver imagem E texto, adiciona um segundo balão para o texto
        if (selectedImage && prompt.trim()) {
             setMessages(prev => [...prev, {
                id: (Date.now() - 1).toString(), // ID ligeiramente diferente
                role: 'user',
                type: 'image',
                content: selectedImage
             }, {
                id: Date.now().toString(),
                role: 'user',
                type: 'text',
                content: prompt
             }]);
        } else {
             setMessages(prev => [...prev, userMsg]);
        }

        const currentPrompt = prompt;
        const currentImage = selectedImage;
        const currentMime = selectedImageType;

        setPrompt(""); // Limpa input
        clearAttachment(); // Limpa anexo
        setIsGenerating(true);
        
        // Mantém o foco no textarea após envio
        if(textareaRef.current) textareaRef.current.focus();

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const lowerPrompt = currentPrompt.toLowerCase();
        
        const videoKeywords = ['video', 'vídeo', 'filme', 'movie', 'clip', 'animação', 'animation'];
        const imageKeywords = ['imagem', 'image', 'foto', 'photo', 'picture', 'desenho', 'desenhe', 'draw', 'ilustração', 'pintura', 'paisagem', 'retrato'];
        
        // Se tiver imagem anexada, assumimos que é uma conversa multimodal (chat)
        const isVideo = !currentImage && videoKeywords.some(keyword => lowerPrompt.includes(keyword));
        const isImageGen = !currentImage && !isVideo && imageKeywords.some(keyword => lowerPrompt.includes(keyword));

        try {
            if (isVideo) {
                let operation = await ai.models.generateVideos({
                    model: 'veo-3.1-fast-generate-preview',
                    prompt: currentPrompt,
                    config: { numberOfVideos: 1, resolution: '720p', aspectRatio: '16:9' }
                });

                while (!operation.done) {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    operation = await ai.operations.getVideosOperation({operation: operation});
                }

                const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
                if (videoUri) {
                    const videoUrlWithKey = `${videoUri}&key=${process.env.API_KEY}`;
                    setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        role: 'model',
                        type: 'video',
                        content: videoUrlWithKey
                    }]);
                } else {
                     setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        role: 'model',
                        type: 'text',
                        content: "Não foi possível gerar o vídeo. Tente um prompt diferente."
                    }]);
                }

            } else if (isImageGen) {
                const response = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: currentPrompt,
                    config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '16:9' },
                });

                const base64EncodeString = response.generatedImages?.[0]?.image?.imageBytes;
                if (base64EncodeString) {
                    const imageUrl = `data:image/jpeg;base64,${base64EncodeString}`;
                    setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        role: 'model',
                        type: 'image',
                        content: imageUrl
                    }]);
                } else {
                    setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        role: 'model',
                        type: 'text',
                        content: "Não consegui gerar a imagem visualmente. Tente descrever com mais detalhes."
                    }]);
                }

            } else {
                // Multimodal Chat (Texto e/ou Imagem)
                // Usamos o MESMO contexto rico da voz para o chat de texto
                const textInstruction = getMartaContext();

                // Constrói histórico
                const history = messages.map(m => ({
                    role: m.role,
                    parts: [{ text: m.type === 'text' ? m.content : '[Mídia Anterior]' }]
                }));

                // Prepara a parte do conteúdo atual (Multimodal)
                const contentParts: any[] = [];
                
                if (currentImage) {
                    const base64Data = currentImage.split(',')[1];
                    contentParts.push({
                        inlineData: {
                            data: base64Data,
                            mimeType: currentMime || 'image/jpeg'
                        }
                    });
                }
                
                if (currentPrompt.trim()) {
                    contentParts.push({ text: currentPrompt });
                } else if (currentImage && !currentPrompt.trim()) {
                    // Se mandou só imagem, adiciona um prompt padrão
                    contentParts.push({ text: "Descreva esta imagem ou analise seu conteúdo." });
                }

                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview', // Modelo Multimodal
                    contents: [
                        ...history,
                        { role: 'user', parts: contentParts }
                    ],
                    config: {
                        systemInstruction: textInstruction,
                    }
                });
                
                const responseText = response.text;
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    role: 'model',
                    type: 'text',
                    content: typeof responseText === 'string' ? responseText : "Sem resposta."
                }]);
            }
        } catch (error: any) {
            console.error("Erro na geração:", error);
            let errorMsg = "Ocorreu um erro ao processar sua solicitação.";
            
            const isEntityNotFoundError = error.message?.includes('Requested entity was not found') || 
                                          error.message?.includes('404') || 
                                          error.status === 404 ||
                                          (error.error && error.error.code === 404);

            if (isEntityNotFoundError) {
                errorMsg = "O modelo solicitado não foi encontrado ou a chave não tem acesso (Erro 404). Tente reautenticar.";
                if ((window as any).aistudio && (window as any).aistudio.openSelectKey) {
                   await handleSecureAuth();
                }
            } else if (error.message?.includes('429')) {
                errorMsg = "Muitas solicitações. Aguarde um momento.";
            }

            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'model',
                type: 'text',
                content: errorMsg
            }]);
        } finally {
            setIsGenerating(false);
        }
    };

    const serviceOptions = [
        { id: 'dev', label: 'Desenvolvimento Web/App', icon: 'fas fa-code', desc: 'Sites, Landing Pages, Sistemas Web.' },
        { id: 'ai', label: 'Automação & IA', icon: 'fas fa-robot', desc: 'Chatbots, Integração de APIs, Workflows.' },
        { id: 'design', label: 'Design & Criativo', icon: 'fas fa-paint-brush', desc: 'Identidade Visual, Vídeos, UI/UX.' },
        { id: 'data', label: 'Consultoria de Dados', icon: 'fas fa-chart-pie', desc: 'Dashboards, Análise, BI.' },
    ];

    return (
        <>
            <style>{`
                @keyframes float-ghost {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float-ghost {
                    animation: float-ghost 3s ease-in-out infinite;
                }
            `}</style>

            {theme === 'dark' && <NeuralBackground />}
             {/* Header Section for Lab: Logo & Theme Toggle (Absolute) */}
             <div className="absolute top-0 left-0 right-0 p-6 z-50 flex justify-between items-center pointer-events-none">
                {/* Minimalist VG Logo - Absolute Positioned (Scrolls away) */}
                <button 
                    onClick={onBack}
                    className="text-2xl font-extrabold text-gray-900 dark:text-white transition-transform duration-300 hover:scale-105 drop-shadow-md pointer-events-auto"
                    title="Voltar"
                >
                    VG
                </button>

                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-yellow-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-all pointer-events-auto shadow-md"
                    aria-label="Toggle Theme"
                >
                    {theme === 'dark' ? (
                        <i className="fas fa-moon"></i>
                    ) : (
                        <i className="fas fa-sun text-yellow-500"></i>
                    )}
                </button>
            </div>

            {/* --- INTRO OVERLAY --- */}
            <div className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-opacity duration-1000 ease-in-out ${showIntro ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="text-center relative">
                    <div className="absolute inset-0 bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
                    <h1 className="relative text-4xl md:text-7xl font-extrabold font-montserrat tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-600 scale-100 animate-[pulse_2s_infinite]">
                        LABORATÓRIO VG
                    </h1>
                    <div className="h-0.5 w-0 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-6 rounded-full transition-all duration-[2000ms] ease-out" style={{ width: showIntro ? '100%' : '0%' }}></div>
                    <p className="text-gray-500 mt-6 text-xs uppercase tracking-[0.5em] font-mono animate-bounce">
                        Inicializando Sistemas...
                    </p>
                </div>
            </div>

            <section className={`min-h-screen pt-24 pb-20 px-4 text-gray-900 dark:text-white relative transition-colors duration-500 font-sans overflow-x-hidden ${theme === 'light' ? 'bg-white' : 'bg-transparent'}`}>
                
                {/* --- HERO SECTION DO LABORATÓRIO (INTERAÇÃO) --- */}
                <div className="max-w-4xl mx-auto mb-16 pt-6 md:pt-10 flex flex-col justify-center animate-fade-in-up min-h-[400px]">
                    
                    {/* ÁREA DE EXIBIÇÃO DE MENSAGENS (CHAT) */}
                    <div className="flex flex-col w-full transition-all duration-500 mb-8 space-y-8">
                        
                        {/* SAUDAÇÃO INICIAL (Aparece se não houver mensagens) */}
                        {messages.length === 0 && (
                            <div className="animate-fade-in-up w-full mb-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="relative w-6 h-6">
                                        <i className="fas fa-sparkles text-2xl absolute inset-0 text-blue-500"></i>
                                        <i className="fas fa-sparkles text-2xl absolute inset-0 text-blue-400 animate-pulse opacity-70"></i>
                                    </div>
                                    <h2 className="text-xl font-medium text-gray-500 dark:text-gray-400 tracking-tight">
                                        Fale com a <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-600">Marta</span>
                                    </h2>
                                </div>
                                <h1 className="text-[3rem] md:text-[4.5rem] leading-tight font-medium text-gray-900 dark:text-white tracking-tight text-left">
                                    O que vamos criar hoje?
                                </h1>
                            </div>
                        )}

                        {/* LISTA DE MENSAGENS (BALÕES) */}
                        <div className="flex flex-col gap-8 w-full">
                            {messages.map((msg) => (
                                <div 
                                    key={msg.id} 
                                    className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                                >
                                    {msg.role === 'user' ? (
                                        // Estilo para mensagem do Usuário
                                        <div className="max-w-[85%] md:max-w-[60%] p-5 rounded-3xl rounded-br-sm bg-blue-600 text-white text-lg font-light shadow-xl overflow-hidden">
                                            {msg.type === 'image' && (
                                                <img src={msg.content} alt="User upload" className="w-full h-auto rounded-xl mb-2" />
                                            )}
                                            {msg.type === 'text' && msg.content}
                                        </div>
                                    ) : (
                                        // Estilo Minimalista para a IA com Background
                                        <div className="w-full flex justify-start">
                                            <div className="max-w-[90%] md:max-w-[80%] p-6 rounded-3xl rounded-bl-none bg-gray-100 dark:bg-[#15151a]/90 border border-gray-200 dark:border-purple-500/30 backdrop-blur-md shadow-lg relative">
                                                {/* CONTEÚDO */}
                                                {msg.type === 'text' && (
                                                    <div className="prose prose-lg dark:prose-invert max-w-none text-base md:text-xl font-light leading-relaxed font-sans whitespace-pre-wrap tracking-wide text-gray-800 dark:text-gray-100 break-words">
                                                        <Typewriter text={msg.content} onTyping={scrollToBottom} />
                                                    </div>
                                                )}

                                                {msg.type === 'image' && (
                                                    <div className="flex flex-col items-center gap-6">
                                                        <div className="relative group rounded-2xl overflow-hidden shadow-2xl border border-white/10 w-full bg-black">
                                                            <img src={msg.content} alt="Gerada por IA" className="w-full h-auto object-cover max-h-[500px]" />
                                                            <a href={msg.content} download="generated-image.jpg" className="absolute bottom-4 right-4 z-20 px-4 py-2 bg-white text-black text-xs font-bold rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200">
                                                                <i className="fas fa-download mr-2"></i> DOWNLOAD
                                                            </a>
                                                        </div>
                                                    </div>
                                                )}

                                                {msg.type === 'video' && (
                                                    <div className="flex flex-col items-center gap-6">
                                                        <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 w-full bg-black">
                                                            <video controls autoPlay loop className="w-full max-h-[500px]">
                                                                <source src={msg.content} type="video/mp4" />
                                                                Seu navegador não suporta vídeos.
                                                            </video>
                                                        </div>
                                                        <p className="text-xs text-gray-600 dark:text-gray-500 font-mono text-center w-full">Gerado pela Marta Intelligence</p>
                                                    </div>
                                                )}

                                                {/* ACTION BUTTONS (Sem borda superior) */}
                                                <div className="mt-4 flex justify-end gap-3 opacity-50 hover:opacity-100 transition-opacity">
                                                    {msg.type === 'text' && (
                                                        <>
                                                            <button 
                                                                onClick={() => handleSpeak(msg.content)}
                                                                className="w-8 h-8 rounded-full bg-white dark:bg-white/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center justify-center transition-all"
                                                                title="Ouvir"
                                                            >
                                                                <i className="fas fa-volume-up text-xs"></i>
                                                            </button>
                                                            <button 
                                                                onClick={() => handlePrint(msg.content, 'text')}
                                                                className="w-8 h-8 rounded-full bg-white dark:bg-white/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center justify-center transition-all"
                                                                title="Imprimir"
                                                            >
                                                                <i className="fas fa-print text-xs"></i>
                                                            </button>
                                                        </>
                                                    )}
                                                    
                                                    {msg.type === 'image' && (
                                                         <button 
                                                            onClick={() => handlePrint(msg.content, 'image')}
                                                            className="w-8 h-8 rounded-full bg-white dark:bg-white/10 hover:bg-purple-100 dark:hover:bg-purple-500/20 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 flex items-center justify-center transition-all"
                                                            title="Imprimir Imagem"
                                                        >
                                                            <i className="fas fa-print text-xs"></i>
                                                        </button>
                                                    )}
                                                     
                                                    <button 
                                                        onClick={() => handleShare(msg)}
                                                        className="w-8 h-8 rounded-full bg-white dark:bg-white/10 hover:bg-green-100 dark:hover:bg-green-500/20 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 flex items-center justify-center transition-all"
                                                        title="Compartilhar"
                                                    >
                                                        <i className="fas fa-share-alt text-xs"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            
                            {/* INDICADOR DE DIGITAÇÃO/PROCESSAMENTO */}
                            {isGenerating && (
                                <div className="flex w-full justify-start animate-fade-in-up">
                                    <div className="bg-white/90 dark:bg-black border border-gray-200 dark:border-white/10 p-6 rounded-3xl rounded-bl-sm flex items-center gap-3">
                                        <span className="text-xs font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-600">Marta</span>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Functional Input Box - Estilo Console */}
                    <div className="w-full bg-white dark:bg-[#0a0a0a]/90 backdrop-blur-md rounded-[1.5rem] p-6 mb-8 min-h-[160px] flex flex-col justify-between hover:bg-gray-50 dark:hover:bg-[#111] transition-all duration-300 border border-gray-200 dark:border-white/10 shadow-xl dark:shadow-none relative overflow-hidden group focus-within:border-blue-500/50 z-20">
                        
                        <div className="mt-2 w-full relative">
                            {/* PREVIEW DE IMAGEM ANEXADA */}
                            {selectedImage && (
                                <div className="absolute top-0 right-0 z-50">
                                    <div className="relative group/preview inline-block">
                                        <img src={selectedImage} alt="Preview" className="h-16 w-auto rounded-lg border border-gray-200 dark:border-white/20 shadow-lg" />
                                        <button 
                                            onClick={clearAttachment}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <textarea 
                                ref={textareaRef}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleGenerate();
                                    }
                                }}
                                placeholder={isVoiceActive ? "Ouvindo... (pode falar)" : (isDictating ? "Escutando ditado..." : "Descreva sua ideia para a Marta criar...")}
                                className={`w-full bg-transparent border-none text-xl md:text-2xl text-gray-800 dark:text-gray-200 font-light focus:outline-none resize-none h-24 font-sans ${isVoiceActive || isDictating ? 'placeholder-blue-400 animate-pulse' : 'placeholder-gray-400 dark:placeholder-gray-700'}`}
                            />
                        </div>
                        
                        <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                            <div className="flex gap-2">
                                {/* INPUT FILE HIDDEN */}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={handleFileSelect} 
                                />

                                {/* BOTÃO DE ANEXAR IMAGEM (+) */}
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 transition-colors ${selectedImage ? 'bg-blue-500/20 text-blue-500' : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10'}`}
                                    title="Anexar Imagem"
                                >
                                    <i className="fas fa-plus"></i>
                                </button>

                                {/* BOTÃO DE DITADO (MICROFONE PEQUENO) */}
                                <button 
                                    onClick={toggleDictation}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                        isDictating 
                                            ? 'bg-red-500 text-white animate-pulse' 
                                            : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400'
                                    }`}
                                    title="Ditar texto"
                                >
                                    <i className={`fas ${isDictating ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                                </button>
                                
                                {/* BOTÃO LIVE (MARTA LIVE) - APENAS ÍCONE AGORA */}
                                <button 
                                    onClick={toggleVoice}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg ${
                                        isVoiceActive 
                                            ? 'bg-red-500 text-white animate-pulse shadow-red-500/30' 
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-blue-500/30 hover:scale-105'
                                    }`} 
                                    title={isVoiceActive ? "Encerrar Live" : "Iniciar Marta Live"}
                                >
                                    <i className={`fas ${isVoiceActive ? 'fa-phone-slash' : 'fa-headset'}`}></i>
                                </button>

                                {messages.length > 0 && (
                                    <button 
                                        onClick={() => setMessages([])}
                                        className="h-10 px-4 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-red-500/10 hover:text-red-500 flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm font-medium gap-2 transition-colors"
                                    >
                                        <i className="fas fa-trash"></i> Limpar
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-4 items-center">
                                 {!hasSecureKey && (
                                     <span 
                                        onClick={handleSecureAuth}
                                        className="hidden md:flex text-xs text-yellow-600 dark:text-yellow-500 items-center gap-1 cursor-pointer hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors bg-yellow-100 dark:bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-200 dark:border-yellow-500/30"
                                     >
                                         <i className="fas fa-lock"></i> Autenticar
                                     </span>
                                 )}

                                 <button 
                                    onClick={handleGenerate}
                                    disabled={(!prompt.trim() && !selectedImage && !isVoiceActive) || isGenerating}
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all shadow-lg ${
                                        prompt.trim() || selectedImage || isVoiceActive
                                            ? 'bg-gradient-to-tr from-blue-600 to-purple-600 hover:scale-105 hover:shadow-blue-500/30' 
                                            : 'bg-gray-200 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                    }`}
                                >
                                    {isGenerating ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-arrow-up"></i>}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Action Chips - Dark Themed */}
                    <div className="flex gap-3 overflow-x-auto w-full pb-4 no-scrollbar">
                        <button 
                            onClick={() => { setPrompt("Escreva um Ebook curto, minimalista e sofisticado sobre o tema: "); document.querySelector('textarea')?.focus(); }}
                            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white dark:bg-[#0a0a0a]/80 backdrop-blur-md hover:bg-gray-100 dark:hover:bg-white/10 transition-all whitespace-nowrap min-w-max border border-gray-200 dark:border-white/10 shadow-sm hover:border-orange-500/30 group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                                <i className="fas fa-book-open text-orange-600 dark:text-orange-400"></i>
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Criar Ebook</span>
                        </button>

                        <button 
                            onClick={() => { setPrompt("Aja como uma Contadora Expert. Explique de forma clara, direta e sem burocracia: "); document.querySelector('textarea')?.focus(); }}
                            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white dark:bg-[#0a0a0a]/80 backdrop-blur-md hover:bg-gray-100 dark:hover:bg-white/10 transition-all whitespace-nowrap min-w-max border border-gray-200 dark:border-white/10 shadow-sm hover:border-teal-500/30 group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-500/10 flex items-center justify-center group-hover:bg-teal-500/20 transition-colors">
                                <i className="fas fa-calculator text-teal-600 dark:text-teal-400"></i>
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Modo Contador</span>
                        </button>

                        <button 
                            onClick={() => { setPrompt("Crie uma imagem de "); document.querySelector('textarea')?.focus(); }}
                            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white dark:bg-[#0a0a0a]/80 backdrop-blur-md hover:bg-gray-100 dark:hover:bg-white/10 transition-all whitespace-nowrap min-w-max border border-gray-200 dark:border-white/10 shadow-sm hover:border-yellow-500/30 group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                                <i className="fas fa-image text-yellow-600 dark:text-yellow-400"></i>
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Criar imagem</span>
                        </button>

                        <button 
                            onClick={() => { setPrompt("Gere um video de "); document.querySelector('textarea')?.focus(); }}
                            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white dark:bg-[#0a0a0a]/80 backdrop-blur-md hover:bg-gray-100 dark:hover:bg-white/10 transition-all whitespace-nowrap min-w-max border border-gray-200 dark:border-white/10 shadow-sm hover:border-green-500/30 group"
                        >
                             <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                                <i className="fas fa-play text-green-600 dark:text-green-400"></i>
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Criar vídeo</span>
                        </button>

                        <button 
                            onClick={() => setActiveTab('estudos')}
                            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white dark:bg-[#0a0a0a]/80 backdrop-blur-md hover:bg-gray-100 dark:hover:bg-white/10 transition-all whitespace-nowrap min-w-max border border-gray-200 dark:border-white/10 shadow-sm hover:border-red-500/30 group"
                        >
                             <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                                <i className="fas fa-graduation-cap text-red-500 dark:text-red-400"></i>
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Estudos</span>
                        </button>
                    </div>

                    {/* --- SHOWCASE SECTION --- */}
                    <div className="mt-16 w-full animate-fade-in-up bg-white/50 dark:bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-gray-200 dark:border-white/5">
                        
                        {/* CATEGORY: IMAGENS */}
                        <div className="mb-12">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                <i className="fas fa-image text-blue-500"></i> Imagens Geradas
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {LAB_IMAGES.slice(0, 4).map(img => (
                                    <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer">
                                        <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">{img.title}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CATEGORY: VIDEOS & SITES */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                            {/* Videos */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                    <i className="fas fa-video text-pink-500"></i> Produção de Vídeo
                                </h3>
                                <div className="space-y-4">
                                    {LAB_VIDEOS.slice(0, 2).map(video => (
                                        <div key={video.id} className="flex gap-4 items-center bg-white dark:bg-white/5 p-3 rounded-xl border border-gray-200 dark:border-white/10 hover:border-pink-500/50 transition-colors cursor-pointer group">
                                            <div className="w-24 h-16 rounded-lg overflow-hidden relative flex-shrink-0">
                                                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                    <i className="fas fa-play text-white text-xs"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-pink-500 transition-colors">{video.title}</h4>
                                                <p className="text-xs text-gray-500 line-clamp-1">{video.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sites/Web */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                    <i className="fas fa-globe text-green-500"></i> Web & Sistemas
                                </h3>
                                <div className="space-y-4">
                                    {PROJECTS.slice(0, 2).map(proj => (
                                        <a href={proj.link} target="_blank" key={proj.title} className="flex gap-4 items-center bg-white dark:bg-white/5 p-3 rounded-xl border border-gray-200 dark:border-white/10 hover:border-green-500/50 transition-colors cursor-pointer group block">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center flex-shrink-0 text-gray-500 group-hover:text-green-500 transition-colors">
                                                <i className="fas fa-code"></i>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-green-500 transition-colors">{proj.title}</h4>
                                                <p className="text-xs text-gray-500 line-clamp-1">{proj.description}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* CATEGORY: CONTEÚDO (ARTIGOS/EBOOKS) */}
                        <div className="mb-16">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                <i className="fas fa-book-open text-orange-500"></i> Artigos & Ebooks
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {POSTS.slice(0, 3).map(post => (
                                    <div key={post.id} className="bg-white dark:bg-white/5 p-5 rounded-2xl border border-gray-200 dark:border-white/10 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer">
                                        <span className="text-[10px] uppercase tracking-wider text-orange-500 font-bold mb-2 block">{post.category}</span>
                                        <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{post.title}</h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3">{post.excerpt}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PRICING PLANS */}
                        <div className="bg-gray-900 dark:bg-white/5 rounded-3xl p-8 md:p-12 border border-gray-800 dark:border-white/10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            
                            <div className="text-center mb-10 relative z-10">
                                <h2 className="text-3xl font-extrabold text-white mb-4">Contrate a Inteligência</h2>
                                <p className="text-gray-400 text-sm max-w-lg mx-auto">Leve a Marta para o seu negócio. Automação, atendimento e vendas em um único núcleo.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                {/* Plan 1 */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                                    <h3 className="text-xl font-bold text-white mb-1">NEXUS START</h3>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-2xl font-bold text-blue-400">R$ 499</span>
                                        <span className="text-xs text-gray-500">/mês</span>
                                    </div>
                                    <ul className="space-y-3 mb-6">
                                        <li className="flex items-center gap-2 text-xs text-gray-300"><i className="fas fa-check text-blue-500"></i> Atendimento 24/7</li>
                                        <li className="flex items-center gap-2 text-xs text-gray-300"><i className="fas fa-check text-blue-500"></i> Triagem de Leads</li>
                                        <li className="flex items-center gap-2 text-xs text-gray-300"><i className="fas fa-check text-blue-500"></i> Integração WhatsApp</li>
                                    </ul>
                                    <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors">
                                        Começar Agora
                                    </button>
                                </div>

                                {/* Plan 2 */}
                                <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/50 transition-colors">
                                    <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
                                    <h3 className="text-xl font-bold text-white mb-1">SYNAPSE PRO</h3>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-2xl font-bold text-purple-400">R$ 990</span>
                                        <span className="text-xs text-gray-500">/mês</span>
                                    </div>
                                    <ul className="space-y-3 mb-6">
                                        <li className="flex items-center gap-2 text-xs text-gray-300"><i className="fas fa-check text-purple-500"></i> Tudo do Nexus</li>
                                        <li className="flex items-center gap-2 text-xs text-gray-300"><i className="fas fa-check text-purple-500"></i> Vendas & Checkout</li>
                                        <li className="flex items-center gap-2 text-xs text-gray-300"><i className="fas fa-check text-purple-500"></i> Voice Mode Nativo</li>
                                    </ul>
                                    <button className="w-full py-3 rounded-xl bg-white text-black hover:bg-gray-200 text-sm font-bold transition-colors">
                                        Falar com Consultor
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
            
            {/* --- MARTA GHOST ORB UI (MODO FLUTUANTE) --- */}
            {showVoiceMode && (
                <div className="fixed bottom-8 right-8 z-[70] flex flex-col items-end pointer-events-none">
                    
                    {/* Transcript Floating Bubble */}
                    {liveTranscript && (
                        <div className="mb-6 mr-4 max-w-[220px] bg-black/70 backdrop-blur-md border border-white/20 p-4 rounded-2xl rounded-br-none text-xs font-light text-white leading-relaxed shadow-lg animate-fade-in-up pointer-events-auto relative">
                            {liveTranscript}
                            <div className="absolute -bottom-2 right-0 w-4 h-4 bg-black/70 border-r border-b border-white/20 transform rotate-45"></div>
                        </div>
                    )}

                    {/* The Ghost Orb Container */}
                    <div className="relative group pointer-events-auto">
                        
                        {/* THE ORB */}
                        <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-500 animate-float-ghost ${
                            connectionStatus === 'speaking' ? 'scale-110' : 'scale-100'
                        }`}>
                            {/* Outer Glow / Aura */}
                            <div className={`absolute inset-0 rounded-full blur-xl transition-colors duration-500 ${
                                connectionStatus === 'speaking' ? 'bg-blue-500 opacity-60' :
                                connectionStatus === 'listening' ? 'bg-green-500 opacity-40' :
                                'bg-gray-500 opacity-20'
                            }`}></div>

                            {/* Core Sphere */}
                            <div className={`absolute inset-2 rounded-full border-2 bg-gradient-to-br backdrop-blur-md shadow-inner transition-all duration-500 overflow-hidden ${
                                connectionStatus === 'speaking' ? 'from-blue-600 to-cyan-400 border-blue-300 shadow-[0_0_30px_rgba(59,130,246,0.6)]' :
                                connectionStatus === 'listening' ? 'from-green-600 to-emerald-400 border-green-300 shadow-[0_0_20px_rgba(16,185,129,0.4)]' :
                                'from-gray-800 to-black border-white/20'
                            }`}>
                                {/* Inner Fluid Animation (CSS) */}
                                <div className={`absolute inset-0 opacity-50 ${
                                    connectionStatus === 'speaking' ? 'bg-blue-300 mix-blend-overlay animate-pulse' : 
                                    connectionStatus === 'listening' ? 'bg-green-300 mix-blend-overlay animate-pulse' : 
                                    'hidden'
                                }`}></div>
                            </div>

                            {/* Expanding Rings (Sonar Effect) */}
                            {connectionStatus === 'speaking' && (
                                <>
                                    <div className="absolute inset-0 rounded-full border border-blue-400/50 animate-ping opacity-75"></div>
                                    <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping delay-100 opacity-50"></div>
                                </>
                            )}
                            {connectionStatus === 'listening' && (
                                <div className="absolute inset-0 rounded-full border border-green-400/30 animate-pulse opacity-50"></div>
                            )}
                        </div>

                        {/* Orbiting Controls (Show on Hover or Always small) */}
                        <div className="absolute -left-12 bottom-0 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4 group-hover:translate-x-0">
                            <button 
                                onClick={toggleMute}
                                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg border backdrop-blur-md transition-all hover:scale-110 ${isMuted ? 'bg-red-500/80 border-red-400 text-white' : 'bg-black/60 border-white/20 text-white hover:bg-white/20'}`}
                                title={isMuted ? "Ativar som" : "Mutar"}
                            >
                                <i className={`fas ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'} text-xs`}></i>
                            </button>

                            <button 
                                onClick={() => { setShowVoiceMode(false); setIsVoiceActive(false); disconnectLiveSession(); }}
                                className="w-10 h-10 rounded-full bg-black/60 border border-white/20 text-red-400 flex items-center justify-center shadow-lg backdrop-blur-md transition-all hover:bg-red-500 hover:text-white hover:border-red-500 hover:scale-110"
                                title="Encerrar"
                            >
                                <i className="fas fa-phone-slash text-xs"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LabPage;
