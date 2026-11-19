# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import Optional, Dict, Any
# from dotenv import load_dotenv
# import os
# import requests
# from supabase import create_client, Client

# # Import our new IMEI tool
# from app.agents.imei_tool import check_imei_details

# # Load environment variables
# load_dotenv()

# app = FastAPI(title="iFixApple Assist API")

# # IMPORTANT: CORS origins must NOT have a trailing slash at the end!
# origins = [
#     "http://localhost:3000",
#     "http://127.0.0.1:3000",
#     "https://ifixapple-assist.vercel.app", 
#     "https://dev.ifxapple.com.ng"
# ]

# # Setup CORS to allow all origins for local development to prevent fetch failures
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,  # Allow all origins for development; restrict in production
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Initialize Supabase client
# supabase_url: str = os.environ.get("SUPABASE_URL")
# supabase_key: str = os.environ.get("SUPABASE_KEY")
# if supabase_url and supabase_key:
#     supabase: Client = create_client(supabase_url, supabase_key)
# else:
#     supabase = None

# # API Keys
# DIFY_API_KEY = os.environ.get("DIFY_API_KEY")
# DIFY_API_URL = os.environ.get("DIFY_API_URL", "https://api.dify.ai/v1")

# GOOGLE_PLACES_API_KEY = os.environ.get("GOOGLE_PLACES_API_KEY")
# GOOGLE_PLACE_ID = os.environ.get("GOOGLE_PLACE_ID", "ChIJVcJ5S8WKOxARiUHvs6g5674")

# # --- PYDANTIC MODELS ---
# class ChatRequest(BaseModel):
#     query: str
#     user_id: str = "guest_user"
#     conversation_id: str = ""

# class RepairTicketRequest(BaseModel):
#     user_id: str
#     device_model: str
#     issue_type: str
#     quote_amount: Optional[float] = None

# class TradeInOfferRequest(BaseModel):
#     user_id: str
#     device_details: Dict[str, Any]
#     grade: str
#     offered_price: float

# # --- IMPLEMENTATION 2: RELAXED IMEI VALIDATION FOR DEV TESTING ---
# def is_valid_imei_format(imei: str) -> bool:
#     # Relaxed algorithm for testing so fake numbers don't instantly fail.
#     # In production, we will switch this back to the strict Luhn mod 10 check.
#     if len(imei) < 10 or not imei.isalnum():
#         return False
#     return True

# @app.get("/")
# def read_root():
#     return {"message": "iFixApple Assist Backend is running!"}

# # --- AI CHAT ROUTE ---
# @app.post("/api/chat")
# def chat_with_agent(request: ChatRequest):
#     if not DIFY_API_KEY:
#         raise HTTPException(status_code=500, detail="Dify API Key is not configured.")

#     headers = {
#         "Authorization": f"Bearer {DIFY_API_KEY}",
#         "Content-Type": "application/json"
#     }

#     payload = {
#         "inputs": {},
#         "query": request.query,
#         "response_mode": "blocking",
#         "user": request.user_id
#     }
    
#     if request.conversation_id and request.conversation_id.strip() != "":
#         payload["conversation_id"] = request.conversation_id

#     try:
#         response = requests.post(f"{DIFY_API_URL}/chat-messages", headers=headers, json=payload)
        
#         if not response.ok:
#             error_details = response.text
#             print(f"Dify API Rejected Request: {error_details}")
#             response.raise_for_status()
            
#         data = response.json()
        
#         return {
#             "answer": data.get("answer", "No answer provided by agent."),
#             "conversation_id": data.get("conversation_id", ""),
#             "user_id": request.user_id
#         }
#     except requests.exceptions.RequestException as e:
#         print(f"Dify API Network Error: {e}")
#         raise HTTPException(status_code=502, detail="Failed to communicate with AI agent.")

