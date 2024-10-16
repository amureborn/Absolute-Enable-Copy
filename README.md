# Absolute Enable Right Click & Copy

This Chrome extension, designed with the latest Chrome updates Manifest V3, allows you to Enable Context Menu, Allow Copy and Right-click functionalities on websites that have disabled these commands. Additionally, it allows users to copy text from images using the OCR function.

Absolute Enable Copy & Image Reader is available in the [Chrome Web Store](https://chrome.google.com/webstore/detail/copyright%20-enable-right-c/pkoccklolohdacbfooifnpebakpbeipc) & [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/copyright-enable-copy-/inmkjedjdhgpknjogbjomhnbgdccckkg)

## Screenshot

![unnamed (1)](https://github.com/user-attachments/assets/2c7fdfa3-7b92-4ddc-a5dc-0448e5d34d25)

## 📣 Features

1. Enable Copy and Highlight: Effortlessly copy text and highlight content on web pages.
2. Re-enable Context Menu: Regain access to the right-click context menu for a seamless browsing experience.
3. Remove Copytext Protection: Bypass restrictions set by websites to prevent copying text.
4. Absolute Mode: A robust mode to remove various types of protection against advanced methods disabling copy-paste functionality.

## 📣 How To Use

1. Installation: Begin by installing the Absolute Enable Copy & Image Reader extension from the respective browser store.
2. Accessing the Options: After installation, click on the extension icon located in the top-right corner of your browser.
3. Choosing the Mode: In the popup, select between three options: “Enable Copy,” “Absolute Mode,” or “Image Reader (OCR).”
4. Ready to Copy: Post selecting your desired mode, start copying text from any website seamlessly.

## 📣 How I Built This Extension!

Recently, we published our first Chrome extension that enables right-click and copy functionality on websites that have disabled the text copy selection command on their websites. Additionally, we added an OCR Image Reader feature that allows you to extract text from images. In this article, we will show you how to create a Chrome extension that enables right-click functionality.

Here is a simple and detailed step-by-step guide on how you can create your own 'Enable Right-Click & Copy' Chrome extension.

Before starting the actual development of the 'Absolute Enable Copy & Image Reader' Chrome extension, we first need to understand what a Chrome extension is. Chrome extensions are small tools or software pieces that can be installed in browsers to add extra features, enhancing our browsing experience.

To make a simple extension you need simple web technologies like HTML, CSS, and JavaScript, along with some knowledge of web development. You will be pleased to know that our straightforward "Absolute Enable Copy & Image Reader" Chrome extension is built using these technologies.

Creating a Chrome extension is similar to creating a web application, but it requires a manifest.json file which we will discuss in this post.

![How-to-Build-a-Chrome-extension-that-enables-right-click-functionality-1024x576](https://github.com/TechnoMare/Enable-Copy/assets/96228020/379c2e58-f051-4cca-8d60-8b43ae37a56c)

Have you ever tried to copy important text from a website but couldn’t because it disabled the copy and right-click functions?

You can solve this with a handy browser extension that lets users right-click and copy, even on restrictive sites. Want to upgrade your browser experience? Here’s a simple step-by-step guide to making this extension from scratch.

## 1. Setting Up Your Workspace

First, you need a special folder (or “directory”) where all your files will live.

📂 Create a New folder named “Extension Name” on your computer.

![Create-a-New-Folder-1024x576](https://github.com/TechnoMare/Enable-Copy/assets/96228020/bf145539-136c-45fe-94b2-2bbb1d1055e5)

Inside “Extension Name“, make these folders:

- ‘js‘ (for code stuff)
* ‘images‘ (for pictures)
+ ‘css‘ (for style stuff)

This organization ensures that our files are well-structured and easy to locate.

## 2. The Heart: Manifest File

Every extension begins with a manifest.json file. This is like an ID card for your extension. This crucial file provides metadata about the extension: its name, version, permissions, and more.

First of all, we need the VS Code editor where we will write our HTML, CSS, or JavaScript code. So, download [Visual Studio Code](https://code.visualstudio.com/) and install it on your PC or laptop. Now

- Open Visual Studio Code on Your PC.
- Go To File > Open Folder > Select “Extension Name” folder
- Go To File > New File > Create a Manifest.json File

![Create-a-Manifest json-File-1024x200](https://github.com/TechnoMare/Enable-Copy/assets/96228020/424ad674-4bfd-426f-ac22-b0248c268310)

After creating a Manifest.json file, paste this HTML boilerplate code:

```
{
    "manifest_version": 3,
    "name": "Extension Name",
    "version": "1.0.0",
    "description": "Extension Description",
    "action": {
        "default_popup": "popup.html",
        "default_icon": {
            "16": "images/16px.png",
            "48": "images/48px.png",
            "128": "images/logo.png"
        }
    },
    "background": {
        "service_worker": "background.js"
    },
    "permissions": ["activeTab", "storage", "scripting"],
    "icons": {
        "16": "images/16px.png",
        "48": "images/48px.png",
        "128": "images/logo.png"
    }
}
```
This manifest file is structured with the extension’s name, version, and description. It also includes a default page called popup.html and a background service worker named background.js. Furthermore, it specifies the necessary permissions, such as:

- ActiveTab: This permission allows the extension to access the currently active tab in the browser.
- Storage: This permission allows the extension to use local storage to store and retrieve data.
- scripting: It grants the extension the ability to modify the behavior of web pages by injecting scripts into them.

You can have a look [here](https://developer.chrome.com/docs/extensions/mv3/manifest/) to see all configurations of a manifest.json file.

> [!NOTE]
> Place the manifest.json file at the root of your directory. This file will tell the browser about the core properties of your extension.

## 3. The Brain: Background Scripts & Page

To make the magic happen, you require two files: background.js and background.html. These files work in the background and handle different tasks without being noticed. They manage how the browser works.

The background scripts take care of tasks like managing a list of websites and enabling specific features, such as copying and right-clicking, on those websites.

- Go To File > New File > Create a background.js File

After creating a background.js file, paste this JavaScript boilerplate code:

```
let websites_List = [];

chrome.storage.local.get(['websites_List'], function(value) {
  websites_List = value.websites_List || [];
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  let text = request.text;
  chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    if (tabs[0] && tabs[0].url) {  // Check if tabs[0].url is not undefined or null
      let url;
      try {
        url = (new URL(tabs[0].url)).hostname;
      } catch (error) {
        console.error('Error constructing URL:', error, 'from:', tabs[0].url);
        return;
      }
      state(url, text);
      enableCopy(url, text, tabs[0].id);
    }
  });
  if (text === 'delete-url') {
    deleteUrl(request.url);
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url) {  // Check if tab.url is not undefined or null
    let hostname;
    try {
      hostname = (new URL(tab.url)).hostname;
    } catch (error) {
      console.error('Error constructing URL:', error, 'from:', tab.url);
      return;
    }
    inject(tabId, hostname);
  }
});

function state(url, text) {
  if (text === 'state') {
    if (websites_List.indexOf(url + '#c') !== -1) {
      chrome.runtime.sendMessage({
        c: 'true'
      });
    }
    if (websites_List.indexOf(url + '#a') !== -1) {
      chrome.runtime.sendMessage({
        a: 'true'
      });
    }
  }
}

function enableCopy(url, text, tabId) {
  if (text === 'c-true') {
    websites_List.push(url + '#c');
    inject(tabId, url);
    saveData();
  }
  if (text === 'c-false') {
    let index = websites_List.indexOf(url + '#c');
    if (index > -1) {
      websites_List.splice(index, 1);
      saveData();
    }
  }
  if (text === 'a-true') {
    websites_List.push(url + '#a');
    inject(tabId, url);
    saveData();
  }
  if (text === 'a-false') {
    let index = websites_List.indexOf(url + '#a');
    if (index > -1) {
      websites_List.splice(index, 1);
      saveData();
    }
  }
}

async function inject(tabId, url) {
  if (url !== undefined && url !== null) {
    if (tabId !== undefined) {
      if (websites_List.indexOf(url + '#c') !== -1) {
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['js/enable.js']
          });
        } catch (error) {
          console.error('Error:', 'url:', url, '- tabId:', tabId, '\n', error);
        }
      }
      if (websites_List.indexOf(url + '#a') !== -1) {
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tabId, allFrames: true },
            files: ['js/enableA.js']
          });
        } catch (error) {
          console.error('Error:', 'url:', url, '- tabId:', tabId, '\n', error);
        }
      }
    }
  }
}

function deleteUrl(url) {
  let index = websites_List.indexOf(url);
  if (index !== -1) {
    websites_List.splice(index, 1);
    saveData();
  }
}

function saveData() {
  chrome.storage.local.set({
    'websites_List': websites_List
  });
}
```

This JavaScript represents the logic of our background.js file. Now, let’s create a background.html file where the JavaScript code will be executed.

```
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <script type="text/javascript" src="background.js"></script>
</head>
<body>
</body>
</html>
```

> [!NOTE]
> Place the background.js file (containing the logic) and the background.html file (containing the structure) in the root directory.

## 4. User Interaction: Popup Page & Script

Now that we’ve put the heart and brain into our extension, it’s time to introduce the popup. This is where users can see and interact with our extension. The popup acts as a small interactive window, crafted using a combination of HTML and JavaScript.

This page directly interacts with our background.js, which we created earlier to make the extension function. To enable our extension to work with the popup, we need two files: popup.html (for the appearance) and popup.js (for the behavior).

- Go To File > New File > Create a popup.js File

After creating a popup.js file, paste this JavaScript boilerplate code:

```
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
        url: 'src/options.html'
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
git.onclick = () => { chrome.tabs.create({ url: "https://technomare.com/" }); };
```

After creating the popup.js file, it’s time to create the popup.html file where users can interact with our extension.

```
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
	<title>Enable Right Click & Copy</title>
	<link rel="stylesheet" type="text/css" href="/css/popup.css">
</head>
<body>
	<div class="footer">
		<div class="money-info" id="earnings">~amu"</div>
		<div class="settings" title="Settings"></div>
	</div>
	<div class="container">
		<div class="header"><img src="/images/mainicon.png"/> </div>
		<div class="description">
			<div class="reload" title="Reload to apply changes">
			<img src="/images/reload.png"></div>
			</div>
		<div class="state"><span>Not Enabled</span></div>
		<div class="enable-copy mid-container">
	    <span class="mode-text">Enable Copy</span>
		<img class="check-image" src="/images/off.png"></div>
		<div class="abs-mode mid-container">
	    <span class="mode-text">Absolute Mode</span>
		<img class="check-image" src="/images/off.png"></div>
	<script type="text/javascript" src="popup.js"></script>
</body>
</html>
```

In this popup.html, we have set two modes of enabling copy.

1. “Enable Copy” Mode: This mode lets you copy text on smaller websites.
2. “Absolute Mode: This mode helps you to copy text forcefully on larger websites, even when their copy function is blocked.

We have also added some options like reloading the active page and have given access to the extension’s settings page to make the extension more interactive. but as of now, we haven’t used CSS to make our UI user-friendly and more good-looking. To make it better, you can give the popup a nicer look using some CSS code. to do this first, we create a new file “popup.css” with CSS code, Now

- Go To File > New File > Create a popup.css File. (Make sure that this file is located in the “css” folder.)

```
body {
	margin: 0;
	padding: 0;
  }
div, img {
	user-select: none;
	-webkit-user-select: none;
	-webkit-user-drag: none;
	-moz-user-select: none;
	-moz-user-drag: none;
}
.container {
	max-width: 500px;
	padding: 15px;
	box-sizing: border-box;
	margin: 0 auto;
  }
  .header {
	align-items: center;
	border-bottom: 2px solid darkred;
  }
  .header img {
	height: 50px;
	margin-bottom: 15px;
	display: block;
}
  .state {
	font-family: Segoe UI, Arial, sans-serif;
	font-size: 17px;
	color: #666;
	text-align: center;
	padding: 25px;
}
.mid-container {
	padding: 10px;
	width: auto;
	height: 20px;
	font-family: Segoe UI, Arial, sans-serif;
	font-size: 15px;
	color: #666;
	margin: auto;
	line-height: 20px;
	cursor: pointer;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1px solid #e4e4e4;
}
.enable-copy {
	border-top: 1px solid #666;
}

.mode-text {
	margin: 0px;
}

.check-image {
	width: auto;
	height: 14px;
	background-repeat: no-repeat;
	user-select: none;
	float: right;
	margin: 0;
	opacity: 0.8;
}
.description {
	margin: 12px 0;
	font-size: 12px;
	display: grid;
	align-items: center;
	text-align: center;
	height: 40px;
	justify-content: center;
}

.reload {
	display: none;
	cursor: pointer;
	opacity: 0.4;
}

.reload img {
	width: auto;
	height: 35px;
	margin: auto;
	transform: rotate(0deg);
}
/* Money info styles */
.money-info {
	width: 22px;
	height: 22px;
	font-size: 15px;
	font-weight: bold;
	margin-left: 10px;
	vertical-align: middle;
	background-size: 100%;
	cursor: pointer;
}

.footer {
	width: auto;
	height: 40px;
	bottom: 0;
	color: #545454;
	background-color: #f1f3f4;
	text-decoration: unset;
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-radius: 0 0 2px 2px;
	border-top: 1px solid #d8d8d8;
}

.settings {
	width: 22px;
	height: 22px;
	margin-right: 10px;
	vertical-align: middle;
	opacity: 0.4;
	background-image: url(/images/settings.png);
	background-repeat: no-repeat;
	background-size: 100%;
	cursor: pointer;
}
.footer .browsers {
	position: relative;
	left: 125px;
	top: 2px;
}

.browsers img {
	height: 20px;
	width: auto;
	cursor: pointer;
}

.enable-copy:hover, .abs-mode:hover {
	background: #ece9e3;
}

.enable-copy:active, .abs-mode:active {
	background: #e4e1d9;
}

.reload:hover {
	opacity: 0.6;
}

.reload:active {
	opacity: 0.4;
}

.settings:hover {
	opacity: 0.6;
}

.settings:active {
	opacity: 0.5;
}
```

This CSS file contains styles for the main page of a Chrome extension. It defines the appearance and layout of various elements on the popup page.

## 5. Add Some Extra Features: Options Page & Script

Next, let’s create an Options page. This page will display a list of websites where the extension can be used to enable the copy function, allowing users to select text from those sites. Users will also have the capability to delete Websites from this list.

Additionally, the Options page will fetch and display the latest posts from the RSS feed of our website, technomare.com. so for this, We’ll create three files: Options.js (for the behavior), Options.html (for the structure), and Options.css (for styling).

- Go To File > New File > Create an Options.js File

After creating an Options.js file, paste this JavaScript boilerplate code:

```
(function() {

	function callback(u) {
	  u = document.querySelector('#user-list');
	  chrome.storage.local.get('websites_List', function(value) {
		if (value.websites_List !== undefined) {
		  for (var i = 0; i < value.websites_List.length; i++) {
			getData(u, value.websites_List[i]);
		  }
		  empty(u);
		} else {
		  return;
		}
	  });
	}
  
	function getData(u, url, mode) {
	  var hostname = url;
	  var d = document.createElement('div');
	  u.appendChild(d);
	  d.className = 'table-row';
	  if (url.indexOf('#c') !== -1) {
		url = url.replace('#c', '');
		urlFilter = url + '##enable-copy';
		mode = 'enable-copy';
	  } else {
		url = url.replace('#a', '');
		urlFilter = url + '##CopyRightPlus-mode';
		mode = 'CopyRightPlus-mode';
	  }
	  d.innerHTML = `
		<div class="row-label" url=${url} mode=${mode} >${urlFilter}</div>
		<i class="row-delete" name=${mode} title="Delete"></i>
	  `;
	  d.querySelector('.row-delete').addEventListener('click', function() {
		chrome.runtime.sendMessage({
		  text: 'delete-url',
		  url: hostname
		});
		d.remove();
		empty(u);
	  });
	}
  
	function empty(u) {
	  var empty = document.querySelector('.list-empty');
	  if (empty !== null && u.querySelectorAll('.table-row')[0] !== null) {
		empty.style.display = 'none';
	  }
	  if (u.querySelector('.table-row') === undefined || u.querySelector('.table-row') === null) {
		empty.style.display = 'block';
	  }
	}
  
	window.onload = function() {
	  callback();
	  fetch('https://amureborn.com/feed/')
		.then(response => response.text())
		.then(str => {
		  let parser = new DOMParser();
		  let xmlDoc = parser.parseFromString(str, 'text/xml');
  
		  const items = xmlDoc.querySelectorAll('item');
		  const latestItems = Array.from(items).slice(0, 3);
		  let html = '';
		  latestItems.forEach(el => {
			const title = el.querySelector('title').textContent;
			const link = el.querySelector('link').textContent;
  
			html += `
			  <div class="post">
				<h2><a href="${link}" target="_blank">${title}</a></h2>
			  </div>
			`;
		  });
  
		  document.getElementById('rss-feed').innerHTML = html;
		})
		.catch(error => {
		  console.error('Error fetching RSS feed:', error);
		});
	};
  })();
```

After creating the Options.js file, let’s proceed to develop the Options.html file, where users can interact with our extension’s additional features.

- Go To File > New File > Create an Options.html File

After creating an Options.html file, paste this html boilerplate code:

```
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
	<title>Enable Right Click & Copy</title>
	<link rel="stylesheet" type="text/css" href="/css/popup.css">
</head>
<body>
	<div class="footer">
		<div class="money-info" id="earnings">~amu"</div>
		<div class="settings" title="Settings"></div>
	</div>
	<div class="container">
		<div class="header"><img src="/images/mainicon.png"/> </div>
		<div class="description">
			<div class="reload" title="Reload to apply changes">
			<img src="/images/reload.png"></div>
			</div>
		<div class="state"><span>Not Enabled</span></div>
		<div class="enable-copy mid-container">
	    <span class="mode-text">Enable Copy</span>
		<img class="check-image" src="/images/off.png"></div>
		<div class="abs-mode mid-container">
	    <span class="mode-text">Absolute Mode</span>
		<img class="check-image" src="/images/off.png"></div>
	<script type="text/javascript" src="popup.js"></script>
</body>
</html>
```

This code defines the appearance of various elements on the Options page, but it needs CSS to look nice. Let’s make an Options.css file to style our Options.html page.

- Go To File > New File > Create a popup.css File. (Make sure that this file is located in the “css” folder.)

```
body {
	margin: 0;
	padding: 0;
	background: #fff;
	font-family: Segoe UI, Arial, sans-serif;
	height: 100%;
}

.header {
	display: flex;
	height: 50px;
	margin: auto;
	padding: 20px 0;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0px 4px 8px -3px #11111129;
}

.header-content {
	margin: 10px auto;
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 1000px;
}

.header-title {
	float: left;
	font-size: 22px;
	font-weight: 500;
	color: #515151;
}

.rate {
	width: 160px;
	height: 40px;
	float: right;
	background: #f2faf4;
	border-radius: 3px;
	font: 500 14px'Open Sans', Arial, sans-serif;
	color: #778b7c;
	text-decoration: none;
	background-image: url(/images/heart.png);
	background-repeat: no-repeat;
	background-position: 10px 13px;
	background-size: 15px;
}

.rate span {
	float: right;
	padding: 12px 10px;
}

.rate img {
	height: 14px;
	transform: translateY(15%);
}

.border {
	display: block;
	width: 1000px;
	margin: auto;
	border-bottom: 1px solid #d6dee5;
}

.table {
	margin: 25px auto;
	max-width: 1000px;
	background-color: #ffffff;
	box-shadow: 0px 4px 8px -3px #11111129;
	border-radius: 5px;
  }
  
  .table-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 13px 39px 13px 36px;
	background: #515151;
	color: #ffffff;
	font-size: 16px;
  }
  
  .label-title {
	font-weight: bold;
  }
  
  .label-hint {
	font-size: 11px;
	color: #cacaca;
  }
  
  .table-grid {
	position: relative;
	max-height: 352px;
	overflow-y: auto;
	overflow-x: hidden;
	border-left: 1px solid #e6e6e6;
	border-right: 1px solid #e6e6e6;
  }
  
  .table-row {
	display: flex;
	align-items: center;
	padding: 9px 39px 9px 36px;
	border-bottom: 1px solid #e6e6e6;
  }
  
  .row-label {
	flex: 1;
	font-size: 14px;
	font-family: monospace;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	cursor: pointer;
  }
  

.row-delete {
	width: 16px;
	height: 16px;
	cursor: pointer;
	background-image: url(/images/delete.png);
	background-repeat: no-repeat;
	background-size: 90%;
	opacity: 1;
	display: inline-block;
	margin-top: 5px;
}

.table-border-bottom {
	border-bottom: 1px solid #e6e6e6;
	margin: auto;
	width: 1000px;
	position: absolute;
	bottom: 0px;
}

.table-action {
	position: absolute;
	right: 0;
	padding: 6px 5px;
	font-size: 12px;
	color: #8a8e6f;
	text-decoration: underline;
	cursor: pointer;
}

.list-empty {
	position: relative;
	width: 100%;
	top: 45%;
	text-align: center;
	margin: 50px auto;
	font: 400 14px/100% 'Open Sans', Arial, sans-serif;
	color: #999;
}

.info {
	width: 1000px;
	height: 90px;
	padding: 20px 0;
	margin: auto;
	font-family: Roboto, 'Segoe UI', Tahoma, sans-serif;
}

.section-title {
	color: #7b7575;
	font-size: 15px;
	font-weight: 500;
}

.section li {
	color: #757575;
	font-size: 14px;
}

.footer {
	display: block;
	margin: auto;
	color: #999;
	font-family: "Lucida Grande", sans-serif;
	font-size: 12px;
	text-align: center;
	padding: 20px;
}

.footer-content {
	margin: auto;
	padding: 15px 0;
	display: flex;
	align-items: center;
	max-width: 1000px;
	justify-content: space-between;
	background-color: #efefef;
}

.content-logo {
	display: flex;
	align-items: center;
	padding: 0 20px;
}

.footer-content-info {
	text-align: left;
	padding: 0 5px;
}

.content-info-name {
	color: #7b7575;
	font-size: 14px;
	font-weight: 500;
	font-family: Roboto, 'Segoe UI', Tahoma, sans-serif;
}

.content-info-ver {
	font-size: 10px;
}

.browsers-support {
	display: flex;
	align-items: center;
	padding: 0 20px;
}

.ico--chrome, .logo--ico {
	display: inline-block;
	width: 32px;
	height: 32px;
	background-position: center;
	background-repeat: no-repeat;
	transition: background-image .3s ease;
	background-color: transparent;
	padding: 0 0 0 10px;
	opacity: 0.8;
}

.logo--ico {
	opacity: 1;
	background-size: 32px;
	background-image: url(/images/48px.png);
}

.ico--chrome {
	background-image: url(/images/chrome.png);
}
/* Existing CSS above... */

/* Styles for RSS feed posts */
.post {
    border: 1px solid #ccc;
    margin: 8px;
    padding: 8px;
    border-radius: 5px;
}
.post h2 {
    margin: 0;
}
.post h2 a {
    text-decoration: none;
    color: #333;
}
.post h2 a:hover {
    color: #60af81;
}

/* Existing CSS below... */
.article-grid {
	position: relative;
	max-height: 352px;
	overflow-y: auto;
	overflow-x: hidden;
	border-left: 1px solid #e6e6e6;
	border-right: 1px solid #e6e6e6;
  }
.technomare {
	margin: 25px auto;
	max-width: 1000px;
	background-color: #ffffff;
	box-shadow: 0px 4px 8px -3px #11111129;
	border-radius: 5px;
  }
  
  .technomare-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 13px 39px 13px 36px;
	background: #515151;
	color: #ffffff;
	font-size: 16px;
  }
  .article-title {
	font-weight: bold;
  }
.technomare-border-bottom {
	border-bottom: 1px solid #e6e6e6;
	margin: auto;
	width: 1000px;
	position: absolute;
	bottom: 0px;
}
```

This CSS code provides styles for the header, tables, list items, footer, and other sections of the Options page. The goal is to achieve a neat and organized layout with consistent colors, fonts, and spacing.

## 6. Make The Extension Work ( Main JavaScript )

Congratulations! You’ve created almost all the necessary extension files. However, our main functions aren’t set up yet. As mentioned earlier, I’ve added two modes: the first is “Enable Copy” and the second is “Absolute Mode”.

These modes determine how our extension will operate. Let’s create a new file named enable.js For the “Enable Copy” mode, and another file named enableA.js for the “Absolute Mode”. (Make sure that those files are located in the “js” folder.)

- Go To File > New File > Create an enable.js File.

After creating an enable.js file, paste this JavaScript boilerplate code:

```
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

```

Next, create an enableA.js file for the “Absolute Mode”.

- Go To File > New File > Create an enableA.js File.

After creating an enableA.js file, paste this JavaScript boilerplate code:

```
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
```

After creating those files, let’s create one final file named “injection.js” for our extension which will inject both enable.js and enableA.js functions with our extension. (Make sure that this file is also located in the “js” folder.)

- Go To File > New File > Create an injection.js File.

After creating an injection.js file, paste this JavaScript boilerplate code:

```
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
```

This JavaScript will ensure that either “enable.js” or “enableA.js” is properly injected into sites to override certain events (like context menu, copy, cut, paste, etc.) that may be preventing the user from right-clicking or copying content.

## 7. Important: Upload All Required Images

Be careful when uploading images for the extension. All required images should be organized and uploaded within a single folder, making it easier to locate the image paths. Earlier, we created a folder named “Images” inside the “Extension Name” folder. Put all the needed images there.

Create the necessary images using Canva or any other image creation or editing tool you’re comfortable with.

![Required-Images-For-Extension-1024x576](https://github.com/TechnoMare/Enable-Copy/assets/96228020/b0fdb2aa-2605-4e69-ac13-e852400de7b9)

## 8. Adding Your Files To Chrome://Extensions

Once all of this is done, we’re ready to add this project as an extension to our Chrome browser.

To do this, go to “Extensions” and then select “Manage Extensions” from the browser menu, as shown in the picture below:

- Chrome Browser > Extensions > Manage Extensions

![Navigating-to-Extensions-in-Chrome-1024x576](https://github.com/TechnoMare/Enable-Copy/assets/96228020/ace8ca60-4457-49b9-8f3a-ab7e85030936)

After choosing Extensions, it redirects to the extensions page in Chrome. Make sure to enable the Developer mode here.

![Load-Chrome-Extension-1024x576](https://github.com/TechnoMare/Enable-Copy/assets/96228020/dc03ce31-6f32-4d4c-bcaa-091426fed5dd)

Once that’s done, you need to click the Load unpacked button that will allow us to load our project in the Chrome extension store.

Now, the extension is available in our Chrome extension store. You can also pin the extension in the browser as shown in the gif above:

This extension works only in your browser. If you want to publish it on the Chrome Web Store, you can follow this [link](https://developer.chrome.com/docs/webstore/register/).

## 📣 Conclusion

Finally, we’ve created a simple Chrome extension that allows users to enable the right-click and copy functions on websites where they’ve been disabled. Our straightforward guide also offers insights into the basic structure and development process of a Chrome extension.

Developing Chrome extensions is a fun way to bring your ideas to life and improve your browsing experience. Feel free to modify the [Source Code](https://github.com/TechnoMare/Enable-Copy) of our extension and customize it to fit your specific needs. Happy coding!

### License
This extension uses MIT License.

