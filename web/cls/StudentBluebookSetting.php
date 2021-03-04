<?php
class StudentBluebookSetting extends SQLTableBase
{
    protected $tableName = 'StudentBluebookSettings';
    protected $keys = array('netId');

    public static function findOrCreate($mysqli, $netId, $columns = ['evaluationsEnabled', 'betaEnabled'])
    {
        $sbs = new StudentBluebookSetting($mysqli);
        $sbs->retrieve('netId', $netId, $columns);

        if (empty($sbs->info)) {
            $sbs = new StudentBluebookSetting($mysqli);
            $sbs->setInfoArray([
                'netId' => $netId,
                'shareCoursesEnabled' => 0,
                'facebookLastUpdated' => 0,
                'seenDisclaimer' => 0,
                'noticeLastSeen' => 0,
                'timesNoticeSeen' => 0,
                'viewException' => 0,
                'challengeTries' => 0,
                'evaluationsEnabled' => 0,
                'betaEnabled' => 0
            ]);
            $sbs->commit();
        }
        return $sbs;
    }
}
