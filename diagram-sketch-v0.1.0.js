/*
METADATA
{
  "name": "diagram_sketch",
  "display_name": { "zh": "示意图绘制", "en": "Diagram Sketch" },
  "description": {
    "zh": "绘制示意图：结构/流程图（Graphviz DOT）、实验/自由示意图（SVG）、电路图（schemdraw）。输出 PNG 到应用内部数据区 Diagrams，返回可直接在对话中显示的图片标记。",
    "en": "Draw diagrams via Graphviz DOT, SVG, or schemdraw. Outputs PNG into app internal Diagrams folder and returns inline-displayable markdown."
  },
  "category": "Utility",
  "tools": [
    {
      "name": "render_dot",
      "description": { "zh": "用 Graphviz DOT 语言绘制结构图 / 流程图 / 关系图 / 层级图（自动布局），返回可在对话中直接显示的图片标记。适用：知识结构、流程步骤、分类关系、组织层级。", "en": "Render Graphviz DOT to PNG (auto layout)." },
      "parameters": [
        { "name": "dot", "description": { "zh": "DOT 源码。示例：digraph G { rankdir=LR; A [label=\"起点\"]; B [label=\"终点\"]; A->B; }。教学风建议样式：node [shape=box, style=\"rounded,filled\", fillcolor=\"#eaf2fb\", color=\"#3a76b5\", fontname=\"Noto Sans CJK SC\", fontcolor=\"#1c3d5a\"]。", "en": "DOT source code." }, "type": "string", "required": true },
        { "name": "filename", "description": { "zh": "文件名前缀（可选，英文），默认 dot 加时间戳", "en": "Filename prefix (optional)." }, "type": "string", "required": false },
        { "name": "dpi", "description": { "zh": "输出精度，默认 150", "en": "DPI, default 150." }, "type": "number", "required": false }
      ]
    },
    {
      "name": "render_svg",
      "description": { "zh": "用 SVG 源码绘制任意示意图（实验装置图、几何图形、光路图、结构分解图等，自由摆放），返回可在对话中直接显示的图片标记。", "en": "Render SVG source to PNG." },
      "parameters": [
        { "name": "svg", "description": { "zh": "SVG 源码（需含 width/height，建议宽 800~1000）。中文用 font-family=\"Noto Sans CJK SC\"；箭头用 marker；线条用 line/path，图形用 rect/circle/polygon。", "en": "SVG source code." }, "type": "string", "required": true },
        { "name": "filename", "description": { "zh": "文件名前缀（可选，英文）", "en": "Filename prefix (optional)." }, "type": "string", "required": false }
      ]
    },
    {
      "name": "render_circuit",
      "description": { "zh": "用 schemdraw 绘制电路图（标准电路符号），返回可在对话中直接显示的图片标记。适用：电路、电学实验装置。", "en": "Render electrical circuit via schemdraw." },
      "parameters": [
        { "name": "code", "description": { "zh": "schemdraw 语句体（将在 with schemdraw.Drawing() as d: 内执行，可用 elm 与 d）。常用元件：elm.Battery() 电池、elm.Resistor() 电阻、elm.Lamp() 灯泡、elm.Switch() 开关、elm.Capacitor() 电容、elm.Inductor() 电感、elm.MeterV() 电压表、elm.MeterA() 电流表、elm.Ground() 接地、elm.Line() 导线、elm.Dot() 节点。示例：d += elm.Battery().up().label(\"1.5V\"); d += elm.Switch().right().label(\"开关\"); d += elm.Lamp().down(); d += elm.Line().left()", "en": "schemdraw body code." }, "type": "string", "required": true },
        { "name": "filename", "description": { "zh": "文件名前缀（可选，英文）", "en": "Filename prefix (optional)." }, "type": "string", "required": false },
        { "name": "dpi", "description": { "zh": "输出精度，默认 150", "en": "DPI, default 150." }, "type": "number", "required": false }
      ]
    }
  ]
}
*/
// diagram-sketch v0.1.0（2026-10-02）
// 三件套：render_dot（Graphviz）/ render_svg（librsvg）/ render_circuit（schemdraw）
// 工程模式继承 function-plot v0.3.0：自持 executorKey + 自愈、单行命令、base64 传参、DS_ / RESULT_JSON 协议
// 引擎：/data/data/com.ai.assistance.operit/files/tools/ds_circuit_core.py（+ .bak）
// 部署：cp 到 packages 目录 -> set_sandbox_package_enabled(false->true) -> use_package 重载
"use strict";

// ---- 常量 ---------------------------------------------------------------

const DS_DOT_BIN = "/usr/bin/dot";
const DS_RSVG_BIN = "/usr/bin/rsvg-convert";
const DS_ENGINE = "/data/data/com.ai.assistance.operit/files/tools/ds_circuit_core.py";
const DS_ENGINE_BAK = "/data/data/com.ai.assistance.operit/files/tools/ds_circuit_core.bak.py";
const DS_PY = "/root/.venvs/plotter/bin/python";
const DS_OUT_DIR = "/data/data/com.ai.assistance.operit/files/Diagrams";
const DS_TMP_DOT = "/tmp/ds_tmp.dot";
const DS_TMP_SVG = "/tmp/ds_tmp.svg";
const DS_CIRCUIT_CFG = "/tmp/ds_circuit_input.json";

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

function dsFinishCmd(r, out, label) {
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
    return { success: false, message: "渲染失败（exit=" + (exit != null ? exit : "?") + "）：" + tail };
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
        return dsFinishCmd(r, out, "结构图");
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
        return dsFinishCmd(r, out, "示意图");
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
        const cmd = "[ -s " + DS_ENGINE + " ] || cp -f " + DS_ENGINE_BAK + " " + DS_ENGINE
            + "; echo " + DS_SQ + cfgB64 + DS_SQ + " | base64 -d > " + DS_CIRCUIT_CFG
            + "; " + DS_PY + " " + DS_ENGINE + " 2>&1; echo DS_EXIT=$?";
        const r = await dsExecWithRecovery(cmd);
        const output = r.output;

        if (r.timedOut) {
            return { success: false, message: "渲染超时（已自动重试一次仍失败）：隐藏执行器无响应。" };
        }
        if (r.error) {
            return { success: false, message: "执行异常：" + r.error };
        }

        const idx = output.lastIndexOf("RESULT_JSON:");
        if (idx >= 0) {
            const jsonText = dsExtractJson(output.slice(idx + 12));
            let res = null;
            if (jsonText) {
                try { res = JSON.parse(jsonText); } catch (e2) { res = null; }
            }
            if (res && res.ok) {
                const kb = Math.round((res.size || 0) / 1024);
                const md = "![电路图](file://" + res.path + ")";
                const msg = "电路图已生成：" + res.path + "（" + kb + " KB）" + DS_NL + DS_NL + md;
                return { success: true, data: { path: res.path, size: res.size, markdown: md }, message: msg };
            }
            if (res && res.ok === false) {
                return { success: false, message: "电路渲染失败（" + res.stage + "）：" + res.error };
            }
            return { success: false, message: "结果解析异常：输出片段 " + output.slice(-400) };
        }
        return {
            success: false,
            message: "执行异常（exit=" + (r.exitCode != null ? r.exitCode : "?") + "）：" + output.slice(-500)
        };
    } catch (e) {
        return { success: false, message: "render_circuit 异常：" + String((e && e.message) || e) };
    }
}

exports.render_dot = render_dot;
exports.render_svg = render_svg;
exports.render_circuit = render_circuit;