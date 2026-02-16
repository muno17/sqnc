// ****************** sequencer functionality ****************** \\

function initSequencer() {
    const sequence = document.getElementById("sequencer");

    // activate the step on double click
    sequence.addEventListener("dblclick", function (e) {
        // check if an actual step was clicked
        if (e.target.classList.contains("step")) {
            // grab the step index
            const step = parseInt(e.target.dataset.step);

            // toggle the data in the master object
            const currentVal = currentData.tracks[currentTrack].steps[step];
            if (currentVal === 0) {
                currentData.tracks[currentTrack].steps[step] = 1;
            } else {
                currentData.tracks[currentTrack].steps[step] = 0;
            }

            e.target.classList.toggle("active");
            markAsChanged();
        }
    });
}

function renderSequencer() {
    if (currentTrack == 99) {
        return;
    }

    // look at currentdata and add values to sequence for current track
    const steps = document.querySelectorAll(".step");
    const currentSeq = currentData.tracks[currentTrack].steps;

    steps.forEach((stepBtn, index) => {
        if (currentSeq[index] === 1) {
            stepBtn.classList.add("active");
        } else {
            stepBtn.classList.remove("active");
        }
    });
}

// code to update sequencer UI position
function updateUIPlayHead(step) {
    if (!running) return;
    
    const previous = document.querySelector(".step.current");
    if (previous) {
        previous.classList.remove("current");
    }

    const current = document.querySelector(`.step[data-step="${step}"]`);
    if (current) {
        current.classList.add("current");
    }
}

function disableSequencer(message) {
    const playBtn = document.getElementById("transport");

    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.position = 0;
    running = false;
    currentStep = 0;

    document.querySelectorAll(".step").forEach((el) => {
        el.classList.remove("current");
    });

    playBtn.disabled = true;
    playBtn.innerHTML = message;
}

function enableSequencer() {
    const playBtn = document.getElementById("transport");
    playBtn.disabled = false;
    playBtn.innerHTML = "Play";
}