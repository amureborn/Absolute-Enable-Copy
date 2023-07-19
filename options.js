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
  