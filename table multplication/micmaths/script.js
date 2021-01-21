
//valeurs par défaut des paramètres
var xfenetre = 600;  //largeur et longueur de la fenêtre ce contrôle
var yfenetre = 400;
var xaffiche = 400;  //largeur et longueur de la fenêtre d'affichage des figures
var yaffiche = 400;
var x = 1;			// paramètres des figures
var y = 1;
var maxX = 12;		// valeurs maximales affichées dans la fenêtre de contôle
var maxY = 8;
var pasX = 0.1;			// déplacement par défaut lors de l'utilisation des flèches
var pasY = 0.1;
var tailleCasesX = 50;  //taille des cases dans la fenêtre d'affichage
var tailleCasesY = 50;
var XYprop = false;		// si true, les modifications de maxX entraînent une modification proportionnelle de maxY.
var epaisseur = 1;		// epaisseur des lignes tracées en px
var taillePoints = 0;		// rayon des points en px
var posDiv = [];  // tableau qui contiendra la position du cadre de contrôle utilisé pour déplacement du kangourou à la souris


//variables spécifiques
var colorCycle = false; // si true, les cycles sont affichés dans des couleurs différentes.
var etoilesCycle = false;
init();

function init() { //fonction qui initialise les paramètres de la page
    placeElementsPage();
    maxX = Math.floor(xfenetre / tailleCasesX);
    document.getElementById('maxx').value = maxX;
    maxY = Math.floor(yfenetre / tailleCasesY);
    document.getElementById('maxy').value = maxY;
    actuControle();
}

function initCanvas() { //tourne le canvas pour que l'origine des angles soit en haut.
    var canvas = document.querySelector('#canvas');
    var context = canvas.getContext('2d');
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(-Math.PI / 2);
    context.translate(-canvas.width / 2, -canvas.height / 2);
}

function placeElementsPage() {
    var largeurPage = window.innerWidth;
    var hauteurPage = window.innerHeight;
    document.getElementById("description").style.width = (largeurPage * 0.95) + "px";
    document.getElementById("parametres").style.width = (largeurPage * 0.95) + "px";
    var a = document.getElementById("description").offsetHeight;
    var b = document.getElementById("parametres").offsetHeight;

    document.getElementById("affichage").style.height = Math.min(Math.max(((hauteurPage - a - b) * 0.9), 200), largeurPage * 0.3) + "px";
    document.getElementById("affichage").style.width = document.getElementById("affichage").style.height;
    document.getElementById("canvas").width = document.getElementById("affichage").offsetWidth;
    document.getElementById("canvas").height = document.getElementById("affichage").offsetHeight;

    document.getElementById("controle").style.width = ((largeurPage - document.getElementById("affichage").offsetWidth - 100) * 0.95) + "px";


    document.getElementById("controle").style.height = document.getElementById("affichage").style.height;
    document.getElementById("controleC").width = document.getElementById("controle").offsetWidth;
    document.getElementById("controleC").height = document.getElementById("controle").offsetHeight;

    initCanvas();

    xfenetre = document.getElementById("controle").offsetWidth;
    yfenetre = document.getElementById("controle").offsetHeight;
    xaffiche = document.getElementById("affichage").offsetWidth;
    yaffiche = document.getElementById("affichage").offsetHeight;
    posDiv = [document.getElementById("controle").offsetLeft, document.getElementById("controle").offsetTop];
}

window.addEventListener('resize', function (e) { // gère le changement de taille de la fenêtre
    placeElementsPage();
    actuControle();
}, false);

document.querySelector('#XYproportionnel').addEventListener('click', function (e) { // gère le changement de XYprop
    XYprop = (document.getElementById('XYproportionnel').checked);
    document.getElementById('maxy').disabled = XYprop;
}, false);


function getMousePosition(event) // renvoi la position de la souris
{
    var e = event || window.event;
    var scroll = new Array((document.documentElement && document.documentElement.scrollLeft) || window.pageXOffset || self.pageXOffset || document.body.scrollLeft, (document.documentElement && document.documentElement.scrollTop) || window.pageYOffset || self.pageYOffset || document.body.scrollTop);;
    return new Array(e.clientX + scroll[0] - document.body.clientLeft, e.clientY + scroll[1] - document.body.clientTop);
}

