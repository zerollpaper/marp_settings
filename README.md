# Marp Seminar Template

Markdownで研究室ゼミ・論文紹介のスライドを作るためのテンプレートです。
[Marp](https://marp.app/) を使い、全発表の見た目を共通テーマ `themes/seminar.css` で揃えます。
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
git clone https://github.com/zerollpaper/marp_settings.git marp
cd marp
npm install
```

`npm install` で、このフォルダ専用のMarp CLIが入ります。以降は `npx marp ...` で使えます。
バージョンは固定しておらず、常に最新版が入ります。あとから最新版に更新したいときは `npm install @marp-team/marp-cli@latest` を実行してください。
どこでも `marp` と打ちたい場合は、代わりにグローバルに入れても構いません（以下、`marp` と書いたところは `npx marp` と読み替えてください）。

```sh
npm install -g @marp-team/marp-cli   # または macOS なら brew install marp-cli
marp --version
```

### 1-3. VS Codeで開く

VS Codeで `marp` フォルダ（または発表フォルダ）を開きます。
「このフォルダの作成者を信頼しますか？」と聞かれたら **信頼する** を選んでください。
信頼しないと、共通テーマやHTML（2段組など）がプレビューに反映されません。

`templates/slide.md` を開き、右上のプレビューボタン（虫眼鏡付きの分割アイコン）でスライドが表示されれば準備完了です。

---

## 2. 新しい発表を始める

```sh
node scripts/new-project.cjs seminar_2027_ss
# または npm run new -- seminar_2027_ss
```

`talks/seminar_2027_ss/` に `slide.md`（`templates/slide.md` のコピー）、`figure/`、CLIとVS Codeの設定が作られます。
`slide.md` は全レイアウトの見本を兼ねているので、使わないページは消して書き換えてください。既存のフォルダは上書きしません。
空フォルダを手で作ると設定が揃わないので、必ずこのスクリプトを使ってください（AIにもそう指示してあります）。

AIに頼む場合の例：

> `AGENTS.md` を読んで、`seminar_2027_ss` という新しい発表フォルダを作って。
> 共通テーマを使い、英語スライド・英語原稿・日本語ノートで準備して。

### 自分の名前・研究室を毎回入れたくない

`talks/template.md` に自分用のひな形（名前・研究室入り、不要な見本ページを削ったものなど）を置いておくと、
以降の新規作成ではそちらが使われます（`talks/` は公開されないので個人情報を書いても大丈夫です）。

### `talks/` について

`talks/` は `.gitignore` で除外してあるので、このリポジトリを更新・公開しても自分の発表は混ざりません。
発表もgitで管理したい場合は、`talks/` の中で別に `git init` して、**非公開リポジトリ**として push してください。

```text
marp/            このリポジトリ（テーマ・設定・スクリプト）
└── talks/       自分の発表（ここだけ別の非公開リポジトリにできる）
```

テンプレート側の更新は `marp/` で `git pull` するだけで取り込めます。

---

## 3. 原稿を編集する

発表フォルダの `slide.md` を編集します。

- `slide.md`：スライド本文と、コメント内の原稿・ノート
- `figure/`：画像。原稿から `figure/画像名.png` で参照
- `figure/README.md`：各画像の出典（論文・ページ・図番号）と使っているスライドのメモ
- 冒頭の `theme: seminar` で共通テーマを使用

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
cd talks/seminar_2027_ss
```

| やりたいこと | コマンド |
|---|---|
| 編集しながらプレビュー | `marp slide.md --preview --watch` |
| PDFを書き出す | `marp slide.md --pdf` |
| HTMLを書き出す | `marp slide.md -o slide.html` |
| PowerPointを書き出す | `marp slide.md --pptx` |

出力は同じフォルダに保存されます（`slide.pdf` など）。監視中のCLIは `Ctrl+C` で終了します。
**`--config-file` の指定は不要です。** VS Codeからは、コマンドパレットの「Marp: Export Slide Deck...」でも出力できます。

リポジトリ直下から実行する場合はパスを付けます：`marp talks/seminar_2027_ss/slide.md --pdf`

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

| 変更するもの | 編集する場所 |
|---|---|
| 発表内容・論文名・著者名 | 各発表の `slide.md` |
| 全発表共通の文字・色・配置 | `themes/seminar.css` |
| 新しい発表の初期原稿・見本 | `templates/slide.md`（個人用は `talks/template.md`） |
| CLIの出力設定 | 直下の `marp.config.cjs` |

今回だけの例外が必要なときは、発表フォルダに `theme.css` を追加します。
固有のテーマ名（`/* @theme my-talk */`）を付けて `@import "seminar";` し、原稿の `theme:` と、直下・発表フォルダ両方の `.vscode/settings.json` に登録します。
CLIは `talks/*/theme.css` を自動で登録します。

---

## 7. フォルダ構成と設定ファイルの仕組み

```text
marp/
├── README.md                  この説明
├── AGENTS.md                  AI向けの作業ルール（本体）
├── CLAUDE.md                  Claude Code用（中身は @AGENTS.md の1行）
├── package.json               npm install で Marp CLI を入れる
├── marp.config.cjs            CLI設定の本体（ここだけで管理）
├── .vscode/settings.json      直下を開いたときのテーマ登録
├── themes/seminar.css         全発表共通の見た目
├── templates/                 新しい発表のひな形（全レイアウトの見本を兼ねる）
│   ├── slide.md
│   └── figure/                見本で使う画像と出典メモ
├── scripts/new-project.cjs    発表フォルダの作成
└── talks/                     自分の発表（git管理外）
    └── seminar_2027_ss/
        ├── slide.md               発表内容・原稿・ノート
        ├── figure/                画像（＋出典メモ README.md）
        ├── marp.config.cjs        直下の設定を読み込むだけ
        └── .vscode/settings.json  発表フォルダだけを開いたときのテーマ登録
```

発表フォルダの `marp.config.cjs` は次の1行だけです。

```js
module.exports = require('../../marp.config.cjs');
```

Marp CLIは親フォルダの設定を自動では探さないため、この参照ファイルを置くことで、
発表フォルダ内で普通に `marp slide.md` と打てるようにしています。設定内容は直下に集約されているので二重管理にはなりません。

VS Code側も同様で、直下を開いても発表フォルダだけを開いてもテーマが効くよう、両方に `.vscode/settings.json` があります。
どちらも新規作成スクリプトが自動で用意するので、普段は触りません。

### AI向けルール（AGENTS.md と CLAUDE.md）

ルールの本体は `AGENTS.md` だけです。Codexなどは `AGENTS.md` を、Claude Codeは `CLAUDE.md` を読みます。
`CLAUDE.md` の中身は `@AGENTS.md`（＝AGENTS.mdを読み込む指示）の1行なので、ルールを直すときは `AGENTS.md` だけを編集します。
`talks/` に自分専用の `AGENTS.md` / `CLAUDE.md` を置けば、そのフォルダで作業するときだけ追加ルールが効きます。
ルールファイルを自動で読まないAI（チャット画面など）には、`AGENTS.md` の場所を伝えてください。

---

## 8. 表示がおかしいとき

- **テーマが効かない（VS Code）**：フォルダを「信頼」したか、開いているフォルダの `.vscode/settings.json` にテーマが登録されているか確認。
- **2段組などのHTMLが崩れる**：`markdown.marp.html` が `all` になっているか、HTMLとMarkdownの間に空行があるか確認。
- **テーマが効かない（CLI）**：発表フォルダに `marp.config.cjs` があり、`../../marp.config.cjs` を参照しているか確認。
- **原稿**：冒頭が `marp: true`、`theme: seminar` になっているか確認。
- **PDF出力でブラウザが見つからない**：Chrome / Edge / Firefox のいずれかを入れる。
- **フォント**：macOSはSF Pro／ヒラギノ、WindowsはSegoe UI／游ゴシック／メイリオで表示されます。

## License

[MIT](LICENSE)
