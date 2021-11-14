import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealFoodDetailComponent } from './meal-food-detail.component';

describe('MealFoodDetailComponent', () => {
  let component: MealFoodDetailComponent;
  let fixture: ComponentFixture<MealFoodDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MealFoodDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MealFoodDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
