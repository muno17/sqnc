// UI event listeners
// modify based on whether user is logged in or not

////////////////////////// Global Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\
function initTransport() {
    const transport = document.getElementById("transport");

    if (transport) {
        transport.addEventListener("click", async function () {
            if (running) {
                running = false;
                // functionality to stop
                Tone.Transport.stop();
                //currentStep = 0;
                //updateUIPlayHead(-1);
                document
                    .querySelectorAll(".step.current")
                    .forEach((el) => el.classList.remove("current"));
                transport.innerHTML = "Play";
            } else {
                // functionality to play
                await Tone.start();
                await Tone.loaded();

                currentStep = 0;

                running = true;
                Tone.Transport.start();
                transport.innerHTML = "Stop";
                console.log("Sequencer started - all mappings verified.");
            }
        });
    }
}

function initRecord() {
    if (record) {
        record.addEventListener("click", function () {});
    }
}

function initGlobalControls() {
    const tempo = document.getElementById("tempo");
    const tempoDisplay = document.getElementById("tempoDisplay");

    if (tempo) {
        tempo.addEventListener("input", function () {
            currentData.bpm = this.value;
            tempoDisplay.innerHTML = this.value;
            Tone.Transport.bpm.value = this.value;
        });
    }

    const master = document.getElementById("master");
    const masterDisplay = document.getElementById("masterDisplay");

    if (master) {
        master.addEventListener("input", function () {
            currentData.masterVolume = this.value;
            masterDisplay.innerHTML = this.value + "dB";
            Tone.Destination.volume.rampTo(this.value, 0.1);
        });
    }

    initPageSelectors();
    initSave();
    initReload();
    initNew();

    // swing

    // effects
}

function initPageSelectors() {
    const pageBtns = document.querySelectorAll(".page");

    pageBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            pageBtns.forEach((b) => b.classList.remove("selected"));
            this.classList.add("selected");

            currentPage = parseInt(this.dataset.index);
        });
    });
}

// init for save
// save currentData
// assign a copy of currentData to projectData on success ***
// 'glow' if there are changes to be made, remove if saved or if reloaded
function initSave() {
    const saveBtn = document.getElementById("save");
    if (saveBtn) {
        saveBtn.addEventListener("click", function () {
            // don't do anything if there isn't anything to save;
            if (changes) {
                //saveSequence(); REENABLE
                saveBtn.classList.remove("changes");
                changes = false;
            }
        });
    }
}

// init for reload ***
// revert back to last loaded projectData
function initReload() {
    const reloadBtn = document.getElementById("reload");
    const saveBtn = document.getElementById("save");
    if (reloadBtn && saveBtn) {
        reloadBtn.addEventListener("click", function () {
            // don't do anything if there aren't any changes
            if (changes) {
                saveBtn.classList.remove("changes");
                currentData = JSON.parse(JSON.stringify(projectData));
                changes = false;

                // redraw the UI
                renderSequencer();
                renderParams();
            }
        });
    }
}

// init for new ***
function initNew() {
    const newBtn = document.getElementById("new");
    const saveBtn = document.getElementById("save");
    if (newBtn && saveBtn) {
        newBtn.addEventListener("click", function () {
            // show warning before reseting
            if (changes) {
                saveBtn.classList.remove("changes");
                // copy projectData into currentData
                projectData = JSON.parse(JSON.stringify(currentData));
                changes = false;
            }
            // create completely new empty data object, set to currentData ***
        });
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

function initSequenceSelector() {
    var selector = document.getElementById('sequences');

    if (selector) {
        selector.addEventListener('change', function() {
            var selectedId = this.value;

            if (selectedId != 'new') {
                // getSequence(selectedId); REENABLE
            } else {
                // CALL FUNCTION TO RESET INTERFACE ***
            }
        })
    }
}

// update all params to track's saved value ***
function renderParams() {
    // get current track and update params from currentData ********
    updateVolumeUI(data.volume);
    setTrackVolume(data.volume, true); // Use 'true' for instant snap

    updatePanUI(data.pan);
    setTrackPan(data.pan, true);
}
///////////////////////// Track Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\
// listeners for all track parameters
// update changes if any parameter is changed

function initTrackParams() {
    initVol();
    initPan();
}

// update UI based on what track is selected ***
function syncUI(data) {}

function initVol() {
    const volume = document.getElementById("volume");

    if (volume) {
        volume.addEventListener("input", function () {
            const val = parseFloat(this.value);
            currentData.tracks[currentTrack].volume = val;

            updateVolumeUI(val);
            setTrackVolume(val);
        });
    }
}

function updateVolumeUI(val) {
    const volume = document.getElementById("volume");
    const volumeDisplay = document.getElementById("volumeDisplay");

    if (volume) {
        volume.value = val;
        volumeDisplay.innerHTML = val + "dB";
    }
}

function initPan() {
    const pan = document.getElementById("pan");


    if (pan) {
        pan.addEventListener("input", function () {
            const val = parseFloat(this.value);
            currentData.tracks[currentTrack].pan = val;

            updatePanUI(val);
            setTrackPan(val);
        })
    }
}

function updatePanUI(val) {
    const pan = document.getElementById("pan");
    const panDisplay = document.getElementById("panDisplay");

    if (pan) {
        pan.value = val;
        panDisplay.innerHTML = parseInt(val * 50);
    }
}