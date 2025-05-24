from flask import request, jsonify
from config import supabase

def handle_pipeline_post():
    data = request.json
    length = data.get('length')
    diameter = data.get('diameter')
    terrain = data.get('terrain')

    if not all([length, diameter, terrain]):
        return jsonify({"error": "Missing required parameters"}), 400

    estimated_bom = {
        "pipe": f"{length * 1000}m",
        "welds": f"{length * 10} joints",
        "valves": "5",
        "trenching": "linear"
    }
    estimated_cost = length * diameter * 100

    supabase.table('pipeline_estimations').insert({
        "pipeline_length": length,
        "pipeline_diameter": diameter,
        "terrain_type": terrain,
        "input_parameters": data,
        "generated_bom": estimated_bom,
        "estimated_cost": estimated_cost
    }).execute()

    return jsonify({"bom": estimated_bom, "cost": estimated_cost})
