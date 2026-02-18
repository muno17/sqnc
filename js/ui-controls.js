// UI event listeners and logic

// modify based on whether user is logged in or not
function userNotLoggedIn() {
    const sequences = document.getElementById("sequences");
    sequences.innerHTML = "<option>Log in to save sequences</option>";

    const save = document.getElementById("save");
    save.disabled = true;

    const newB = document.getElementById("new");
    newB.disabled = true;

    const userUpload = document.getElementById("userUpload");
    userUpload.classList.toggle('hidden');

    const guestUpload = document.getElementById("guestUpload");
    guestUpload.classList.toggle("hidden");

    loggedIn = false;
}

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

    Tone.Transport.loop = true;
    Tone.Transport.loopEnd = currentData.length;

    // functionality to play
    currentStep = 0;
    updateUIPlayHead(0);
    running = true;
    Tone.Transport.start("+0.1");
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
        masterVolNode.gain.rampTo(Tone.dbToGain(this.value), 0.1);
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
            renderSequencer();
        });

        btn.addEventListener("dblclick", function () {
            const newLength = parseInt(this.dataset.index) + 1;
            currentData.length = newLength + "m";

            Tone.Transport.setLoopPoints(0, currentData.length);
            Tone.Transport.loop = true;

            updatePageVisuals(newLength);

            markAsChanged();
        });
    });
}

// add indicator for the pages that are on
function updatePageVisuals(measures) {
    const pageBtns = document.querySelectorAll(".page");
    pageBtns.forEach((btn, index) => {
        if (index < measures) {
            btn.classList.add("loop");
        } else {
            btn.classList.remove("loop");
        }
    });
}

// save currentData
// assign a copy of currentData to projectData on success ***
// 'glow' if there are changes to be made, remove if saved or if reloaded
function initSave() {
    const saveBtn = document.getElementById("save");
    if (saveBtn) {
        saveBtn.addEventListener("click", async function () {
        // check if its the default sequence
        const sequencesDropdown = document.getElementById("sequences");
        if (sequencesDropdown.value === "new") {
            const name = await openNamingModal();

            // if user clicks the cancel button in the modal
            if (!name) {
                return;
            }

            currentData.name = name;
            projectData.name = name;
        }

        // don't do anything if there isn't anything to save;
        if (changes) {
            await saveSequence();

            resetChanges();
        }
        });
    }
}

// make the save button glow when changes have been made
function markAsChanged() {
    if (loggedIn) {
        changes = true;
        const saveBtn = document.getElementById("save");
        if (saveBtn) {
            saveBtn.classList.add("changes");
        }
    }
}

function resetChanges() {
    const saveBtn = document.getElementById("save");
    saveBtn.classList.remove("changes");
    changes = false;
}

// revert back to last loaded projectData
function initReload() {
    const reloadBtn = document.getElementById("reload");

    reloadBtn.addEventListener("click", function () {
        // don't do anything if there aren't any changes
        if (changes) {
            currentData = JSON.parse(JSON.stringify(projectData));
            resetChanges();

            // stop the current audio and reload instruments
            stopAllSounds();
            loadInstruments();

            // redraw the UI
            renderSequencer();
            renderParams();
        }
    });
}

// init for new 
async function initNew() {
    const newBtn = document.getElementById("new");

    newBtn.addEventListener("click", async function () {
        const name = await openNamingModal();

        if (name) {
            // User confirmed, now reset the data
            stopTransport();

            // Deep copy fresh data
            projectData = JSON.parse(JSON.stringify(initData));
            currentData = JSON.parse(JSON.stringify(initData));

            projectData.name = name;
            currentData.name = name;
            currentData.id = null;

            renderSequencer();
            renderParams();
            markAsChanged();
        }
    });
}


function openNamingModal() {
    const overlay = document.getElementById("sequence-overlay");
    const seqName = document.getElementById("seq-name");

    seqName.value = "";
    overlay.classList.remove("modal-hidden");
    seqName.focus();

    // create a promise so initSave waits
    return new Promise((resolve) => {
        modalResolver = resolve;
    });
}

