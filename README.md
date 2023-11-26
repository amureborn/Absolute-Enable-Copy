# Absolute Enable Copy & Image Reader

A powerful Chrome extension designed to revolutionize your browsing experience by enabling right-click and copy functionalities on restricted websites and extracting text from images.

Absolute Enable Copy & Image Reader is available in the [Chrome Web Store](https://chrome.google.com/webstore/detail/copyright%20-enable-right-c/pkoccklolohdacbfooifnpebakpbeipc) & [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/copyright-enable-copy-/inmkjedjdhgpknjogbjomhnbgdccckkg)

## What Will Our Chrome Extension Look Like?

Recently, we published our first Chrome extension that enables right-click and copy functionality on websites that have disabled the text copy selection command on their websites. Additionally, we added an OCR Image Reader feature that allows you to extract text from images. In this article, we will show you how to create a Chrome extension that enables right-click functionality.

Here is a simple and detailed step-by-step guide on how you can create your own 'Enable Right-Click & Copy' Chrome extension.

https://github.com/TechnoMare/Enable-Copy/assets/96228020/28099286-bb93-46bf-89d7-682249c7b8bc

# Features

1. Enable Copy and Highlight: Effortlessly copy text and highlight content on web pages.
2. Re-enable Context Menu: Regain access to the right-click context menu for a seamless browsing experience.
3. Remove Copytext Protection: Bypass restrictions set by websites to prevent copying text.
4. CopyRight+ Mode: A robust mode to remove various types of protection against advanced methods disabling copy-paste functionality.

# How To Use

1. Installation: Begin by installing the CopyRight+ extension from the respective browser store.
2. Accessing the Options: After installation, click on the extension icon located in the top-right corner of your browser.
3. Choosing the Mode: In the popup, select between three options: “Enable Copy,” “CopyRight+ Mode,” or “Image Reader (OCR).”
4. Ready to Copy: Post selecting your desired mode, start copying text from any website seamlessly.

# How I Built This Extension!

Before starting the actual development of the 'Absolute Enable Copy & Image Reader' Chrome extension, we first need to understand what a Chrome extension is. Chrome extensions are small tools or software pieces that can be installed in browsers to add extra features, enhancing our browsing experience.

To make a simple extension you need simple web technologies like HTML, CSS, and JavaScript, along with some knowledge of web development. You will be pleased to know that our straightforward "Absolute Enable Copy & Image Reader" Chrome extension is built using these technologies.

Creating a Chrome extension is similar to creating a web application, but it requires a manifest.json file which we will discuss in this post.

Have you ever tried to copy important text from a website but couldn’t because it disabled the copy and right-click functions?

You can solve this with a handy browser extension that lets users right-click and copy, even on restrictive sites. Want to upgrade your browser experience? Here’s a simple step-by-step guide to making this extension from scratch.

# 1. Setting Up Your Workspace

First, you need a special folder (or “directory”) where all your files will live.

📂 Create a New folder named “Extension Name” on your computer.

![Create-a-New-Folder-1024x576](https://github.com/TechnoMare/Enable-Copy/assets/96228020/bf145539-136c-45fe-94b2-2bbb1d1055e5)

Inside “Extension Name“, make these folders:

- ‘js‘ (for code stuff)
- ‘images‘ (for pictures)
- ‘css‘ (for style stuff)

This organization ensures that our files are well-structured and easy to locate.

# 2. The Heart: Manifest File

Every extension begins with a manifest.json file. This is like an ID card for your extension. This crucial file provides metadata about the extension: its name, version, permissions, and more.

First of all, we need the VS Code editor where we will write our HTML, CSS, or JavaScript code. So, download Visual Studio Code and install it on your PC or laptop. Now

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

You can have a look here to see all configurations of a manifest.json file.

> [!NOTE]
> Place the manifest.json file at the root of your directory. This file will tell the browser about the core properties of your extension.

# 3. The Brain: Background Scripts & Page

To make the magic happen, you require two files: background.js and background.html. These files work in the background and handle different tasks without being noticed. They manage how the browser works.

The background scripts take care of tasks like managing a list of websites and enabling specific features, such as copying and right-clicking, on those websites.

Go To File > New File > Create a background.js File
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

# 4. User Interaction: Popup Page & Script

Now that we’ve put the heart and brain into our extension, it’s time to introduce the popup. This is where users can see and interact with our extension. The popup acts as a small interactive window, crafted using a combination of HTML and JavaScript.

This page directly interacts with our background.js, which we created earlier to make the extension function. To enable our extension to work with the popup, we need two files: popup.html (for the appearance) and popup.js (for the behavior).

Go To File > New File > Create a popup.js File
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
	<title>CopyRight+: Enable Right Click & Copy</title>
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
	    <span class="mode-text">CopyRight+ Mode</span>
		<img class="check-image" src="/images/off.png"></div>
	<script type="text/javascript" src="popup.js"></script>
</body>
</html>
```

In this popup.html, we have set two modes of enabling copy.

1. “Enable Copy” Mode: This mode lets you copy text on smaller websites.
2. “CopyRight+ Mode: This mode helps you to copy text forcefully on larger websites, even when their copy function is blocked.

We have also added some options like reloading the active page and have given access to the extension’s settings page to make the extension more interactive. but as of now, we haven’t used CSS to make our UI user-friendly and more good-looking. To make it better, you can give the popup a nicer look using some CSS code. to do this first, we create a new file “popup.css” with CSS code, Now

Go To File > New File > Create a popup.css File. (Make sure that this file is located in the “css” folder.)


### License
This extension uses MIT License.

# Development

Dive into our development journey of CopyRight+: [How To Build a Chrome Extension That Enables Right-Click Functionality?](https://technomare.com/build-extension-that-enables-right-click-function)

