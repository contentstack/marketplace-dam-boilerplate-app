/* eslint-disable */
import React from "react";
import { Icon, Select, Tooltip } from "@contentstack/venus-components";
import { isEmpty } from "lodash";
import "./PairSelector.scss";

interface Option {
  label: string;
  value: any;
}

interface Mapping {
  [key: string]: any;
}

interface PairSelectorProps {
  mappings: Mapping[];
  leftOptions: Option[];
  rightOptions: Option[];
  middleOptions?: Option[];

  onLeftSelect: (data: any, index: number) => void;
  onRightSelect: (data: any, index: number) => void;
  onDelete: (index: number) => void;
  onMiddleSelect?: (data: any, index: number) => void;

  config?: {
    leftPlaceholder?: string;
    middlePlaceholder?: string;
    rightPlaceholder?: string;
    noOptionsMessage?: string;
    deleteTooltip?: string;
    separator?: string;
    containerClass?: string;
    selectWidth?: string;
    separatorClass?: string;
    iconClass?: string;
    showTooltip?: boolean;
    showDeleteIcon?: boolean;
    isRightDisabled?: boolean;
    isSearchable?: boolean;
    multiDisplayLimit?: number;
    isMultiLeft?: boolean;
    isMultiMiddle?: boolean;
    isLeftExhaustive?: boolean;
    isMiddleExhaustive?: boolean;
    isRightExhaustive?: boolean;
    maxCharacters?: number;
  };
}

