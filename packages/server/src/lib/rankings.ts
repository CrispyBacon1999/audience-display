import db from './db';
import { match } from './db/schema';

const recalculateRankings = async () => {
  const matches = await db.query.match.findMany({
    with: {
      blueAlliance: true,
      redAlliance: true,
      redScore: true,
      blueScore: true,
    },
  });
};
