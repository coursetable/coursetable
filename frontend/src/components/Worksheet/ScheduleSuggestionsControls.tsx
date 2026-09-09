import { useId } from 'react';
import { Form } from 'react-bootstrap';

import type {
  CourseOption,
  ParsedCreditsInput,
  RequirementTag,
} from './scheduleSuggestionsUtils';
import type { Crn } from '../../queries/graphql-types';
import CustomSelect from '../Search/CustomSelect';
import SkillBadge from '../SkillBadge';
import styles from './ScheduleSuggestionsControls.module.css';

type WorksheetSelectionRow = {
  readonly crn: Crn;
  readonly label: string;
};

type ScheduleSuggestionsControlsProps = {
  readonly restrictWorksheetSubset: boolean;
  readonly onRestrictWorksheetSubsetChange: (checked: boolean) => void;
  readonly worksheetSelectionRows: readonly WorksheetSelectionRow[];
  readonly selectedWorksheetCrns: ReadonlySet<Crn>;
  readonly onToggleWorksheetCrn: (crn: Crn, checked: boolean) => void;
  readonly targetCoursesInput: string;
  readonly targetCreditsInput: string;
  readonly parsedTargetCredits: ParsedCreditsInput;
  readonly allAvailableTags: readonly RequirementTag[];
  readonly requiredTags: readonly string[];
  readonly exclusionOptions: readonly CourseOption[];
  readonly selectedExclusionOptions: readonly CourseOption[];
  readonly menuPortalTarget: HTMLElement | undefined;
  readonly onTargetCoursesInputChange: (value: string) => void;
  readonly onTargetCoursesBlur: () => void;
  readonly onTargetCreditsInputChange: (value: string) => void;
  readonly onTargetCreditsBlur: () => void;
  readonly onToggleTag: (tagCode: string) => void;
  readonly onExcludedCourseCodesChange: (values: string[]) => void;
};

export default function ScheduleSuggestionsControls({
  restrictWorksheetSubset,
  onRestrictWorksheetSubsetChange,
  worksheetSelectionRows,
  selectedWorksheetCrns,
  onToggleWorksheetCrn,
  targetCoursesInput,
  targetCreditsInput,
  parsedTargetCredits,
  allAvailableTags,
  requiredTags,
  exclusionOptions,
  selectedExclusionOptions,
  menuPortalTarget,
  onTargetCoursesInputChange,
  onTargetCoursesBlur,
  onTargetCreditsInputChange,
  onTargetCreditsBlur,
  onToggleTag,
  onExcludedCourseCodesChange,
}: ScheduleSuggestionsControlsProps) {
  const exclusionsLabelId = useId();
  const worksheetSubsetLegendId = useId();
  const canPickWorksheetSubset = worksheetSelectionRows.length > 0;

  return (
    <div className={styles.controlsColumn}>
      <div className={styles.controlRow}>
        <div className={styles.controlLabel} id={worksheetSubsetLegendId}>
          Worksheet
        </div>
        <div className={styles.controlInput}>
          <Form.Check
            type="checkbox"
            id="schedule-restrict-worksheet-subset"
            checked={restrictWorksheetSubset}
            disabled={!canPickWorksheetSubset}
            onChange={(event) =>
              onRestrictWorksheetSubsetChange(event.target.checked)
            }
            label="Only include certain courses"
            className={styles.subsetToggle}
          />
          {restrictWorksheetSubset && canPickWorksheetSubset && (
            <fieldset
              className={styles.worksheetPickList}
              aria-labelledby={worksheetSubsetLegendId}
            >
              {worksheetSelectionRows.map((row) => (
                <Form.Check
                  key={row.crn}
                  type="checkbox"
                  id={`schedule-ws-${row.crn}`}
                  checked={selectedWorksheetCrns.has(row.crn)}
                  onChange={(event) =>
                    onToggleWorksheetCrn(row.crn, event.target.checked)
                  }
                  label={row.label}
                  className={styles.worksheetPickOption}
                />
              ))}
            </fieldset>
          )}
        </div>
      </div>

      <div className={styles.controlRow}>
        <div className={styles.controlLabel}>Targets</div>
        <div className={styles.controlInput}>
          <div className={styles.targetRow}>
            <Form.Group
              className={styles.targetField}
              controlId="schedule-target-courses"
            >
              <Form.Label className={styles.targetLabel}>
                # of courses
              </Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={targetCoursesInput}
                className={styles.numberInput}
                onChange={(event) =>
                  onTargetCoursesInputChange(event.target.value)
                }
                onBlur={onTargetCoursesBlur}
              />
            </Form.Group>

            <Form.Group
              className={styles.targetField}
              controlId="schedule-target-credits"
            >
              <Form.Label className={styles.targetLabel}>
                Ideal credits
              </Form.Label>
              <Form.Control
                type="number"
                min={0}
                step={0.5}
                placeholder="Optional"
                value={targetCreditsInput}
                isInvalid={!parsedTargetCredits.isValid}
                className={styles.numberInput}
                onChange={(event) =>
                  onTargetCreditsInputChange(event.target.value)
                }
                onBlur={onTargetCreditsBlur}
              />
              <Form.Control.Feedback type="invalid">
                Credits must be a non-negative number.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
        </div>
      </div>

      <div className={styles.controlRow}>
        <div className={styles.controlLabel}>Selected requirements</div>
        <div className={styles.controlInput}>
          <div className={styles.requirementsList}>
            {allAvailableTags.map((tag) => (
              <Form.Check
                key={tag.code}
                type="checkbox"
                id={`schedule-required-${tag.code}`}
                checked={requiredTags.includes(tag.code)}
                onChange={() => onToggleTag(tag.code)}
                label={
                  <SkillBadge skill={tag.code} className={styles.tagBadge} />
                }
                className={styles.requirementOption}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.controlRow}>
        <div className={styles.controlLabel} id={exclusionsLabelId}>
          Exclusions
        </div>
        <div className={styles.controlInput}>
          <CustomSelect<CourseOption, true>
            aria-labelledby={exclusionsLabelId}
            isMulti
            options={exclusionOptions}
            value={selectedExclusionOptions}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            menuPortalTarget={menuPortalTarget}
            onChange={(selected) => {
              onExcludedCourseCodesChange(
                selected.map((option) => option.value),
              );
            }}
            placeholder="Exclude specific course codes"
            className={styles.exclusionSelect}
          />
        </div>
      </div>
    </div>
  );
}
