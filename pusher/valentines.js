(function (document, Pusher) {

    var valentines = document.getElementById('valentines');
    var heart = document.getElementById('heart');
    var circle = document.getElementById('circle');

    var ended = false;

    var start = function (durationCSS) {
        document.body.classList.add('start');
        document.body.classList.remove('end', 'reset');
        var heart = document.getElementById('heart');
        heart.style.transitionDuration = durationCSS;
        heart.style.webkitTransitionDuration = durationCSS;
        heart.style.mozTransitionDuration = durationCSS;
    };
    var end = function () {
        document.body.classList.add('end');
        document.body.classList.remove('start', 'reset');
        ended = true;
    };
    var reset = function (backToBeginning) {
        if (!backToBeginning) {
            document.body.classList.add('reset');
        }
        document.body.classList.remove('start', 'end');
    };
    var resetBackToBeginning = function () {
        reset(true);
    };

    // Load icon svgs inline so they can be styled and not a font.
    var iconsPath = '../lib/Font-Awesome-SVG-PNG/black/svg/';
    var loadFontIcon = function (name, element) {
        var icon = iconsPath + name + '.svg';
        var id = 'fa-' + name;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', icon, true);
        xhr.onload = function (event) {
            var icon = xhr.responseXML.documentElement;
            icon.id = id;
            icon.classList.add(id);
            element.appendChild(icon);
        };

        // Following line is just to be on the safe side;
        // not needed if your server delivers SVG with correct MIME type
        xhr.overrideMimeType('image/svg+xml');
        xhr.send('');
    };

    loadFontIcon('heart', heart);
    loadFontIcon('heart-o', heart);

    // Without force touch.
    var timeout;
    var delay = 1000; // overrides css transition-delay
    var delayCSS = delay + 'ms';
    // Mouse or touch events.
    var eventIn = 'mousedown';
    var eventOut = 'mouseup';
    if ('ontouchstart' in window) {
        eventIn = 'touchstart';
        eventOut = 'touchend';
    }

    var completed = false;
    var running = false;

    var heartStart = function () {
        completed = false;
        running = true;
        start(delayCSS);
        timeout = window.setTimeout(function () {
            completed = true;
            running = false;
            end();
        }, delay);
    };
    var heartEnd = function () {
        window.clearTimeout(timeout);
        reset();
    };

    var startPusher = function () {
        document.body.classList.add('no-force-touch');
    };
    var cancelPusher = function () {
        heartEnd();
    };
    var resetPusher = function () {
        resetBackToBeginning();
    };

    // http://button.pusher.io/
    var pusher = new Pusher('087e104eb546157304a9', {cluster:'eu'});
    var pusherButton = pusher.subscribe('button');

    pusherButton.bind('press', function(data) {
        if (completed) {
            completed = false;
            return;
        }
        heartStart();
        startPusher();
    });
    pusherButton.bind('release', function(data) {
        if (completed) {
            return;
        } else if (running) {
            cancelPusher();
        } else {
            resetPusher();
        }
    });

    // Finish loading. A function in the event queue will only be processed
    // once every other bit of JavaScript here has run.
    window.setTimeout(function () {
        document.getElementById('main').style.display = '';
        document.getElementById('loading').style.display = 'none';
    }, 1000);

}(window.document, window.Pusher));
