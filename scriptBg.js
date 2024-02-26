const myImage = new Image();
const myImage1 = new Image();
const myImage2 = new Image();

const base64String = localStorage.getItem('base64Img');
const base64String1 = localStorage.getItem('base64Img1');

console.log(base64String);
console.log(base64String1);

myImage.src = base64String;
myImage1.src = base64String1;

var pace = 3.5;
var brightness = 1;
var size = 1;
var e = document.getElementById("effects");
var effect = 0;

const canvas = document.getElementById('canvas1');
var chunks = [];
var canvas_stream = canvas.captureStream(30); // fps
// Create media recorder from canvas stream
var media_recorder = new MediaRecorder(canvas_stream, { mimeType: "video/webm; codecs=vp9" });

// Record data in chunks array when data is available
media_recorder.ondataavailable = function (evt) {
  chunks.push(evt.data);
};

// Function to handle recorded data when recording stops
function on_media_recorder_stop(chunks) {
    var blob = new Blob(chunks, { type: "video/webm" });
    var recording_url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.style = "display: none;";
    a.href = recording_url;
    a.download = "video.webm";
    document.body.appendChild(a);
    // Trigger the file download
    a.click();
    setTimeout(function () {
      // Clean up
      URL.revokeObjectURL(recording_url);
      document.body.removeChild(a);
    }, 0);
  }
  
// Provide recorded data when recording stops
media_recorder.onstop = function () {
    on_media_recorder_stop(chunks);
};

function saveRecording() {
    media_recorder.stop();
  }

function record(){
    media_recorder.start(1000);
}

function save(){
    saveRecording();
}

// let myImagel = false;
// let myImage1l = false;

// myImage.addEventListener('load', function(){
//     myImagel = true;
//     console.log("img1 loaded");
//     });

// myImage1.addEventListener('load', function(){
//     myImage1l = true;
//     console.log("img2 loaded");
//     });


function submit(){
    pace = parseFloat(document.getElementById('speed').value);
    brightness = parseFloat(document.getElementById('brightness').value);
    size = parseFloat(document.getElementById('size').value);
    e = document.getElementById("effects");
    effect = e.options[e.selectedIndex].value;
    console.log(pace);
    console.log(brightness);
}

window.addEventListener('load', function() {
    console.log("Window loaded");

    // if (myImagel && myImage1l){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    scale = 600/myImage.height;
    
    console.log(myImage.width);
    console.log(scale);
    
    myImage.width = myImage.width*scale;
    myImage.height = myImage.height*scale;
    canvas.width = myImage.width;
    canvas.height = myImage.height;

    ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log(pixels);
    let particlesArray = [];
    const numerOfParticles = 5000;

    let mappedImage = [];
    for (let y=0; y<canvas.height; y++){
        let row = [];
        for (let x=0; x<canvas.width; x++){
            const red = pixels.data[(y*4*pixels.width)+(x*4)];
            const green = pixels.data[(y*4*pixels.width)+(x*4+1)];
            const blue = pixels.data[(y*4*pixels.width)+(x*4+2)];
            const brightness = calculateRelativeBrightness(red, green, blue);
            const cell = [
                cellBrightness = brightness, 
                cellColor = 'rgb('+red+','+green+','+blue+')'
            ];
            row.push(cell);
        }
        mappedImage.push(row);
    }
    // console.log(mappedImage);

    function calculateRelativeBrightness(red, green, blue){
        return Math.sqrt(
            (red*red)*0.299+
            (green*green)*0.587+
            (blue*blue)*0.114
        )/100;
        // return (red+green+blue)/100;
    }

    class Particle {
        constructor(){
            this.x = Math.random()*canvas.width;
            this.y = 0;
            this.speed = 0;
            this.velocity = Math.random()*5.5;
            this.size = Math.random()*1.5;
            this.pSize = this.size;
            this.position1 = Math.floor(this.y);
            this.position2 = Math.floor(this.x);
            // console.log(this.position1, this.position2);

        }
        update(){
            this.position1 = Math.floor(this.y);
            this.position2 = Math.floor(this.x);
            this.speed = mappedImage[this.position1][this.position2][0];
            this.size = this.pSize+size;

            let movement = (2.5-this.speed) + this.velocity + pace;

            if (effect==1)
            {
                this.y += movement;
                // this.x += movement;
                }
            if (effect==2)
            {
                // this.y += movement;
                this.x += movement;
                }
            if (effect==3)
            {
                this.y += movement;
                this.x += movement;
                }
            

            if (this.y >= canvas.height){
                this.y = 0;
                this.x = Math.random()*canvas.width;
                
            }
            if (this.x >= canvas.width){
                this.x = 0;
                this.y = Math.random()*canvas.height;
                
            }
        }
        draw(){
            ctx.beginPath();
            ctx.fillStyle = mappedImage[this.position1][this.position2][1];
            ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
            ctx.fill();
        }
    
        }
        function init(){
            for (let i=0; i<numerOfParticles; i++){
                particlesArray.push(new Particle);

            }
        }
        init();
        function animate(){
            console.log(effect);
            if (effect==0){
                ctx.fillStyle = 'rgb(0, 0, 0)';
                ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height);
            }
            else{
            // ctx.drawImage(myImage, 0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 0.05;
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = 0.2;
            for (let i=0; i<particlesArray.length; i++){
                particlesArray[i].update();
                // ctx.globalAlpha = particlesArray[i].speed;
                ctx.globalAlpha = particlesArray[i].speed/4*brightness;
                particlesArray[i].draw();
                if (i%10 == 0)
                    ctx.drawImage(myImage1, 0, 0, canvas.width, canvas.height);
            }
            // ctx.drawImage(myImage1, 0, 0, canvas.width, canvas.height);
            }
        requestAnimationFrame(animate);
        }
        animate();
    
    
  });                

