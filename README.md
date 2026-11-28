# Marp Seminar Template

Markdownで研究室ゼミ・論文紹介のスライドを作るためのテンプレートです。
[Marp](https://marp.app/) を使い、全発表の見た目を共通テーマ `themes/seminar.css` で揃えます。
このリポジトリには共通のテーマ・ひな形・スクリプトだけを置き、発表は自分のフォルダ（研究プロジェクトやゼミの発表をまとめたフォルダ）に作ります。
発表ごとにフォルダを分け、`slide.md`（本文＋原稿＋メモ）と `figure/`（画像）だけを編集すれば済むようにしてあります。
AIエージェント（Claude Code、Codexなど）に編集を任せるためのルール `AGENTS.md` も同梱しています。

見本は [`templates/slide.md`](templates/slide.md) です。新しい発表を作るとこのファイルがひな形としてコピーされます。

---

## 0. Marpとは

Markdownファイルを、そのままスライド（PDF・HTML・PowerPoint）に変換するツールです。

- ページ区切りは単独行の `---`
- 見た目はCSSのテーマで指定（このテンプレートでは `theme: seminar`）
- `<!-- ... -->` のコメントは発表者ノートになり、スライドには表示されない

使い方は2通りあり、両方入れておくのがおすすめです。

| 道具 | 用途 |
|---|---|
| **Marp for VS Code**（VS Code拡張） | 編集しながら横でプレビュー。ここからPDF出力も可能 |
| **Marp CLI**（コマンド） | ターミナルからPDF・HTML出力、ブラウザでライブプレビュー |

## 1. 導入

### 1-1. 必要なもの

1. **[VS Code](https://code.visualstudio.com/)**
2. VS Code拡張 **Marp for VS Code**（拡張機能タブで「Marp」と検索、発行元 *Marp team*）
3. **[Node.js](https://nodejs.org/)**（LTS版）… Marp CLIと新規作成スクリプトに使用
   - macOS：公式インストーラ、または `brew install node`
   - Windows：公式インストーラ、または `winget install OpenJS.NodeJS.LTS`
   - 確認：`node --version`
4. **Google Chrome / Microsoft Edge / Firefox のいずれか** … PDF出力に使われます（普段使いのもので可）

### 1-2. このリポジトリを取得してMarp CLIを入れる

```sh
git clone https://github.com/zerollpaper/marp-settings.git
cd marp-settings
npm install
```

`npm install` で、このリポジトリ専用のMarp CLI（`node_modules/.bin/marp`）と、新規作成スクリプトが使う部品が入ります。
バージョンは固定しておらず、常に最新版が入ります。あとから最新版に更新したいときは `npm install @marp-team/marp-cli@latest` を実行してください。
どこでも `marp` と打ちたい場合は、グローバルにも入れておくと便利です（以下、`marp` と書いたところは、入れていなければ `/path/to/marp-settings/node_modules/.bin/marp` と読み替えてください）。

```sh
npm install -g @marp-team/marp-cli   # または macOS なら brew install marp-cli
marp --version
```

以下、このリポジトリを取得した場所を `/path/to/marp-settings` と書きます。

---

## 2. 新しい発表を始める

発表はこのリポジトリの外に作ります。作る場所に合わせて2通りあります。どちらも既存の発表は上書きせず、このリポジトリの中には作りません。
空フォルダを手で作ると設定が揃わないので、必ずこのスクリプトを使ってください（AIにもそう指示してあります）。

### 研究プロジェクトの中に作る（`--workspace`）

研究プロジェクトのルートをカレントディレクトリにして、`--workspace .` を付けて実行します。研究側に npm パッケージを入れる必要はありません。

```sh
node /path/to/marp-settings/scripts/new-project.cjs convergence --workspace .
cd slides/convergence
marp slide.md --pdf
```

`slides/convergence/` に、`slide.md`（`templates/slide.md` のコピー）、`figure/`、CLIとVS Codeの設定が作られます。
`slide.md` は全レイアウトの見本を兼ねているので、使わないページは消して書き換えてください。

### 発表だけを並べるフォルダに作る（`--flat`）

ゼミの連続発表のように、発表だけを並べるフォルダに作る場合は `--flat` を付けます。`slides/` を挟まずに `<フォルダ>/<発表名>/` に作ります。

```sh
# 発表を並べるフォルダをカレントディレクトリにして実行
node /path/to/marp-settings/scripts/new-project.cjs seminar-2027-ss --workspace . --flat
```

そのフォルダに `template.md` を置いておくと、ひな形としてそちらが使われます（自分の名前・研究室入り、不要な見本ページを削ったものなど）。
このフォルダごと別の非公開リポジトリにしておけば、発表も git で管理できます。

```text
marp-settings/      このリポジトリ（テーマ・ひな形・スクリプト。公開）
seminar/            自分の発表を並べるフォルダ（非公開リポジトリにできる）
├── template.md     自分用のひな形（任意）
└── seminar-2027-ss/
```

テンプレート側の更新は `marp-settings/` で `git pull` するだけで取り込めます。

AIに頼む場合の例：

> `/path/to/marp-settings/AGENTS.md` を読んで、このフォルダに `seminar-2027-ss` という新しい発表を `--flat` で作って。
> 共通テーマを使い、英語スライド・英語原稿・日本語ノートで準備して。

### VS Code で開く

VS Code で研究プロジェクト（発表を並べるフォルダ）か発表フォルダを開き、`slide.md` を開いて、コマンドパレットから **Markdown: プレビューを横に表示** を選びます。Markdown Preview Enhanced を併用している環境でもこのコマンドで Marp が動きます。
「このフォルダの作成者を信頼しますか？」と聞かれたら **信頼する** を選んでください。信頼しないと、共通テーマやHTML（2段組など）がプレビューに反映されません。

拡張は開いたフォルダの中のテーマしか読めないので、スクリプトは発表フォルダとその親（研究プロジェクト・発表を並べるフォルダ）の両方に、共通テーマへのシンボリックリンク `.vscode/seminar.css` を作り、`.vscode/settings.json` に登録します。親の既存の設定・ほかのテーマ・コメントは保持し、HTML の設定は共通レイアウト用の `all` にします。Windows ではファイルのシンボリックリンクを作れる環境が必要です。
後からこのリポジトリや発表の場所を移した場合は、発表の `marp.config.cjs` の参照先と、`.vscode/seminar.css` のリンク先を直してください。

---

## 3. 原稿を編集する

発表フォルダの `slide.md` を編集します。

- `slide.md`：スライド本文と、コメント内の原稿・ノート
- `figure/`：画像。原稿から `figure/画像名.png` で参照
- `figure/README.md`：各画像の出典（論文・ページ・図番号）と使っているスライドのメモ
- 冒頭の `theme: seminar` で共通テーマを使用
- 日本語の発表では冒頭の設定に `lang: ja` を追加します。日本語用の禁則処理と見出しの行間が適用されます。

```md
# Slide title

- Main point

<div class="source">[1] §2, Theorem 1</div>

<!--
English script:
...
Japanese notes:
...
-->
```

## 4. プレビュー・PDF出力

ターミナルで発表フォルダに移動して実行します。

```sh
cd slides/convergence
```

| やりたいこと | コマンド |
|---|---|
| 編集しながらプレビュー | `marp slide.md --preview --watch` |
| PDFを書き出す | `marp slide.md --pdf` |
| HTMLを書き出す | `marp slide.md -o slide.html` |
| PowerPointを書き出す | `marp slide.md --pptx` |

出力は同じフォルダに保存されます（`slide.pdf` など）。監視中のCLIは `Ctrl+C` で終了します。
**`--config-file` の指定は不要です。** VS Codeからは、コマンドパレットの「Marp: Export Slide Deck...」でも出力できます。

---

## 5. よく使うレイアウト

`<!-- _class: クラス名 -->` をページ内に書くと、そのページだけに適用されます。

| クラス | 用途 |
|---|---|
| `title cover` | 白背景の表紙 |
| `section` | 章扉 |
| `no-header` | 上部ヘッダーなし |
| `small-text` | 文字を小さくする |
| `refs` | Referencesページ |

2段組の例です。**HTMLとMarkdownの間に空行を入れます。**

```md
<div class="two-col-block left-40 gap-small"><div>

左側の内容

</div><div>

右側の内容

</div></div>
```

- 左列の割合：指定なしで50%、`left-40` `left-45` `left-55` `left-60` `left-65` `left-70`
- 列の間隔：標準48px、`gap-small` で28px、`gap-large` で72px
- 出典：`<div class="source">[1] §2</div>` で右下に表示
- 表紙の論文カード（`paper-card`）の書き方は `templates/slide.md` を参照

## 6. 見た目を変える場所

見た目の決まり（色の役割、文字の大きさ、強調の4種類と1枚に使える数）は [`DESIGN.md`](DESIGN.md) にまとめてあります。強調は `<span class="accent">`（青い文字）、`<div class="box">`（囲み枠）、`<div class="panel">`（淡い背景）で書きます。

| 変更するもの | 編集する場所 |
|---|---|
| 発表内容・論文名・著者名 | 各発表の `slide.md` |
| 全発表共通の文字・色・配置 | `themes/seminar.css` |
| 新しい発表の初期原稿・見本 | `templates/slide.md`（`--flat` では発表を並べるフォルダの `template.md` も使える） |
| CLIの出力設定 | このリポジトリの `marp.config.cjs` |

その発表だけの見た目が必要なときは、発表フォルダに `theme.css` を追加します。
固有のテーマ名（`/* @theme my-talk */`）を付けて `@import "seminar";` し、原稿の `theme:` で選び、VS Code 用に発表フォルダの `.vscode/settings.json` にも登録します。CLI は発表フォルダの `theme.css` を自動で登録します。
1枚だけの調整は、原稿にそのページだけに効く `<style scoped>` を数行まで書けます。原稿の先頭の `style:` や、scoped でない `<style>` は使わないでください（見た目が原稿のあちこちに散らばるため）。

---

## 7. フォルダ構成と設定ファイルの仕組み

```text
marp-settings/
├── README.md                  この説明
├── AGENTS.md                  AI向けの作業ルール（本体）
├── CLAUDE.md                  Claude Code用（中身は @AGENTS.md の1行）
├── package.json               npm install で Marp CLI を入れる
├── DESIGN.md                  見た目の決まり（テーマはこれを形にしたもの）
├── marp.config.cjs            CLI設定の本体（ここだけで管理）
├── themes/seminar.css         全発表共通の見た目
├── templates/                 新しい発表のひな形（全レイアウトの見本を兼ねる）
│   ├── slide.md
│   └── figure/                見本で使う画像と出典メモ
└── scripts/
    ├── new-project.cjs        発表フォルダの作成
    └── workspace-settings.cjs 親フォルダの VS Code の設定にテーマを登録する

研究プロジェクト/
├── .vscode/                   テーマへのリンクと登録（スクリプトが作る）
└── slides/convergence/
    ├── slide.md               発表内容・原稿・ノート
    ├── figure/                画像（＋出典メモ README.md）
    ├── marp.config.cjs        共通の設定を読み込むだけ
    └── .vscode/               発表フォルダだけを開いたときのテーマのリンクと登録
```

発表の `marp.config.cjs` は、スクリプトが参照先を計算して作ります。例：

```js
module.exports = require("../../../marp-settings/marp.config.cjs").forDeck(__dirname);
```

Marp CLIは親フォルダの設定を自動では探さないため、この参照ファイルを置くことで、
発表フォルダ内で普通に `marp slide.md` と打てるようにしています。設定内容はこのリポジトリに集約されているので二重管理にはなりません。
`forDeck` は、発表フォルダに `theme.css` があればそれもテーマとして登録します。

### AI向けルール（AGENTS.md と CLAUDE.md）

ルールの本体は `AGENTS.md` だけです。Codexなどは `AGENTS.md` を、Claude Codeは `CLAUDE.md` を読みます。
`CLAUDE.md` の中身は `@AGENTS.md`（＝AGENTS.mdを読み込む指示）の1行なので、ルールを直すときは `AGENTS.md` だけを編集します。
発表を置くフォルダに自分専用の `AGENTS.md` / `CLAUDE.md` を置けば、そこで作業するときだけ追加ルールが効きます。
ルールファイルを自動で読まないAI（チャット画面など）には、`AGENTS.md` の場所を伝えてください。

---

## 8. 表示がおかしいとき

- **テーマが効かない（VS Code）**：フォルダを「信頼」したか、開いているフォルダの `.vscode/settings.json` にテーマが登録され、`.vscode/seminar.css` のリンクが切れていないか確認。
- **2段組などのHTMLが崩れる**：`markdown.marp.html` が `all` になっているか、HTMLとMarkdownの間に空行があるか確認。
- **テーマが効かない（CLI）**：発表フォルダに `marp.config.cjs` があり、このリポジトリの `marp.config.cjs` を参照しているか確認。
- **原稿**：冒頭が `marp: true`、`theme: seminar` になっているか確認。
- **PDF出力でブラウザが見つからない**：Chrome / Edge / Firefox のいずれかを入れる。
- **フォント**：macOSはSF Pro／ヒラギノ、WindowsはSegoe UI／游ゴシック／メイリオで表示されます。

## License

[MIT](LICENSE)
