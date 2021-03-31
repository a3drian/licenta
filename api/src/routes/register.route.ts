import { Router, Response, NextFunction } from 'express';
import { EntityManager } from '@mikro-orm/core';
import { User } from '../entities/user.entity';
import { IExpressRequest } from '../interfaces/IExpressRequest';
import * as userService from '../services/users.service';
import { encryptPassword } from '../services/password.service';

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
        console.log(`ERROR: register.route.ts, registerUser(): req.em is not instanceof EntityManager`);
        return next(Error('EntityManager not available'));
    }

    console.log('');
    console.log('register.route.ts, registerUser():');
    console.log('req.baseUrl:', req.baseUrl);
    console.log('req.originalUrl:', req.originalUrl);
    console.log('register.route.ts, registerUser()^');
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
            conflictError.name = 'EMAIL_EXISTS';
            conflictError.message = 'E-mail already exists!';
            return res.status(409).json(conflictError);
        }

        const registeredUser = new User(
            {
                email: req.body.email,
                password: encryptPassword(req.body.password)
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

    return res.status(201).json(response);
}