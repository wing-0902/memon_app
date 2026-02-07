<script lang="ts">
  let { checked = $bindable(false), aria_label = 'トグルを切り替え' } = $props();
</script>

<button
  class="button"
  class:valid={checked}
  aria-label={aria_label}
  aria-pressed={checked}
  onclick={() => (checked = !checked)}
>
  <div class="circle"></div>
</button>

<style lang="scss">
  .button {
    height: 30px;
    width: 66px;
    border-radius: 15px;
    background-color: gray;
    border: none;
    position: relative;
    cursor: pointer;
    padding: 0;
    transition: background-color 0.3s ease;

    .circle {
      position: absolute;
      top: 0;
      left: 0;
      height: 28px;
      width: 43px;
      border-radius: 15px;
      background-color: white;
      border: 1px solid gray;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &.valid {
      background-color: var(--theme, skyblue);
      .circle {
        transform: translateX(21px);
        border-color: var(--theme);
      }
    }
  }
</style>
