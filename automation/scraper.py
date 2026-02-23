import requests
from bs4 import BeautifulSoup
import os
import json

URL = "https://www.gsmarena.com/samsung_galaxy_s25_ultra-12771.php"

def scrape_device():
    os.makedirs("images", exist_ok=True)
    print(f"Scraping {URL}...")
    
    html = requests.get(URL, headers={"User-Agent": "Mozilla/5.0"}).text
    soup = BeautifulSoup(html, "html.parser")

    # NEW: Get Brand and Model from page
    # Usually "Samsung Galaxy S24 Ultra - Full phone specifications"
    title = soup.find("h1", class_="specs-phone-name-title").text
    brand = title.split(" ")[0] # "Samsung"
    model = " ".join(title.split(" ")[1:]) # "Galaxy S24 Ultra"

    img_div = soup.find("div", class_="specs-photo-main")
    src = img_div.find("img")["src"]

    print(f"Downloading {brand} {model}...")
    img_data = requests.get(src, headers={"User-Agent": "Mozilla/5.0"}).content
    with open("images/device_raw.jpg", "wb") as f:
        f.write(img_data)

    # Save metadata for next steps
    with open("metadata.json", "w") as f:
        json.dump({"brand": brand, "model": model}, f)

    print("Done: Image and Metadata saved.")

if __name__ == "__main__":
    scrape_device()