function initOpenModal() {
    const overlay = document.getElementById("sequence-overlay");
    const closeBtn = document.getElementById("sequence-close-btn");
    const sequenceInitBtn = document.getElementById("sequence-init-btn");
    const seqName = document.getElementById("seq-name");

    // cancel button
    closeBtn.addEventListener("click", () => {
        overlay.classList.add("modal-hidden");
        if (modalResolver) {
            modalResolver(false);
        }
    });

    // confirm button
    sequenceInitBtn.addEventListener("click", function () {
        const name = seqName.value.trim() || "Untitled Sequence";

        // logic for creating the new option
        const sequences = document.getElementById("sequences");
        const newSeq = document.createElement("option");
        newSeq.value = "";
        newSeq.innerHTML = name;
        newSeq.selected = true;
        sequences.appendChild(newSeq);

        overlay.classList.add("modal-hidden");
        if (modalResolver) {
            modalResolver(name);
         }
    });
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
        currentData.tracks[currentTrack].sampleName = name;

        // update audio engine
        instruments[currentTrack].load(path);

        markAsChanged();
    });
}

function initUserUpload() {
    const upload = document.getElementById("file");

    if (upload) {
        upload.addEventListener("change", function (e) {
            console.log("calling user upload");
            const file = e.target.files[0];
            uploadSample(file);
        });
    }
}

function initGuestUpload() {
    const upload = document.getElementById("localFile");

    if (upload) {
        upload.addEventListener("change", function (e) {
            const file = e.target.files[0];
            handleLocalUpload(file, currentTrack);
        });
    }
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
    const selector = document.getElementById("sequences");

    selector.addEventListener("change", function () {
                var selectedId = this.value;
        // save currentData if changes
        if (changes) {
            openSaveModal(selectedId);
        } else {
            if (selectedId != "new") {
                getSequence(selectedId);
                length = currentData.length;
            } else {
                resetInterface();
            }
        }
    });
}

function openSaveModal(id) {
    // initiate the new sequence modal
    const overlay = document.getElementById("save-overlay");
    const noBtn = document.getElementById("sequence-nosave-btn");
    const yesBtn = document.getElementById("sequence-save-btn");

    function openModal() {
        overlay.classList.remove("modal-hidden");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        overlay.classList.add("modal-hidden");
        document.body.style.overflow = "auto";
        resetChanges();
    }

    // close when clicking either button in the modal
    noBtn.addEventListener("click", closeModal);
    yesBtn.addEventListener("click", async function () {
        await saveSequence();
        await getSequence(id);
        closeModal()
    });

    openModal();
}

function resetInterface() {
    currentData = JSON.parse(JSON.stringify(initData));
    projectData = JSON.parse(JSON.stringify(initData));

    resetChanges();

    Tone.Transport.stop();
    currentStep = 0;

    renderParams();
    renderSequencer();
    updateUIPlayHead(0);

    document.getElementById("tempo").value = currentData.bpm;
    document.getElementById("tempoDisplay").innerText = currentData.bpm;
    document.getElementById("masterVol").value = currentData.masterVolume;
}

