import csv
import time
import datetime
import pandas as pd
import json
from pathlib import Path

bufferMinutes = 5
speed_threshold = 20
distance_threshold = 0.220
minutesGap = 1
cc_car_mapping = {}

cc_data = pd.read_csv("./MC2/cc_data.csv", encoding='utf-8')
with open('./pre_processed_data/time_stationaryCars_mapping_speed={}_distance={}_minutesGap={}.json'.format(speed_threshold, distance_threshold, minutesGap), 'r', encoding="utf-8") as file:
    json_data = file.read()
    stationary_cars_data = json.loads(json_data)

temp_data = {"timestamp":"01/06/2014 07:52", "location":"Brew've Been Served", "price":"32.83", "last4ccnum":"9405"}
temp_df = pd.DataFrame(temp_data, index=[0])

def run():
    i = 0
    for index, row in cc_data.iterrows():
        cc_location = row['location']
        cc_id = row['last4ccnum']
        current_timestamp = datetime.datetime.strptime(row['timestamp'], '%m/%d/%Y %H:%M')
        
        for delta in range(-1*bufferMinutes, 1):
            new_timestamp= current_timestamp + datetime.timedelta(minutes=delta)
            day = str(new_timestamp.day)
            hour = str(new_timestamp.hour)
            minute = str(new_timestamp.minute)
        
            if day in stationary_cars_data:
                if hour in stationary_cars_data[day]:
                    if minute in stationary_cars_data[day][hour]:
                        stopped_cars_at_timestamp = stationary_cars_data[day][hour][minute]
                    else:
                        continue
                else:
                    continue
            else:
                continue

            for car in stopped_cars_at_timestamp:
                for stop in stopped_cars_at_timestamp[car]:
                    # print("car = {}, location = {}, cc = {}, cc_loca = {}".format(car, stop['location'], cc_id, cc_location))
                    if stop['location'] == cc_location:
                        if not cc_id in cc_car_mapping:
                            cc_car_mapping[cc_id] = {}
                        if not car in cc_car_mapping[cc_id]:
                            cc_car_mapping[cc_id][car] = 0
                        cc_car_mapping[cc_id][car] += 1
                        break

def write_data_into_files():
    path_of_project_folder = Path(__file__).parent.parent.resolve().as_posix()
    with open(path_of_project_folder+'./pre_processed_data/cc_car_mapping_bufferMinutes={}_speed={}_distance={}_minutesGap={}.json'.format(bufferMinutes, speed_threshold, distance_threshold, minutesGap), 'w+') as fp1:
        json.dump(cc_car_mapping, fp1)
    
if __name__ == '__main__':
    run()
    write_data_into_files()