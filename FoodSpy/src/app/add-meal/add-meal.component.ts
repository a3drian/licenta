import { Component, OnInit } from '@angular/core';
import { IFood } from '../interfaces/IFood';
import { FoodsService } from '../services/foods.service';
import { switchMap } from 'rxjs/operators';
// Item filtering:
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.scss']
})
export class AddMealComponent implements OnInit {

  foods: IFood[] = [];
  foodsColumns: string[] = [
		'id',
		'name',
		'qty',
		'unit'
	];

  constructor(private foodsService: FoodsService) { }

  ngOnInit(): void {
    // Search:
    this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(
          (term: string) => this.foodsService.search(term)
        )
      )
      .subscribe(
        (data) => {
          this.foods = data;
        }
      );
  }

  searchTerms = new Subject<string>();
  searchTerm: string = '';
  search(term: string): void {
    console.log('search(term):');
    console.log(term);
    this.searchTerm = term;
    this.searchTerms.next(term);
  }

}
