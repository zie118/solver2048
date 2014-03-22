/* GLOBAL VARIABLES */
var GLB_MOVE_DIR = new Array("MOVE_LEFT", "MOVE_DOWN", "MOVE_RIGHT", "MOVE_UP");
var GLB_LOOK_AHEAD = 2;
var GLB_FIRST_MOVE = 0;

/* count empty block */
function emptyBlock(boxArr) {
    var cnt = 0;
    for (var r = 0; r < 4; r++)
        for (var c = 0; c < 4; c++)
            if (boxArr[r][c] === 0)
                cnt++;
    return cnt;
}

/* add new num in config, duplicate a copy */
function doAdd(boxArr, r, c, v) {
    var newBoxArr = new Array(4);
    for (var i = 0; i < 4; i++)
        newBoxArr[i] = boxArr[i].slice(0);
    newBoxArr[r][c] = v;
    return newBoxArr;
}

/* move left, create copy */
function doMoveLeft(arr) {
    var ret = new Array(4);
    for (var i = 0; i < 4; i++)
        ret[i] = new Array(0,0,0,0);

    for (var r = 0; r < 4; r++) {
        var nc = 0, oc = 0;
        while (oc < 4) {
            if (arr[r][oc] === 0) { oc++; continue; }                
            var noc = oc+1;
            while (noc < 4 && arr[r][noc] === 0) noc++;
            if (noc < 4 && arr[r][oc] === arr[r][noc]) {
                ret[r][nc] = arr[r][oc]+arr[r][noc];
                oc = noc+1;
            } else {
                ret[r][nc] = arr[r][oc];
                oc = noc;
            }
            nc++;                
        }
    }
    return ret;
}

/* move right, create copy */
function doMoveRight(arr) {
    var ret = new Array(4);
    for (var i = 0; i < 4; i++)
        ret[i] = new Array(0,0,0,0);

    for (var r = 0; r < 4; r++) {
        var nc = 3, oc = 3;
        while (oc >= 0) {
            if (arr[r][oc] === 0) { oc--; continue; }      
            var noc = oc-1;
            while (noc >= 0 && arr[r][noc] === 0) noc--;
            if (noc >=0 && arr[r][oc] === arr[r][noc]) {
                ret[r][nc] = arr[r][oc]+arr[r][noc];
                oc = noc-1;
            } else {
                ret[r][nc] = arr[r][oc];
                oc = noc;
            }
            nc--;                
        }
    }
    return ret;          
}

/* move up, create copy */
function doMoveUp(arr) {
    var ret = new Array(4);
    for (var i = 0; i < 4; i++)
        ret[i] = new Array(0,0,0,0);
    for (var c = 0; c < 4; c++) {
        var nr = 0, or = 0;
        while (or < 4) {
            if (arr[or][c] === 0) { or++; continue; }                
            var nor = or+1;
            while (nor < 4 && arr[nor][c] === 0) nor++;
            if (nor < 4 && arr[or][c] === arr[nor][c]) {
                ret[nr][c] = arr[or][c]+arr[nor][c];
                or = nor+1;
            } else {
                ret[nr][c] = arr[or][c];
                or = nor;
            }
            nr++;
        }
    }
    return ret; 
}

/* move down, create copy */
function doMoveDown(arr) {
    var ret = new Array(4);
    for (var i = 0; i < 4; i++)
        ret[i] = new Array(0,0,0,0);
    for (var c = 0; c < 4; c++) {
        var nr = 3, or = 3;
        while (or >= 0) {
            if (arr[or][c] === 0) { or--; continue; }                
            var nor = or-1;
            while (nor >= 0 && arr[nor][c] === 0) nor--;
            if (nor >= 0 && arr[or][c] === arr[nor][c]) {
                ret[nr][c] = arr[or][c]+arr[nor][c];
                or = nor-1;
            } else {
                ret[nr][c] = arr[or][c];
                or = nor;
            }
            nr--;                
        }
    }
    return ret; 
}

/* do move in 4 direction */
function doMove(boxArr, dir) {
    switch (dir) {
        case 0: return doMoveLeft(boxArr);
        case 1: return doMoveDown(boxArr);
        case 2: return doMoveRight(boxArr);
        case 3: return doMoveUp(boxArr);
    }
}

/* valid move or not*/
function validMove(boxArr, dir) {
    var ret = doMove(boxArr, dir);
    for (var r = 0; r < 4; r++) 
        for (var c = 0; c < 4; c++)
            if (ret[r][c] != boxArr[r][c])
                return true;
    return false;
}

