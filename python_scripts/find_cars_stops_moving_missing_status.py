import csv
import time
import geopy.distance
import datetime
from geopy.exc import GeocoderTimedOut
# import haversine as hs
import pandas as pd
import json
from pathlib import Path

data = pd.read_csv("./MC2/gps.csv", encoding="utf-8")

def find_distance_between_two_points(point1, point2, attempt=1, max_attempts=6):
    try:
        return geopy.distance.geodesic(point1, point2)
    except GeocoderTimedOut:
        if attempt <= max_attempts:
            time.sleep(1.1*attempt)
            return find_distance_between_two_points(point1, point2, attempt=attempt+1)
        raise

i = 0
car_gps_mapping = {}
car_status_for_each_minute = {} # [id][day][hour][minute][status] = 'moving' OR 'stationary' OR 'missing'
time_stationaryCars_mapping = {}  # [day][hour][minute][id] = array of dictionaries where each dictionary has info of 'Timestamp', 'id', 'lat', 'long'. Here we will store the infromation of stationary cars for each minute of each day.
stationaryCars_location_time_mapping = []

for index, row in data.iterrows():
    car_id = row['id']
    if not car_id in car_gps_mapping:
        car_gps_mapping[car_id] = []
    car_gps_mapping[car_id].append(row)

for car_id in car_gps_mapping.keys():
    j = 0
    prev_row = ""
    car_status_for_each_minute[car_id] = {}

    for row in car_gps_mapping[car_id]:
        if j == 0:
            prev_row = row
            j += 1
            continue

        current_timestamp = datetime.datetime.strptime(row['Timestamp'], '%m/%d/%Y %H:%M:%S')
        day = current_timestamp.day
        hour = current_timestamp.hour
        minute = current_timestamp.minute
        if not day in car_status_for_each_minute[car_id]:
            car_status_for_each_minute[car_id][day] = {}
        if not hour in car_status_for_each_minute[car_id][day]:
            car_status_for_each_minute[car_id][day][hour] = {}
        if not minute in car_status_for_each_minute[car_id][day][hour]:
            car_status_for_each_minute[car_id][day][hour][minute] = {"moving":0, "stationary":0, "missing":0, "status":""}

        prev_timestamp = datetime.datetime.strptime(prev_row['Timestamp'], '%m/%d/%Y %H:%M:%S')

        prev_cordinates = (prev_row['lat'], prev_row['long'])
        current_cordinates = (row['lat'], row['long'])

        distance = find_distance_between_two_points(prev_cordinates, current_cordinates)
        time_difference = max((current_timestamp - prev_timestamp).total_seconds(), 0.8)

        speed_kmph = distance / (time_difference / 3600)

        # decide the status of the car for this gps entry (for this second)
        if time_difference < 30 and speed_kmph > 20: #moving
            value = car_status_for_each_minute[car_id][day][hour][minute]['moving']
            car_status_for_each_minute[car_id][day][hour][minute]['moving'] = value + 1
        elif distance < 0.220: #stationary
            value = car_status_for_each_minute[car_id][day][hour][minute]['stationary']
            car_status_for_each_minute[car_id][day][hour][minute]['stationary'] = value + 1

            if not day in time_stationaryCars_mapping:
                time_stationaryCars_mapping[day] = {}
            if not hour in time_stationaryCars_mapping[day]:
                time_stationaryCars_mapping[day][hour] = {}
            if not minute in time_stationaryCars_mapping[day][hour]:
                time_stationaryCars_mapping[day][hour][minute] = {}
            if not car_id in time_stationaryCars_mapping[day][hour][minute]:
                time_stationaryCars_mapping[day][hour][minute][car_id] = []

            time_stationaryCars_mapping[day][hour][minute][car_id].append(row.to_dict())
            stationaryCars_location_time_mapping.append({"car_id":car_id, "lat":row['lat'], "long":row['long'], "Timestamp":row['Timestamp']})
        else: #missing
            value = car_status_for_each_minute[car_id][day][hour][minute]['missing']
            car_status_for_each_minute[car_id][day][hour][minute]['missing'] = value + 1

        # decide the status of the car for the whole minute
        if car_status_for_each_minute[car_id][day][hour][minute]['moving'] >= car_status_for_each_minute[car_id][day][hour][minute]['stationary']:
            if car_status_for_each_minute[car_id][day][hour][minute]['moving'] > car_status_for_each_minute[car_id][day][hour][minute]['missing']:
                car_status_for_each_minute[car_id][day][hour][minute]['status'] = "moving"
            else:
                car_status_for_each_minute[car_id][day][hour][minute]['status'] = "missing"
        else:
            if car_status_for_each_minute[car_id][day][hour][minute]['stationary'] > car_status_for_each_minute[car_id][day][hour][minute]['missing']:
                car_status_for_each_minute[car_id][day][hour][minute]['status'] = "stationary"
            else:
                car_status_for_each_minute[car_id][day][hour][minute]['status'] = "missing"

        prev_row = row
        j += 1

path_of_project_folder = Path(__file__).parent.parent.resolve().as_posix()
with open(path_of_project_folder+'/pre_processed_data/car_status_for_each_minute.json', 'w+') as fp1:
    json.dump(car_status_for_each_minute, fp1)

with open(path_of_project_folder+'/pre_processed_data/time_stationaryCars_mapping.json', 'w+') as fp2:
    json.dump(time_stationaryCars_mapping, fp2)

with open(path_of_project_folder+'/pre_processed_data/stationaryCars_location_time_mapping.csv', 'w+', newline='') as fp3:
    dict_writer = csv.DictWriter(fp3, stationaryCars_location_time_mapping[0].keys())
    dict_writer.writeheader()
    dict_writer.writerows(stationaryCars_location_time_mapping)