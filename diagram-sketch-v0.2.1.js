/*
METADATA
{
  "name": "diagram_sketch",
  "display_name": { "zh": "示意图绘制", "en": "Diagram Sketch" },
  "description": {
    "zh": "绘制示意图：结构/流程图（Graphviz DOT）、实验/自由示意图（SVG）、电路图（schemdraw）、3D 曲面/几何（matplotlib 3D）。单文件自包含（引擎内嵌，首次调用自动落盘），输出 PNG 到应用内部数据区 Diagrams，返回可直接在对话中显示的图片标记。",
    "en": "Draw diagrams via Graphviz DOT, SVG, schemdraw, or 3D surfaces. Self-contained single file. Outputs PNG into app internal Diagrams folder and returns inline-displayable markdown."
  },
  "category": "Utility",
  "tools": [
    {
      "name": "render_dot",
      "description": { "zh": "用 Graphviz DOT 语言绘制结构图 / 流程图 / 关系图 / 层级图（自动布局），返回可在对话中直接显示的图片标记。适用：知识结构、流程步骤、分类关系、组织层级。（依赖：graphviz）", "en": "Render Graphviz DOT to PNG (auto layout)." },
      "parameters": [
        { "name": "dot", "description": { "zh": "DOT 源码。示例：digraph G { rankdir=LR; A [label=\"起点\"]; B [label=\"终点\"]; A->B; }。教学风建议样式：node [shape=box, style=\"rounded,filled\", fillcolor=\"#eaf2fb\", color=\"#3a76b5\", fontname=\"Noto Sans CJK SC\", fontcolor=\"#1c3d5a\"]。", "en": "DOT source code." }, "type": "string", "required": true },
        { "name": "filename", "description": { "zh": "文件名前缀（可选，英文），默认 dot 加时间戳", "en": "Filename prefix (optional)." }, "type": "string", "required": false },
        { "name": "dpi", "description": { "zh": "输出精度，默认 150", "en": "DPI, default 150." }, "type": "number", "required": false }
      ]
    },
    {
      "name": "render_svg",
      "description": { "zh": "用 SVG 源码绘制任意示意图（实验装置图、几何图形、光路图、结构分解图等，自由摆放），返回可在对话中直接显示的图片标记。（依赖：librsvg2-bin 的 rsvg-convert）", "en": "Render SVG source to PNG." },
      "parameters": [
        { "name": "svg", "description": { "zh": "SVG 源码（需含 width/height，建议宽 800~1000）。中文用 font-family=\"Noto Sans CJK SC\"；箭头用 marker；线条用 line/path，图形用 rect/circle/polygon。", "en": "SVG source code." }, "type": "string", "required": true },
        { "name": "filename", "description": { "zh": "文件名前缀（可选，英文）", "en": "Filename prefix (optional)." }, "type": "string", "required": false }
      ]
    },
    {
      "name": "render_circuit",
      "description": { "zh": "用 schemdraw 绘制电路图（标准电路符号），返回可在对话中直接显示的图片标记。适用：电路、电学实验装置。（依赖：Python3 + schemdraw + matplotlib；引擎源码内嵌，首次调用自动落盘）", "en": "Render electrical circuit via schemdraw." },
      "parameters": [
        { "name": "code", "description": { "zh": "schemdraw 语句体（将在 with schemdraw.Drawing() as d: 内执行，可用 elm 与 d）。常用元件：elm.Battery() 电池、elm.Resistor() 电阻、elm.Lamp() 灯泡、elm.Switch() 开关、elm.Capacitor() 电容、elm.Inductor() 电感、elm.MeterV() 电压表、elm.MeterA() 电流表、elm.Ground() 接地、elm.Line() 导线、elm.Dot() 节点。示例：d += elm.Battery().up().label(\"1.5V\"); d += elm.Switch().right().label(\"开关\"); d += elm.Lamp().down(); d += elm.Line().left()", "en": "schemdraw body code." }, "type": "string", "required": true },
        { "name": "filename", "description": { "zh": "文件名前缀（可选，英文）", "en": "Filename prefix (optional)." }, "type": "string", "required": false },
        { "name": "dpi", "description": { "zh": "输出精度，默认 150", "en": "DPI, default 150." }, "type": "number", "required": false }
      ]
    },
    {
      "name": "render_3d",
      "description": { "zh": "绘制 3D 曲面 / 几何图形（z=f(x,y) 曲面，或参数曲面如球面/环面/柱面），返回可在对话中直接显示的图片标记。适用：立体几何、多元函数、数学建模可视化。（依赖：Python3 + matplotlib；引擎源码内嵌，首次调用自动落盘）", "en": "Render 3D surface/geometry to PNG." },
      "parameters": [
        { "name": "mode", "description": { "zh": "模式：surface（z=f(x,y) 曲面，默认）或 param（参数曲面，x/y/z 由 u,v 表达）", "en": "mode: surface | param (default surface)." }, "type": "string", "required": false },
        { "name": "z", "description": { "zh": "surface 模式：z 的表达式（含 x,y），如 sin(sqrt(x^2+y^2))；param 模式：z(u,v) 表达式，如 cos(u)。幂用 ^。", "en": "z expression." }, "type": "string", "required": true },
        { "name": "x", "description": { "zh": "param 模式：x(u,v) 表达式，如 sin(u)*cos(v)（默认球面参数式）", "en": "x(u,v) expression (param)." }, "type": "string", "required": false },
        { "name": "y", "description": { "zh": "param 模式：y(u,v) 表达式，如 sin(u)*sin(v)", "en": "y(u,v) expression (param)." }, "type": "string", "required": false },
        { "name": "x_range", "description": { "zh": "surface 模式：x 范围，如 \"-8,8\"（默认 -5,5）", "en": "x range like \"-8,8\"." }, "type": "string", "required": false },
        { "name": "y_range", "description": { "zh": "surface 模式：y 范围，如 \"-8,8\"（默认 -5,5）", "en": "y range." }, "type": "string", "required": false },
        { "name": "u_range", "description": { "zh": "param 模式：u 范围，如 \"0,pi\"（默认 0,pi）", "en": "u range like \"0,pi\"." }, "type": "string", "required": false },
        { "name": "v_range", "description": { "zh": "param 模式：v 范围，如 \"0,2*pi\"（默认 0,2*pi）", "en": "v range like \"0,2*pi\"." }, "type": "string", "required": false },
        { "name": "cmap", "description": { "zh": "色图：viridis/plasma/coolwarm/turbo 等（默认 viridis）", "en": "Colormap, default viridis." }, "type": "string", "required": false },
        { "name": "wire", "description": { "zh": "线框模式：\"true\"/\"false\"（默认 false 实体曲面）", "en": "Wireframe mode true/false." }, "type": "string", "required": false },
        { "name": "title", "description": { "zh": "图标题（支持中文）", "en": "Title (optional)." }, "type": "string", "required": false },
        { "name": "filename", "description": { "zh": "文件名前缀（可选，英文）", "en": "Filename prefix (optional)." }, "type": "string", "required": false },
        { "name": "dpi", "description": { "zh": "输出精度，默认 150", "en": "DPI, default 150." }, "type": "number", "required": false }
      ]
    }
  ]
}
*/
// diagram-sketch v0.2.1（2026-10-02）集成版 + 自包含：
//   四件套 render_dot / render_svg / render_circuit / render_3d
//   引擎源码内嵌（首次调用自动落盘到应用数据区 tools/），Python 解释器自动探测，依赖缺失友好提示
// v0.2.0：新增 render_3d（3D 曲面/几何）  v0.1.0/0.1.1：三件套 + 自包含改造
// 工程模式继承 function-plot v0.3.0：自持 executorKey + 自愈、单行命令、base64 传参、DS_ / RESULT_JSON 协议
// 部署：cp 到 packages 目录 -> set_sandbox_package_enabled(false->true) -> use_package 重载
"use strict";

