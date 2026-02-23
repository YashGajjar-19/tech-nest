import os

print("Starting Device Image Automation Pipeline...\n")

print("--- Step 1: Scraping ---")
os.system("python scraper.py")

print("\n--- Step 2: Removing Background ---")
os.system("python remove_bg.py")

print("\n--- Step 3: Upscaling & Optimizing ---")
os.system("python upscale.py")

print("\n--- Step 4: Uploading & Saving to DB ---")
os.system("python upload.py")

print("\n--- Step 5: Cleaning Up ---")
for f in ["images/device_raw.jpg", "images/device_clean.png", "images/device_upscaled.png"]:
    if os.path.exists(f):
        os.remove(f)
print("Kept only the final optimized image in 'images/' folder.")

print("\nPipeline Finished!")
