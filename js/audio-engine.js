// audio functionality

var currentTrack = 0;
var currentStep = 0;
var length = "1m";
var running = false;
var changes = false;
const instruments = [];

Tone.Transport.loop = true;
Tone.Transport.loopEnd = length;

// massive JSON objects to contain all information
const currentData = {};
// defaultData = JSON - use this as default, projectData gets initialized to this if no pattern selected
const projectData = {
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
            balance: 0,
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
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 2,
            //sample: test,
            volume: -6,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 3,
            //sample: test,
            volume: -6,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 4,
            //sample: test,
            volume: -6,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 5,
            //sample: test,
            volume: -6,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 6,
            //sample: test,
            volume: -6,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 7,
            //sample: test,
            volume: -6,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 8,
            //sample: test,
            volume: -6,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 9,
            //sample: test,
            volume: -6,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 10,
            //sample: test,
            volume: -6,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
    ],
};

// load samples into tone.js samplers
function initInstruments() {
    instruments[0] = new Tone.Sampler({
        urls: {
            C1: "samples/Marshalls Kick.wav",
        },
    }).toDestination();

    instruments[1] = new Tone.Sampler({
        urls: {
            C1: "samples/Marshalls Open.wav",
        },
    }).toDestination();

    instruments[2] = new Tone.Sampler({
        urls: {
            C1: "samples/Marshalls Clap.wav",
        },
    }).toDestination();

    instruments[3] = new Tone.Sampler({
        urls: {
            C1: "samples/OB Nebula Pad.wav",
        },
    }).toDestination();
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
    // initialize track params
};

// schedule the loop
function setupAudioLoop() {
    // *** eventually pass whatever the note's stored time value is after params
    Tone.Transport.scheduleRepeat((time) => {
        // loop through each track
        projectData.tracks.forEach((track, index) => {
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
    const instrument = instruments[index];
    if (instrument) {
        instrument.triggerAttackRelease("C1", "8n", time);
    }
}

// ****************** Track Parameters ****************** \\
// functions to update audio for each parameter


// instant when switching tracks, not instant when just sliding slider
function setTrackVolume(val, instant = false) {
    if (instant) {
        instruments[currentTrack].volume.value = val;
    } else {
        instruments[currentTrack].volume.rampTo(val, 0.05);
    }
}