/* Sync to local storage */
chrome.storage.local.get('isSync', (data) => {
  keys = ['sessions', 'current_session_name', 'current_session_id'];
  if (!data || !data.isSync) {
    keys.forEach((key) => {
      chrome.storage.sync.get(key, (data) => {
        chrome.storage.local.set({ [key]: data[key] });
        console.debug('setting up: ', { [key]: data[key] });
        chrome.runtime.sendMessage({
          [key]: data[key],
        });
      });
    });
    chrome.storage.local.set({ isSync: true }, (data) => {
      console.debug('LeetcodeSessionManager Synced to local values');
    });
  } else {
    console.debug(
      'LeetcodeSessionManager Local storage already synced!',
    );
  }
});
