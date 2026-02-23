from removebg import RemoveBg
import os
from dotenv import load_dotenv

load_dotenv()

os.makedirs("images", exist_ok=True)

input_path = "images/device_raw.jpg"
output_path = "images/device_clean.png"

print("Removing background using Remove.bg API...")
try:
    api_key = os.getenv("REMOVE_BG_API_KEY")
    if not api_key or api_key == "xxxx":
        print("Warning: REMOVE_BG_API_KEY not set in .env. Skipping background removal.")
        # As a fallback for the pipeline, let's just copy the raw image to clean
        import shutil
        shutil.copy(input_path, output_path)
        print("Warning: Copied raw image to clean as fallback (background NOT removed).")
    else:
        rmbg = RemoveBg(api_key, "error.log")
        rmbg.remove_background_from_img_file(input_path)
        
        # removebg library saves it as [filename]_no_bg.png in the same dir
        # let's move it to our clean folder
        generated_file = input_path.replace(".jpg", "_no_bg.png")
        if os.path.exists(generated_file):
            if os.path.exists(output_path):
                os.remove(output_path)
            os.rename(generated_file, output_path)
            print("Done: Background Removed")
        else:
            print("Error: API call succeeded but output file not found. Fallback: Copying raw image...")
            import shutil
            shutil.copy(input_path, output_path)

except Exception as e:
    print(f"Error removing background: {e}")
    print("Fallback: Copying raw image...")
    import shutil
    if os.path.exists(input_path):
        shutil.copy(input_path, output_path)
