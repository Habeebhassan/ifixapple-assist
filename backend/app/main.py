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

# Setup CORS to allow all origins for local development to prevent fetch failures
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
        "conversation_id": request.conversation_id,
        "user": request.user_id
    }

    try:
        response = requests.post(f"{DIFY_API_URL}/chat-messages", headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        
        return {
            "answer": data.get("answer"),
            "conversation_id": data.get("conversation_id"),
            "user_id": request.user_id
        }
    except requests.exceptions.RequestException as e:
        print(f"Dify API Error: {e}")
        raise HTTPException(status_code=502, detail="Failed to communicate with AI agent.")

# --- THE IMEI ROUTE ---
@app.get("/api/imei/{imei}")
def check_imei(imei: str):
    """
    Endpoint to check device status using an IMEI number.
    """
    result = check_imei_details(imei)
    
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
