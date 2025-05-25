import { DateTime } from 'luxon'
import {BaseModel, belongsTo, column} from '@adonisjs/lucid/orm'
import User from "#models/user";
import type {BelongsTo} from "@adonisjs/lucid/types/relations";
import Item from "#models/item";

export default class ItemBid extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare itemId: number

  @column()
  declare userId: number

  @column()
  declare bid: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Item, {
    localKey: 'itemId',
    foreignKey: 'id',
  })
  declare item: BelongsTo<typeof Item>

  @belongsTo(() => User, {
    localKey: 'userId',
    foreignKey: 'id',
  })
  declare user: BelongsTo<typeof User>
}