<?php
require_once __DIR__ . '/includes/ProjectCommon.php';

/**
 * Retrieves the professors for the given course ID.
 * @param $courseId
 * @param $profsById    Array of course's professors keyed by course ID
 *                         (e.g. $profsById[$id][0] is the first professor)
 * @return array        All professors teaching the class
 */
function retrieveCourseProfessors($courseId, $profsById)
{
    if (isset($profsById[$courseId])) {
        return $profsById[$courseId];
    }

    return array();
}

/**
 * Retrieves the skills and areas for the given course ID from the database.
 * @param $courseId
 * @param $skillsById    Array of course skills keyed by course ID
 * @param $areasById    Array of course areas keyed by course ID
 * @return array        'skills' => array of skills (string); 'areas' => array of areas (string)
 */
function retrieveCourseSkillsAndAreas($courseId, $skillsById, $areasById)
{
    $skills = isset($skillsById[$courseId]) ? $skillsById[$courseId] : array();
    $areas = isset($areasById[$courseId]) ? $areasById[$courseId] : array();

    return array('skills' => $skills, 'areas' => $areas);
}

/**
 * Retrieves the flags for the given course ID from the database.
 * @param $courseId
 * @param $flagsById    Array of course skills keyed by course ID
 * @return array        of flags in string form
 */
function retrieveCourseFlags($courseId, $flagsById)
{
    if (isset($flagsById[$courseId])) {
        return $flagsById[$courseId];
    }

    return array();
}

/**
 * Converts tim to a string from a floating point number.
 * @param float $float
 * @param bool $forceMinutes
 * @return string
 */
function timeFromFloat($float, $forceMinutes = true)
{
    $time = (string) $float;

    $dotPosition = strpos($time, '.');
    if ($dotPosition === false && $forceMinutes === true) {
        $time .= '.00';
    }

    if ($dotPosition !== false) {
        $extraZeroes = $dotPosition - strlen($time) + 3;
        for ($i = 0; $i < $extraZeroes; $i++) {
            $time .= '0';
        }
    }

    return $time;
}

/**
 * Gets the first element's key for an array.
 * @param $array
 * @return mixed
 */
function getArrayFirstElementKey($array)
{
    reset($array);
    return key($array);
}

/**
 * Sort comparator to sort an array of times with elements
 * 'frequency', 'start_time', 'end_time'
 * @param $a
 * @param $b
 * @return int
 */
function frequencySortComparator($a, $b)
{
    $keys = array('frequency' => -1,
        'start_time' => 1,
        'end_time' => 1);

    foreach ($keys as $key => &$ascending) {
        if ($a[$key] < $b[$key]) {
            return -1 * $ascending;
        } elseif ($b[$key] < $a[$key]) {
            return 1 * $ascending;
        }
    }

    return 0;
}

/**
 * Returns a summary string for the sessions for a course. Examples include
 * "MWF 10.30-11.20", "TTh 1.00-2.15 + 1" (if there's an extra section),
 * 1 HTBA (if there's HTBA).
 * @param $sessions     Array of info arrays retrieved from the course_sessions table.
 * @return array        Array with first entry being the normal summary, second being the
 *                         long summary with all class times.
 */
