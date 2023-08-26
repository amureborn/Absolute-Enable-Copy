(function() {
    'use strict';

	var script = document.createElement('script');

	script.src = chrome.extension.getURL('js/enable');

	document.body.appendChild(script);

	let inject = {
		code: script,
		allFrames: true
	};

})();