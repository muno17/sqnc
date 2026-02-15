// ****************** communication with the server ****************** \\
// use fetch api for AJAX requests

// check if user logged in ***************

// send projectData when save button is pressed
async function saveSequence() {
    // send currentData to the server
    // on success, projectData gets a copy of currentData assigned to it

    // disable save button while saving
    const saveBtn = document.getElementById("save");
    const originalText = saveBtn.innerText;
    saveBtn.innerText = "Saving...";
    saveBtn.disabled = true;

    try {
        const response = await fetch("api/save-sequence.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentData)
        });
        
        const ajax = await response.json();
        
        // update projectData and currentData on success
        projectData = JSON.parse(JSON.stringify(currentData));
        currentData = JSON.parse(JSON.stringify(projectData));
        if (ajax && ajax.id) {
            projectData.id = ajax.id;
            currentData.id = ajax.id;

            // update the dropdown option if a new sequence was just saved
            const sequences = document.getElementById("sequences");
            const selectedOption = sequences.options[sequences.selectedIndex];
            if (selectedOption && selectedOption.value === "") {
                selectedOption.value = ajax.id;
            }
        }
        console.log("Saved sequence successfully");
    } catch (err) {
        console.error("Sequence save failed:", err);
    } finally {
        // reenable save button once saved succesfully
        saveBtn.innerText = originalText;
        saveBtn.disabled = false;
    }
}


// when user logs in, load correct sequences
async function loadSequences() {
    // load projectData -> copy into currentData
    // stop if running
    // disable start button
    // reenable once loaded
    try {
        const response = await fetch("api/get-user-sequences.php", {
            method: "POST",
        });
        const ajax = await response.json();
        const sequences = document.getElementById("sequences");

        // create default option
        var newSeq = document.createElement("option");
        newSeq.value = "new";
        newSeq.innerHTML = "New Sequence";

        // clear and add default
        sequences.innerHTML = "";
        sequences.appendChild(newSeq);

        // add fetched options
        ajax.forEach((seq) => {
            const option = document.createElement("option");
            option.value = seq.id;
            option.innerHTML = seq.name;
            sequences.appendChild(option);
        });
    } catch (err) {
        console.error("Failed to load sequences:", err);
    }
}

async function getSequence(id) {
    // disable sequencer and stop if running
    disableSequencer("Loading...");

    try {
        // prepare data to be able to send
        const formData = new FormData();
        formData.append("id", id);

        const response = await fetch("api/get-sequence.php", {
            method: "POST",
            body: formData,
        });
        const ajax = await response.json();

        // load sequence into projectDat and currentData
        // might need to be just projectData = ajax.content;
        projectData = JSON.parse(ajax.content);
        currentData = JSON.parse(JSON.stringify(projectData));

        
        // add logic for stopping and disabling play until loaded? ***

        // load samples for the sequence
        loadSequenceSamples();

        // update the sequencer UI
        renderSequencer();
    } catch (err) {
        console.error("Failed to load sequences:", err);
    }
}

// function to load samples
function loadSequenceSamples() {
    loadInstruments();

    // reenable once everything is loaded
    Tone.loaded().then(() => {
        enableSequencer();
        renderParams();
    });
}

function loadInstruments() {
    currentData.tracks.forEach((track, index) => {
        if (track.samplePath) {
            instruments[index].load(track.samplePath);
        }
    });
}

// add sample to db and samples folder
async function uploadSample(file) {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await fetch("api/upload-sample.php", {
            method: "POST",
            body: formData,
        });

        const ajax = await response.json();

        if (ajax.success) {
            // update the current track
            currentData.tracks[currentTrack].samplePath = ajax.path;
            currentData.tracks[currentTrack].sampleName = ajax.name;

            // load the new sample into the player
            instruments[currentTrack].load(ajax.path, () => {
                console.log(ajax.name + " loaded successfully");
            });

            // update the UI
            markAsChanged();
            renderParams();
        } else {
            alert("Upload failed: " + ajax.error);
        }
    } catch (err) {
        console.error("Upload error:", err);
    }
}


// when user logs in, load correct samples
async function loadSamples() {
    // fetch all user uploaded samples
    // return list of file paths
        try {
        const response = await fetch("api/get-user-samples.php", {
            method: "POST",
        });
        const ajax = await response.json();
        const samples = document.getElementById("samples");

        // create default option
        const defaultOpt = document.createElement("option");
        defaultOpt.value = "upload";
        defaultOpt.innerHTML = "-- Upload New Sample --";

        // clear and add default
        samples.innerHTML = "";
        samples.appendChild(defaultOpt);

        // add fetched options
        ajax.forEach((sample) => {
            const option = document.createElement("option");
            option.value = sample.file_path;
            option.dataset.name = sample.name;
            option.innerHTML = sample.name;
            samples.appendChild(option);
        });
    } catch (err) {
        console.error("Failed to load sequences:", err);
    }
}



/*


function saveSequence() {
    // send currentData to the server
    // on success, projectData gets a copy of currentData assigned to it


    new Ajax.Request("api/save-sequence.php", {
        method: "post",
        contentType: "application/json",
        postBody: JSON.stringify(currentData),
        onSuccess: updateProjectData,
        onFailure: ajaxFailed
    });
    console.log("saved");
}


function updateProjectData(ajaxResponse) {
    var ajax = ajaxResponse.responseText.evalJSON();
    projectData = Object.clone(currentData);

    if (ajax && ajax.id) {
        projectData.id = ajax.id;
        currentData.id = ajax.id;
    }

    // update pattern selector to add new?
}

function loadSequences() {
    // load projectData -> copy into currentData
    // stop if running
    // disable start button
    // reenable once loaded
    new Ajax.Request("api/get-user-sequences.php", {
        method: "post",
        contentType: "application/json",
        onSuccess: updateSequences,
        onFailure: ajaxFailed
    });
}

function updateSequences(ajaxResponse) {
    var ajax = ajaxResponse.responseText.evalJSON();
    var sequences = document.getElementById("sequences");

    // add a default option
    var newSeq = document.createElement('option');
    newSeq.value = 'new';
    newSeq.innerHTML = "New Sequence";

    // remove any existing options and then add all the user's sequences
    sequences.innerHTML = '';
    sequences.appendChild(newSeq);
    for (var i = 0; i < ajax.length; i++) {
        var option = document.createElement('option');
        option.value = ajax[i].id;
        option.innerHTML = ajax[i].name;

        sequences.appendChild(option);
    }
}


async function getSequence(id) {
    // stop if running
    // disable start button
    // reenable once loaded

    new Ajax.Request("api/get-sequence.php", {
        method: "post",
        parameters: {id: id},
        onSuccess: updateSequence,
        onFailure: ajaxFailed,
    });
}

function updateSequence(ajaxResponse) {
    var ajax = ajaxResponse.responseText.evalJSON();

    // conver the content JSON string to a JS object
    projectData = ajax.content.evalJSON();
    currentData = Object.clone(projectData);

    renderSequencer();
    renderParams();
}

function ajaxFailed(ajax, exception) {
    var errorTitle = "Error making Ajax request";
    var details = "";

    if (exception) {
        details = "Exception: " + exception.message;
    } else {
        // see if the server sent a JSON error message
        try {
            var response = ajax.responseText.evalJSON();
            details = response.error ? response.error : "Unknown Server Error";
        } catch (e) {
            // if not JSON, fallback to status text
            details = "Status: " + ajax.status + " (" + ajax.statusText + ")";
        }
    }
    console.error(errorTitle + ": " + details);
}
*/