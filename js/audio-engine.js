var currentTrack = 0;
var currentStep = 0;
var length = '1m'
var running = false;
const instruments = [];

Tone.Transport.loop = true;
Tone.Transport.loopEnd = length;

// massive JSON object to contain all information
const projectData = {
    bpm: 120,
    masterVolume: -6,
    length: length,
    tracks: [
        {
            id: 0,
            //sample: test,
            volume: -6,
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
    ],
};

// load samples into tone.js samplers
function initInstruments() {
    instruments[0] = new Tone.Sampler({
        urls: {
            C1: "samples/Marshalls Kick.wav",
        }
    }).toDestination();

    instruments[1] = new Tone.Sampler({
        urls: {
            C1: "samples/Marshalls Open.wav",
        }
    }).toDestination();

    instruments[2] = new Tone.Sampler({
        urls: {
            C1: "samples/Marshalls Clap.wav",
        }
    }).toDestination();

    instruments[3] = new Tone.Sampler({
        urls: {
            C1: "samples/OB Nebula Pad.wav",
        },
    }).toDestination();
}



// initialize everything here
window.onload = function() {
 initInstruments();
 initGlobalControls();
 initTransport();
 initTrackSelectors();
 initPageSelectors();
 initSequencer();
 initTrackParams();
}

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
    }, '16n')
}

function playTrackSound(index,time) {
    const instrument = instruments[index];
    if(instrument) {
        instrument.triggerAttackRelease("C1", "8n", time);
    }
}