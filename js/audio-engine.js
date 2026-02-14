////////////////////////// Audio Functionality \\\\\\\\\\\\\\\\\\\\\\\\\\
var currentTrack = 0;
var currentStep = 0;
var length = "1m";
var running = false;
var changes = false;

Tone.Transport.loop = true;
Tone.Transport.loopEnd = length;
Tone.Transport.swingSubdivision = "16n";

// arrays for instruments and all parameters
const instruments = [];
const panVols = [];
const ampEnvs = [];
const lpFilters = [];
const hpFilters = [];

// recording functionality
const recorder = new Tone.Recorder();
Tone.Destination.connect(recorder);
var recording = false;

// master output to apply master effects
var master = Tone.getDestination();

// massive JSON objects to contain all information
// currentData is the live object
// projectData is the master object that interacts with the api
// initData is an init object with default parameters

var initData = {
    id: 0,
    name: "",
    bpm: 120,
    swing: 0,
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
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
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
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 2,
            //sample: test,
            volume: -12,
            pitch: 1,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 3,
            //sample: test,
            volume: -12,
            pitch: 1,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 4,
            //sample: test,
            volume: -12,
            pitch: 1,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 5,
            //sample: test,
            volume: -12,
            pitch: 1,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 6,
            //sample: test,
            volume: -12,
            pitch: 1,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 7,
            //sample: test,
            volume: -12,
            pitch: 1,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 8,
            //sample: test,
            volume: -12,
            pitch: 1,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 9,
            //sample: test,
            volume: -12,
            pitch: 1,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
    ],
};

var currentData = {
    id: 0,
    name: "",
    bpm: 120,
    swing: 0,
    masterVolume: -6,
    length: "1m",
    tracks: [
        {
            id: 0,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 1,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 2,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 3,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 4,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 5,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 6,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 7,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 8,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 9,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
    ],
};

var projectData = {
    id: 0,
    name: "",
    bpm: 120,
    swing: 0,
    masterVolume: -6,
    length: "1m",
    tracks: [
        {
            id: 0,
            samplePath: "samples/Marshalls_Kick.wav",
            sampleName: "New Sequence",
            volume: -12,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 1,
            samplePath: "samples/Marshalls_Open.wav",
            sampleName: "New Sequence",
            volume: -12,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 2,
            samplePath: "samples/Marshalls_Clap.wav",
            sampleName: "New Sequence",
            volume: -12,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 3,
            samplePath: "samples/OB_Nebula_Pad.wav",
            sampleName: "New Sequence",
            volume: -12,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 4,
            samplePath: "samples/Grain_Drone.wav",
            sampleName: "New Sequence",
            volume: -12,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 5,
            samplePath: "samples/Space_Station.wav",
            sampleName: "New Sequence",
            volume: -12,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 6,
            samplePath: "samples/canto.wav",
            sampleName: "New Sequence",
            volume: -12,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 7,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 8,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
            distortion: 0,
            steps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            id: 9,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            pitch: 0,
            pan: 0,
            start: 0,
            attack: 0,
            decay: 2,
            sustain: 1,
            release: 0,
            lpWidth: 5000,
            lpq: 0,
            hpWidth: 1,
            hpq: 0,
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
            decay: 2.0,
            sustain: 1.0,
            release: 1.0,
        }).connect(panVol);
        ampEnvs[i] = ampEnv;

        var hpFilter = new Tone.Filter(10, "highpass").connect(ampEnv);
        hpFilters[i] = hpFilter;

        var lpFilter = new Tone.Filter(5000, "lowpass").connect(hpFilter);
        lpFilters[i] = lpFilter;

        if (i % 2 == 0) {
            instruments[i] = new Tone.Player({
                url: "samples/Marshalls_Kick.wav",
                autostart: false,
            });
        } else {
            instruments[i] = new Tone.Player({
                url: "samples/OB_Nebula_Pad.wav",
                autostart: false,
            });
        }

        instruments[i].connect(lpFilter);
    }
}

// load instruments with currentData
function loadInstruments() {
    currentData.tracks.forEach((track, index) => {
        if (track.samplePath) {
            instruments[index].load(track.samplePath);
        }
    });
}

// initialize all controls and api
window.onload = function () {
Tone.Transport.bpm.value = currentData.bpm;

    initInstruments();
    initGlobalControls();
    initTransport();
    initTrackSelectors();
    //initPageSelectors();
    initSequencer();
    initTrackParams();

    //loadSequences(); REENABLE ***
    //loadSamples(); REENABLE ***

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
    const track = currentData.tracks[index];
    const now = time || Tone.now();

    try {
        if (player && player.buffer && player.buffer.loaded) {
            // stop the player and current env immediately
            player.stop(now);
            env.cancel(now);

            // get the start point of the sample and the time to play
            const offset = player.buffer.duration * (track.start || 0);
            const safeOffset = Math.min(offset, player.buffer.duration - 0.005);

            // don't try to play past the length of the sample if start has been offset
            const remainingTime =
                (player.buffer.duration - safeOffset) / player.playbackRate;

            // restart the player and the envelope
            player.start(now, safeOffset);

            // starts next attack phase
            env.triggerAttackRelease(remainingTime, now);
        }
    } catch (e) {
        console.error("Playback error:", e);
    }
}

// stop the audio buffer for each instrument immediately
function stopAllSounds() {
    instruments.forEach((player) => {
        if (player) {
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

function setTrackStart(val) {
    currentData.tracks[currentTrack].start = parseFloat(val);
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

function setTrackLpWidth(val) {
    lpFilters[currentTrack].frequency.rampTo(parseFloat(val), 0.05);
}

function setTrackLpQ(val) {
    lpFilters[currentTrack].Q.rampTo(parseFloat(val), 0.05);
}

function setTrackHpWidth(val) {
    hpFilters[currentTrack].frequency.rampTo(parseFloat(val), 0.05);
}

function setTrackHpQ(val) {
    hpFilters[currentTrack].Q.rampTo(parseFloat(val), 0.05);
}
