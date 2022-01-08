import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

import { SnackbarComponent } from './snackbar.component';

describe('SnackbarComponent', () => {
  let component: SnackbarComponent;
  let fixture: ComponentFixture<SnackbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MatSnackBarRef,
          useValue: {},
        },
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: {
            message: 'test',
          }, // Add any data you wish to test if it is passed/used correctly
        },
      ],
      // imports: [MatSnackDar],
      declarations: [SnackbarComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
