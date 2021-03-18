import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanFoodComponent } from './scan-food.component';

describe('ScanFoodComponent', () => {
  let component: ScanFoodComponent;
  let fixture: ComponentFixture<ScanFoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanFoodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
