chrome.action.onClicked.addListener((e=>{chrome.scripting.executeScript({target:{tabId:e.id},files:["contentScript.js"]})})),chrome.runtime.onMessage.addListener((function(e,t,o){if("hello"===e.greeting&&o({farewell:"goodbye"}),"appendStorage"===e.action){const{key:t,value:a}=e;return chrome.storage.sync.get(["focusData"]).then((e=>{const c=e.focusData||{};c[t]=a,chrome.storage.sync.set({focusData:c}).then((()=>{o(c)}))})),!0}if("getStorage"===e.action)return chrome.storage.sync.get(["focusData"]).then((e=>{o(e.focusData)})),!0}));