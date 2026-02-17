////////////////////////// Audio Functionality \\\\\\\\\\\\\\\\\\\\\\\\\\
var currentTrack = 0;
var currentStep = 0;
var currentPage = 0;
var length = "1m";
var running = false;
var changes = false;

Tone.Transport.loop = true;
Tone.Transport.loopEnd = length;
Tone.Transport.swingSubdivision = "16n";
Tone.context.lookAhead = 0;

// arrays for instruments, parameters and effects
const instruments = [];
const panVols = [];
const ampEnvs = [];
const lpFilters = [];
const hpFilters = [];
const distortions = [];
const bitcrushers = [];
const choruses = [];
const tremolos = [];
const delays = [];
const reverbSends = [];

// recording functionality
const recorder = new Tone.Recorder();
Tone.Destination.connect(recorder);
var recording = false;

// master output to apply master effects
const master = Tone.getDestination();

var masterVolNode;
var masterCompressor;
var masterEQ;
var masterSaturator;
var masterLimiter;
var masterReverb;
var reverbWidener;
var reverbHeat;
var reverbLimiter;

function initMasterChain() {
    masterVolNode = new Tone.Gain(1);

    masterEQ = new Tone.EQ3(0, 0, 0);
    masterCompressor = new Tone.Compressor(-24, 3);
    masterSaturator = new Tone.Distortion(0.1);
    saturatorFilter = new Tone.Filter(20000, "lowpass");
    masterLimiter = new Tone.Limiter(-1);

    initReverbBus();

    masterEQ.chain(
        masterCompressor,
        masterSaturator,
        saturatorFilter,
        masterVolNode,
        masterLimiter,
        Tone.Destination,
    );
}

function initReverbBus() {
    reverbHeat = new Tone.Chebyshev(20);
    reverbHeat.wet.value = 0.2;

    masterReverb = new Tone.Reverb({
        decay: 3,
        preDelay: 0.01,
    });

    reverbWidener = new Tone.StereoWidener(0.3);
    reverbLimiter = new Tone.Limiter(-3);

    reverbHeat.chain(
        masterReverb,
        reverbWidener,
        reverbLimiter,
        masterEQ
    );

    masterReverb.generate();
}

// massive JSON objects to contain all information
// currentData is the live object
// projectData is the master object that interacts with the api
// initData is an init object with default parameters

var initData = {
    id: null,
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
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 1,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 2,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 3,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 4,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 5,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 6,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 7,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 8,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 9,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 99,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
    ],
    master: {
        dirt: 20,
        dirtMix: 0.2,
        space: 2.0,
        predelay: 0.01,
        revWidth: 0.3,
        revLimit: -3,
        eqLow: 0,
        eqMid: 0,
        eqHigh: 0,
        compThresh: -24,
        compRatio: 1,
        compAttack: 0.05,
        compRelease: 0.25,
        compKnee: 30,
        satDrive: 0,
        satTone: 20000,
        satMix: 0,
        limitThresh: -3,
    },
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
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 1,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 2,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 3,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 4,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 5,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 6,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 7,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 8,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 9,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 99,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
    ],
    master: {
        dirt: 20,
        dirtMix: 0.2,
        space: 2.0,
        predelay: 0.01,
        revWidth: 0.3,
        revLimit: -3,
        eqLow: 0,
        eqMid: 0,
        eqHigh: 0,
        compThresh: -24,
        compRatio: 1,
        compAttack: 0.05,
        compRelease: 0.25,
        compKnee: 30,
        satDrive: 0,
        satTone: 20000,
        satMix: 0,
        limitThresh: -3,
    },
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
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 1,
            samplePath: "samples/Marshalls_Open.wav",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 2,
            samplePath: "samples/Marshalls_Clap.wav",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 3,
            samplePath: "samples/OB_Nebula_Pad.wav",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 4,
            samplePath: "samples/Grain_Drone.wav",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 5,
            samplePath: "samples/Space_Station.wav",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 6,
            samplePath: "samples/canto.wav",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 7,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 8,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
        {
            id: 9,
            samplePath: "",
            sampleName: "New Sequence",
            volume: -12,
            muted: false,
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
            bitcrusher: 0,
            reverb: 0,
            chorusRate: 0,
            chorusDepth: 0,
            chorusMix: 0,
            tremRate: 0,
            tremDepth: 0,
            tremMix: 0,
            delTime: 0,
            delFback: 0,
            delMix: 0,
            steps: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0,
            ],
        },
    ],
    master: {
        dirt: 20,
        dirtMix: 0.2,
        space: 2.0,
        predelay: 0.01,
        revWidth: 0.3,
        revLimit: -3,
        eqLow: 0,
        eqMid: 0,
        eqHigh: 0,
        compThresh: -24,
        compRatio: 1,
        compAttack: 0.05,
        compRelease: 0.25,
        compKnee: 30,
        satDrive: 0,
        satTone: 20000,
        satMix: 0,
        limitThresh: -1,
    },
};

