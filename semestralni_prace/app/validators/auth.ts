import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
    vine.object({
        firstname: vine.string().trim().maxLength(50),
        lastname: vine.string().trim().maxLength(50),
        email: vine.string().trim().email().maxLength(50),
        password: vine.string().trim().minLength(8).alphaNumeric().confirmed({
            confirmationField: 'passwordConfirm'
        }),
    })
)

export const loginValidator = vine.compile(
    vine.object({
        email: vine.string().trim().email(),
        password: vine.string().trim(),
    })
)
