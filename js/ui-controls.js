// UI event listeners
// modify based on whether user is logged in or not

////////////////////////// Global Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\
function initTransport() {
    const transport = document.getElementById("transport");

    transport.addEventListener("click", async function () {
        if (running) {
            stopTransport();
        } else {
            startTransport();
        }
    });
}

async function startTransport() {
    const transport = document.getElementById("transport");
    // functionality to play
    await Tone.start();
    await Tone.loaded();

    currentStep = 0;

    running = true;
    Tone.Transport.start();
    transport.innerHTML = "Stop";
}

function stopTransport() {
    const transport = document.getElementById("transport");
    running = false;
    // functionality to stop
    Tone.Transport.stop();
    stopAllSounds();

    document
        .querySelectorAll(".step.current")
        .forEach((el) => el.classList.remove("current"));
    transport.innerHTML = "Play";
}

function initRecord() {
    const record = document.getElementById("record");

    const transport = document.getElementById("transport");

    record.addEventListener("click", async function () {
        if (recording) {
            // stop recording
            stopTransport();

            recording = false;
            record.innerHTML = "Record";
            record.classList.remove("recording");

            const recordedAudio = await recorder.stop();

            // create a link and click it automatically to start download
            const url = URL.createObjectURL(recordedAudio);
            const anchor = document.createElement("a");
            anchor.download = "recording.webm";
            anchor.href = url;
            anchor.click();

            transport.disabled = false;
        } else {
            // countdown with metronome ***

            // start recording
            transport.disabled = true;
            recording = true;
            record.innerHTML = "Stop";
            record.classList.add("recording");

            // reset the transport
            stopTransport();
            startTransport();
        }
        recorder.start();
    });
}

function initTempo() {
    const tempo = document.getElementById("tempo");
    const tempoDisplay = document.getElementById("tempoDisplay");

    tempo.addEventListener("input", function () {
        console.log(this.value);
        currentData.bpm = parseInt(this.value);
        tempoDisplay.innerHTML = this.value;
        Tone.Transport.bpm.value = this.value;
        markAsChanged();
    });
}

function initMasterVol() {
    const masterVol = document.getElementById("masterVol");
    const masterVolDisplay = document.getElementById("masterVolDisplay");

    masterVol.addEventListener("input", function () {
        currentData.masterVolume = parseFloat(this.value);
        masterVolDisplay.innerHTML = this.value + "dB";
        Tone.Destination.volume.rampTo(this.value, 0.1);
        markAsChanged();
    });
}

function initSwing() {
    Tone.Transport.swingSubdivision = "16n";
    const swing = document.getElementById("swing");
    const swingDisplay = document.getElementById("swingDisplay");

    swing.addEventListener("input", function () {
        currentData.swing = this.value;
        Tone.Transport.swing = this.value;

        // calculate value to display 0-100
        swingDisplay.innerHTML = parseInt(this.value * 100);
        markAsChanged();
    });
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

// save currentData
// assign a copy of currentData to projectData on success ***
// 'glow' if there are changes to be made, remove if saved or if reloaded
function initSave() {
    const saveBtn = document.getElementById("save");
    if (saveBtn) {
        saveBtn.addEventListener("click", async function () {
            // don't do anything if there isn't anything to save;
            if (changes) {
                await saveSequence();

                saveBtn.classList.remove("changes");
                changes = false;
            }
        });
    }
}

// make the save button glow when changes have been made
function markAsChanged() {
    changes = true;
    const saveBtn = document.getElementById("save");
    if (saveBtn) {
        saveBtn.classList.add("changes");
    }
}

// revert back to last loaded projectData
function initReload() {
    const reloadBtn = document.getElementById("reload");
    const saveBtn = document.getElementById("save");

    reloadBtn.addEventListener("click", function () {
        // don't do anything if there aren't any changes
        if (changes) {
            saveBtn.classList.remove("changes");
            currentData = JSON.parse(JSON.stringify(projectData));
            changes = false;

            // stop the current audio and reload instruments
            stopAllSounds();
            loadInstruments();

            // redraw the UI
            renderSequencer();
            renderParams();
        }
    });
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
                // copy initData into projectData
                projectData = JSON.parse(JSON.stringify(initData));
                changes = false;
            }
            // create completely new empty data object, set to currentData ***
        });
    }
}

