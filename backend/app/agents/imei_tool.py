import time
import random
import os
import requests

def check_imei_details(imei: str) -> dict:
    # Basic validation
    if len(imei) != 15 or not imei.isdigit():
        return {"success": False, "error": "Invalid IMEI format."}

    # --- REAL API INTEGRATION (RapidAPI - imei-checker4) ---
    api_key = os.environ.get("RAPIDAPI_KEY")
    api_host = os.environ.get("RAPIDAPI_HOST", "imei-checker4.p.rapidapi.com") 
    
    if api_key and not imei.startswith("999"):
        try:
            url = f"https://{api_host}/imei"
            
            headers = {
                "content-type": "application/x-www-form-urlencoded",
                "x-rapidapi-host": api_host,
                "x-rapidapi-key": api_key
            }
            
            # Using data=payload formats it as x-www-form-urlencoded 
            # exactly like the curl command requires.
            payload = {"imei": imei}
            
            response = requests.post(url, headers=headers, data=payload)
            
            # Catch unauthorized or other errors cleanly
            if response.status_code == 401:
                return {"success": False, "error": "RapidAPI Key is invalid or unauthorized."}
            elif response.status_code == 403:
                return {"success": False, "error": "You are not subscribed to this RapidAPI endpoint."}
                
            response.raise_for_status()
            data = response.json()
            
            # Note: We safely use .get() here to fetch fields, as different RapidAPI providers
            # name their JSON keys slightly differently.
            return {
                "success": True,
                "data": {
                    "imei": imei,
                    "model": data.get("model", data.get("device_name", "Unknown Device")),
                    "storage": data.get("storage", data.get("capacity", "Unknown")), 
                    "warranty_status": data.get("warranty", "Unknown"),
                    "find_my_iphone": data.get("fmi", data.get("find_my_iphone", "Unknown")), 
                    "blacklist_status": data.get("blacklist", data.get("blacklist_status", "UNKNOWN")),
                    "sim_lock": data.get("sim_lock", data.get("lock_status", "Unknown")),
                    "carrier": data.get("network", data.get("carrier", "Unknown")),
                    "contract_status": data.get("contract", "Unknown")
                }
            }
        except Exception as e:
            print(f"RapidAPI Error: {e}")
            return {"success": False, "error": f"API Error: {str(e)}"}

    # --- MOCK DATA FALLBACK ---
    time.sleep(1.5)
    
    if imei.startswith("999"):
        return {
            "success": True,
            "data": {
                "imei": imei,
                "model": "iPhone 13 Pro Max",
                "storage": "256GB",
                "warranty_status": "Out of Warranty",
                "find_my_iphone": "ON",
                "blacklist_status": "BLACKLISTED",
                "sim_lock": "Locked",
                "carrier": "AT&T",
                "contract_status": "Unpaid Bills"
            }
        }
    
    return {
        "success": True,
        "data": {
            "imei": imei,
            "model": "iPhone 14 (Mock Data)",
            "storage": "128GB",
            "warranty_status": "Active",
            "find_my_iphone": "OFF",
            "blacklist_status": "CLEAN",
            "sim_lock": "Locked",
            "carrier": "T-Mobile",
            "contract_status": "Clean"
        }
    }