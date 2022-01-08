import { Injectable } from '@angular/core';
import { MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';

import { SnackbarData } from '../app/models/snackbar-data';
import { SnackbarComponent } from '../app/shared/snackbar/snackbar.component';

export type SnackBarStatus = 'open' | 'close';
@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private snackBarStateChanged$ = new Subject<SnackBarStatus>();
  constructor(private _snackBar: MatSnackBar) {}

  show(
    message: SnackbarData['message'],
    type?: SnackbarData['type'],
    action?: SnackbarData['action'],
    config?: SnackbarData['config']
  ): MatSnackBarRef<SnackbarComponent> {
    const matSnackbarConfig: MatSnackBarConfig =
      config !== undefined ? config : {};
    matSnackbarConfig.panelClass =
      matSnackbarConfig.panelClass !== undefined
        ? matSnackbarConfig.panelClass
        : 'snackbar-panel';

    matSnackbarConfig.data = {
      message,
      type,
      action,
    };

    const snackbarRef: MatSnackBarRef<SnackbarComponent> =
      this._snackBar.openFromComponent(SnackbarComponent, matSnackbarConfig);
    snackbarRef.afterDismissed().subscribe(() => {
      this.snackBarStateChanged$.next('close');
    });
    snackbarRef.afterOpened().subscribe(() => {
      this.snackBarStateChanged$.next('open');
    });

    return snackbarRef;
  }

  closeAll(): void {
    this._snackBar.dismiss();
  }

  onSnackbarStatusChange(): Observable<SnackBarStatus> {
    return this.snackBarStateChanged$.asObservable();
  }
}
