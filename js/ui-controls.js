// UI event listeners
// modify based on whether user is logged in or not

////////////////////////// Global Parameters \\\\\\\\\\\\\\\\\\\\\\\\\\
function initTransport() {
    const transport = document.getElementById("transport");

    transport.addEventListener("click", async function () {
        //await Tone.start();
        if (running) {
            stopTransport();
        } else {
            startTransport();
        }
    });
}

async function startTransport() {
    const transport = document.getElementById("transport");
    Tone.context.resume();
    // functionality to play
    //await Tone.start();

    //await Tone.loaded();

    currentStep = 0;
    updateUIPlayHead(0);
    running = true;
    Tone.Transport.start("+0");
    transport.innerHTML = "Stop";
}

function stopTransport() {
    const transport = document.getElementById("transport");
    running = false;
    // functionality to stop
    Tone.Transport.stop();
    stopAllSounds();
    Tone.Draw.cancel();


    currentStep = 0;

    document.querySelectorAll(".step").forEach((el) => {
        el.classList.remove("current");
    });
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

    // initiate the new sequence modal
    const overlay = document.getElementById("sequence-overlay");
    const closeBtn = document.getElementById("sequence-close-btn");
    const sequenceInitBtn = document.getElementById("sequence-init-btn");
    const seqName = document.getElementById("seq-name");
    const sequences = document.getElementById("sequences");

    function openModal() {
        seqName.value = "";
        overlay.classList.remove("modal-hidden");
        document.body.style.overflow = "hidden";
        seqName.focus();
    }

    function closeModal() {
        overlay.classList.add("modal-hidden");
        document.body.style.overflow = "auto";
    }

    // close when clicking the "Cancel" button in the modal
    closeBtn.addEventListener("click", closeModal);

    // close when clicking outside the box (on the dimmer) while in the modal
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
    });

    // clear out current sequence and create init sequence
    sequenceInitBtn.addEventListener("click", function () {
        // create name for the new sequence
        const name = seqName.value.trim() || "Untitled Sequence";

        // reset changes state
        if (changes) {
            saveBtn.classList.remove("changes");
            changes = false;
        }

        // update the sequences dropdown
        var newSeq = document.createElement("option");
        newSeq.value = "";
        newSeq.innerHTML = name;
        newSeq.selected = true;
        sequences.appendChild(newSeq);

        // copy initData into projectData and currentData and update with name
        projectData = JSON.parse(JSON.stringify(initData));
        currentData = JSON.parse(JSON.stringify(initData));

        projectData.name = name;
        currentData.name = name;

        // referesh UI
        stopTransport();
        renderSequencer();
        renderParams();

        closeModal();
    });

    newBtn.addEventListener("click", openModal);
}

function initSampleSelector() {
    const selector = document.getElementById("samples");

    selector.addEventListener("change", function () {
        if (this.value === "upload") {
            return;
        }

        // update data
        const trackToUpdate = currentTrack;
        const path = this.value;
        const name = this.options[this.selectedIndex].dataset.name;
        currentData.tracks[trackToUpdate].samplePath = path;
        currentData.tracks[trackToUpdate].sampleName = name;

        // update audio engine
        instruments[trackToUpdate].load(path);

        markAsChanged();
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
            // getSequence(selectedId); REENABLE***
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
    trackBtns[index].classList.add("flash");
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
    initTrackSelectors();
    initSequenceSelector();
    initSampleSelector();

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

    // effects
    initDistortion();
    initBitcrusher();
    initChorusRate();
    initChorusDepth();
    initChorusMix();
    initTremoloRate();
    initTremoloDepth();
    initTremoloMix();
    initDelayTime();
    initDelayFeedback();
    initDelayMix();
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

///////////////////////// Track Effects \\\\\\\\\\\\\\\\\\\\\\\\\\
function initDistortion() {
    const distortion = document.getElementById("distortion");

    distortion.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].distortion = val;

        updateDistortionUI(val);
        setTrackDistortion(val);

        markAsChanged();
    });
}

