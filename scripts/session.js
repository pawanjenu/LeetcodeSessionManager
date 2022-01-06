/* 
    (needs patch) 
    IMPLEMENTATION OF AUTHENTICATION ROUTE AFTER REDIRECT FROM GITHUB.
*/

const localSession = {
  /**
   * Initialize
   */

  init() {
    this.KEY = 'leethub_token';
    this.LEETCODE_SESSION_URL = 'https://leetcode.com/session/';
  },

  /**
   * Request Token
   *
   * @param code The access code returned by provider.
   */
  getCookies(domain, callback) {
    chrome.cookies.getAll({ url: domain }, function (cookie) {
      if (callback) {
        callback(cookie.value);
      }
    });
  },

  /**
   * Finish
   *
   * @param token The OAuth2 token given to the application from the provider.
   */
  getSessions() {
    this.init();
    const xhr = new XMLHttpRequest();
    xhr.open('POST', this.LEETCODE_SESSION_URL, false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    var data = JSON.stringify({});
    xhr.send(data);
    if (xhr.status == 200) {
      const sessions = JSON.parse(xhr.responseText).sessions;

      console.debug('received all sessions from endpoint', sessions);
      if (sessions === undefined) {
        console.log('returning false');
        return false;
      }
      chrome.runtime.sendMessage({
        sessions: sessions,
      });
      console.log('returning true');
      return true;
    } else {
      console.log('returning false');
      return false;
    }
  },

  activateSession(id) {
    /* Get username */
    // To validate user, load user object from GitHub.
    this.init();
    const xhr = new XMLHttpRequest();
    console.debug('in activate session');
    xhr.addEventListener('readystatechange', function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.debug('activate session id:' + id);
        } else {
          console.debug('unable to activate id:' + xhr.status);
        }
      } else {
        console.debug('outer else' + xhr.status);
      }
    });
    xhr.open('PUT', this.LEETCODE_SESSION_URL, false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    var data = JSON.stringify({ func: 'activate', target: id });
    xhr.send(data);
  },
};
