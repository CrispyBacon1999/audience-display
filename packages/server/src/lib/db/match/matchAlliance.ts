import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { matchTable } from './match';

const table = sqliteTable('match_alliance', {
  id: integer('id').primaryKey(),
  station1: integer('station1'),
  station2: integer('station2'),
  station3: integer('station3'),
});

export { table as matchAllianceTable };
