import vine from '@vinejs/vine'
import {ItemState} from "#models/item";

export const storeValidator = vine.compile(
    vine.object({
        name: vine.string().trim().maxLength(255),
        description: vine.string().trim(),
        state: vine.enum(ItemState),
        tags: vine.array(vine.string().minLength(1)),
        startPrice: vine.number().min(1)
    })
)
