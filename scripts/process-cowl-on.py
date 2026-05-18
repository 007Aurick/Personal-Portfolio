"""Remove background from user-provided cowl-on hero image (no generation)."""
from pathlib import Path

from PIL import Image
from rembg import remove

SRC = Path(
    r"C:\Users\auric\.cursor\projects\c-Users-auric-personal-portfolio\assets"
    r"\c__Users_auric_AppData_Roaming_Cursor_User_workspaceStorage_89bd3317c1300d3023d256a35782287b_images_image-c36b480c-cef5-4ecb-9238-ebd554f9aca8.png"
)
DST = Path(__file__).resolve().parent.parent / "public" / "hero" / "batman-cowl-on.png"


def crop_cowl_label(im: Image.Image) -> Image.Image:
    """Drop bottom bar with 'COWL' label if present."""
    w, h = im.size
    px = im.convert("RGB").load()
    cut = h
    for y in range(h - 1, int(h * 0.82), -1):
        row_dark = sum(1 for x in range(0, w, max(1, w // 40)) if sum(px[x, y]) < 45)
        if row_dark > 0.7 * (w // max(1, w // 40)):
            cut = y
        else:
            break
    if cut < h - 8:
        return im.crop((0, 0, w, cut))
    return im


def main() -> None:
    im = Image.open(SRC).convert("RGBA")
    im = crop_cowl_label(im)
    out = remove(im)
    DST.parent.mkdir(parents=True, exist_ok=True)
    out.save(DST, "PNG")
    print(f"saved {DST} ({out.size[0]}x{out.size[1]})")


if __name__ == "__main__":
    main()
