// ****************** communication with the server ****************** \\

// check if user logged in

// send projectData when save button is pressed
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

// when user logs in, load correct sequences
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