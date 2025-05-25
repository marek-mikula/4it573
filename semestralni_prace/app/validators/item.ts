import vine from '@vinejs/vine'
import {ItemCondition} from "#models/item";

export const storeValidator = vine.compile(
    vine.object({
        name: vine.string().trim().maxLength(255),
        description: vine.string().trim(),
        condition: vine.enum(ItemCondition),
        startPrice: vine.number().min(1),
        tags: vine.array(vine.string().minLength(1)),
        startAt: vine.date({formats: 'YYYY-MM-DD HH:mm:ss'}).afterOrEqual('today', {
            compare: 'seconds'
        }).nullable(),
        endAt: vine.date({formats: 'YYYY-MM-DD HH:mm:ss'}).afterField('startAt', {
            compare: 'day'
        }).after('today', {
            compare: 'day'
        }),
        image: vine.file({
            size: '5mb',
            extnames: ['jpg', 'png']
        })
    })
)

export const updateValidator = vine.compile(
    vine.object({
        name: vine.string().trim().maxLength(255),
        description: vine.string().trim(),
        condition: vine.enum(ItemCondition),
        startPrice: vine.number().min(1),
        tags: vine.array(vine.string().minLength(1)),
        startAt: vine.date({formats: 'YYYY-MM-DD HH:mm:ss'}).afterOrEqual('today', {
            compare: 'seconds'
        }).nullable(),
        endAt: vine.date({formats: 'YYYY-MM-DD HH:mm:ss'}).afterField('startAt', {
            compare: 'day'
        }).after('today', {
            compare: 'day'
        }),
        image: vine.file({
            size: '5mb',
            extnames: ['jpg', 'png']
        }).optional()
    })
)