function generateCourseSessionsSummary($sessions)
{
    $letterFromDay = array(
        'Monday' => 'M',
        'Tuesday' => 'T',
        'Wednesday' => 'W',
        'Thursday' => 'Th',
        'Friday' => 'F',
    );

    $timeDays = array();
    $timeFrequencies = array();
    $numHtba = 0;

    foreach ($sessions as &$session) {
        $dayOfWeek = $session['day_of_week'];

        if ($session['day_of_week'] !== 'HTBA') {
            $startTimeString = timeFromFloat($session['start_time']);
            $endTimeString = timeFromFloat($session['end_time']);
            $timeString = "{$startTimeString}-{$endTimeString}";
            if (empty($timeDays[$timeString])) {
                $timeDays[$timeString] = '';
                $timeFrequencies[$timeString]['frequency'] = 0;
                $timeFrequencies[$timeString]['start_time'] = (float) $session['start_time'];
                $timeFrequencies[$timeString]['end_time'] = (float) $session['end_time'];
                $timeFrequencies[$timeString]['location'] = $session['location'];
            }
            $timeDays[$timeString] .= $letterFromDay[$dayOfWeek];
            $timeFrequencies[$timeString]['frequency'] += 1;
        } else {
            ++$numHtba;
        }
    }

    uasort($timeFrequencies, 'frequencySortComparator');

    $summary = '';
    $longSummary = '';
    // Find the most common time and use that as the summary string
    // $longSummary contains multiple days (e.g. if there's MWF 10:30-11:20, Th 6p-9p,
    // the $summary will only have the first one,
    // $longSummary also contains location
    if (!empty($timeFrequencies)) {
        $timeStrings = array();
        $longTimeStrings = array();
        foreach ($timeFrequencies as $timeString => $session) {
            $days = $timeDays[$timeString];
            if ($days === 'MTWThF') {
                $days = 'M-F';
            }
            $timeStrings[$timeString] = "{$days} {$timeString}";
            $longTimeStrings[$timeString] = "{$days} {$timeString}";
            if (!empty($session['location'])) {
                $longTimeStrings[$timeString] .= " ({$session['location']})";
            }
        }

        $summary = reset($timeStrings);

        if (count($timeFrequencies) > 1 || $numHtba > 0) {
            $firstSessionData = reset($timeFrequencies);
            $numExtraSessions = count($sessions) - $firstSessionData['frequency'];
            $summary .= " + {$numExtraSessions}";
        }

        $longSummary = implode(', ', $longTimeStrings);
    } elseif ($numHtba > 0) {
        $summary = "{$numHtba} HTBA";
        $longSummary = $summary;
    }

    return array($summary, $longSummary);
}

/**
 * Generates a location summary string.
 * @param $locationTimes    Array of locations.
 */
function generateCourseSessionsLocationsSummary($locationTimes)
{
    if (empty($locationTimes)) {
        return '';
    }

    $summaryString = '';

    if (count($locationTimes) >= 1) {
        reset($locationTimes);
        $summaryString .= key($locationTimes);
    }

    if (count($locationTimes) > 1) {
        $extraLocationTimes = count($locationTimes) - 1;
        $summaryString .= " + {$extraLocationTimes}";
    }

    return $summaryString;
}

/**
 * There aren't
 * @param $courseId
 * @param $sessionsById
 * @return  array ['by_day'] as array(day => array(pairs of [start, end]))
 *                ['by_location'] as array(location => array(string of a session there))
 */
function retrieveCourseSessions($courseId, $sessionsById)
{
    $letterFromDay = array(
        'Monday' => 'M',
        'Tuesday' => 'T',
        'Wednesday' => 'W',
        'Thursday' => 'Th',
        'Friday' => 'F',
    );

    $timesOnDays = array(); // Keys are days, values are times; used for searching
    $timesAtLocations = array(); // Used for locations field

    $sessions = isset($sessionsById[$courseId]) ? $sessionsById[$courseId] : array();

    // Go through each session and add them to data structures
    foreach ($sessions as $session) {
        $dayOfWeek = $session['day_of_week'];
        $timesOnDays[$dayOfWeek][] = array(
            $session['start_time'],
            $session['end_time'],
            $session['location']
        );

        if (!empty($session['location'])) {
            $location = $session['location'];
            $startTimeString = timeFromFloat($session['start_time']);
            $timesAtLocations[$location][] = "{$letterFromDay[$dayOfWeek]} {$startTimeString}";
        }
    }
    // Get the short 'MWF 9:00-10:15 + 1 HTBA' or 'MWF 9:00-10:15, Th 8:00-9:15p'
    list($summary, $longSummary) = generateCourseSessionsSummary($sessions);
    $locationsSummary = generateCourseSessionsLocationsSummary($timesAtLocations);

    return array('summary' => $summary,
        'long_summary' => $longSummary,
        'locations_summary' => $locationsSummary,
        'by_day' => $timesOnDays,
        'by_location' => $timesAtLocations);
}

