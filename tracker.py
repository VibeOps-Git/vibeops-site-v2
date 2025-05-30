from flask import request, jsonify, session
from datetime import datetime, timedelta
import json
import logging
from config import supabase
from dotenv import load_dotenv

# Load environment vars
load_dotenv()
logger = logging.getLogger(__name__)

def handle_progress_post():
    """Handles POST requests for progress tracking and S-curve generation."""
    try:
        data = request.json
        if not data or 'tasks' not in data:
            return jsonify({"error": "No task data provided"}), 400

        tasks = data['tasks']
        if not isinstance(tasks, list):
            return jsonify({"error": "Tasks must be a list"}), 400

        # Retrieve session_id from the request
        session_id = data.get('session_id')
        if not session_id:
            logger.error("Session ID not provided in request.")
            return jsonify({"error": "Session ID required. Please generate the Gantt chart first."}), 400

        # Retrieve CPM results from Supabase
        response = supabase.table('project_sessions').select('activity_list').eq('id', session_id).execute()
        if not response.data or len(response.data) == 0:
            logger.error(f"No data found in Supabase for session_id: {session_id}")
            return jsonify({"error": "Session data not found. Please generate the Gantt chart first."}), 400

        activityList_with_cpm = response.data[0]['activity_list']

        # Process each task
        processed_tasks = []
        for task in tasks:
            required_keys = ['activityName', 'percentComplete', 'budgetedCost', 'actualCost', 'actualStart', 'actualFinish']
            if not all(key in task for key in required_keys):
                missing = [key for key in required_keys if key not in task]
                logger.error(f"Missing keys in task data: {missing}")
                return jsonify({"error": f"Incomplete task progress data received. Missing keys: {', '.join(missing)}"}), 400

            try:
                percent_complete = float(task.get('percentComplete', 0))
                budgeted_cost = float(task.get('budgetedCost', 0))
                actual_cost = float(task.get('actualCost', 0))
                actual_start_str = task.get('actualStart')
                actual_finish_str = task.get('actualFinish')

                if not (0 <= percent_complete <= 100):
                    return jsonify({"error": f"Invalid % Complete for task '{task.get('activityName', 'Unknown')}': {percent_complete}. Must be between 0 and 100."}), 400
                if budgeted_cost < 0 or actual_cost < 0:
                    return jsonify({"error": f"Invalid cost value for task '{task.get('activityName', 'Unknown')}'. Costs cannot be negative."}), 400

                actual_start_date = None
                actual_finish_date = None
                if actual_start_str:
                    try:
                        actual_start_date = datetime.strptime(actual_start_str, '%Y-%m-%d')
                    except ValueError:
                        return jsonify({"error": f"Invalid Actual Start Date format for task '{task.get('activityName', 'Unknown')}': {actual_start_str}. Use YYYY-MM-DD."}), 400

                if actual_finish_str:
                    try:
                        actual_finish_date = datetime.strptime(actual_finish_str, '%Y-%m-%d')
                    except ValueError:
                        return jsonify({"error": f"Invalid Actual Finish Date format for task '{task.get('activityName', 'Unknown')}': {actual_finish_str}. Use YYYY-MM-DD."}), 400

                if actual_start_date and actual_finish_date and actual_start_date > actual_finish_date:
                    logger.warning(f"Actual Start Date is after Actual Finish Date for task '{task.get('activityName', 'Unknown')}'.")

                update_data = {
                    'percent_complete': percent_complete,
                    'budgeted_cost': budgeted_cost,
                    'actual_cost': actual_cost,
                    'updated_at': datetime.now().isoformat()
                }
                if actual_start_date:
                    update_data['actual_start'] = actual_start_date.isoformat()
                if actual_finish_date:
                    update_data['actual_finish'] = actual_finish_date.isoformat()

                logger.info(f"Attempting to update task '{task.get('activityName', 'Unknown')}' in Supabase with data: {update_data}")
                response = supabase.table('tasks').update(update_data).eq('activity_name', task.get('activityName')).execute()

                if response.data is None or len(response.data) == 0:
                    logger.warning(f"Supabase update for task '{task.get('activityName', 'Unknown')}' resulted in no data or error: {response.error}")

                elif response.error:
                    logger.error(f"Supabase error updating task '{task.get('activityName', 'Unknown')}': {response.error}", exc_info=True)

                earned_value = budgeted_cost * (percent_complete / 100)
                cost_variance = earned_value - actual_cost
                schedule_variance = earned_value - budgeted_cost
                cost_performance_index = earned_value / actual_cost if actual_cost != 0 else (float('inf') if earned_value > 0 else 0)
                schedule_performance_index = earned_value / budgeted_cost if budgeted_cost != 0 else (float('inf') if earned_value > 0 else 0)

                processed_tasks.append({
                    'activityName': task.get('activityName'),
                    'percentComplete': percent_complete,
                    'budgetedCost': budgeted_cost,
                    'actualCost': actual_cost,
                    'actualStart': actual_start_str,
                    'actualFinish': actual_finish_str,
                    'earnedValue': earned_value,
                    'costVariance': cost_variance,
                    'scheduleVariance': schedule_variance,
                    'costPerformanceIndex': cost_performance_index,
                    'schedulePerformanceIndex': schedule_performance_index
                })

            except ValueError as ve:
                logger.error(f"Data processing error for task '{task.get('activityName', 'Unknown')}': {ve}", exc_info=True)
                return jsonify({"error": f"Error processing data for task '{task.get('activityName', 'Unknown')}': {ve}"}), 400
            except Exception as ex:
                logger.error(f"Unexpected error processing task '{task.get('activityName', 'Unknown')}': {ex}", exc_info=True)
                return jsonify({"error": f"Unexpected error processing task '{task.get('activityName', 'Unknown')}': {ex}"}), 500

        # Generate S-curve data
        try:
            report_date_str = data.get('report_date')
            report_date = datetime.strptime(report_date_str, '%Y-%m-%d') if report_date_str else datetime.now()

            tasks_with_cpm_dict = {task['activityName']: task for task in activityList_with_cpm}
            processed_tasks_with_ef = []
            for task in processed_tasks:
                cpm_info = tasks_with_cpm_dict.get(task['activityName'], {})
                task_with_ef = task.copy()
                task_with_ef['EF'] = cpm_info.get('EF', 0)
                task_with_ef['start_date'] = datetime.strptime(cpm_info.get('start', report_date.strftime('%Y-%m-%d')), '%Y-%m-%d')
                task_with_ef['duration'] = cpm_info.get('duration', 1)
                processed_tasks_with_ef.append(task_with_ef)

            sorted_tasks_for_scurve = sorted(processed_tasks_with_ef, key=lambda x: (x.get('start_date', report_date), x.get('EF', 0)))

            earliest_start = min(t.get('start_date', report_date) for t in sorted_tasks_for_scurve) if sorted_tasks_for_scurve else report_date
            project_duration_days = (report_date - earliest_start).days + 1

            timeline_dates = [earliest_start + timedelta(days=i) for i in range(project_duration_days)]
            cumulative_budget = [0] * project_duration_days
            cumulative_actual = [0] * project_duration_days
            cumulative_earned = [0] * project_duration_days

            for day_index, current_date in enumerate(timeline_dates):
                if day_index > 0:
                    cumulative_budget[day_index] = cumulative_budget[day_index - 1]
                    cumulative_actual[day_index] = cumulative_actual[day_index - 1]
                    cumulative_earned[day_index] = cumulative_earned[day_index - 1]

                cumulative_budget[day_index] = sum(
                    task['budgetedCost'] * min(1.0, max(0.0, (current_date - task.get('start_date', report_date)).days + 1) / task.get('duration', 1))
                    for task in sorted_tasks_for_scurve
                    if task.get('start_date', report_date) <= current_date
                )

                for task in processed_tasks:
                    actual_finish = None
                    if task.get('actualFinish'):
                        try:
                            actual_finish = datetime.strptime(task['actualFinish'], '%Y-%m-%d')
                        except ValueError:
                            pass

                    if actual_finish and actual_finish <= current_date:
                        cumulative_actual[day_index] += task['actualCost']
                        cumulative_earned[day_index] += task['earnedValue']
                    elif task.get('actualStart') and datetime.strptime(task['actualStart'], '%Y-%m-%d') <= current_date:
                        cumulative_actual[day_index] += task['actualCost'] * ((current_date - datetime.strptime(task['actualStart'], '%Y-%m-%d')).days + 1) / task.get('duration', 1)
                        cumulative_earned[day_index] += task['earnedValue'] * ((current_date - datetime.strptime(task['actualStart'], '%Y-%m-%d')).days + 1) / task.get('duration', 1)

            s_curve_dates = [
                earliest_start.strftime('%Y-%m-%d'),
                report_date.strftime('%Y-%m-%d'),
                (earliest_start + timedelta(days=getProjectFinish(activityList_with_cpm))).strftime('%Y-%m-%d')
            ]
            s_curve_budget_values = [
                0,
                sum(
                    task['budgetedCost'] * min(1.0, max(0.0, (report_date - task.get('start_date', report_date)).days + 1) / task.get('duration', 1))
                    for task in sorted_tasks_for_scurve
                    if task.get('start_date', report_date) <= report_date
                ),
                sum(task['budgetedCost'] for task in processed_tasks)
            ]
            s_curve_actual_values = [0, sum(task['actualCost'] for task in processed_tasks), sum(task['actualCost'] for task in processed_tasks)]
            s_curve_earned_values = [0, sum(task['earnedValue'] for task in processed_tasks), sum(task['earnedValue'] for task in processed_tasks)]

            total_earned_value = sum(task['earnedValue'] for task in processed_tasks)
            total_actual_cost = sum(task['actualCost'] for task in processed_tasks)
            schedule_variance = total_earned_value - s_curve_budget_values[1]
            cost_variance = total_earned_value - total_actual_cost
            schedule_performance_index = total_earned_value / s_curve_budget_values[1] if s_curve_budget_values[1] != 0 else (float('inf') if total_earned_value > 0 else 0)
            cost_performance_index = total_earned_value / total_actual_cost if total_actual_cost != 0 else (float('inf') if total_earned_value > 0 else 0)

            metrics = {
                'schedule_variance': schedule_variance,
                'cost_variance': cost_variance,
                'critical_path': 'N/A',
                'critical_path_updates': 'Run Gantt Chart generation to see critical path.',
                'analysis_notes': 'S-curve and metrics based on reported progress as of ' + report_date.strftime('%Y-%m-%d') + '.'
            }

            return jsonify({
                's_curve_data': {
                    'dates': s_curve_dates,
                    'budget_values': s_curve_budget_values,
                    'actual_values': s_curve_actual_values,
                    'earned_values': s_curve_earned_values
                },
                'metrics': metrics,
                'processed_tasks': processed_tasks
            }), 200

        except Exception as e:
            logger.error(f"Error generating S-curve or metrics: {e}", exc_info=True)
            return jsonify({"error": f"Error generating S-curve or metrics: {str(e)}"}), 500

    except Exception as e:
        logger.error(f"Error in handle_progress_post: {e}", exc_info=True)
        return jsonify({"error": f"Internal server error in progress handling: {str(e)}"}), 500

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

