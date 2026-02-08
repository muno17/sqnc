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
    // renable once loaded
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

// when user logs in, load correct samples
function loadSamples() {
    // fetch all user uploaded samples
    // return list of file paths
}

function ajaxFailed(ajax, exception) {
    var msg = "Error making Ajax request " + "<br />";
    if (exception) {
        msg += " Exception: " + exception.message + "\n";
    } else {
        msg +=
            "Server Status: " +
            ajax.status +
            "<br />" +
            "Status text: " +
            ajax.statusText +
            "<br />" +
            "Server response text: " +
            ajax.responseText;
    }
    console.log(msg);
}



/* example from hw 5
function fetchNames() {
    new Ajax.Request(
        "https://webhome.auburn.edu/~tzt0062/babynames/babynames.php?type=list",
        {
            method: "get",
            onSuccess: showNames,
            onFailure: ajaxFailed,
            onException: ajaxFailed,
        },
    );
}

// sort the names alphabetically and add as option to the dropdown
function showNames(ajax) {
    var names = ajax.responseText.trim().split("\n");
    names.sort();
    for (var i = 0; i < names.length; i++) {
        var option = document.createElement("option");
        option.innerHTML = names[i];
        option.value = names[i];
        $("allnames").appendChild(option);
    }
    $("allnames").disabled = false;
    $("loadingnames").hide();
} */