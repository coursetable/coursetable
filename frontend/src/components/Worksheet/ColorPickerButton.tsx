import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { MdEdit } from 'react-icons/md';
import debounce from 'lodash.debounce';
import { toggleBookmark } from '../../utilities/api';
import { useUser } from '../../contexts/userContext';
import { useWorksheet } from '../../contexts/worksheetContext';
import { worksheetColors } from '../../utilities/constants';
import type { Crn } from '../../utilities/common';
import styles from './ColorPickerButton.module.css';

function Picker({
  color,
  onChange,
}: {
  readonly color: string;
  readonly onChange: (newColor: string) => void;
}) {
  return (
    <div className={styles.pickerPanel}>
      <HexColorPicker color={color} onChange={onChange} />

      <div className={styles.presetColors}>
        {worksheetColors.map((presetColor) => (
          <button
            type="button"
            key={presetColor}
            className={styles.presetColor}
            style={{ background: presetColor }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onChange(presetColor);
            }}
            aria-label={`Set color to ${presetColor}`}
          />
        ))}
      </div>
    </div>
  );
}

function ColorPickerButton({
  crn,
  color,
  className,
}: {
  readonly crn: Crn;
  readonly color: string;
  readonly className?: string;
}) {
  const { userRefresh } = useUser();
  const { curSeason, worksheetNumber } = useWorksheet();
  const [open, setOpen] = useState(false);

  return (
    // TODO: accessibility
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={className}
        onClick={() => setOpen(!open)}
        aria-label="Change color"
      >
        <MdEdit color="var(--color-text-dark)" />
      </button>

      {open && (
        <Picker
          color={color}
          onChange={debounce(async (newColor: string) => {
            await toggleBookmark({
              action: 'update',
              season: curSeason,
              crn,
              worksheetNumber,
              color: newColor,
            });
            await userRefresh();
          }, 500)}
        />
      )}
    </div>
  );
}

export default ColorPickerButton;
