
import { MatSnackBarConfig } from '@angular/material/snack-bar';

export type SnackbarType = 'success' | 'warning' | 'failure' | 'info';

export interface StringInnerHTML {
  innerHTML: string;
}

export interface SnackbarData {
  message: string | StringInnerHTML;
  type: SnackbarType;
  action: string;
  config?: MatSnackBarConfig;
}
