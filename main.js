let c = false;
let a = false;
let r = false;

chrome.runtime.sendMessage({
    text: 'state'
});

chrome.runtime.onMessage.addListener(function(request) {
    if (request.c === 'true') {
        c = true;
    }
    if (request.a === 'true') {
        a = true;
    }
    state();
});

document.querySelector('.enable-copy').onclick = function () {
    enableCopy();
};

document.querySelector('.abs-mode').onclick = function () {
    CopyRightPlusMode();
};

document.querySelector('.reload').onclick = function () {
    chrome.tabs.reload();
    window.close();
};

document.querySelector('.settings').addEventListener('click', function() {
    chrome.tabs.create({
        url: 'pages/options.html'
    });
    window.close();
});

document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
});

chrome.tabs.query({active: true, currentWindow: true}).then(function(tabs) {
    let url = tabs[0].url;
    if (!/^https?:\/\//i.test(url)) {
        document.querySelector('.enable-copy').remove();
        document.querySelector('.abs-mode').remove();
        document.querySelector('.description').remove();
        document.querySelector('.state').style = 'color: #a98e8e; height: 150px; display: grid; align-items: center;';
        document.querySelector('.state span').innerHTML = 'Unable to run on this page';
    }
});

function enableCopy(message) {
    if (c === false) {
        c = true;
        message = {
            text: 'c-true'
        };
        chrome.runtime.sendMessage(message);
    } else {
        c = false;
        r = true;
        message = {
            text: 'c-false'
        };
        chrome.runtime.sendMessage(message);
    }
    state(r);
}

function CopyRightPlusMode(message) {
    if (a == false) {
        a = true;
        message = {
            text: 'a-true'
        };
        chrome.runtime.sendMessage(message);
    } else {
        a = false;
        r = true;
        message = {
            text: 'a-false'
        };
        chrome.runtime.sendMessage(message);
    }
    state(r);
}

function state(r) {
    if (c === true) {
        document.querySelector('.enable-copy img').src = 'images/on.png';
    } else {
        document.querySelector('.enable-copy img').src = 'images/off.png';
        if (r == true)
            reload();
    }
    if (a === true) {
        document.querySelector('.abs-mode img').src = 'images/on.png';
    } else {
        document.querySelector('.abs-mode img').src = 'images/off.png';
        if (r == true)
            reload();
    }
    if (c === false && a === false) {
        document.querySelector('.state span').innerHTML = 'Not Enabled';
    } else {
        document.querySelector('.state span').innerHTML = 'Enabled';
    }
}

function reload() {
    document.querySelector('.reload').style.display = 'flex';
}

const git = document.getElementById("earnings");
git.onclick = () => { chrome.tabs.create({ url: "https://amureborn.com/" }); };

const earningsElement = document.getElementById('amureborn');
const link = document.createElement('a');
link.href = 'https://amureborn.com/how-to-make-money-with-chrome-extension/';
link.textContent = earningsElement.textContent;
earningsElement.innerHTML = '';
earningsElement.appendChild(link);

// Add event listener to the link
link.addEventListener('click', () => {
  // Perform your desired action here
  // For example, open the link in a new tab:
  chrome.tabs.create({ url: link.href });
});
