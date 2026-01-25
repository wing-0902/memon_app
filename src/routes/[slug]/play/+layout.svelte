<script lang="ts">
  import { page } from '$app/state';
  let { children } = $props();
  let targetId = $derived(page.params.slug);
</script>

<div class="wrapper">
  <a class="returnLink" href="/{targetId}/">＜戻る</a>
</div>
{@render children()}

<style lang="scss">
  div.wrapper {
    width: 100%;
    display: flex;
    a.returnLink {
      margin-left: 13px;
      text-align: left;
    }
  }
</style>
