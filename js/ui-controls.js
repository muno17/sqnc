function initTransport() {
    const transport = document.getElementById("transport");
    setupAudioLoop();

    if (transport) {
        transport.addEventListener('click', async function() {
            if (running) {
                // functionality to stop
                running = false;
                Tone.Transport.stop();
                currentStep = 0;
                updateUIPlayHead(-1);
                transport.innerHTML = "Play";
            } else {
                // functionality to play
                await Tone.start();
                Tone.Transport.start();
                running = true;
                 transport.innerHTML = "Stop";
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
            projectData.bpm = this.value;
            tempoDisplay.innerHTML = this.value;
            Tone.Transport.bpm.value = this.value;
        });
    }

    const master = document.getElementById("master");
    const masterDisplay = document.getElementById("masterDisplay");

    if (master) {
        master.addEventListener("input", function () {
            projectData.masterVolume = this.value;
            masterDisplay.innerHTML = this.value + "dB";
            Tone.Destination.volume.rampTo(this.value, 0.1);
        });
    }
    
// reset

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