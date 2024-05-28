<script lang="ts">
  import { state } from '../../lib/state';
  import TeamResult from './TeamResult.svelte';
</script>

<div class="w-full h-full">
  <div class="flex flex-row justify-center">
    {#if $state.match}
      <TeamResult
        teams={$state.match.teams.red}
        score={$state.match.score.red}
        isRed
      />
    {/if}
  </div>
</div>
