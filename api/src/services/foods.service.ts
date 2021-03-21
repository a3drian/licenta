import { Food } from '../entities/food.entity';
import { EntityManager } from '@mikro-orm/core';

export {
   addFood,
   /*
   getFoods,
   getFood,
   updateFood,
   removeFood,
   countFoods
   */
};

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