// ---- 常量 ---------------------------------------------------------------

const DS_DOT_BIN = "/usr/bin/dot";
const DS_RSVG_BIN = "/usr/bin/rsvg-convert";
const DS_TOOLS_DIR = "/data/data/com.ai.assistance.operit/files/tools";
const DS_ENGINE = DS_TOOLS_DIR + "/ds_circuit_core.py";
const DS_ENGINE_BAK = DS_TOOLS_DIR + "/ds_circuit_core.bak.py";
const DS_3D_ENGINE = DS_TOOLS_DIR + "/ds_3d_core.py";
const DS_3D_ENGINE_BAK = DS_TOOLS_DIR + "/ds_3d_core.bak.py";
const DS_PY_VENV = "/root/.venvs/plotter/bin/python";
const DS_OUT_DIR = "/data/data/com.ai.assistance.operit/files/Diagrams";
const DS_TMP_DOT = "/tmp/ds_tmp.dot";
const DS_TMP_SVG = "/tmp/ds_tmp.svg";
const DS_CIRCUIT_CFG = "/tmp/ds_circuit_input.json";
const DS_3D_CFG = "/tmp/ds_3d_input.json";

// 引擎源码（base64；首次调用自动落盘，单文件自包含，无需外部依赖文件）
const DS_ENGINE_B64 = "IyAtKi0gY29kaW5nOiB1dGYtOCAtKi0KIiIiCmRzX2NpcmN1aXRfY29yZS5weSAtIOeUtei3r+Wbvua4suafk+W8leaTju+8iHNjaGVtZHJhd++8iQrljY/orq46IOivuyAvdG1wL2RzX2NpcmN1aXRfaW5wdXQuanNvbiB7Y29kZSxvdXQsZHBpfSAtPiBQTkcgLT4gUkVTVUxUX0pTT046e29rLHBhdGgsc2l6ZX0KY29kZTogc2NoZW1kcmF3IOivreWPpeS9k++8iOWcqCB3aXRoIHNjaGVtZHJhdy5EcmF3aW5nKCkgYXMgZDog5YaF5omn6KGM77yM5Y+v55SoIGVsbS4qIOS4jiBk77yJCiIiIgppbXBvcnQgb3MKaW1wb3J0IHN5cwppbXBvcnQganNvbgppbXBvcnQgdHJhY2ViYWNrCgppbXBvcnQgbWF0cGxvdGxpYgptYXRwbG90bGliLnVzZSgiQWdnIikKaW1wb3J0IG1hdHBsb3RsaWIucHlwbG90IGFzIHBsdApmcm9tIG1hdHBsb3RsaWIgaW1wb3J0IGZvbnRfbWFuYWdlcgpmcm9tIG1hdHBsb3RsaWIuZm9udF9tYW5hZ2VyIGltcG9ydCBGb250UHJvcGVydGllcwoKX2YgPSAiL3Vzci9zaGFyZS9mb250cy9vcGVudHlwZS9ub3RvL05vdG9TYW5zQ0pLLVJlZ3VsYXIudHRjIgppZiBvcy5wYXRoLmV4aXN0cyhfZik6CiAgICBmb250X21hbmFnZXIuZm9udE1hbmFnZXIuYWRkZm9udChfZikKICAgIHBsdC5yY1BhcmFtc1siZm9udC5zYW5zLXNlcmlmIl0gPSBbRm9udFByb3BlcnRpZXMoZm5hbWU9X2YpLmdldF9uYW1lKCldCnBsdC5yY1BhcmFtc1siYXhlcy51bmljb2RlX21pbnVzIl0gPSBGYWxzZQoKaW1wb3J0IHNjaGVtZHJhdwppbXBvcnQgc2NoZW1kcmF3LmVsZW1lbnRzIGFzIGVsbQoKQ0ZHID0gIi90bXAvZHNfY2lyY3VpdF9pbnB1dC5qc29uIgoKCmRlZiBvdXRfanNvbihvYmopOgogICAgcHJpbnQoIlJFU1VMVF9KU09OOiIgKyBqc29uLmR1bXBzKG9iaiwgZW5zdXJlX2FzY2lpPUZhbHNlKSkKCgpkZWYgbWFpbigpOgogICAgdHJ5OgogICAgICAgIHdpdGggb3BlbihDRkcsICJyIiwgZW5jb2Rpbmc9InV0Zi04IikgYXMgZmg6CiAgICAgICAgICAgIGNmZyA9IGpzb24ubG9hZChmaCkKICAgIGV4Y2VwdCBFeGNlcHRpb24gYXMgZToKICAgICAgICBvdXRfanNvbih7Im9rIjogRmFsc2UsICJzdGFnZSI6ICJpbnB1dCIsICJlcnJvciI6IHN0cihlKX0pCiAgICAgICAgcmV0dXJuCgogICAgY29kZSA9IHN0cihjZmcuZ2V0KCJjb2RlIiwgIiIpIG9yICIiKQogICAgb3V0ID0gc3RyKGNmZy5nZXQoIm91dCIsICIvZGF0YS9kYXRhL2NvbS5haS5hc3Npc3RhbmNlLm9wZXJpdC9maWxlcy9EaWFncmFtcy9jaXJjdWl0LnBuZyIpKQogICAgZHBpID0gaW50KGNmZy5nZXQoImRwaSIsIDE1MCkpCgogICAgaWYgbm90IGNvZGUuc3RyaXAoKToKICAgICAgICBvdXRfanNvbih7Im9rIjogRmFsc2UsICJzdGFnZSI6ICJpbnB1dCIsICJlcnJvciI6ICJjb2RlIOS4uuepuiJ9KQogICAgICAgIHJldHVybgoKICAgIHRyeToKICAgICAgICBvcy5tYWtlZGlycyhvcy5wYXRoLmRpcm5hbWUob3V0KSwgZXhpc3Rfb2s9VHJ1ZSkKICAgIGV4Y2VwdCBFeGNlcHRpb24gYXMgZToKICAgICAgICBvdXRfanNvbih7Im9rIjogRmFsc2UsICJzdGFnZSI6ICJta2RpciIsICJlcnJvciI6IHN0cihlKX0pCiAgICAgICAgcmV0dXJuCgogICAgdHJ5OgogICAgICAgIHdpdGggc2NoZW1kcmF3LkRyYXdpbmcoKSBhcyBkOgogICAgICAgICAgICBleGVjKGNvZGUsIHsiX19idWlsdGluc19fIjoge30sICJlbG0iOiBlbG0sICJkIjogZH0pCiAgICAgICAgZC5zYXZlKG91dCwgZHBpPWRwaSwgdHJhbnNwYXJlbnQ9RmFsc2UpCiAgICAgICAgaWYgbm90IG9zLnBhdGguZXhpc3RzKG91dCk6CiAgICAgICAgICAgIG91dF9qc29uKHsib2siOiBGYWxzZSwgInN0YWdlIjogInNhdmUiLCAiZXJyb3IiOiAi5paH5Lu25pyq55Sf5oiQIn0pCiAgICAgICAgICAgIHJldHVybgogICAgICAgIG91dF9qc29uKHsib2siOiBUcnVlLCAicGF0aCI6IG91dCwgInNpemUiOiBvcy5wYXRoLmdldHNpemUob3V0KX0pCiAgICBleGNlcHQgRXhjZXB0aW9uOgogICAgICAgIHRiID0gdHJhY2ViYWNrLmZvcm1hdF9leGMoKS5zcGxpdGxpbmVzKCkKICAgICAgICB0YWlsID0gIiB8ICIuam9pbih0YlstNDpdKQogICAgICAgIG91dF9qc29uKHsib2siOiBGYWxzZSwgInN0YWdlIjogInJlbmRlciIsICJlcnJvciI6IHRhaWx9KQoKCmlmIF9fbmFtZV9fID09ICJfX21haW5fXyI6CiAgICBtYWluKCk=";
const DS_3D_ENGINE_B64 = "IyAtKi0gY29kaW5nOiB1dGYtOCAtKi0KIiIiCmRzXzNkX2NvcmUucHkgLSAzRCDlh6DkvZUv5puy6Z2i5riy5p+T5byV5pOO77yIbWF0cGxvdGxpYiBtcGxvdDNk77yJCuWNj+iurjog6K+76YWN572uIEpTT07vvIjpu5jorqQgL3RtcC9kc18zZF9pbnB1dC5qc29u77yM5Y+v55SoIGFyZ3ZbMV0g5oyH5a6a77yJLT4gUE5HIC0+IFJFU1VMVF9KU09OOntvayxwYXRoLHNpemV9Cgptb2Rl77yI5Lik56eN77yJOgogICJzdXJmYWNlIjogeiA9IGYoeCwgeSnvvIzlj4LmlbAgeF9yYW5nZSAvIHlfcmFuZ2XvvIjpu5jorqQgWy01LDVd77yJCiAgInBhcmFtIiAgOiB4KHUsdiksIHkodSx2KSwgeih1LHYp77yM5Y+C5pWwIHVfcmFuZ2UgLyB2X3Jhbmdl77yI6buY6K6kIFswLHBpXSAvIFswLDJwaV3vvIkK5qC35byPOiBjbWFw77yI6Imy5Zu+77yM6buY6K6kIHZpcmlkaXPvvInjgIF3aXJl77yI57q/5qGG5qih5byP77yM6buY6K6kIGZhbHNl77yJ44CBdGl0bGXvvIjkuK3mlofmoIfpopjvvInjgIFkcGkKIiIiCmltcG9ydCBvcwppbXBvcnQgc3lzCmltcG9ydCBqc29uCgppbXBvcnQgbnVtcHkgYXMgbnAKaW1wb3J0IG1hdHBsb3RsaWIKbWF0cGxvdGxpYi51c2UoIkFnZyIpCmltcG9ydCBtYXRwbG90bGliLnB5cGxvdCBhcyBwbHQKZnJvbSBtYXRwbG90bGliIGltcG9ydCBmb250X21hbmFnZXIKZnJvbSBtYXRwbG90bGliLmZvbnRfbWFuYWdlciBpbXBvcnQgRm9udFByb3BlcnRpZXMKCl9mID0gIi91c3Ivc2hhcmUvZm9udHMvb3BlbnR5cGUvbm90by9Ob3RvU2Fuc0NKSy1SZWd1bGFyLnR0YyIKaWYgb3MucGF0aC5leGlzdHMoX2YpOgogICAgZm9udF9tYW5hZ2VyLmZvbnRNYW5hZ2VyLmFkZGZvbnQoX2YpCiAgICBwbHQucmNQYXJhbXNbImZvbnQuc2Fucy1zZXJpZiJdID0gW0ZvbnRQcm9wZXJ0aWVzKGZuYW1lPV9mKS5nZXRfbmFtZSgpXQpwbHQucmNQYXJhbXNbImF4ZXMudW5pY29kZV9taW51cyJdID0gRmFsc2UKCkNGRyA9IHN5cy5hcmd2WzFdIGlmIGxlbihzeXMuYXJndikgPiAxIGVsc2UgIi90bXAvZHNfM2RfaW5wdXQuanNvbiIKCgpkZWYgb3V0X2pzb24obyk6CiAgICBwcmludCgiUkVTVUxUX0pTT046IiArIGpzb24uZHVtcHMobywgZW5zdXJlX2FzY2lpPUZhbHNlKSkKCgpkZWYgdG92KHYsIGQpOgogICAgIiIi5pWw5YC85YyW77ya5o6l5Y+X5pWw5a2X5oiW5ZCrIHBpL2Ug55qE5a2X56ym5Liy6KGo6L6+5byPIiIiCiAgICB0cnk6CiAgICAgICAgaWYgaXNpbnN0YW5jZSh2LCBzdHIpOgogICAgICAgICAgICByZXR1cm4gZmxvYXQoZXZhbCh2LnJlcGxhY2UoInBpIiwgc3RyKG5wLnBpKSkucmVwbGFjZSgiZSIsIHN0cihucC5lKSksCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsiX19idWlsdGluc19fIjoge319LCB7fSkpCiAgICAgICAgcmV0dXJuIGZsb2F0KHYpCiAgICBleGNlcHQgRXhjZXB0aW9uOgogICAgICAgIHJldHVybiBkCgoKZGVmIHJuZyh2YWwsIGQwLCBkMSk6CiAgICBpZiBpc2luc3RhbmNlKHZhbCwgKGxpc3QsIHR1cGxlKSkgYW5kIGxlbih2YWwpID49IDI6CiAgICAgICAgcmV0dXJuIHRvdih2YWxbMF0sIGQwKSwgdG92KHZhbFsxXSwgZDEpCiAgICByZXR1cm4gZDAsIGQxCgoKZGVmIGNvbnYoZSk6CiAgICAiIiJeIC0+ICoqIO+8jOmakOW8j+S5mOazlSAzeCAvIDJzaW4oeCkgLyApKCAiIiIKICAgIGUgPSBzdHIoZSkucmVwbGFjZSgiXiIsICIqKiIpCiAgICBvdXQgPSBbXQogICAgcHJldiA9ICIiCiAgICBmb3IgY2ggaW4gZToKICAgICAgICBpZiBwcmV2IGFuZCAocHJldi5pc2RpZ2l0KCkgb3IgcHJldiA9PSAiKSIpIGFuZCAoY2guaXNhbHBoYSgpIG9yIGNoID09ICIoIik6CiAgICAgICAgICAgIG91dC5hcHBlbmQoIioiKQogICAgICAgIG91dC5hcHBlbmQoY2gpCiAgICAgICAgcHJldiA9IGNoCiAgICByZXR1cm4gIiIuam9pbihvdXQpCgoKRU5WID0gewogICAgInNpbiI6IG5wLnNpbiwgImNvcyI6IG5wLmNvcywgInRhbiI6IG5wLnRhbiwKICAgICJhc2luIjogbnAuYXJjc2luLCAiYWNvcyI6IG5wLmFyY2NvcywgImF0YW4iOiBucC5hcmN0YW4sCiAgICAiYXJjdGFuMiI6IG5wLmFyY3RhbjIsICJoeXBvdCI6IG5wLmh5cG90LAogICAgInNpbmgiOiBucC5zaW5oLCAiY29zaCI6IG5wLmNvc2gsICJ0YW5oIjogbnAudGFuaCwKICAgICJleHAiOiBucC5leHAsICJsb2ciOiBucC5sb2csICJsbiI6IG5wLmxvZywKICAgICJsb2cxMCI6IG5wLmxvZzEwLCAibG9nMiI6IG5wLmxvZzIsCiAgICAic3FydCI6IG5wLnNxcnQsICJjYnJ0IjogbnAuY2JydCwgImFicyI6IG5wLmFicywKICAgICJzaWduIjogbnAuc2lnbiwgImZsb29yIjogbnAuZmxvb3IsICJjZWlsIjogbnAuY2VpbCwgInJvdW5kIjogbnAucm91bmQsCiAgICAibWF4aW11bSI6IG5wLm1heGltdW0sICJtaW5pbXVtIjogbnAubWluaW11bSwgInBvd2VyIjogbnAucG93ZXIsCiAgICAicGkiOiBucC5waSwgImUiOiBucC5lLAp9CgoKZGVmIG1haW4oKToKICAgIHRyeToKICAgICAgICB3aXRoIG9wZW4oQ0ZHLCAiciIsIGVuY29kaW5nPSJ1dGYtOCIpIGFzIGZoOgogICAgICAgICAgICBjZmcgPSBqc29uLmxvYWQoZmgpCiAgICBleGNlcHQgRXhjZXB0aW9uIGFzIGU6CiAgICAgICAgb3V0X2pzb24oeyJvayI6IEZhbHNlLCAic3RhZ2UiOiAiaW5wdXQiLCAiZXJyb3IiOiBzdHIoZSl9KQogICAgICAgIHJldHVybgoKICAgIG1vZGUgPSBzdHIoY2ZnLmdldCgibW9kZSIsICJzdXJmYWNlIikgb3IgInN1cmZhY2UiKS5sb3dlcigpCiAgICBvdXQgPSBzdHIoY2ZnLmdldCgib3V0IiwgIi9kYXRhL2RhdGEvY29tLmFpLmFzc2lzdGFuY2Uub3Blcml0L2ZpbGVzL0RpYWdyYW1zL3N1cmZhY2UzZC5wbmciKSkKICAgIGRwaSA9IGludChjZmcuZ2V0KCJkcGkiLCAxNTApKQogICAgY21hcCA9IHN0cihjZmcuZ2V0KCJjbWFwIiwgInZpcmlkaXMiKSBvciAidmlyaWRpcyIpCiAgICB3aXJlID0gYm9vbChjZmcuZ2V0KCJ3aXJlIiwgRmFsc2UpKQogICAgdGl0bGUgPSBzdHIoY2ZnLmdldCgidGl0bGUiLCAiIikgb3IgIiIpCgogICAgdHJ5OgogICAgICAgIG9zLm1ha2VkaXJzKG9zLnBhdGguZGlybmFtZShvdXQpLCBleGlzdF9vaz1UcnVlKQogICAgICAgIGZpZyA9IHBsdC5maWd1cmUoZmlnc2l6ZT0oOC4yLCA2LjYpLCBkcGk9ZHBpKQogICAgICAgIGF4ID0gZmlnLmFkZF9zdWJwbG90KDExMSwgcHJvamVjdGlvbj0iM2QiKQoKICAgICAgICBpZiBtb2RlID09ICJzdXJmYWNlIjoKICAgICAgICAgICAgel9leHByID0gc3RyKGNmZy5nZXQoInoiLCAiIikgb3IgIiIpCiAgICAgICAgICAgIGlmIG5vdCB6X2V4cHI6CiAgICAgICAgICAgICAgICBvdXRfanNvbih7Im9rIjogRmFsc2UsICJzdGFnZSI6ICJpbnB1dCIsICJlcnJvciI6ICLnvLogeiDooajovr7lvI/vvIh6ID0gZih4LCB5Ke+8iSJ9KQogICAgICAgICAgICAgICAgcmV0dXJuCiAgICAgICAgICAgIHgwLCB4MSA9IHJuZyhjZmcuZ2V0KCJ4X3JhbmdlIiksIC01LjAsIDUuMCkKICAgICAgICAgICAgeTAsIHkxID0gcm5nKGNmZy5nZXQoInlfcmFuZ2UiKSwgLTUuMCwgNS4wKQogICAgICAgICAgICBOID0gaW50KGNmZy5nZXQoInBvaW50cyIsIDEzMCkpCiAgICAgICAgICAgIHggPSBucC5saW5zcGFjZSh4MCwgeDEsIE4pCiAgICAgICAgICAgIHkgPSBucC5saW5zcGFjZSh5MCwgeTEsIE4pCiAgICAgICAgICAgIFgsIFkgPSBucC5tZXNoZ3JpZCh4LCB5KQogICAgICAgICAgICBFTlZbIngiXSA9IFgKICAgICAgICAgICAgRU5WWyJ5Il0gPSBZCiAgICAgICAgICAgIFogPSBucC5hc2FycmF5KGV2YWwoY29udih6X2V4cHIpLCB7Il9fYnVpbHRpbnNfXyI6IHt9fSwgRU5WKSwgZHR5cGU9ZmxvYXQpCiAgICAgICAgICAgIGlmIFoubmRpbSA9PSAwOgogICAgICAgICAgICAgICAgWiA9IG5wLmZ1bGxfbGlrZShYLCBmbG9hdChaKSwgZHR5cGU9ZmxvYXQpCiAgICAgICAgICAgIFogPSBucC53aGVyZShucC5pc2Zpbml0ZShaKSwgWiwgbnAubmFuKQogICAgICAgICAgICBpZiB3aXJlOgogICAgICAgICAgICAgICAgYXgucGxvdF93aXJlZnJhbWUoWCwgWSwgWiwgcnN0cmlkZT02LCBjc3RyaWRlPTYsIGx3PTAuNiwgY29sb3I9IiMzYTc2YjUiKQogICAgICAgICAgICBlbHNlOgogICAgICAgICAgICAgICAgYXgucGxvdF9zdXJmYWNlKFgsIFksIFosIGNtYXA9Y21hcCwgbGluZXdpZHRoPTAuMTUsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRnZWNvbG9yPSIjMWMzZDVhIiwgYWxwaGE9MC45NiwgYW50aWFsaWFzZWQ9VHJ1ZSkKICAgICAgICAgICAgYXguc2V0X3hsYWJlbCgieCIpCiAgICAgICAgICAgIGF4LnNldF95bGFiZWwoInkiKQogICAgICAgICAgICBheC5zZXRfemxhYmVsKCJ6IikKCiAgICAgICAgZWxpZiBtb2RlID09ICJwYXJhbSI6CiAgICAgICAgICAgIHhlID0gc3RyKGNmZy5nZXQoIngiLCAic2luKHUpKmNvcyh2KSIpKQogICAgICAgICAgICB5ZSA9IHN0cihjZmcuZ2V0KCJ5IiwgInNpbih1KSpzaW4odikiKSkKICAgICAgICAgICAgemUgPSBzdHIoY2ZnLmdldCgieiIsICJjb3ModSkiKSkKICAgICAgICAgICAgdTAsIHUxID0gcm5nKGNmZy5nZXQoInVfcmFuZ2UiKSwgMC4wLCBmbG9hdChucC5waSkpCiAgICAgICAgICAgIHYwLCB2MSA9IHJuZyhjZmcuZ2V0KCJ2X3JhbmdlIiksIDAuMCwgZmxvYXQoMiAqIG5wLnBpKSkKICAgICAgICAgICAgTiA9IGludChjZmcuZ2V0KCJwb2ludHMiLCAxMTApKQogICAgICAgICAgICB1ID0gbnAubGluc3BhY2UodTAsIHUxLCBOKQogICAgICAgICAgICB2ID0gbnAubGluc3BhY2UodjAsIHYxLCBOKQogICAgICAgICAgICBVLCBWID0gbnAubWVzaGdyaWQodSwgdikKICAgICAgICAgICAgRU5WWyJ1Il0gPSBVCiAgICAgICAgICAgIEVOVlsidiJdID0gVgogICAgICAgICAgICBYID0gbnAuYXNhcnJheShldmFsKGNvbnYoeGUpLCB7Il9fYnVpbHRpbnNfXyI6IHt9fSwgRU5WKSwgZHR5cGU9ZmxvYXQpCiAgICAgICAgICAgIFkgPSBucC5hc2FycmF5KGV2YWwoY29udih5ZSksIHsiX19idWlsdGluc19fIjoge319LCBFTlYpLCBkdHlwZT1mbG9hdCkKICAgICAgICAgICAgWiA9IG5wLmFzYXJyYXkoZXZhbChjb252KHplKSwgeyJfX2J1aWx0aW5zX18iOiB7fX0sIEVOViksIGR0eXBlPWZsb2F0KQogICAgICAgICAgICBpZiB3aXJlOgogICAgICAgICAgICAgICAgYXgucGxvdF93aXJlZnJhbWUoWCwgWSwgWiwgcnN0cmlkZT01LCBjc3RyaWRlPTUsIGx3PTAuNiwgY29sb3I9IiMzYTc2YjUiKQogICAgICAgICAgICBlbHNlOgogICAgICAgICAgICAgICAgYXgucGxvdF9zdXJmYWNlKFgsIFksIFosIGNtYXA9Y21hcCwgbGluZXdpZHRoPTAuMTUsCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWRnZWNvbG9yPSIjMWMzZDVhIiwgYWxwaGE9MC45NiwgYW50aWFsaWFzZWQ9VHJ1ZSkKICAgICAgICAgICAgYXguc2V0X3hsYWJlbCgieCIpCiAgICAgICAgICAgIGF4LnNldF95bGFiZWwoInkiKQogICAgICAgICAgICBheC5zZXRfemxhYmVsKCJ6IikKCiAgICAgICAgZWxzZToKICAgICAgICAgICAgb3V0X2pzb24oeyJvayI6IEZhbHNlLCAic3RhZ2UiOiAiZGlzcGF0Y2giLCAiZXJyb3IiOiAidW5rbm93biBtb2RlOiAiICsgbW9kZX0pCiAgICAgICAgICAgIHJldHVybgoKICAgICAgICBpZiB0aXRsZToKICAgICAgICAgICAgYXguc2V0X3RpdGxlKHRpdGxlLCBmb250c2l6ZT0xNCwgcGFkPTEyKQogICAgICAgIGZpZy50aWdodF9sYXlvdXQoKQogICAgICAgIGZpZy5zYXZlZmlnKG91dCkKICAgICAgICBwbHQuY2xvc2UoZmlnKQogICAgICAgIG91dF9qc29uKHsib2siOiBUcnVlLCAicGF0aCI6IG91dCwgInNpemUiOiBvcy5wYXRoLmdldHNpemUob3V0KX0pCiAgICBleGNlcHQgRXhjZXB0aW9uOgogICAgICAgIGltcG9ydCB0cmFjZWJhY2sKICAgICAgICB0YiA9IHRyYWNlYmFjay5mb3JtYXRfZXhjKCkuc3BsaXRsaW5lcygpCiAgICAgICAgb3V0X2pzb24oeyJvayI6IEZhbHNlLCAic3RhZ2UiOiAicmVuZGVyIiwgImVycm9yIjogIiB8ICIuam9pbih0YlstNDpdKX0pCgoKaWYgX19uYW1lX18gPT0gIl9fbWFpbl9fIjoKICAgIG1haW4oKQ==";

