import User from "#models/user";

export default class UserRepository {

    async findByEmail(email: string): Promise<User|null> {
        return User.query()
            .where('email', email)
            .first()
    }

    async findByCredentials(data: {
        email: string,
        password: string
    }): Promise<User> {
        return User.verifyCredentials(data.email, data.password)
    }

    async store(data: {
        firstname: string,
        lastname: string,
        email: string
        password: string
    }): Promise<User> {
        return User.create({
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            password: data.password,
        })
    }

}