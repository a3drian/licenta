import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MealFoodItemComponent } from './meal-food-item.component';

describe('MealFoodItemComponent', () => {
  let component: MealFoodItemComponent;
  let fixture: ComponentFixture<MealFoodItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MealFoodItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MealFoodItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
