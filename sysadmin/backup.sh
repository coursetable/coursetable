#!/bin/sh
mysqldump yale_advanced_oci \
  barnes_noble_sections \
  course_areas \
  course_flags \
  course_json \
  course_names \
  course_professors \
  course_sessions \
  course_skills \
  courses \
  evaluation_comments \
  evaluation_course_names \
  evaluation_courses \
  evaluation_questions \
  evaluation_ratings \
  exam_groups \
  key_value_store \
  oci_seasons \
  textbook_amazon_cache \
  textbook_asin \
  textbook_courses \
  textbook_prices \
  textbooks \
  worksheet_courses > yale_advanced_oci.sql

mysqldump yaleplus \
  StudentBluebookSettings \
  StudentCoursesTaken \
  StudentFacebookFriends \
  StudentPetitions \
  Students > yaleplus1.sql

mysqldump --no-data yaleplus \
  BluebookEvents > yaleplus2.sql

tar -czf backups.tar.gz yale_advanced_oci.sql yaleplus1.sql yaleplus2.sql
