import vine from '@vinejs/vine'

export const storeValidator = vine.compile(
    vine.object({
        bid: vine.number().min(1)
    })
)
