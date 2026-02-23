import re

def extract_number(value: str):
    """
    Normalizes string specs like '5000 mAh' or '5,000mAh' to the integer 5000.
    Returns None if no number is found.
    """
    if not value or value == "N/A" or value == "Unknown":
        return None

    # Remove commas
    clean_val = value.replace(",", "")
    nums = re.findall(r'\d+', clean_val)
    return int(nums[0]) if nums else None
