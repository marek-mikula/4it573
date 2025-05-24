import type {HttpContext} from '@adonisjs/core/http'
import UserRepository from "#repositories/user_repository";
import {loginValidator, registerValidator} from "#validators/auth";
import {inject} from "@adonisjs/core";
import {errors} from "@adonisjs/auth";
import User from "#models/user";

@inject()
export default class AuthController {

    constructor(
        private userRepository: UserRepository
    ) {
    }

    async register({request, response}: HttpContext) {
        const payload = await registerValidator.validate(request.all())

        const existingUser = await this.userRepository.findByEmail(payload.email)

        if (existingUser) {
            return response.status(422).send({
                message: 'User with this email address already exists.'
            })
        }

        const user = await this.userRepository.store(payload)

        return response.status(200).send({
            user
        })
    }

    async login({request, response}: HttpContext) {
        const payload = await loginValidator.validate(request.all())

        let user

        try {
            user = await this.userRepository.findByCredentials(payload)
        } catch (e: any) {
            if (e instanceof errors.E_INVALID_CREDENTIALS) {
                return response.status(400).send({
                    message: 'Invalid credentials.'
                })
            }

            throw e
        }

        const token = await User.accessTokens.create(user)

        return response.status(200).send({
            user,
            token,
        })
    }
}