const DS_SQ = String.fromCharCode(39);
const DS_NL = String.fromCharCode(10);
const DS_CR = String.fromCharCode(13);

const DS_KEY_PREFIX = "ds_sketch_";
let dsExecKey = DS_KEY_PREFIX + (Date.now() % 100000000);

function dsNewKey() {
    return DS_KEY_PREFIX + "r" + (Date.now() % 100000000) + "_" + Math.floor(Math.random() * 1000000);
}

// ---- 小工具 --------------------------------------------------------------

function dsNoCr(s) {
    return String(s).split(DS_CR).join("");
}

function dsToNum(v, d) {
    const n = Number(v);
    return isFinite(n) ? n : d;
}

function dsTs() {
    const dt = new Date();
    const p = function (n) { return (n < 10 ? "0" : "") + n; };
    return "" + dt.getFullYear() + p(dt.getMonth() + 1) + p(dt.getDate())
        + "_" + p(dt.getHours()) + p(dt.getMinutes()) + p(dt.getSeconds());
}

function dsCleanName(s) {
    const bad = [
        String.fromCharCode(47), String.fromCharCode(92), String.fromCharCode(58),
        String.fromCharCode(42), String.fromCharCode(63), String.fromCharCode(34),
        String.fromCharCode(60), String.fromCharCode(62), String.fromCharCode(124)
    ].join("");
    const out = [];
    for (let i = 0; i < s.length; i++) {
        const ch = s.charAt(i);
        if (s.charCodeAt(i) > 32 && bad.indexOf(ch) < 0) {
            out.push(ch);
        }
    }
    return out.join("");
}

