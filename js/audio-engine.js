// audio functionality

var currentTrack = 0;
var currentStep = 0;
var length = "1m";
var running = false;
var changes = false;

// arrays for instruments and all parameters
const instruments = [];
const panVols = [];
const ampEnvs = [];

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
            pitch: 1,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 0.01,
            sustain: 0,
            release: 0,
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
            pitch: 1,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 0.01,
            sustain: 0,
            release: 0,
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
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 0,
            sustain: 0,
            release: 0,
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
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 0,
            sustain: 0,
            release: 0,
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
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 0,
            sustain: 0,
            release: 0,
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
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 0,
            sustain: 0,
            release: 0,
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
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 0,
            sustain: 0,
            release: 0,
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
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 0,
            sustain: 0,
            release: 0,
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
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 0,
            sustain: 0,
            release: 0,
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
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 0,
            sustain: 0,
            release: 0,
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
        panVols[i] = panVol;

        var ampEnv = new Tone.AmplitudeEnvelope({
            attack: 0.0,
            decay: 0.1,
            sustain: 1.0,
            release: 1.0,
        }).connect(panVols[i]);
        ampEnvs[i] = ampEnv;

        if (i % 2 == 0) {
            instruments[i] = new Tone.Player({
                url: "samples/Marshalls_Kick.wav",
                autostart: false,
            }).connect(ampEnvs[i]);
        } else {
            instruments[i] = new Tone.Player({
                url: "samples/OB_Nebula_Pad.wav",
                autostart: false,
            }).connect(ampEnvs[i]);
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

////////////////////////// Loop Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\

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
    const env = ampEnvs[index];
    const now = time || Tone.now();
    try {
        if (player && player.buffer && player.buffer.loaded) {
            // stop the player immediately so the next .start() is a fresh trigger
            player.stop(now);

            // 2. IMPORTANT: We use the buffer duration as the "gate"
            // This ensures the Sustain and Release parameters you set in the UI
            // have time to actually happen before the envelope "gives up".
            const duration = player.buffer.duration;

            // restart the player and the envelope
            player.start(now);

            // Using a short gate (0.1) lets the Attack/Decay/Release sliders
            // stay in control without the "Sustain" getting stuck open.
            env.triggerAttackRelease(duration, now);

            /*
            env.cancel(time);
            //player.start(time);
            player.start(time);
            env.triggerAttackRelease(0.1, time);
            */
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

function setTrackPitch(val) {
    const rate = Math.pow(2, val / 12);
    instruments[currentTrack].playbackRate = rate;
}

function setTrackAttack(val) {
    ampEnvs[currentTrack].attack = val;
}

function setTrackDecay(val) {
    ampEnvs[currentTrack].decay = val;
}

function setTrackSustain(val) {
    ampEnvs[currentTrack].sustain = val;
}

function setTrackRelease(val) {
    ampEnvs[currentTrack].release = val;
}