import { Router, Response, NextFunction } from 'express';
import { EntityManager } from '@mikro-orm/core';
// Interfaces:
import { IExpressRequest } from '../interfaces/IExpressRequest';
// Models:
import { User } from '../entities/user.entity';
// Services:
import * as userService from '../services/users.service';
import { encryptPassword } from '../services/password.service';
// Shared:
import { ERROR_MESSAGES, STATUS_CODES } from 'foodspy-shared';
import { log } from '../shared/Logger';

export { setRegisterRoute };

function setRegisterRoute(router: Router): Router {
    router.post('/', registerUser);
    return router;
}

// POST
async function registerUser(
    req: IExpressRequest,
    res: Response,
    next: NextFunction
) {
    if (!req.em || !(req.em instanceof EntityManager)) {
        log('register.route.ts', registerUser.name, 'req.em is not instanceof EntityManager');
        return next(Error('EntityManager not available'));
    }

    console.log('');
    log('register.route.ts', registerUser.name, '');
    log('register.route.ts', registerUser.name, 'req.baseUrl:', req.baseUrl);
    log('register.route.ts', registerUser.name, 'req.originalUrl:', req.originalUrl);
    log('register.route.ts', `${registerUser.name}^`, '');
    console.log('');

    let response: Error | User | null;
    try {

        const body = req.body;

        response = await userService
            .getUserByEmail(
                req.em,
                body.email
            );

        if (response instanceof Error) {
            return next(response);
        }

        if (response instanceof User) {
            const conflictError: Error = new Error;
            conflictError.name = ERROR_MESSAGES.EMAIL_EXISTS;
            conflictError.message = 'E-mail already exists!';
            return res.status(STATUS_CODES.CONFLICT).json(conflictError);
        }

        const registeredUser = new User(
            {
                email: req.body.email,
                password: encryptPassword(req.body.password),
                targetCalories: req.body.targetCalories
            }
        );

        response = await userService
            .registerUser(
                req.em,
                registeredUser
            );

    } catch (ex) {
        return next(ex);
    }

    if (response instanceof Error) {
        return next(response);
    }

    return res.status(STATUS_CODES.CREATED).json(response);
}