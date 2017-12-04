# libraries
import csv
import operator

################################################################################
#                                                                              #
# THESE ARE THINGS YOU MIGHT WANT TO CHANGE                                    #
#                                                                              #
################################################################################

# constants
MIN_YEAR = 1990
MAX_YEAR = 2017

# files
FIELDS = '../data/all_fields.csv'      # CSV of fields (e.g. concentrations.csv)
INPUT = '../data/raw.csv'                                   # main CSV: all data
OUTPUT = '../data/all_fields_all_schools_1931_2017.csv'              # where to write out to

# schools to put in output
# set to empty list for all
SCHOOLS = []
# columns to put in output
COLUMNS = ['ACADEMIC_YEAR']

################################################################################
#                                                                              #
# THESE ARE THINGS YOU PROBABLY WON'T CHANGE                                   #
#                                                                              #
################################################################################

# data structures
dic = {}
concentrations = set()

# read concentrations (or whatever depts we care about)
with open(FIELDS) as fp:
    reader = csv.reader(fp)
    # it has a header and i didn't bother using a DictReader so skip
    next(reader)
    for line in reader:
        concentrations.add(line[0])

# big moves...
# open raw data
# open outfile
with open(INPUT) as infp:
    with open(OUTPUT, 'w') as outfp:
        # look at everything but...
        reader = csv.DictReader(infp)
        # only write the colums we care to keep
        writer = csv.DictWriter(outfp, fieldnames=COLUMNS)
        # let's have nice CSVs thanks
        writer.writeheader()
        # now, one row at a time,
        for line in reader:
            # FAS only
            if SCHOOLS and line['ACAD_GROUP'] not in SCHOOLS:
                continue
            # only years we like
            if int(line['ACADEMIC_YEAR']) < MIN_YEAR or int(line['ACADEMIC_YEAR']) > MAX_YEAR:
                continue
            # and only departments we like
            # if line['CLASS_ACAD_ORG_DESCRIPTION'] not in concentrations:
                # continue
            if line['CLASS_ACAD_ORG_DESCRIPTION'] == 'No Department':
                continue
            # so we care about this line, copy out the fields we want
            writeline = {column: line[column] for column in COLUMNS}
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
    print (tup)
