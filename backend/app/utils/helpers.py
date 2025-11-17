"""
Utility functions
"""
import re
from typing import Tuple

def cbm_from_dimensions(length_cm: float, width_cm: float, height_cm: float) -> float:
    """Convert dimensions (cm) to CBM"""
    return (length_cm * width_cm * height_cm) / 1000000

def get_port_code(location: str) -> str:
    """Get IATA/IATA port code from location name"""
    # Simplified port code lookup
    port_codes = {
        "shanghai": "SHA",
        "rotterdam": "RTM",
        "singapore": "SIN",
        "hong kong": "HKG",
        "los angeles": "LAX",
        "new york": "NYC",
        "hamburg": "HAM",
    }
    return port_codes.get(location.lower(), location.upper()[:3])

def parse_distance_from_location(origin: str, destination: str) -> Tuple[str, str]:
    """Parse origin and destination for routing"""
    return origin.strip(), destination.strip()

def estimate_transit_days(distance_km: float, mode: str) -> int:
    """Estimate transit days based on distance and mode"""
    estimates = {
        "truck": max(1, int(distance_km / 800)),  # ~800km per day
        "ocean": 30,  # Default ocean transit
        "air": 3,  # Default air transit
        "rail": max(7, int(distance_km / 1000)),  # ~1000km per day
    }
    return estimates.get(mode.lower(), 5)

def calculate_carbon_footprint(weight_tons: float, distance_km: float, mode: str) -> float:
    """Estimate carbon footprint in kg CO2"""
    # Simplified emission factors (kg CO2 per ton-km)
    emission_factors = {
        "truck": 0.1,
        "ocean": 0.01,
        "air": 0.5,
        "rail": 0.02,
    }
    factor = emission_factors.get(mode.lower(), 0.1)
    return weight_tons * distance_km * factor
