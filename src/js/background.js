chrome.extension.onMessage.addListener(function(message,sender,sendResponse){
    console.log("test");
    if(message.method == 'getTitle') {
        console.log("HEHE,Received");
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendMessage(tab.id, {greeting: "hello"}, function(resp) {
                console.log(resp);
                sendResponse(resp);
                });
            console.log("SEND");
        });
    }
});

console.log("listener added");
