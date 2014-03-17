function test() {
    console.log("call test");
    chrome.extension.sendMessage({method:'getTitle'}, function(response){
            $('.output').text(response);
    });
}

function initialize() {
    console.log("call init");
    $('#testb').click(test);
}

window.addEventListener("load", initialize);