/**
 * Retrieves all evaluations for a certain course code.
 * @param $subject
 * @param $number
 * @param $idsByCode a mapping of $idsByCode[$subject][$number] = $evalCourseId
 * @return array of int, with each int being evaluation course ID
 */
function retrieveEvaluationCourseIdsByClass($subject, $number, $idsByCode)
{
    if (empty($subject) || empty($number)) {
        return array();
    }

    if (isset($idsByCode[$subject][$number])) {
        return array_unique($idsByCode[$subject][$number]);
    }

    return array();
}

/**
 * Retrieve evaluation course IDs taught by the same professor(s).
 * @param $professors array of string; each string is a professor
 * @param $idsByProf a mapping of $idsByProf[$professor] = $evalCourseId
 * @return array of int, each int being an evaluation course id
 */
function retrieveEvaluationCourseIdsByProfessor($professors, $idsByProf)
{
    if (empty($professors)) {
        return array();
    }

    $ids = array();
    foreach ($professors as $professor) {
        if (isset($idsByProf[$professor])) {
            $ids = array_merge($ids, (array)$idsByProf[$professor]);
        }
    }

    return array_unique($ids);
}

/**
 * Retrieves list of evaluations with the given
 * evaluation_course IDs (only gets those with ratings
 * or comments attached)
 * @param $evaluationIds array of int; array of evaluations to retrieve
 * @param $evals array of evaluations keyed by evaluation ID
 * @return array of evaluations (same format as retrieveAllEvaluations)
 */
function retrieveEvaluations($evaluationIds, $evals)
{
    if (empty($evaluationIds)) {
        return array();
    }

    $allEvaluations = array();
    foreach ($evaluationIds as $id) {
        if (!isset($evals[$id])) {
            var_dump($id);
            $keys = array_keys($evals);
            sort($keys);
            var_dump($keys);
            exit;
        }
        $eval = $evals[$id];

        if (!empty($eval['average'])) {
            $allEvaluations[] = $evals[$id];
        }
    }

    return $allEvaluations;
}

/**
 * Get the number of students the last time this course
 * was taught, as well as whether it was the same professor
 * teaching this course
 * @param $sameBothIds   array of same professor/course evaluation IDs
 * @param $sameClassIds  array of same course only evaluation IDs
 * @param $evals array of evaluations keyed by evaluation ID
 * @return {num_students: number, is_same_professor: boolean}
 */
function getNumStudents($sameBothIds, $sameClassIds, $evals)
{
    foreach ($sameBothIds as $id) {
        $eval = $evals[$id];
        if ($eval['enrollment']) {
            return [
                'num_students' => $eval['enrollment'],
                'is_same_prof' => true
            ];
        }
    }

    foreach ($sameClassIds as $id) {
        $eval = $evals[$id];
        if ($eval['enrollment']) {
            return [
                'num_students' => $eval['enrollment'],
                'is_same_prof' => false
            ];
        }
    }

    return ['num_students' => null];
}

/**
 * Prepare a retrieveAll query (used internally)
 * @param    $season
 * @param    $class
 * @param    $columns    columns to retrieve
 * @param    $orderbys    order by each column in ascending order
 * @return a SQLTable object that has just had select() run
 */
function prepareRetrieveAll($season, $class, $columns, $orderbys, $mysqli)
{
    $obj = new $class($mysqli);
    foreach ($orderbys as $col) {
        $obj->addOrderBy($col, 'ASC');
    }
    $columns[] = 'course_id';
    $obj->setColumns($columns)
        ->addCond('season', $season)
        ->addGroupBy('id')
        ->select();
    return $obj;
}

/**
 * Retrieve all records from one table for a given season
 * @param    $season
 * @param    $class        PHP class used for retrieving data
 * @param    $columns    One or more columns to get. If one column, the resultsById
 *                         is flattened (the column is the value), otherwise the info
 *                        array is the value
 * @param    $mysqli
 * @return array keyed by course ID of the column's values
 */
