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

    [].forEach.call(['contextmenu', 'copy', 'cut', 'paste', 'mouseup', 'mousedown', 'keyup', 'keydown', 'drag', 'dragstart', 'select', 'selectstart'], function(event) {
        document.addEventListener(event, function(e) {
            e.stopPropagation();
        }, true);
    });
})();
