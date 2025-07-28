from flask import Flask, request, render_template, jsonify
import requests

app = Flask(__name__)

# Validate address using Nominatim (OpenStreetMap) geocoding
def validate_address(address):
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": address,
        "format": "json",
        "limit": 1
    }
    headers = {"User-Agent": "RoofCostEstimator/1.0"}
    try:
        response = requests.get(url, params=params, headers=headers)
        data = response.json()
        if data and len(data) > 0:
            result = data[0]
            return {
                "formatted_address": result.get("display_name", address),
                "latitude": float(result.get("lat", 0)),
                "longitude": float(result.get("lon", 0)),
                "is_valid": True
            }
        return {"formatted_address": address, "is_valid": False}
    except Exception as e:
        return {"formatted_address": address, "is_valid": False, "error": str(e)}

# Calculate roof replacement cost
def calculate_roof_cost(address, roof_size):
    # Material rates per square foot
    shingles_rate = 3.50  # Architectural shingles
    underlayment_rate = 1.25  # Synthetic underlayment
    flashing_rate = 0.75  # Metal flashing
    nails_rate = 0.25  # Roofing nails
    ice_water_shield_rate = 1.50  # Ice & water shield
    ridge_cap_rate = 0.50  # Ridge cap shingles

    # Calculate material quantities and costs
    shingles_cost = roof_size * shingles_rate
    underlayment_cost = roof_size * underlayment_rate
    flashing_cost = roof_size * flashing_rate
    nails_cost = roof_size * nails_rate
    ice_water_shield_cost = roof_size * ice_water_shield_rate
    ridge_cap_cost = roof_size * ridge_cap_rate

    # Labor and overhead
    labor_rate = 4.50  # $ per square foot
    labor_cost = roof_size * labor_rate
    overhead_rate = 0.25  # 25% overhead
    overhead = (shingles_cost + underlayment_cost + flashing_cost + nails_cost +
                ice_water_shield_cost + ridge_cap_cost + labor_cost) * overhead_rate

    # Calculate totals
    materials_cost = shingles_cost + underlayment_cost + flashing_cost + nails_cost + ice_water_shield_cost + ridge_cap_cost
    total_cost = materials_cost + labor_cost + overhead

    # Create detailed bill of materials
    bill_of_materials = {
        "materials": [
            {
                "item": "Architectural Shingles",
                "quantity": f"{roof_size:.0f} sq ft",
                "rate": f"${shingles_rate:.2f}/sq ft",
                "cost": f"${shingles_cost:.2f}"
            },
            {
                "item": "Synthetic Underlayment",
                "quantity": f"{roof_size:.0f} sq ft",
                "rate": f"${underlayment_rate:.2f}/sq ft",
                "cost": f"${underlayment_cost:.2f}"
            },
            {
                "item": "Metal Flashing",
                "quantity": f"{roof_size:.0f} sq ft",
                "rate": f"${flashing_rate:.2f}/sq ft",
                "cost": f"${flashing_cost:.2f}"
            },
            {
                "item": "Roofing Nails",
                "quantity": f"{roof_size:.0f} sq ft",
                "rate": f"${nails_rate:.2f}/sq ft",
                "cost": f"${nails_cost:.2f}"
            },
            {
                "item": "Ice & Water Shield",
                "quantity": f"{roof_size:.0f} sq ft",
                "rate": f"${ice_water_shield_rate:.2f}/sq ft",
                "cost": f"${ice_water_shield_cost:.2f}"
            },
            {
                "item": "Ridge Cap Shingles",
                "quantity": f"{roof_size:.0f} sq ft",
                "rate": f"${ridge_cap_rate:.2f}/sq ft",
                "cost": f"${ridge_cap_cost:.2f}"
            }
        ],
        "labor": {
            "description": "Professional Installation",
            "quantity": f"{roof_size:.0f} sq ft",
            "rate": f"${labor_rate:.2f}/sq ft",
            "cost": f"${labor_cost:.2f}"
        },
        "overhead": {
            "description": "Project Management & Insurance",
            "percentage": 25,
            "cost": f"${overhead:.2f}"
        },
        "summary": {
            "materials_total": f"${materials_cost:.2f}",
            "labor_total": f"${labor_cost:.2f}",
            "overhead_total": f"${overhead:.2f}",
            "total_cost": f"${total_cost:.2f}"
        }
    }

    return {
        "address": address,
        "roof_size": round(roof_size, 2),
        "total_cost": round(total_cost, 2),
        "bill_of_materials": bill_of_materials
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/price', methods=['POST'])
def price_roof():
    data = request.form
    address = data.get('address', 'Unknown')
    try:
        roof_size = float(data.get('roof_size', 0))  # Roof size from polygon (in sq ft)
    except ValueError:
        roof_size = 0
    if roof_size <= 0:
        return jsonify({"error": "Invalid roof area", "address": address}), 400
    # Validate address
    address_data = validate_address(address)
    if not address_data["is_valid"]:
        return jsonify({"error": "Invalid address", "address": address_data["formatted_address"]}), 400
    # Calculate cost
    result = calculate_roof_cost(address_data["formatted_address"], roof_size)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5007)