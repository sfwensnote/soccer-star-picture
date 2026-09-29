# 球场人格｜你是哪位足球明星？

一个纯前端中文足球人格测试。用户回答 12 道球场情境题，页面在浏览器内计算其在读局、担当、创造、协作、韧性、专注六个维度上的得分，并从 24 位现役球星与传奇球员中给出最接近的人格匹配。

## 功能

- 12 道原创情境题，六个维度各两题，包含答题进度、返回修改和重新测试。
- 24 位男球员：12 位现役球星与 12 位传奇球员。
- 结果包括人格描述、契合度、六维画像和相近匹配。
- 支持系统分享或复制分享文案；不会收集姓名、答案或测试记录。
- 自适应手机与桌面布局，支持键盘焦点和减少动态效果设置。

## 纯前端与隐私

没有服务端、账户、分析脚本、表单或持久化存储。答案和匹配计算都在当前页面内存中完成；退出或刷新后作答即消失。结果页可通过系统分享面板主动分享。图片由指定图片库或 Wikimedia Commons 提供，因此浏览器会向对应图片站点请求图片。

## 运行

双击 `index.html` 可预览。需要本地 HTTP 服务时，在项目目录运行：

```sh
python3 -m http.server 8000
```

然后打开 <http://localhost:8000>。

## 图片库

优先从 [soccer-star-picture](https://github.com/sfwensnote/soccer-star-picture) 读取图片，文件路径约定为 `players/<球员代号>.jpg`；例如 `players/messi.jpg`、`players/de-bruyne.jpg`。当前该仓库没有图片文件，所以未提供的球员会回退到代码中记录并标注来源的 Wikimedia Commons 图片。完整署名见 [CREDITS.md](CREDITS.md)。

添加图库照片时，优先选用你拥有使用权的图片；上传后可逐步替换各球员的 Commons 兜底来源。

## 部署

`.github/workflows/pages.yml` 会在 `main` 更新后通过 GitHub Pages 发布静态文件。Pages URL 为：<https://sfwensnote.github.io/soccer-star-picture/>。

球员特点和匹配分数是娱乐性创作，不是对球员或答题者的专业评价。调整阵容、题目或得分时，编辑 `data.js` 即可。
