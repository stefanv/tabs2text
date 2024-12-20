browser.runtime.onMessage.addListener((request) => {
  if (request.action === "exportTabs") {
    exportTabs(request.format, request.maxTitleLength);
  }
});

async function exportTabs(format, maxTitleLength) {
  try {
    const windows = await chrome.windows.getAll({populate: true});
    let content = '';

    for (let [windowIndex, window] of windows.entries()) {
      const firstTabTitle = window.tabs[0]?.title || 'Unnamed';

      content += (format === 'markdown') ? '##' : '*';
      content += ` Window ${windowIndex + 1} (${firstTabTitle})\n\n`;

      // Function to add a tab to the content
      function addTabToContent(tab) {
        const title = tab.title;
        const trimmedTitle = title.length > maxTitleLength ? title.substring(0, maxTitleLength - 3) + "..." : title;
        if (format === 'markdown') {
          content += `- [${trimmedTitle}](${tab.url})\n`;
        } else { // org format
          content += `- [[${tab.url}][${trimmedTitle}]]\n`;
        }
      }

      window.tabs.forEach(tab => {
          addTabToContent(tab);
      });
      content += '\n';
    }

    function getISODate() {
      const now = new Date();
      return now.toLocaleString('sv').substring(0, 10);
    }

    // Create a data URL for the content
    content = content.trim() + '\n';
    const mimeType = (format === 'markdown') ? 'text/markdown' : 'text/org';
    const dataUrl = URL.createObjectURL(new Blob([content], {type: mimeType}));
    const filename = `${getISODate()}-tabs.${format === 'markdown' ? 'md' : 'org'}`;

    await browser.downloads.download({
      url: dataUrl,
      filename: filename,
      saveAs: true
    });
  } catch (error) {
    console.error('Error exporting tabs:', error);
  }
}
