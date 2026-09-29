# 球场人格｜你是哪位足球明星？

一个纯前端中文测试。用户回答 12 道日常生活情境题，页面在浏览器内计算判断、担当、变通、协作、受挫恢复和专注六项得分，再从 32 位男足球星中找出最接近的比赛风格。

## 功能

- 12 道日常情境题，六项各两题；题目涉及工作、出游、做饭、考试、搬家和注意力管理。
- 32 位男球员：16 位现役球星与 16 位传奇球员。
- 结果列出相似球员、六项得分和你在题目中的明显倾向。
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

匹配分数只按六项答题结果估算，供娱乐参考，不代表对球员或答题者的专业评价。调整阵容、题目或得分时，编辑 `data.js` 即可。
