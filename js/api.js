// comunication with the server

// check if user logged in

// send projectData when save button is pressed
function saveSequence() {
    // send currentData to the server
    // on success, projectData gets a copy of currentData assigned to it
    new Ajax.Request(
        "api/save-sequence.php", {
            method: "post",
            contentType: 'application/json',
            postBody: JSON.stringify(currentData),
            onSuccess: updateProjectData,
            onFailure: ajaxFailed
        }
    )
}

// when user logs in, load correct patterns
function loadUserData() {
    // load projectData -> copy into currentData
}

// when user logs in, load correct samples
function loadUserSamples() {
    // fetch all user uploaded samples
    // return list of file paths
}



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
}


function ajaxFailed(ajax, exception) {
        var msg = "Error making Ajax request " + "<br />";
        if (exception) {
            msg += " Exception: " + exception.message + "\n";
        } else {
            msg +=
                "Server Status: " + ajax.status + "<br />" +
                "Status text: " + ajax.statusText + "<br />" +
                "Server response text: " + ajax.responseText;
        }
        console.log(msg);
}