function retrieveAll($season, $class, $columns, $mysqli)
{
    $columns = (array)$columns;
    $obj = prepareRetrieveAll(
        $season,
        $class,
        $columns,
        $columns,
        $mysqli
    );

    $resultsById = array();
    $flatten = count($columns) === 1;

    while ($obj->nextItem()) {
        if ($flatten) {
            $resultsById[$obj->info['course_id']][] = $obj->info[$columns[0]];
        } else {
            $resultsById[$obj->info['course_id']][] = $obj->info;
        }
    }
    return $resultsById;
}

// Skills and areas has some extra processing
function retrieveAllSkills($season, $mysqli)
{
    $obj = prepareRetrieveAll(
        $season,
        'CourseSkill',
        array('skill'),
        array('skill'),
        $mysqli
    );

    $resultsById = array();
    while ($obj->nextItem()) {
        $skill = $obj->info['skill'];
        $courseId = $obj->info['course_id'];
        if (strpos($skill, 'WR') !== false) {
            $resultsById[$courseId][] = 'WR';
        } elseif (strpos($skill, 'QR') !== false) {
            $resultsById[$courseId][] = 'QR';
        } elseif (substr($skill, 0, 1) == 'L') {
            $resultsById[$courseId][] = 'L';
        }
    }
    return $resultsById;
}

function retrieveAllAreas($season, $mysqli)
{
    $obj = prepareRetrieveAll(
        $season,
        'CourseArea',
        array('area'),
        array('area'),
        $mysqli
    );

    $resultsById = array();
    while ($obj->nextItem()) {
        $area = $obj->info['area'];
        if (substr($area, 0, 2) == 'DI') {
            continue; // Ignore divinity school
        }

        $resultsById[$obj->info['course_id']][] = $area;
    }
    return $resultsById;
}


/**
 * Retrieve all evaluations
 * @return array of 3 items:
 *            - List of evaluations, keyed by ID
 *            - Evaluation IDs keyed by professor
 *            - Evaluation IDs keyed by course code (subject, number)
 */
