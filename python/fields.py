import csv
import operator

dic = {}

with open('../data/raw.csv') as infp:
    reader = csv.DictReader(infp)
    for line in reader:
        dept = line['CLASS_ACAD_ORG_DESCRIPTION']
        if dept not in dic:
            dic[dept] = 1
        else:
            dic[dept] += 1

sort = sorted(dic.items(), key=operator.itemgetter(1))[::-1]
for tup in sort:
    print tup

