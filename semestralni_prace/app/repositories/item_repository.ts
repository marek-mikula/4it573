import type {ItemState} from "#models/item";
import Item from "#models/item";

export default class ItemRepository {

    async store(data: {
        userId: number
        name: string,
        description: string,
        state: ItemState
        tags: string[]
        startPrice: number
    }): Promise<Item> {
        return Item.create({
            userId: data.userId,
            name: data.name,
            description: data.description,
            state: data.state,
            tags: data.tags,
            startPrice: data.startPrice
        })
    }

}