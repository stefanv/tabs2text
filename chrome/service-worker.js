chrome.runtime.onMessage.addListener((request) => {
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

      // Group tabs by their groupId
      let tabGroups = {};
      window.tabs.forEach(tab => {
        if (tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
          if (!tabGroups[tab.groupId]) {
            tabGroups[tab.groupId] = [];
          }
          tabGroups[tab.groupId].push(tab);
        }
      });

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

      // Process ungrouped tabs
      window.tabs.forEach(tab => {
        if (tab.groupId === chrome.tabGroups.TAB_GROUP_ID_NONE) {
          addTabToContent(tab);
        }
      });
      content += '\n';

      // Process grouped tabs
      for (let groupId of Object.keys(tabGroups)) {
        const group = await chrome.tabGroups.get(parseInt(groupId));
        if (group.title) {
          if (format === 'markdown') {
            content += `### ${group.title}\n\n`;
          } else { // org format
            content += `** ${group.title}\n\n`;
          }
        }
        tabGroups[groupId].forEach(addTabToContent);
        content += '\n';
      }
    }

    function getISODate() {
      const now = new Date();
      return now.toLocaleString('sv').substring(0, 10);
    }
    
    // Create a data URL for the content
    content = content.trim() + '\n';
    const mimeType = (format === 'markdown') ? 'text/markdown' : 'text/org';
    const dataUrl = `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`;
    const filename = `${getISODate()}-tabs.${format === 'markdown' ? 'md' : 'org'}`;
    
    await chrome.downloads.download({
      url: dataUrl,
      filename: filename,
      saveAs: true
    });
    
  } catch (error) {
    console.error('Error exporting tabs:', error);
  }
}
