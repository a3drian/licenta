import { Router, Response, NextFunction } from 'express';
import { EntityManager } from '@mikro-orm/core';
import { Food } from '../entities/food.entity';
import { Filter } from '../models/filter.model';
import { IExpressRequest } from '../interfaces/IExpressRequest';
import * as foodService from '../services/foods.service';

export { setFoodRoute };

function setFoodRoute(router: Router): Router {
   router.get('/', getFoods);
   router.post('/', postFood);
   /*
   router.get('/:id', getFood);
   router.put('/:id', putFood);
   router.delete('/:id', removeFood);
   */
   return router;
}

// GET
async function getFoods(
   req: IExpressRequest,
   res: Response,
   next: NextFunction
) {
   if (!req.em || !(req.em instanceof EntityManager)) {
      console.log(`ERROR: foods.route.ts, postFood(): req.em is not instanceof EntityManager`);
      return next(Error('EntityManager not available'));
   }

   console.log('');
   console.log('food.route.ts, getFoods():');
   console.log('req.baseUrl:', req.baseUrl);
   console.log('req.originalUrl:', req.originalUrl);
   console.log('food.route.ts, getFoods()^');
   console.log('');

   let foods: Error | Food[] | Filter[] | null;
   
   const name = req.query.name ? req.query.name.toString() : '';
   console.log('');
   try {
      [foods] = await Promise.all([
         foodService.getFoods(req.em, name)
      ]);
   } catch (ex) {
      return next(ex);
   }

   if (foods instanceof Error) {
      return next(foods);
   }

   return res.status(200).json(foods);
}

// POST
async function postFood(
   req: IExpressRequest,
   res: Response,
   next: NextFunction
) {
   if (!req.em || !(req.em instanceof EntityManager)) {
      console.log(`ERROR: foods.route.ts, postFood(): req.em is not instanceof EntityManager`);
      return next(Error('EntityManager not available'));
   }

   console.log('');
   console.log('foods.route.ts, postFood():');
   console.log('req.baseUrl:', req.baseUrl);
   console.log('req.originalUrl:', req.originalUrl);
   console.log('foods.route.ts, postFood()^');
   console.log('');

   let food: Error | Food;
   try {
      food = await foodService.addFood(
         req.em,
         req.body
      );
   } catch (ex) {
      return next(ex);
   }

   if (food instanceof Error) {
      return next(food);
   }

   return res.status(201).json(food);
}
