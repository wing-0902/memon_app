<script lang="ts">
  import { wordStore } from '$lib/data/words.svelte';
  import { itemStore } from '$lib/data/list.svelte';
  import { goto } from '$app/navigation';

  let vFileName = $state('ファイル未選択');

  async function handleFileImport(event: Event) {
    // 1. event.currentTarget を HTMLInputElement 型として取得
    const input = event.currentTarget as HTMLInputElement;

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    vFileName = file.name; // 表示用変数を更新
    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        if (!Array.isArray(parsed)) throw new Error('Invalid format');

        // 2. itemStore に追加して ID を取得
        const newDeckId = itemStore.addItem(fileNameWithoutExt);

        // 3. wordStore にデータを流し込んで保存
        const result = await wordStore.importAsNewDeck(parsed, newDeckId);

        alert(
          `「${fileNameWithoutExt}」を新しい単語帳として作成し，${result.success}件インポートしました．`
        );

        // 4. inputをクリア（同じファイルを再度選択できるようにする）
        input.value = '';
        vFileName = 'ファイル未選択';

        // 5. ホームに戻ろうじゃないか
        goto('/');
      } catch (err) {
        console.error(err);
        alert('インポートに失敗しました．');
      }
    };
    reader.readAsText(file);
  }
</script>

<svelte:head>
  <title>インポート | Memon</title>
</svelte:head>

<div class="root">
  <label class="import-label">
    クリックしてインポート（.memondoc）
    <input type="file" accept=".memondoc" onchange={handleFileImport} /><br />
    <span class="fileName">{vFileName}</span>
  </label>
</div>

<style lang="scss">
  .root {
    width: 100%;
    label {
      display: flex;
      width: 100%;
      flex-direction: column;
      align-items: center;
      font-size: 17px;
      input {
        display: none;
      }
      span.fileName {
        font-family: 'Zen Maru Gothic', sans-serif;
        font-size: 21px;
        margin-top: 13px;
      }
    }
  }
</style>
