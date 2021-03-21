import { Router, Response, NextFunction } from 'express';
import { EntityManager } from '@mikro-orm/core';
import { Food } from '../entities/food.entity';
import { IExpressRequest } from '../interfaces/IExpressRequest';
import * as foodService from '../services/foods.service';

export { setFoodRoute };

function setFoodRoute(router: Router): Router {
   router.get('/', setFoodRoute);
   router.post('/', postFood);
   /*
   router.get('/:id', getFood);
   router.put('/:id', putFood);
   router.delete('/:id', removeFood);
   */
   return router;
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
