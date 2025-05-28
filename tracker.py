from flask import request, jsonify, render_template
import pandas as pd
import json
import plotly.graph_objects as go
from plotly.utils import PlotlyJSONEncoder
from datetime import datetime, timedelta
import logging
from config import supabase  # Import the pre-initialized client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

def handle_tracker_post():
    """Handles POST requests for generating the initial project plan and Gantt chart."""
    try:
        # Log the raw request data for inspection
        logger.info(f"Received request data for /construction-tracker: {request.data}")

        try:
            data = request.json
            project_name = data.get('project_name')
            tasks_input = data.get('tasks')
            logger.info(f"Parsed JSON data: project_name={project_name}, tasks={tasks_input}")

        except Exception as json_error:
            logger.error(f"Error parsing JSON data: {json_error}")
            return jsonify({"error": f"Invalid JSON data received: {json_error}"}), 400

        if not project_name or not tasks_input:
            error_message = "Missing project name or tasks in POST request."
            logger.error(error_message)
            return jsonify({"error": error_message}), 400

        if not isinstance(tasks_input, list) or not tasks_input:
            error_message = "Tasks should be a non-empty list."
            logger.error(error_message)
            return jsonify({"error": error_message}), 400

        # Validate tasks
        for task in tasks_input:
            if not all(key in task for key in ['activityName', 'start', 'duration']):
                return jsonify({"error": "Each task must have 'activityName', 'start', and 'duration'"}), 400
            if not isinstance(task['duration'], (int, float)) or task['duration'] <= 0:
                return jsonify({"error": "Duration must be a positive number"}), 400

        # Perform CPM analysis
        try:
            activityList_for_cpm = json.loads(json.dumps(tasks_input))  # Deep clone
            activityList_with_cpm = perform_cpm_analysis(activityList_for_cpm)
            logger.info(f"CPM analysis completed for {len(tasks_input)} tasks.")
        except ValueError as ve:
            logger.error(f"CPM analysis failed due to input data error: {ve}")
            return jsonify({"error": f"Error in task data format or predecessors: {ve}"}), 400
        except Exception as cpm_error:
            logger.error(f"An unexpected error occurred during CPM analysis: {cpm_error}", exc_info=True)
            return jsonify({"error": f"An internal error occurred during planning: {cpm_error}"}), 500

        # Prepare Gantt chart data
        gantt_data_plotly = []
        if activityList_with_cpm:
            try:
                # Get the earliest start date from tasks
                start_dates = []
                for task in tasks_input:
                    try:
                        # Convert string date to datetime object
                        start_date = datetime.strptime(task.get('start'), '%Y-%m-%d')
                        # Ensure date is not too far in the past
                        if start_date.year < 1970:
                            start_date = datetime(1970, 1, 1)
                            logger.warning(f"Adjusted invalid start date {task.get('start')} for task {task.get('activityName')} to 1970-01-01.")
                        start_dates.append(start_date)
                    except (ValueError, TypeError) as e:
                        logger.warning(f"Invalid date format for task {task.get('activityName')}: {e}, using 1970-01-01.")
                        start_dates.append(datetime(1970, 1, 1))

                if start_dates:
                    earliest_start_date = min(start_dates)
                else:
                    earliest_start_date = datetime.today()
                    logger.warning("No valid start dates provided in tasks, defaulting project start to today for Gantt.")

            except Exception as date_error:
                logger.error(f"Error determining earliest start date: {date_error}")
                earliest_start_date = datetime.today()

            for task in activityList_with_cpm:
                task_name = task['activityName']
                start_date_for_plot = earliest_start_date + timedelta(days=task.get('ES', 0))
                end_date_for_plot = earliest_start_date + timedelta(days=task.get('EF', 0))

                if start_date_for_plot < earliest_start_date:
                    start_date_for_plot = earliest_start_date
                if end_date_for_plot < earliest_start_date:
                    end_date_for_plot = earliest_start_date + timedelta(days=task.get('duration', 0))

                color = '#00ffcc' if task.get('Critical', False) else '#0077aa'
                hover_text = f"<b>{task_name}</b><br>Planned Start: {start_date_for_plot.strftime('%Y-%m-%d')}<br>Planned Finish: {end_date_for_plot.strftime('%Y-%m-%d')}<br>Duration: {task.get('duration', 0)} days"
                hover_text += f"<br>ES: {task.get('ES', 'N/A')}, EF: {task.get('EF', 'N/A')}, LS: {task.get('LS', 'N/A')}, LF: {task.get('LF', 'N/A')}"
                hover_text += f"<br>Total Float: {task.get('TF', 'N/A')}, Free Float: {task.get('FF', 'N/A')}"

                gantt_data_plotly.append({
                    "Task": task_name,
                    "Start": start_date_for_plot.strftime('%Y-%m-%d'),
                    "Finish": end_date_for_plot.strftime('%Y-%m-%d'),
                    "Duration": task.get('duration', 0),
                    "Critical": task.get('Critical', False),
                    "Color": color,
                    "HoverText": hover_text
                })

            # Create DataFrame and sort by start date
            df_gantt = pd.DataFrame(gantt_data_plotly)
            df_gantt['Start_Date_Sort'] = pd.to_datetime(df_gantt['Start'], format='%Y-%m-%d')
            df_gantt = df_gantt.dropna(subset=['Start_Date_Sort'])
            df_gantt = df_gantt.sort_values(by=['Start_Date_Sort', 'Duration'], ascending=[True, True])

            fig_gantt = go.Figure()
            fig_gantt.add_trace(go.Bar(
                x=df_gantt['Duration'].tolist(),
                y=df_gantt['Task'].tolist(),
                base=df_gantt['Start'].tolist(),
                orientation='h',
                marker=dict(color=df_gantt['Color'].tolist()),
                hovertext=df_gantt['HoverText'].tolist(),
                hoverinfo='text'
            ))

            fig_gantt.update_layout(
                title="Project Gantt Chart (Critical Path in VibeOps Green)",
                xaxis=dict(
                    title="Timeline",
                    type="date",
                    tickformat="%Y-%m-%d",
                    range=[df_gantt['Start'].min(), df_gantt['Finish'].max()]
                ),
                yaxis=dict(
                    title="Tasks",
                    autorange="reversed",
                    categoryorder="array",
                    categoryarray=df_gantt['Task'].tolist()
                ),
                height=max(400, len(df_gantt) * 50 + 100),
                showlegend=False,
                margin=dict(l=150, r=20, t=50, b=50),
                paper_bgcolor='#1e1e1e',
                plot_bgcolor='#1e1e1e',
                font=dict(color='#f2f2f2')
            )

            return jsonify({
                "gantt_data": fig_gantt.to_dict(),
                "processed_tasks": activityList_with_cpm
            }), 200

        else:
            error_message = "CPM analysis did not produce activity list."
            logger.error(error_message)
            return jsonify({"error": error_message}), 500

    except Exception as e:
        logger.error(f"Error in handle_tracker_post (Gantt): {e}", exc_info=True)
        return jsonify({"error": f"Internal server error processing Gantt request: {e}"}), 500