// clear sequence for current track
function initClear() {
    var clear = document.getElementById("clear");

    clear.addEventListener("click", function () {
        currentData.tracks[currentTrack].steps = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
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

function togglePageHit(step) {
    // calculate which page the transport is actually playing
    const transportPage = Math.floor(step / 16);
    const id = "page" + (transportPage + 1);

    const page = document.getElementById(id);

    if (page) {
        page.classList.add("flash");

        setTimeout(() => {
            page.classList.remove("flash");
        }, 150);
    }
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
    initUserUpload();
    initGuestUpload();
    initOpenModal();
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
    initReverbSend();
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

function initReverbSend() {
    const send = document.getElementById("revSend");

    send.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.tracks[currentTrack].reverb = val;

        updateReverbSendUI(val);
        setTrackReverbSend(val);

        markAsChanged();
    });
}

function updateReverbSendUI(val) {
    const send = document.getElementById("revSend");
    const sendDisplay = document.getElementById("revSendDisplay");

    // format the value so it displays 0-100
    send.value = val;
    sendDisplay.innerHTML = parseInt(val * 100);
}
///////////////////////// Master Effects \\\\\\\\\\\\\\\\\\\\\\\\\\
function initMasterParams() {
    // reverb
    initDirt();
    initDirtMix();
    initSpace();
    initPredelay();
    initReverbWidth();
    initReverbLimit();

    // eq
    initEqLow();
    initEqMid();
    initEqHigh();

    // compressor
    initCompThresh();
    initCompRatio();
    initCompAttack();
    initCompRelease();
    initCompKnee();

    // saturator
    initSatDrive();
    initSatTone();
    initSatMix();

    // limiter
    initLimitThresh();
}

// reverb
function initDirt() {
    const dirt = document.getElementById("dirt");

    dirt.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.dirt = val;

        updateDirtUI(val);
        setMasterDirt(val);

        markAsChanged();
    });
}

function updateDirtUI(val) {
    const dirt = document.getElementById("dirt");
    const dirtDisplay = document.getElementById("dirtDisplay");

    // format the value so it displays 0-100
    dirt.value = val;
    dirtDisplay.innerHTML = parseInt(val);
}

function initDirtMix() {
    const dirt = document.getElementById("dirtMix");

    dirt.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.dirtMix = val;

        updateDirtMixUI(val);
        setMasterDirtMix(val);

        markAsChanged();
    });
}

function updateDirtMixUI(val) {
    const dirt = document.getElementById("dirtMix");
    const dirtDisplay = document.getElementById("dirtMixDisplay");

    // format the value so it displays 0-100
    dirt.value = val;
    dirtDisplay.innerHTML = parseInt(val * 100);
}

function initSpace() {
    const space = document.getElementById("space");

    space.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.space = val;

        updateSpaceUI(val);
        setMasterSpace(val);

        markAsChanged();
    });
}

function updateSpaceUI(val) {
    const space = document.getElementById("space");
    const spaceDisplay = document.getElementById("spaceDisplay");

    // format the value so it displays 0-100
    space.value = val;
    spaceDisplay.innerHTML = parseInt(val * 10);
}

function initPredelay() {
    const predelay = document.getElementById("predelay");

    predelay.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.predelay = val;

        updatePredelayUI(val);
        setMasterPredelay(val);

        markAsChanged();
    });
}

function updatePredelayUI(val) {
    const predelay = document.getElementById("predelay");
    const predelayDisplay = document.getElementById("predelayDisplay");

    // format the value so it displays 0-100
    predelay.value = val;
    predelayDisplay.innerHTML = parseInt(val * 100);
}

function initReverbWidth() {
    const revWidth = document.getElementById("revWidth");

    revWidth.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.revWidth = val;

        updateReverbWidthUI(val);
        setMasterReverbWidth(val);

        markAsChanged();
    });
}

function updateReverbWidthUI(val) {
    const revWidth = document.getElementById("revWidth");
    const revWidthDisplay = document.getElementById("revWidthDisplay");

    // format the value so it displays 0-100
    revWidth.value = val;
    revWidthDisplay.innerHTML = parseInt(val * 100);
}

function initReverbLimit() {
    const revLimit = document.getElementById("revLimit");

    revLimit.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.revLimit = val;

        updateReverbLimitUI(val);
        setMasterReverbLimit(val);

        markAsChanged();
    });
}

function updateReverbLimitUI(val) {
    const revLimit = document.getElementById("revLimit");
    const revLimitDisplay = document.getElementById("revLimitDisplay");

    revLimit.value = val;
    revLimitDisplay.innerHTML = parseInt(val);
}

