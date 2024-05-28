<script lang="ts">
  import type { AllianceScore, Team } from 'lib';

  export let score: AllianceScore;
  export let teams: Team[];
  export let isRed: boolean;
</script>

<div class="flex flex-col p-4" class:bg-red-600={isRed}>
  <p class="text-white text-4xl text-center">{score.score}</p>
  <p class="text-white text-2xl text-center">{score.auto}</p>
  <p class="text-white text-2xl text-center">{score.amp}</p>
  <p class="text-white text-2xl text-center">{score.endgame}</p>
  <p class="text-white text-2xl text-center">{score.speaker}</p>
  <p class="text-white text-2xl text-center">{score.fouls}</p>
</div>