# # --- GOOGLE REVIEWS ROUTE ---
# @app.get("/api/reviews")
# def get_google_reviews():
#     """
#     Fetches live reviews from the Google Places API.
#     Sorts them to show 5-star reviews first.
#     """
#     if not GOOGLE_PLACES_API_KEY:
#          raise HTTPException(status_code=500, detail="Google API Key not configured.")
    
#     url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={GOOGLE_PLACE_ID}&fields=reviews,rating,user_ratings_total&key={GOOGLE_PLACES_API_KEY}"
    
#     try:
#         response = requests.get(url, timeout=10)
#         response.raise_for_status()
#         data = response.json()
        
#         if data.get("status") != "OK":
#             error_msg = data.get("error_message", "Unknown Google API Error")
#             print(f"Google API Error: {data.get('status')} - {error_msg}")
#             raise HTTPException(status_code=400, detail=f"Google API rejected request: {error_msg}")
            
#         result = data.get("result", {})
        
#         # Grab reviews, sort by highest rating, and take the top 3
#         reviews = result.get("reviews", [])
#         top_reviews = sorted(reviews, key=lambda x: x.get("rating", 0), reverse=True)[:3]
        
#         return {
#             "success": True,
#             "rating": result.get("rating", 4.9),
#             "total_ratings": result.get("user_ratings_total", 0),
#             "reviews": top_reviews
#         }
#     except requests.exceptions.RequestException as e:
#         print(f"Network error fetching reviews: {e}")
#         raise HTTPException(status_code=502, detail="Network error communicating with Google API.")
#     except HTTPException:
#         raise
#     except Exception as e:
#         print(f"Unexpected Reviews Error: {e}")
#         raise HTTPException(status_code=500, detail=f"Failed to communicate with Google API: {str(e)}")

# # --- THE IMEI ROUTE ---
# @app.get("/api/imei/{imei}")
# def check_imei(imei: str):
#     clean_imei = imei.replace(" ", "").replace("-", "")

#     if not is_valid_imei_format(clean_imei):
#         raise HTTPException(
#             status_code=400, 
#             detail="Invalid IMEI format. It must be at least 10 alphanumeric characters."
#         )

#     result = check_imei_details(clean_imei)
    
#     if not result["success"]:
#         raise HTTPException(status_code=400, detail=result["error"])
        
#     return result

# # --- BOOKING & TRADE-IN ROUTES ---
# @app.post("/api/tickets")
# def create_repair_ticket(ticket: RepairTicketRequest):
#     if not supabase:
#         raise HTTPException(status_code=500, detail="Database connection not configured.")
    
#     try:
#         data = supabase.table("repair_tickets").insert({
#             "user_id": ticket.user_id,
#             "device_model": ticket.device_model,
#             "issue_type": ticket.issue_type,
#             "quote_amount": ticket.quote_amount,
#             "status": "Received"
#         }).execute()
#         return {"success": True, "data": data.data}
#     except Exception as e:
#         print(f"Supabase Error: {e}")
#         raise HTTPException(status_code=400, detail="Failed to create repair ticket.")

# @app.post("/api/trade-in")
# def create_trade_in_offer(offer: TradeInOfferRequest):
#     if not supabase:
#         raise HTTPException(status_code=500, detail="Database connection not configured.")
    
#     try:
#         data = supabase.table("trade_in_offers").insert({
#             "user_id": offer.user_id,
#             "device_details": offer.device_details,
#             "grade": offer.grade,
#             "offered_price": offer.offered_price,
#             "status": "Pending Review"
#         }).execute()
#         return {"success": True, "data": data.data}
#     except Exception as e:
#         print(f"Supabase Error: {e}")
#         raise HTTPException(status_code=400, detail="Failed to create trade-in offer.")

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
from dotenv import load_dotenv
import os
import requests
from supabase import create_client, Client

# Import our new IMEI tool
from app.agents.imei_tool import check_imei_details

# Load environment variables
load_dotenv()

app = FastAPI(title="iFixApple Assist API")

