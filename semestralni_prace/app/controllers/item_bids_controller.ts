import type {HttpContext} from '@adonisjs/core/http'
import ItemRepository from "#repositories/item_repository";
import {inject} from "@adonisjs/core";
import {storeValidator} from "#validators/item_bid";
import ItemBidRepository from "#repositories/item_bid_repository";

@inject()
export default class ItemBidsController {

    constructor(
        private itemRepository: ItemRepository,
        private itemBidRepository: ItemBidRepository,
    ) {
    }

    async store({request, response, params, auth}: HttpContext) {
        const user = auth.user!
        const item = await this.itemRepository.findItem(params.id)
        const payload = await storeValidator.validate(request.all())

        if (!item) {
            return response.abort({message: 'Item not found.'}, 404)
        }

        // user cannot bid on his own items
        if (item.userId === user.id) {
            return response.abort({message: 'You cannot bid on your own item.'}, 400)
        }

        // user can bid only on active items
        if (!item.isActive) {
            return response.abort({message: item.isEnded ? 'Auction has already ended.' : 'Item not found.'}, 404)
        }

        const lastBid = await this.itemBidRepository.getLastBid(item.id)

        // user is the last bidder
        if (lastBid && lastBid.userId === user.id) {
            return response.abort({message: 'You have already bid on this item.'}, 400)
        }

        // users bid is too low
        if (lastBid && lastBid.bid >= payload.bid) {
            return response.abort({message: `Your bid is too low. You need to bid at least ${lastBid.bid + 1}`}, 400)
        }

        // check starting price
        if (!lastBid && item.startPrice > payload.bid) {
            return response.abort({message: `Your bid is too low. You need to bid at least ${item.startPrice}`}, 400)
        }

        const newBid = await this.itemBidRepository.store({
            ...payload,
            userId: user.id,
            itemId: item.id,
        })

        return {
            bid: newBid
        }
    }

}