const PairSelector: React.FC<PairSelectorProps> = ({
  mappings,
  leftOptions,
  middleOptions = [],
  rightOptions,
  onLeftSelect,
  onRightSelect,
  onMiddleSelect,
  onDelete,
  config = {},
}) => {
  const {
    leftPlaceholder = "Select left option",
    middlePlaceholder = "Select middle option",
    rightPlaceholder = "Select right option",
    noOptionsMessage = "No options available",
    deleteTooltip = "Delete mapping",
    separator = "→",
    containerClass = "pair-container",
    selectWidth = "270px",
    separatorClass = "separator",
    iconClass = "delete-icon",
    showTooltip = true,
    showDeleteIcon = true,
    isRightDisabled = false,
    isSearchable = true,
    multiDisplayLimit = 5,
    isMultiLeft = false,
    isMultiMiddle = false,
    isLeftExhaustive = true,
    isMiddleExhaustive = true,
    isRightExhaustive = true,
    maxCharacters = 15,
  } = config;


  const customSelectStyles = {
    menuPortal: (base: any) => ({ ...base, zIndex: 99999 }),
    singleValue: (base: any) => ({
      ...base,
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }),
    multiValue: (base: any) => ({
      ...base,
      maxWidth: '100%',
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      maxWidth: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }),
    option: (base: any) => ({
      ...base,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }),
  };

  const getTooltipClass = (leftVal: any, middleVal: any, rightVal: any) => {
    if (
      isEmpty(leftVal) ||
      (isMultiMiddle && isEmpty(middleVal)) ||
      isEmpty(rightVal)
    ) {
      return "tippy-wrapper-disabled";
    }
    return "";
  };

  const selectedLeftValues: any[] = [];
  const selectedMiddleValues: any[] = [];
  const selectedRightValues: any[] = [];

  mappings?.forEach((mapping) => {
    const leftValue =
      mapping?.left ??
      mapping?.branch_uid ??
      mapping?.leftValue ??
      mapping?.branch_uid_multi;
    const middleValue = mapping?.middle ?? mapping?.locales_uid;
    const rightValue =
      mapping?.right ?? mapping?.config_label ?? mapping?.rightValue;

    if (isMultiLeft) {
      if (Array.isArray(leftValue)) selectedLeftValues?.push(...leftValue);
    } else {
      if (leftValue) selectedLeftValues?.push(leftValue);
    }

    if (isMultiMiddle) {
      if (Array.isArray(middleValue)) selectedMiddleValues?.push(...middleValue);
    } else if (middleValue) {
      selectedMiddleValues?.push(middleValue);
    }

    if (rightValue) selectedRightValues?.push(rightValue);
  });

  if (!mappings || mappings?.length === 0) {
    return (
      <div className="pair-selector-empty">
        <div className="empty-title">No mappings configured</div>
        <div className="empty-description">
          Add some mappings to get started
        </div>
      </div>
    );
  }


  const renderRow = (mapping: Mapping, index: number) => {
    const leftValueRaw = mapping?.left ?? mapping?.branch_uid ?? null;
    const middleValueRaw = mapping?.middle ?? mapping?.locales_uid ?? null;
    const rightValueRaw = mapping?.right ?? mapping?.config_label ?? null;

    const leftSelectValue = isMultiLeft
      ? leftOptions.filter(
        (opt) =>
          Array.isArray(leftValueRaw) && leftValueRaw?.includes(opt.value)
      )
      : leftOptions?.find((opt) => opt.value === leftValueRaw) ?? null;

    const middleSelectValue = isMultiMiddle
      ? middleOptions?.filter(
        (opt) =>
          Array.isArray(middleValueRaw) && middleValueRaw?.includes(opt.value)
      )
      : middleOptions?.find((opt) => opt.value === middleValueRaw) ?? null;

    const rightSelectValue =
      rightOptions?.find((opt) => opt.value === rightValueRaw) ?? null;

    let disabledLocales: any[] = [];
    if (leftValueRaw) {
      // Normalize possible array of branches
      const branches = Array.isArray(leftValueRaw)
        ? leftValueRaw
        : [leftValueRaw];
      branches?.forEach((branch) => {
        mappings?.forEach((otherMapping, otherIndex) => {
          if (otherIndex !== index) {
            const otherBranches = otherMapping?.left ?? otherMapping?.branch_uid;
            if (
              (typeof otherBranches === "string" && otherBranches === branch) ||
              (Array.isArray(otherBranches) && otherBranches?.includes(branch))
            ) {
              const otherLocales =
                otherMapping?.middle ?? otherMapping?.locales_uid;
              if (Array.isArray(otherLocales))
                disabledLocales?.push(...otherLocales);
              else if (otherLocales) disabledLocales?.push(otherLocales);
            }
          }
        });
      });
    }

    // Remove current row's selected values so they're not disabled 
    if (isMultiMiddle && Array.isArray(middleValueRaw)) {
      disabledLocales = disabledLocales?.filter(
        (v) => !middleValueRaw?.includes(v)
      );
    } else if (middleValueRaw) {
      disabledLocales = disabledLocales?.filter((v) => v !== middleValueRaw);
    }
    const disabledLocalesSet = new Set(disabledLocales);

    // Filter middle options by removing those disabled
    const filteredMiddleOptions = middleOptions?.filter(
      (opt) => !disabledLocalesSet?.has(opt.value)
    );

    const filteredLeftOptions = isLeftExhaustive
      ? leftOptions.filter(
        (opt) =>
          !selectedLeftValues?.includes(opt.value) ||
          (isMultiLeft &&
            Array.isArray(leftValueRaw) &&
            leftValueRaw?.includes(opt.value)) ||
          (!isMultiLeft && opt?.value === leftValueRaw)
      )
      : leftOptions;

    const filteredRightOptions = isRightExhaustive
      ? rightOptions?.filter(
        (opt) =>
          !selectedRightValues?.includes(opt?.value) ||
          opt?.value === rightValueRaw
      )
      : rightOptions;

    return (
      <div key={`pair-${index}`} className={containerClass}>
        <div className="select-wrapper" style={{ width: selectWidth }}>
          <Select
            value={leftSelectValue}
            onChange={(option: any) => onLeftSelect(option, index)}
            options={filteredLeftOptions}
            placeholder={leftPlaceholder}
            isSearchable={isSearchable}
            menuShouldScrollIntoView={false}
            multiDisplayLimit={multiDisplayLimit}
            width={selectWidth}
            isMulti={isMultiLeft}
            noOptionsMessage={() => noOptionsMessage}
            menuPortalTarget={document.body}
            styles={customSelectStyles}
          />
        </div>

        {middleOptions && middleOptions?.length > 0 && onMiddleSelect && (
          <>
            <span className={separatorClass}>{separator}</span>
            <div className="select-wrapper" style={{ width: selectWidth }}>
              <Select
                value={middleSelectValue}
                onChange={(option: any) => onMiddleSelect!(option, index)}
                options={filteredMiddleOptions}
                placeholder={middlePlaceholder}
                isSearchable={isSearchable}
                menuShouldScrollIntoView={false}
                multiDisplayLimit={multiDisplayLimit}
                width={selectWidth}
                isMulti={isMultiMiddle}
                noOptionsMessage={() => noOptionsMessage}
                menuPortalTarget={document.body}
                styles={customSelectStyles}
              />
            </div>
          </>
        )}

        <span className={separatorClass}>{separator}</span>

        <div className="select-wrapper" style={{ width: selectWidth }}>
          <Select
            value={rightSelectValue}
            onChange={(option: any) => onRightSelect(option, index)}
            options={filteredRightOptions}
            placeholder={rightPlaceholder}
            width={selectWidth}
            isSearchable={isSearchable}
            isDisabled={isRightDisabled}
            menuShouldScrollIntoView={false}
            multiDisplayLimit={multiDisplayLimit}
            noOptionsMessage={() => noOptionsMessage}
            menuPortalTarget={document.body}
            styles={customSelectStyles}
          />
        </div>

        {showDeleteIcon && (
          <div
            className={getTooltipClass(
              leftSelectValue,
              middleSelectValue,
              rightSelectValue
            )}
          >
            {showTooltip ? (
              <Tooltip content={deleteTooltip} position="top" showArrow={false}>
                <Icon
                  icon="Trash"
                  size="mini"
                  className={iconClass}
                  onClick={() => onDelete(index)}
                  hover
                  hoverType="secondary"
                  shadow="medium"
                />
              </Tooltip>
            ) : (
              <Icon
                icon="Trash"
                size="mini"
                className={iconClass}
                onClick={() => onDelete(index)}
                hover
                hoverType="secondary"
                shadow="medium"
              />
            )}
          </div>
        )}
      </div>
    );
  };

  return <>{mappings.map(renderRow)}</>;
};

export default PairSelector;
