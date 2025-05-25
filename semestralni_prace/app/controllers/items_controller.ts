import type {HttpContext} from '@adonisjs/core/http'
import {storeValidator} from "#validators/item";
import ItemRepository from "#repositories/item_repository";
import {inject} from "@adonisjs/core";

@inject()
export default class ItemsController {

    constructor(
        private itemRepository: ItemRepository
    ) {
    }

    async store({request, auth}: HttpContext) {
        const payload = await storeValidator.validate(request.all())

        return await this.itemRepository.store({
            ...payload,
            userId: auth.user!.id,
            endAt: new Date(payload.endAt),
            startAt: payload.startAt ? new Date(payload.startAt) : null,
        })
    }

    async index({auth}: HttpContext) {
        return await this.itemRepository.getListOfUserItems(auth.user!.id)
    }

    async show({response, params, auth}: HttpContext) {
        const user = auth.user!
        const item = await this.itemRepository.findItem(params.id)

        if (!item) {
            return response.abort({
                message: 'Item not found.'
            }, 404)
        }

        // if user is not the owner of the item,
        // he can see it only in case it's active
        if (item.userId !== user.id && !item.isActive) {
            return response.abort({
                message: item.isEnded ? 'Auction has already ended.' : 'Item not found.'
            }, 404)
        }

        return item
    }

    async active({auth}: HttpContext) {
        return await this.itemRepository.getListOfActiveItems(auth.user!.id)
    }

}