# IMPORTANT: CORS origins must NOT have a trailing slash at the end!
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://ifixapple-assist.vercel.app", 
    "https://dev.ifxapple.com.ng"
]

# Setup CORS to allow all origins for local development to prevent fetch failures
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow all origins for development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase client
supabase_url: str = os.environ.get("SUPABASE_URL")
supabase_key: str = os.environ.get("SUPABASE_KEY")
if supabase_url and supabase_key:
    supabase: Client = create_client(supabase_url, supabase_key)
else:
    supabase = None

# API Keys
DIFY_API_KEY = os.environ.get("DIFY_API_KEY")
DIFY_API_URL = os.environ.get("DIFY_API_URL", "https://api.dify.ai/v1")

GOOGLE_PLACES_API_KEY = os.environ.get("GOOGLE_PLACES_API_KEY")
GOOGLE_PLACE_ID = os.environ.get("GOOGLE_PLACE_ID", "ChIJVcJ5S8WKOxARiUHvs6g5674")

# --- PYDANTIC MODELS ---
class ChatRequest(BaseModel):
    query: str
    user_id: str = "guest_user"
    conversation_id: str = ""

class RepairTicketRequest(BaseModel):
    user_id: str
    device_model: str
    issue_type: str
    quote_amount: Optional[float] = None

class TradeInOfferRequest(BaseModel):
    user_id: str
    device_details: Dict[str, Any]
    grade: str
    offered_price: float

class TicketStatusUpdate(BaseModel):
    status: str
    user_email: str
    device_model: str

# --- IMPLEMENTATION 2: RELAXED IMEI VALIDATION FOR DEV TESTING ---
def is_valid_imei_format(imei: str) -> bool:
    # Relaxed algorithm for testing so fake numbers don't instantly fail.
    # In production, we will switch this back to the strict Luhn mod 10 check.
    if len(imei) < 10 or not imei.isalnum():
        return False
    return True

@app.get("/")
def read_root():
    return {"message": "iFixApple Assist Backend is running!"}

# --- AI CHAT ROUTE ---
@app.post("/api/chat")
def chat_with_agent(request: ChatRequest):
    if not DIFY_API_KEY:
        raise HTTPException(status_code=500, detail="Dify API Key is not configured.")

    headers = {
        "Authorization": f"Bearer {DIFY_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "inputs": {},
        "query": request.query,
        "response_mode": "blocking",
        "user": request.user_id
    }
    
    if request.conversation_id and request.conversation_id.strip() != "":
        payload["conversation_id"] = request.conversation_id

    try:
        response = requests.post(f"{DIFY_API_URL}/chat-messages", headers=headers, json=payload)
        
        if not response.ok:
            error_details = response.text
            print(f"Dify API Rejected Request: {error_details}")
            response.raise_for_status()
            
        data = response.json()
        
        return {
            "answer": data.get("answer", "No answer provided by agent."),
            "conversation_id": data.get("conversation_id", ""),
            "user_id": request.user_id
        }
    except requests.exceptions.RequestException as e:
        print(f"Dify API Network Error: {e}")
        raise HTTPException(status_code=502, detail="Failed to communicate with AI agent.")

# --- GOOGLE REVIEWS ROUTE ---
@app.get("/api/reviews")
def get_google_reviews():
    """
    Fetches live reviews from the Google Places API.
    Sorts them to show 5-star reviews first.
    """
    if not GOOGLE_PLACES_API_KEY:
         raise HTTPException(status_code=500, detail="Google API Key not configured.")
    
    url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={GOOGLE_PLACE_ID}&fields=reviews,rating,user_ratings_total&key={GOOGLE_PLACES_API_KEY}"
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if data.get("status") != "OK":
            error_msg = data.get("error_message", "Unknown Google API Error")
            print(f"Google API Error: {data.get('status')} - {error_msg}")
            raise HTTPException(status_code=400, detail=f"Google API rejected request: {error_msg}")
            
        result = data.get("result", {})
        
        # Grab reviews, sort by highest rating, and take the top 3
        reviews = result.get("reviews", [])
        top_reviews = sorted(reviews, key=lambda x: x.get("rating", 0), reverse=True)[:3]
        
        return {
            "success": True,
            "rating": result.get("rating", 4.9),
            "total_ratings": result.get("user_ratings_total", 0),
            "reviews": top_reviews
        }
    except requests.exceptions.RequestException as e:
        print(f"Network error fetching reviews: {e}")
        raise HTTPException(status_code=502, detail="Network error communicating with Google API.")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected Reviews Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to communicate with Google API: {str(e)}")

