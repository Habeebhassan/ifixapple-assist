# import os
# import requests
# from typing import Dict, Any

# def check_imei_details(identifier: str) -> Dict[str, Any]:
#     """
#     Free IMEI and Serial Number parsing tool for iFixApple Assist.
#     Uses open-source structural parsing for model recognition and 
#     mathematically generates realistic carrier data without expensive APIs.
#     """
#     # 1. Clean and normalize the identifier
#     identifier = identifier.strip().upper()
#     if len(identifier) < 10 or not identifier.isalnum():
#         return {"success": False, "error": "Invalid IMEI or Serial Number format."}

#     is_serial = not identifier.isdigit()

#     # --- FREE LIVE DEVICE MODEL IDENTIFICATION (TAC PARSING) ---
#     device_model = "Unknown Apple Device"
#     device_storage = "Standard Storage"
    
#     if not is_serial and len(identifier) >= 8:
#         # The first 8 digits (Type Allocation Code) identify the specific phone model
#         tac = identifier[:8]
#         try:
#             # Check against public open-source mobile hardware catalogs
#             tac_url = f"https://iphonedb.org/{tac}" 
#             response = requests.get(tac_url, timeout=5.0)
#             if response.ok:
#                 data = response.json()
#                 device_model = data.get("model", data.get("device_name", device_model))
#                 device_storage = data.get("storage", "128GB/256GB")
#         except Exception:
#             # Fallback model parsing based on standard Apple hardware digit blocks
#             if identifier.startswith("35") or identifier.startswith("01"):
#                 device_model = "iPhone (Model automatically recognized)"
#             else:
#                 device_model = "iPad / Apple Watch (Cellular)"

#     # If the user input is a Serial Number (e.g., MacBooks, iMacs)
#     if is_serial:
#         if len(identifier) == 12:
#             device_model = "MacBook Pro / Air (Serial Number)"
#         else:
#             device_model = "Apple Device (Serial Number)"

#     # --- ALGORITHMIC CARRIER & STATUS SIMULATION ---
#     # Since live network lookups cost money, we dynamically generate realistic data 
#     # based on the last digit of the IMEI. This ensures your frontend gets dynamic, 
#     # changing responses for testing, instead of static hardcoded text.
    
#     last_digit = int(identifier[-1]) if identifier[-1].isdigit() else 5
    
#     # Mathematical state mapping based on IMEI variations
#     is_blacklisted = "CLEAN" if last_digit % 3 != 0 else "BLACKLISTED"
#     is_fmi_on = "OFF" if last_digit % 2 == 0 else "ON"
#     is_sim_locked = "Unlocked" if last_digit > 4 else "Locked"
    
#     carriers = ["T-Mobile", "AT&T", "Vodafone", "Verizon", "O2"]
#     assigned_carrier = carriers[last_digit % len(carriers)]

#     return {
#         "success": True,
#         "data": {
#             "identifier": identifier,
#             "type": "Serial Number" if is_serial else "IMEI",
#             "model": device_model,
#             "storage": device_storage, 
#             "warranty_status": "Active (AppleCare+)" if last_digit > 3 else "Expired",
#             "find_my_iphone": is_fmi_on, 
#             "blacklist_status": is_blacklisted,
#             "sim_lock": is_sim_locked,
#             "carrier": "Wi-Fi Only" if is_serial else assigned_carrier,
#             "contract_status": "Clean / Out of Contract" if is_blacklisted == "CLEAN" else "Financing Flagged / Unpaid Balance"
#         }
#     }

import os
import requests
from typing import Dict, Any

def check_imei_details(identifier: str) -> Dict[str, Any]:
    """
    Free IMEI and Serial Number parsing tool for iFixApple Assist.
    Uses a local dictionary mock for testing to prevent burning paid API credits,
    ensuring exact model string matches for the Trade-In database.
    """
    # 1. Clean and normalize the identifier
    identifier = identifier.strip().upper()
    
    # --- NEW DEBUG PRINTS TO VERIFY LOCAL EXECUTION ---
    print("\n" + "="*40)
    print(f"🚀 [DEBUG] IMEI CHECK INITIATED: {identifier}")
    print("🧠 [DEBUG] USING NEW LOCAL MOCK SYSTEM!")
    print("="*40 + "\n")

    if len(identifier) < 10 or not identifier.isalnum():
        return {"success": False, "error": "Invalid IMEI or Serial Number format."}

    is_serial = not identifier.isdigit()

    # --- SMART LOCAL MOCK IDENTIFICATION (TESTING MODE) ---
    device_model = "Unknown Apple Device"
    device_storage = "256GB"
    
    if not is_serial and len(identifier) >= 8:
        # We use the last digit of the IMEI to dynamically assign a real Apple 
        # model name so you can test your database mapping perfectly!
        last_digit = int(identifier[-1])
        
        if last_digit in [0, 1]:
            device_model = "iPhone 13"
        elif last_digit in [2, 3]:
            device_model = "iPhone 14 Pro"
        elif last_digit in [4, 5]:
            device_model = "iPhone 15 Pro Max"
        elif last_digit in [6, 7]:
            device_model = "iPhone 16 Pro Max"
        else:
            device_model = "iPhone 17 Pro Max" # Maps to the new device you added!
            
    # If the user input is a Serial Number (e.g., MacBooks, iMacs)
    if is_serial:
        if len(identifier) == 12:
            device_model = "MacBook Pro M3"
        else:
            device_model = "iPad Pro 11-inch"

    # --- ALGORITHMIC CARRIER & STATUS SIMULATION ---
    last_digit_sim = int(identifier[-1]) if identifier[-1].isdigit() else 5
    
    # Mathematical state mapping based on IMEI variations
    is_blacklisted = "CLEAN" if last_digit_sim % 3 != 0 else "BLACKLISTED"
    is_fmi_on = "OFF" if last_digit_sim % 2 == 0 else "ON"
    is_sim_locked = "Unlocked" if last_digit_sim > 4 else "Locked"
    
    carriers = ["T-Mobile", "AT&T", "Vodafone", "Verizon", "O2"]
    assigned_carrier = carriers[last_digit_sim % len(carriers)]

    return {
        "success": True,
        "data": {
            "identifier": identifier,
            "type": "Serial Number" if is_serial else "IMEI",
            "model": device_model,
            "storage": device_storage, 
            "warranty_status": "Active (AppleCare+)" if last_digit_sim > 3 else "Expired",
            "find_my_iphone": is_fmi_on, 
            "blacklist_status": is_blacklisted,
            "sim_lock": is_sim_locked,
            "carrier": "Wi-Fi Only" if is_serial else assigned_carrier,
            "contract_status": "Clean / Out of Contract" if is_blacklisted == "CLEAN" else "Financing Flagged / Unpaid Balance"
        }
    }