(function() {
    'use strict';

    var css = document.createElement("style");
    var head = document.head;
    head.appendChild(css);

    css.type = 'text/css';

    css.innerText = `* {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
         user-select: text !important;
    }`;

    var elements = document.querySelectorAll("*");

    for (var i = 0; i < elements.length; i++) {
        if (elements[i].style.userSelect == 'none') {
            elements[i].style.userSelect = 'auto';
        }
    }

    document.oncontextmenu = null;
    document.onselectstart = null;
    document.ondragstart = null;
    document.onmousedown = null;
    document.body.oncontextmenu = null;
    document.body.onselectstart = null;
    document.body.ondragstart = null;
    document.body.onmousedown = null;
    document.body.oncut = null;
    document.body.oncopy = null;
    document.body.onpaste = null;

    var doc = document;
    var body = document.body;

    var docEvents = [
        doc.oncontextmenu = null,
        doc.onselectstart = null,
        doc.ondragstart = null,
        doc.onmousedown = null
    ];

    var bodyEvents = [
        body.oncontextmenu = null,
        body.onselectstart = null,
        body.ondragstart = null,
        body.onmousedown = null,
        body.oncut = null,
        body.oncopy = null,
        body.onpaste = null
    ];

    setTimeout(function() {
        document.oncontextmenu = null;
    }, 2000);

    [].forEach.call(['copy', 'cut', 'paste', 'select', 'selectstart'], function(event) {
        document.addEventListener(event, function(e) { 
            e.stopPropagation(); 
        }, true);
    });
})();
