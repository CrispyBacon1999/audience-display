<script lang="ts">
  import { type ComponentType } from 'svelte';
  import { state } from '../lib/state';
  import type { Screen } from 'lib';
  import MatchPreview from './match-preview/MatchPreview.svelte';
  import MatchReady from './match-ready/MatchReady.svelte';
  import MatchResults from './match-results/MatchResults.svelte';

  let transitioning = false;
  let activeScreen: Screen = 'none';

  // When the screen changes, set transitioning to true,
  // then wait for the transition to finish before setting
  // transitioning to false and updating the active screen.
  $: if ($state.screen !== activeScreen) {
    transitioning = true;
    console.log('Transitioning');
    setTimeout(() => {
      if (transitioning) {
        transitioning = false;
        activeScreen = $state.screen;
      }
    }, 1000);
  }

  const screens: { [key in Screen]: ComponentType | null } = {
    none: null,
    'match-preview': MatchPreview,
    'match-ready': MatchReady,
    'match-auton': MatchReady,
    'match-transition': MatchReady,
    'match-teleop': MatchReady,
    'match-endgame': MatchReady,
    'match-end': MatchReady,
    'scores-ready': null,
    'score-reveal': MatchResults,
  };
</script>

{#if activeScreen in screens}
  {#if screens[activeScreen] !== null}
    <svelte:component
      this={screens[activeScreen]}
      exit={transitioning}
      on:transitioned={() => {
        transitioning = false;
        activeScreen = $state.screen;
      }}
    />
  {/if}
{/if}
