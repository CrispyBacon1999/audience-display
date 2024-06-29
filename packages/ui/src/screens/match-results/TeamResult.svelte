<script lang="ts">
  import type { AllianceScore, Team } from 'lib';
  import TeamWithRanking from './TeamWithRanking.svelte';

  export let score: AllianceScore;
  export let teams: Team[];
  export let isRed: boolean;
</script>

<div
  class="flex flex-col p-4"
  class:bg-red-800={isRed}
  class:bg-blue-800={!isRed}
>
  {#if isRed}
    <h2 class="text-4xl font-bold justify-self-center text-center">Red</h2>
  {:else}
    <h2 class="text-4xl font-bold justify-self-center text-center">Blue</h2>
  {/if}
  <div class="flex flex-row justify-around">
    {#each teams as team}
      <TeamWithRanking
        team={team.number}
        rank={team.rank}
        previousRank={0}
        {isRed}
      />
    {/each}
  </div>
  <div
    class="text-white text-4xl text-center flex justify-start gap-8"
    class:justify-end={isRed}
    class:text-right={isRed}
    class:text-left={!isRed}
    class:flex-row={isRed}
    class:flex-row-reverse={!isRed}
  >
    <div class="w-64" class:text-right={isRed} class:text-left={!isRed}>
      Score
    </div>
    <div class="w-12 text-center">{score.score}</div>
  </div>
  <div
    class="text-white text-2xl text-center flex justify-start gap-8"
    class:justify-end={isRed}
    class:text-right={isRed}
    class:text-left={!isRed}
    class:flex-row={isRed}
    class:flex-row-reverse={!isRed}
  >
    <div class="w-64" class:text-right={isRed} class:text-left={!isRed}>
      Auto
    </div>
    <div class="w-12 text-center">{score.auto}</div>
  </div>
  <div
    class="text-white text-2xl text-center flex justify-start gap-8"
    class:justify-end={isRed}
    class:text-right={isRed}
    class:text-left={!isRed}
    class:flex-row={isRed}
    class:flex-row-reverse={!isRed}
  >
    <div class="w-64" class:text-right={isRed} class:text-left={!isRed}>
      Amp
    </div>
    <div class="w-12 text-center">{score.amp}</div>
  </div>
  <div
    class="text-white text-2xl text-center flex justify-start gap-8"
    class:justify-end={isRed}
    class:text-right={isRed}
    class:text-left={!isRed}
    class:flex-row={isRed}
    class:flex-row-reverse={!isRed}
  >
    <div class="w-64" class:text-right={isRed} class:text-left={!isRed}>
      Endgame
    </div>
    <div class="w-12 text-center">{score.endgame}</div>
  </div>
  <div
    class="text-white text-2xl text-center flex justify-start gap-8"
    class:justify-end={isRed}
    class:text-right={isRed}
    class:text-left={!isRed}
    class:flex-row={isRed}
    class:flex-row-reverse={!isRed}
  >
    <div class="w-64" class:text-right={isRed} class:text-left={!isRed}>
      Speaker
    </div>
    <div class="w-12 text-center">{score.speaker}</div>
  </div>
  <div
    class="text-white text-2xl text-center flex justify-start gap-8"
    class:justify-end={isRed}
    class:text-right={isRed}
    class:text-left={!isRed}
    class:flex-row={isRed}
    class:flex-row-reverse={!isRed}
  >
    <div class="w-64" class:text-right={isRed} class:text-left={!isRed}>
      Fouls
    </div>
    <div class="w-12 text-center">{score.fouls}</div>
  </div>
</div>