function initSampleSelector() {
    const selector = document.getElementById("samples");

    selector.addEventListener("change", function () {
        if (this.value === "upload") {
            return;
        }

        // update data
        const path = this.value;
        const name = this.options[this.selectedIndex].dataset.name;
        currentData.tracks[currentTrack].samplePath = path;
        currentData.tracks[currentTrack].name = name;

        // update audio engine
        instruments[currentTrack].load(path, () => {
            console.log("Loaded: " + name);
            renderParams();
            markAsChanged();
        });
    });
}

function initTrackSelectors() {
    const trackBtns = document.querySelectorAll(".trackBtn");

    // init master track ***

    trackBtns.forEach((btn) => {
        const index = parseInt(btn.dataset.index);
        // for single clicks, display the track's parameters
        btn.addEventListener("click", function () {
            trackBtns.forEach((b) => b.classList.remove("selected"));
            this.classList.add("selected");

            currentTrack = index;

            renderSequencer();
            renderParams();
        });

        // for double clicks, mute the track
        btn.addEventListener("dblclick", function () {
            console.log("triggered");
            if (currentData.tracks[index].muted) {
                currentData.tracks[index].muted = false;
                panVols[index].mute = false;
                this.classList.remove("muted");
            } else {
                currentData.tracks[index].muted = true;
                panVols[index].mute = true;
                this.classList.add("muted");
            }
        });
    });
}

function initSequenceSelector() {
    var selector = document.getElementById("sequences");

    selector.addEventListener("change", function () {
        var selectedId = this.value;

        if (selectedId != "new") {
            // getSequence(selectedId); REENABLE
        } else {
            // CALL FUNCTION TO RESET INTERFACE ***
        }
    });
}

// clear sequence for current track
function initClear() {
    var clear = document.getElementById("clear");

    clear.addEventListener("click", function () {
        currentData.tracks[currentTrack].steps = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        ];
        renderSequencer();
        markAsChanged();
    });
}

function toggleTrackHit(index) {
    const trackBtns = document.querySelectorAll(".trackBtn");
    trackBtns[index].classList.add("flash")
}

function untoggleTrackHit(index) {
    const trackBtns = document.querySelectorAll(".trackBtn");
    trackBtns[index].classList.remove("flash");
}

function initGlobalControls() {
    initTempo();
    initMasterVol();
    initSwing();
    initPageSelectors();
    initSave();
    initReload();
    initNew();
    initRecord();
    initClear();

    // effects
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

        markAsChanged();
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

        markAsChanged();
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

        markAsChanged();
    });
}

function updatePitchUI(val) {
    const pitch = document.getElementById("pitch");
    const pitchDisplay = document.getElementById("pitchDisplay");

    // format the value so it displays from -12 to +12 in .1 increments
    const num = parseFloat(val);
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

        markAsChanged();
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

        markAsChanged();
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

        markAsChanged();
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

        markAsChanged();
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

        markAsChanged();
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

        markAsChanged();
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

        markAsChanged();
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

        markAsChanged();
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

        markAsChanged();
    });
}

function updateHpQUI(val) {
    const q = document.getElementById("hpq");
    const qWidthDisplay = document.getElementById("hpqDisplay");

    // format the value so it displays 0-100
    q.value = val;
    qWidthDisplay.innerHTML = parseInt(val * 5);
}

// update all params to track's saved value ***
function renderParams() {
    // get current track and update params from currentData ********
    // true = instant snap to value
    const track = currentData.tracks[currentTrack];

    const nameDisplay = document.getElementById("sampleNameDisplay");
    if (nameDisplay) {
        nameDisplay.innerText = track.sampleName || "No Sample Loaded";
    }

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
