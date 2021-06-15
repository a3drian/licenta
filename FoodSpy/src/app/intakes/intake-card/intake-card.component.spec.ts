import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntakeCardComponent } from './intake-card.component';

describe('IntakeCardComponent', () => {
  let component: IntakeCardComponent;
  let fixture: ComponentFixture<IntakeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntakeCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntakeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
