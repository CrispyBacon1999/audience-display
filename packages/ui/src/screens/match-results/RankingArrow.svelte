<script lang="ts">
  export let rank: number;
  export let previousRank: number;

  let arrow = '';
  if (rank < previousRank) {
    arrow = '🢁';
  } else if (rank > previousRank) {
    arrow = '🢃';
  } else {
    arrow = '•';
  }
</script>

{arrow}
