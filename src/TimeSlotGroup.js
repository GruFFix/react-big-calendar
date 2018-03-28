import PropTypes from 'prop-types'
import React, { Component } from 'react'
import TimeSlot from './TimeSlot'
import date from './utils/dates.js'
import localizer from './localizer'
import findIndex from 'lodash/findIndex'
import { elementType, dateFormat } from './utils/propTypes'
import cn from 'classnames'

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
    weekCloseDays: PropTypes.array,
    view: PropTypes.string,
    handleAddEvent: PropTypes.func,
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
      view,
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
        view={view}
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
      <div
        className={btnClassNAme}
        ref={node => {
          this.refSlotItem = node
        }}
        onClick={this.handleAddEvent}
      >
        <div className="add-btn-text">+</div>
      </div>
    )
  }

  handleAddEvent = () => {
    const { handleAddEvent, value } = this.props
    const params = {
      refSlot: this.refSlotItem,
      slotDate: value,
    }

    handleAddEvent(params)
  }

  render() {
    const { value, weekCloseDays, view, className } = this.props

    const isClose = findIndex(weekCloseDays, closeDate => {
      if (
        Date.parse(closeDate) === Date.parse(value) ||
        (new Date(value).getDay() === 0 && view !== 'work_week')
      ) {
        return true
      }
    })

    const isShowAddBtn = isClose === -1 && view !== 'work_week'

    return (
      <div
        className={cn(
          className,
          'rbc-timeslot-group',
          isClose !== -1 && 'close',
          view === 'work_week' && 'small'
        )}
        ref={e => (this.test = e)}
      >
        {this.renderSlices()}

        {isShowAddBtn && this.renderAddEventButton()}
      </div>
    )
  }
}
