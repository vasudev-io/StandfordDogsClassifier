import csv
SOURCE_FILE = './data/stanford_dogs.csv'

def read_data():
    csv_data = {}
    csv_reader = csv.DictReader(open(SOURCE_FILE))
    # TODO: Implement CSV file reader

    return csv_data
