import PropTypes from 'prop-types'
import React, { Component } from 'react'
import TimeSlot from './TimeSlot'
import date from './utils/dates.js'
import localizer from './localizer'
import { elementType, dateFormat } from './utils/propTypes'

export default class TimeSlotGroup extends Component {
  static propTypes = {
    dayWrapperComponent: elementType,
    timeslots: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    value: PropTypes.instanceOf(Date).isRequired,
    showLabels: PropTypes.bool,
    isNow: PropTypes.bool,
    slotPropGetter: PropTypes.func,
    timeGutterFormat: dateFormat,
    culture: PropTypes.string,
    resource: PropTypes.string,
    events: PropTypes.array,
    columnEvents: PropTypes.array,
  }
  static defaultProps = {
    timeslots: 2,
    step: 30,
    isNow: false,
    showLabels: true,
  }

  renderSlice(slotNumber, content, value) {
    const {
      dayWrapperComponent,
      showLabels,
      isNow,
      culture,
      resource,
      slotPropGetter,
      events,
    } = this.props

    return (
      <TimeSlot
        key={slotNumber}
        slotPropGetter={slotPropGetter}
        dayWrapperComponent={dayWrapperComponent}
        showLabel={showLabels && !slotNumber}
        content={content}
        culture={culture}
        isNow={isNow}
        resource={resource}
        value={value}
        events={events}
      />
    )
  }

  renderSlices() {
    const ret = []
    const sliceLength = this.props.step
    let sliceValue = this.props.value
    for (let i = 0; i < this.props.timeslots; i++) {
      const content = localizer.format(
        sliceValue,
        this.props.timeGutterFormat,
        this.props.culture
      )
      ret.push(this.renderSlice(i, content, sliceValue))
      sliceValue = date.add(sliceValue, sliceLength, 'minutes')
    }
    return ret
  }

  renderAddEventButton() {
    const { columnEvents, timeslots } = this.props
    let btnClassNAme = 'add-event-btn'

    if (columnEvents && columnEvents.length) {
      columnEvents.forEach(event => {
        const eventStartTimeHour = new Date(event.start).getHours()
        const slotTimeHour = new Date(this.props.value).getHours()
        const eventEndTimeHour = new Date(event.end).getHours()
        const endSlotTimeHour = slotTimeHour + timeslots

        if (
          eventEndTimeHour === endSlotTimeHour ||
          (eventStartTimeHour >= slotTimeHour &&
            eventStartTimeHour < endSlotTimeHour) ||
          (eventEndTimeHour > slotTimeHour &&
            eventEndTimeHour < endSlotTimeHour)
        ) {
          btnClassNAme = 'add-event-btn small'
        }
      })
    }

    return (
      <div className={btnClassNAme}>
        <div className="add-btn-text">+</div>
      </div>
    )
  }

  render() {
    return (
      <div className="rbc-timeslot-group">
        {this.renderSlices()}
        {this.renderAddEventButton()}
      </div>
    )
  }
}
