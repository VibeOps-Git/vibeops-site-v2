from flask import request, jsonify
from config import supabase
import logging # Import logging

logger = logging.getLogger(__name__) # Get logger instance

def handle_pipeline_post():
    try: # Add a try-except block for broader error handling
        # Get input data
        data = request.json
        # Convert to float safely, handling potential errors
        try:
            length = float(data.get('length'))  # in km
            diameter = float(data.get('diameter'))  # in inches
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid number format for length or diameter"}), 400

        terrain = data.get('terrain')

        if not all([length, diameter, terrain]):
            return jsonify({"error": "Missing required parameters"}), 400

        # Input validation
        if length <= 0 or diameter <= 0:
            return jsonify({"error": "Length and diameter must be positive"}), 400
        if terrain not in ["flat", "hilly", "mountainous", "swampy"]:
            return jsonify({"error": "Invalid terrain type"}), 400

        # Terrain multipliers
        terrain_multipliers = {
            "flat": 1.0,
            "hilly": 1.2,
            "mountainous": 1.5,
            "swampy": 1.3
        }
        terrain_factor = terrain_multipliers[terrain]

        # Convert length to miles (1 km = 0.621371 miles)
        length_miles = length * 0.621371

        # Base cost per mile (2023 data, adjusted to 2025 with 3% annual inflation)
        # Assuming roughly 3% inflation per year for 2 years
        base_cost_per_mile_2023 = {
            "material": 934000,  # $934,000/mile
            "labor": 3603334,    # $3,603,334/mile
            "row": 441548,       # $441,548/mile
            "misc": 4615028      # $4,615,028/mile
        }
        inflation_factor = 1.0609  # (1 + 0.03)^2 for 2 years at 3%
        base_cost_per_mile = {k: v * inflation_factor for k, v in base_cost_per_mile_2023.items()}

        # Adjust costs based on diameter (assuming linear scaling from 30-inch average)
        # This is a simplification; real diameter scaling is more complex
        diameter_factor = diameter / 30.0  # Normalize to 30-inch average pipeline size

        # Calculate costs
        material_cost = base_cost_per_mile["material"] * length_miles * diameter_factor
        # Terrain primarily impacts labor and ROW
        labor_cost = base_cost_per_mile["labor"] * length_miles * terrain_factor
        row_cost = base_cost_per_mile["row"] * length_miles * terrain_factor
        misc_cost = base_cost_per_mile["misc"] * length_miles * diameter_factor # Also scale misc by diameter as it includes equipment/logistics


        total_cost = material_cost + labor_cost + row_cost + misc_cost

        # Generate Bill of Materials
        # Added reasonable unit sizes for materials
        estimated_bom = {
            "pipe": f"{length * 1000:.0f} m",
            "welds": f"{int(length * 10)} joints",  # Approx 1 weld per 100m section
            "valves": f"{max(1, int(length / 5))} units",   # Approx 1 valve per 5km, minimum 1
            "trenching": f"{length * 1000:.0f} m linear"
        }

        # Prepare cost breakdown, formatted for readability
        estimated_cost = {
            "total_cost": round(total_cost, 2),
            "material_cost": round(material_cost, 2),
            "labor_cost": round(labor_cost, 2),
            "row_cost": round(row_cost, 2),
            "misc_cost": round(misc_cost, 2)
        }

        # Store in Supabase
        try:
            # Ensure data structure matches Supabase table schema
            supabase.table('pipeline_estimations').insert({
                "pipeline_length_km": length, # Use more descriptive column names
                "pipeline_diameter_in": diameter,
                "terrain_type": terrain,
                "input_parameters": data, # Store original input for debugging
                "generated_bom": estimated_bom, # Store as JSONB in Supabase
                "estimated_cost_usd": estimated_cost # Store as JSONB in Supabase
            }).execute()
            logger.info("Pipeline estimation stored in Supabase successfully.")
        except Exception as e:
            logger.error(f"Error storing pipeline estimation in Supabase: {e}")
            # Continue processing the request even if DB storage fails

        # Return JSON response
        return jsonify({"bom": estimated_bom, "cost": estimated_cost}), 200

    except Exception as e:
        logger.error(f"An unexpected error occurred in handle_pipeline_post: {e}")
        return jsonify({"error": "An internal error occurred during estimation."}), 500
