import type {HttpContext} from '@adonisjs/core/http'
import {storeValidator, updateValidator} from "#validators/item";
import ItemRepository from "#repositories/item_repository";
import {inject} from "@adonisjs/core";
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'
import * as fs from "fs";

@inject()
export default class ItemsController {

    constructor(
        private itemRepository: ItemRepository
    ) {
    }

    async store({request, auth}: HttpContext) {
        const payload = await storeValidator.validate(request.all())

        const image = request.file('image')!

        await image.move(app.makePath('uploads'), {
            name: `${cuid()}.${image.extname}`
        })

        return await this.itemRepository.store({
            ...payload,
            imageName: image.fileName!,
            userId: auth.user!.id,
            endAt: new Date(payload.endAt),
        })
    }

    async index({auth}: HttpContext) {
        return await this.itemRepository.getListOfUserItems(auth.user!.id)
    }

    async show({response, params, auth}: HttpContext) {
        const user = auth.user!
        const item = await this.itemRepository.findItem(params.id)

        if (!item) {
            return response.abort({message: 'Item not found.'}, 404)
        }

        // if user is not the owner of the item,
        // he can see it only in case it's active
        if (item.userId !== user.id && item.isEnded) {
            return response.abort({message: 'Auction has already ended.'}, 404)
        }

        return item
    }

    async update({response, request, params, auth}: HttpContext) {
        const user = auth.user!
        const item = await this.itemRepository.findItem(params.id)

        if (!item || item.userId !== user.id) {
            return response.abort({message: 'Item not found.'}, 404)
        }

        const payload = await updateValidator.validate(request.all())
        const image = request.file('image')
        let imageName = null

        // user wants to change the image
        if (image) {
            const existingPath = app.makePath('uploads', item.imageName)

            // remove existing file
            await fs.unlinkSync(existingPath)

            await image.move(app.makePath('uploads'), {
                name: `${cuid()}.${image.extname}`
            })

            imageName = image.fileName!
        }

        return await this.itemRepository.update(item, {
            ...payload,
            imageName,
        })
    }

    async active({auth}: HttpContext) {
        return await this.itemRepository.getListOfActiveItems(auth.user!.id)
    }

}