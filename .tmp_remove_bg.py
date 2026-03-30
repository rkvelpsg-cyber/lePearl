from rembg import remove
from PIL import Image
from io import BytesIO

inp = r"h:\newLePearl\public\DrBablick.png"
out = inp

with open(inp, "rb") as f:
    data = f.read()

result = remove(data)
img = Image.open(BytesIO(result)).convert("RGBA")
white = Image.new("RGBA", img.size, (255, 255, 255, 255))
white.alpha_composite(img)
white.convert("RGB").save(out, "PNG")
print("saved", out)
