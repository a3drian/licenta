import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFoodDialogueComponent } from './edit-food-dialogue.component';

describe('EditFoodDialogueComponent', () => {
  let component: EditFoodDialogueComponent;
  let fixture: ComponentFixture<EditFoodDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditFoodDialogueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFoodDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
