"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _colors = _interopRequireDefault(require("../../colors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  outline: none;\n  border: 1px solid ", ";\n  background: ", ";\n  cursor: pointer;\n  border-radius: 2px;\n  transition: all 0.3s;\n  color: ", ";\n  &:hover {\n    border-color: ", ";\n    background: ", ";\n    color: ", ";\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var getThemeColors = function getThemeColors(property) {
  return function (_ref) {
    var theme = _ref.theme,
        type = _ref.type;
    var value = {};

    switch (theme) {
      case "default":
        if (type === "solid") {
          value = {
            border_hover: _colors.default.orchid,
            border: _colors.default.orchid,
            background: _colors.default.bg,
            color: _colors.default.orchid,
            background_hover: _colors.default.orchid,
            color_hover: _colors.default.bg
          };
        } else if (type === "hollow") {
          value = {
            border_hover: _colors.default.orchid,
            border: _colors.default.bg,
            background: _colors.default.bg
          };
        }

        break;

      default:
        return;
    }

    return value[property];
  };
};

var StyledButton = _styledComponents.default.button(_templateObject(), getThemeColors("border"), getThemeColors("background"), getThemeColors("color"), getThemeColors("border_hover"), getThemeColors("background_hover"), getThemeColors("color_hover"));

var Button = function Button(_ref2) {
  var children = _ref2.children,
      _ref2$theme = _ref2.theme,
      theme = _ref2$theme === void 0 ? "default" : _ref2$theme,
      _ref2$type = _ref2.type,
      type = _ref2$type === void 0 ? "solid" : _ref2$type,
      className = _ref2.className,
      style = _ref2.style,
      onClick = _ref2.onClick;
  return /*#__PURE__*/_react.default.createElement(StyledButton, {
    theme: theme,
    type: type,
    className: className,
    style: _objectSpread({}, style || {}),
    onClick: onClick
  }, children);
};

var _default = Button;
exports.default = _default;

//# sourceMappingURL=Button.js.map