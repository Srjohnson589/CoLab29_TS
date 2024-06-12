chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['contentScript.js']
  });
});

chrome.runtime.onMessage.addListener(
function (request, sender, sendResponse) {
  if (request.greeting === "hello")
    sendResponse({farewell: "goodbye"});

  if (request.action === "startup") {
    try {
      chrome.storage.sync.get(["focusData"]).then((result) => {
        const focusData = result.focusData;

        if (!focusData || (focusData.currentGoal && Object.keys(focusData.currentGoal).length === 0)) {
          chrome.storage.sync.set({ "focusData": { currentGoal: { "subtasks": [] } } }).then(() => {
              sendResponse("onboarding");
          }).catch((error) => {
              sendResponse(error.message);
          });
          } else {
              sendResponse("returning");
          }
      }).catch((error) => {
          sendResponse(error.message);
      });
    } catch (error) {
      sendResponse(error.message);
    }      
    return true; // Indicates that the response is sent asynchronously
    }

  if (request.action === "fetchGoals") {
    chrome.storage.sync.get(["focusData"]).then((result) => {
      const existingData = result.focusData || {};
      sendResponse(existingData.currentGoal)
    })
  return true;
  }

  if (request.action === "appendCurrentGoal") {
    const { data } = request;
    chrome.storage.sync.get(["focusData"]).then((result)=>{
      const existingData = result.focusData || {};
      existingData["currentGoal"] = {"name": data};
      chrome.storage.sync.set({ focusData: existingData }).then(() => {
        sendResponse(existingData)
      })
      ;})
    return true;
    }

  if (request.action === "appendSubtasks") {
    const { data } = request;
    console.log(data)

    chrome.storage.sync.get(["focusData"]).then((result)=>{
      const existingData = result.focusData || {};
      existingData.currentGoal = existingData.currentGoal || {};
      existingData.currentGoal["subtasks"] = existingData.currentGoal["subtasks"] || [];
      for (let i = 0; i < data.length; i++) {
        let subtask = {
          name: data[i],
          completed: false,
          studynotes: null
        }
        existingData.currentGoal["subtasks"].push(subtask)
      }
      chrome.storage.sync.set({ focusData: existingData }).then(() => {
        sendResponse(existingData)
      })
      ;})
    return true;
    }

    if (request.action === "clearGoal") {
      chrome.storage.sync.get(["focusData"]).then((result)=> {
        let existingData = result.focusData || { currentGoal: {} };

        existingData.currentGoal =  {};

        chrome.storage.sync.set({ focusData: existingData }).then(() => {
          sendResponse("cleared");
          }).catch((error) => {
              sendResponse({ error: error.message });
          });
      }).catch((error) => {
          sendResponse({ error: error.message });
      });

    return true; // Indicates that the response is sent asynchronously
    }
});


