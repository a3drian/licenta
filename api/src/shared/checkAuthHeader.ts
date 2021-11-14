import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { env } from '../env';
// Shared:
import { STATUS_CODES } from 'foodspy-shared';

const checkBearer = (request: Request, response: Response, next: NextFunction): number => {
   let statusCode: number = STATUS_CODES.OK;

   const bearerHeader = request.headers['authorization'];
   if (!bearerHeader) {
      statusCode = STATUS_CODES.UNAUTHORIZED;
   } else {
      const bearer = bearerHeader.split(' ');
      const accessToken = bearer[1];
      try {
         jwt
            .verify(
               accessToken,
               env.TOKEN_SECRET,
               (error) => {
                  if (error) {
                     statusCode = STATUS_CODES.UNAUTHORIZED;
                  }
               }
            );
      } catch (exception) {
         statusCode = STATUS_CODES.SERVER_ERROR;
      }
   }

   return statusCode;
};

export { checkBearer };