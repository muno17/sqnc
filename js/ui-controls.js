/*
window.onload = function () {
    const tempo = document.getElementById("tempo");
    const tempoDisplay = document.getElementById("tempoDisplay");

    tempo.addEventListener("input", function () {
        tempoDisplay.innerHTML = this.value;
    });



};
*/

function initTransport() {
    const play = document.getElementById("play");
    const stop = document.getElementById("stop");
    const record = document.getElementById("record");

    if (play) {
        play.addEventListener('click', async function() {
            await Tone.start();
            Tone.Transport.start();
        })
    }

    if (stop) {
        stop.addEventListener("click", function () {
            Tone.Transport.stop();
        });
    }

    if (record) {
        record.addEventListener("click", function () {
            
        });
    }
}

function initGlobalControls() {
    const tempo = document.getElementById("tempo");
    const tempoDisplay = document.getElementById("tempoDisplay");

    if (tempo) {
        tempo.addEventListener("input", function () {
            projectData.bpm = this.value;
            tempoDisplay.innerHTML = this.value;
            Tone.Transport.bpm.value = this.value;
        });
    }

    const vol = document.getElementById("vol");
    const volDisplay = document.getElementById("volDisplay");

    if (vol) {
        vol.addEventListener("input", function () {
            projectData.masterVolume = this.value;
            volDisplay.innerHTML = this.value + "db";
            Tone.Destination.volume.rampTo(this.value, 0.1);
        });
    }
    
// master volume

// reset

// swing

// effects
}

function initSequencer() {

}