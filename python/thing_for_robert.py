import csv
import copy
import collections

schools = {}
rows = collections.OrderedDict()

with open('../data/raw.csv') as infp:
    reader = csv.DictReader(infp)
    for line in reader:
        if line['ACAD_GROUP'] not in schools:
            schools[line['ACAD_GROUP']] = 0

with open('../data/raw.csv') as infp:
    reader = csv.DictReader(infp)
    for line in reader:
        if int(line['ACADEMIC_YEAR']) >= 1990 and int(line['ACADEMIC_YEAR']) <= 2017:
            if line['ACADEMIC_YEAR'] not in rows:
                rows[line['ACADEMIC_YEAR']] = copy.deepcopy(schools)
            rows[line['ACADEMIC_YEAR']][line['ACAD_GROUP']] += 1

with open('../data/nest_for_robert.csv', 'w') as outfp:
    writer = csv.DictWriter(outfp, fieldnames=['ACADEMIC_YEAR'] + schools.keys())
    writer.writeheader()
    for key in rows:
        rows[key]['ACADEMIC_YEAR'] = key
        writer.writerow(rows[key])
