import React, { useEffect, useRef } from 'react';

const SoundWaveBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Wave {
            yOffset: number;
            color: string;
            amplitude: number;
            frequency: number;
            speed: number;
            points: { x: number; y: number }[];

            constructor(yOffset: number, color: string, amplitude: number, frequency: number, speed: number) {
                this.yOffset = yOffset;
                this.color = color;
                this.amplitude = amplitude;
                this.frequency = frequency;
                this.speed = speed;
                this.points = [];
            }

            draw(t: number) {
                if (!ctx || !canvas) return;
                
                this.points = [];
                // Quantidade de pontos baseada na largura (menos pontos = linhas mais retas, mais pontos = curvas suaves)
                const pointCount = Math.ceil(canvas.width / 15); 

                ctx.beginPath();
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 1.5;

                for (let i = 0; i <= pointCount; i++) {
                    const x = (i / pointCount) * canvas.width;
                    
                    // Cria um "Envelope" para que a onda seja maior no centro e suma nas bordas
                    const distanceFromCenter = Math.abs(x - canvas.width / 2);
                    const envelope = Math.max(0, 1 - (distanceFromCenter / (canvas.width * 0.5))); 
                    
                    // Adiciona ruído para parecer uma "voz" ou mensagem criptografada, não apenas uma senoide perfeita
                    const noise = Math.sin(i * 0.3 + t * 3) * 0.3 + Math.cos(i * 0.8 - t) * 0.2;
                    
                    const y = this.yOffset + 
                              Math.sin(i * this.frequency + t * this.speed) * (this.amplitude + (noise * 20)) * envelope;

                    this.points.push({ x, y });
                    
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();

                // Desenhar as partículas (nós) conectadas pelo fio
                ctx.fillStyle = this.color.replace('0.5)', '1)'); // Mais opaco para os pontos
                
                // Desenha apenas alguns pontos para criar o efeito de "dados viajando"
                const particleDensity = 3; // Desenha a cada X pontos
                
                this.points.forEach((point, index) => {
                    if (index % particleDensity === 0) {
                        // Varia o tamanho do ponto baseado na amplitude local para dar vida
                        const size = 1.5 + Math.sin(t * 5 + index) * 0.5;
                        
                        ctx.beginPath();
                        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
            }
        }

        const waves: Wave[] = [];
        const initWaves = () => {
            waves.length = 0;
            const centerY = canvas.height / 2;
            
            // Onda 1: Ciano (Frequência média)
            waves.push(new Wave(centerY, 'rgba(0, 204, 255, 0.4)', 60, 0.1, 0.05));
            
            // Onda 2: Magenta/Roxo (Frequência mais alta, defasada)
            waves.push(new Wave(centerY, 'rgba(180, 50, 255, 0.4)', 50, 0.15, -0.03));
            
            // Onda 3: Branco/Brilho (Frequência baixa, movimento lento)
            waves.push(new Wave(centerY, 'rgba(255, 255, 255, 0.2)', 80, 0.05, 0.02));
        };

        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Time step
            time += 0.05;

            // Global composite operation para fazer as cores brilharem quando se cruzam
            ctx.globalCompositeOperation = 'screen';
            
            waves.forEach(wave => wave.draw(time));
            
            ctx.globalCompositeOperation = 'source-over';

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', () => {
            resizeCanvas();
            initWaves();
        });

        resizeCanvas();
        initWaves();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
            style={{ opacity: 0.7 }}
        />
    );
};

export default SoundWaveBackground;