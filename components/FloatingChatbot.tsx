
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

const FloatingChatbot: React.FC = () => {
    // UI State
    const [isOpen, setIsOpen] = useState(false);
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connected' | 'speaking' | 'listening'>('disconnected');
    
    // Chat State
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Olá! Sou a Marta. Conheço todo este portfólio. Como posso te ajudar de forma objetiva?", isUser: false }
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Audio Refs
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const sessionRef = useRef<any>(null); 
    const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    
    // Transcription Accumulator
    const transcriptAccumulator = useRef({ user: "", model: "" });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen && !isVoiceMode) {
            scrollToBottom();
        }
    }, [messages, isOpen, isVoiceMode, isTyping]);

    // Limpeza ao desmontar
    useEffect(() => {
        return () => {
            stopVoiceSession();
        };
    }, []);

    const getSystemContext = () => {
        const fullSiteKnowledge = {
            owner: "Vandilson Gomes",
            role: "Especialista CX e Desenvolvedor Fullstack",
            bio: "Transforma ideias em realidade através do código. Especialista em Experiência do Cliente.",
            contact: {
                whatsapp: "+55 11 99450-2134",
                location: "São Paulo, Brasil"
            },
            
            // CONTEÚDO DINÂMICO DOS CONSTANTS (Resumo)
            portfolio: {
                "Marta AI": "IA de Vendas e Atendimento.",
                "BOLHA": "CRM de Dados.",
                "SpaceArte": "App para artistas.",
                "SEES": "Soluções Digitais."
            },
            
            plans: [
                { name: "NEXUS START", price: "R$ 499" },
                { name: "SYNAPSE PRO", price: "R$ 990" }
            ],

            navigation_guide: "Você pode navegar pelo site usando o menu superior. Visite o 'Laboratório' para testar IAs generativas ou 'Studio AI' para conhecer a Marta."
        };

        return `
            Você é a Marta, a IA Concierge do site do Vandilson Gomes.
            
            BASE DE DADOS:
            ${JSON.stringify(fullSiteKnowledge)}

            DIRETRIZES:
            1. OBJETIVIDADE: Respostas curtas (max 2 frases).
            2. GUIA: Se perguntarem onde encontrar algo, diga exatamente onde clicar.
            3. VENDAS: Se demonstrarem interesse, fale dos planos Nexus/Synapse e sugira contato via WhatsApp.
            4. PERSONALIDADE: Útil, tecnológica e eficiente.
        `;
    };

    // --- Voice Session Logic ---

    const startVoiceSession = async () => {
        if (isConnecting || connectionStatus === 'connected') return;

        // Security Check: Ensure API Key is selected
        if ((window as any).aistudio && (window as any).aistudio.hasSelectedApiKey) {
            const hasKey = await (window as any).aistudio.hasSelectedApiKey();
            if (!hasKey) {
                try {
                     await (window as any).aistudio.openSelectKey();
                     if (!(await (window as any).aistudio.hasSelectedApiKey())) return;
                } catch (e) { console.error("Key selection failed", e); return; }
            }
        }

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
                        console.log("Marta: Voz Conectada");
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
                            for(let i=0; i<int16.length; i++) {
                                float32[i] = int16[i] / 32768.0;
                            }
                            const buffer = audioCtx.createBuffer(1, float32.length, 24000);
                            buffer.getChannelData(0).set(float32);
                            const source = audioCtx.createBufferSource();
                            source.buffer = buffer;
                            source.connect(audioCtx.destination);
                            const now = audioCtx.currentTime;
                            if (nextStartTimeRef.current < now) {
                                nextStartTimeRef.current = now;
                            }
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += buffer.duration;
                            source.onended = () => {
                                activeSourcesRef.current.delete(source);
                                if (activeSourcesRef.current.size === 0) {
                                    setConnectionStatus('listening');
                                }
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
                        console.error("Marta Error:", e);
                        setConnectionStatus('disconnected');
                        setIsConnecting(false);
                    }
                }
            });
            sessionRef.current = sessionPromise;
        } catch (error) {
            console.error("Falha ao iniciar modo voz:", error);
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

    const toggleVoiceMode = () => {
        if (isVoiceMode) {
            stopVoiceSession();
            setIsVoiceMode(false);
        } else {
            setIsVoiceMode(true);
            startVoiceSession();
        }
    };

    // --- Text Chat Logic ---

    const handleTextSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

         // Security Check: Ensure API Key is selected
         if ((window as any).aistudio && (window as any).aistudio.hasSelectedApiKey) {
            const hasKey = await (window as any).aistudio.hasSelectedApiKey();
            if (!hasKey) {
                try {
                     await (window as any).aistudio.openSelectKey();
                     if (!(await (window as any).aistudio.hasSelectedApiKey())) return;
                } catch (e) { console.error("Key selection failed", e); return; }
            }
        }

        const userText = input;
        const userMsg: Message = { id: Date.now(), text: userText, isUser: true };
        
        setMessages(prev => [...prev, userMsg]);
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
                    temperature: 0.7,
                }
            });

            const aiResponseText = response.text || "Sem resposta.";
            const aiMsg: Message = { id: Date.now() + 1, text: aiResponseText, isUser: false };
            setMessages(prev => [...prev, aiMsg]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { id: Date.now(), text: "Erro ao conectar.", isUser: false }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end pointer-events-auto">
            
            {/* Chat Window */}
            <div 
                className={`
                    mb-4 w-[90vw] max-w-[350px] bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-right flex flex-col relative
                    ${isOpen ? 'opacity-100 scale-100 translate-y-0 h-[500px]' : 'opacity-0 scale-90 translate-y-10 pointer-events-none h-0'}
                `}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-800 p-4 flex items-center justify-between shrink-0 z-20 relative">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/20 relative overflow-hidden">
                            {isVoiceMode ? (
                                <i className="fas fa-microphone-lines text-white text-xs z-10 animate-pulse"></i>
                            ) : (
                                <i className="fas fa-map-marked-alt text-white text-xs z-10"></i>
                            )}
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-sm">Marta</h3>
                            <p className="text-blue-200 text-xs flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${connectionStatus === 'disconnected' ? 'bg-green-400' : 'bg-red-500'} animate-pulse`}></span> 
                                {isVoiceMode ? 'Modo Voz' : 'Navegação'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* Voice Toggle */}
                        <button 
                            onClick={toggleVoiceMode}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isVoiceMode ? 'bg-white text-blue-600' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            title={isVoiceMode ? "Voltar ao Chat" : "Conversar por Voz"}
                        >
                            <i className={`fas ${isVoiceMode ? 'fa-keyboard' : 'fa-microphone'}`}></i>
                        </button>
                        
                        <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                {/* --- CONTENT AREA SWITCHER --- */}
                
                {isVoiceMode ? (
                    // --- VOICE INTERFACE ---
                    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                        {/* Background Effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-black"></div>
                        
                        <div className="relative z-10 flex flex-col items-center gap-8">
                            <div className="relative">
                                {/* Central Orb */}
                                <div className={`w-32 h-32 rounded-full blur-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                                    connectionStatus === 'speaking' ? 'bg-blue-500 opacity-60 scale-150' : 
                                    connectionStatus === 'listening' ? 'bg-purple-500 opacity-40 scale-125' : 
                                    'bg-gray-500 opacity-20 scale-100'
                                }`}></div>
                                
                                <div className={`w-24 h-24 rounded-full border-2 border-white/20 flex items-center justify-center relative backdrop-blur-sm transition-all duration-500 ${
                                    connectionStatus === 'speaking' ? 'scale-110 border-blue-400/50 shadow-[0_0_50px_rgba(59,130,246,0.5)]' :
                                    connectionStatus === 'listening' ? 'scale-100 border-purple-400/50 shadow-[0_0_30px_rgba(168,85,247,0.3)]' :
                                    'scale-90 border-gray-600'
                                }`}>
                                    <i className={`fas fa-microphone text-3xl transition-colors duration-300 ${
                                        connectionStatus === 'speaking' ? 'text-blue-400' :
                                        connectionStatus === 'listening' ? 'text-purple-400' :
                                        'text-gray-500'
                                    }`}></i>
                                    
                                    {/* Ripple Rings */}
                                    {connectionStatus !== 'disconnected' && (
                                        <>
                                            <div className="absolute inset-0 rounded-full border border-white/10 animate-ping-slow"></div>
                                            <div className="absolute inset-0 rounded-full border border-white/5 animate-ping-slower delay-300"></div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold text-white tracking-wider font-montserrat">
                                    {connectionStatus === 'speaking' ? 'Marta falando...' : 
                                     connectionStatus === 'listening' ? 'Ouvindo você...' : 
                                     isConnecting ? 'Conectando...' : 'Diga, Olá Marta'}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {connectionStatus === 'speaking' ? 'Escute a explicação' : 
                                     connectionStatus === 'listening' ? 'Pergunte sobre o site' : 
                                     'Aguardando conexão...'}
                                </p>
                            </div>
                        </div>

                        {/* Waveform Visual (Fake/CSS based on state for simplicity in React component) */}
                        <div className="absolute bottom-10 left-0 w-full flex justify-center items-end gap-1 h-12 px-8">
                             {[...Array(20)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`w-1 bg-white/30 rounded-full transition-all duration-150 ${
                                        connectionStatus === 'speaking' ? 'animate-wave bg-blue-400' :
                                        connectionStatus === 'listening' ? 'animate-wave-slow bg-purple-400' :
                                        'h-1'
                                    }`}
                                    style={{ 
                                        animationDelay: `${i * 0.05}s`,
                                        height: connectionStatus === 'disconnected' ? '4px' : undefined
                                    }}
                                ></div>
                             ))}
                        </div>
                    </div>
                ) : (
                    // --- TEXT INTERFACE (Existing) ---
                    <>
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40 scrollbar-thin scrollbar-thumb-gray-700">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-md ${
                                        msg.isUser 
                                            ? 'bg-blue-600 text-white rounded-br-none shadow-blue-900/20' 
                                            : 'bg-gray-800 text-gray-100 rounded-bl-none border border-white/10'
                                    }`}>
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
                                    <div className="bg-gray-800 p-3 rounded-2xl rounded-bl-none border border-white/10 flex gap-1 items-center h-10 w-16 justify-center">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-75"></span>
                                        <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce delay-150"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleTextSend} className="p-3 bg-gray-900 border-t border-white/10 flex gap-2 shrink-0">
                            <input 
                                type="text" 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Pergunte sobre projetos ou planos..."
                                className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder-gray-500"
                            />
                            <button 
                                type="submit" 
                                disabled={!input.trim() || isTyping}
                                className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
                            >
                                {isTyping ? (
                                    <i className="fas fa-spinner fa-spin text-xs"></i>
                                ) : (
                                    <i className="fas fa-paper-plane text-xs"></i>
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>

            {/* Speech Bubble Tooltip - Only show when closed */}
            {!isOpen && (
                <div className="absolute bottom-4 right-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg border border-gray-100 dark:border-white/10 whitespace-nowrap animate-bounce flex items-center">
                    Fale com a Marta
                    <div className="absolute top-1/2 -right-1 w-2 h-2 bg-white dark:bg-gray-800 border-t border-r border-gray-100 dark:border-white/10 transform -translate-y-1/2 rotate-45"></div>
                </div>
            )}

            {/* Floating Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-110 z-50 relative overflow-hidden group
                    ${isOpen ? 'bg-gray-800 text-white rotate-90' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-purple-500/50'}
                `}
            >
                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 transition-all duration-1000 group-hover:left-[100%]"></div>
                
                {isOpen ? (
                    <i className="fas fa-times text-xl relative z-10"></i>
                ) : (
                    <i className="fas fa-sparkles text-2xl animate-pulse relative z-10"></i>
                )}
            </button>
            
            <style>{`
                @keyframes wave {
                    0%, 100% { height: 4px; }
                    50% { height: 24px; }
                }
                @keyframes wave-slow {
                    0%, 100% { height: 4px; opacity: 0.5; }
                    50% { height: 16px; opacity: 1; }
                }
                .animate-wave {
                    animation: wave 1s ease-in-out infinite;
                }
                .animate-wave-slow {
                    animation: wave-slow 2s ease-in-out infinite;
                }
                .animate-ping-slow {
                    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                .animate-ping-slower {
                    animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
            `}</style>
        </div>
    );
};

export default FloatingChatbot;
