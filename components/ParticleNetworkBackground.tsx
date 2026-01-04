import React, { useEffect, useRef } from 'react';

interface Ball {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    alpha: number;
    phase: number;
    type?: string;
}

const ParticleNetworkBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Configurações das Partículas
        const BALL_NUM = window.innerWidth < 768 ? 20 : 45;
        const R = 2;
        const ball_color = { r: 60, g: 160, b: 255 }; // Azul Tech
        const line_color = "150, 150, 150";
        const alpha_f = 0.03;
        const link_line_width = 0.8;
        const dis_limit = 260;
        
        let balls: Ball[] = [];
        let mouse_in = false;
        let mouse_ball: Ball = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            r: 0,
            alpha: 1,
            phase: 0,
            type: 'mouse'
        };

        let animationFrameId: number;
        let time = 0;

        // Funções Auxiliares Matemáticas
        const randomNumFrom = (min: number, max: number) => Math.random() * (max - min) + min;
        const randomSidePos = (length: number) => Math.ceil(Math.random() * length);
        const randomArrayItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

        const getRandomSpeed = (pos: string) => {
            const min = -0.5;
            const max = 0.5;
            switch (pos) {
                case 'top': return [randomNumFrom(min, max), randomNumFrom(0.1, max)];
                case 'right': return [randomNumFrom(min, -0.1), randomNumFrom(min, max)];
                case 'bottom': return [randomNumFrom(min, max), randomNumFrom(min, -0.1)];
                case 'left': return [randomNumFrom(0.1, max), randomNumFrom(min, max)];
                default: return [0, 0];
            }
        };

        const getRandomBall = (): Ball => {
            const pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
            const width = canvas.width;
            const height = canvas.height;
            
            switch (pos) {
                case 'top':
                    return {
                        x: randomSidePos(width),
                        y: -R,
                        vx: getRandomSpeed('top')[0],
                        vy: getRandomSpeed('top')[1],
                        r: R,
                        alpha: 1,
                        phase: randomNumFrom(0, 10)
                    };
                case 'right':
                    return {
                        x: width + R,
                        y: randomSidePos(height),
                        vx: getRandomSpeed('right')[0],
                        vy: getRandomSpeed('right')[1],
                        r: R,
                        alpha: 1,
                        phase: randomNumFrom(0, 10)
                    };
                case 'bottom':
                    return {
                        x: randomSidePos(width),
                        y: height + R,
                        vx: getRandomSpeed('bottom')[0],
                        vy: getRandomSpeed('bottom')[1],
                        r: R,
                        alpha: 1,
                        phase: randomNumFrom(0, 10)
                    };
                case 'left':
                    return {
                        x: -R,
                        y: randomSidePos(height),
                        vx: getRandomSpeed('left')[0],
                        vy: getRandomSpeed('left')[1],
                        r: R,
                        alpha: 1,
                        phase: randomNumFrom(0, 10)
                    };
                default:
                    return { x: 0, y: 0, vx: 0, vy: 0, r: R, alpha: 1, phase: 0 };
            }
        };

        const renderBalls = () => {
            balls.forEach(b => {
                if (!b.type) {
                    ctx.fillStyle = `rgba(${ball_color.r},${ball_color.g},${ball_color.b},${b.alpha})`;
                    ctx.beginPath();
                    ctx.arc(b.x, b.y, R, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.fill();
                }
            });
        };

        const updateBalls = () => {
            const new_balls: Ball[] = [];
            balls.forEach(b => {
                b.x += b.vx;
                b.y += b.vy;

                if (b.x > -50 && b.x < canvas.width + 50 && b.y > -50 && b.y < canvas.height + 50) {
                    new_balls.push(b);
                }

                // alpha change
                b.phase += alpha_f;
                b.alpha = Math.abs(Math.cos(b.phase));
            });

            balls = new_balls.slice(0);
        };

        const getDisOf = (b1: Ball, b2: Ball) => {
            const delta_x = Math.abs(b1.x - b2.x);
            const delta_y = Math.abs(b1.y - b2.y);
            return Math.sqrt(delta_x * delta_x + delta_y * delta_y);
        };

        const renderLines = () => {
            let fraction, alpha;
            for (let i = 0; i < balls.length; i++) {
                for (let j = i + 1; j < balls.length; j++) {
                    fraction = getDisOf(balls[i], balls[j]) / dis_limit;

                    if (fraction < 1) {
                        alpha = (1 - fraction).toString();
                        ctx.strokeStyle = `rgba(${line_color},${alpha})`;
                        ctx.lineWidth = link_line_width;

                        ctx.beginPath();
                        ctx.moveTo(balls[i].x, balls[i].y);
                        ctx.lineTo(balls[j].x, balls[j].y);
                        ctx.stroke();
                        ctx.closePath();
                    }
                }
            }
        };

        const addBallIfy = () => {
            if (balls.length < BALL_NUM) {
                balls.push(getRandomBall());
            }
        };

        const render = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            time += 0.05;

            // Desenha as partículas por cima
            renderBalls();
            renderLines();
            updateBalls();
            addBallIfy();

            animationFrameId = requestAnimationFrame(render);
        };

        // Inicialização
        const initBalls = (num: number) => {
            balls = [];
            for (let i = 1; i <= num; i++) {
                balls.push({
                    x: randomSidePos(canvas.width),
                    y: randomSidePos(canvas.height),
                    vx: getRandomSpeed('top')[0],
                    vy: getRandomSpeed('top')[1],
                    r: R,
                    alpha: 1,
                    phase: randomNumFrom(0, 10)
                });
            }
        };

        const initCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        // Event Listeners
        const handleResize = () => {
            initCanvas();
        };

        const handleMouseEnter = () => {
            mouse_in = true;
            balls.push(mouse_ball);
        };

        const handleMouseLeave = () => {
            mouse_in = false;
            balls = balls.filter(b => !b.type);
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse_ball.x = e.clientX - rect.left;
            mouse_ball.y = e.clientY - rect.top;
        };

        window.addEventListener('resize', handleResize);
        canvas.addEventListener('mouseenter', handleMouseEnter);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        canvas.addEventListener('mousemove', handleMouseMove);

        initCanvas();
        initBalls(BALL_NUM);
        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            if (canvas) {
                canvas.removeEventListener('mouseenter', handleMouseEnter);
                canvas.removeEventListener('mouseleave', handleMouseLeave);
                canvas.removeEventListener('mousemove', handleMouseMove);
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full z-0 opacity-60 pointer-events-auto mix-blend-screen"
            style={{ background: 'transparent' }} 
        />
    );
};

export default ParticleNetworkBackground;