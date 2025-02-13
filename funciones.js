var canvas;
var stage;
var container;
var captureContainers;
var captureIndex;
var text; // Variable para mantener referencia al texto

function init() {
    canvas = document.getElementById("testCanvas");
    stage = new createjs.Stage(canvas);

    // Función de redimensionamiento
    function handleResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Actualizar posición del texto
        if (text) {
            text.x = canvas.width / 2;
            text.y = canvas.height / 2;
        }

        stage.update();
    }

    // Configuración inicial
    handleResize();
    window.addEventListener('resize', handleResize);

    var w = canvas.width;
    var h = canvas.height;

    container = new createjs.Container();
    stage.addChild(container);

    captureContainers = [];
    captureIndex = 0;

    // Crear corazones
    for (var i = 0; i < 100; i++) {
        var heart = new createjs.Shape();
        heart.graphics.beginFill(createjs.Graphics.getHSL(Math.random() * 30 - 45, 100, 50 + Math.random() * 30));
        heart.graphics.moveTo(0, -12)
            .curveTo(1, -20, 8, -20)
            .curveTo(16, -20, 16, -10)
            .curveTo(16, 0, 0, 12)
            .curveTo(-16, 0, -16, -10)
            .curveTo(-16, -20, -8, -20)
            .curveTo(-1, -20, 0, -12);
        heart.y = -100;
        container.addChild(heart);
    }

    // Crear texto
    // text = new createjs.Text("inserte\n texto❤️", "bold 32px Times New Roman", "#fff");
    text = new createjs.Text(texto());
    text.textAlign = "center";
    text.textBaseline = "middle";
    text.x = w / 2;
    text.y = h / 2;
    stage.addChild(text);

    // Contenedores de caché
    for (var i = 0; i < 100; i++) {
        var captureContainer = new createjs.Container();
        captureContainer.cache(0, 0, w, h);
        captureContainers.push(captureContainer);
    }

    // Configurar animación
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.on("tick", tick);
}

function tick(event) {
    var w = canvas.width;
    var h = canvas.height;
    var l = container.numChildren;

    captureIndex = (captureIndex + 1) % captureContainers.length;
    stage.removeChildAt(0);
    var captureContainer = captureContainers[captureIndex];
    stage.addChildAt(captureContainer, 0);
    captureContainer.addChild(container);

    // Animar corazones
    for (var i = 0; i < l; i++) {
        var heart = container.getChildAt(i);
        if (heart.y < -50) {
            heart._x = Math.random() * w;
            heart.y = h * (1 + Math.random()) + 50;
            heart.perX = (1 + Math.random() * 2) * h;
            heart.offX = Math.random() * h;
            heart.ampX = heart.perX * 0.1 * (0.15 + Math.random());
            heart.velY = -Math.random() * 2 - 1;
            heart.scale = Math.random() * 2 + 1;
            heart._rotation = Math.random() * 40 - 20;
            heart.alpha = Math.random() * 0.75 + 0.05;
            heart.compositeOperation = Math.random() < 0.33 ? "lighter" : "source-over";
        }
        var int = (heart.offX + heart.y) / heart.perX * Math.PI * 2;
        heart.y += heart.velY * heart.scaleX / 2;
        heart.x = heart._x + Math.cos(int) * heart.ampX;
        heart.rotation = heart._rotation + Math.sin(int) * 30;
    }

    captureContainer.updateCache("source-over");
    stage.update(event);
}

// Iniciar cuando el documento esté listo
document.addEventListener("DOMContentLoaded", init);

var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

function texto () {
    TxtType.prototype.tick = function() {
        var i = this.loopNum % this.toRotate.length;
        var fullTxt = this.toRotate[i];
    
        if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
        }
    
        this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';
    
        var that = this;
        var delta = 200 - Math.random() * 100;
    
        if (this.isDeleting) { delta /= 2; }
    
        if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
        }
    
        setTimeout(function() {
        that.tick();
        }, delta);
    };
    
    window.onload = function() {
        var elements = document.getElementsByClassName('typewrite');
        for (var i=0; i<elements.length; i++) {
            var toRotate = elements[i].getAttribute('data-type');
            var period = elements[i].getAttribute('data-period');
            if (toRotate) {
              new TxtType(elements[i], JSON.parse(toRotate), period);
            }
        }
        // INJECT CSS
        var css = document.createElement("style");
        css.type = "text/css";
        document.body.appendChild(css);
    };
}


const player = document.getElementById('valentinePlayer');
const audio = new Audio('cancion1.mp3'); // Reemplaza con tu archivo
let isPlaying = false;

player.addEventListener('click', () => {
    if(isPlaying) {
        audio.pause();
        player.classList.remove('playing');
    } else {
        audio.play();
        player.classList.add('playing');
    }
    isPlaying = !isPlaying;
});

audio.addEventListener('ended', () => {
    player.classList.remove('playing');
    isPlaying = false;
});