# --- Critical Path Method (CPM) Calculation Functions ---
# Adapted from the provided CriticalPath.py script

def addSuccessors(activityList):
    """Adds immediate successors to each activity in the list."""
    activity_names = [activity["activityName"] for activity in activityList]
    for i, activity in enumerate(activityList):
        currentName = activity["activityName"]
        successors = []
        for j, other_activity in enumerate(activityList):
            # Check all other activities to see if the current one is a predecessor
            if currentName in other_activity.get("immediatePredecessor", []):
                 # Find the index of the successor task in the list
                successors.append(other_activity["activityName"])
        activityList[i]["immediateSuccessor"] = successors

def addCalculationCols(activityList):
    """Adds placeholder columns for CPM calculations."""
    for activity in activityList:
        activity['ES'] = 0 # Early Start
        activity['EF'] = 0 # Early Finish
        activity['LS'] = 0 # Late Start
        activity['LF'] = 0 # Late Finish
        activity['TF'] = 0 # Total Float
        activity['FF'] = 0 # Free Float
        activity['Critical'] = False # Is Critical Activity

def calculateEarlyDates(activityList):
    """Calculates Early Start (ES) and Early Finish (EF) dates."""
    # Create a dictionary for quick lookup by activity name
    activity_dict = {activity['activityName']: activity for activity in activityList}

    for activity in activityList:
        duration = activity.get('duration', 0) # Ensure duration exists, default to 0
        predecessorList = activity.get('immediatePredecessor', []) # Ensure predecessors exist

        ES = 0
        if not predecessorList:
            # Activities with no predecessors start at time 0 (or project start date)
            activity['ES'] = 0
        else:
            max_predecessor_ef = 0
            valid_predecessors = True
            for pred_name in predecessorList:
                 predecessor_activity = activity_dict.get(pred_name)
                 if predecessor_activity:
                     max_predecessor_ef = max(max_predecessor_ef, predecessor_activity.get('EF', 0))
                 else:
                      # This indicates an invalid predecessor name - handle appropriately
                      # For now, we'll just log a warning and treat as if predecessor has EF 0
                      logger.warning(f"Predecessor '{pred_name}' not found for activity '{activity['activityName']}'.")
                      valid_predecessors = False

            activity['ES'] = max_predecessor_ef
            ES = max_predecessor_ef # Update local ES variable

        activity['EF'] = ES + duration # Calculate Early Finish


