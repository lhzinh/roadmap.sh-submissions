#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/6eb809785e48ae32302602a26f1f3fb14d4077d1f4649b8f9af7fd76469f0da9/contract';
import endContract from '../../snapshots/6eb809785e48ae32302602a26f1f3fb14d4077d1f4649b8f9af7fd76469f0da9/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/ae3b587ddd3dabd5119eb77a2c5601ea2d8ba5678e7842cbcf9b06c136e96060/contract';
import startContract from '../../snapshots/ae3b587ddd3dabd5119eb77a2c5601ea2d8ba5678e7842cbcf9b06c136e96060/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'category',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'category',
        constraint: 'category_name_key',
        columns: ['name'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
