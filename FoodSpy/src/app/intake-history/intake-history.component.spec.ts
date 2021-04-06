import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeHistoryComponent } from './intake-history.component';

describe('IntakeHistoryComponent', () => {
  let component: IntakeHistoryComponent;
  let fixture: ComponentFixture<IntakeHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntakeHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