// eq
function initEqLow() {
    const eqLow = document.getElementById("eqLow");

    eqLow.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.eqLow = val;

        updateEqLowUI(val);
        setMasterEqLow(val);

        markAsChanged();
    });
}

function updateEqLowUI(val) {
    const eqLow = document.getElementById("eqLow");
    const eqLowDisplay = document.getElementById("eqLowDisplay");

    eqLow.value = val;
    eqLowDisplay.innerHTML = parseInt(val) + "db";
}

function initEqMid() {
    const eqMid = document.getElementById("eqMid");

    eqMid.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.eqMid = val;

        updateEqMidUI(val);
        setMasterEqMid(val);

        markAsChanged();
    });
}

function updateEqMidUI(val) {
    const eqMid = document.getElementById("eqMid");
    const eqMidDisplay = document.getElementById("eqMidDisplay");

    eqMid.value = val;
    eqMidDisplay.innerHTML = parseInt(val) + "db";
}

function initEqHigh() {
    const eqHigh = document.getElementById("eqHigh");

    eqHigh.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.eqHigh = val;

        updateEqHighUI(val);
        setMasterEqHigh(val);

        markAsChanged();
    });
}

function updateEqHighUI(val) {
    const eqHigh = document.getElementById("eqHigh");
    const eqHighDisplay = document.getElementById("eqHighDisplay");

    eqHigh.value = val;
    eqHighDisplay.innerHTML = parseInt(val) + "db";
}

// compressor
function initCompThresh() {
    const compThresh = document.getElementById("compThresh");

    compThresh.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.compThresh = val;

        updateCompThreshUI(val);
        setMasterCompThresh(val);

        markAsChanged();
    });
}

function updateCompThreshUI(val) {
    const compThresh = document.getElementById("compThresh");
    const compThreshDisplay = document.getElementById("compThreshDisplay");

    compThresh.value = val;
    compThreshDisplay.innerHTML = parseInt(val) + "db";
}

function initCompRatio() {
    const compRatio = document.getElementById("compRatio");

    compRatio.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.compRatio = val;

        updateCompRatioUI(val);
        setMasterCompRatio(val);

        markAsChanged();
    });
}

function updateCompRatioUI(val) {
    const compRatio = document.getElementById("compRatio");
    const compRatioDisplay = document.getElementById("compRatioDisplay");

    compRatio.value = val;
    compRatioDisplay.innerHTML = parseInt(val);
}

function initCompAttack() {
    const compAttack = document.getElementById("compAttack");

    compAttack.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.compAttack = val;

        updateCompAttackUI(val);
        setMasterCompAttack(val);

        markAsChanged();
    });
}

function updateCompAttackUI(val) {
    const compAttack = document.getElementById("compAttack");
    const compAttackDisplay = document.getElementById("compAttackDisplay");

    compAttack.value = val;
    compAttackDisplay.innerHTML = parseInt(val * 100);
}

function initCompRelease() {
    const compRelease = document.getElementById("compRelease");

    compRelease.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.compRelease = val;

        updateCompReleaseUI(val);
        setMasterCompRelease(val);

        markAsChanged();
    });
}

function updateCompReleaseUI(val) {
    const compRelease = document.getElementById("compRelease");
    const compReleaseDisplay = document.getElementById("compReleaseDisplay");

    compRelease.value = val;
    compReleaseDisplay.innerHTML = parseInt(val * 100);
}

function initCompKnee() {
    const compKnee = document.getElementById("compKnee");

    compKnee.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.compKnee = val;

        updateCompKneeUI(val);
        setMasterCompKnee(val);

        markAsChanged();
    });
}

function updateCompKneeUI(val) {
    const compKnee = document.getElementById("compKnee");
    const compKneeDisplay = document.getElementById("compKneeDisplay");

    compKnee.value = val;
    compKneeDisplay.innerHTML = parseInt(val);
}

//saturator
function initSatDrive() {
    const satDrive = document.getElementById("satDrive");

    satDrive.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.satDrive = val;

        updateSatDriveUI(val);
        setMasterSatDrive(val);

        markAsChanged();
    });
}

