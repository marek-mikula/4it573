import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'item_bids'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('item_id').unsigned().notNullable()
      table.integer('user_id').unsigned().notNullable()
      table.integer('bid').unsigned().notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('user_id').references('users.id').onDelete('cascade')
      table.foreign('item_id').references('items.id').onDelete('cascade')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}