function retrieveAllEvaluations($evaluationConn, $courseConn)
{
    // Return format:
    // [
    //     {[EvaluationCourse.id]: {oci_id, season, year, term, average, num_students}},
    //     {[professorName]: [EvaluationCourse.id, ...]},
    //     {[subject]: {[number]: [EvaluationCourse.id, ...]}}
    // ]

    // Get evaluation ratings
    $eval = new EvaluationCourse($evaluationConn);
    $eval->setColumns(array('id', 'season', 'enrollment'))
        ->select();

    $evals = array();
    while ($eval->nextItem()) {
        $id = $eval->info['id'];
        $season = $eval->info['season'];
        $term = '';
        $seasonPart = substr($season, 4, 2);
        if ($seasonPart === '01') {
            $term = 'Spring';
        } elseif ($seasonPart === '02') {
            $term = 'Summer';
        } elseif ($seasonPart === '03') {
            $term = 'Fall';
        }

        $evaluation = [
            'id' => $id,
            'season' => $season,
            'year' => (int) substr($season, 0, 4),
            'term' => $term,
            'enrollment' => $eval->info['enrollment']
        ];
        $evals[$id] = $evaluation;
    }

    $ratingTypesMap = EvaluationConstants::$ratingTypesMap;

    // Get the actual ratings
    $ecr = new EvaluationRatings($evaluationConn);
    $ecr->setColumns(array('id', 'course_id', 'question_id', 'counts'))
        ->addCond('question_id', array_keys($ratingTypesMap))
        ->select();

    while ($ecr->nextItem()) {
        $eval =& $evals[$ecr->info['course_id']];
        $type = $ratingTypesMap[$ecr->info['question_id']];
        $counts = json_decode($ecr->info['counts']);
        $totalCount = array_sum($counts);

        if ($totalCount !== 0) {
            $sum = 0;
            $countLength = count($counts);
            for ($i = 0; $i !== $countLength; $i++) {
                $sum += ($i + 1) * $counts[$i];
            }
            $average = $sum / $totalCount;

            $eval['average'][$type] = round($average, 3);
        }
    }

    // Get the list for each subject-number course code
    $courseIdsByCode = [];
    $evalCourseIdsBySeasonCrn = [];

    $ecn = new EvaluationCourseName($evaluationConn);
    $ecn->setColumns(array('course_id', 'subject', 'number', 'season', 'crn'))
        ->select();
    while ($ecn->nextItem()) {
        $courseId = $ecn->info['course_id'];
        $evals[$courseId]['names'][] = Utility::arrayPick($ecn->info, ['subject', 'number', 'season']);
        $crn = $ecn->info['crn'];
        $season = $ecn->info['season'];
        $courseIdsByCode[$ecn->info['subject']][$ecn->info['number']][] = $courseId;
        $evalCourseIdsBySeasonCrn[$season][$crn] = $courseId;
    }

    // Here, we need to map both Courses and EvaluationCourses
    // to ociId, and then we need to map
    // courseId -> crn,season -> evaluationCourseId

    $cn = new CourseName($courseConn);
    $cn->setColumns(array('course_id', 'season', 'oci_id'))
        ->select();

    $seasonCrnByCourseId = [];
    while ($cn->nextItem()) {
        $crn = $cn->info['oci_id'];
        $season = $cn->info['season'];
        $courseId = $cn->info['course_id'];
        $seasonCrnByCourseId[$courseId] = [$season, $crn];
    }

    // Get the list of all professors from normal database,
    // since they no longer are on the evaluation pages
    $cp = new CourseProfessor($courseConn);
    $cp->setColumns(array('course_id', 'professor'))
        ->select();
    $courseIdsByProf = [];
    while ($cp->nextItem()) {
        $courseId = $cp->info['course_id'];
        $professor = $cp->info['professor'];
        list($season, $crn) = $seasonCrnByCourseId[$courseId];
        $evaluationCourseId = $evalCourseIdsBySeasonCrn[$season][$crn] ?? null;
        if (!isset($evaluationCourseId)) {
            continue;
        }
        $courseIdsByProf[$professor][] = $evaluationCourseId;
    }

    return array($evals, $courseIdsByCode, $courseIdsByProf);
}

/**
 * Calculates the average rating in a group of evaluations.
 * @param $evaluations  array of evaluations generated by retrieveEvaluations
 * @param $field        string of field to average for; default 'average_rating' but
 *                      can also be 'average_difficulty' or any other key of
 *                      $evaluations
 * @returns float average rating
 */
function calculateAverage($evaluations)
{
    if (empty($evaluations)) {
        return null;
    }

    $ratingTypes = ['rating', 'workload', 'engagement',
        'organization', 'feedback', 'challenge'];
    $averages = [];

    foreach ($ratingTypes as $type) {
        $totalRating = 0.0;
        $numEvaluations = 0;
        foreach ($evaluations as $evaluation) {
            if (isset($evaluation['average']) && isset($evaluation['average'][$type])) {
                $totalRating += $evaluation['average'][$type];
                ++$numEvaluations;
            }
        }
        if ($numEvaluations !== 0) {
            $averages[$type] = round($totalRating / $numEvaluations, 2);
        }
    }

    return $averages;
}

/**
 * Retrieve evaluations grouped by whether the evaluation is for a class
 * by the same professor teaching the same class, a different professor
 * teaching the same class, or the same professor teaching a different class.
 * @param $subject string
 * @param $number
 * @param $professors array of string: professors teaching the course
 * @param $evals list of evaluation courses keyed by ID
 * @param $idsByCode evaluation IDs keyed by subject-number course codes
 * @param $idsByProf evaluation IDs keyed by professor names
 * @returns array of 'same_both' => array containing keys 'oci_id', 'season',
 *          'average_rating', 'average_difficulty', 'num_students'
 */
