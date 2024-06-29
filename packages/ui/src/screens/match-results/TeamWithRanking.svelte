<script lang="ts">
  import RankingArrow from './RankingArrow.svelte';

  export let team: number;
  export let rank: number;
  export let previousRank: number;
  export let isRed: boolean;
</script>

<div class="flex flex-row">
  <div
    class="text-2xl font-bold justify-self-center text-center py-2 px-4 min-w-24"
    class:bg-red-600={isRed}
  >
    {team}
  </div>
  <div
    class="bg-white w-16 px-2 flex flex-row justify-center gap-2 font-bold text-xl"
  >
    <div class="grid place-content-center text-black">{rank}</div>
    <div class="grid place-content-center text-black">
      <RankingArrow {rank} {previousRank} />
    </div>
  </div>
</div>
