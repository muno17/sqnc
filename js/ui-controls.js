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
                stopAllSounds();
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
            currentData.masterVolume = parseFloat(this.value);
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

    // init master track ***

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
    var selector = document.getElementById("sequences");

    if (selector) {
        selector.addEventListener("change", function () {
            var selectedId = this.value;

            if (selectedId != "new") {
                // getSequence(selectedId); REENABLE
            } else {
                // CALL FUNCTION TO RESET INTERFACE ***
            }
        });
    }
}

// update all params to track's saved value ***
function renderParams() {
    // get current track and update params from currentData ********
    // true = instant snap to value
    const track = currentData.tracks[currentTrack];

    updateVolumeUI(track.volume);
    setTrackVolume(track.volume, true);

    updatePanUI(track.pan);
    setTrackPan(track.pan, true);

    updatePitchUI(track.pitch);
    setTrackPitch(track.pitch);

    updateStartUI(track.start);
    setTrackStart(track.start);

    updateAttackUI(track.attack);
    setTrackAttack(track.attack);

    updateDecayUI(track.decay);
    setTrackDecay(track.decay);

    updateSustainUI(track.sustain);
    setTrackSustain(track.sustain);

    updateReleaseUI(track.release);
    setTrackRelease(track.release);

    updateLpWidthUI(track.lpWidth);
    setTrackLpWidth(track.lpWidth);

    updateLpQUI(track.lpq);
    setTrackLpQ(track.lpq);

    updateHpWidthUI(track.hpWidth);
    setTrackHpWidth(track.hpWidth);

    updateHpQUI(track.hpq);
    setTrackHpQ(track.hpq);
}
///////////////////////// Track Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\
// listeners for all track parameters
// update changes if any parameter is changed

function initTrackParams() {
    initVol();
    initPan();
    initPitch();
    initStart();
    initAttack();
    initDecay();
    initSustain();
    initRelease();
    initLpWidth();
    initLpQ();
    initHpWidth();
    initHpQ();
}

// update UI based on what track is selected ***
function syncUI(data) {}

function initVol() {
    const volume = document.getElementById("volume");

    volume.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].volume = val;

        updateVolumeUI(val);
        setTrackVolume(val);
    });
}

function updateVolumeUI(val) {
    const volume = document.getElementById("volume");
    const volumeDisplay = document.getElementById("volumeDisplay");

    volume.value = val;
    volumeDisplay.innerHTML = val + "dB";
}

function initPan() {
    const pan = document.getElementById("pan");

    pan.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].pan = val;

        updatePanUI(val);
        setTrackPan(val);
    });
}

function updatePanUI(val) {
    const pan = document.getElementById("pan");
    const panDisplay = document.getElementById("panDisplay");

    // format the value so it displays 0-100
    pan.value = val;
    panDisplay.innerHTML = parseInt(val * 50);
}

function initPitch() {
    const pitch = document.getElementById("pitch");

    pitch.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].pitch = val;

        updatePitchUI(val);
        setTrackPitch(val);
    });
}

function updatePitchUI(val) {
    const pitch = document.getElementById("pitch");
    const pitchDisplay = document.getElementById("pitchDisplay");

    // format the value so it displays from -12 to +12 in .1 increments
    const num = parseFloat(val)
    const formattedVal = num.toFixed(1);
    var sign = "";
    if (num > 0) {
        sign = "+";
    }

    pitch.value = val;
    pitchDisplay.innerHTML = sign + formattedVal;
}

function initStart() {
    const start = document.getElementById("start");

    start.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].start = val;

        updateStartUI(val);
        setTrackStart(val);
    });
}

function updateStartUI(val) {
    const start = document.getElementById("start");
    const startDisplay = document.getElementById("startDisplay");

    // format the value so it displays 0-100
    start.value = val;
    startDisplay.innerHTML = parseInt(val * 100);
}

function initAttack() {
    const attack = document.getElementById("attack");

    attack.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].attack = val;

        updateAttackUI(val);
        setTrackAttack(val);
    });
}

function updateAttackUI(val) {
    const attack = document.getElementById("attack");
    const attackDisplay = document.getElementById("attackDisplay");

    // format the value so it displays 0-100
    attack.value = val;
    attackDisplay.innerHTML = parseInt(val * 50);
}

function initDecay() {
    const decay = document.getElementById("decay");

    decay.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].decay = val;

        updateDecayUI(val);
        setTrackDecay(val);
    });
}

function updateDecayUI(val) {
    const decay = document.getElementById("decay");
    const decayDisplay = document.getElementById("decayDisplay");

    // format the value so it displays 0-100
    decay.value = val;
    decayDisplay.innerHTML = parseInt(val * 50);
}

function initSustain() {
    const sustain = document.getElementById("sustain");

    sustain.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].sustain = val;

        updateSustainUI(val);
        setTrackSustain(val);
    });
}

function updateSustainUI(val) {
    const sustain = document.getElementById("sustain");
    const sustainDisplay = document.getElementById("sustainDisplay");

    // format the value so it displays 0-100
    sustain.value = val;
    sustainDisplay.innerHTML = parseInt(val * 100);
}

function initRelease() {
    const release = document.getElementById("release");

    release.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].release = val;

        updateReleaseUI(val);
        setTrackRelease(val);
    });
}

function updateReleaseUI(val) {
    const release = document.getElementById("release");
    const releaseDisplay = document.getElementById("releaseDisplay");

    // format the value so it displays 0-100
    release.value = val;
    releaseDisplay.innerHTML = parseInt(val * 20);
}

function initLpWidth() {
    const lp = document.getElementById("lpWidth");

    lp.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].lpWidth = val;

        updateLpWidthUI(val);
        setTrackLpWidth(val);
    });
}

function updateLpWidthUI(val) {
    const lp = document.getElementById("lpWidth");
    const lpWidthDisplay = document.getElementById("lpWidthDisplay");

    lp.value = val;

    if (val >= 1000) {
        lpWidthDisplay.innerHTML = (val / 1000).toFixed(1) + "kHz";
    } else {
        lpWidthDisplay.innerHTML = Math.round(val) + "Hz";
    }
}

function initLpQ() {
    const q = document.getElementById("lpq");

    q.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].lpq = val;

        updateLpQUI(val);
        setTrackLpQ(val);
    });
}

function updateLpQUI(val) {
    const q = document.getElementById("lpq");
    const qWidthDisplay = document.getElementById("lpqDisplay");

    // format the value so it displays 0-100
    q.value = val;
    qWidthDisplay.innerHTML = parseInt(val * 5);
}

function initHpWidth() {
    const hp = document.getElementById("hpWidth");

    hp.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].hpWidth = val;

        updateHpWidthUI(val);
        setTrackHpWidth(val);
    });
}

function updateHpWidthUI(val) {
    const hp = document.getElementById("hpWidth");
    const hpWidthDisplay = document.getElementById("hpWidthDisplay");

    hp.value = val;

    if (val >= 1000) {
        hpWidthDisplay.innerHTML = (val / 1000).toFixed(1) + "kHz";
    } else {
        hpWidthDisplay.innerHTML = Math.round(val) + "Hz";
    }
}

function initHpQ() {
    const q = document.getElementById("hpq");

    q.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].hpq = val;

        updateHpQUI(val);
        setTrackHpQ(val);
    });
}

function updateHpQUI(val) {
    const q = document.getElementById("hpq");
    const qWidthDisplay = document.getElementById("hpqDisplay");

    // format the value so it displays 0-100
    q.value = val;
    qWidthDisplay.innerHTML = parseInt(val * 5);
}