function retrieveGroupedEvaluations($subject, $number, $professors, $evals, $idsByCode, $idsByProf)
{
    $ociIds = array();
    $sameClassCourseIds = retrieveEvaluationCourseIdsByClass($subject, $number, $idsByCode);
    $sameProfessorsCourseIds = retrieveEvaluationCourseIdsByProfessor($professors, $idsByProf);

    $sameBothCourseIds = array_unique(array_intersect($sameClassCourseIds, $sameProfessorsCourseIds));
    $sameClassCourseIds = array_unique(array_diff($sameClassCourseIds, $sameBothCourseIds));
    $sameProfessorsCourseIds = array_unique(array_diff($sameProfessorsCourseIds, $sameBothCourseIds));

    // Sort everything in reverse so that newest is first
    rsort($sameBothCourseIds);
    rsort($sameClassCourseIds);
    rsort($sameProfessorsCourseIds);

    $sameBothEvaluations = retrieveEvaluations($sameBothCourseIds, $evals);
    $sameClassEvaluations = retrieveEvaluations($sameClassCourseIds, $evals);
    $sameProfessorsEvaluations = retrieveEvaluations($sameProfessorsCourseIds, $evals);

    $average = array(
        'same_both' => calculateAverage($sameBothEvaluations),
        'same_class' => calculateAverage(array_merge($sameClassEvaluations, $sameBothEvaluations)),
        'same_professors' => calculateAverage(array_merge($sameProfessorsEvaluations, $sameBothEvaluations))
    );

    $numStudentsData = getNumStudents($sameBothCourseIds, $sameClassCourseIds, $evals);

    $ret = [
        'num_students' => $numStudentsData['num_students'],
        'same_both' => $sameBothEvaluations,
        'same_class' => $sameClassEvaluations,
        'same_professors' => $sameProfessorsEvaluations,
        'average' => $average
    ];

    if (isset($numStudentsData['is_same_prof'])) {
        $ret['num_students_is_same_prof'] = $numStudentsData['is_same_prof'];
    }

    return $ret;
}

/**
 * Retrieves the exam for the given group ID from the database.
 * @param $season
 * @param $examGroupId
 * @param $mysqli       mysqli handle to the database with the tables
 * @return array        of flags in string form
 */
function retrieveExamTimes($season, $examGroupId, $mysqli)
{
    $examGroups = new MysqlTable($mysqli, 'exam_groups');
    $examGroups->retrieve(
        array('id', 'season'),
        array($examGroupId, $season),
        array('date', 'time')
    );
    return $examGroups->info;
}

/**
 * Generate a JSON data file given connections to a courses database
 * and an evaluations database
 * @param $courseConn
 * @param $evaluationConn
 * @param $file  name of the file to which to save the JSON
 * @param $saveToDb  whether to save the file to the database too
 */
