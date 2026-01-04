import React, { useEffect, useRef } from 'react';

const CanvasBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particlesArray: Particle[] = [];
        const colors = ["#0066ff", "#00ccff", "#ff5e7d", "#ffcc00"];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        class Particle {
            x: number;
            y: number;
            size: number;
            color: string;
            speedX: number;
            speedY: number;
            angle: number;
            va: number;

            constructor(x: number, y: number, size: number, color: string, speedX: number, speedY: number) {
                this.x = x;
                this.y = y;
                this.size = size;
                this.color = color;
                this.speedX = speedX;
                this.speedY = speedY;
                this.angle = Math.random() * Math.PI * 2;
                this.va = Math.random() * 0.1 - 0.05;
            }

            update() {
                this.x += this.speedX * Math.cos(this.angle);
                this.y += this.speedY * Math.sin(this.angle);
                this.angle += this.va;

                if (canvas) {
                    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
                }
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        const initParticles = () => {
            const numberOfParticles = window.innerWidth < 768 ? 80 : 150;
            particlesArray = [];

            if (!canvas) return;

            for (let i = 0; i < numberOfParticles; i++) {
                const size = Math.random() * 3 + 1;
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const speedX = (Math.random() - 0.5) * 0.5;
                const speedY = (Math.random() - 0.5) * 0.5;

                particlesArray.push(new Particle(x, y, size, color, speedX, speedY));
            }
        };

        const connectParticles = () => {
            const maxDistance = 120;
            if (!ctx) return;

            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    const dx = particlesArray[a].x - particlesArray[b].x;
                    const dy = particlesArray[a].y - particlesArray[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        const opacity = 1 - distance / maxDistance;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(128, 128, 128, ${opacity * 0.15})`; // Greyish connection for better visibility in both modes
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animateParticles = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particlesArray.forEach((particle) => {
                particle.update();
                particle.draw();
            });

            connectParticles();
            animationFrameId = requestAnimationFrame(animateParticles);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animateParticles();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-10 dark:opacity-40 opacity-20 pointer-events-none transition-opacity duration-500"
        />
    );
};

export default CanvasBackground;