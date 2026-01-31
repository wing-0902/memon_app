<script lang="ts">
  import { wordStore } from '$lib/data/words.svelte';

  let fileName = $state('ファイル未選択');

  async function handleFileImport(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const reader = new FileReader();

    fileName = file.name;

    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        if (!Array.isArray(parsed)) {
          throw new Error('Invalid Syntax.');
        }

        const result = await wordStore.importData(parsed);
        alert(
          `${result.success}件のインポートに成功しました。${result.failed > 0 ? `\n※不備のあるデータ${result.failed}件をスキップしました。` : ''}`
        );

        // inputをリセット（同じファイルを再度選べるように）
        input.value = '';
      } catch (err) {
        console.error('インポート失敗：', err);
        alert('ファイルの読み込みに失敗しました．正しい形式のファイルか確認してください．');
      }
    };

    reader.readAsText(file);
  }
</script>

<svelte:head>
  <title>インポート | Memon</title>
</svelte:head>

<div class='root'>
  <label>
    クリックしてインポート（.memondoc）
    <input type="file" accept=".memondoc,application/json" onchange={handleFileImport} /><br/>
    <span class='fileName'>{fileName}</span>
  </label>
</div>

<style lang='scss'>
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
