#!/bin/sh

#
# This script helps export a version of all tables with somewhat fudged
# data for development purposes
#

OUTPUT_FILE="$1"
FIRST_SEASON="$2"

if [ -z "$OUTPUT_FILE" ] || [ -z "$FIRST_SEASON" ]; then
  echo 'Usage: bash exportDBForDevelopment.sh outputFile.sql 201701'
  echo '       bash exportDBForDevelopment.sh (output) (first season to get data)'
  echo ''

  echo 'Exports a version of production tables with somewhat fudged data for'
  echo 'development purposes'

  exit
fi

# Export structure only for all tables in yaleplus (since they have student data)
mysqldump -d --databases yaleplus yale_advanced_oci > "$OUTPUT_FILE"

echo 'USE yale_advanced_oci;' >> "$OUTPUT_FILE"

# Data tables for most tables in yale_advanced_oci
mysqldump yale_advanced_oci \
  barnes_noble_sections \
  exam_groups \
  evaluation_questions \
  key_value_store \
  oci_seasons \
  textbooks \
  textbook_amazon_cache \
  textbook_asin \
  textbook_courses \
  textbook_prices >> "$OUTPUT_FILE"

# Dump a subset of certain course tables
mysqldump --lock-all-tables --where="(SELECT season FROM course_names cn WHERE cn.course_id = courses.id LIMIT 1) >= $FIRST_SEASON" yale_advanced_oci courses >> "$OUTPUT_FILE"
mysqldump --lock-all-tables --where="season >= $FIRST_SEASON" yale_advanced_oci course_names >> "$OUTPUT_FILE"

TABLES="course_areas course_flags course_professors course_sessions course_skills"
for table in $TABLES; do
  mysqldump --lock-all-tables --where="(SELECT season FROM course_names cn WHERE cn.course_id = $table.course_id LIMIT 1) >= $FIRST_SEASON" yale_advanced_oci "$table" >> "$OUTPUT_FILE"
done

# Dump a subset of certain evaluation tables
# SELECT * FROM evaluation_courses WHERE (SELECT season FROM course_names cn WHERE cn.course_id = courses.id LIMIT 1) >= 201803
mysqldump --lock-all-tables --where="season >= $FIRST_SEASON" yale_advanced_oci evaluation_courses >> "$OUTPUT_FILE"
mysqldump --lock-all-tables --where="season >= $FIRST_SEASON" yale_advanced_oci evaluation_course_names >> "$OUTPUT_FILE"

EVALUATION_TABLES="evaluation_ratings"
for table in $EVALUATION_TABLES; do
  mysqldump --lock-all-tables --where="(SELECT season FROM evaluation_course_names cn WHERE cn.course_id = $table.course_id LIMIT 1) >= $FIRST_SEASON" yale_advanced_oci "$table" >> "$OUTPUT_FILE"
done

mysqldump --lock-all-tables --where="id % 5 = 1 AND (SELECT season FROM evaluation_courses ec WHERE ec.id = evaluation_comments.course_id) >= $FIRST_SEASON" yale_advanced_oci evaluation_comments >> "$OUTPUT_FILE"

# Dump only structure for student-tied and generated tables
mysqldump -d yale_advanced_oci course_json worksheet_courses >> "$OUTPUT_FILE"
