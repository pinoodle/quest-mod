var webPlayer = false;
var canSendCommand = true;

/////////////////////////////////////////////////////////////////////////////////////////////////

var pine_zoom = 1.0; // Initial zoom level

var htmlElement = document.documentElement; // Select the <html> element

function updateZoom() {
    // Set the zoom CSS property to the current pine_zoom value
    htmlElement.style.zoom = pine_zoom;
}

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey) {
        // Detect '+' (plus) or '=' key
        if (event.which === 187 || event.which === 61) {
            event.preventDefault(); // Prevent the default action
            pine_zoom += 0.1; // Increase zoom level
            updateZoom();
        }
        // Detect '-' (minus) key
        else if (event.which === 189 || event.which === 173) {
            event.preventDefault(); // Prevent the default action
            pine_zoom = Math.max(0.1, pine_zoom - 0.1); // Decrease zoom level, but don't go below 0.1
            updateZoom();
        }
    }
});

/////////////////////////////////////////////////////////////////////////////////////////////////

function sendCommand(text, metadata) {
    markScrollPosition();
    var data = new Object();
    data["command"] = text;
    if (typeof metadata != "undefined") {
        data["metadata"] = metadata;
    }
    UIEvent("RunCommand", JSON.stringify(data));
}

function ASLEvent(event, parameter) {
    UIEvent("ASLEvent", event + ";" + parameter);
}


// RestartGame added by KV
function RestartGame() {
    UIEvent("RestartGame", "");
}

// SaveTranscript added by KV to write/append to GAMENAME-transcript.html in Documents\Quest Transcripts
function SaveTranscript(data) {
    data = data + "<style>*{color:black !important;background:white !important;text-align:left !important}</style>";
    if (!webPlayer && transcriptString != '') { UIEvent("SaveTranscript", data); }
    transcriptString += data;
}

// Added by KV to write/append to GAMENAME-log.txt in Documents\Quest Logs
function WriteToLog(data) {
    if (!webPlayer && data != '' && typeof (data) == 'string') {
        UIEvent("WriteToLog", getTimeAndDateForLog() + " " + data);
    }
}

function goUrl(href) {
    UIEvent("GoURL", href);
}

function sendEndWait() {
    UIEvent("EndWait", "");
}

function doSave() {
    UIEvent("Save", $("#divOutput").html());
}

function UIEvent(cmd, parameter) {
    questCefInterop.uiEvent(cmd, parameter);
}

function disableMainScrollbar() {
    $("body").css("overflow", "hidden");
}

function ui_init() {
    $("#gameTitle").remove();
    $("#cmdExitFullScreen").click(function () {
        UIEvent("ExitFullScreen", "");
    });
}

function updateListEval(listName, listData) {
    updateList(listName, eval("(" + listData + ")"));
}

function showExitFullScreenButton(show) {
    if (eval(show)) {
        $("#cmdExitFullScreen").show();
    }
    else {
        $("#cmdExitFullScreen").hide();
    }
    updateStatusVisibility();
}

function panesVisibleEval(visible) {
    panesVisible(eval(visible));
}

function setCompassDirectionsEval(list) {
    setCompassDirections(eval(list));
}

function selectText(containerid) {
    var range = document.createRange();
    range.selectNodeContents(document.getElementById(containerid));
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}
