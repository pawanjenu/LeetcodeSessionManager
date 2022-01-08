import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { AppStringLiterals, LeetResponse, Session } from './src.constants';
import { catchError, map, takeUntil } from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SrcService {
  private _destroyerSubject: Subject<void> = new Subject();
  constructor(private _http: HttpClient) {}
  sendSessionRequest(): Observable<any> {
    const url = AppStringLiterals.LEETCODE_SESSION_ENDPOINT;
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    });

    return this._http.post<any>(url, {}, { headers: headers }).pipe(
      map((resp: LeetResponse) => {
        return resp;
      }),
      catchError((err: HttpErrorResponse) => {
        return throwError(err);
      })
    );
  }

  sendSessionActivationRequest(id: number): Observable<any> {
    const url = AppStringLiterals.LEETCODE_SESSION_ENDPOINT;

    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    });
    const body = { func: 'activate', target: id };
    return this._http.put<any>(url, body, { headers: headers }).pipe(
      map((resp: LeetResponse) => {
        return resp;
      }),
      catchError((err: HttpErrorResponse) => {
        return throwError(err);
      })
    );
  }

  async getLeetcodeSessions(): Promise<Session[]> {
    return new Promise((resolve, reject) => {
      this.sendSessionRequest()
        .pipe(takeUntil(this._destroyerSubject))
        .subscribe(
          (res: LeetResponse) => resolve(res.sessions),
          (err) => {
            reject(new Error(err));
          }
        );
    });
  }

  async activateUserSession(id: number): Promise<Session[]> {
    return new Promise((resolve, reject) => {
      this.sendSessionActivationRequest(id)
        .pipe(takeUntil(this._destroyerSubject))
        .subscribe(
          (res: LeetResponse) => resolve(res.sessions),
          (err) => {
            reject(new Error(err));
          }
        );
    });
  }
}