function dsGetInt(s, re) {
    const m = String(s).match(re);
    return m ? parseInt(m[1], 10) : null;
}

// 范围解析："[-8,8]" / "-8,8" / "-8..8" / "0,pi" -> ["-8","8"]（字符串数组，引擎端再数值化）
function dsParseRange(v, d0, d1) {
    if (v == null || v === "") {
        return [d0, d1];
    }
    const s = String(v).split("[").join("").split("]").join("")
        .split("(").join("").split(")").join("").trim();
    if (!s) {
        return [d0, d1];
    }
    let parts = s.split(",");
    if (parts.length < 2) {
        parts = s.split("..");
    }
    if (parts.length < 2) {
        return [d0, d1];
    }
    return [parts[0].trim(), parts[1].trim()];
}

// 从任意文本中截取第一个大括号平衡的 JSON 片段
function dsExtractJson(s) {
    const LB = String.fromCharCode(123);
    const RB = String.fromCharCode(125);
    const start = s.indexOf(LB);
    if (start < 0) {
        return null;
    }
    let depth = 0;
    for (let i = start; i < s.length; i++) {
        const ch = s.charAt(i);
        if (ch === LB) {
            depth++;
        } else if (ch === RB) {
            depth--;
            if (depth === 0) {
                return s.slice(start, i + 1);
            }
        }
    }
    return null;
}

