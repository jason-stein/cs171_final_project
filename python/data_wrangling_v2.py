import pandas as pd

MIN_YEAR = 1990
MAX_YEAR = 2017

COURSES_IN = 'data/raw.csv'
INSTRUCTORS_IN = 'data/instructors.csv'
OUTFILE = 'data/merged.csv'

FIELDS_OF_INTEREST = ['CLASS_ACAD_ORG_DESCRIPTION', 'ACADEMIC_YEAR',
                      'COURSE_TITLE_LONG', 'INSTRUCTOR_NAME', 'ACAD_GROUP',
                      'COURSE_ID']

df1 = pd.read_csv(COURSES_IN)
print("courses shape: ", df1.shape)
df2 = pd.read_csv(INSTRUCTORS_IN)
print("instructors shape: ", df2.shape)
result = df1.merge(df2, on=['COURSE_ID', 'TERM_CODE'])
print ("after merge: ", result.shape)
result = result.loc[result.ACADEMIC_YEAR >= MIN_YEAR]
print ("after ", MIN_YEAR, result.shape)
result = result.loc[result.ACADEMIC_YEAR <= MAX_YEAR]
print ("before", MAX_YEAR, result.shape)
result = result.loc[result.INSTRUCTOR_NAME != 'Unknown']
print ("without unknown instructors", result.shape)
result = result[FIELDS_OF_INTEREST]
print result.shape

result.to_csv(OUTFILE)
