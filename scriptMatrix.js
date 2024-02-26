const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Symbol {
    constructor(x, y, fontSize, canvasheight){
        // this.charecters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.charecters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-_=+[{]}\|;:,<.>/?';
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.text = '';
        this.canvasheight = canvasheight;
    }
    draw(context){
        this.text = this.charecters.charAt(Math.floor(Math.random()*this.charecters.length));
        context.fillStyle = '#0aff0a';
        context.fillText(this.text, this.x*this.fontSize, this.y*this.fontSize);
        if (this.y*this.fontSize > this.canvasheight && Math.random() > 0.95){
            this.y = 0;
        }else{
            this.y += 1;
        }
    }
}

class Effect {
    constructor(canvaswidth, canvasheight){
        this.canvaswidth = canvaswidth;
        this.canvasheight = canvasheight;
        this.fontSize = 20;
        this.columns = this.canvaswidth/this.fontSize;
        this.symbols = [];
        this.#initialize();

    }
    #initialize(){
        for (let i = 0; i<this.columns; i++){
            this.symbols[i] = new Symbol(i, 0, this.fontSize, this.canvasheight);
        }

    }
}

const effect = new Effect(canvas.width, canvas.height);
let lastTime = 0;
const fps = 30;
const nextFrame = 1000/fps;
let timer = 0;


function animate(timeStamp){
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    if (timer >nextFrame){
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = effect.fontSize + 'px monospace';

        effect.symbols.forEach(symbol => symbol.draw(ctx));
        timer = 0;
    }else{
        timer += deltaTime;
    }

    requestAnimationFrame(animate);
}
animate(0);