<script lang="js">
  import { VERSION as SVELTEKIT_VERSION } from '@sveltejs/kit';
</script>

<svelte:head>
  <title>技術仕様 | Memon</title>
</svelte:head>

<div class="root">
  <p>利用規約・ライセンスについては<a href="/policy/">こちら</a>をご覧ください．</p>
  <h2>Memonについて</h2>
  <ul>
    <li>Version：{__APP_VERSION__}</li>
    <li>Package Name：{__APP_NAME__}</li>
    <li>Generator：SvelteKit {SVELTEKIT_VERSION}</li>
    <li>Production Env：Cloudflare Pages</li>
    <li>
      Homepage：<a
        href="https://memon.cards/"
        target="_blank">memon.cards</a
      >
    </li>
  </ul>
  <h2>作者について</h2>
  <p>Tsubasa Terasawa</p>
  <ul>
    <li>Email：<a href="mailto:wing@me.wing.osaka">wing@me.wing.osaka</a></li>
    <li>
      GitHub：<a
        href="https://github.com/wing-0902"
        target="_blank">wing-0902</a
      >
    </li>
    <li>
      Homepage：<a
        href="https://wing.osaka/"
        target="_blank">wing.osaka</a
      >
    </li>
  </ul>
</div>
