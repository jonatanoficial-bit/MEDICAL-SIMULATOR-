from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "icons" / "icon_01.png"
OUTPUT = ROOT / "assets" / "icons" / "pwa"


def radial_background(size: int) -> Image.Image:
    image = Image.new("RGBA", (size, size), (2, 8, 20, 255))
    pixels = image.load()
    center_x, center_y = size * 0.45, size * 0.38
    radius = size * 0.9
    for y in range(size):
        for x in range(size):
            distance = (((x - center_x) ** 2 + (y - center_y) ** 2) ** 0.5) / radius
            glow = max(0.0, 1.0 - distance)
            pixels[x, y] = (
                int(2 + 3 * glow),
                int(8 + 24 * glow),
                int(20 + 42 * glow),
                255,
            )
    return image


def render_icon(size: int, safe_scale: float) -> Image.Image:
    canvas = radial_background(size)
    draw = ImageDraw.Draw(canvas, "RGBA")
    inset = max(2, round(size * 0.035))
    draw.rounded_rectangle(
        (inset, inset, size - inset - 1, size - inset - 1),
        radius=round(size * 0.22),
        outline=(58, 191, 255, 112),
        width=max(2, round(size * 0.009)),
    )

    source = Image.open(SOURCE).convert("RGBA")
    alpha_box = source.getchannel("A").getbbox()
    symbol = source.crop(alpha_box)
    target = round(size * safe_scale)
    symbol.thumbnail((target, target), Image.Resampling.LANCZOS)
    x = (size - symbol.width) // 2
    y = (size - symbol.height) // 2 - round(size * 0.015)

    glow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    glow.paste(symbol, (x, y), symbol)
    glow = glow.filter(ImageFilter.GaussianBlur(max(2, size * 0.018)))
    blue = Image.new("RGBA", canvas.size, (26, 156, 255, 100))
    canvas.alpha_composite(Image.composite(blue, Image.new("RGBA", canvas.size), glow.getchannel("A")))
    canvas.alpha_composite(symbol, (x, y))
    return canvas.convert("RGB")


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    targets = {
        "icon-192.png": (192, 0.64),
        "icon-512.png": (512, 0.64),
        "icon-maskable-192.png": (192, 0.48),
        "icon-maskable-512.png": (512, 0.48),
        "apple-touch-icon.png": (180, 0.62),
    }
    for name, (size, safe_scale) in targets.items():
        render_icon(size, safe_scale).save(OUTPUT / name, "PNG", optimize=True)
        print(f"generated {OUTPUT / name}")


if __name__ == "__main__":
    main()
