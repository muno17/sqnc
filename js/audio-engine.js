var currentTrack = 0;

Tone.Transport.loop = true;
Tone.Transport.loopEnd = '1m';

const projectData = {
    bpm: 120,
    masterVolume: -6,
    tracks: [
        {}
    ]
}

// initialize everything here
window.onload = function() {
 initGlobalControls();
 initTransport();
// initSequencer();


}