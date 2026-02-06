// global controls
// modify based on if user is logged in or not

function initTransport() {
    const transport = document.getElementById('transport');
    setupAudioLoop();

    if (transport) {
        transport.addEventListener('click', async function () {
            if (running) {
                // functionality to stop
                running = false;
                Tone.Transport.stop();
                currentStep = 0;
                updateUIPlayHead(-1); // figure out why this isn't always working
                transport.innerHTML = 'Play';
            } else {
                // functionality to play
                await Tone.start();
                Tone.Transport.start();
                running = true;
                transport.innerHTML = 'Stop';
            }
        });
    }
}

function initRecord() {
    if (record) {
        record.addEventListener('click', function () {});
    }
}

function initGlobalControls() {
    const tempo = document.getElementById('tempo');
    const tempoDisplay = document.getElementById('tempoDisplay');

    if (tempo) {
        tempo.addEventListener('input', function () {
            projectData.bpm = this.value;
            tempoDisplay.innerHTML = this.value;
            Tone.Transport.bpm.value = this.value;
        });
    }

    const master = document.getElementById('master');
    const masterDisplay = document.getElementById('masterDisplay');

    if (master) {
        master.addEventListener('input', function () {
            projectData.masterVolume = this.value;
            masterDisplay.innerHTML = this.value + 'dB';
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
    const pageBtns = document.querySelectorAll('.page');

    pageBtns.forEach((btn) => {
        btn.addEventListener('click', function () {
            pageBtns.forEach((b) => b.classList.remove('selected'));
            this.classList.add('selected');

            currentPage = parseInt(this.dataset.index);
        });
    });
}


// init for save
// save currentData
// assign a copy of currentData to projectData on success
// 'glow' if there are changes to be made, remove if saved or if reloaded
function initSave() {
    const saveBtn = document.getElementById('save');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            // don't do anything if there isn't anything to save;
            if (changes) {
                saveSequence();
                saveBtn.classList.remove('changes');
                changes = false;
            }
        });
    }
}

// init for reload
// revert back to last loaded projectData
function initReload() {
    const reloadBtn = document.getElementById("reload");
    const saveBtn = document.getElementById("save");
    if (reloadBtn && saveBtn) {
        reloadBtn.addEventListener("click", function () {
            // don't do anything if there aren't any changes
            if (changes) {
                saveBtn.classList.remove("changes");
                // copy projectData into currentData **************
                changes = false;
            }
        });
    }
}

// init for new
function initNew() {
    const newBtn = document.getElementById("new");
    const saveBtn = document.getElementById("save");
    if (newBtn && saveBtn) {
        newBtn.addEventListener("click", function () {
            // show warning before reseting
            if (changes) {
                saveBtn.classList.remove("changes");
                // copy projectData into currentData
                changes = false;
            }

        });
    }
}

// create completely new empty projectData