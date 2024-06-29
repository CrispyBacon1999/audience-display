import { relations } from 'drizzle-orm';
import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { matchAllianceTable } from './matchAlliance';
import { matchAllianceScoreTable } from './matchAllianceScore';

const table = sqliteTable('match', {
  id: text('key').primaryKey(),
  eventKey: text('event_key').notNull(),
  compLevel: text('comp_level', { enum: ['qm', 'sf', 'f'] }).notNull(),
  matchNumber: integer('match_number').notNull(),
  setNumber: integer('set_number').notNull(),
  redAllianceId: integer('red_alliance_id').notNull(),
  blueAllianceId: integer('blue_alliance_id').notNull(),
  redScoreId: integer('red_score_id').notNull(),
  blueScoreId: integer('blue_score_id').notNull(),
});

const matchRelations = relations(table, ({ one }) => ({
  redAlliance: one(matchAllianceTable),
  blueAlliance: one(matchAllianceTable),
  redScore: one(matchAllianceScoreTable),
  blueScore: one(matchAllianceScoreTable),
}));

export { table as matchTable, matchRelations };
