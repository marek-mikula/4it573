import ItemBid from "#models/item_bid";

export default class ItemBidRepository {

    async store(data: {
        userId: number,
        itemId: number,
        bid: number
    }): Promise<ItemBid> {
        return ItemBid.create(data)
    }

    async getLastBid(itemId: number): Promise<ItemBid|null> {
        return ItemBid
            .query()
            .where('item_id', itemId)
            .orderBy('id', 'desc')
            .first()
    }

}