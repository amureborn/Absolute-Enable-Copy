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