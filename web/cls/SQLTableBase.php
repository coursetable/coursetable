<?php
require_once __DIR__ . '/Base.php';

/**
 * Class providing interface to access a SQL table
 *
 * @author User
 * @version 2011-09-23
 *
 */

if (!class_exists('SQLTableBase')) {
    class SQLTableBase extends Base
    {
        protected $conn;
        protected $connObj;

        protected $insertId = -1;
        protected $lastQuery = '';

        /**
         * Customs columns that should not be committed.
         * @var array(string, ...)
         */
        protected $noCommitColumns = array();

        /**
         * Columns that are used in joins with other tables.
         * @var array(
         *        string (other table's name) => array(string ($tableName's column),
         *                                             string (other table's column)),
         *        string => array(string ($tableName's column), array (other table's column 1, column 2, ...)),
         *        string => array(array ($tableName's column 1, column 2, ...), string (other table's column)),
         *        string => array(array, array)
         *             ...)
         *
         * @remarks        In cases 2 and 3, the table for which a signel column is specified
         *                must match one of the other table's columns in the array
         */
        protected $joinColumns = array();

        /**
         * Aliases for joins with other tables.
         * @var array(string($publicColumnName) => array(string($table), string($sqlColumnName))
         *
         * @example        If both this table and another table has the ID column, we can alias
         *                the other table's ID using
         *                array('otherTableId' => array('othertableName', 'id'))
         * @remarks    This should not be used in commits
         */
        protected $columnAliases = array();

        /**
         * name of the table; must be set in child class.
         * @var string
         */
        protected $tableName;

        /**
         * Primary or unique keys, in array. (e.g. array('studentId'), array('firstName', 'lastName'))
         * @var keys
         */
        protected $keys = array();

        /**
         * Attaches connection object to the wrapper, or call retrieve() directly.
         */
        public function __construct()
        {
            $args = func_get_args();
            $argc = count($args);

            /**
             * Attaches MySQLi object to the wrapper.
             * @param mysqli $mysqli (optional; defaults to global $mysqli)
             */
            if ($argc == 1) {
                $this->setConnection($args[0]);
            } else {
                if (isset($GLOBALS['mysqli'])) {
                    $this->setConnection($GLOBALS['mysqli']);
                } elseif (isset($GLOBALS['sqlite'])) {
                    $this->setConnection($GLOBALS['sqlite']);
                }

                call_user_func_array(array('parent', '__construct'), $args);
            }
        }

        /**
         * Set the connection for this object to use
         */
        public function setConnection($conn)
        {
            $this->conn = $conn;

            if ($this->conn instanceof SQLite3) {
                $this->connObj = new SQLite3Connection($this->conn);
            } elseif ($this->conn instanceof PDO) {
                $this->connObj = new PDOConnection($this->conn);
            } elseif ($this->conn instanceof mysqli) {
                $this->connObj = new MysqlConnection($this->conn);
            }
        }

        /**
         * Clears the already-set info array.
         */
        public function clearInfo()
        {
            $this->info = array();
            $this->retrieved = false;
            return $this;
        }

        /**
         * Sets columns to retrieve, with additional check that keys are part of the
         * set of retrieved columns.
         * @param mixed $columns can be string '*' as well as array of columns
         * @remarks     Note that if '*' is used, no joins are performed
         */
        public function setColumns($columns)
        {
            parent::setColumns($columns);

            if (is_array($this->selectColumns)) {
                $this->selectColumns = array_unique(array_merge($this->selectColumns, $this->keys));
            }

            return $this;
        }

        /**
         * Prefix the table name to the column specified, and do alias translation
         *
         * @param   string  $column            name of the column
         * @param   boolean $aliasColumns      Whether to add 'AS realcolumnname' for join tables
         * @param   array   $tablesUsed        An array to be populated with tables mentioned
         * @param   boolean $includeTableName  Whether to include the table name (Table.`Column`)
         *                                     or not (`Column`)
         * @returns (string) canonical name of the column in Table.`Column` form
         */
        protected function canonicalizeColumn(
            $column,
            $aliasColumns = false,
            &$tablesUsed = null,
            $includeTableName = true
        ) {
            // First, map onto alias if needed
            $asString = '';
            if (isset($this->columnAliases[$column])) {
                if ($aliasColumns) {
                    $asString = ' AS ' . $this->connObj->escapeIdent($column);
                }
                list($table, $column) = $this->columnAliases[$column];
            } else {
                $table = $this->tableName;
            }

            if (isset($tablesUsed)) {
                if (!in_array($table, $tablesUsed)) {
                    $tablesUsed[] = $table;
                }
            }

            if ($includeTableName) {
                return $this->connObj->escapeIdent($table) . '.' . $this->connObj->escapeIdent($column) . $asString;
            } else {
                return $this->connObj->escapeIdent($column) . $asString;
            }
        }

        /**
         * Add conditions corresponding to each of the keys in the table.
         * Should always be implemented with a more readable name in a child class
         * (e.g. addCourseCond($subject, $number, $section))
         * @params    array    $args    values for each of the keys
         * @returns $this
         */
        protected function addKeyCond()
        {
            $args = func_get_args();

            $keyCount = count($this->keys);
            $argCount = count($args);

            for ($i = 0; $i < $keyCount && $i < $argCount; $i++) {
                $this->addCond($this->keys[i], $args[$i]);
            }

            return $this;
        }

        /**
         * Perform canonicalization on each element of an array of column names
         *
         * @param array   $columns           columns to translate
         * @param boolean $aliasColumns      Whether to add 'AS realcolumnnmae' for join tables
         * @param array   $tablesUsed        An array to be populated with tables mentioned
         * @param boolean $includeTableName  Whether to include the table name
         *                                   (Table.`Column`) or not (`Column`)
         * @returns array canonical names of the the columns
         */
        protected function canonicalizeColumns(
            $columns,
            $aliasColumns = false,
            &$tablesUsed = null,
            $includeTableName = true
        ) {
            $canonical = array();

            foreach ($columns as $column) {
                $canonical[] = $this->canonicalizeColumn($column, $aliasColumns, $tablesUsed, $includeTableName);
            }

            return $canonical;
        }

        /**
         * Construct a WHERE string to allow joins with other tables
         *
         * @param     array    $tables        List of tables to join with.
         * @returns    WHERE string like "Table1.`Column` = Table2.`Column` AND ..."
         */
        private function constructJoinString($tables)
        {
            $joinStrings = array();
            foreach ($tables as $table) {
                // Don't join with current table
                if ($table == $this->tableName) {
                    continue;
                }

                $thisTableJoinColumns = (array)$this->joinColumns[$table][0];
                $otherTableJoinColumns = (array)$this->joinColumns[$table][1];

                foreach ($thisTableJoinColumns as $key => $columns) {
                    $otherColumns = $otherTableJoinColumns[$key];

                    $columnStrings = array();
                    if (count($columns) == 1) {
                        // One-to-many relationship or one-to-one relationship
                        foreach ((array)$otherColumns as $otherColumn) {
                            $columnStrings[] = $this->tableName . '.' . $this->connObj->escapeIdent($columns) .
                                ' = ' . $table . '.' . $this->connObj->escapeIdent($otherColumn);
                        }
                    } elseif (count($otherColumns) == 1) {
                        // Many-to-one relationship
                        foreach ((array)$columns as $column) {
                            $columnStrings[] = $this->tableName . '.' . $this->connObj->escapeIdent($column) .
                                ' = ' . $table . '.' . $this->connObj->escapeIdent($otherColumns);
                        }
                    }

                    $joinStrings[] = '(' . implode(' OR ', $columnStrings) . ')';
                }
            }

            return $joinStrings;
        }

        // Note: the following all are in static/instance pairs; the static version
        // can be used for generic SQL manipulation, while the instance version relies
        // on $this->conds, $this->limit, etc.

        /**
         * Constructs the WHERE clause string for the SELECT query.
         *
         * @param   array   $tablesUsed     Filled out by the function, tables the cond-string mentions
         * @param    array    $conds    an array in the form of $this->conds (see its documentation)
         * @returns    string to place after "WHERE" to form a SQL query
         */
        private function constructCondStringStatic(&$tablesUsed, $conds)
        {
            $groupStrings = array();
            $andGroupStrings = array();

            foreach ($conds as $group => $conditions) {
                foreach ($conditions as &$condition) {
                    $column = $this->canonicalizeColumn($condition[COND_COLUMN], false, $tablesUsed);
                    $before = $after = '';
                    if ($condition[COND_OPERATOR] == 'LIKE') {
                        $before = '%';
                        $after = '%';
                    } elseif ($condition[COND_OPERATOR] == 'STARTSWITH') {
                        $condition[COND_OPERATOR] = 'LIKE';
                        $after = '%';
                    }

                    $condition =  $column . ' ' . $condition[COND_OPERATOR] . " '" .
                        $before . $this->connObj->escapeString($condition[1]) . $after . "'";
                }

                if ($group === 0) {
                    $groupStrings[$group] = implode(' AND ', $conditions);
                } elseif (is_string($group) && substr($group, 0, 3) === 'AND') {
                    // 'AND1', 'AND2' are a special type of groups
                    $andGroupStrings[$group] = '(' . implode(' AND ', $conditions) . ')';
                } else {
                    $groupStrings[$group] = '(' . implode(' OR ', $conditions) . ')';
                }
            }

            if (!empty($andGroupStrings)) {
                $groupStrings[] = '(' . implode(' OR ', $andGroupStrings) . ')';
            }

            $groupStrings = array_merge($groupStrings, $this->constructJoinString($tablesUsed));

            return implode(' AND ', $groupStrings);
        }

        private function constructCondString(&$tablesUsed)
        {
            return $this->constructCondStringStatic($tablesUsed, $this->conds);
        }

        /**
         * Constructs the LIMIT clause string for the SELECT query.
         */
        private static function constructLimitStringStatic($limit)
        {
            $string = $limit['start'];
            if ($limit['limit'] !== false) {
                $string .= ", {$limit['limit']}";
            }
            return $string;
        }

        private function constructLimitString()
        {
            return static::constructLimitStringStatic($this->limit);
        }

        /**
         * Constructs the ORDER BY clause string for the SELECT query.
         */
        private function constructOrderByStringStatic(&$tablesUsed, $orderBy)
        {

            $orderByStrings = array();
            foreach ($orderBy as &$clause) {
                list($column, $ascDesc) = $clause;
                $canonical = $this->canonicalizeColumn($column, false, $tablesUsed);
                $orderByStrings[] = "{$canonical} {$ascDesc}";
            }

            return implode(', ', $orderByStrings);
        }

        private function constructOrderByString(&$tablesUsed)
        {
            return $this->constructOrderByStringStatic($tablesUsed, $this->orderBy);
        }

        /**
         * Constructs the GROUP BY clause string for the SELECT query.
         */
        private function constructGroupByStringStatic(&$tablesUsed, $groupBy)
        {
            return implode(', ', $this->canonicalizeColumns($groupBy, false, $tablesUsed));
        }

        private function constructGroupByString(&$tablesUsed)
        {
            return $this->constructGroupByStringStatic($tablesUsed, $this->groupBy);
        }

        /**
         * Constructs the part after SELECT for the SELECT query.
         */
        private function constructSelectColumnsStringStatic(&$tablesUsed, $selectColumns)
        {
            if ($selectColumns === '*') {
                $tablesUsed[] = $this->tableName;
                return '*';
            }
            return implode(', ', $this->canonicalizeColumns((array)$selectColumns, true, $tablesUsed));
        }

        private function constructSelectColumnsString(&$tablesUsed)
        {
            return $this->constructSelectColumnsStringStatic($tablesUsed, $this->selectColumns);
        }

        /**
         * Constructs the part after UPDATE for the UPDATE ... SET or ON DUPLICATE KEY UPDATE query.
         * @param    bool    $allTables    whether to include aliased columns
         */
        protected function constructUpdateStringStatic(&$tablesUsed, $info, $allTables = false)
        {
            $updateString = '';

            foreach ($info as $column => $value) {
                if (!in_array($column, $this->noCommitColumns) && ($allTables ||
                    !isset($this->columnAliases[$column]))) {
                    $updateString .= $this->canonicalizeColumn($column, false, $tablesUsed, $allTables) .
                        " = '" . $this->connObj->escapeString($value) . "', ";
                }
            }

            // Remove the comma and space at the end
            return substr($updateString, 0, -2);
        }

        protected function constructUpdateString(&$tablesUsed, $allTables = false)
        {
            return $this->constructUpdateStringStatic($tablesUsed, $this->info, $allTables);
        }

        public function constructSelectQuery($options)
        {
            if (empty($this->selectColumns)) {
                $this->setError(-1, 'constructSelectQuery() requires columns to retrieve to be specified');
                return false;
            }

            $condString = '';
            $limitString = '';
            $orderByString = '';
            $groupByString = '';
            $suffix = '';
            $tablesUsed = array();

            $selectColumnsString = $this->constructSelectColumnsString($tablesUsed);
            if (!empty($this->limit)) {
                $limitString = ' LIMIT ' . $this->constructLimitString();
            }
            if (!empty($this->orderBy)) {
                $orderByString = ' ORDER BY ' . $this->constructOrderByString($tablesUsed);
            }
            if (!empty($this->groupBy)) {
                $groupByString = ' GROUP BY ' . $this->constructGroupByString($tablesUsed);
            }
            $condString = $this->constructCondString($tablesUsed);
            if (!empty($condString)) {
                $condString = ' WHERE ' . $condString;
            }

            if ($options && $options['forUpdate']) {
                $suffix = ' FOR UPDATE';
            }

            return "SELECT {$selectColumnsString} FROM " .
                implode(', ', $tablesUsed) .
                "{$condString}{$groupByString}{$orderByString}{$limitString}{$suffix}";
        }

        /**
         * Select the data from the database based on the conditions, order by, etc. given
         * @return true if query succeeded.
         */
        public function select($options = null)
        {
            $query = $this->constructSelectQuery($options);
            //global $argv, $netId; if (isset($argv) || $netId == 'zpx2') var_dump($query);

            if ($query === false) {
                return false;
            }
            $this->result = $this->query($query);
            return ($this->result !== false ? $this : false);
        }

        protected function query($query)
        {
            $success = $this->conn->query($query);
            if ($success === false) {
                $this->setError($this->connObj->getErrorCode(), $this->connObj->getErrorMessage());
            }
            $this->lastQuery = $query;
            return $success;
        }

        public function nextItem()
        {
            if (!is_object($this->result)) {
                echo "<!-- Query: {$this->lastQuery} -->\n";
                // This will result in a fatal error on the next call, so just print it
            }

            $info = $this->connObj->fetchResult($this->result);
            if (empty($info)) {
                $this->info = array();
                $this->hasResults = false;
                return false;
            }

            $this->hasResults = true;
            $this->info = $info;
            return true;
        }

        /**
         * Make a SQL query string like 'DELETE FROM table WHERE ... LIMIT ...'
         *
         * @param    array    $conds    an array in the form of base::$conds
         * @param    array    $limit    a record similar to base::$limit
         */
        private function constructDeleteQuery($conds = null, $limit = null)
        {
            $conds = isset($conds) ? $conds : $this->conds;
            $limit = isset($limit) ? $limit : $this->limit;

            if (empty($conds)) {
                $this->setError(-1, 'constructDeleteQuery() requires conditions');
                return false;
            }

            $condString = '';
            $limitString = '';
            $tablesUsed = array();
            if (!empty($conds)) {
                $condString = ' WHERE ' . $this->constructCondStringStatic($tablesUsed, $conds);
            }

            // SQL delete only has LIMIT x rather than LIMIT y,x
            if (!empty($limit)) {
                if ($limit['start'] != 0) {
                    $this->setError(-1, 'constructDeleteQuery() can only take 0-index limit starts');
                    return false;
                }
                $limitString = ' LIMIT ' . $limit['limit'];
            }

            return "DELETE FROM " . $this->tableName . "{$condString}{$limitString}";
        }

        public function delete()
        {
            $query = $this->constructDeleteQuery();
            if ($query === false) {
                return false;
            }

            $this->result = $this->query($query);
            return ($this->result !== false);
        }

        /**
         * Make a conds array that would only select the current item based on its
         * primary/unique keys.
         * @return    array        conds array similar to those made by addCond
         */
        public function constructKeyConds()
        {
            $conds = array();
            // Make a similar $conds array based out of $this->info
            foreach ($this->keys as $column) {
                if (!isset($this->info[$column])) {
                    echo "{$column} not set\n";
                    return false;
                }

                $conds[0][] = array($column, $this->info[$column], '=');
            }
            return $conds;
        }

        /**
         * Make a WHERE ... string that would only select the current item based on its
         * primary/unique keys.
         * @return    string        string to be appended to "WHERE "
         */
        public function constructKeyCondString()
        {
            $tablesUsedBlackHole = array();
            return $this->constructCondStringStatic($tablesUsedBlackHole, $this->constructKeyConds());
        }

        /**
         * Delete the current item based on the information in $this->info
         */
        public function deleteItem()
        {
            $conds = $this->constructKeyConds();
            $query = $this->constructDeleteQuery($conds, array('start' => 0, 'limit' => 1));

            if ($query === false) {
                return false;
            }

            $result = $this->query($query);
            if ($result !== false) {
                unset($this->info);
                return true;
            }

            return false;
        }

        /**
         * Constructs the query string for the commit.
         */
        public function constructCommitQuery()
        {
            $allKeysSet = count(array_diff($this->keys, array_keys($this->info))) === 0;
            // If all keys set, default to update; otherwise, default to insert

            $columnsString = '';
            $valuesString = '';
            $updateString = '';

            $tablesUsed = array(); // Not needed; only support for one table right now

            foreach ($this->info as $column => $value) {
                if (!in_array($column, $this->noCommitColumns) &&
                    !isset($this->columnAliases[$column])) {
                    $value = $this->connObj->escapeString($value);
                    $canonical = $this->canonicalizeColumn($column, false, $tablesUsed, false);
                    $columnsString .= "{$canonical}, ";
                    $valuesString .= "'{$value}', ";
                }
            }

            $tablesUsed = array();
            $columnsString = substr($columnsString, 0, -2);
            $valuesString = substr($valuesString, 0, -2);
            $updateString = $this->constructUpdateString($tablesUsed);

            // Update or insert with one query!
            if ($this->connObj->canUseOnDuplicateKeyUpdate()) {
                return "INSERT INTO " . $this->tableName .
                    " ({$columnsString}) VALUES ({$valuesString}) " .
                    "ON DUPLICATE KEY UPDATE {$updateString}";
            }

            $insertQuery = "INSERT INTO " . $this->tableName . " ({$columnsString}) VALUES ({$valuesString})";
            if ($allKeysSet && !empty($this->keys)) {
                // Check if we have an existing row in the database
                $tablesUsedBlackHole = array(); // Waste variable

                $whereString = $this->constructKeyCondString();

                $columnsString = $this->constructSelectColumnsStringStatic($tablesUsedBlackHole, $this->keys);
                $selectQuery = "SELECT {$columnsString} FROM {$this->tableName} WHERE {$whereString}";
                $result = $this->query($selectQuery);

                if ($result !== false && $this->connObj->fetchResult($result) !== false) {
                    return "UPDATE {$this->tableName} SET {$updateString} WHERE {$whereString}";
                } else {
                    return $insertQuery;
                }
            } else {
                return $insertQuery;
            }
        }

        /**
         * Commits the changed/new info-array as a row to the database.
         */
        public function commit()
        {
            if (empty($this->info)) {
                return true;
            }
            //global $argv, $netId; if (isset($argv) || $netId == 'zpx2') var_dump($this->constructCommitQuery());
            $success = $this->query($this->constructCommitQuery());

            if ($success) {
                $this->retrieved = true;
                // Use updates from now on

                if (count($this->keys) === 1) {
                    // One ID column
                    $idColumn = $this->keys[0];

                    if (empty($this->info[$idColumn])) {
                        // We're doing an insert
                        $this->insertId = $this->connObj->getInsertId();

                        if ($this->insertId != 0) {
                            // Insert was successful
                            $this->info[$idColumn] = $this->insertId;
                        }
                    }
                }
            }
            return $success;
        }

        /**
         * Constructs the SQL query for an UPDATE command
         * @returns    query string for UPDATEs
         */
        public function constructUpdateQuery()
        {
            $tablesUsed = array();
            $updateString = $this->constructUpdateString($tablesUsed, true);
            $condString = $this->constructCondString($tablesUsed);

            return 'UPDATE ' . implode(', ', $tablesUsed) . ' SET ' . $updateString . ' WHERE ' . $condString;
        }

        /**
         * Commits the info-array's data to all rows matching added conditions.
         */
        public function update()
        {
            if (empty($this->info)) {
                return true;
            }

            $success = $this->query($this->constructUpdateQuery());
            $this->numRows = $this->conn->affected_rows;

            return $success;
        }

        /*
       * Standard base class functions.
       */
        public function __get($name)
        {
            if ($name === 'insertId') {
                return $this->insertId;
            }
            if ($name === 'lastQuery') {
                return $this->lastQuery;
            }
            if ($name === 'numRows') {
                return $this->numRows;
            }

            return parent::__get($name);
        }

        /**
         * Get all retrieved rows and store them in an array.
         * If the key of the table is an ID, uses the ID as the array key
         * unless otherwise specified.
         *
         * @param    string    $keyColumn    column to use as the key of the results array
         * @returns        rows retrieved by select() call
         */
        public function getResults($keyColumn = false)
        {
            $results = array();

            if (count($this->keys) == 1 && !$keyColumn) {
                $keyColumn = $this->keys[0];
            }

            while ($this->nextItem()) {
                if ($keyColumn) {
                    $results[$this->info[$keyColumn]] = $this->info;
                } else {
                    $results[] = $this->info;
                }
            }

            return $results;
        }

        /**
         * When only one column is being returned in the results, flatten it into
         * a 1-D array of only values from that column.
         *
         * @param    array    $results    Results as returned by getResults()
         * @param    string    $column        Column to use as the data column
         */
        public static function flattenResults($results, $column)
        {
            $newResults = array();
            foreach ($results as $result) {
                $newResults[] = $result[$column];
            }

            return $newResults;
        }
    }
}
