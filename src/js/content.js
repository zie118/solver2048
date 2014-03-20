/* Get the current box configuration, return a 4x4 array */
function GetCurrentConfig() {
    var ret = new Array(4);
    for (var r = 1; r <= 4; r++) {
        ret[r-1] = new Array(4);
        for (var c = 1; c <= 4; c++) {
            ret[r-1][c-1] = 0;
            var selector = 'div[class*="tile-position-'+c+'-'+r+'"]';
            $.each($(selector), function(index, value) {
                if ($(value).hasClass('tile-new') || $(value).hasClass('tile-merged')) {
                    ret[r-1][c-1] = parseInt($('.tile-inner', value).text());
                    return false; // break each
                }
                ret[r-1][c-1] = parseInt($('.tile-inner', value).text());
                return true; // continue each
            });
        }
    }
    console.log(ret);
    return ret
}

/* Trigger a move with dir 0:A 1:S 2:D 3:W */
function TriggerMove(dir) {
    var elem = document.body;
    console.log(elem);
    var charCode = 65;

    switch (dir) {
        case 0: charCode = 65; break;
        case 1: charCode = 83; break;
        case 2: charCode = 68; break;
        case 3: charCode = 87; break;
    };  

    triggerKeyEvent(elem, charCode);
}

// triggerKeyEvent is implemented as follows:
function triggerKeyEvent(element, charCode) {
    // We cannot pass object references, so generate an unique selector
    var attribute = 'robw_' + Date.now();
    element.setAttribute(attribute, '');
    var selector = element.tagName + '[' + attribute + ']';
    var s = document.createElement('script');
    s.textContent = '(' + function(charCode, attribute, selector) {
        // Get reference to element...
        var element = document.querySelector(selector);
        element.removeAttribute(attribute);

        // Create KeyboardEvent instance
        var event = document.createEvent('Events');
        if (event.initEvent) {
            event.initEvent("keydown", true, true);
        }
        event.keyCode = charCode;
        event.which = charCode;
        element.dispatchEvent(event);
    } + ')(' + charCode + ', "' + attribute + '", "' + selector + '")';
    (document.head||document.documentElement).appendChild(s);
    s.parentNode.removeChild(s);
}

function ListenerMethod(request, sender, callback)
{
    if (request.greeting == 'hello') {
        /*
        $.each($('div[class*="tile-position-4-1"]'), function(index, value) {
            console.log(index);
            console.log($('.tile-inner', value).text());
            console.log($(value).hasClass('new'));
        });
        */
        TriggerMove(3);
        GetCurrentConfig();
        callback("YES");
    }
    if (request.method && request.method == 'GET_BOX') {
        var boxArr = GetCurrentConfig();
        callback(boxArr);
    }
}


/* Load Listener at beginning */
chrome.runtime.onMessage.addListener(ListenerMethod);
console.log("inited content.js");
