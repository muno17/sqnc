function initTrackSelectors() {
    const trackBtns = document.querySelectorAll(".trackBtn");

    trackBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            trackBtns.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');

            currentTrack = parseInt(this.data-index);

            //renderSequencer();
            //renderParams();
        })
    })
}

function initPageSelectors() {
    const trackBtns = document.querySelectorAll(".trackBtn");

    trackBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            trackBtns.forEach((b) => b.classList.remove("selected"));
            this.classList.add("selected");

            currentTrack = parseInt(this.data - index);

            //renderSequencer();
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