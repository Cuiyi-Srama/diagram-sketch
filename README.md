# diagram-sketch（示意图绘制）

为 Operit 打造的示意图工具包：让 AI 在对话中直接绘制 **结构图 / 实验示意图 / 电路图**，输出 PNG 并在对话内即时显示。

> 区别于纯生图：本包走“**代码即图纸**”路线——结构图、装置图、电路图由结构化源码（DOT / SVG / schemdraw）渲染，线条、文字、符号精确可控，适合讲解与教学场景。

## 功能

| 工具 | 引擎 | 适用场景 |
|---|---|---|
| `render_dot` | Graphviz | 结构图、流程图、关系图、层级图（自动布局） |
| `render_svg` | librsvg | 实验装置图、几何图形、光路图、结构分解图（自由摆放） |
| `render_circuit` | schemdraw | 电路、电学实验（标准电路符号） |

## 效果预览

| 结构图 | 实验示意图 | 电路图 |
|---|---|---|
| ![结构图](docs/screenshots/fanyi_steps.png) | ![示意图](docs/screenshots/lever.png) | ![电路图](docs/screenshots/ohms_circuit.png) |

## 安装

### 1. 系统依赖

```bash
apt-get install -y graphviz librsvg2-bin
pip install schemdraw
```

### 2. 部署文件

1. 将 `diagram-sketch-v0.1.0.js` 导入 Operit（沙盒包）
2. 将 `tools/ds_circuit_core.py` 放到应用数据区：
   `/data/data/com.ai.assistance.operit/files/tools/ds_circuit_core.py`
   并复制一份 `ds_circuit_core.bak.py` 作为自愈备份
3. 在 Operit 中启用包并重载

> 电路引擎的 Python 解释器路径写在包源码常量 `DS_PY` 中，请按自己的环境调整（默认指向一个装有 schemdraw 的 venv Python）。

## 使用

对话中直接说需求即可，AI 会自动选择工具并生成图片：

- 「画一个科举流程图」→ `render_dot`
- 「画一个光的反射示意图」→ `render_svg`
- 「画一个串联电路图」→ `render_circuit`

## 工程细节

- 输出目录：应用内部数据区 `Diagrams/`（防误删、随应用数据备份、对话内秒显）
- 执行通道：`hiddenExec` 自持 executorKey + 自愈重试（防死会话）
- 结构图/示意图走命令行渲染（dot / rsvg-convert）；电路图走外置 Python 引擎（schemdraw）
- 中文渲染：依赖系统 Noto Sans CJK 字体

## License

MIT
