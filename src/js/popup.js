function run() {
    console.log("call run");
    chrome.extension.sendMessage({method:'move'}, function(response){
        $('.output').text(response);
    });
}

function stop() {
    console.log("call stop");
    chrome.extension.sendMessage({method:'stop'}, function(response){
        $('.output').text(response);
    });
}

function initialize() {
    console.log("call init");
    $('#testb').click(run);
    $('#testb2').click(stop);
}

window.addEventListener("load", initialize);