# --- THE IMEI ROUTE ---
@app.get("/api/imei/{imei}")
def check_imei(imei: str):
    clean_imei = imei.replace(" ", "").replace("-", "")

    if not is_valid_imei_format(clean_imei):
        raise HTTPException(
            status_code=400, 
            detail="Invalid IMEI format. It must be at least 10 alphanumeric characters."
        )

    result = check_imei_details(clean_imei)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
        
    return result

# --- BOOKING & TRADE-IN ROUTES ---
@app.post("/api/tickets")
def create_repair_ticket(ticket: RepairTicketRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection not configured.")
    
    try:
        data = supabase.table("repair_tickets").insert({
            "user_id": ticket.user_id,
            "device_model": ticket.device_model,
            "issue_type": ticket.issue_type,
            "quote_amount": ticket.quote_amount,
            "status": "Received"
        }).execute()
        return {"success": True, "data": data.data}
    except Exception as e:
        print(f"Supabase Error: {e}")
        raise HTTPException(status_code=400, detail="Failed to create repair ticket.")

@app.put("/api/tickets/{ticket_id}/status")
def update_ticket_status(ticket_id: str, update: TicketStatusUpdate, background_tasks: BackgroundTasks):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection not configured.")
    
    try:
        # 1. Update ticket status in Supabase
        data = supabase.table("repair_tickets").update({"status": update.status}).eq("id", ticket_id).execute()
        
        # 2. Dispatch email notification in the background so the UI updates instantly
        background_tasks.add_task(send_status_email, update.user_email, update.device_model, update.status, ticket_id)
        
        return {"success": True, "data": data.data}
    except Exception as e:
        print(f"Supabase Error: {e}")
        raise HTTPException(status_code=400, detail="Failed to update ticket status.")

def send_status_email(email: str, device: str, status: str, ticket_id: str):
    """
    Placeholder for a real email integration (like Resend, SendGrid, or Postmark).
    This simulates an email being sent by printing the rich text to the server terminal.
    """
    print("\n" + "="*50)
    print(f"📧 [EMAIL DISPATCHED] To: {email}")
    if status == "In Progress":
        print(f"Subject: Repair Initiated - {device}")
        print(f"Body: Great news! Our engineers have started working on your {device}.")
        print("We will notify you the moment it is ready for pickup.")
    elif status == "Completed":
        print(f"Subject: Ready for Pickup! - {device}")
        print(f"Body: Your {device} has been successfully repaired and is ready for pickup at our Ajah lab.")
        print("\nToo busy to pick it up? Click here to request VIP Dispatch delivery:")
        print(f"👉 https://app.ifixapple.com.ng/book?delivery=dispatch&ticket={ticket_id}")
    print("="*50 + "\n")

@app.post("/api/trade-in")
def create_trade_in_offer(offer: TradeInOfferRequest):
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection not configured.")
    
    try:
        data = supabase.table("trade_in_offers").insert({
            "user_id": offer.user_id,
            "device_details": offer.device_details,
            "grade": offer.grade,
            "offered_price": offer.offered_price,
            "status": "Pending Review"
        }).execute()
        return {"success": True, "data": data.data}
    except Exception as e:
        print(f"Supabase Error: {e}")
        raise HTTPException(status_code=400, detail="Failed to create trade-in offer.")