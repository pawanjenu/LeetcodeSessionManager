function handleMessage(request) {
  console.debug('inside request handler' + request.sessions);
  if (request && request.sessions) {
    console.debug('setting local sessions info');
    /* Set username */
    chrome.storage.local.set({ sessions: request.sessions }, () => {
      window.localStorage.sessions = request.sessions;
    });

    sessions = request.sessions;
    chrome.runtime.sendMessage({
      msg: 'set sessions',
      data: sessions,
    });
  }
  if (request && request.current_session_id) {
    console.debug(
      'setting up new active_session_id: ',
      request.current_session_id,
    );
    chrome.storage.local.set(
      { current_session_id: request.current_session_id },
      () => {
        window.localStorage.current_session_id =
          request.current_session_id;
      },
    );
    local_session_id = request.current_session_id;
  }
  if (request && request.current_session_name) {
    console.debug('setting up new active_session_named');
    chrome.storage.local.set(
      { current_session_name: request.current_session_name },
      () => {
        window.localStorage.current_session_name =
          request.current_session_name;
      },
    );

    chrome.runtime.sendMessage({
      msg: 'set user',
      data: request.current_session_name,
    });
  }
}

var local_session_id = undefined;
const readLocalStorage = async (key) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], function (result) {
      if (result[key] === undefined) {
        reject();
      } else {
        resolve(result[key]);
      }
    });
  });
};
chrome.runtime.onMessage.addListener(handleMessage);

function activateSession(id, callback) {
  const xhr = new XMLHttpRequest();
  console.debug('in activate session');
  xhr.open('PUT', 'https://leetcode.com/session/', false);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  var data = JSON.stringify({ func: 'activate', target: id });
  xhr.send(data);
  return callback(xhr);
}

async function logURL(requestDetails) {
  console.debug('Intercepting: ' + requestDetails.url);
  if (requestDetails.method === 'POST') {
    const current_session_id = await readLocalStorage(
      'current_session_id',
    );
    console.debug('activating' + current_session_id);
    if (current_session_id != undefined) {
      activateSession(current_session_id, function (res) {
        if (res.status != 200) {
          console.debug(
            'unable to activate , err: ' + res.responseText,
          );
        } else {
          console.debug('activated' + current_session_id);
        }
      });
    } else {
      console.debug('current_session_id is undefined');
    }
  }
  console.debug('in end of activate yo');
  return { cancel: false };
}

var pattern = 'https://leetcode.com/session*';
chrome.webRequest.onBeforeRequest.addListener(
  logURL,
  {
    urls: [
      '*://*.leetcode.com/problem*',
      '*://*.leetcode.com/contest*',
    ],
  },
  ['blocking'],
);