// ---- UTF-8 + Base64（不依赖 btoa / TextEncoder） --------------------------

const DS_B64C = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function dsUtf8Bytes(str) {
    const out = [];
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        if (c < 0x80) {
            out.push(c);
        } else if (c < 0x800) {
            out.push(0xC0 | (c >> 6), 0x80 | (c & 0x3F));
        } else if (c >= 0xD800 && c <= 0xDBFF && i + 1 < str.length) {
            const c2 = str.charCodeAt(i + 1);
            if (c2 >= 0xDC00 && c2 <= 0xDFFF) {
                const cp = 0x10000 + ((c - 0xD800) << 10) + (c2 - 0xDC00);
                out.push(0xF0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3F),
                    0x80 | ((cp >> 6) & 0x3F), 0x80 | (cp & 0x3F));
                i++;
            } else {
                out.push(0xEF, 0xBF, 0xBD);
            }
        } else if (c >= 0xDC00 && c <= 0xDFFF) {
            out.push(0xEF, 0xBF, 0xBD);
        } else {
            out.push(0xE0 | (c >> 12), 0x80 | ((c >> 6) & 0x3F), 0x80 | (c & 0x3F));
        }
    }
    return out;
}

function dsB64(str) {
    const b = dsUtf8Bytes(str);
    let r = "";
    let i = 0;
    for (; i + 2 < b.length; i += 3) {
        const n = (b[i] << 16) | (b[i + 1] << 8) | b[i + 2];
        r += DS_B64C.charAt((n >> 18) & 63) + DS_B64C.charAt((n >> 12) & 63)
            + DS_B64C.charAt((n >> 6) & 63) + DS_B64C.charAt(n & 63);
    }
    const rem = b.length - i;
    if (rem === 1) {
        const n1 = b[i] << 16;
        r += DS_B64C.charAt((n1 >> 18) & 63) + DS_B64C.charAt((n1 >> 12) & 63) + "==";
    } else if (rem === 2) {
        const n2 = (b[i] << 16) | (b[i + 1] << 8);
        r += DS_B64C.charAt((n2 >> 18) & 63) + DS_B64C.charAt((n2 >> 12) & 63)
            + DS_B64C.charAt((n2 >> 6) & 63) + "=";
    }
    return r;
}

