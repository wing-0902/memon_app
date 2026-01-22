<script lang="ts">
  let showing = $state('');
</script>

<header class="header">
  <h1><a href="/">Memon</a></h1>
  <nav>
    <ul>
      <li><a href="/create/">単語帳を作成</a></li>
      <li><a href="/config/">設定</a></li>
      <li>
        <a href="https://memon.cards/docs/" target="_blank">ヘルプ</a>
      </li>
    </ul>
  </nav>
</header>

<style lang="scss">
  .header {
    display: flex;
    margin: 0 10px;
    justify-content: space-between;
    h1 {
      margin: 0;
      a {
        text-decoration: none;
        color: var(--foreground);
        transition: all 0.3s ease-in-out;
        &:hover {
          color: var(--theme);
          opacity: 0.7;
        }
      }
    }
    nav {
      ul {
        display: flex;
        list-style: none;
        li {
          margin: auto 6px;
        }
      }
    }
  }
</style>
