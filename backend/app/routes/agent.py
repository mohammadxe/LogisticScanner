"""
API Routes for agent operations
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
import logging

from app.models.schemas import (
    ShipmentDetailsRequest,
    ValidationResponse,
    RecommendationRequest,
    RecommendationResponse,
)
from app.services.agent import FreightRateAgent

logger = logging.getLogger(__name__)
router = APIRouter()

agent = FreightRateAgent()

@router.post("/agent/validate")
async def validate_shipment(details: ShipmentDetailsRequest) -> ValidationResponse:
    """
    Validate and normalize shipment details
    Step 1 of the agent workflow
    """
    try:
        result = await agent.validate_shipment(details)
        return ValidationResponse(**result)
    except Exception as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/agent/recommend")
async def get_recommendations(request: RecommendationRequest) -> RecommendationResponse:
    """
    Get AI recommendations for shipping options
    Step 6 of the agent workflow
    """
    try:
        if not request.options:
            raise ValueError("No shipping options provided")
        
        # Generate recommendations based on priorities
        priorities = request.priorities or {"cost": 0.5, "speed": 0.3, "reliability": 0.2}
        
        # Score each option
        scored_options = []
        for option in request.options:
            score = (
                (1 - option.price / max(o.price for o in request.options)) * priorities.get("cost", 0.5) +
                (1 - option.transitDays / max(o.transitDays for o in request.options)) * priorities.get("speed", 0.3) +
                (option.reliability or 0.85) * priorities.get("reliability", 0.2)
            )
            scored_options.append((option, score))
        
        # Sort by score
        scored_options.sort(key=lambda x: x[1], reverse=True)
        
        # Get top recommendation
        selected = scored_options[0][0]
        
        analysis = f"""
        Analysis based on your priorities (Cost: {priorities.get('cost', 0.5)}, 
        Speed: {priorities.get('speed', 0.3)}, Reliability: {priorities.get('reliability', 0.2)}):
        
        Selected Option: {selected.mode} at ${selected.price:,.2f} with {selected.transitDays} days transit time.
        This option provides the best overall value given your priorities.
        """
        
        recommendations = [
            {
                "rank": i + 1,
                "option": opt.mode,
                "price": opt.price,
                "transit_days": opt.transitDays,
                "score": score
            }
            for i, (opt, score) in enumerate(scored_options)
        ]
        
        return RecommendationResponse(
            recommendations=recommendations,
            analysis=analysis.strip(),
            selectedOption=selected
        )
    
    except Exception as e:
        logger.error(f"Recommendation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
