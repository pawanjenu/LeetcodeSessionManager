import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  NgZone,
  Output,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SnackbarService } from './snackbar.service';
import { AppStringLiterals, LeetResponse, Session } from './src.constants';
import { SrcService } from './src.service';
interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'LeetcodeSessionManager';

  leetcodeSessions: Session[] = [];

  currentChosenSession: Session | undefined = undefined;
  isLoading: boolean = false;

  constructor(
    private _appService: SrcService,
    private cdRef: ChangeDetectorRef,
    private _snackBarService: SnackbarService,
    private ngZone: NgZone
  ) {
    chrome.storage.local.get('sessions', async (data2) => {
      console.debug('reading local sessions', data2.sessions);

      if (data2.sessions != undefined || data2.se) {
        this.leetcodeSessions = data2.sessions;
        this.cdRef.detectChanges();
      } else {
        await this.refreshLeetcodeSessions();
      }
    });

    chrome.storage.local.get('current_session', (data2) => {
      console.debug('reading local current session', data2.current_session);
      this.currentChosenSession = data2.current_session;
      this.cdRef.detectChanges();
    });
  }

  ngOnInit() {}

  /**
   * Triggered when user selects a sessions
   *
   * @author Pawan Jenu<pawanjenu@gmail.com>
   * @memberof SourcesService
   */
  async onSelect(event: Session) {
    // update the current user
    await this.changeCurrentUserSession(event);
  }

  /**
   * Fetches sessions from leetcode, and assigns to back to this.leetcodeSessions
   *
   * @author Pawan Jenu<pawanjenu@gmail.com>
   * @memberof SourcesService
   */
  async changeCurrentUserSession(session: Session) {
    this.currentChosenSession = session;

    if(this.currentChosenSession !== undefined){
      if(this.currentChosenSession.name === ""){
        this.currentChosenSession.name = "Anonymous Session";
      }
    }
    // send message to background to store to local storage
    console.log('current_session', this.currentChosenSession);
    
    chrome.runtime.sendMessage({
      current_session: this.currentChosenSession,
    });
  }

  /**
   * Fetches sessions from leetcode, and assigns to back to this.leetcodeSessions
   *
   * @author Pawan Jenu<pawanjenu@gmail.com>
   * @memberof SourcesService
   */
  async refreshLeetcodeSessions() {
    try {
      this.isLoading = true;
      let sessions = await this._appService.getLeetcodeSessions();

      if (!Array.isArray(sessions) || !sessions.length) {
        console.debug('unable to get sessions');
        this.showSessionError();
        this.cdRef.detectChanges();
      } else {
        this.isLoading = false;
        console.debug('Fetched sessions: ', sessions);
        this.leetcodeSessions = sessions.map( session => ({
          ...session, name: session.name === "" ? "Anonymous Session" : session.name
        }));
        chrome.runtime.sendMessage({
          sessions: this.leetcodeSessions,
        });
      }
    } catch (err) {
      this.isLoading = false;
      console.debug('unable to get sessions:', err);
      this.showSessionError();

      this.cdRef.detectChanges();
    }
    this.isLoading = false;
    this.cdRef.detectChanges();
  }

  /**
   * Triggered when user click on reload sessions
   *
   * @author Pawan Jenu<pawanjenu@gmail.com>
   * @memberof SourcesService
   */
  async onReloadClick() {
    // refresh leetcode sessions
    await this.refreshLeetcodeSessions();
  }

  showSessionError(){
    this.ngZone.run(() => {
      setTimeout(() => {
        this._snackBarService.show(
          AppStringLiterals.LEETCODE_SESSION_ERROR,
          'failure',
          undefined,
          {
            duration: 1500,
          }
        );
      }, 0);
    });
  }
}