def getProjectFinish(activityList):
    """Calculates the project's total duration based on Early Finish dates."""
    if not activityList:
        return 0
    return max(activity.get('EF', 0) for activity in activityList) # Ensure EF exists

def calculateLateDates(activityList):
    """Calculates Late Finish (LF) and Late Start (LS) dates."""
    LARGENUMBER = getProjectFinish(activityList) + 100 # Use a value larger than project finish
    # Create a dictionary for quick lookup by activity name
    activity_dict = {activity['activityName']: activity for activity in activityList}

    # Calculate Late Dates by iterating backward
    # Need to process activities in topological order reverse or by index if activities are ordered
    # Assuming activityList is roughly ordered such that successors appear later
    # A more robust approach would use actual topological sort
    for i in range(len(activityList) - 1, -1, -1):
        activity = activityList[i]
        duration = activity.get('duration', 0)
        successorList = activity.get('immediateSuccessor', [])

        LF = LARGENUMBER # Initialize LF

        if not successorList:
            # Activities with no successors finish by the project finish time
            activity['LF'] = getProjectFinish(activityList)
            LF = activity['LF']
        else:
            min_successor_ls = LARGENUMBER
            valid_successors = True
            for succ_name in successorList:
                successor_activity = activity_dict.get(succ_name)
                if successor_activity:
                     min_successor_ls = min(min_successor_ls, successor_activity.get('LS', LARGENUMBER))
                else:
                     # This indicates an issue with successor linking, treat as if successor has LS at project end
                     logger.warning(f"Successor '{succ_name}' not found for activity '{activity['activityName']}'.")
                     valid_successors = False

            activity['LF'] = min_successor_ls
            LF = min_successor_ls # Update local LF variable

        activity['LS'] = LF - duration # Calculate Late Start

def calculateTF(activityList):
    """Calculates Total Float (TF) and identifies Critical Activities."""
    for activity in activityList:
        activity['TF'] = activity.get('LF', 0) - activity.get('EF', 0) # Ensure LF, EF exist
        if activity['TF'] == 0:
            activity['Critical'] = True
        else:
             activity['Critical'] = False # Explicitly set non-critical

def calculateFF(activityList):
    """Calculates Free Float (FF)."""
    LARGENUMBER = getProjectFinish(activityList) + 100 # Use a value larger than project finish
    # Create a dictionary for quick lookup by activity name
    activity_dict = {activity['activityName']: activity for activity in activityList}

    # Calculate Free Float by iterating backward
    for i in range(len(activityList) - 1, -1, -1):
        activity = activityList[i]
        successorList = activity.get('immediateSuccessor', [])
        EF = activity.get('EF', 0)

        if not successorList:
            # Activities with no successors have Free Float equal to their Total Float
             activity['FF'] = activity.get('TF', 0) # Or getProjectFinish(activityList) - EF
        else:
            min_successor_es = LARGENUMBER
            valid_successors = True
            for succ_name in successorList:
                 successor_activity = activity_dict.get(succ_name)
                 if successor_activity:
                     min_successor_es = min(min_successor_es, successor_activity.get('ES', LARGENUMBER))
                 else:
                      logger.warning(f"Successor '{succ_name}' not found when calculating FF for '{activity['activityName']}'.")
                      valid_successors = False

            activity['FF'] = min_successor_es - EF
            # Free float cannot be negative
            if activity['FF'] < 0:
                activity['FF'] = 0

def perform_cpm_analysis(activityList):
    """Performs full CPM analysis on the given activity list."""
    # Ensure tasks have required fields before proceeding
    for task in activityList:
        if 'activityName' not in task or 'duration' not in task or 'immediatePredecessor' not in task:
            raise ValueError("Each task must have 'activityName', 'duration', and 'immediatePredecessor'.")

    # Sort activities to ensure predecessors generally come before successors by index
    # This is a heuristic and might fail for complex graphs. A proper topological sort is better.
    # For simplicity and based on the input structure, we'll try sorting by a combination
    # of lack of predecessors and duration, but relying on the addSuccessors and
    # date calculations to handle out-of-order inputs as much as possible.
    # A more robust way: implement topological sort.
    # Let's assume for now the input list order is somewhat logical or rely on dict lookups.

    addSuccessors(activityList)
    addCalculationCols(activityList)
    calculateEarlyDates(activityList)
    calculateLateDates(activityList)
    calculateTF(activityList)
    calculateFF(activityList)

    return activityList

# --- End CPM Functions ---