def handle_tracker_post():
    """Handles POST requests for generating the initial project plan and Gantt chart."""
    try:
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

        for task in tasks_input:
            if not all(key in task for key in ['activityName', 'start', 'duration', 'crew', 'personnel', 'equipment']):
                return jsonify({"error": "Each task must have 'activityName', 'start', 'duration', 'crew', 'personnel', and 'equipment'"}), 400
            if not isinstance(task['duration'], (int, float)) or task['duration'] <= 0:
                return jsonify({"error": "Duration must be a positive number"}), 400
            if not isinstance(task['personnel'], (int, float)) or task['personnel'] < 0:
                return jsonify({"error": "Personnel count must be a non-negative number"}), 400
            if not isinstance(task['equipment'], (int, float)) or task['equipment'] < 0:
                return jsonify({"error": "Equipment count must be a non-negative number"}), 400

        # Perform CPM analysis
        try:
            activityList_for_cpm = json.loads(json.dumps(tasks_input))
            activityList_with_cpm = perform_cpm_analysis(activityList_for_cpm)
            logger.info(f"CPM analysis completed for {len(tasks_input)} tasks.")

            # Store CPM results in session for progress analysis
            session['activityList_with_cpm'] = activityList_with_cpm

        except ValueError as ve:
            logger.error(f"CPM analysis failed due to input data error: {ve}")
            return jsonify({"error": f"Error in task data format or predecessors: {ve}"}), 400
        except Exception as cpm_error:
            logger.error(f"An unexpected error occurred during CPM analysis: {cpm_error}", exc_info=True)
            return jsonify({"error": f"An internal error occurred during planning: {cpm_error}"}), 500

        # Prepare Gantt chart data
        df = pd.DataFrame(tasks_input)
        df['start'] = pd.to_datetime(df['start'])
        df['end'] = df.apply(lambda row: row['start'] + timedelta(days=row['duration'] - 1), axis=1)

        # Map CPM results
        cpm_results_map = {task['activityName']: task for task in activityList_with_cpm}
        df['ES'] = df['activityName'].apply(lambda name: cpm_results_map.get(name, {}).get('ES', 0))
        df['Critical'] = df['activityName'].apply(lambda name: cpm_results_map.get(name, {}).get('Critical', False))
        df['HoverText'] = df.apply(lambda row: f"<b>{row['activityName']}</b><br>Start: {row['start'].strftime('%Y-%m-%d')}<br>Finish: {row['end'].strftime('%Y-%m-%d')}<br>Duration: {row['duration']} days<br>ES: {cpm_results_map.get(row['activityName'], {}).get('ES', 'N/A')}, EF: {cpm_results_map.get(row['activityName'], {}).get('EF', 'N/A')}<br>Crew: {row['crew']}<br>Personnel: {row['personnel']}<br>Equipment: {row['equipment']}", axis=1)
        df['Color'] = df['Critical'].apply(lambda is_critical: '#ff3333' if is_critical else '#00ffcc')
        
        # Add critical path indicator to task names
        df['activityName'] = df.apply(lambda row: f"{row['activityName']} {'(Critical)' if row['Critical'] else ''}", axis=1)

        # Determine earliest start date for timeline offset
        earliest_start = df['start'].min()
        df['ES_offset'] = df['ES'].apply(lambda es: (pd.to_datetime(earliest_start) + timedelta(days=es) - earliest_start).days)

        # Create Plotly Gantt chart data
        df = df.sort_values(by=['start', 'duration'], ascending=[True, True])
        data = [{
            'type': 'bar',
            'x': df['duration'].tolist(),
            'y': df['activityName'].tolist(),
            'base': df['ES_offset'].tolist(),
            'orientation': 'h',
            'marker': {'color': df['Color'].tolist()},
            'name': 'Tasks',
            'hoverinfo': 'text',
            'text': df['HoverText'].tolist()
        }]

        # Define Plotly layout
        layout = {
            'title': {'text': project_name + ' Gantt Chart', 'font': {'family': 'Orbitron, sans-serif', 'size': 24, 'color': '#00ffcc'}, 'x': 0.5, 'xanchor': 'center', 'xref': 'paper'},
            'xaxis': {'type': 'linear', 'title': {'text': 'Days from Start', 'font': {'family': 'Inter, sans-serif', 'size': 16, 'color': '#f2f2f2'}}, 'showgrid': True, 'gridcolor': '#444', 'zeroline': False, 'linecolor': '#555', 'linewidth': 1, 'tickfont': {'family': 'Inter, sans-serif', 'size': 12, 'color': '#cccccc'}},
            'yaxis': {'title': {'text': 'Tasks', 'font': {'family': 'Inter, sans-serif', 'size': 16, 'color': '#f2f2f2'}}, 'autorange': 'reversed', 'categoryorder': 'array', 'categoryarray': df['activityName'].tolist(), 'showgrid': True, 'gridcolor': '#444', 'zeroline': False, 'linecolor': '#555', 'linewidth': 1, 'tickfont': {'family': 'Inter, sans-serif', 'size': 12, 'color': '#cccccc'}, 'ticklen': 5, 'tickwidth': 1, 'tickcolor': '#555'},
            'showlegend': False,
            'margin': {'l': 200, 'r': 20, 't': 80, 'b': 80},
            'paper_bgcolor': '#1e1e1e',
            'plot_bgcolor': '#1e1e1e',
            'font': {'color': '#f2f2f2'},
            'height': max(400, len(df) * 40)
        }

        # Generate resource histograms
        # Create a timeline of days from earliest start to latest finish
        project_duration = (df['end'].max() - earliest_start).days + 1
        timeline = [earliest_start + timedelta(days=i) for i in range(project_duration)]
        
        # Calculate daily resource usage
        daily_personnel = [0] * project_duration
        daily_equipment = [0] * project_duration
        
        for _, task in df.iterrows():
            start_idx = (task['start'] - earliest_start).days
            end_idx = start_idx + task['duration']
            for i in range(start_idx, end_idx):
                if 0 <= i < project_duration:
                    daily_personnel[i] += task['personnel']
                    daily_equipment[i] += task['equipment']

        # Create resource histogram data
        resource_data = [
            # Personnel histogram
            {
                'type': 'bar',
                'x': timeline,
                'y': daily_personnel,
                'name': 'Personnel',
                'marker': {'color': '#00ffcc'},
                'hovertemplate': 'Date: %{x}<br>Personnel: %{y}<extra></extra>'
            },
            # Equipment histogram
            {
                'type': 'bar',
                'x': timeline,
                'y': daily_equipment,
                'name': 'Equipment',
                'marker': {'color': '#ff4444'},
                'hovertemplate': 'Date: %{x}<br>Equipment: %{y}<extra></extra>'
            }
        ]

        # Define resource histogram layout
        resource_layout = {
            'title': {'text': 'Resource Usage Over Time', 'font': {'family': 'Orbitron, sans-serif', 'size': 18, 'color': '#00ffcc'}, 'x': 0.5, 'xanchor': 'center', 'xref': 'paper'},
            'xaxis': {'title': {'text': 'Date', 'font': {'family': 'Inter, sans-serif', 'size': 16, 'color': '#f2f2f2'}}, 'showgrid': True, 'gridcolor': '#444', 'zeroline': False, 'linecolor': '#555', 'linewidth': 1, 'tickfont': {'family': 'Inter, sans-serif', 'size': 12, 'color': '#cccccc'}},
            'yaxis': {'title': {'text': 'Resource Count', 'font': {'family': 'Inter, sans-serif', 'size': 16, 'color': '#f2f2f2'}}, 'showgrid': True, 'gridcolor': '#444', 'zeroline': False, 'linecolor': '#555', 'linewidth': 1, 'tickfont': {'family': 'Inter, sans-serif', 'size': 12, 'color': '#cccccc'}},
            'barmode': 'group',
            'showlegend': True,
            'legend': {'font': {'family': 'Inter, sans-serif', 'size': 12, 'color': '#f2f2f2'}},
            'margin': {'l': 120, 'r': 20, 't': 80, 'b': 80},
            'paper_bgcolor': '#1e1e1e',
            'plot_bgcolor': '#1e1e1e',
            'font': {'color': '#f2f2f2'},
            'height': 400
        }

        critical_activities = [task['activityName'] for task in activityList_with_cpm if task.get('Critical', False)]

        return jsonify({
            "gantt_data": {"data": data, "layout": layout},
            "resource_data": {"data": resource_data, "layout": resource_layout},
            "critical_path_activities": critical_activities,
            "processed_tasks": activityList_with_cpm
        }), 200

    except Exception as e:
        logger.error(f"Error in handle_tracker_post (Gantt): {e}", exc_info=True)
        return jsonify({"error": f"Internal server error processing Gantt request: {e}"}), 500

