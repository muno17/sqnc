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
            //renderParams();
        });
    });
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
}
