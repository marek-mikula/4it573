import type { HttpContext } from '@adonisjs/core/http'
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

        const item = await this.itemRepository.store({
            userId: auth.user!.id,
            ...payload
        })

        return item
    }

    async index() {

    }

}