document.querySelector('#controleC').addEventListener('dragover', function (e) { //cache le kangourou pendant son déplacement en drag & drop
    e.preventDefault(); // Cette méthode est toujours nécessaire pour éviter une éventuelle redirection inattendue
    var kangourou = document.getElementById("kang");
    kangourou.style.visibility = "hidden";
}, false);


document.querySelector('#controleC').addEventListener('drop', function (e) { //place le kangourou et trace la figure après le drag & drop
    e.preventDefault(); // Cette méthode est toujours nécessaire pour éviter une éventuelle redirection inattendue
    var message = getMousePosition(e);
    x = Math.floor(((message[0] - posDiv[0])) / tailleCasesX) + 1;
    y = Math.floor(((message[1] - posDiv[1])) / tailleCasesY) + 1;
    placeKang(x, y);
    kangourou.style.visibility = "visible";
    traceEtoile(x, y, "canvas");
}, false);

document.querySelector('#controleC').addEventListener('click', function (e) { // déplace le kangourou par click sur une case
    e.preventDefault(); // Cette méthode est toujours nécessaire pour éviter une éventuelle redirection inattendue
    var message = getMousePosition(e);
    y = Math.floor(((message[1] - posDiv[1])) / tailleCasesY) + 1;
    x = Math.floor(((message[0] - posDiv[0])) / tailleCasesX) + 1;
    placeKang(x, y);
    traceEtoile(x, y, "canvas");
}, false);

document.addEventListener('keydown', function (e) { //déplace le kangourou avec les flèches du clavier
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
    if ((e.keyCode == 37) && (x - pasX >= 1)) {
        if ((x - pasX < maxX / 2 - 5) && (y < maxY / 2 - 5)) { // si x et y son suffisamment petits, on renormalise la grille
            maxX = Math.ceil(maxX / 1.5);
            maxY = Math.ceil(maxY / 1.5);
            document.getElementById('maxx').value = maxX;
            document.getElementById('maxy').value = maxY;
            actuControle();
        }
        x = x - pasX;
    }
    if ((e.keyCode == 38) && (y - pasY >= 1)) {
        if ((y - pasY < maxY / 2 - 5) && (x < maxX / 2 - 5)) { // si x et y son suffisamment petits, on renormalise la grille
            maxX = Math.ceil(maxX / 1.5);
            maxY = Math.ceil(maxY / 1.5);
            document.getElementById('maxx').value = maxX;
            document.getElementById('maxy').value = maxY;
            actuControle();
        }
        y = y - pasY;
    }
    if (e.keyCode == 39) {
        if (x + pasX > maxX) { // si le kangourou sort de l'image, on renormalise la grille
            maxX = Math.ceil(maxX * 1.5);
            maxY = Math.ceil(maxY * 1.5);
            document.getElementById('maxx').value = maxX;
            document.getElementById('maxy').value = maxY;
            actuControle();
        }
        x = x + pasX;

    }
    if (e.keyCode == 40) {
        if (y + pasY > maxY) {  // si le kangourou sort de l'image, on renormalise la grille
            maxX = Math.ceil(maxX * 1.5);
            maxY = Math.ceil(maxY * 1.5);
            document.getElementById('maxx').value = maxX;
            document.getElementById('maxy').value = maxY;
            actuControle();
        }
        y = y + pasY;
    }
    if ((e.keyCode >= 37) && (e.keyCode <= 40)) {
        placeKang(x, y);
        traceEtoile(x, y, "canvas");
    }
}, false);

