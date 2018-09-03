/*jslint nomen: true */
/*global $, YT, jQuery, alert, confirm, eval, _training*/

//Build functions
function objToJSONString(obj) {
    "use strict";
    var isArray = (obj && obj.join && obj.pop && obj.push && obj.reverse && obj.shift && obj.slice && obj.splice),
        results = [],
        i,
        value;

    for (i in obj) {
        if (obj.hasOwnProperty(i)) {
            value = obj[i];

            if (typeof value === "object") {
                results.push((isArray ? "" : "\"" + i.toString() + "\" : ") + objToJSONString(value));
            } else if (value) {
                results.push((isArray ? "" : "\"" + i.toString() + "\" : ") + (typeof value === "string" ? "\"" + value + "\"" : value));
            } else {
                results.push((isArray ? "" : "\"" + i.toString() + "\" : ") + (typeof value === "string" ? "\"\"" : 0));
            }
        }
    }

    return (isArray ? "[" : "{") + results.join(", ") + (isArray ? "]" : "}");
}

function trim(st) {
    "use strict";
    while (st) {
        if (st.indexOf(" ") === 0) {
            st = st.substring(1);
        } else {
            break;
        }
    }
    while (st) {
        if (st.lastIndexOf(" ") === st.length - 1) {
            st = st.substring(0, st.length - 1);
        } else {
            break;
        }
    }
    return st;
}

function generateBuild() {
    "use strict";
    var obj = objToJSONString(_training.getSendDataObj());
    document.getElementById('codearea').value = obj;
}

function applyBuild(job) {
    "use strict";
    var api = jQuery("ul.tabs").data("tabs"),
        obj = trim(document.getElementById('codearea').value),
        c;

    if (obj === "") {
        return;
    }

    try {
        c = $.parseJSON(obj);
        if (String(c.character_job) !== job) {
            document.getElementById('codearea').value = "Wrong class!!";
            return;
        }

        _training.loadGetJsonData(obj);
        document.getElementById('codearea').value = obj;
    } catch (err) {
        document.getElementById('codearea').value = "Invalid input!!";
        return;
    }
}


// Url functions
function generateUrl(job) {
    "use strict";
    var obj = objToJSONString(_training.getSendDataObj()),
        base = "bnstree.com/" + job + "/?build=";
    document.getElementById('codearea').value = base + obj;
}

function getQueryVariable(variable) {
    "use strict";
    var query = window.location.search.substring(1),
        vars = query.split("&"),
        i,
        pair;
    for (i = 0; i < vars.length; i += 1) {
        pair = vars[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return (false);
}

function queryUrl(job) {
    "use strict";
    var j = getQueryVariable("build"),
        c;

    if (j) {
        j = j.replace(/%20/g, ' ');
        j = j.replace(/%22/g, '"');
        j = j.replace(/%7B/g, '{');
        j = j.replace(/%7D/g, '}');
        try {
            c = $.parseJSON(j);
            if (String(c.character_job) !== job) {
                document.getElementById('codearea').value = "Wrong class!!";
                return;
            }

            _training.loadGetJsonData(j);
            document.getElementById('codearea').value = j;
        } catch (err) {
            document.getElementById('codearea').value = "Invalid input!!";
            return;
        }
    }
}


// Youtube functions
var tag = document.createElement('script');
var player;
var firstScriptTag = document.getElementsByTagName('script')[0];

tag.src = "//www.youtube.com/iframe_api";
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onPlayerReady() {
    "use strict";
    // Mute!
    player.mute();
    //player.playVideo();
}

function onYouTubeIframeAPIReady() {
    "use strict";
    player = new YT.Player('ytplayer', {
        events: {
            'onReady': onPlayerReady
        }
    });
}


// Skill tree resize functions
function setSize() {
    "use strict";
    var width = $('.container').width(),
        height = $('.trWrap').height(),
        scale,
        hscale;

    if (window.matchMedia('(max-width: 991px)').matches) {
        scale = width / 515;
        hscale = scale * height;
    } else {
        scale = width / 940;
        hscale = scale * height;
    }

    $('.training-content').css({
        'height': hscale
    });
    $('.trWrap').css({
        'transform': 'scale(' + scale + ')',
        '-ms-transform': 'scale(' + scale + ')',
        '-webkit-transform': 'scale(' + scale + ')'
    });
}

$(window).resize(function () {
    "use strict";
    setSize();
});

$(document).ready(function () {
    "use strict";
    setSize();

    var $body = $(document);
    $body.bind('scroll', function () {
        // "Disable" the horizontal scroll.
        if ($body.scrollLeft() !== 0) {
            $body.scrollLeft(0);
        }
    });
});


// Misc. functions
var tempScrollTop;
$(window).scroll(function () {
    "use strict";
    tempScrollTop = $("div.categoryBody").scrollTop();
});


$('.modal').on('hidden.bs.modal', function (event) {
    "use strict";
    setTimeout(function () {
        $('[data-toggle="modal"]').blur();
    });
});


$(".canvas").click(function () {
    "use strict";
    $('[data-toggle="offcanvas"]').blur();
});


$(".dropdown").click(function () {
    "use strict";
    $('[data-toggle="dropdown"]').blur();
});

function changeBuild(build) {
    $("#applyBuildButton").attr("onclick", build);
}