function generateDataFile($season, $courseConn, $evaluationConn, $file, $saveToDb = false)
{
    $prevMemoryLimit = ini_get('memory_limit');
    ini_set('memory_limit', '400M');

    // Get all evaluations upfront to save DB calls
    list($allEvaluations, $evalsByCode, $evalsByProf) =
        retrieveAllEvaluations($evaluationConn, $courseConn);

    $profsById = retrieveAll($season, 'CourseProfessor', 'professor', $courseConn);
    $areasById = retrieveAllAreas($season, $courseConn);
    $skillsById = retrieveAllSkills($season, $courseConn);
    $flagsById = retrieveAll($season, 'CourseFlag', 'flag', $courseConn);
    $sessionsById = retrieveAll(
        $season,
        'CourseSession',
        array('day_of_week', 'start_time', 'end_time', 'location'),
        $courseConn
    );

    $courseNames = new Course($courseConn);
    $columnsToGet = array(
        'id',
        'course_name_id',
        'subject',
        'number',
        'section',
        'oci_id',
        'title',
        'long_title',
        'description',
        'requirements',
        'exam_group',
        'extra_info',
        'syllabus_url',
        'course_home_url'
    );

    $courseNames->setColumns($columnsToGet)
        ->addCond('subject', '', '!=')
        ->addCond('season', $season)
        ->addOrderBy('subject', 'ASC')
        ->addOrderBy('number', 'ASC')
        ->addOrderBy('section', 'ASC')
        //->setLimit(0, 200)
        ->select();

    $data = array(); // Simple array containing all courses, one per [subject, number, section]
    $indexedData = array(); // Array indexed by the ID of the course in the database
                            // including a list of all course IDs the course is under
    $ociIdData = array(); // Array indexed by the OCI ID of the course

    $row = 1;

    $courseConn->autocommit(false); // We're going to be writing a lot of data
        // Disabling autocommit speeds it up

    while ($courseNames->nextItem()) {
        $info = $courseNames->info;
        $courseId = $info['id'];
        unset($info['id']);

        $info['row'] = $row;
        ++$row;

        $info['exam_group'] = (int) $info['exam_group'];
        if ($info['exam_group'] > 1) {
            $examInfo = retrieveExamTimes($season, $info['exam_group'], $courseConn);
            $examInfo['time'] = number_format($examInfo['time'], 2);
            $info['exam_timestamp'] = DateTime::createFromFormat(
                "Y-m-d G.i",
                "{$examInfo['date']} {$examInfo['time']}"
            );
            $info['exam_timestamp'] = $info['exam_timestamp']->format('YmdHis');
        } else {
            // If exam_group is TBD (1), set timestamp to 1; if is None (0), set
            // timestamp to 0
            $info['exam_timestamp'] = $info['exam_group'];
        }

        $info['professors'] = retrieveCourseProfessors($courseId, $profsById);

        $skillsAndAreas = retrieveCourseSkillsAndAreas($courseId, $skillsById, $areasById);
        $info['skills'] = $skillsAndAreas['skills'];
        $info['areas'] = $skillsAndAreas['areas'];

        $info['flags'] = retrieveCourseFlags($courseId, $flagsById);

        $evaluations = retrieveGroupedEvaluations(
            $info['subject'],
            $info['number'],
            $info['professors'],
            $allEvaluations,
            $evalsByCode,
            $evalsByProf
        );
        $info['average'] = $evaluations['average'];
        $info['num_students'] = $evaluations['num_students'];
        if (isset($evaluations['num_students_is_same_prof'])) {
            $info['num_students_is_same_prof'] = $evaluations['num_students_is_same_prof'];
        }
        unset($evaluations['averages']);
        $info['evaluations'] = Utility::arrayPick(
            $evaluations,
            ['same_both', 'same_class', 'same_professors']
        );

        $sessions = retrieveCourseSessions($courseId, $sessionsById);
        $info['locations_summary'] = $sessions['locations_summary'];
        unset($sessions['locations_summary']);
        $info['location_times'] = $sessions['by_location'];
        unset($sessions['by_location']);
        $info['times'] = $sessions;

        // Sets the data indexed by oci ID
        $ociIdData[(int) $info['oci_id']] = $info;

        // Set the indexed data (indexed by course ID)
        if (!isset($indexedData[$courseId])) {
            $indexedData[$courseId] = $info;
        }
        $existingData =& $indexedData[$courseId];
        $rowId = count($data);
        $existingData['codes'][] = array(
            'subject' => $info['subject'],
            'number' => $info['number'],
            'section' => $info['section'],
            'row_id' => $rowId
        );
        $existingData['oci_ids'][] = $info['oci_id'];

        $info['codes'] = $existingData['codes'];
        $info['oci_ids'] = $existingData['oci_ids'];
        $info['row_id'] = $rowId;

        foreach ($existingData['codes'] as $code) {
            // Update the existing data's 'codes' array
            $existingRowId = $code['row_id'];
            if ($existingRowId != $rowId) {
                $data[$existingRowId]['codes'] = $existingData['codes'];
                $data[$existingRowId]['oci_ids'] = $existingData['oci_ids'];
            }
        }
        $data[] = $info;

        if ($saveToDb) {
            $cj = new CourseJson($courseConn);
            $cj->setInfo('id', $courseId);
            $cj->setInfo('json', json_encode($info));
            $cj->commit();
        }
    }
    $courseConn->commit();
    $courseConn->autocommit(true);

    $jsonData = json_encode($data);
    file_put_contents($file, $jsonData);

    ini_set('memory_limit', $prevMemoryLimit);
}
