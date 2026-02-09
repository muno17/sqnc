// ****************** sequencer functionality ****************** \\

function initSequencer() {
    const sequence = document.getElementById("sequencer");

    if (sequence) {
        sequence.addEventListener("click", function (e) {
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
            }
        });
    }
}

// update all params to track's saved value
function renderParams() {
    // get current track and update params from currentData ********
    updateVolumeUI(currentData.tracks[currentTrack].volume, true);
}

function renderSequencer() {
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
    const previous = document.querySelector(".step.current");
    if (previous) {
        previous.classList.remove("current");
    }

    const current = document.querySelector(`.step[data-step="${step}"]`);
    if (current) {
        current.classList.add("current");
    }
}
