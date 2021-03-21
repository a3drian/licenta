import { EntityManager } from '@mikro-orm/core';

import { Food } from '../entities/food.entity';
import { Filter } from '../models/filter.model';

export {
   addFood,
   getFoods,
   /*
   getFood,
   updateFood,
   removeFood,
   countFoods
   */
};

async function getFoods(
   em: EntityManager,
   name: string
): Promise<Error | Food[] | Filter[]> {
   if (!(em instanceof EntityManager)) {
      console.log(`ERROR: foods.service.ts, getFoods(): em is not instanceof EntityManager`);
      return Error('invalid request');
   }

   console.log('name:', name);

   const filter: Partial<Filter> = {};
   if (name) {
      filter.name = name;
   }
   console.log('filter:', filter);

   try {

      const items = await em.find(
         Food,
         filter
      );
      await new Promise(
         (resolve) => {
            setTimeout(resolve, 500);
         }
      );

      // console.log('items:', items);

      console.log('');
      console.log('food.service.ts, getFoods():');
      console.log('items.length:', items.length);
      console.log('food.service.ts, getFoods()^');

      return items;
   } catch (ex) {
      return ex;
   }
}

/*
async function getFood(
   em: EntityManager,
   id: string
): Promise<Error | Food | null> {
   if (!(em instanceof EntityManager)) {
      return Error('invalid request');
   }

   if (!id || typeof id !== 'string') {
      return Error('invalid params');
   }

   console.log('');
   console.log('food.service.ts, getFood():');
   console.log('id:', id);

   try {
      const item = await em.findOne(Food, { id: id });
      console.log('item:', item);
      console.log('food.service.ts, getFood()^');
      console.log('');
      return item;
   } catch (ex) {
      return ex;
   }
}
*/

// POST
async function addFood(
   em: EntityManager,
   food: Partial<Food>
): Promise<Error | Food> {
   if (!(em instanceof EntityManager)) {
      console.log(`ERROR: foods.service.ts, addFood(): em is not instanceof EntityManager`);
      return Error('invalid request');
   }

   if (!food || typeof food !== 'object' || food.id) {
      return Error('invalid params');
   }

   try {
      const item = new Food(food);

      console.log('');
      console.log('foods.service.ts, addFood():');
      console.log('item:', item);
      console.log('foods.service.ts, addFood()^');
      console.log('');

      await em.persistAndFlush(item);
      return item;
   } catch (ex) {
      return ex;
   }
}