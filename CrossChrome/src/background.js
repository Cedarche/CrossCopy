// // background.js

// chrome.tabs.onActivated.addListener((activeInfo) => {
//   chrome.storage.local.get('listenForCopy', (result) => {
//     if (result.listenForCopy) {
//       const tabId = activeInfo.tabId;
//       console.log('Current tab ID is', tabId);

//       chrome.scripting
//         .executeScript({
//           target: { tabId: tabId, allFrames: true },
//           files: ['content.js'],
//         })
//         .catch((error) => console.log('Error injecting script'));
//     }
//   });
// });

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   chrome.storage.local.get('listenForCopy', (result) => {
//     if (result.listenForCopy) {
//       if (changeInfo.status === 'complete') {
//         chrome.scripting
//           .executeScript({
//             target: { tabId: tabId, allFrames: true },
//             files: ['content.js'],
//           })
//           .catch((error) => console.log('Error injecting script'));
//       }
//     }
//   });
// });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   switch (message.type) {
//     case 'login':
//       chrome.storage.local.set(
//         { uid: message.uid, listenForCopy: message.listenForCopy },
//         () => {}
//       );
//       break;
//     case 'logout':
//       chrome.storage.local.remove('uid', () => {});
//       break;
//     default:
//       console.log('Received unknown message type: ', message.type);
//   }
// });
