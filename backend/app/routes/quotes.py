"""
API Routes for freight quotes
"""
from fastapi import APIRouter, HTTPException
import logging

from app.models.schemas import (
    ShipmentDetailsRequest,
    QuoteResponse,
)
from app.services.agent import FreightRateAgent

logger = logging.getLogger(__name__)
router = APIRouter()

agent = FreightRateAgent()

@router.post("/multimodal/quote")
async def get_multimodal_quotes(details: ShipmentDetailsRequest) -> QuoteResponse:
    """
    Get multimodal freight quotes for shipment
    Full workflow: validate → determine legs → fetch quotes → optimize
    """
    try:
        # Step 1: Validate
        validation = await agent.validate_shipment(details)
        if not validation["valid"]:
            raise HTTPException(
                status_code=400,
                detail={"errors": validation["errors"], "warnings": validation["warnings"]}
            )
        
        # Step 2: Determine transport legs
        legs = await agent.determine_transport_legs(details)
        
        # Step 3: Fetch quotes autonomously
        options = await agent.fetch_quotes_autonomously(details, legs)
        
        if not options:
            raise HTTPException(
                status_code=404,
                detail="No shipping options available for this route"
            )
        
        # Step 5 & 6: Optimize and generate recommendations
        quote_response = await agent.optimize_routes(details, options)
        
        logger.info(f"Generated quotes for {details.origin} → {details.destination}")
        return quote_response
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Quote generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating quotes: {str(e)}")