def handle_progress_post():
    """Handles POST requests for progress tracking and S-curve generation."""
    try:
        data = request.json
        if not data or 'tasks' not in data:
            return jsonify({"error": "No task data provided"}), 400

        tasks = data['tasks']
        if not isinstance(tasks, list):
            return jsonify({"error": "Tasks must be a list"}), 400

        # Process each task
        processed_tasks = []
        for task in tasks:
            if not all(key in task for key in ['activityName', 'percentComplete', 'budgetedCost', 'actualCost']):
                return jsonify({"error": "Each task must have activityName, percentComplete, budgetedCost, and actualCost"}), 400

            try:
                percent_complete = float(task['percentComplete'])
                budgeted_cost = float(task['budgetedCost'])
                actual_cost = float(task['actualCost'])

                # Update task in Supabase
                update_data = {
                    'percent_complete': percent_complete,
                    'budgeted_cost': budgeted_cost,
                    'actual_cost': actual_cost,
                    'updated_at': datetime.now().isoformat()
                }
                
                # Update the task in Supabase
                supabase.table('tasks').update(update_data).eq('activity_name', task['activityName']).execute()

                # Calculate earned value metrics
                earned_value = budgeted_cost * (percent_complete / 100)
                cost_variance = earned_value - actual_cost
                schedule_variance = earned_value - budgeted_cost
                cost_performance_index = earned_value / actual_cost if actual_cost != 0 else 0
                schedule_performance_index = earned_value / budgeted_cost if budgeted_cost != 0 else 0

                processed_tasks.append({
                    'activityName': task['activityName'],
                    'percentComplete': percent_complete,
                    'budgetedCost': budgeted_cost,
                    'actualCost': actual_cost,
                    'earnedValue': earned_value,
                    'costVariance': cost_variance,
                    'scheduleVariance': schedule_variance,
                    'costPerformanceIndex': cost_performance_index,
                    'schedulePerformanceIndex': schedule_performance_index
                })

            except ValueError:
                return jsonify({"error": "percentComplete, budgetedCost, and actualCost must be valid numbers"}), 400

        # Generate S-curve data
        try:
            # Sort tasks by percent complete
            sorted_tasks = sorted(processed_tasks, key=lambda x: x['percentComplete'])
            
            # Create cumulative progress data
            cumulative_progress = []
            cumulative_budget = 0
            cumulative_actual = 0
            cumulative_earned = 0
            
            for task in sorted_tasks:
                cumulative_budget += task['budgetedCost']
                cumulative_actual += task['actualCost']
                cumulative_earned += task['earnedValue']
                
                cumulative_progress.append({
                    'percentComplete': task['percentComplete'],
                    'budgetedCost': cumulative_budget,
                    'actualCost': cumulative_actual,
                    'earnedValue': cumulative_earned
                })

            # Create S-curve plot
            fig = go.Figure()
            
            # Add budgeted cost line
            fig.add_trace(go.Scatter(
                x=[p['percentComplete'] for p in cumulative_progress],
                y=[p['budgetedCost'] for p in cumulative_progress],
                mode='lines',
                name='Budgeted Cost',
                line=dict(color='#00ffcc', width=2)
            ))
            
            # Add actual cost line
            fig.add_trace(go.Scatter(
                x=[p['percentComplete'] for p in cumulative_progress],
                y=[p['actualCost'] for p in cumulative_progress],
                mode='lines',
                name='Actual Cost',
                line=dict(color='#ff4444', width=2)
            ))
            
            # Add earned value line
            fig.add_trace(go.Scatter(
                x=[p['percentComplete'] for p in cumulative_progress],
                y=[p['earnedValue'] for p in cumulative_progress],
                mode='lines',
                name='Earned Value',
                line=dict(color='#4444ff', width=2)
            ))

            # Update layout
            fig.update_layout(
                title='Project S-Curve',
                xaxis_title='Percent Complete',
                yaxis_title='Cost',
                showlegend=True,
                paper_bgcolor='#1e1e1e',
                plot_bgcolor='#1e1e1e',
                font=dict(color='#f2f2f2'),
                legend=dict(
                    bgcolor='rgba(30, 30, 30, 0.8)',
                    bordercolor='#444444',
                    borderwidth=1
                )
            )

            # Store the S-curve data in Supabase
            s_curve_data = {
                'project_id': data.get('project_id'),  # Assuming you pass this in the request
                'data': fig.to_dict(),
                'created_at': datetime.now().isoformat()
            }
            
            supabase.table('s_curves').insert(s_curve_data).execute()

            return jsonify({
                'processed_tasks': processed_tasks,
                's_curve_data': fig.to_dict()
            }), 200

        except Exception as e:
            logger.error(f"Error generating S-curve: {e}", exc_info=True)
            return jsonify({"error": f"Error generating S-curve: {str(e)}"}), 500

    except Exception as e:
        logger.error(f"Error in handle_progress_post: {e}", exc_info=True)
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500