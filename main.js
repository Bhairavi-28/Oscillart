const input = document.getElementById('input');
const color_picker = document.getElementById('color');
const vol_slider = document.getElementById('vol-slider');

// ---------------
var freq = 0;
var interval = null;
var repeat = null;
var x = 0
var timepernote = 0;
var length = 0;
var reset = false;

// ---------------

// create web audio api elements
const audioCtx = new AudioContext();
const gainNode = audioCtx.createGain();

// create Oscillator node
const oscillator = audioCtx.createOscillator();
oscillator.connect(gainNode);
gainNode.connect(audioCtx.destination);
oscillator.type = "sine";

oscillator.start();
gainNode.gain.value = 0;

// ---------------

// map notes to frequencies
const notenames = new Map([
    ["C", 261.6],
    ["D", 293.7],
    ["E", 329.6],
    ["F", 349.2],
    ["G", 392.0],
    ["A", 440.0],
    ["B", 493.9]
]);

// ---------------

// frequency function
function frequency(pitch) {
    freq = pitch / 10000;

    gainNode.gain.setValueAtTime(vol_slider.value / 100, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(pitch, audioCtx.currentTime);

    setting = setInterval(() => {
        gainNode.gain.value = vol_slider.value / 100;
    }, 1);

    setTimeout(() => {
        clearInterval(setting);
        gainNode.gain.value = 0;
    }, (timepernote - 10));

}

// define canvas variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = ctx.canvas.width;
var height = ctx.canvas.height;

var counter = 0;

// drawWave function
function drawWave() {
    clearInterval(interval);
    counter = 0;

    if (reset) {
        ctx.clearRect(0, 0, width, height);
        x = 0;
        y = height / 2;
        ctx.moveTo(x, y);
        ctx.beginPath();
        reset = false;
    }

    interval = setInterval(line, 20);
}

function line() {
    y = height / 2 + ((vol_slider.value / 100 * 40) * Math.sin(x * 2 * Math.PI * freq * (0.5 * length)));
    ctx.lineTo(x, y);
    ctx.strokeStyle = color_picker.value;
    ctx.stroke();
    x = x + 1;

    counter++;
    if (counter > (timepernote / 20)) {
        clearInterval(interval);
    }
}

// handle user input
function handle() {
    audioCtx.resume();
    gainNode.gain.value = 0;

    reset = true;

    var usernotes = String(input.value.toUpperCase());
    var noteslist = [];

    for (let i = 0; i < usernotes.length; i++) {
        let note = notenames.get(usernotes.charAt(i));
        if (note) 
            noteslist.push(note);
    }

    length = noteslist.length;
    timepernote = 6000 / length;

    let j = 0;
    clearInterval(repeat);
    repeat = setInterval(() => {
        if (j < noteslist.length) {
            frequency(parseInt(noteslist[j]));
            drawWave();
            j++;
        } 
        else {
            clearInterval(repeat);
        }
    }, timepernote);
}

// event listener for the button
document.getElementById("submit").addEventListener("click", handle);