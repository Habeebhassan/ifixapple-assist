import time
import random

def check_imei_details(imei: str) -> dict:
    """
    Mock function to simulate an external IMEI lookup API (like Sickw).
    In production, this will make a requests.get() call to the real API.
    """
    # Simulate network delay
    time.sleep(1.5)
    
    # Basic validation
    if len(imei) != 15 or not imei.isdigit():
        return {
            "success": False,
            "error": "Invalid IMEI format. Must be 15 digits."
        }

    # For development: We use specific starting digits to trigger different test scenarios
    if imei.startswith("999"):
        # Simulate a Blacklisted/Stolen device
        return {
            "success": True,
            "data": {
                "imei": imei,
                "model": "iPhone 13 Pro Max",
                "storage": "256GB",
                "warranty_status": "Out of Warranty",
                "find_my_iphone": "ON",
                "blacklist_status": "BLACKLISTED",
                "sim_lock": "Locked"
            }
        }
    
    # Default scenario: Clean device
    # Randomize storage for a bit of realism
    storage_options = ["128GB", "256GB", "512GB"]
    
    return {
        "success": True,
        "data": {
            "imei": imei,
            "model": "iPhone 14",
            "storage": random.choice(storage_options),
            "warranty_status": "Active",
            "find_my_iphone": "OFF",
            "blacklist_status": "CLEAN",
            "sim_lock": "Unlocked"
        }
    }
