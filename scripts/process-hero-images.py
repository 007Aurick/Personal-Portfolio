"""Export hero PNG: mask -> largest blob only -> hard alpha -> tight trim."""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from rembg import remove
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
HERO = ROOT / "public" / "hero"
SRC = Path(
    r"C:\Users\auric\.cursor\projects\c-Users-auric-personal-portfolio\assets"
) / (
    "c__Users_auric_AppData_Roaming_Cursor_User_workspaceStorage_89bd3317c1300d3023d256a35782287b_images_image-"
    "c36b480c-cef5-4ecb-9238-ebd554f9aca8.png"
)


def crop_label_and_waist(im: Image.Image) -> Image.Image:
    w, h = im.size
    px = im.convert("RGB").load()

    cut = h
    for y in range(h - 1, int(h * 0.82), -1):
        row_dark = sum(1 for x in range(0, w, max(1, w // 40)) if sum(px[x, y]) < 45)
        if row_dark > 0.7 * (w // max(1, w // 40)):
            cut = y
        else:
            break

    art_h = cut if cut < h - 8 else h
    return im.crop((0, 0, w, int(art_h * 0.68)))


def pad_for_rembg(im: Image.Image, px: int) -> Image.Image:
    w, h = im.size
    out = Image.new("RGBA", (w + px * 2, h + px * 2), (0, 0, 0, 0))
    out.paste(im, (px, px), im)
    return out


def refine_mask(mask: Image.Image) -> Image.Image:
    m = mask.convert("L")
    m = m.point(lambda p: 255 if p > 175 else 0)

    # open: drop thin bridges to background junk
    for _ in range(2):
        m = m.filter(ImageFilter.MinFilter(3))
    for _ in range(4):
        m = m.filter(ImageFilter.MaxFilter(3))

    arr = np.array(m) > 0
    labeled, count = ndimage.label(arr)
    if count <= 1:
        return Image.fromarray((arr * 255).astype(np.uint8), mode="L")

    sizes = ndimage.sum(arr, labeled, index=range(1, count + 1))
    keep = 1 + int(np.argmax(sizes))
    main = labeled == keep

    # dilate so fingers stay attached to hand
    main = ndimage.binary_dilation(main, iterations=2)
    return Image.fromarray((main * 255).astype(np.uint8), mode="L")


def cutout_from_mask(source: Image.Image, mask: Image.Image) -> Image.Image:
    src = source.convert("RGBA")
    m = mask.convert("L")
    if m.size != src.size:
        m = m.resize(src.size, Image.Resampling.LANCZOS)

    w, h = src.size
    s = np.array(src)
    ml = np.array(m) > 0
    out = np.zeros((h, w, 4), dtype=np.uint8)

    rgb = s[:, :, :3].astype(np.float32)
    lum = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
    sat = rgb.max(axis=2) - rgb.min(axis=2)

    keep = ml.copy()
    # drop gray/orange city haze even if mask touched it
    haze = (sat < 45) & (lum > 40) & (lum < 170)
    keep &= ~haze
    # keep eyes, palm, suit, dark armor
    keep |= ml & (lum > 215)
    keep |= ml & (rgb[:, :, 2] > rgb[:, :, 0] + 25) & (rgb[:, :, 2] > 90)
    keep |= ml & (sat > 50) & (lum < 195)
    keep |= ml & (lum < 92)

    out[keep, :3] = s[keep, :3]
    out[keep, 3] = 255

    return Image.fromarray(out, mode="RGBA")


def trim_transparent(im: Image.Image, alpha_min: int = 20) -> Image.Image:
    im = im.convert("RGBA")
    arr = np.array(im)[:, :, 3]
    ys, xs = np.where(arr > alpha_min)
    if len(xs) == 0:
        return im
    return im.crop((int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1))


def main() -> None:
    if not SRC.exists():
        raise FileNotFoundError(SRC)

    HERO.mkdir(parents=True, exist_ok=True)
    base = crop_label_and_waist(Image.open(SRC).convert("RGBA"))
    padded = pad_for_rembg(base, 80)

    raw_mask = remove(padded, only_mask=True)
    mask = refine_mask(raw_mask)
    cutout = cutout_from_mask(padded, mask)

    cutout = trim_transparent(cutout, alpha_min=20)

    dst = HERO / "batman-cowl-on.png"
    cutout.save(dst, "PNG")
    print(f"saved {dst} {cutout.size[0]}x{cutout.size[1]}")


if __name__ == "__main__":
    main()
