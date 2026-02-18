////////////////////////// Audio Functionality \\\\\\\\\\\\\\\\\\\\\\\\\\
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

    reverbHeat.chain(masterReverb, reverbWidener, reverbLimiter, masterEQ);

    masterReverb.generate();
}

// init samples for when user is not logged in
var initSamples = {
    tracks: [
        {
            samplePath: "",
            sampleName: "",
        },
    ],
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

        instruments[i] = new Tone.Player({
            url: null,
            autostart: false,
            fadeOut: "64n",
        });

        instruments[i].connect(ampEnvs[i]); // *** is this right? conecting instruments twice?
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
window.onload = async function () {
    try {
        await checkLoginStatus();

        // audio setup
        Tone.Transport.bpm.value = currentData.bpm;
        initTransport();

        // control setup
        initGlobalControls();
        initSequencer();
        initTrackParams();
        initMasterParams();

        // api setup for logged in users
        if (loggedIn) {
            loadSequences();
            loadSamples();
        }

        // initialize instruments and track params *** DO WE NEED THIS??? ***
        initInstruments();
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
        removeLoadingScreen();
    } catch (error) {
        console.error("Failed to load:", error);
        document.querySelector(".loading-box h3").innerText = "Load Failed :(";
    }
};

function removeLoadingScreen() {
    // remove loading screen, add a bit of extra time for everything to shift into place
    setTimeout(() => {
        const loader = document.getElementById("loading-overlay");
        loader.style.opacity = "0";
        loader.style.transition = "opacity 0.5s ease";

        setTimeout(() => {
            loader.classList.add("hidden");
        }, 500);
    }, 500);
}
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
