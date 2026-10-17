"""Make a QR code PNG for the live LoosenUp URL.

Usage: .venv/bin/python scripts/make_qr.py https://loosenup.vercel.app
"""
import sys
from pathlib import Path

import qrcode
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
url = sys.argv[1] if len(sys.argv) > 1 else "https://loosenup.vercel.app"

qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=16, border=3)
qr.add_data(url)
qr.make(fit=True)
code = qr.make_image(fill_color="#223038", back_color="white").convert("RGB")

# Small app icon in the middle (high error correction keeps it scannable).
icon = Image.open(ROOT / "www" / "icons" / "icon-192.png").convert("RGB")
side = code.size[0] // 5
icon = icon.resize((side, side), Image.LANCZOS)
pad = 10
plate = Image.new("RGB", (side + pad * 2, side + pad * 2), "white")
plate.paste(icon, (pad, pad))
code.paste(plate, ((code.size[0] - plate.size[0]) // 2, (code.size[1] - plate.size[1]) // 2))

# Caption under the code.
W, H = code.size[0], code.size[1] + 90
out = Image.new("RGB", (W, H), "white")
out.paste(code, (0, 0))
d = ImageDraw.Draw(out)
try:
    font = ImageFont.truetype(str(ROOT / "assets" / "Nunito.ttf"), 34)
except OSError:
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf", 32)
    except OSError:
        font = ImageFont.load_default()
text = "LoosenUp  " + url.replace("https://", "")
tw = d.textlength(text, font=font)
d.text(((W - tw) / 2, code.size[1] + 18), text, fill="#2E7D5B", font=font)

dest = ROOT / "loosenup-live-qr.png"
out.save(dest, optimize=True)
print("wrote", dest.name, out.size, "->", url)