function updateSatDriveUI(val) {
    const satDrive = document.getElementById("satDrive");
    const satDriveDisplay = document.getElementById("satDriveDisplay");

    // format the value so it displays 0-100
    satDrive.value = val;
    satDriveDisplay.innerHTML = parseInt(val * 200);
}

function initSatTone() {
    const satTone = document.getElementById("satTone");

    satTone.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.satTone = val;

        updateSatToneUI(val);
        setMasterSatTone(val);

        markAsChanged();
    });
}

function updateSatToneUI(val) {
    const satTone = document.getElementById("satTone");
    const satToneDisplay = document.getElementById("satToneDisplay");

    // format the value so it displays 0-100
    satTone.value = val;
    satToneDisplay.innerHTML = parseInt(val * 0.005);
}

function initSatMix() {
    const satMix = document.getElementById("satMix");

    satMix.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.satMix = val;

        updateSatMixUI(val);
        setMasterSatMix(val);

        markAsChanged();
    });
}

function updateSatMixUI(val) {
    const satMix = document.getElementById("satMix");
    const satMixDisplay = document.getElementById("satMixDisplay");

    // format the value so it displays 0-100
    satMix.value = val;
    satMixDisplay.innerHTML = parseInt(val * 100);
}

//limiter
function initLimitThresh() {
    const limitThresh = document.getElementById("limitThresh");

    limitThresh.addEventListener("input", function () {
        const val = parseFloat(this.value);
        currentData.master.limitThresh = val;

        updateLimitThreshUI(val);
        setMasterLimitThresh(val);

        markAsChanged();
    });
}

function updateLimitThreshUI(val) {
    const limitThresh = document.getElementById("limitThresh");
    const limitThreshDisplay = document.getElementById("limitThreshDisplay");

    limitThresh.value = val;
    limitThreshDisplay.innerHTML = parseInt(val);
}

///////////////////////// Rendering \\\\\\\\\\\\\\\\\\\\\\\\\\

// show/hide the track specific and master track params
function renderParams() {
    const trackParams = document.getElementById("trackParams");
    const effectParams = document.getElementById("effectParams");
    const effectHouse = document.getElementById("effectsHouse");
    const divider = document.getElementById("paramDivider");
    const selectorRow = document.getElementById("selectorRow"); // sample selector
    const stateRow = document.getElementById("stateRow"); // sequence selector
    const sequencer = document.getElementById("sequencer");

    // check if current track is master
    if (currentTrack === 99) {
        // hide the track specific UI
        selectorRow.classList.add("hidden");
        divider.classList.add("hidden");

        const rows = trackParams.querySelectorAll(".paramRow");
        rows.forEach((row) => {
            row.classList.add("hidden");
        });

        const effectRows = effectHouse.querySelectorAll(".paramRow");
        effectRows.forEach((row) => {
            row.classList.add("hidden");
        });

        trackParams.classList.add("master");
        effectParams.classList.add("master");
        stateRow.classList.add("master");

        renderMasterParams();
        sequencer.classList.add("read-only");
    } else {
        trackParams.classList.remove("master");
        effectParams.classList.remove("master");
        stateRow.classList.remove("master");
        // hide the master specific UI
        const masterRows = document.querySelectorAll(".master");
        masterRows.forEach((row) => {
            row.classList.add("hidden");
        });

        // show the track specific UI
        selectorRow.classList.remove("hidden");
        divider.classList.remove("hidden");

        const rows = trackParams.querySelectorAll(".paramRow");
        rows.forEach((row) => row.classList.remove("hidden"));

        const effectsRows = effectHouse.querySelectorAll(".paramRow");
        effectsRows.forEach((row) => row.classList.remove("hidden"));

        renderTrackParams();
        sequencer.classList.remove("read-only");
    }
}