# --- Critical Path Method (CPM) Calculation Functions ---
# Adapted from the provided CriticalPath.py script

def addSuccessors(activityList):
    """Adds immediate successors to each activity in the list."""
    # Create a dictionary for quick lookup by activity name
    activity_dict = {activity["activityName"]: activity for activity in activityList}

    for activity in activityList:
        currentName = activity["activityName"]
        successors = []
        for other_activity in activityList:
            # Check all other activities to see if the current one is a predecessor
            if currentName in other_activity.get("immediatePredecessor", []):
                successors.append(other_activity["activityName"])
        activity["immediateSuccessor"] = successors # Assign successors directly to the activity dict

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

    # Process activities in order (assuming activityList is reasonably ordered or use topological sort)
    # A true topological sort would be more robust here.
    for activity in activityList:
        duration = activity.get('duration', 0) # Ensure duration exists, default to 0
        predecessorList = activity.get('immediatePredecessor', []) # Ensure predecessors exist

        ES = 0
        if not predecessorList:
            # Activities with no predecessors start at time 0 (or project start date)
            activity['ES'] = 0
        else:
            max_predecessor_ef = 0
            for pred_name in predecessorList:
                 predecessor_activity = activity_dict.get(pred_name)
                 if predecessor_activity:
                     max_predecessor_ef = max(max_predecessor_ef, predecessor_activity.get('EF', 0))
                 else:
                      # Log a warning for invalid predecessor names
                      logger.warning(f"Predecessor '{pred_name}' not found for activity '{activity['activityName']}'.")

            activity['ES'] = max_predecessor_ef # Early Start is max Early Finish of predecessors

        activity['EF'] = activity['ES'] + duration # Calculate Early Finish


