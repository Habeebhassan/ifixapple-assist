// This file centralizes all calls to your Python backend.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";

export const apiService = {
  /**
   * Send a message to the Dify AI agent via the Python proxy.
   */
  async chat(query: string, conversationId: string = "", userId: string = "guest_user") {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, conversation_id: conversationId, user_id: userId }),
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Failed to fetch chat response");
    
    return data;
  },

  /**
   * Check device status using the IMEI lookup tool.
   */
  async checkImei(imei: string) {
    const response = await fetch(`${API_BASE_URL}/api/imei/${imei}`);
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.detail || data.error || "Failed to fetch device status");
    }
    
    return data.data; // Return just the actual device data object
  },

  /**
   * Create a new repair ticket
   */
  async createTicket(ticketData: { user_id: string; device_model: string; issue_type: string; quote_amount?: number }) {
    const response = await fetch(`${API_BASE_URL}/api/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticketData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Failed to create ticket");
    return data;
  },

  /**
   * Create a trade-in offer
   */
  async createTradeInOffer(offerData: { user_id: string; device_details: any; grade: string; offered_price: number }) {
    const response = await fetch(`${API_BASE_URL}/api/trade-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(offerData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Failed to create trade-in offer");
    return data;
  }
};
