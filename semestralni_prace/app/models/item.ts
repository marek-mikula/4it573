import { DateTime } from 'luxon'
import {BaseModel, belongsTo, column, computed, hasMany} from '@adonisjs/lucid/orm'
import User from "#models/user";
import type {BelongsTo, HasMany} from "@adonisjs/lucid/types/relations";
import ItemBid from "#models/item_bid";

export enum ItemCondition {
  NEW = 'new',
  UNPACKED = 'unpacked',
  USED = 'used',
  BROKEN = 'broken',
}

export default class Item extends BaseModel {
  serializeExtras = true

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare condition: ItemCondition

  @column()
  declare startPrice: number

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
  })
  declare tags: string[]

  @column.dateTime()
  declare startAt: DateTime | null

  @column.dateTime()
  declare endAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @computed()
  get isActive(): boolean {
    const now = new Date()

    if (this.startAt && this.startAt.toJSDate() > now) {
      return false
    }

    return !this.isEnded;
  }

  @computed()
  get isEnded(): boolean {
    return this.endAt.toJSDate() < (new Date());
  }

  @belongsTo(() => User, {
    localKey: 'userId',
    foreignKey: 'id',
  })
  declare user: BelongsTo<typeof User>

  @hasMany(() => ItemBid, {
    localKey: 'id',
    foreignKey: 'itemId'
  })
  declare bids: HasMany<typeof ItemBid>
}