// update the master track's saved values
function renderMasterParams() {
    const master = currentData.master;
    const masterRows = document.querySelectorAll(".master");

    masterRows.forEach((row) => {
        row.classList.remove("hidden");
    });

    setMasterVol(currentData.masterVolume);
    setTempo(currentData.bpm);
    setSwing(currentData.swing);

    updateDirtUI(master.dirt);
    setMasterDirt(master.dirt);

    updateDirtMixUI(master.dirtMix);
    setMasterDirtMix(master.dirtMix);

    updateSpaceUI(master.space);
    setMasterSpace(master.space);

    updatePredelayUI(master.predelay);
    setMasterPredelay(master.predelay);

    updateReverbWidthUI(master.revWidth);
    setMasterReverbWidth(master.revWidth);

    updateReverbLimitUI(master.revLimit);
    setMasterReverbLimit(master.revLimit);

    updateEqLowUI(master.eqLow);
    setMasterEqLow(master.eqLow);

    updateEqMidUI(master.eqMid);
    setMasterEqMid(master.eqMid);

    updateEqHighUI(master.eqHigh);
    setMasterEqHigh(master.eqHigh);

    updateSatDriveUI(master.satDrive);
    setMasterSatDrive(master.satDrive);

    updateSatToneUI(master.satTone);
    setMasterSatTone(master.satTone);

    updateSatMixUI(master.satMix);
    setMasterSatMix(master.satMix);

    updateCompThreshUI(master.compThresh);
    setMasterCompThresh(master.compThresh);

    updateCompRatioUI(master.compRatio);
    setMasterCompRatio(master.compRatio);

    updateCompAttackUI(master.compAttack);
    setMasterCompAttack(master.compAttack);

    updateCompReleaseUI(master.compRelease);
    setMasterCompRelease(master.compRelease);

    updateCompKneeUI(master.compKnee);
    setMasterCompKnee(master.compKnee);

    updateLimitThreshUI(master.limitThresh);
    setMasterLimitThresh(master.limitThresh);
}

// update all params to track's saved value
function renderTrackParams() {
    const track = currentData.tracks[currentTrack];
    const samplesDropdown = document.getElementById("samples");

    if (track.samplePath) {
        samplesDropdown.value = track.samplePath;
    } else {
        // Fallback if no sample is loaded
        samplesDropdown.selectedIndex = 0;
        samplesDropdown.value = "";
    }

    /*
    const nameDisplay = document.getElementById("sampleNameDisplay");
    if (nameDisplay) {
        nameDisplay.innerText = track.sampleName || "No Sample Loaded";
    }*/

    // params
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

    // effects
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

    updateReverbSendUI(track.reverb);
    setTrackReverbSend(track.reverb);
}

function syncTrackParams() {
        currentData.tracks.forEach((track, index) => {
            if (track.id === 99) return;

            let originalViewTrack = currentTrack;
            currentTrack = index;

            // params
            setTrackVolume(track.volume, true);
            setTrackPan(track.pan, true);
            setTrackPitch(track.pitch);
            setTrackStart(track.start);
            setTrackAttack(track.attack);
            setTrackDecay(track.decay);
            setTrackSustain(track.sustain);
            setTrackRelease(track.release);
            setTrackLpWidth(track.lpWidth);
            setTrackLpQ(track.lpq);
            setTrackHpWidth(track.hpWidth);
            setTrackHpQ(track.hpq);

            // effects
            setTrackDistortion(track.distortion);
            setTrackBitcrusher(track.bitcrusher);
            setTrackChorusRate(track.chorusRate);
            setTrackChorusDepth(track.chorusDepth);
            setTrackChorusMix(track.chorusMix);
            setTrackTremoloRate(track.tremRate);
            setTrackTremoloDepth(track.tremDepth);
            setTrackTremoloMix(track.tremMix);
            setTrackDelayTime(track.delTime);
            setTrackDelayFeedback(track.delFback);
            setTrackDelayMix(track.delMix);
            setTrackReverbSend(track.reverb);

            currentTrack = originalViewTrack;
        });
}