def getProjectFinish(activityList):
    """Calculates the project's total duration based on Early Finish dates."""
    if not activityList:
        return 0
    return max(activity.get('EF', 0) for activity in activityList) # Ensure EF exists

def calculateLateDates(activityList):
    """Calculates Late Finish (LF) and Late Start (LS) dates."""
    project_finish = getProjectFinish(activityList)
    # Create a dictionary for quick lookup by activity name
    activity_dict = {activity['activityName']: activity for activity in activityList}

    # Calculate Late Dates by iterating backward
    # Need to process activities in reverse topological order or ensure correct successor lookups
    # Assuming activityList is roughly ordered such that successors appear later
    for i in range(len(activityList) - 1, -1, -1):
        activity = activityList[i]
        duration = activity.get('duration', 0)
        successorList = activity.get('immediateSuccessor', [])

        if not successorList:
            # Activities with no successors finish by the project finish time
            activity['LF'] = project_finish
        else:
            min_successor_ls = float('inf') # Initialize with a very large number
            for succ_name in successorList:
                successor_activity = activity_dict.get(succ_name)
                if successor_activity:
                     min_successor_ls = min(min_successor_ls, successor_activity.get('LS', float('inf')))
                else:
                     logger.warning(f"Successor '{succ_name}' not found for activity '{activity['activityName']}'.")


            activity['LF'] = min_successor_ls # Late Finish is min Late Start of successors

        activity['LS'] = activity['LF'] - duration # Calculate Late Start

