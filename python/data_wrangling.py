# libraries
import csv
import operator

# constants
MIN_YEAR = 1990
MAX_YEAR = 2017

# data structures
dic = {}
concentrations = set()
fields_of_interest = ["ACADEMIC_YEAR", "CLASS_ACAD_ORG_DESCRIPTION"]

# read concentrations (or depts we care about)
with open('../data/concentrations.csv') as fp:
    reader = csv.reader(fp)
    # it has a header and i didn't bother using a DictReader so skip
    next(reader)
    for line in reader:
        concentrations.add(line[0])

# big moves...
# open raw data
# open outfile
with open('../data/raw.csv') as infp:
    with open('../data/filter_to_concentrations.csv', 'w') as outfp:
        # look at everything but...
        reader = csv.DictReader(infp)
        # only write the colums we care to keep
        writer = csv.DictWriter(outfp, fieldnames=fields_of_interest)
        # let's have nice CSVs thanks
        writer.writeheader()
        # now, one row at a time,
        for line in reader:
            # only years we like
            if int(line["ACADEMIC_YEAR"]) < MIN_YEAR or int(line["ACADEMIC_YEAR"]) > MAX_YEAR:
                continue
            # and only departments we like
            if line["CLASS_ACAD_ORG_DESCRIPTION"] not in concentrations:
                continue
            # so we care about this line, copy out the fields we want
            writeline = {field: line[field] for field in fields_of_interest}
            writer.writerow(writeline)
            # this is just for display. departments and total counts
            if line["CLASS_ACAD_ORG_DESCRIPTION"] not in dic:
                dic[line["CLASS_ACAD_ORG_DESCRIPTION"]] = [line]
            else:
                dic[line["CLASS_ACAD_ORG_DESCRIPTION"]] += [line]

# get counts per dept,
for key in dic:
    dic[key] = len(dic[key])
# sort,
sort = sorted(dic.items(), key=operator.itemgetter(1))[::-1]
# and print (one per line for readability)
for tup in sort:
    print tup
