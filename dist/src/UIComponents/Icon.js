"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  padding: 4px;\n  background: #e4e4e4;\n  transition: 0.8s;\n  margin: 2px;\n  border-radius: 50%;\n  &:hover {\n    background: lightgrey;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var StyledIcon = (0, _styledComponents.default)(_antd.Icon)(_templateObject());

var Icon = function Icon(_ref) {
  var className = _ref.className,
      onClick = _ref.onClick,
      type = _ref.type;
  return _react.default.createElement(StyledIcon, {
    className: className,
    onClick: onClick,
    type: type
  });
};

var _default = Icon;
exports.default = _default;

//# sourceMappingURL=Icon.js.map