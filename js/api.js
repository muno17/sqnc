// ****************** communication with the server ****************** \\
// use fetch api
// check if user logged in

// send projectData when save button is pressed
async function saveSequence() {
    // send currentData to the server
    // on success, projectData gets a copy of currentData assigned to it
    try {
        const response = await fetch("api/save-sequence.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentData)
        });
        
        const data = await response.json();
        
        // Update projectData on success
        projectData = JSON.parse(JSON.stringify(currentData));
        if (data && data.id) {
            projectData.id = data.id;
            currentData.id = data.id;
        }
        console.log("Saved successfully");
    } catch (err) {
        console.error("Save failed:", err);
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
            method: "POST"
        });
        const ajax = await response.json();
        const sequences = document.getElementById("sequences");

        // Clear and add default
        sequences.innerHTML = '<option value="new">New Sequence</option>';

        ajax.forEach(seq => {
            const option = document.createElement('option');
            option.value = seq.id;
            option.innerHTML = seq.name;
            sequences.appendChild(option);
        });
    } catch (err) {
        console.error("Failed to load sequences:", err);
    }
}


function getSequence(id) {
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

// when user logs in, load correct samples
function loadSamples() {
    // fetch all user uploaded samples
    // return list of file paths
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