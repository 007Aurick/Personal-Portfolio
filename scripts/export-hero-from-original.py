"""Checkerboard PNG -> transparent aurick-hero.png (your art, no rembg/AI)."""
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(
    r"C:\Users\auric\.cursor\projects\c-Users-auric-personal-portfolio\assets"
) / (
    "c__Users_auric_AppData_Roaming_Cursor_User_workspaceStorage_89bd3317c1300d3023d256a35782287b_images_image-"
    "3995fc4b-5a29-44fc-9b89-10ebf7ef623b.png"
)
OUT_PUBLIC = ROOT / "public" / "hero" / "batman-cowl-on.png"
OUT_ASSET = ROOT / "src" / "assets" / "aurick-hero.png"


def is_checkerboard(rgb: np.ndarray) -> np.ndarray:
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    lo = np.minimum(np.minimum(r, g), b)
    hi = np.maximum(np.maximum(r, g), b)
    return (lo >= 155) & ((hi - lo) <= 35)


def checkerboard_to_alpha(im: Image.Image) -> Image.Image:
    arr = np.array(im.convert("RGB"), dtype=np.uint8)
    h, w = arr.shape[:2]
    bg = is_checkerboard(arr)
    seed = np.zeros((h, w), dtype=bool)
    seed[0, :] = seed[-1, :] = seed[:, 0] = seed[:, -1] = True
    seed &= bg
    filled = ndimage.binary_propagation(seed, mask=bg)
    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    rgba[..., :3] = arr
    rgba[..., 3] = np.where(filled, 0, 255).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")


def main() -> None:
    img = checkerboard_to_alpha(Image.open(SRC))
    OUT_PUBLIC.parent.mkdir(parents=True, exist_ok=True)
    OUT_ASSET.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT_PUBLIC, "PNG")
    img.save(OUT_ASSET, "PNG")
    print(f"saved {OUT_ASSET} {img.size[0]}x{img.size[1]}")


if __name__ == "__main__":
    main()
