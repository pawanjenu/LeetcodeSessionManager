
import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

import { SnackbarData, StringInnerHTML } from '../../models/snackbar-data';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent implements OnInit {
  message: SnackbarData['message'] | undefined;
  type: SnackbarData['type'] | undefined;
  action: SnackbarData['action'] | undefined;

  constructor(
    public snackBarRef: MatSnackBarRef<SnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) private _data: SnackbarData
  ) {}

  ngOnInit() {
    this.message = this._data.message;
    this.type = this._data.type;
    this.action = this._data.action;
    console.log(this.type);
  }


  isMessageInnerHtml(): boolean {
    if ((this.message as StringInnerHTML).innerHTML) {
      return true;
    }
    return false;
  }

  messageAsInnerHTML(): StringInnerHTML {
    return this.message as StringInnerHTML;
  }
}
