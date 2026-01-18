<script>
  let { children, title, ...rest } = $props();
</script>

<svelte:head>
  ああああ
  <title>{title}</title>
</svelte:head>

<article>
  <div class="content">
    {@render children()}
  </div>
</article>
