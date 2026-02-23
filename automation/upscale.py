import os
from PIL import Image
import shutil

os.makedirs("images", exist_ok=True)

print("Upscaling image (using Real-ESRGAN if available)...")
input_img_path = "images/device_clean.png"
upscaled_img_path = "images/device_upscaled.png"
final_img_path = "images/device_final.webp"

if not os.path.exists(input_img_path):
    print(f"Error: Could not find clean image at {input_img_path}")
    exit(1)

# Run the real-ESRGAN binary. Make sure to have it in PATH or specific directory.
exit_code = os.system(f"realesrgan-ncnn-vulkan -i {input_img_path} -o {upscaled_img_path}")

if exit_code != 0:
    print("Warning: realesrgan-ncnn-vulkan failed or is not installed.")
    print("Copying clean image as fallback for pipeline continuity.")
    shutil.copy(input_img_path, upscaled_img_path)
else:
    print("Done: Image Upscaled")

print("Optimizing format to WEBP...")
try:
    img = Image.open(upscaled_img_path)
    img.save(final_img_path, "WEBP", quality=90)
    print("Done: Image Optimized")
except Exception as e:
    print(f"Error during optimization: {e}")
