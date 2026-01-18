<script lang="ts">
  import { page } from '$app/state';

  let slug = $derived(page.params.slug);
</script>

<div>
  <p>現在のID：{slug}</p>
</div>
