import { DateTime } from 'luxon'
import {BaseModel, belongsTo, column} from '@adonisjs/lucid/orm'
import User from "#models/user";
import type {BelongsTo} from "@adonisjs/lucid/types/relations";

export enum ItemState {
  NEW = 'new',
  UNPACKED = 'unpacked',
  USED = 'used',
  BROKEN = 'broken',
}

export default class Item extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare name: string

  @column()
  declare description: string

  @column()
  declare state: ItemState

  @column()
  declare startPrice: number

  @column({
    prepare: (value: string[]) => (JSON.stringify(value)),
    consume: (value: string) => (JSON.parse(value)),
  })
  declare tags: string[]

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}