import React, { Component } from 'react'
import 'react-date-range/dist/styles.css' // main style file
import 'react-date-range/dist/theme/default.css' // theme css file

import './Datepicker.sass'

import { DateRangePicker } from 'react-date-range'

class Datepicker extends Component {
  state = {
    selectionRange: {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  }

  handleSelect = ranges => {
    this.setState({ selectionRange: ranges.selection })
  }

  render() {
    const { selectionRange } = this.state
    return (
      <DateRangePicker ranges={[selectionRange]} onChange={this.handleSelect} />
    )
  }
}

export default Datepicker
