import mysql from 'mysql';
import { MYSQL_STUDENTS_CONFIG, MYSQL_COURSES_CONFIG } from '../config';

export const studentsDatabase = mysql.createPool(MYSQL_STUDENTS_CONFIG);
export const coursesDatabase = mysql.createPool(MYSQL_COURSES_CONFIG);
