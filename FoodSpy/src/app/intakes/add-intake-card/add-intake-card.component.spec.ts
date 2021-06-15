import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIntakeCardComponent } from './add-intake-card.component';

describe('AddIntakeCardComponent', () => {
  let component: AddIntakeCardComponent;
  let fixture: ComponentFixture<AddIntakeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddIntakeCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIntakeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
