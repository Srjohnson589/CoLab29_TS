chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['contentScript.js']
  });
});

chrome.runtime.onMessage.addListener(
function (request, sender, sendResponse) {
  if (request.greeting === "hello"){
    sendResponse({farewell: "goodbye"});}

  else if (request.action === "startup") {
    try {
      chrome.storage.sync.get(["focusData"]).then((result) => {
        const focusData = result.focusData;

        if (!focusData || (focusData.currentGoal && Object.keys(focusData.currentGoal).length === 0)) {
          const newFocusData = {
            currentGoal: { subtasks: [] },
            assessments: focusData ? focusData.assessments || {} : {}
          };

          chrome.storage.sync.set({ "focusData": newFocusData }).then(() => {
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

  else if (request.action === "fetchGoals") {
    chrome.storage.sync.get(["focusData"]).then((result) => {
      const existingData = result.focusData || {};
      const currentGoal = existingData.currentGoal  || {};
      const goal  = currentGoal.name || "";
      const subtasks = currentGoal.subtasks || [];
      sendResponse({ goal, subtasks });
    })
  return true;
  }

  else if (request.action === "appendCurrentGoal") {
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

  else if (request.action === "appendSubtasks") {
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

    else if (request.action === "fetchAssessment") {
      const { sunday } = request;
    
      try {
        chrome.storage.sync.get(["focusData"], (result) => {
          const existingData = result.focusData || {};
          const assessments = existingData.assessments || {};
          sendResponse(assessments[sunday] || null);
        });
      } catch (error) {
        console.error("Error fetching assessments:", error);
        sendResponse(null);
      }
      return true; // This is necessary to indicate asynchronous response
    }
    

    else if (request.action === "appendAssessment") {
      const { weekKey, dayOfWeek, assessment } = request;
    
      chrome.storage.sync.get(["focusData"], (result) => {
        const existingData = result.focusData || {};
        existingData.currentGoal = existingData.currentGoal || {};
        existingData.assessments = existingData.assessments || {};
    
        if (!existingData.assessments[weekKey]) {
          existingData.assessments[weekKey] = {};
        }
    
        if (!existingData.assessments[weekKey][dayOfWeek]) {
          existingData.assessments[weekKey][dayOfWeek] = [];
        }
    
        existingData.assessments[weekKey][dayOfWeek].push(assessment);
    
        chrome.storage.sync.set({ focusData: existingData }, () => {
          const updatedAssessments = existingData.assessments;
          const formattedResponse = { [weekKey]: { [dayOfWeek]: updatedAssessments[weekKey][dayOfWeek] } };
          sendResponse(formattedResponse);
        });
      });
    
      return true;
    }

    else if (request.action === "clearGoal") {
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

    if (request.action === "saveQuickNotes") {
      const { notes } = request;
      chrome.storage.sync.set({ quickNotes: notes }).then(() => {
        sendResponse({ success: true });
      }).catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
      return true;
    }

    if (request.action === "convertQuickNotes") {
      const { format } = request;
      chrome.storage.sync.get(["quickNotes"]).then((result) => {
        const notes = result.quickNotes || "";
        let fileContent = "";

        switch (format) {
          case "doc":
            fileContent = `${notes}`;
            break;
          case "txt":
            fileContent = `${notes}`;
            break;
          case "pdf":
            fileContent = `
              <html>
                <head>
                  <title>Quick Notes</title>
                  <style>
                    body { font-family: Arial, sans-serif; }
                  </style>
                </head>
                <body>${notes}</body>
              </html>
            `;
            break;
          default:
            sendResponse({ error: "Invalid format" });
            return;
        }

        const blob = new Blob([fileContent], { type: format === "pdf" ? "application/pdf" : `text/${format}` });
        const url = URL.createObjectURL(blob);
        chrome.downloads.download({
          url: url,
          filename: `quicknotes.${format}`,
          conflictAction: "uniquify",
        });
        sendResponse({ success: true });
      }).catch((error) => {
        sendResponse({ success: false, error: error.message });
      });
      return true;
    }
});




