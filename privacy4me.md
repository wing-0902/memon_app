# Git Privacy

## プロフィールの変更

```bash
git config user.name
git config user.email
git config --global user.name "Wing"
git config --global user.email "wing@me.wing.osaka"
```

## コミット履歴の書き換え

```bash
git filter-branch -f --env-filter '
# 条件なしで現在のセッションのAuthorとCommitterを強制上書き
export GIT_AUTHOR_NAME="Wing"
export GIT_AUTHOR_EMAIL="wing@me.wing.osaka"
export GIT_COMMITTER_NAME="Wing"
export GIT_COMMITTER_EMAIL="wing@me.wing.osaka"
' --tag-name-filter cat -- --branches --tags
```

## 強制プッシュ

```bash
git push -f origin main
```

## メールアドレスをリスト表示

```
git log --format='%aE' | sort -u
```