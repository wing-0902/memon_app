<script lang="ts">
  let { children } = $props();
  import { page } from '$app/state';
</script>

<div>
  {#if page.url.pathname !== '/policy/'}
    <a href="/policy/" class="return">
      <span class="icon">arrow_back_ios_new</span>
      <span class="text">戻る</span>
    </a>
  {/if}
  {@render children()}
</div>

<style lang="scss">
  a.return {
    display: flex;
    align-items: center;
    text-decoration: none;
    .text:hover {
      text-decoration: underline;
    }
  }
</style>
