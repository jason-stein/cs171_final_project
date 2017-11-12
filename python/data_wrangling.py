# libraries
import csv
import operator

# constants
MIN_YEAR = 1975
MAX_YEAR = 2017

# files
FIELDS_OF_INTEREST = '../data/concentrations.csv'
RAW = '../data/raw.csv'
CLEAN = '../data/filter_to_all_fields.csv'


# data structures
dic = {}
concentrations = set()
columns = ['ACADEMIC_YEAR', 'CLASS_ACAD_ORG_DESCRIPTION', 'COURSE_TITLE_LONG']

# read concentrations (or whatever depts we care about)
with open(FIELDS_OF_INTEREST) as fp:
    reader = csv.reader(fp)
    # it has a header and i didn't bother using a DictReader so skip
    next(reader)
    for line in reader:
        concentrations.add(line[0])

# big moves...
# open raw data
# open outfile
with open(RAW) as infp:
    with open(CLEAN, 'w') as outfp:
        # look at everything but...
        reader = csv.DictReader(infp)
        # only write the colums we care to keep
        writer = csv.DictWriter(outfp, fieldnames=columns)
        # let's have nice CSVs thanks
        writer.writeheader()
        # now, one row at a time,
        for line in reader:
            # only years we like
            if int(line['ACADEMIC_YEAR']) < MIN_YEAR or int(line['ACADEMIC_YEAR']) > MAX_YEAR:
                continue
            # and only departments we like
            # if line['CLASS_ACAD_ORG_DESCRIPTION'] not in concentrations:
                # continue
            if line['CLASS_ACAD_ORG_DESCRIPTION'] == 'No Department':
                continue
            # so we care about this line, copy out the fields we want
            writeline = {column: line[column] for column in columns}
            writer.writerow(writeline)
            # this is just for display. departments and total counts
            if line['CLASS_ACAD_ORG_DESCRIPTION'] not in dic:
                dic[line['CLASS_ACAD_ORG_DESCRIPTION']] = [line]
            else:
                dic[line['CLASS_ACAD_ORG_DESCRIPTION']] += [line]

# if we want to write out the fields we found
with open('../data/concentrations2.csv', 'w') as outfp:
    writer = csv.writer(outfp)
    writer.writerow(['Concentration'])
    for key in dic:
        writer.writerow([key])

# get counts per dept,
for key in dic:
    dic[key] = len(dic[key])
# sort,
sort = sorted(dic.items(), key=operator.itemgetter(1))[::-1]
# and print (one per line for readability)
for tup in sort:
    print tup
