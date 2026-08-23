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

# origins = [
#     "https://ifixapple-assist.vercel.app/",
#     "http://localhost:3000",  # For local development
# ]

# # 


# # Setup CORS to allow all origins for local development to prevent fetch failures
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
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

# # Dify Config
# DIFY_API_KEY = os.environ.get("DIFY_API_KEY")
# DIFY_API_URL = os.environ.get("DIFY_API_URL", "https://api.dify.ai/v1")

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
#         "conversation_id": request.conversation_id,
#         "user": request.user_id
#     }

#     try:
#         response = requests.post(f"{DIFY_API_URL}/chat-messages", headers=headers, json=payload)
#         response.raise_for_status()
#         data = response.json()
        
#         return {
#             "answer": data.get("answer"),
#             "conversation_id": data.get("conversation_id"),
#             "user_id": request.user_id
#         }
#     except requests.exceptions.RequestException as e:
#         print(f"Dify API Error: {e}")
#         raise HTTPException(status_code=502, detail="Failed to communicate with AI agent.")

# # --- THE IMEI ROUTE ---
# @app.get("/api/imei/{imei}")
# def check_imei(imei: str):
#     """
#     Endpoint to check device status using an IMEI number.
#     """
#     result = check_imei_details(imei)
    
#     if not result["success"]:
#         raise HTTPException(status_code=400, detail=result["error"])
        
#     return result

# # --- BOOKING & TRADE-IN ROUTES ---
# @app.post("/api/tickets")
# def create_repair_ticket(ticket: RepairTicketRequest):
#     """
#     Endpoint to save a new repair ticket to Supabase.
#     """
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
#     """
#     Endpoint to save a new trade-in offer to Supabase.
#     """
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

from fastapi import FastAPI, HTTPException
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

# Dify Config
DIFY_API_KEY = os.environ.get("DIFY_API_KEY")
DIFY_API_URL = os.environ.get("DIFY_API_URL", "https://api.dify.ai/v1")

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

# --- IMPLEMENTATION 2: FREE LOCAL IMEI SYNTAX VALIDATION (LUHN ALGORITHM) ---
def is_valid_imei_format(imei: str) -> bool:
    """
    Validates if the IMEI string has the correct format and satisfies the Luhn algorithm.
    This saves paid API credits by blocking invalid typing errors locally.
    """
    # IMEI must be exactly 15 digits
    if not imei.isdigit() or len(imei) != 15:
        return False
        
    digits = [int(d) for d in imei]
    checksum = 0
    
    for i, digit in enumerate(digits):
        # Double every second digit from the left
        if i % 2 == 1:
            doubled = digit * 2
            # If doubling results in a 2-digit number, sum its digits (e.g., 14 -> 1+4 = 5)
            checksum += doubled if doubled < 10 else (doubled - 9)
        else:
            checksum += digit
            
    # If the total sum is divisible by 10, the IMEI structure is valid
    return checksum % 10 == 0

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

    # Start with the base payload (no conversation_id)
    payload = {
        "inputs": {},
        "query": request.query,
        "response_mode": "blocking",
        "user": request.user_id
    }
    
    # Only attach the conversation_id if it is NOT an empty string
    if request.conversation_id and request.conversation_id.strip() != "":
        payload["conversation_id"] = request.conversation_id

    try:
        response = requests.post(f"{DIFY_API_URL}/chat-messages", headers=headers, json=payload)
        
        # If Dify returns an error, let's capture the exact text for debugging
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

# # --- THE IMEI ROUTE ---
# @app.get("/api/imei/{imei}")
# def check_imei(imei: str):
#     """
#     Endpoint to check device status using an IMEI number.
#     """
#     result = check_imei_details(imei)
    
#     if not result["success"]:
#         raise HTTPException(status_code=400, detail=result["error"])
        
#     return result

# --- THE IMEI ROUTE (WITH INTEGRATED LOCAL PRE-CHECK) ---
@app.get("/api/imei/{imei}")
def check_imei(imei: str):
    """
    Endpoint to check device status using an IMEI number.
    Applies a free local format check before reaching out to the external API tool.
    """
    # Clean up any potential spaces or hyphens the user typed
    clean_imei = imei.replace(" ", "").replace("-", "")

    # Run the free local validation check first
    if not is_valid_imei_format(clean_imei):
        raise HTTPException(
            status_code=400, 
            detail="Invalid IMEI format. It must be exactly 15 digits and pass checksum verification."
        )

    # If format is valid, forward the request to your imei_tool script
    result = check_imei_details(clean_imei)
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])
        
    return result

# --- BOOKING & TRADE-IN ROUTES ---
@app.post("/api/tickets")
def create_repair_ticket(ticket: RepairTicketRequest):
    """
    Endpoint to save a new repair ticket to Supabase.
    """
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

@app.post("/api/trade-in")
def create_trade_in_offer(offer: TradeInOfferRequest):
    """
    Endpoint to save a new trade-in offer to Supabase.
    """
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