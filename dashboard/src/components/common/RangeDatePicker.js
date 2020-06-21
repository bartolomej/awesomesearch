import React from "react";
import classNames from "classnames";
import {
  DatePicker,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "shards-react";

import "../../assets/range-date-picker.css";


function RangeDatePicker ({ className, startDate, endDate, onStartDateChange, onEndDateChange }) {
  const classes = classNames(className, "d-flex", "my-auto", "date-range");

  return (
    <InputGroup className={classes}>
      <DatePicker
        size="sm"
        selected={startDate}
        onChange={onStartDateChange}
        placeholderText="Start Date"
        dropdownMode="select"
        className="text-center"
      />
      <DatePicker
        size="sm"
        selected={endDate}
        onChange={onEndDateChange}
        placeholderText="End Date"
        dropdownMode="select"
        className="text-center"
      />
      <InputGroupAddon type="append">
        <InputGroupText>
          <i className="material-icons">&#xE916;</i>
        </InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  );
}

export default RangeDatePicker;
