function ListenerMethod(request, sender, callback)
{
    if (request.greeting == 'hello') {
        console.log($('div[class*="tile-position-4-1"').html());
        callback("YES");
    }
}

chrome.runtime.onMessage.addListener(ListenerMethod);
console.log("inited");