function updateDistortionUI(val) {
    const distortion = document.getElementById("distortion");
    const distortionDisplay = document.getElementById("distortionDisplay");

    // format the value so it displays 0-100
    distortion.value = val;
    distortionDisplay.innerHTML = parseInt(val * 100);
}

function initBitcrusher() {
    const bc = document.getElementById("bc");

    bc.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].bitcrusher = val;

        updateBitcrusherUI(val);
        setTrackBitcrusher(val);

        markAsChanged();
    });
}

function updateBitcrusherUI(val) {
    const bc = document.getElementById("bc");
    const bcDisplay = document.getElementById("bcDisplay");

    // format the value so it displays 0-100
    bc.value = val;
    bcDisplay.innerHTML = parseInt(val * 100);
}

function initChorusRate() {
    const rate = document.getElementById("chorusRate");

    rate.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].chorusRate = val;

        updateChorusRateUI(val);
        setTrackChorusRate(val);

        markAsChanged();
    });
}

function updateChorusRateUI(val) {
    const rate = document.getElementById("chorusRate");
    const rateDisplay = document.getElementById("chorusRateDisplay");

    // format the value so it displays 0-100
    rate.value = val;
    rateDisplay.innerHTML = parseInt(val * 20);
}

function initChorusDepth() {
    const depth = document.getElementById("chorusDepth");

    depth.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].chorusDepth = val;

        updateChorusDepthUI(val);
        setTrackChorusDepth(val);

        markAsChanged();
    });
}

function updateChorusDepthUI(val) {
    const depth = document.getElementById("chorusDepth");
    const depthDisplay = document.getElementById("chorusDepthDisplay");

    // format the value so it displays 0-100
    depth.value = val;
    depthDisplay.innerHTML = parseInt(val * 100);
}

function initChorusMix() {
    const mix = document.getElementById("chorusMix");

    mix.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].chorusMix = val;

        updateChorusMixUI(val);
        setTrackChorusMix(val);

        markAsChanged();
    });
}

function updateChorusMixUI(val) {
    const mix = document.getElementById("chorusMix");
    const mixDisplay = document.getElementById("chorusMixDisplay");

    // format the value so it displays 0-100
    mix.value = val;
    mixDisplay.innerHTML = parseInt(val * 100);
}

function initTremoloRate() {
    const rate = document.getElementById("tremRate");

    rate.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].tremRate = val;

        updateTremoloRateUI(val);
        setTrackTremoloRate(val);

        markAsChanged();
    });
}

function updateTremoloRateUI(val) {
    const rate = document.getElementById("tremRate");
    const rateDisplay = document.getElementById("tremRateDisplay");

    // format the value so it displays 0-100
    rate.value = val;
    rateDisplay.innerHTML = parseInt(val * 5);
}

function initTremoloDepth() {
    const depth = document.getElementById("tremDepth");

    depth.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].tremDepth = val;

        updateTremoloDepthUI(val);
        setTrackTremoloDepth(val);

        markAsChanged();
    });
}

function updateTremoloDepthUI(val) {
    const depth = document.getElementById("tremDepth");
    const depthDisplay = document.getElementById("tremDepthDisplay");

    // format the value so it displays 0-100
    depth.value = val;
    depthDisplay.innerHTML = parseInt(val * 100);
}

function initTremoloMix() {
    const mix = document.getElementById("tremMix");

    mix.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].tremMix = val;

        updateTremoloMixUI(val);
        setTrackTremoloMix(val);

        markAsChanged();
    });
}

function updateTremoloMixUI(val) {
    const mix = document.getElementById("tremMix");
    const mixDisplay = document.getElementById("tremMixDisplay");

    // format the value so it displays 0-100
    mix.value = val;
    mixDisplay.innerHTML = parseInt(val * 100);
}