// ---- 隐藏执行器调用（带会话自愈） -----------------------------------------

async function dsTryExec(cmd, key, timeoutMs) {
    try {
        const r = await Tools.System.terminal.hiddenExec(cmd, {
            executorKey: key,
            timeoutMs: timeoutMs
        });
        return {
            timedOut: !!(r && r.timedOut),
            error: null,
            exitCode: (r && r.exitCode != null) ? r.exitCode : null,
            output: dsNoCr(String((r && r.output) || ""))
        };
    } catch (e) {
        return {
            timedOut: false,
            error: String((e && e.message) || e),
            exitCode: null,
            output: ""
        };
    }
}

async function dsExecWithRecovery(cmd) {
    const keyPrimary = dsExecKey;
    const first = await dsTryExec(cmd, keyPrimary, 25000);
    if (!first.timedOut && !first.error) {
        return first;
    }
    const keyFresh = dsNewKey();
    const second = await dsTryExec(cmd, keyFresh, 25000);
    if (!second.timedOut && !second.error) {
        dsExecKey = keyFresh;
        return second;
    }
    if (second.error || second.timedOut) {
        return second;
    }
    return first;
}

// ---- 结果收尾（命令行渲染类：DS_EXIT / DS_SIZE 协议） ----------------------

function dsFinishCmd(r, out, label, depHint) {
    if (r.timedOut) {
        return { success: false, message: "渲染超时（已自动重试一次仍失败）：隐藏执行器无响应。可稍后重试，或检查 Linux 终端环境。" };
    }
    if (r.error) {
        return { success: false, message: "执行异常：" + r.error };
    }
    const output = r.output;
    const exit = dsGetInt(output, /DS_EXIT=(-?\d+)/);
    const size = dsGetInt(output, /DS_SIZE=(\d+)/);
    if (exit === 0 && size && size > 0) {
        const kb = Math.round(size / 1024);
        const md = "![" + label + "](file://" + out + ")";
        const msg = label + "已生成：" + out + "（" + kb + " KB）" + DS_NL + DS_NL + md;
        return { success: true, data: { path: out, size: size, markdown: md }, message: msg };
    }
    const tail = output.slice(-400);
    let hint = "";
    if (depHint && /not found|No such file/i.test(tail)) {
        hint = "。⚠ 环境缺少渲染命令，请先安装：" + depHint;
    }
    return { success: false, message: "渲染失败（exit=" + (exit != null ? exit : "?") + "）：" + tail + hint };
}