def calculateTF(activityList):
    """Calculates Total Float (TF) and identifies Critical Activities."""
    for activity in activityList:
        # Total Float = Late Finish - Early Finish OR Late Start - Early Start
        activity['TF'] = activity.get('LF', 0) - activity.get('EF', 0) # Ensure LF, EF exist
        # Alternatively: activity['TF'] = activity.get('LS', 0) - activity.get('ES', 0)
        if activity['TF'] <= 0: # Use <= 0 to catch potential floating point issues near zero
            activity['Critical'] = True
            activity['TF'] = 0 # Ensure Critical activities have 0 float
        else:
             activity['Critical'] = False # Explicitly set non-critical

def calculateFF(activityList):
    """Calculates Free Float (FF)."""
    project_finish = getProjectFinish(activityList)
    # Create a dictionary for quick lookup by activity name
    activity_dict = {activity['activityName']: activity for activity in activityList}

    # Calculate Free Float
    for activity in activityList:
        successorList = activity.get('immediateSuccessor', [])
        EF = activity.get('EF', 0)

        if not successorList:
            # Activities with no successors have Free Float equal to their Total Float
             activity['FF'] = activity.get('TF', 0)
             # Alternatively: activity['FF'] = project_finish - EF
        else:
            min_successor_es = float('inf') # Initialize with a very large number
            for succ_name in successorList:
                 successor_activity = activity_dict.get(succ_name)
                 if successor_activity:
                     min_successor_es = min(min_successor_es, successor_activity.get('ES', float('inf')))
                 else:
                      logger.warning(f"Successor '{succ_name}' not found when calculating FF for '{activity['activityName']}'.")

            activity['FF'] = min_successor_es - EF
            # Free float cannot be negative due to logic, but adding a check for safety
            if activity['FF'] < 0:
                activity['FF'] = 0