// create tone.js samplers
function initInstruments() {
    initMasterChain();
    for (var i = 0; i < 10; i++) {
        // initialize parameter components/effects
        panVols[i] = new Tone.PanVol(0, -100).connect(masterEQ);

        // send to master reverb
        reverbSends[i] = new Tone.Gain(0).connect(reverbHeat);
        panVols[i].connect(reverbSends[i]);

        // initialize effects
        delays[i] = new Tone.FeedbackDelay("8n", 0).connect(panVols[i]);

        tremolos[i] = new Tone.Tremolo({ frequency: 5, depth: 0, wet: 0 })
            .connect(delays[i])
            .start();

        choruses[i] = new Tone.Chorus({
            frequency: 4,
            delayTime: 2.5,
            depth: 0,
            wet: 0,
            spread: 180,
        })
            .connect(tremolos[i])
            .start();

        bitcrushers[i] = new Tone.BitCrusher({ bits: 4, wet: 0 }).connect(
            choruses[i],
        );

        distortions[i] = new Tone.Distortion({ distortion: 0, wet: 0 }).connect(
            bitcrushers[i],
        );

        // initialize filters
        hpFilters[i] = new Tone.Filter(10, "highpass").connect(distortions[i]);
        lpFilters[i] = new Tone.Filter(5000, "lowpass").connect(hpFilters[i]);

        // initialize the amp envelope
        ampEnvs[i] = new Tone.AmplitudeEnvelope({
            attack: 0.0,
            decay: 2.0,
            sustain: 1.0,
            release: 1.0,
        }).connect(lpFilters[i]);

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

        instruments[i].connect(ampEnvs[i]);
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

// initialize all controls, audio engine and api
window.onload = function () {
    // core setup
    Tone.Transport.bpm.value = currentData.bpm;
    initInstruments();
    initMasterParams();
    initTransport();

    // control setup
    initGlobalControls();
    initSequencer();
    initTrackParams();
    initMasterParams();

    //initPageSelectors();

    //loadSequences(); REENABLE ***
    //loadSamples(); REENABLE ***

    // initialize track params. *** DO WE NEED THIS??? ***
    Tone.loaded().then(() => {
        currentData.tracks.forEach((track, i) => {
            if (i == 10) return;
            panVols[i].volume.value = track.volume;
            panVols[i].pan.value = track.pan;
        });

        currentTrack = 0;
        renderParams();

        setupAudioLoop();
    });
    renderMasterParams();
};

////////////////////////// Loop Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\

// schedule the loop
function setupAudioLoop() {
    // clear any existing loop
    Tone.Transport.cancel();

    Tone.Transport.scheduleRepeat((time) => {
    const totalSteps = parseInt(currentData.length) * 16;
        // play the sounds for the current step
        currentData.tracks.forEach((track, index) => {
            untoggleTrackHit(index);
            if (track.steps[currentStep] == 1) {
                toggleTrackHit(index);
                playTrackSound(index, time);
            }
        });

        // schedule the UI to move ONLY when the audio actually hits
        // pass the currentStep into the Draw function
        let stepToDraw = currentStep;
        Tone.Draw.schedule(() => {
            updateUIPlayHead(stepToDraw);

            // flash to bpm
            if (stepToDraw % 4 === 0) {
                togglePageHit(stepToDraw);
            }
        }, time);

        // increment for the next time the loop runs
        currentStep = (currentStep + 1) % totalSteps;
                console.log("out");
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
    // only apply volume if not muted
    if (!panVols[currentTrack].mute) {
        if (instant) {
            panVols[currentTrack].volume.value = val;
        } else {
            panVols[currentTrack].volume.rampTo(val, 0.05);
        }
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

// track effects
function setTrackDistortion(val) {
    distortions[currentTrack].wet.value = val;
    distortions[currentTrack].distortion = val;
}

function setTrackBitcrusher(val) {
    bitcrushers[currentTrack].wet.value = val;
}

function setTrackChorusRate(val) {
    choruses[currentTrack].frequency.value = val;
}

function setTrackChorusDepth(val) {
    choruses[currentTrack].depth = val;
}

function setTrackChorusMix(val) {
    choruses[currentTrack].wet.value = val;
}

function setTrackTremoloRate(val) {
    tremolos[currentTrack].frequency.value = val;
}

function setTrackTremoloDepth(val) {
    tremolos[currentTrack].depth.value = val;
}

function setTrackTremoloMix(val) {
    tremolos[currentTrack].wet.value = val;
}

function setTrackDelayTime(val) {
    delays[currentTrack].delayTime.rampTo(val, 0.1);
}

function setTrackDelayFeedback(val) {
    delays[currentTrack].feedback.rampTo(val, 0.1);
}

function setTrackDelayMix(val) {
    delays[currentTrack].wet.value = val;
}

function setTrackReverbSend(val) {
    reverbSends[currentTrack].gain.rampTo(val, 0.1);
}

////////////////////////// Master Track Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\

// reverb
function setMasterCompression(val) {
    masterCompressor.threshold.value = val;
}

function setMasterDirt(val) {
    reverbHeat.order = Math.floor(val);
}

function setMasterDirtMix(val) {
    reverbHeat.wet.value = val;
}

async function setMasterSpace(val) {
    masterReverb.decay = Math.min(0.001, val);
    await masterReverb.generate();
}

function setMasterPredelay(val) {
    masterReverb.preDelay = val;
}

function setMasterReverbWidth(val) {
    // 0 = mono, 1 = very Wide
    reverbWidener.width.rampTo(val, 0.1);
}

function setMasterReverbLimit(val) {
    reverbLimiter.threshold.value = val;
}

// eq

function setMasterEqLow(val) {
    masterEQ.low.value = val;
}

function setMasterEqMid(val) {
    masterEQ.mid.value = val;
}

function setMasterEqHigh(val) {
    masterEQ.high.value = val;
}

// compressor
function setMasterCompThresh(val) {
    masterCompressor.threshold.rampTo(Math.min(0, val), 0.1);
}

function setMasterCompRatio(val) {
    masterCompressor.ratio.rampTo(val, 0.1);
}

function setMasterCompAttack(val) {
    masterCompressor.attack.rampTo(val, 0.1);
}

function setMasterCompRelease(val) {
    masterCompressor.release.rampTo(val, 0.1);
}

function setMasterCompKnee(val) {
    masterCompressor.knee.rampTo(val, 0.1);
}

// saturator
function setMasterSatDrive(val) {
    masterSaturator.distortion = val;
}

function setMasterSatTone(val) {
    saturatorFilter.frequency.rampTo(val, 0.1);
}

function setMasterSatMix(val) {
    masterSaturator.wet.value = val;
}

// Limiter

function setMasterLimitThresh(val) {
    masterLimiter.threshold.rampTo(Math.min(0, val), 0.05);
}