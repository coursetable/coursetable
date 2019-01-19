<?php
/**
 * Abstract class providing interface to access a MySQL table
 *
 * @author User
 * @version 2011-09-23
 *
 */

define('COND_COLUMN', 0);
define('COND_VALUE', 1);
define('COND_OPERATOR', 2);

if (!class_exists('Base')) {
    abstract class Base
    {
        /**
     * Variables that are read-only.
     * @var array
     */
        private $readOnlyVars = array('error', 'errno', 'info', 'hasResults');
        protected $error = '';
        protected $errno = 0;

        protected $info = array();
        protected $conds = array();
        protected $limit = array();
        protected $orderBy = array();
        protected $groupBy = array();
        protected $selectColumns = array();
        protected $result = false;
        protected $hasResults = false;

        /**
     * Attaches MySQLi object to the wrapper, or call retrieve() directly.
     * @param mysqli $mysqli
     */
        public function __construct()
        {
            $args = func_get_args();
            $argc = count($args);

            if ($argc != 0) {
                /**
             * Construct and retrieve at the same time
             * @see retrieve(...)
             */
                call_user_func_array(array($this, 'retrieve'), $args);
            }
        }

        /**
     * Clears the already-set info array.
     */
        public function clearInfo()
        {
            $this->info = array();
            return $this;
        }


    /**
     * Adds a conditional to the SELECT parameters;
     * All subgroups above 0 are elements of the 0th (top) subgroup and are
     * combined with ORs, while all elements in each subgroup are combined
     * with ANDs.
     * Subgroups can also be in the format of "AND1", "AND2", in which case
     * the conditions within each subgroup will be "AND'd", but the overall result
     * will be "OR'd"
     * @param string $column
     * @param string $value
     * @param int    $subgroup optional; defaults to 0 (top group); must be > 0 if called from outside
     *                         (e.g., 1 for an OR group, "AND1" for an AND group)
     * @param string $operator optional; defaults to '='
     *
     * @example addCond(array('netId1', 'netId2'), 'blah') matches blah to either
     *          the netId1 or netId2 columns, while
     * @example addCond('netId', array('abc', 'def')) matches abc or def to the
     *          netId column
     */
        public function addCond($column, $value, $operator = '=', $subgroup = 0)
        {
            // For arrays of columns and values
            if (is_array($column) || is_array($value)) {
                switch ($operator) {
                    case '!=':
                        $subgroup = 0;
                        break;

                    default:
                        if (count($this->conds) == 0) {
                            $subgroup = 1;
                        } else {
                            $subgroup = max(array_keys($this->conds)) + 1;
                        }
                        break;
                }
                foreach ((array) $column as $col) {
                    foreach ((array) $value as $val) {
                        $this->addCond($col, $val, $operator, $subgroup);
                    }
                }
            } else {
                // For regular additions
                $this->conds[$subgroup][] = array($column, $value, $operator);
            }

            return $this;
        }

        /**
     * Sets limit for SELECT query.
     * @param int $start
     * @param int $limit optional; defaults to false (none)
     */
        public function setLimit($start, $limit = false)
        {
            $this->limit['start'] = $start;
            $this->limit['limit'] = $limit;
            return $this;
        }

        /**
     * Adds an ORDER BY clause for the SELECT query.
     * @param string $column
     * @param string $direction optional; defaults to 'ASC'; can be 'ASC' or 'DESC'
     */
        public function addOrderBy($column, $direction = 'ASC')
        {
            $this->orderBy[] = array($column, $direction);
            return $this;
        }

        /**
     * Adds a GROUP BY clase for the SELECT query.
     * @param string $column
     */
        public function addGroupBy($column)
        {
            $this->groupBy[] = $column;
            return $this;
        }

        /**
     * Sets columns to retrieve.
     * @param mixed $columns can be string '*' as well as array of columns
     */
        public function setColumns($columns)
        {
            if ($columns != '*') {
                $columns = (array) $columns;
            }

            $this->selectColumns = $columns;
            return $this;
        }

        /**
     * Clears the select conditions and results.
     */
        public function clearSelect()
        {
            $this->conds = array();
            $this->limit = array();
            $this->orderBy = array();
            $this->groupBy = array();
            $this->selectColumns = array();
            $this->result = null;
            $this->hasResults = false;

            return $this;
        }

        /**
     * Select the data from the database based on the conditions, order by, etc. given
     * @return true if query succeeded.
     */
        abstract public function select();

        private $lowestCondGroupUsed = 0;

        private function addCondsForRetrieve($condColumns, $condValues)
        {
            // Single column, single value
            if (!is_array($condColumns) && !is_array($condValues)) {
                $this->addCond($condColumns, $condValues);

            // Single column, OR'd value
            } elseif (!is_array($condColumns) && is_array($condValues)) {
                --$this->lowestCondGroupUsed;
                foreach ($condValues as &$value) {
                    if (is_array($value)) {
                        $this->setError(10004, 'retrieve() cannot have more than ' .
                            '1 level of nested arrays in $condValues');
                    }
                    $this->addCond($condColumns, $value, '=', $this->lowestCondGroupUsed);
                }

            // Multiple columns; recursive call
            } elseif (is_array($condColumns) && is_array($condValues)) {
                if (count($condColumns) !== count($condValues)) {
                    $this->setError(10002, 'retrieve() with an array as $condColumn ' .
                        'requires an equal-sized array as $condValues');
                    return false;
                }

                $column = reset($condColumns);
                $value = reset($condValues);

                while ($column !== false) {
                    if (is_array($column)) {
                        $this->setError(10003, 'retrieve() cannot have nested arrays in the $condColumns argument');
                        return false;
                    }
                    $this->addCondsForRetrieve($column, $value);

                    $column = next($condColumns);
                    $value = next($condValues);
                }

            // Multiple columns, single value? Or neither. Weird.
            } else {
                $this->setError(10002, 'retrieve() with an array as $condColumn requires ' .
                    'an equal-sized array as $condValues');
                return false;
            }

            return true;
        }

        abstract public function nextItem();

        /**
     * Retrieves rows fitting arguments; this is a shorthand to calling addCond(),
     * setLimit(), and setColumns()
     * @param mixed $condColumns       Either a string, or an array of columns.
     * @param mixed $condValues        Either a string, or an array of values. Should correspond to $condColumns
     * @param array $columnsToRetrieve
     * @param int   $limit
     */
        public function retrieve($condColumns, $condValues, $columnsToRetrieve = null, $limit = 1)
        {
            if (!isset($columnsToRetrieve)) {
                $columnsToRetrieve = $this->keys;
            }

            $this->clearSelect();
            $this->lowestCondGroupUsed = 0;

            $this->addCondsForRetrieve($condColumns, $condValues);
            $this->setColumns($columnsToRetrieve);
            $this->setLimit(0, $limit);
            $this->select();

            return $this->nextItem();
        }


        /**
     * Given an array of column => value pairs, set the info, without removing
     * already-set info.
     * @param array $infoArray
     */
        public function setInfoArray($infoArray)
        {
            $this->info = array_merge($this->info, $infoArray);
            return $this;
        }

        /**
     * Sets the info for given column.
     * @param string $column
     * @param string $value
     */
        public function setInfo($column, $value)
        {
            $this->info[$column] = $value;
            return $this;
        }

        /*
         * Standard base class functions.
         */
        public function __get($name)
        {
            if (in_array($name, (array) $this->readOnlyVars)) {
                return $this->$name;
            }
            return null;
        }

        /**
     * Get all retrieved rows and store them in an array.
     * @param    string $keyColumn column to use as the key of the results array
     * @returns        rows retrieved
     */
        abstract public function getResults($keyColumn = null);

        /**
     * When only one column is being returned in the results, flatten it into
     * a 1-D array of only values from that column.
     *
     * @param    array  $results Results as returned by getResults()
     * @param    string $column  Column to use as the data column
     */
        public static function flattenResults($results, $column)
        {
            $newResults = array();
            foreach ($results as $key => $result) {
                $newResults[$key] = $result[$column];
            }

            return $newResults;
        }

        /**
     * Sets internal error variables.
     * @param int    $errno
     * @param string $error
     */
        protected function setError($errno, $error)
        {
            $this->errno = $errno;
            $this->error = $error;
        }
    }
}
