"""Generate Sunpetal icons: a petal sun rising over green hills on sky blue.

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
PEACH = (255, 176, 136)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def sky(size):
    img = Image.new("RGB", (size, size))
    d = ImageDraw.Draw(img)
    for y in range(size):
        d.line([(0, y), (size, y)], fill=lerp(SKY_TOP, SKY_BOTTOM, y / size))
    return img.convert("RGBA")


def bezier(p0, p1, p2, p3, n=24):
    out = []
    for i in range(n + 1):
        t = i / n
        a = (1 - t) ** 3
        b = 3 * (1 - t) ** 2 * t
        c = 3 * (1 - t) * t ** 2
        d = t ** 3
        out.append((a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]))
    return out


# Same petal as the in-app mark: M0-44 C17-52 18-78 0-94 C-18-78 -17-52 0-44Z (sun core radius 40).
PETAL = bezier((0, -44), (17, -52), (18, -78), (0, -94)) + bezier((0, -94), (-18, -78), (-17, -52), (0, -44))


def petal_sun(layer, cx, cy, unit, glow=True):
    """Draw the Sunpetal mark centred at (cx, cy); unit = pixels per mark unit (mark spans -100..100)."""
    if glow:
        # Blur only the alpha so the glow stays warm instead of fading through grey.
        mask = Image.new("L", layer.size, 0)
        r = 120 * unit
        ImageDraw.Draw(mask).ellipse([cx - r, cy - r, cx + r, cy + r], fill=190)
        g = Image.new("RGBA", layer.size, (255, 226, 154, 0))
        g.putalpha(mask.filter(ImageFilter.GaussianBlur(40 * unit)))
        layer.alpha_composite(g)
    d = ImageDraw.Draw(layer)
    for k in range(10):
        a = math.radians(k * 36)
        pts = [(cx + (x * math.cos(a) - y * math.sin(a)) * unit, cy + (x * math.sin(a) + y * math.cos(a)) * unit) for x, y in PETAL]
        d.polygon(pts, fill=(PEACH if k % 2 else SUN_A) + (255,))
    core = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    cd = ImageDraw.Draw(core)
    r = 40 * unit
    for i in range(int(r), 0, -1):
        t = 1 - i / r
        col = lerp(SUN_B, (255, 243, 207), t ** 0.8)
        ox, oy = cx - r * 0.16 * t, cy - r * 0.2 * t
        cd.ellipse([ox - i, oy - i, ox + i, oy + i], fill=col + (255,))
    layer.alpha_composite(core)


def artwork(scale=1.0):
    """Transparent layer: petal sun rising over two hills. scale < 1 shrinks into the maskable safe zone."""
    layer = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    c = S / 2

    def sx(v):
        return c + (v - c) * scale

    petal_sun(layer, c, sx(470), 3.5 * scale)
    d = ImageDraw.Draw(layer)
    d.ellipse([sx(-300), sx(700), sx(720), sx(1340)], fill=HILL_BACK + (255,))
    d.ellipse([sx(300), sx(740), sx(1330), sx(1380)], fill=HILL + (255,))
    d.ellipse([sx(-200), sx(880), sx(1220), sx(1500)], fill=LEAF_DARK + (255,))
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
            save(full, f, img.size[0], "RGB")


def splash_image(w, h):
    """Sky gradient with the petal sun rising over the hills, sized for a native splash screen."""
    img = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(img)
    for y in range(h):
        t = y / h
        d.line([(0, y), (w, y)], fill=lerp(SKY_TOP, (255, 246, 227), t))
    s = min(w, h)
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    petal_sun(layer, w / 2, h / 2 - s * 0.04, s * 0.0016)
    img = Image.alpha_composite(img.convert("RGBA"), layer)
    return img.convert("RGB")


def splashes():
    n = 0
    targets = list((ROOT / "android" / "app" / "src" / "main" / "res").rglob("splash.png"))
    targets += list((ROOT / "ios" / "App" / "App" / "Assets.xcassets").rglob("splash*.png"))
    for f in targets:
        w, h = Image.open(f).size
        splash_image(w, h).save(f, optimize=True)
        n += 1
    print("branded splash images:", n)


if __name__ == "__main__":
    web()
    if "--native" in sys.argv:
        native()
        splashes()
