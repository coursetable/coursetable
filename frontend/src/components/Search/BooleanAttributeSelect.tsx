import { OverlayTrigger, Popover } from 'react-bootstrap';
import { MdInfoOutline } from 'react-icons/md';
import { RxCheck, RxCross2 } from 'react-icons/rx';
import { components } from 'react-select';

import CustomSelect from './CustomSelect';
import {
  booleanAttributes,
  useSearch,
  type Option,
  type BooleanAttributes,
} from '../../contexts/searchContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomControl(props: any) {
  const {
    filters: { includeAttributes, excludeAttributes },
  } = useSearch();
  const include = includeAttributes.value.map(
    (x) => `a ${booleanAttributes[x].toLowerCase()}`,
  );
  const includeText =
    include.length > 1
      ? `either ${include.join(' OR ')}`
      : include.length === 1
        ? include[0]!
        : '';
  const exclude = excludeAttributes.value.map(
    (x) => `not a ${booleanAttributes[x].toLowerCase()}`,
  );
  const excludeText =
    exclude.length > 1
      ? exclude.join(' AND ')
      : exclude.length === 1
        ? exclude[0]!
        : '';
  return (
    <div className="d-flex">
      <components.Control {...props} className="flex-grow-1" />
      <OverlayTrigger
        trigger={['hover', 'focus']}
        overlay={(props) => (
          <Popover {...props}>
            <Popover.Body>
              <p>
                {includeText || excludeText
                  ? `Included courses must be ${includeText}${includeText && excludeText ? ' AND ' : ''}${excludeText}.`
                  : 'Included courses can be any type.'}
              </p>
              <p>
                If more complex filtering logic is desired, consider using
                Quist.
              </p>
            </Popover.Body>
          </Popover>
        )}
      >
        <span className="p-2">
          <MdInfoOutline />
        </span>
      </OverlayTrigger>
    </div>
  );
}

function Noop() {
  return <span className="px-1" />;
}

export default function BooleanAttributeSelect(props: {
  readonly 'aria-labelledby': string;
  readonly className?: string;
}) {
  const {
    filters: { includeAttributes, excludeAttributes },
  } = useSearch();
  const allOptions = Object.entries(booleanAttributes).map(
    ([attr, label]) =>
      // @ts-expect-error: TODO: label can be an element
      ({
        value: attr,
        label: (
          <>
            {includeAttributes.value.includes(attr as BooleanAttributes) ? (
              <RxCheck />
            ) : excludeAttributes.value.includes(attr as BooleanAttributes) ? (
              <RxCross2 />
            ) : (
              ''
            )}{' '}
            {label}
          </>
        ),
      }) as Option,
  );
  return (
    <CustomSelect
      {...props}
      isMulti
      isOptionSelected={(option) =>
        includeAttributes.value.includes(option.value as BooleanAttributes) ||
        excludeAttributes.value.includes(option.value as BooleanAttributes)
      }
      value={allOptions.filter(
        (option) =>
          includeAttributes.value.includes(option.value as BooleanAttributes) ||
          excludeAttributes.value.includes(option.value as BooleanAttributes),
      )}
      colors={{
        ...Object.fromEntries(
          allOptions.map((option) => [option.value, 'gray']),
        ),
        ...Object.fromEntries(
          includeAttributes.value.map((attr) => [attr, 'green']),
        ),
        ...Object.fromEntries(
          excludeAttributes.value.map((attr) => [attr, 'red']),
        ),
      }}
      options={allOptions}
      placeholder="Select an attribute"
      components={{
        Control: CustomControl,
        MultiValueRemove: Noop,
      }}
      onChange={(values) => {
        // This seems to be the only way to get the option that was clicked
        const newVal = new Set(values.map((x) => x.value as BooleanAttributes));
        const oldVal = new Set([
          ...includeAttributes.value,
          ...excludeAttributes.value,
        ]);
        const attr =
          [...newVal].filter((x) => !oldVal.has(x))[0] ??
          [...oldVal].filter((x) => !newVal.has(x))[0];
        // Shouldn't happen
        if (!attr) return;
        // // None -> Include -> Exclude -> None
        if (includeAttributes.value.includes(attr)) {
          includeAttributes.set(
            includeAttributes.value.filter((x) => x !== attr),
          );
          excludeAttributes.set([...excludeAttributes.value, attr]);
        } else if (excludeAttributes.value.includes(attr)) {
          excludeAttributes.set(
            excludeAttributes.value.filter((x) => x !== attr),
          );
        } else {
          includeAttributes.set([...includeAttributes.value, attr]);
        }
      }}
      hideSelectedOptions={false}
      closeMenuOnSelect={false}
    />
  );
}