function traceEtoile(n, k, can) { //fonction qui trace le bolygone
    var canvas = document.querySelector('#' + can);
    var xcan = canvas.offsetWidth;
    var ycan = canvas.offsetHeight;
    var rayonEtoile = Math.min(xcan, ycan) / 2.2;
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "rgb(40, 40, 40)";
    context.fillStyle = "rgba(140, 40, 40, 1)";
    context.lineWidth = "" + epaisseur;
    context.beginPath();
    for (var i = 0; i < n; i++) {
        context.moveTo(xcan / 2 + rayonEtoile * Math.cos(2 * i * (1 / n) * Math.PI), ycan / 2 + rayonEtoile * Math.sin(2 * i * (1 / n) * Math.PI));
        context.lineTo(xcan / 2 + rayonEtoile * Math.cos(2 * i * k * (1 / n) * Math.PI), ycan / 2 + rayonEtoile * Math.sin(2 * i * k * (1 / n) * Math.PI));
    }
    context.stroke();

    if (taillePoints > 0) { //on trace les n points si on veut qu'ils soient affichés
        for (var i = 0; i < n; i++) {
            context.moveTo(xcan / 2 + rayonEtoile * Math.cos(2 * i * (1 / n) * Math.PI) + taillePoints, ycan / 2 + rayonEtoile * Math.sin(2 * i * (1 / n) * Math.PI));
            context.arc(xcan / 2 + rayonEtoile * Math.cos(2 * i * (1 / n) * Math.PI), ycan / 2 + rayonEtoile * Math.sin(2 * i * (1 / n) * Math.PI), taillePoints, 0, 2 * Math.PI);
            context.fill();
        }
    }
}

function actuControle() { // fonction qui récupère les paramètres entrés par l'utilisateur et actualise l'affichage de la grille et de l'étoile.
    x = parseFloat(document.getElementById('xKang').value, 10);
    y = parseFloat(document.getElementById('yKang').value, 10);
    if (XYprop) {
        document.getElementById('maxy').value = Math.floor(parseInt(document.getElementById('maxy').value) * parseInt(document.getElementById('maxx').value) / maxX);
    }
    maxX = parseInt(document.getElementById('maxx').value, 10);
    maxY = parseInt(document.getElementById('maxy').value, 10);
    pasX = parseFloat(document.getElementById('pasx').value, 10);
    pasY = parseFloat(document.getElementById('pasy').value, 10);
    document.getElementById('pasx').value = pasX;
    document.getElementById('pasy').value = pasY;
    tailleCasesX = xfenetre / maxX; // calcule la taille des cases de la grille en fonction des paramètres récupérés
    tailleCasesY = yfenetre / maxY;
    epaisseur = parseInt(document.getElementById('epaisseur').value, 10);
    taillePoints = parseInt(document.getElementById('points').value, 10);
    traceGrille(tailleCasesX, tailleCasesY);
    placeKang(x, y); // actu controle replace le kangourou
    traceEtoile(x, y, "canvas"); // et retrace l'étoile
}


function traceGrille(tailleX, tailleY) { // tracela grille dans le cadre de contrôle
    if ((xfenetre < maxX) || (yfenetre < maxY)) {
        var canvascontrole = document.querySelector('#controleC');
        var contextC = canvascontrole.getContext('2d');
        contextC.fillStyle = "rgba(90, 90, 90, 0.5)";
        contextC.fillRect(0, 0, canvascontrole.width, canvascontrole.height);
    }
    else {
        colonnes = Math.ceil(xfenetre / tailleX);
        lignes = Math.ceil(yfenetre / tailleY);
        var canvascontrole = document.querySelector('#controleC');
        var contextC = canvascontrole.getContext('2d');
        contextC.fillStyle = "rgba(150, 50, 50, 0.5)";
        contextC.lineWidth = "5";
        contextC.clearRect(0, 0, canvascontrole.width, canvascontrole.height);
        for (var i = 0; i < colonnes; i++) {
            for (var j = 0; j < lignes; j++) {
                contextC.fillStyle = "rgba(" + (140 - 100 * ((i + j) % 2)) + ", " + (140 - 100 * ((i + j) % 2)) + ", " + (140 - 100 * ((i + j) % 2)) + ", 0.5)";
                contextC.fillRect(i * tailleCasesX, j * tailleCasesY, tailleCasesX, tailleCasesY);
            }
        }
    }
}

function placeKang(xc, yc) { // gère la taille et le placement du kangourou dans le cadre de contrôle
    var tailleKang = Math.max(Math.min(tailleCasesX, tailleCasesY), 15);
    kangourou = document.getElementById("kang");
    kangourou.style.width = tailleKang + "px";
    kangourou.style.height = tailleKang + "px";
    kangourou.style.left = ((xc - 1) * tailleCasesX) + "px";
    kangourou.style.top = ((yc - 1) * tailleCasesY) + "px";
    document.getElementById("xKang").value = xc;
    document.getElementById("yKang").value = yc;
}

// Fonctions spécifiques aux bolygones (aucune)
