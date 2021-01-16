var ProPresenter = [];

var ConnectedMode = "Primary";

document.addEventListener('DOMContentLoaded', function(){
    ProPresenter[0] = new Connection();
    ProPresenter[0].connect();
});

var Connection = function() {

    this.closing = false;

    if('ClockLocale' in config) {
        this.clockLocale = config['ClockLocale'];
    } else {
        this.clockLocale = "en-AU";
    }

    return this;
}

Connection.prototype.connect = function() {

    console.log("Trying " + ConnectedMode);

    if(ConnectedMode == 'Primary') {
        this.ip = config['IPAddress'];
        this.port = config['IPPort'];
        this.password = config['Password'];
    } else {
        this.ip = config['BackupIPAddress'];
        this.port = config['BackupIPPort'];
        this.password = config['BackupPassword'];
    }
    
    this.url = 'ws://' + this.ip  + ':' + this.port + '/stagedisplay';

    this.socket = new WebSocket(this.url);
    parentThis = this;

    parentThis.socket.onopen = function() {
        // Login
        parentThis.socket.send(JSON.stringify({
            "pwd": parentThis.password,
            "ptl": 610,
            "acn": "ath"
        }));
    };

    parentThis.socket.onmessage = function(e) {
        parentThis.message(JSON.parse(e.data));
    };

    parentThis.socket.onclose = function(e) {

        if(this.closing == true) {
            return false;
        }

        setTimeout(function() {
            parentThis.connect();
        }, 1000);
    };

    parentThis.socket.onerror = function(err) {
        console.error('Socket encountered error: ', err.message, '. Closing socket');
        parentThis.socket.close();

        if(ConnectedMode == 'Primary') {
            ConnectedMode = 'Backup';
        } else {
            ConnectedMode = 'Primary';
        }
    };
}

Connection.prototype.disconnect = function() {
    this.closing = true;
    this.socket.close();

    if(ConnectedMode == 'Primary') {
        ConnectedMode = 'Backup';
    } else {
        ConnectedMode = 'Primary';
    }
}

Connection.prototype.message = function(msg) {
    // Receive messages from ProPresenter

	var text_cs_note = "";
	var text_ns_note = "";
	var text = "";

    if (msg.acn == "ath") {
        if (msg.ath == true) {
            console.log("Authentication succeeded");
        } else {
            console.log("Authentication failed: " + msg.err);
        }

    } else if (msg.acn == "fv") {
    	// Loop first to try and find slide notes
        for(a in msg.ary) {
            if (msg.ary[a].acn == "csn") {
                // Current slide text:
                text_cs_note = lyric_text_cleanup(msg.ary[a].txt);
            } else if (msg.ary[a].acn == "nsn") {
                // Next slide text:
                text_ns_note = lyric_text_cleanup(msg.ary[a].txt);
            }
        }

        // Now find the current/next text and send the callbacks
        for(a in msg.ary) {
            if (msg.ary[a].acn == "cs") {
                // Current slide text:
                text = lyric_text_cleanup(msg.ary[a].txt);
                if(typeof callback_lyrics_current === 'function') {
                	if(callback_lyrics_current.length == 2) {
                		callback_lyrics_current(text, text_cs_note);
                	} else {
                		callback_lyrics_current(text);
                	}
                }
            } else if (msg.ary[a].acn == "ns") {
                // Next slide text:
                text = lyric_text_cleanup(msg.ary[a].txt);
                if(typeof callback_lyrics_next === 'function') {
                	if(callback_lyrics_current.length == 2) {
                		callback_lyrics_next(text, text_nsn_note);
                	} else {
                		callback_lyrics_next(text);
                	}
                }
            }
        }
    } else if (msg.acn == "sys") {
        // Clock update
        if(typeof callback_clock === 'function') {
            callback_clock(msg.txt, this.clockLocale);
        }
    }
}

String.prototype.replaceAll = function(search, replacement) {
    // From https://stackoverflow.com/a/17606289
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function lyric_text_cleanup(text) {
    // Perform various cleanups & transformations on the text before it is sent off to be rendered

    text = text.replaceAll('\r\n', '\n');
    text = text.replaceAll('\r', '\n');
    text = text.trim();

    // Turn a bunch of special chars into HTML Entities
    var text = text.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
        return '&#'+i.charCodeAt(0)+';';
    });

    // Line Separator character fix
    text = text.replaceAll('&#8232;', '\n');

    // Wrap bible verse numbers in a <span>
    var text = text.replace(/([0-9]+)([A-za-z]+)/, function(all, ref, text) {
        return '<span class="verse-ref">'+ref+'</span> ' + text;
    });

    // Each line will be returned in a list
    lines_output = [];

    if(text == '') {
        return [];
    }

    // Allow splitting off multi-lingual versions of slides
    if(config['SplitLines'] !== null) {
        text_split = text.split(config['SplitLines']);
        text = text_split[config['SplitLinesNum']];
    }

    lines = text.split('\n');

    for(var lineI in lines) {
        line = lines[lineI];
        line = line.trim();
        if(line != '') {
            lines_output.push(line);
        }
    }

    return lines_output;
}
function lyrics_text_html(lines) {
    var html = '';
    for(var lineI in lines) {
        var line = lines[lineI].trim();
        if(line != "") {
            html += '<p><span>'+line+'</span></p>';
        }
    }
    return html;
}

function clear_timeouts() {
    var id = window.setTimeout(function() {}, 0);
    while (id--) {
        window.clearTimeout(id);
    }
}
