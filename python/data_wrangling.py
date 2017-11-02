import csv
import operator

dic = {}

concentrations = set()

with open('../data/concentrations.csv') as fp:
    reader = csv.reader(fp)
    for line in reader:
        concentrations.add(line[0])

with open('../data/raw.csv') as infp:
    with open('../data/filter_to_concentrations.csv', 'w') as outfp:
        reader = csv.DictReader(infp)
        writer = csv.DictWriter(outfp, fieldnames=reader.fieldnames)
        writer.writeheader()
        for line in reader:
            if line["CLASS_ACAD_ORG_DESCRIPTION"] not in concentrations:
                continue
            else:
                writer.writerow(line)
            if line["CLASS_ACAD_ORG_DESCRIPTION"] not in dic:
                dic[line["CLASS_ACAD_ORG_DESCRIPTION"]] = [line]
            else:
                dic[line["CLASS_ACAD_ORG_DESCRIPTION"]] += [line]

for key in dic:
    dic[key] = len(dic[key])

sort = sorted(dic.items(), key=operator.itemgetter(1))[::-1]

for tup in sort:
    print tup
