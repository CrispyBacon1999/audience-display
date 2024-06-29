import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';

const table = sqliteTable('match_alliance_score', {
  id: integer('id').primaryKey(),
  autoLineRobot1: integer('auto_line_robot_1', { mode: 'boolean' }),
  autoLineRobot2: integer('auto_line_robot_2', { mode: 'boolean' }),
  autoLineRobot3: integer('auto_line_robot_3', { mode: 'boolean' }),
  autoAmpNoteCount: integer('auto_amp_note_count'),
  autoAmpNotePoints: integer('auto_amp_note_points'),
  autoLeavePoints: integer('auto_leave_points'),
  autoPoints: integer('auto_points'),
  autoSpeakerNoteCount: integer('auto_speaker_note_count'),
  autoSpeakerNotePoints: integer('auto_speaker_note_points'),
  autoTotalNotePoints: integer('auto_total_note_points'),
  coopNotePlayed: integer('coop_note_played', { mode: 'boolean' }),
  coopertitionBonusAchieved: integer('coop_bonus_achieved', {
    mode: 'boolean',
  }),
  coopertitionCriteriaMet: integer('coop_criteria_met', { mode: 'boolean' }),
  endGameHarmonyPoints: integer('end_game_harmony_points'),
  endGameNoteInTrapPoints: integer('end_game_note_in_trap_points'),
  endGameOnStagePoints: integer('end_game_on_stage_points'),
  endGameParkPoints: integer('end_game_park_points'),
  endGameRobot1: text('end_game_robot_1', {
    enum: ['None', 'Parked', 'StageRight', 'StageLeft', 'CenterStage'],
  }),
  endGameSpotLightBonusPoints: integer('end_game_spot_light_bonus_points'),
  endGameTotalStagePoints: integer('end_game_total_stage_points'),
  ensembleBonusAchieved: integer('ensamble_bonus_achieved', {
    mode: 'boolean',
  }),
  ensembleBonusOnStageRobotsThreshold: integer(
    'ensamble_bonus_on_stage_robots_threshold'
  ),
  ensembleBonusStagePointsThreshold: integer(
    'ensamble_bonus_stage_points_threshold'
  ),
  foulCount: integer('foul_count'),
  foulPoints: integer('foul_points'),
  g206Penalty: integer('g206_penalty', { mode: 'boolean' }),
  g408Penalty: integer('g408_penalty', { mode: 'boolean' }),
  g424Penalty: integer('g424_penalty', { mode: 'boolean' }),
  melodyBonusAchieved: integer('melody_bonus_achieved', { mode: 'boolean' }),
  melodyBonusThreshold: integer('melody_bonus_threshold'),
  melodyBonusThresholdCoop: integer('melody_bonus_threshold_coop'),
  melodyBonusThresholdNonCoop: integer('melody_bonus_threshold_non_coop'),
  micCenterStage: integer('mic_center_stage', { mode: 'boolean' }),
  micStageLeft: integer('mic_stage_left', { mode: 'boolean' }),
  micStageRight: integer('mic_stage_right', { mode: 'boolean' }),
  rp: integer('rp', { mode: 'boolean' }),
  techFoulCount: integer('tech_foul_count'),
  teleopAmpNoteCount: integer('teleop_amp_note_count'),
  teleopAmpNotePoints: integer('teleop_amp_note_points'),
  teleopPoints: integer('teleop_points'),
  teleopSpeakerNoteAmplifiedCount: integer(
    'teleop_speaker_note_amplified_count'
  ),
  teleopSpeakerNoteAmplifiedPoints: integer(
    'teleop_speaker_note_amplified_points'
  ),
  teleopSpeakerNoteCount: integer('teleop_speaker_note_count'),
  teleopSpeakerNotePoints: integer('teleop_speaker_note_points'),
  teleopTotalNotePoints: integer('teleop_total_note_points'),
  totalPoints: integer('total_points'),
  trapCenterStage: integer('trap_center_stage', { mode: 'boolean' }),
  trapStageLeft: integer('trap_stage_left', { mode: 'boolean' }),
  trapStageRight: integer('trap_stage_right', { mode: 'boolean' }),
});

export { table as matchAllianceScoreTable };