def perform_cpm_analysis(activityList):
    """Performs full CPM analysis on the given activity list."""
    # Ensure tasks have required fields before proceeding
    for task in activityList:
        if 'activityName' not in task or 'duration' not in task or 'immediatePredecessor' not in task:
            raise ValueError("Each task must have 'activityName', 'duration', and 'immediatePredecessor'.")

    # Note: A proper topological sort should be implemented for guaranteed correctness
    # with arbitrary task dependencies. The current order-dependent approach might
    # produce incorrect results if the input list is not in a valid sequence.

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

        # Retrieve CPM results from session
        activityList_with_cpm = session.get('activityList_with_cpm')
        if not activityList_with_cpm:
            logger.error("CPM analysis data not found in session.")
            return jsonify({"error": "Please generate the Gantt chart first to perform progress analysis."}), 400

        # Process each task
        processed_tasks = []
        for task in tasks:
            # Ensure expected keys are present in task data from frontend
            required_keys = ['activityName', 'percentComplete', 'budgetedCost', 'actualCost', 'actualStart', 'actualFinish']
            if not all(key in task for key in required_keys):
                 missing = [key for key in required_keys if key not in task]
                 logger.error(f"Missing keys in task data: {missing}")
                 # Provide a more informative error message back to the user
                 return jsonify({"error": f"Incomplete task progress data received. Missing keys: {', '.join(missing)}"}), 400


            try:
                percent_complete = float(task.get('percentComplete', 0)) # Use get with default for safety
                budgeted_cost = float(task.get('budgetedCost', 0))
                actual_cost = float(task.get('actualCost', 0))
                actual_start_str = task.get('actualStart')
                actual_finish_str = task.get('actualFinish')

                # Validate numerical inputs
                if not (0 <= percent_complete <= 100):
                     return jsonify({"error": f"Invalid % Complete for task '{task.get('activityName', 'Unknown')}': {percent_complete}. Must be between 0 and 100."}), 400
                if budgeted_cost < 0 or actual_cost < 0:
                     return jsonify({"error": f"Invalid cost value for task '{task.get('activityName', 'Unknown')}'. Costs cannot be negative."}), 400

                # Handle date conversions and validation
                actual_start_date = None
                actual_finish_date = None
                if actual_start_str:
                    try:
                        actual_start_date = datetime.strptime(actual_start_str, '%Y-%m-%d')
                    except ValueError:
                         return jsonify({"error": f"Invalid Actual Start Date format for task '{task.get('activityName', 'Unknown')}': {actual_start_str}. Use YYYY-MM-DD."}), 400

                if actual_finish_str:
                    try:
                        actual_finish_date = datetime.strptime(actual_finish_str, '%Y-%m-%d')
                    except ValueError:
                         return jsonify({"error": f"Invalid Actual Finish Date format for task '{task.get('activityName', 'Unknown')}': {actual_finish_str}. Use YYYY-MM-DD."}), 400

                # Optional: Validate date logic (e.g., start before finish)
                if actual_start_date and actual_finish_date and actual_start_date > actual_finish_date:
                    logger.warning(f"Actual Start Date is after Actual Finish Date for task '{task.get('activityName', 'Unknown')}'.")
                    # Decide how to handle this: return error, log warning, or ignore. Logging for now.


                # Prepare data for Supabase update
                update_data = {
                    'percent_complete': percent_complete,
                    'budgeted_cost': budgeted_cost,
                    'actual_cost': actual_cost,
                    'updated_at': datetime.now().isoformat() # Use ISO format for timestamp
                }
                # Add dates if they are valid datetime objects
                if actual_start_date:
                    update_data['actual_start'] = actual_start_date.isoformat()
                if actual_finish_date:
                    update_data['actual_finish'] = actual_finish_date.isoformat()

                logger.info(f"Attempting to update task '{task.get('activityName', 'Unknown')}' in Supabase with data: {update_data}")
                
                # Update the task in Supabase
                # Assuming 'activity_name' is the unique identifier in your 'tasks' table
                response = supabase.table('tasks').update(update_data).eq('activity_name', task.get('activityName')).execute()

                # Check Supabase response for errors
                if response.data is None or len(response.data) == 0:
                     logger.warning(f"Supabase update for task '{task.get('activityName', 'Unknown')}' resulted in no data or error: {response.error}")
                     # Decide if this is an error condition you want to return to the user
                     # For now, continue processing but log the issue.

                elif response.error:
                    logger.error(f"Supabase error updating task '{task.get('activityName', 'Unknown')}': {response.error}", exc_info=True)
                    # You might want to return an error here if the database update is critical
                    # return jsonify({"error": f"Database error updating task '{task.get('activityName', 'Unknown')}': {response.error['message']}"}), 500


                # Calculate earned value metrics for the response
                earned_value = budgeted_cost * (percent_complete / 100)
                cost_variance = earned_value - actual_cost
                schedule_variance = earned_value - budgeted_cost # Note: This is technically Planned Value (PV) based SV if using Budgeted Cost as PV proxy
                # For accurate SV, you'd need Planned Value at the reporting date, which requires the original schedule.
                # Using Budgeted Cost here as a simplified proxy for PV.

                cost_performance_index = earned_value / actual_cost if actual_cost != 0 else (float('inf') if earned_value > 0 else 0) # Handle division by zero
                schedule_performance_index = earned_value / budgeted_cost if budgeted_cost != 0 else (float('inf') if earned_value > 0 else 0) # Handle division by zero


                processed_tasks.append({
                    'activityName': task.get('activityName'),
                    'percentComplete': percent_complete,
                    'budgetedCost': budgeted_cost,
                    'actualCost': actual_cost,
                    'actualStart': actual_start_str, # Include actual dates in response
                    'actualFinish': actual_finish_str,
                    'earnedValue': earned_value,
                    'costVariance': cost_variance,
                    'scheduleVariance': schedule_variance,
                    'costPerformanceIndex': cost_performance_index,
                    'schedulePerformanceIndex': schedule_performance_index
                })

            except ValueError as ve:
                # Catch errors from float conversion or other value issues during processing
                 logger.error(f"Data processing error for task '{task.get('activityName', 'Unknown')}': {ve}", exc_info=True)
                 return jsonify({"error": f"Error processing data for task '{task.get('activityName', 'Unknown')}': {ve}"}), 400
            except Exception as ex:
                 # Catch any other unexpected errors during task processing
                 logger.error(f"Unexpected error processing task '{task.get('activityName', 'Unknown')}': {ex}", exc_info=True)
                 return jsonify({"error": f"Unexpected error processing task '{task.get('activityName', 'Unknown')}': {ex}"}), 500


        # Generate S-curve data
        try:
            report_date_str = data.get('report_date')
            report_date = datetime.strptime(report_date_str, '%Y-%m-%d') if report_date_str else datetime.now()

            # Sort tasks by planned finish date to plot S-curve chronologically based on plan
            # Use the EF calculated during CPM analysis
            tasks_with_cpm_dict = {task['activityName']: task for task in tasks} # Original input tasks
            processed_tasks_with_ef = []
            for task in processed_tasks:
                 cpm_info = activityList_with_cpm.get(task['activityName'], {}) # Get CPM info from the list used for Gantt
                 task_with_ef = task.copy()
                 task_with_ef['EF'] = cpm_info.get('EF', 0) # Add EF for sorting
                 task_with_ef['start_date'] = datetime.strptime(cpm_info.get('start', report_date.strftime('%Y-%m-%d')), '%Y-%m-%d') # Add original start date
                 processed_tasks_with_ef.append(task_with_ef)

            # Sort by planned start date, then EF
            sorted_tasks_for_scurve = sorted(processed_tasks_with_ef, key=lambda x: (x.get('start_date', report_date), x.get('EF', 0)))

            # Create cumulative progress data points over time
            # We need a timeline. Let's use days from the earliest project start date.
            earliest_start = min(t.get('start_date', report_date) for t in sorted_tasks_for_scurve) if sorted_tasks_for_scurve else report_date
            project_duration_days = (report_date - earliest_start).days + 1 # Days from start to report date

            timeline_dates = [earliest_start + timedelta(days=i) for i in range(project_duration_days)]
            cumulative_budget = [0] * project_duration_days
            cumulative_actual = [0] * project_duration_days
            cumulative_earned = [0] * project_duration_days # Earned value at each day


            # Calculate cumulative values over the timeline up to the report date
            for day_index, current_date in enumerate(timeline_dates):
                 if day_index > 0:
                      cumulative_budget[day_index] = cumulative_budget[day_index - 1]
                      cumulative_actual[day_index] = cumulative_actual[day_index - 1]
                      cumulative_earned[day_index] = cumulative_earned[day_index - 1]

                 for task in sorted_tasks_for_scurve:
                      # Simplified approach: Add full budgeted cost on planned start day
                      # A more accurate S-curve distributes cost over the planned duration
                      planned_start = task.get('start_date', report_date)
                      planned_end = planned_start + timedelta(days=task.get('duration', 0) - 1) # Assuming duration is from original task data

                      # Add planned value (budgeted cost) accumulation over planned duration
                      if planned_start <= current_date <= planned_end:
                           # Distribute budgeted cost linearly over planned duration
                           days_into_task = (current_date - planned_start).days + 1
                           task_planned_value = (task['budgetedCost'] / task.get('duration', 1)) * days_into_task if task.get('duration', 1) > 0 else 0
                           cumulative_budget[day_index] += task_planned_value # This overwrites, should add increment

                 # Recalculate cumulative budgeted cost more accurately: add the planned value for tasks starting or in progress on this day
                 cumulative_budget[day_index] = sum(
                      task['budgetedCost'] * min(1.0, max(0.0, (current_date - task.get('start_date', report_date)).days + 1) / task.get('duration', 1)) # Simple linear accumulation
                      for task in sorted_tasks_for_scurve
                      if task.get('start_date', report_date) <= current_date
                 )


                 # Add actual cost and earned value accumulation for tasks completed or in progress
                 for task in processed_tasks:
                      # Simple approach: Add full actual cost and earned value on actual finish or report date if in progress
                      # A more accurate S-curve accumulates these over time
                      actual_finish = None
                      if task.get('actualFinish'):
                           try:
                                actual_finish = datetime.strptime(task['actualFinish'], '%Y-%m-%d')
                           except ValueError:
                                pass # Invalid date format handled earlier, but defensive here

                      if actual_finish and actual_finish <= current_date:
                           cumulative_actual[day_index] += task['actualCost'] # Add actual cost on finish date
                           cumulative_earned[day_index] += task['earnedValue'] # Add earned value on finish date
                      elif task.get('actualStart') and datetime.strptime(task['actualStart'], '%Y-%m-%d') <= current_date:
                           # Task started but not finished by current_date (or report_date)
                           # Accumulate actual cost and earned value up to current_date
                           # This requires distributing actual cost and earned value over the actual duration or duration up to report_date
                           # A simple approach: distribute linearly up to report_date for in-progress tasks
                           actual_start = datetime.strptime(task['actualStart'], '%Y-%m-%d')
                           days_in_progress_up_to_date = (current_date - actual_start).days + 1
                           # Need actual duration or remaining duration for accurate distribution
                           # For simplicity, let's use the reported percent complete scaled over the planned duration
                           # This is a significant simplification and won't produce a true S-curve based on actual progress over time
                           # A proper S-curve needs actual spending/progress data points over time
                           # Let's return a basic S-curve based on cumulative values at the report date for now

            # Re-calculating cumulative values only at the report date for a single point
            total_budgeted_cost = sum(task['budgetedCost'] for task in processed_tasks)
            total_actual_cost = sum(task['actualCost'] for task in processed_tasks)
            total_earned_value = sum(task['earnedValue'] for task in processed_tasks)

            # For a simple S-curve representation, we can plot points at 0% and the current total % complete
            # and cumulative values at these points. A proper S-curve requires plotting over time.
            # Let's plot 3 points: Start (0%), Report Date (current % complete), and Planned Finish (100% Budgeted)

            s_curve_dates = [earliest_start]
            s_curve_budget_values = [0]
            s_curve_actual_values = [0]
            s_curve_earned_values = [0]

            # Add point at the report date
            s_curve_dates.append(report_date)
            s_curve_budget_values.append(sum(
                 task['budgetedCost'] * min(1.0, max(0.0, (report_date - task.get('start_date', report_date)).days + 1) / task.get('duration', 1)) # Planned value at report date
                 for task in sorted_tasks_for_scurve
                 if task.get('start_date', report_date) <= report_date
            ))

            s_curve_actual_values.append(total_actual_cost)
            s_curve_earned_values.append(total_earned_value)

            # Add point at planned project finish date (simplified as max EF day from CPM + earliest start)
            planned_project_finish = earliest_start + timedelta(days=getProjectFinish(activityList_with_cpm)) if activityList_with_cpm else report_date + timedelta(days=1)
            s_curve_dates.append(planned_project_finish)
            s_curve_budget_values.append(sum(task['budgetedCost'] for task in processed_tasks)) # Total budgeted cost at planned finish
            s_curve_actual_values.append(total_actual_cost) # Actual cost is same at planned finish if not updated
            s_curve_earned_values.append(total_earned_value) # Earned value is same at planned finish if not updated


            # Create S-curve plot data
            s_curve_plot_data = [
                go.Scatter(
                    x=s_curve_dates,
                    y=s_curve_budget_values,
                    mode='lines+markers',
                    name='Planned Value (PV)',
                    line=dict(color='#00ffcc', width=2),
                    hoverinfo='text',
                    hovertext=[f'Planned Value: ${y:.2f}' for y in s_curve_budget_values]
                ),
                go.Scatter(
                    x=s_curve_dates,
                    y=s_curve_actual_values,
                    mode='lines+markers',
                    name='Actual Cost (AC)',
                    line=dict(color='#ff4444', width=2),
                    hoverinfo='text',
                    hovertext=[f'Actual Cost: ${y:.2f}' for y in s_curve_actual_values]
                ),
                go.Scatter(
                    x=s_curve_dates,
                    y=s_curve_earned_values,
                    mode='lines+markers',
                    name='Earned Value (EV)',
                    line=dict(color='#4444ff', width=2),
                    hoverinfo='text',
                    hovertext=[f'Earned Value: ${y:.2f}' for y in s_curve_earned_values]
                )
            ]

            # Update layout
            s_curve_layout = go.Layout(
                title='Project S-Curve (PV, AC, EV)',
                xaxis=dict(title='Timeline', type='date'),
                yaxis=dict(title='Cost ($)'),
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


            # Calculate performance metrics (using total values at report date)
            schedule_variance = total_earned_value - s_curve_budget_values[1] # EV - PV at report date
            cost_variance = total_earned_value - total_actual_cost # EV - AC at report date
            schedule_performance_index = total_earned_value / s_curve_budget_values[1] if s_curve_budget_values[1] != 0 else (float('inf') if total_earned_value > 0 else 0)
            cost_performance_index = total_earned_value / total_actual_cost if total_actual_cost != 0 else (float('inf') if total_earned_value > 0 else 0)

            metrics = {
                 'schedule_variance': schedule_variance,
                 'cost_variance': cost_variance,
                 'critical_path': 'N/A', # Critical path comes from initial plan
                 'critical_path_updates': 'Run Gantt Chart generation to see critical path.',
                 'analysis_notes': 'S-curve and metrics based on reported progress as of ' + report_date.strftime('%Y-%m-%d') + '. PV is estimated based on linear distribution of budgeted cost up to the report date.'
            }


            return jsonify({
                's_curve_data': {'data': s_curve_plot_data, 'layout': s_curve_layout},
                'metrics': metrics,
                'processed_tasks': processed_tasks # Return processed tasks with calculated values
            }), 200


        except Exception as e:
            logger.error(f"Error generating S-curve or metrics: {e}", exc_info=True)
            return jsonify({"error": f"Error generating S-curve or metrics: {str(e)}"}), 500


    except Exception as e:
        logger.error(f"Error in handle_progress_post: {e}", exc_info=True)
        return jsonify({"error": f"Internal server error in progress handling: {str(e)}"}), 500