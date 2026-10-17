"""Generate Brightside icons: a rising sun over a sprout on sky blue.

Usage:
  .venv/bin/python scripts/make_icons.py          # web icons into www/
  .venv/bin/python scripts/make_icons.py --native # also Android mipmaps and the iOS AppIcon
"""
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
WWW = ROOT / "www"
S = 1024  # master canvas

SKY_TOP = (176, 216, 255)
SKY_BOTTOM = (237, 247, 255)
SUN_A = (255, 200, 87)
SUN_B = (242, 167, 43)
LEAF = (79, 166, 124)
LEAF_DARK = (46, 125, 91)
HILL = (79, 166, 124)
HILL_BACK = (122, 196, 152)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def sky(size):
    img = Image.new("RGB", (size, size))
    d = ImageDraw.Draw(img)
    for y in range(size):
        d.line([(0, y), (size, y)], fill=lerp(SKY_TOP, SKY_BOTTOM, y / size))
    return img.convert("RGBA")


def artwork(scale=1.0):
    """Transparent layer with sun, hills and sprout. scale < 1 shrinks into the maskable safe zone."""
    layer = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    c = S / 2

    def sx(v):
        return c + (v - c) * scale

    # Sun glow
    glow = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    r = 300 * scale
    cy = sx(470)
    gd.ellipse([c - r, cy - r, c + r, cy + r], fill=(255, 214, 120, 150))
    glow = glow.filter(ImageFilter.GaussianBlur(60 * scale))
    layer = Image.alpha_composite(layer, glow)

    # Sun disc with a soft vertical gradient
    sun = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    r = 225 * scale
    for i in range(int(r * 2)):
        t = i / (r * 2)
        y = cy - r + i
        half = math.sqrt(max(0.0, r * r - (y - cy) ** 2))
        ImageDraw.Draw(sun).line([(c - half, y), (c + half, y)], fill=lerp(SUN_A, SUN_B, t) + (255,))
    layer = Image.alpha_composite(layer, sun)

    d = ImageDraw.Draw(layer)
    # Rays
    for k in range(12):
        a = math.radians(k * 30 - 90)
        r1, r2 = 262 * scale, 320 * scale
        w = int(22 * scale)
        if math.sin(a) > 0.55:
            continue  # hidden behind the hills
        d.line([(c + r1 * math.cos(a), cy + r1 * math.sin(a)), (c + r2 * math.cos(a), cy + r2 * math.sin(a))],
               fill=SUN_A + (255,), width=w)
        for (px, py) in [(c + r1 * math.cos(a), cy + r1 * math.sin(a)), (c + r2 * math.cos(a), cy + r2 * math.sin(a))]:
            d.ellipse([px - w / 2, py - w / 2, px + w / 2, py + w / 2], fill=SUN_A + (255,))

    # Hills
    d.ellipse([sx(-260), sx(690), sx(700), sx(1300)], fill=HILL_BACK + (255,))

    # Sprout stem
    stem_w = int(30 * scale)
    pts = []
    for i in range(40):
        t = i / 39
        x = c + math.sin(t * math.pi) * 18 * scale
        y = sx(900) - t * (sx(900) - sx(560))
        pts.append((x, y))
    d.line(pts, fill=LEAF_DARK + (255,), width=stem_w, joint="curve")
    d.ellipse([sx(330), sx(720), sx(1290), sx(1340)], fill=HILL + (255,))  # front hill hides the stem base
    top = pts[-1]
    d.ellipse([top[0] - stem_w / 2, top[1] - stem_w / 2, top[0] + stem_w / 2, top[1] + stem_w / 2], fill=LEAF_DARK + (255,))

    def leaf(base, length, angle, color):
        lw = length * 0.46
        leaf_img = Image.new("RGBA", (int(length * 2), int(length * 2)), (0, 0, 0, 0))
        ld = ImageDraw.Draw(leaf_img)
        cx2, cy2 = length, length
        ld.ellipse([cx2, cy2 - lw / 2, cx2 + length, cy2 + lw / 2], fill=color + (255,))
        ld.line([(cx2 + length * 0.08, cy2), (cx2 + length * 0.86, cy2)], fill=(255, 255, 255, 90), width=max(2, int(6 * scale)))
        leaf_img = leaf_img.rotate(angle, resample=Image.BICUBIC, center=(cx2, cy2))
        layer.alpha_composite(leaf_img, (int(base[0] - cx2), int(base[1] - cy2)))

    leaf((top[0], top[1] + 8 * scale), 190 * scale, 32, LEAF)
    leaf((top[0], top[1] + 8 * scale), 170 * scale, 148, LEAF_DARK)
    return layer


def master(maskable=False, rounded=False):
    img = sky(S)
    img = Image.alpha_composite(img, artwork(0.72 if maskable else 0.94))
    if rounded:
        mask = Image.new("L", (S, S), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * 0.22), fill=255)
        out = Image.new("RGBA", (S, S), (0, 0, 0, 0))
        out.paste(img, (0, 0), mask)
        img = out
    return img


def save(img, path, size, mode="RGBA"):
    path.parent.mkdir(parents=True, exist_ok=True)
    img.resize((size, size), Image.LANCZOS).convert(mode).save(path, optimize=True)
    print("wrote", path.relative_to(ROOT), f"{size}x{size}")


def web():
    full = master()
    mask = master(maskable=True)
    save(full, WWW / "icons" / "icon-192.png", 192, "RGB")
    save(full, WWW / "icons" / "icon-512.png", 512, "RGB")
    save(mask, WWW / "icons" / "icon-maskable-512.png", 512, "RGB")
    save(full, WWW / "apple-touch-icon.png", 180, "RGB")
    save(master(rounded=True), WWW / "favicon.png", 64)
    save(full, ROOT / "assets" / "icon-1024.png", 1024, "RGB")


def native():
    full = master()
    mask = master(maskable=True)
    round_img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    circle = Image.new("L", (S, S), 0)
    ImageDraw.Draw(circle).ellipse([0, 0, S - 1, S - 1], fill=255)
    round_img.paste(full, (0, 0), circle)
    # Adaptive icon foreground: artwork in the 66 percent safe zone over transparent, background is sky colour.
    fg = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    fg = Image.alpha_composite(fg, artwork(0.62))
    res = ROOT / "android" / "app" / "src" / "main" / "res"
    if res.exists():
        dens = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}
        for name, px in dens.items():
            save(full, res / f"mipmap-{name}" / "ic_launcher.png", px)
            save(round_img, res / f"mipmap-{name}" / "ic_launcher_round.png", px)
            save(Image.alpha_composite(sky(S), fg), res / f"mipmap-{name}" / "ic_launcher_foreground.png", int(px * 2.25))
        bg = res / "values" / "ic_launcher_background.xml"
        bg.parent.mkdir(parents=True, exist_ok=True)
        bg.write_text('<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#CFE8FF</color>\n</resources>\n')
        print("wrote", bg.relative_to(ROOT))
    ios = ROOT / "ios" / "App" / "App" / "Assets.xcassets" / "AppIcon.appiconset"
    if ios.exists():
        for f in ios.glob("*.png"):
            img = Image.open(f)
            save(mask if False else full, f, img.size[0], "RGB")


if __name__ == "__main__":
    web()
    if "--native" in sys.argv:
        native()
