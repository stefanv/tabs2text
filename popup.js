document.getElementById('export').addEventListener('click', function() {
  const format = document.getElementById('format').value;
  const maxTitleLength = parseInt(document.getElementById('maxTitleLength').value);
  chrome.runtime.sendMessage({action: "exportTabs", format, maxTitleLength});
});
