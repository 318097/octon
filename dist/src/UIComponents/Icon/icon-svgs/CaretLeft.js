"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CaretLeft = function CaretLeft(props) {
  return /*#__PURE__*/_react.default.createElement("svg", {
    height: props.height,
    width: props.width,
    "aria-hidden": "true",
    focusable: "false",
    "data-prefix": "fas",
    "data-icon": "caret-left",
    className: "svg-inline--fa fa-caret-left fa-w-6",
    role: "img",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 192 512"
  }, /*#__PURE__*/_react.default.createElement("path", {
    fill: "currentColor",
    d: "M192 127.338v257.324c0 17.818-21.543 26.741-34.142 14.142L29.196 270.142c-7.81-7.81-7.81-20.474 0-28.284l128.662-128.662c12.599-12.6 34.142-3.676 34.142 14.142z"
  }));
};

CaretLeft.defaultProps = {
  height: 16,
  width: 16
};
var _default = CaretLeft;
exports.default = _default;

//# sourceMappingURL=CaretLeft.js.map