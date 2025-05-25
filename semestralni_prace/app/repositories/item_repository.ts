import type {ItemCondition} from "#models/item";
import Item from "#models/item";
import {DateTime} from "luxon";

export default class ItemRepository {

    async store(data: {
        userId: number
        name: string,
        description: string,
        condition: ItemCondition
        startPrice: number
        tags: string[]
        endAt: Date
        imageName: string
    }): Promise<Item> {
        return Item.create({
            userId: data.userId,
            name: data.name,
            description: data.description,
            condition: data.condition,
            startPrice: data.startPrice,
            tags: data.tags,
            endAt: DateTime.fromJSDate(data.endAt),
            imageName: data.imageName
        })
    }

    async update(item: Item, data: {
        name: string,
        description: string,
        tags: string[]
        imageName: string | null
    }): Promise<Item> {
        item.name = data.name
        item.description = data.description
        item.tags = data.tags

        if (data.imageName) {
            item.imageName = data.imageName
        }

        return item.save()
    }

    async getListOfUserItems(userId: number): Promise<Item[]> {
        return Item
            .query()
            .where('user_id', userId)
    }

    async findItem(id: number): Promise<Item|null> {
        return Item
            .query()
            .where('id', id)
            .first()
    }

    async getListOfActiveItems(userId: number): Promise<Item[]> {
        return Item
            .query()
            .withAggregate('bids', (query) => {
                query.max('bid').as('maxBid')
            })
            .where('user_id', '<>', userId)
            .where('end_at', '>', DateTime.local().toSQL())
    }

}