from normalizer import extract_number

def compare_numeric(a: str, b: str, higher_is_better=True):
    val_a = extract_number(a)
    val_b = extract_number(b)

    if val_a is None and val_b is None:
        return "Tie"
    if val_a is None:
        return "B"
    if val_b is None:
        return "A"

    if val_a > val_b:
        return "A" if higher_is_better else "B"
    elif val_b > val_a:
        return "B" if higher_is_better else "A"
    
    return "Tie"

def evaluate_winner(specs_a, specs_b, category_key: str):
    """
    Looks at specific spec keys out of the raw data.
    e.g. category_key = 'battery_capacity_mah'
    We will find the value in specs_a and specs_b, then compare.
    """
    map_a = {s["spec_key"]: s["raw_value"] for s in specs_a}
    map_b = {s["spec_key"]: s["raw_value"] for s in specs_b}

    val_a = map_a.get(category_key, "")
    val_b = map_b.get(category_key, "")

    # For some keys, higher isn't better (e.g., weight, charging time). We'd inject logic here.
    return compare_numeric(val_a, val_b, higher_is_better=True)

def generate_verdict(specs_a, specs_b):
    """
    A smart evaluator that picks out winners across a few predefined major keys.
    """
    categories = {
        "battery": evaluate_winner(specs_a, specs_b, "battery_capacity_mah"),
        "resolution": evaluate_winner(specs_a, specs_b, "resolution"),
        "ram": evaluate_winner(specs_a, specs_b, "ram_size"),
        # Add more logic here to handle camera megapixels, charging speeds, etc.
    }
    return categories