// ---- 结果收尾（Python 引擎类：RESULT_JSON 协议） ---------------------------

function dsParseEngineResult(output) {
    const idx = output.lastIndexOf("RESULT_JSON:");
    if (idx < 0) {
        return null;
    }
    const jsonText = dsExtractJson(output.slice(idx + 12));
    if (!jsonText) {
        return null;
    }
    try {
        return JSON.parse(jsonText);
    } catch (e) {
        return null;
    }
}

function dsFinishEngine(r, out, label, depHint) {
    if (r.timedOut) {
        return { success: false, message: label + "渲染超时（已自动重试一次仍失败）：隐藏执行器无响应。可稍后重试。" };
    }
    if (r.error) {
        return { success: false, message: "执行异常：" + r.error };
    }
    const output = r.output;
    const res = dsParseEngineResult(output);
    if (res && res.ok) {
        const kb = Math.round((res.size || 0) / 1024);
        const md = "![" + label + "](file://" + res.path + ")";
        const msg = label + "已生成：" + res.path + "（" + kb + " KB）" + DS_NL + DS_NL + md;
        return { success: true, data: { path: res.path, size: res.size, markdown: md }, message: msg };
    }
    if (res && res.ok === false) {
        return { success: false, message: label + "渲染失败（" + res.stage + "）：" + res.error };
    }
    if (/ModuleNotFoundError|No module named/i.test(output)) {
        return { success: false, message: "环境缺少 Python 依赖。" + (depHint || "请先安装所需 Python 包后重试。") };
    }
    if (output.indexOf("RESULT_JSON:") >= 0) {
        return { success: false, message: "结果解析异常：输出片段 " + output.slice(-400) };
    }
    return {
        success: false,
        message: "执行异常（exit=" + (r.exitCode != null ? r.exitCode : "?") + "）：" + output.slice(-500)
    };
}

// ---- 工具 1：render_dot ---------------------------------------------------

async function render_dot(params) {
    try {
        const p = params || {};
        const src = String(p.dot || "").trim();
        if (!src) {
            return { success: false, message: "缺少 dot 参数：请提供 Graphviz DOT 源码，例如 digraph G { A -> B; }" };
        }
        if (src.length > 60000) {
            return { success: false, message: "DOT 源码过长（" + src.length + " 字符，上限 60000）" };
        }
        const dpi = Math.max(60, Math.min(400, dsToNum(p.dpi, 150)));
        let prefix = dsCleanName(String(p.filename || "").trim());
        if (!prefix) {
            prefix = "dot";
        }
        if (prefix.length > 40) {
            prefix = prefix.slice(0, 40);
        }
        const out = DS_OUT_DIR + "/" + prefix + "_" + dsTs() + ".png";
        const b64 = dsB64(src);
        const cmd = "echo " + DS_SQ + b64 + DS_SQ + " | base64 -d > " + DS_TMP_DOT
            + "; " + DS_DOT_BIN + " -Tpng -Gdpi=" + dpi + " -o " + DS_SQ + out + DS_SQ
            + " " + DS_TMP_DOT + " 2>&1; echo DS_EXIT=$?"
            + "; [ -s " + DS_SQ + out + DS_SQ + " ] && echo DS_SIZE=$(stat -c%s " + DS_SQ + out + DS_SQ + ")";
        const r = await dsExecWithRecovery(cmd);
        return dsFinishCmd(r, out, "结构图", "apt-get install -y graphviz");
    } catch (e) {
        return { success: false, message: "render_dot 异常：" + String((e && e.message) || e) };
    }
}

// ---- 工具 2：render_svg ---------------------------------------------------

