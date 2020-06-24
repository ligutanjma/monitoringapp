import React, { useRef } from 'react';
import {Col} from 'react-bootstrap'
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';

export class DateRangeFilter extends React.Component {
  constructor(props) {
      super(props);
      this.isFiltered = this.isFiltered.bind(this);
  }

filter(event) {
  console.log('filtering')
  if (!this.refs.fromDate.value && !this.refs.toDate.value) {
    this.props.filterHandler();
  } else {
    this.props.filterHandler( this.isFiltered);
  }
}

isFiltered(targetValue) {
  console.log('hyuray')
  const targetDate = new Date(targetValue)
  const toDate = new Date(this.refs.toDate.value);
  const fromDate = new Date(this.refs.fromDate.value);
  if ( fromDate && !this.refs.toDate.value) {
    return targetDate >= fromDate;
  }

  if (!this.refs.fromDate.value && toDate) {
    return targetDate <= toDate;
  }
  
  if (fromDate && toDate) {
    return targetDate >= fromDate && targetDate <= toDate;
  }
}
  



  render() {
    return (
      <div>
        From :{" "}<input ref="fromDate" type="date" className="filter" onChange={this.filter.bind(this)}/> {" "}
        To: {" "}<input ref="toDate" type="date" className="filter" onChange={this.filter.bind(this)} />
        </div>
    );
  }
};