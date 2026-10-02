# -*- coding: utf-8 -*-
"""
ds_circuit_core.py - 电路图渲染引擎（schemdraw）
协议: 读 /tmp/ds_circuit_input.json {code,out,dpi} -> PNG -> RESULT_JSON:{ok,path,size}
code: schemdraw 语句体（在 with schemdraw.Drawing() as d: 内执行，可用 elm.* 与 d）
"""
import os
import sys
import json
import traceback

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.font_manager import FontProperties

_f = "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"
if os.path.exists(_f):
    font_manager.fontManager.addfont(_f)
    plt.rcParams["font.sans-serif"] = [FontProperties(fname=_f).get_name()]
plt.rcParams["axes.unicode_minus"] = False

import schemdraw
import schemdraw.elements as elm

CFG = "/tmp/ds_circuit_input.json"


def out_json(obj):
    print("RESULT_JSON:" + json.dumps(obj, ensure_ascii=False))


def main():
    try:
        with open(CFG, "r", encoding="utf-8") as fh:
            cfg = json.load(fh)
    except Exception as e:
        out_json({"ok": False, "stage": "input", "error": str(e)})
        return

    code = str(cfg.get("code", "") or "")
    out = str(cfg.get("out", "/data/data/com.ai.assistance.operit/files/Diagrams/circuit.png"))
    dpi = int(cfg.get("dpi", 150))

    if not code.strip():
        out_json({"ok": False, "stage": "input", "error": "code 为空"})
        return

    try:
        os.makedirs(os.path.dirname(out), exist_ok=True)
    except Exception as e:
        out_json({"ok": False, "stage": "mkdir", "error": str(e)})
        return

    try:
        with schemdraw.Drawing() as d:
            exec(code, {"__builtins__": {}, "elm": elm, "d": d})
        d.save(out, dpi=dpi, transparent=False)
        if not os.path.exists(out):
            out_json({"ok": False, "stage": "save", "error": "文件未生成"})
            return
        out_json({"ok": True, "path": out, "size": os.path.getsize(out)})
    except Exception:
        tb = traceback.format_exc().splitlines()
        tail = " | ".join(tb[-4:])
        out_json({"ok": False, "stage": "render", "error": tail})


if __name__ == "__main__":
    main()