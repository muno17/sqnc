// sequencer functionality

function initSequencer() {
    const sequence = document.getElementById("sequencer");

    if (sequence) {
        sequence.addEventListener('click', function(e) {
            // check if an actual step was clicked
            if (e.target.classList.contains('step')) {
                // grab the step index
                const step = parseInt(e.target.dataset.step);

                // toggle the data in the master object
                const currentVal = projectData.tracks[currentTrack].steps[step];
                if (currentVal === 0) {
                    projectData.tracks[currentTrack].steps[step] = 1; 
                } else {
                    projectData.tracks[currentTrack].steps[step] = 0; 
                }

                e.target.classList.toggle('active');
            }
        })
    }
}

function initTrackSelectors() {
    const trackBtns = document.querySelectorAll(".trackBtn");

    trackBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            trackBtns.forEach((b) => b.classList.remove("selected"));
            this.classList.add("selected");

            currentTrack = parseInt(this.dataset.index);

            renderSequencer();
            renderParams();
        });
    });
}

// update all params to track's saved value
function renderParams() {
        updateVolumeUI(projectData.tracks[currentTrack].volume, true);
}

function renderSequencer() {
    // look at project data and add values to sequence for currnet track
    const steps = document.querySelectorAll(".step");
    const currentData = projectData.tracks[currentTrack].steps;

    steps.forEach((stepBtn, index) => {
        if (currentData[index] === 1) {
            stepBtn.classList.add("active");
        } else {
            stepBtn.classList.remove("active");
        }
    });

    // update track specific sliders
}

// code to update sequencer UI position
function updateUIPlayHead(step) {
    const previous = document.querySelector('.step.current');
    if (previous) {
        previous.classList.remove('current');
    }

    const current = document.querySelector(`.step[data-step="${step}"]`);
    if (current) {
        current.classList.add("current");
    }
}

/////// initialize all of the track parameters and event listeners ///////
// instant when switching tracks, not instant when just sliding slider
function initTrackParams() {
    const volume = document.getElementById("volume");

    if (volume) {
        volume.addEventListener("input", function () {
            const val = parseFloat(this.value);
            projectData.tracks[currentTrack].volume = val;
            updateVolumeUI(val);
        });
    }
}

function updateVolumeUI(val, instant = false) {
    const volume = document.getElementById("volume");
    const volumeDisplay = document.getElementById("volumeDisplay");

    if (volume) {
            volume.value = val;
            volumeDisplay.innerHTML = val + "dB";

            if (instant) {
            instruments[currentTrack].volume.value = val;
            } else {
                instruments[currentTrack].volume.rampTo(val, 0.05);
            }
    };
}

function updateProjectData() {
    projectData = Object.clone(currentData);
}