import { Router, Response, NextFunction } from 'express';
import { EntityManager } from '@mikro-orm/core';
// Interfaces:
import { IAuthResponseData } from 'foodspy-shared';
import { IExpressRequest } from '../interfaces/IExpressRequest';
// Models:
import { AuthResponseData } from '../models/AuthResponseData';
import { User } from '../entities/user.entity';
// Services:
import * as userService from '../services/users.service';
import { decryptPassword } from '../services/password.service';
// Shared:
import { ERROR_MESSAGES, STATUS_CODES } from 'foodspy-shared';
import { log } from '../shared/Logger';

export { setLoginRoute };

function setLoginRoute(router: Router): Router {
    router.post('/', loginUser);
    return router;
}

const THIRTY_MINUTES: number = 1800;    // in seconds
const FIVE_MINUTES: number = 300;    // in seconds
const FIFTEEN_MINUTES: number = 900;    // in seconds

// POST
async function loginUser(
    req: IExpressRequest,
    res: Response,
    next: NextFunction
) {
    if (!req.em || !(req.em instanceof EntityManager)) {
        log('login.route.ts', loginUser.name, 'req.em is not instanceof EntityManager');
        return next(Error('EntityManager not available'));
    }

    console.log('');
    log('login.route.ts', loginUser.name, '');
    log('login.route.ts', loginUser.name, 'req.baseUrl:', req.baseUrl);
    log('login.route.ts', loginUser.name, 'req.originalUrl:', req.originalUrl);

    let response: Error | User | null;
    try {

        const body = req.body;

        response = await userService
            .getUserByEmail(
                req.em,
                body.email
            );

        if (!response) {
            const userDoesNotExistError: Error = new Error;
            userDoesNotExistError.name = ERROR_MESSAGES.NO_ACCOUNT;
            userDoesNotExistError.message = 'No account found!';

            return res.status(STATUS_CODES.NOT_FOUND).json(userDoesNotExistError);
        }

        if (response instanceof Error) {
            return next(response);
        }

        if (response instanceof User) {
            log('login.route.ts', loginUser.name, 'response:', response);

            const formPassword = body.password;
            const storedPassword = response.password;
            const match = decryptPassword(formPassword, storedPassword);
            if (match) {

                log('login.route.ts', loginUser.name, 'Passwords match! Signing user in...');
                let authResponseData: IAuthResponseData = new AuthResponseData;
                authResponseData.email = response.email;
                authResponseData.token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
                authResponseData.id = response.id;
                authResponseData.targetCalories = response.targetCalories;
                authResponseData.expiresIn = FIFTEEN_MINUTES;

                log('login.route.ts', `${loginUser.name}^`, '');
                console.log('');

                return res.status(200).json(authResponseData);
            } else {
                const wrongPasswordError: Error = new Error;
                wrongPasswordError.name = ERROR_MESSAGES.WRONG_PASSWORD;
                wrongPasswordError.message = 'Wrong e-mail or password!';

                log('login.route.ts', `${loginUser.name}^`, '');
                console.log('');

                return res.status(STATUS_CODES.UNAUTHORIZED).json(wrongPasswordError);
            }
        }

    } catch (ex) {
        return next(ex);
    }

    return res.status(STATUS_CODES.OK).json(response);
}