/* Measure disconnectness */
function evaluateConfig(curBoxArr) {
    var dis = 0;
    for (var r = 0; r < 4; r++)
        for (var c = 0; c < 3; c++) 
            dis += Math.abs(curBoxArr[r][c]-curBoxArr[r][c+1]);
    for (var c = 0; c < 4; c++)
        for (var r = 0; r < 3; r++) 
            dis += Math.abs(curBoxArr[r][c]-curBoxArr[r+1][c]);

    var free = emptyBlock(curBoxArr);
    return free*free-dis;
}

/* alpha-beta pruning */
function alphabeta(curBoxArr, depth, alpha, beta, maximizingPlayer) {
    console.log('curdepth = ' + depth);
    console.log("\n"+curBoxArr[0][0]+curBoxArr[0][1]+curBoxArr[0][2]+curBoxArr[0][3]+"\n"+
                curBoxArr[1][0]+curBoxArr[1][1]+curBoxArr[1][2]+curBoxArr[1][3]+"\n"+
                curBoxArr[2][0]+curBoxArr[2][1]+curBoxArr[2][2]+curBoxArr[2][3]+"\n"+
                curBoxArr[3][0]+curBoxArr[3][1]+curBoxArr[3][2]+curBoxArr[3][3]+"\n");
    if (depth == 0) {
        var retv = evaluateConfig(curBoxArr);
        console.log('reach leaf with value = '+retv);
        return retv;
    }
    if (maximizingPlayer) {
        for (var dir = 0; dir < 4; dir++) {
            if (validMove(curBoxArr, dir)) {
                var oldalpha = alpha;
                alpha = Math.max(alpha, alphabeta(doMove(curBoxArr, dir), depth-1, alpha, beta, false));
                if (depth == GLB_LOOK_AHEAD && alpha > oldalpha) GLB_FIRST_MOVE = dir;
                if (beta <= alpha)
                    break;
            }
        }
        return alpha;
    } else {
        var flag = false;
        for (var r = 0; r < 4; r++) {
            for (var c = 0; c < 4; c++) {
                if (curBoxArr[r][c] == 0) {
                    beta = Math.min(beta, alphabeta(doAdd(curBoxArr, r, c, 2), depth-1, alpha, beta, true));
                    if (beta <= alpha) {
                        flag = true;
                        break;
                    }
                    beta = Math.min(beta, alphabeta(doAdd(curBoxArr, r, c, 4), depth-1, alpha, beta, true));
                    if (beta <= alpha) {
                        flag = true;
                        break;
                    }
                }
            }
            if (flag) 
                break;
        }
        return beta;
    }
}

/* MinMax */
function minmax(boxArr) {
    alphabeta(boxArr, GLB_LOOK_AHEAD, -(1<<29), (1<<29), true);
    return GLB_MOVE_DIR[GLB_FIRST_MOVE];
}


/* What to do when get box arr back */
function GetBoxCallback(boxArr) {
    console.log(boxArr);

    /* Just Random */
    //chrome.tabs.getSelected(null, function(tab) {
    //    chrome.tabs.sendMessage(tab.id, {method: GLB_MOVE_DIR[Math.floor(Math.random()*4)]}, GetBoxCallback);
    //});

    /* Minmax */
    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, {method: minmax(boxArr)}, GetBoxCallback);
    });
}

function unitTest() {
    var testArr = new Array(4);
    for (var i = 0; i < 4; i++)
        testArr[i] = new Array(0,2,4,2);

    console.log("\n"+testArr[0][0]+testArr[0][1]+testArr[0][2]+testArr[0][3]+"\n"+
                testArr[1][0]+testArr[1][1]+testArr[1][2]+testArr[1][3]+"\n"+
                testArr[2][0]+testArr[2][1]+testArr[2][2]+testArr[2][3]+"\n"+
                testArr[3][0]+testArr[3][1]+testArr[3][2]+testArr[3][3]+"\n");

    for (var i = 0; i < 4; i++) {
        var ret = doMove(testArr, i);
        console.log("\n"+ret[0][0]+ret[0][1]+ret[0][2]+ret[0][3]+"\n"+
                ret[1][0]+ret[1][1]+ret[1][2]+ret[1][3]+"\n"+
                ret[2][0]+ret[2][1]+ret[2][2]+ret[2][3]+"\n"+
                ret[3][0]+ret[3][1]+ret[3][2]+ret[3][3]+"\n");
    }
}

/* MAIN */
chrome.extension.onMessage.addListener(function(message, sender, callback){
    if(message.method && message.method == 'move') {

        console.log("Move Requset Received.");

        /* STEP 1: Send Message to content.js for current config */
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendMessage(tab.id, {method: "GET_BOX"}, GetBoxCallback);
        });
    }
});



console.log("listener added");
