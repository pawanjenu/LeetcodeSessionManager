import { Injector } from '@angular/core';
import { SrcService } from './app/src.service';
import { HttpClient, HttpHandler, HttpXhrBackend } from '@angular/common/http';
import { AppStringLiterals, Session } from './app/src.constants';
const injector = Injector.create({
  providers: [
    { provide: SrcService },
    { provide: HttpClient, deps: [HttpHandler] },
    {
      provide: HttpHandler,
      useValue: new HttpXhrBackend({ build: () => new XMLHttpRequest() }),
    },
  ],
});

function handleMessage(request: any) {
  if (request && request.sessions) {
    chrome.storage.local.set({ sessions: request.sessions }, () => {
      console.debug('setting sessions to local');

      window.localStorage.sessions = request.sessions;
    });
  }

  if (request && request.current_session) {
    chrome.storage.local.set(
      { current_session: request.current_session },
      () => {
        console.debug('setting current user session to local');
        window.localStorage.current_session = request.current_session;
      }
    );
  }
}

var serviceObj = injector.get(SrcService);
const readLocalStorage = async (key: any) => {
  return new Promise<any>((resolve, reject) => {
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

function urlInterceptor(requestDetails: any) {
  console.debug('in url intercepor', requestDetails.url);

  if (requestDetails.method === 'POST') {
    readLocalStorage('current_session').then((data: any) => {
      const currentSession = data;

      if (currentSession != undefined) {
        console.debug('activating session: ', currentSession);
        serviceObj
          .activateUserSession(currentSession.id)
          .then(() => {
            console.debug('Activated ', currentSession);
            return { cancel: false };
          })
          .catch((err) => {
            console.debug('error during activation of session', err.error);
            return { cancel: false };
          });
      } else {
        console.debug('undefined current_session', currentSession);
        return { cancel: false };
      }
    });
  } else {
    console.debug('non-POST call, ignoring activation of session');
    return { cancel: false };
  }
}

chrome.webRequest.onBeforeRequest.addListener(
  urlInterceptor,
  {
    urls: AppStringLiterals.INTERCEPT_LEETCOD_URLS,
  },
  ['blocking']
);
