import { DateTime } from 'luxon'
import {BaseModel, belongsTo, column, computed, hasMany} from '@adonisjs/lucid/orm'
import User from "#models/user";
import type {BelongsTo, HasMany} from "@adonisjs/lucid/types/relations";
import ItemBid from "#models/item_bid";
import router from '@adonisjs/core/services/router'

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
  declare endAt: DateTime

  @column()
  declare imageName: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @computed()
  get isEnded(): boolean {
    return this.endAt.toJSDate() < (new Date());
  }

  @computed()
  get fileUrl(): string {
    return router
        .builder()
        .params([this.imageName])
        .make('files.show')
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