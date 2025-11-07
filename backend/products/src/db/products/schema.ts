import { pgTable, serial, varchar, decimal } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 256 }).notNull(),
    description: varchar('description', { length: 1024 }).notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    category: varchar('category', { length: 128 }),
    createAt: varchar('create_at').default("NOW()"),
})