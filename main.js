const input = document.getElementById('input');
// var amplitude = 40;
var interval = null;
// create web audio api elements
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

oscillator.start();
gainNode.gain.value = 0;

// create Oscillator node
const oscillator = audioCtx.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = "sine";

notenames = new Map();
notenames.set("C", 261.6);
notenames.set("D", 293.7);
notenames.set("E", 329.6);
notenames.set("F", 349.2);
notenames.set("G", 392.0);
notenames.set("A", 440.0);
notenames.set("B", 493.9);

function frequency(pitch){
    freq = pitch / 10000;
    
    gainNode.gain.setValueAtTime(100, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 1);

}

ctx.clearRect()

audioCtx.resume();
gainNode.gain.value = 0;

function handle(){
    var usernotes = String(input.value);
    frequency(notenames.get(usernotes));

}

// define canvas variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = ctx.canvas.width;
var height = ctx.canvas.height;

var counter = 0;
function drawWave(){
    counter = 0;

}

interval = setInterval(line, 20);

function line() {
   y = height/2 + (amplitude * Math.sin(x * 2 * Math.PI * freq));
   ctx.lineTo(x, y);
   ctx.stroke();
   x = x + 1;

   counter++;
   if(counter > 50) {
       clearInterval(interval);
  }

}