async function render_svg(params) {
    try {
        const p = params || {};
        const src = String(p.svg || "").trim();
        if (!src) {
            return { success: false, message: "缺少 svg 参数：请提供 SVG 源码（含 width/height）" };
        }
        if (src.length > 80000) {
            return { success: false, message: "SVG 源码过长（" + src.length + " 字符，上限 80000）" };
        }
        let prefix = dsCleanName(String(p.filename || "").trim());
        if (!prefix) {
            prefix = "svg";
        }
        if (prefix.length > 40) {
            prefix = prefix.slice(0, 40);
        }
        const out = DS_OUT_DIR + "/" + prefix + "_" + dsTs() + ".png";
        const b64 = dsB64(src);
        const cmd = "echo " + DS_SQ + b64 + DS_SQ + " | base64 -d > " + DS_TMP_SVG
            + "; " + DS_RSVG_BIN + " -o " + DS_SQ + out + DS_SQ + " " + DS_TMP_SVG + " 2>&1; echo DS_EXIT=$?"
            + "; [ -s " + DS_SQ + out + DS_SQ + " ] && echo DS_SIZE=$(stat -c%s " + DS_SQ + out + DS_SQ + ")";
        const r = await dsExecWithRecovery(cmd);
        return dsFinishCmd(r, out, "示意图", "apt-get install -y librsvg2-bin");
    } catch (e) {
        return { success: false, message: "render_svg 异常：" + String((e && e.message) || e) };
    }
}

// ---- 工具 3：render_circuit ----------------------------------------------

async function render_circuit(params) {
    try {
        const p = params || {};
        const code = String(p.code || "").trim();
        if (!code) {
            return { success: false, message: "缺少 code 参数：请提供 schemdraw 语句体，例如 d += elm.Battery().up()" };
        }
        if (code.length > 20000) {
            return { success: false, message: "code 过长（" + code.length + " 字符，上限 20000）" };
        }
        const dpi = Math.max(60, Math.min(400, dsToNum(p.dpi, 150)));
        let prefix = dsCleanName(String(p.filename || "").trim());
        if (!prefix) {
            prefix = "circuit";
        }
        if (prefix.length > 40) {
            prefix = prefix.slice(0, 40);
        }
        const out = DS_OUT_DIR + "/" + prefix + "_" + dsTs() + ".png";
        const cfg = { code: code, out: out, dpi: dpi };
        const cfgB64 = dsB64(JSON.stringify(cfg));
        // 自包含：引擎缺失时从内嵌源码落盘；优先 venv python，否则系统 python3
        const cmd = "[ -s " + DS_ENGINE + " ] || echo " + DS_SQ + DS_ENGINE_B64 + DS_SQ + " | base64 -d > " + DS_ENGINE
            + "; [ -s " + DS_ENGINE_BAK + " ] || cp -f " + DS_ENGINE + " " + DS_ENGINE_BAK
            + "; echo " + DS_SQ + cfgB64 + DS_SQ + " | base64 -d > " + DS_CIRCUIT_CFG
            + "; PY=" + DS_PY_VENV + "; [ -x $PY ] || PY=python3; $PY " + DS_ENGINE + " 2>&1; echo DS_EXIT=$?";
        const r = await dsExecWithRecovery(cmd);
        return dsFinishEngine(r, out, "电路图",
            "安装参考：python3 -m pip install schemdraw matplotlib（推荐建 venv：python3 -m venv ~/.venvs/plotter && ~/.venvs/plotter/bin/pip install schemdraw）");
    } catch (e) {
        return { success: false, message: "render_circuit 异常：" + String((e && e.message) || e) };
    }
}

// ---- 工具 4：render_3d ----------------------------------------------------

async function render_3d(params) {
    try {
        const p = params || {};
        let mode = String(p.mode || "surface").trim().toLowerCase();
        if (mode !== "surface" && mode !== "param") {
            mode = "surface";
        }
        const z = String(p.z || "").trim();
        if (!z) {
            return { success: false, message: "缺少 z 表达式：surface 模式示例 z=sin(x)*cos(y)；param 模式为 z(u,v) 如 cos(u)" };
        }
        const dpi = Math.max(60, Math.min(400, dsToNum(p.dpi, 150)));
        let prefix = dsCleanName(String(p.filename || "").trim());
        if (!prefix) {
            prefix = "surf3d";
        }
        if (prefix.length > 40) {
            prefix = prefix.slice(0, 40);
        }
        const out = DS_OUT_DIR + "/" + prefix + "_" + dsTs() + ".png";
        const cfg = {
            mode: mode,
            z: z,
            cmap: String(p.cmap || "viridis").trim() || "viridis",
            wire: String(p.wire || "").toLowerCase() === "true",
            title: String(p.title || ""),
            dpi: dpi,
            out: out
        };
        if (mode === "surface") {
            cfg.x_range = dsParseRange(p.x_range, "-5", "5");
            cfg.y_range = dsParseRange(p.y_range, "-5", "5");
        } else {
            cfg.x = String(p.x || "sin(u)*cos(v)");
            cfg.y = String(p.y || "sin(u)*sin(v)");
            cfg.u_range = dsParseRange(p.u_range, "0", "pi");
            cfg.v_range = dsParseRange(p.v_range, "0", "2*pi");
        }
        const cfgB64 = dsB64(JSON.stringify(cfg));
        // 自包含：引擎缺失时从内嵌源码落盘；优先 venv python，否则系统 python3
        const cmd = "[ -s " + DS_3D_ENGINE + " ] || echo " + DS_SQ + DS_3D_ENGINE_B64 + DS_SQ + " | base64 -d > " + DS_3D_ENGINE
            + "; [ -s " + DS_3D_ENGINE_BAK + " ] || cp -f " + DS_3D_ENGINE + " " + DS_3D_ENGINE_BAK
            + "; echo " + DS_SQ + cfgB64 + DS_SQ + " | base64 -d > " + DS_3D_CFG
            + "; PY=" + DS_PY_VENV + "; [ -x $PY ] || PY=python3; $PY " + DS_3D_ENGINE + " " + DS_3D_CFG + " 2>&1; echo DS_EXIT=$?";
        const r = await dsExecWithRecovery(cmd);
        return dsFinishEngine(r, out, "3D图",
            "安装参考：python3 -m pip install matplotlib numpy");
    } catch (e) {
        return { success: false, message: "render_3d 异常：" + String((e && e.message) || e) };
    }
}

exports.render_dot = render_dot;
exports.render_svg = render_svg;
exports.render_circuit = render_circuit;
exports.render_3d = render_3d;