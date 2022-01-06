
function displayUser(user){
  if(user != undefined){
  document.getElementById('current_user').innerHTML = `Current Session :${user}`;
  }
  else{
    document.getElementById('current_user').innerHTML = 'No session Selected';
  }
}

function listAllSessions(sessions){
  document.getElementById('users').innerHTML = "<option hidden></option>"
  for(var i = 0; i < sessions.length; i++){
    console.debug(sessions[i].name);
    document.getElementById('users').innerHTML += `<option value=${JSON.stringify(sessions[i])}>${sessions[i].name}</option>`
  }
}

$('#refresh_session').on('click', () => {
  var status = localSession.getSessions();
    showCacheError(status);
});

function changeUserSession(value){
  chrome.storage.local.set({ current_session: value }, () => {
    console.debug('setting id:'+value);
  });
  chrome.storage.local.get('current_session', (data2) => {
    console.debug(data2);
  });
}

$('#users').on('change', (e) => {
  const data = JSON.parse(e.target.value);
  chrome.runtime.sendMessage({
    closeWebPage: true,
    isSuccess: true,
    current_session_name: data.name,
    current_session_id: data.id,
    KEY: this.KEY,
  });
});

chrome.storage.local.get('sessions', (data2) => {
  if(data2.sessions != undefined){
  listAllSessions(data2.sessions);
  }
  else{
    var status = localSession.getSessions();
    showCacheError(status);
  }
});

chrome.storage.local.get('current_session_name', (data2) => {
  console.debug(data2.current_session_name);
  displayUser(data2.current_session_name);
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      if (request.msg === "set sessions") {
          listAllSessions(request.data)
      }
      else if(request.msg === "set user"){
        displayUser(request.data);
      }
  }
);

function showCacheError(mode){
  if(mode === false){
  $('#error_msg').show();
  }
  else{
    $('#error_msg').hide();
  }
}