function initDelayTime() {
    const time = document.getElementById("delTime");

    time.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].delTime = val;

        updateDelayTimeUI(val);
        setTrackDelayTime(val);

        markAsChanged();
    });
}

function updateDelayTimeUI(val) {
    const time = document.getElementById("delTime");
    const timeDisplay = document.getElementById("delTimeDisplay");

    // format the value so it displays 0-100
    time.value = val;
    timeDisplay.innerHTML = parseInt(val * 100);
}

function initDelayFeedback() {
    const feedback = document.getElementById("delFback");

    feedback.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].delFback = val;

        updateDelayFeedbackUI(val);
        setTrackDelayFeedback(val);

        markAsChanged();
    });
}

function updateDelayFeedbackUI(val) {
    const feedback = document.getElementById("delFback");
    const feedbackDisplay = document.getElementById("delFbackDisplay");

    // format the value so it displays 0-100
    feedback.value = val;
    feedbackDisplay.innerHTML = parseInt(val * 111.11);
}

function initDelayMix() {
    const mix = document.getElementById("delMix");

    mix.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].delMix = val;

        updateDelayMixUI(val);
        setTrackDelayMix(val);

        markAsChanged();
    });
}

function updateDelayMixUI(val) {
    const mix = document.getElementById("delMix");
    const mixDisplay = document.getElementById("delMixDisplay");

    // format the value so it displays 0-100
    mix.value = val;
    mixDisplay.innerHTML = parseInt(val * 100);
}

///////////////////////// Rendering \\\\\\\\\\\\\\\\\\\\\\\\\\

// show/hide the track specific and master track params
function renderParams() {
    const trackParams = document.getElementById("trackParams");
    const effectParams = document.getElementById("effectsHouse");
    const divider = document.getElementById("paramDivider");
    const selectorRow = document.getElementById("selectorRow"); // Sample selector

    // check if current track is master
    if (currentTrack === 99) {
        // hide the track specific UI
        selectorRow.classList.add("hidden");
        divider.classList.add("hidden");

        const rows = trackParams.querySelectorAll(".paramRow");
        rows.forEach((row, index) => {
            if (index > 1) row.classList.add("hidden");
        });

        const effectsRows = effectParams.querySelectorAll(".paramRow");
        effectsRows.forEach((row, index) => {
            if (index > -1) row.classList.add("hidden");
        });

        renderMasterParams();
    } else {
        // show the track specific UI
        selectorRow.classList.remove("hidden");
        divider.classList.remove("hidden");

        const rows = trackParams.querySelectorAll(".paramRow");
        rows.forEach((row) => row.classList.remove("hidden"));

        const effectsRows = effectParams.querySelectorAll(".paramRow");
        effectsRows.forEach((row) => row.classList.remove("hidden"));

        renderTrackParams();
    }
}

function renderMasterParams() {

}

// update all params to track's saved value
function renderTrackParams() {
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

    // upate effects first
    updateDistortionUI(track.distortion);
    setTrackDistortion(track.distortion);

    updateBitcrusherUI(track.bitcrusher);
    setTrackBitcrusher(track.bitcrusher);

    updateChorusRateUI(track.chorusRate);
    setTrackChorusRate(track.chorusRate);

    updateChorusDepthUI(track.chorusDepth);
    setTrackChorusDepth(track.chorusDepth);

    updateChorusMixUI(track.chorusMix);
    setTrackChorusMix(track.chorusMix);

    updateTremoloRateUI(track.tremRate);
    setTrackTremoloRate(track.tremRate);

    updateTremoloDepthUI(track.tremDepth);
    setTrackTremoloDepth(track.tremDepth);

    updateTremoloMixUI(track.tremMix);
    setTrackTremoloMix(track.tremMix);

    updateDelayTimeUI(track.delTime);
    setTrackDelayTime(track.delTime);

    updateDelayFeedbackUI(track.delFback);
    setTrackDelayFeedback(track.delFback);

    updateDelayMixUI(track.delMix);
    setTrackDelayMix(track.delMix);
}
