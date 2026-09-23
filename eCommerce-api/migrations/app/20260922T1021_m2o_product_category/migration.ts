#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/6eb809785e48ae32302602a26f1f3fb14d4077d1f4649b8f9af7fd76469f0da9/contract';
import startContract from '../../snapshots/6eb809785e48ae32302602a26f1f3fb14d4077d1f4649b8f9af7fd76469f0da9/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/b2bbdf419978eb5735c6f4b01f3c535b2a62bb3f4229e14666578ad7377093ba/contract';
import endContract from '../../snapshots/b2bbdf419978eb5735c6f4b01f3c535b2a62bb3f4229e14666578ad7377093ba/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'product',
        columns: [
          col('categoryId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('price', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'product',
        constraint: 'product_name_key',
        columns: ['name'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'product',
        index: 'product_categoryId_idx_15c304f2',
        columns: ['categoryId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'product',
        foreignKey: {
          name: 'product_categoryId_fkey',
          columns: ['categoryId'],
          references: { schema: 'public', table: 'category', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
