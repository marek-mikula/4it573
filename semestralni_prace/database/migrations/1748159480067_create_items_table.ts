import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable()
      table.string('name').notNullable()
      table.text('description').notNullable()
      table.enum('condition', ['new', 'unpacked', 'used', 'broken']).notNullable()
      table.integer('start_price').unsigned().notNullable()
      table.json('tags')
      table.timestamp('end_at').notNullable()
      table.string('image_name').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')

      table.foreign('user_id').references('users.id').onDelete('cascade')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}