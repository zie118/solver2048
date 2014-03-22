function run() {
    console.log("call run");
    chrome.extension.sendMessage({method:'move'}, function(response){
        $('.output').text(response);
    });
}

function initialize() {
    console.log("call init");
    $('#testb').click(run);
}

window.addEventListener("load", initialize);
