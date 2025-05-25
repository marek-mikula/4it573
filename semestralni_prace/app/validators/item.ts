import vine from '@vinejs/vine'
import {ItemCondition} from "#models/item";

export const storeValidator = vine.compile(
    vine.object({
        name: vine.string().trim().maxLength(255),
        description: vine.string().trim(),
        condition: vine.enum(ItemCondition),
        startPrice: vine.number().min(1),
        tags: vine.array(vine.string().minLength(1)),
        endAt: vine.date({formats: 'YYYY-MM-DD HH:mm:ss'}).after('today', {compare: 'day'}),
        image: vine.file({size: '5mb', extnames: ['jpg', 'png']})
    })
)

export const updateValidator = vine.compile(
    vine.object({
        name: vine.string().trim().maxLength(255),
        description: vine.string().trim(),
        tags: vine.array(vine.string().minLength(1)),
        image: vine.file({
            size: '5mb',
            extnames: ['jpg', 'png']
        }).optional()
    })
)
