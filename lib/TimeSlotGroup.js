'use strict'

exports.__esModule = true

var _propTypes = require('prop-types')

var _propTypes2 = _interopRequireDefault(_propTypes)

var _react = require('react')

var _react2 = _interopRequireDefault(_react)

var _TimeSlot = require('./TimeSlot')

var _TimeSlot2 = _interopRequireDefault(_TimeSlot)

var _dates = require('./utils/dates.js')

var _dates2 = _interopRequireDefault(_dates)

var _localizer = require('./localizer')

var _localizer2 = _interopRequireDefault(_localizer)

var _propTypes3 = require('./utils/propTypes')

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    )
  }
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass
    )
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  })
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass)
}

var TimeSlotGroup = (function(_Component) {
  _inherits(TimeSlotGroup, _Component)

  function TimeSlotGroup() {
    _classCallCheck(this, TimeSlotGroup)

    return _possibleConstructorReturn(this, _Component.apply(this, arguments))
  }

  TimeSlotGroup.prototype.renderSlice = function renderSlice(
    slotNumber,
    content,
    value
  ) {
    var _props = this.props,
      dayWrapperComponent = _props.dayWrapperComponent,
      showLabels = _props.showLabels,
      isNow = _props.isNow,
      culture = _props.culture,
      resource = _props.resource,
      slotPropGetter = _props.slotPropGetter,
      events = _props.events

    return _react2.default.createElement(_TimeSlot2.default, {
      key: slotNumber,
      slotPropGetter: slotPropGetter,
      dayWrapperComponent: dayWrapperComponent,
      showLabel: showLabels && !slotNumber,
      content: content,
      culture: culture,
      isNow: isNow,
      resource: resource,
      value: value,
      events: events,
    })
  }

  TimeSlotGroup.prototype.renderSlices = function renderSlices() {
    var ret = []
    var sliceLength = this.props.step
    var sliceValue = this.props.value
    for (var i = 0; i < this.props.timeslots; i++) {
      var content = _localizer2.default.format(
        sliceValue,
        this.props.timeGutterFormat,
        this.props.culture
      )
      ret.push(this.renderSlice(i, content, sliceValue))
      sliceValue = _dates2.default.add(sliceValue, sliceLength, 'minutes')
    }
    return ret
  }

  TimeSlotGroup.prototype.renderAddEventButton = function renderAddEventButton() {
    var _this2 = this

    var _props2 = this.props,
      columnEvents = _props2.columnEvents,
      timeslots = _props2.timeslots

    var btnClassNAme = 'add-event-btn'

    if (columnEvents && columnEvents.length) {
      columnEvents.forEach(function(event) {
        var eventStartTimeHour = new Date(event.start).getHours()
        var slotTimeHour = new Date(_this2.props.value).getHours()
        var eventEndTimeHour = new Date(event.end).getHours()
        var endSlotTimeHour = slotTimeHour + timeslots

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

    return _react2.default.createElement(
      'div',
      { className: btnClassNAme },
      _react2.default.createElement('div', { className: 'add-btn-text' }, '+')
    )
  }

  TimeSlotGroup.prototype.render = function render() {
    return _react2.default.createElement(
      'div',
      { className: 'rbc-timeslot-group' },
      this.renderSlices(),
      this.renderAddEventButton()
    )
  }

  return TimeSlotGroup
})(_react.Component)

TimeSlotGroup.propTypes = {
  dayWrapperComponent: _propTypes3.elementType,
  timeslots: _propTypes2.default.number.isRequired,
  step: _propTypes2.default.number.isRequired,
  value: _propTypes2.default.instanceOf(Date).isRequired,
  showLabels: _propTypes2.default.bool,
  isNow: _propTypes2.default.bool,
  slotPropGetter: _propTypes2.default.func,
  timeGutterFormat: _propTypes3.dateFormat,
  culture: _propTypes2.default.string,
  resource: _propTypes2.default.string,
  events: _propTypes2.default.array,
  columnEvents: _propTypes2.default.array,
}
TimeSlotGroup.defaultProps = {
  timeslots: 2,
  step: 30,
  isNow: false,
  showLabels: true,
}
exports.default = TimeSlotGroup
module.exports = exports['default']
