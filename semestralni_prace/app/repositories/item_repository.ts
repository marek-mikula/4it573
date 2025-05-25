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
        startAt: Date | null
        endAt: Date
    }): Promise<Item> {
        return Item.create({
            userId: data.userId,
            name: data.name,
            description: data.description,
            condition: data.condition,
            startPrice: data.startPrice,
            tags: data.tags,
            startAt: data.startAt ? DateTime.fromJSDate(data.startAt) : null,
            endAt: DateTime.fromJSDate(data.endAt)
        })
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
            .where((query) => {
                query
                    .whereNull('start_at')
                    .orWhere('start_at', '<', DateTime.local().toSQL())
            })
    }

}