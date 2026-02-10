console.log("Audio Engine Script Loaded!");

// audio functionality

var currentTrack = 0;
var currentStep = 0;
var length = "1m";
var running = false;
var changes = false;

// arrays for instruments and all parameters
const instruments = [];
const panVols = [];

Tone.Transport.loop = true;
Tone.Transport.loopEnd = length;

// massive JSON objects to contain all information
// currentData is the live object
// projectData is the master object that interacts with the api
// initData is an init object with default parameters

var initData = {
    id: 0,
    name: "New Sequence",
    bpm: 120,
    masterVolume: -6,
    length: "1m",
    tracks: [
        {
            id: 0,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 1,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 2,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 3,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 4,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 5,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 6,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 7,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 8,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 9,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
    ],
};

var currentData = {
    id: 0,
    name: "New Sequence",
    bpm: 120,
    masterVolume: -6,
    length: "1m",
    tracks: [
        {
            id: 0,
            //sample: test,
            volume: -12,
            rate: 100,
            pitch: 1,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 1,
            //sample: test,
            volume: -12,
            rate: 100,
            pitch: 1,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 2,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 3,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 4,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 5,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 6,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 7,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 8,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 9,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
    ],
};

var projectData = {
    id: 0,
    name: "New Sequence",
    bpm: 120,
    masterVolume: -6,
    length: "1m",
    tracks: [
        {
            id: 0,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 1,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 2,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 3,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 4,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 5,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 6,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 7,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 8,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 9,
            //sample: test,
            volume: -6,
            rate: 100,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            release: 100,
            filterBase: 0,
            filterWidth: 100,
            resonance: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
    ],
};

// create tone.js samplers
function initInstruments() {
    for (var i = 0; i < 10; i++) {
        // initialize parameter components/effects
        var panVol = new Tone.PanVol(0, -12).toDestination();

        // store references
        panVols[i] = panVol;

        if (i % 2 == 0) {
            instruments[i] = new Tone.Player({
                url: "samples/Marshalls_Kick.wav",
                autostart: false,
            }).connect(panVols[i]);
        } else {
            instruments[i] = new Tone.Player({
                url: "samples/OB_Nebula_Pad.wav",
                autostart: false,
            }).connect(panVols[i]);
        }
    }
}

// initialize everything here
window.onload = function () {
    initInstruments();

    initGlobalControls();
    initTransport();
    initTrackSelectors();
    //initPageSelectors();
    initSequencer();
    initTrackParams();

    //loadSequences(); REENABLE
    // initialize track params
    setupAudioLoop();
};

// schedule the loop
function setupAudioLoop() {
    // eventually pass whatever the note's stored time value is after params ***
    Tone.Transport.scheduleRepeat((time) => {
        if (!running) return;

        // loop through each track
        currentData.tracks.forEach((track, index) => {
            if (track.steps[currentStep] == 1) {
                playTrackSound(index, time);
            }
        });

        updateUIPlayHead(currentStep);

        // loop back to 0 when currentStep gets to 16
        currentStep = (currentStep + 1) % 16;
    }, "16n");
}

function playTrackSound(index, time) {
    const player = instruments[index];
    
    try {
        if (player && player.buffer && player.buffer.loaded) {
            player.start(time);
        }
    } catch (e) {
        console.error("Playback error:", e);
    }
}

function stopAllSounds() {
    instruments.forEach((player) => {
        if (player) {
            // stops the audio buffer immediately
            player.stop();
        }
    });
}

////////////////////////// Track Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\
// functions to update audio for each parameter

// instant when switching tracks, not instant when just sliding slider
function setTrackVolume(val, instant = false) {
    if (instant) {
        panVols[currentTrack].volume.value = val;
    } else {
        panVols[currentTrack].volume.rampTo(val, 0.05);
    }
}

function setTrackPan(val, instant = false) {
    if (instant) {
        panVols[currentTrack].pan.value = val;
    } else {
        panVols[currentTrack].pan.rampTo(val, 0.05);
    }
}

function setTrackPitch(val, instant = false) {
    if (instant) {
        instruments[currentTrack].playbackRate = val;
    } else {
        instruments[currentTrack].playbackRate= val;
    }
}

/*
function initInstruments() {
    instruments[0] = new Tone.Sampler({
        urls: { C1: "samples/Marshalls_Kick.wav" },
    }).toDestination();

    instruments[1] = new Tone.Sampler({
        urls: {
            C1: "./samples/Marshalls_Open.wav",
        },
    }).toDestination();

    instruments[2] = new Tone.Sampler({
        urls: {
            C1: "./samples/Marshalls_Clap.wav",
        },
    }).toDestination();

    instruments[3] = new Tone.Sampler({
        urls: {
            C1: "./samples/OB_Nebula_Pad.wav",
        },
    }).toDestination();

    instruments[4] = new Tone.Sampler({
        urls: {
            C1: "./samples/Marshalls_Kick.wav",
        },
    }).toDestination();

    instruments[5] = new Tone.Sampler({
        urls: {
            C1: "./samples/Marshalls_Open.wav",
        },
    }).toDestination();

    instruments[6] = new Tone.Sampler({
        urls: {
            C1: "./samples/Marshalls_Clap.wav",
        },
    }).toDestination();

    instruments[7] = new Tone.Sampler({
        urls: {
            C1: "./samples/OB_Nebula_Pad.wav",
        },
    }).toDestination();

    instruments[8] = new Tone.Sampler({
        urls: {
            C1: "./samples/Marshalls_Clap.wav",
        },
    }).toDestination();

    instruments[9] = new Tone.Sampler({
        urls: {
            C1: "./samples/OB_Nebula_Pad.wav",
        },
    }).toDestination();
}
    */
