const { accessToken } = await chrome.storage.local.get(["accessToken"]);

if (!accessToken) {
  // Show login screen
}
