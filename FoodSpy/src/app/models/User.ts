export class User {

    email: string | null;
    password: string | null;

    constructor(
        email: string,
        password: string
    ) {
        this.email = email;
        this.password = password;
    }
}