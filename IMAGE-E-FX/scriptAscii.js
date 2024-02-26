const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const image1 = new Image();

const base64String = localStorage.getItem('base64Img');
// var asciiScale = document.getElementById('asciiScale').defaultValue = 1;

document.getElementById('asciiScale').defaultValue = 1;
document.getElementById('resolution').defaultValue = 1;

image1.src = base64String;

console.log(base64String);

const inputSlider = document.getElementById('resolution');
console.log(inputSlider.value);
const inputLabel = document.getElementById('resolutionlabel');
inputSlider.addEventListener('change', handleSlider);

function saveCanvasImage() {
    var download = document.createElement('a');
    download.href = canvas.toDataURL();
    console.log(download.href);
    download.download = 'image.png';
    download.click();
  }

function submit() {
    let image3 = new Image();
    image3.src = canvas.toDataURL();
    console.log(image3);
    var download = document.createElement('a');
    download.href = image3.src;
    download.download = 'image.png';
    download.click();
}
class Cell{
    constructor(x, y, symbol, color){
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
    }
    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.fillText(this.symbol, this.x, this.y)
    }
}

class AsciiEffect{
    #imageCellArray = [];
    #pixels = [];
    #ctx;
    #width;
    #height;
    constructor(ctx, width, height){
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.#ctx.drawImage(image1, 0, 0, this.#width, this.#height);
        this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
    }
    #convertToSymbol(g){
        if (g>250) return '@';
        else if (g>240) return 'M';
        else if (g>220) return 'W';
        else if (g>200) return '%';
        else if (g>180) return '&';
        else if (g>160) return '#';
        else if (g>140) return 'O';
        else if (g>120) return '?';
        else if (g>95) return '!';
        else if (g>70) return '^';
        else if (g>45) return '+';
        else if (g>15) return '-';
        else if (g>5) return '.';
        else return '';

    }
    #scanImage(cellSize){
        this.#imageCellArray = [];
        for (let y = 0; y < this.#pixels.height; y+= cellSize){
            for (let x = 0; x < this.#pixels.width; x += cellSize){
                const posX = x * 4;
                const posY = y * 4;
                const pos = (posY*this.#pixels.width) + posX;

                if (this.#pixels.data[pos+3] > 128){
                    const red = this.#pixels.data[pos];
                    const green = this.#pixels.data[pos+1];
                    const blue = this.#pixels.data[pos+2];
                    const total = red+green+blue;
                    const averageColorValue = total/3;
                    const color = "rgb(" + red + "," + green + "," + blue + ")";
                    const symbol = this.#convertToSymbol(averageColorValue);
                    this.#imageCellArray.push(new Cell(x, y, symbol, color));
                }
            }
        }

    }
    #drawAscii(){
        this.#ctx.clearRect(0, 0, this.#width, this.#height);
        // document.write(this.#imageCellArray.length);
        for (let i = 0; i < this.#imageCellArray.length; i++){
            this.#imageCellArray[i].draw(this.#ctx);
            // document.write(this.#imageCellArray.length);
        }
        // document.write(this.#imageCellArray.length);
    }
    draw(cellSize){
        this.#scanImage(cellSize);
        this.#drawAscii();
        // document.write(this.#imageCellArray.length);
    }
}


let effect;

function handleSlider(){

    var asciiScale = document.getElementById('asciiScale').value;

    if (asciiScale == '0'){
        if (inputSlider.value == 1){
            console.log(inputSlider.value);
            inputLabel.innerHTML = "Original Image";
            ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
            
        }else{
            inputLabel.innerHTML = 'Resolution: '+inputSlider.value+' px';
            ctx.font = parseInt(inputSlider.value) + 'px Verdana';
            effect.draw(parseInt(inputSlider.value));
        }

    }
    else if (asciiScale == '1'){
        if (inputSlider.value == 1){
            inputLabel.innerHTML = "Original Image";
            ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
            
        }else{
            inputLabel.innerHTML = 'Resolution: '+inputSlider.value+' px';
            // ctx.font = parseInt(inputSlider.value) + 'px Verdana';
            effect.draw(parseInt(inputSlider.value));
        }
    }
    else{
        ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
    }
    
}

image1.onload = function initialize(){

    scale = 600/image1.height;
    
    // console.log(image1.width);
    // console.log(scale);
    
    image1.width = image1.width*scale;
    image1.height = image1.height*scale;
    canvas.width = image1.width;
    canvas.height = image1.height;


    effect = new AsciiEffect(ctx, image1.width, image1.height);
    ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
}
