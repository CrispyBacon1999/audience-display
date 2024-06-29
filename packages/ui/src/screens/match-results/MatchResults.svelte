<script lang="ts">
  import type { AudienceDisplayState } from 'lib';
  import { state } from '../../lib/state';
  import TeamResult from './TeamResult.svelte';
  import { onMount } from 'svelte';

  let matchState: Readonly<AudienceDisplayState> | null = null;

  // Lock the match to the global state on mount so it doesn't change when the global state changes
  onMount(() => {
    matchState = Object.freeze($state);
  });
</script>

<div class="w-full h-full">
  <div class="grid grid-cols-2 justify-center shadow-2xl">
    {#if matchState?.match}
      <TeamResult
        teams={matchState.match.teams.red}
        score={matchState.match.score.red}
        isRed
      />
      <TeamResult
        teams={matchState.match.teams.blue}
        score={matchState.match.score.blue}
        isRed={false}
      />
    {/if}
  </div>
</div>
