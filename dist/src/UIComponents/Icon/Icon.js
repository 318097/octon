"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _colors = _interopRequireDefault(require("../../colors"));

var _iconSvgs = require("./icon-svgs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  line-height: 1;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  vertical-align: middle;\n  border-radius: 50%;\n  margin: 2px;\n  height: 20px;\n  width: 20px;\n  background: ", ";\n  transition: all 0.4s;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  svg {\n    font-family: initial;\n    fill: ", ";\n    -webkit-font-smoothing: antialiased;\n    text-rendering: optimizeLegibility;\n  }\n  /* &:hover {\n    background: ", ";\n  } */\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var StyledIcon = _styledComponents.default.span(_templateObject(), function (_ref) {
  var background = _ref.background;
  return background ? _colors.default.grey : "none";
}, function (_ref2) {
  var color = _ref2.color;
  return color;
}, _colors.default.shade2);

var SVGIcon = function SVGIcon(_ref3) {
  var type = _ref3.type,
      props = _objectWithoutProperties(_ref3, ["type"]);

  switch (type) {
    case "plus":
      return /*#__PURE__*/_react.default.createElement(_iconSvgs.Plus, props);

    case "google":
      return /*#__PURE__*/_react.default.createElement(_iconSvgs.Google, props);

    case "logout":
      return /*#__PURE__*/_react.default.createElement(_iconSvgs.Logout, props);

    case "login":
      return /*#__PURE__*/_react.default.createElement(_iconSvgs.Login, props);

    case "minus":
      return /*#__PURE__*/_react.default.createElement(_iconSvgs.Minus, props);

    case "edit":
      return /*#__PURE__*/_react.default.createElement(_iconSvgs.Edit, props);

    case "delete":
      return /*#__PURE__*/_react.default.createElement(_iconSvgs.Delete, props);

    case "check":
      return /*#__PURE__*/_react.default.createElement(_iconSvgs.Check, props);

    case "drop":
      return /*#__PURE__*/_react.default.createElement(_iconSvgs.Drop, props);

    case "caret-left":
      return /*#__PURE__*/_react.default.createElement(_iconSvgs.CaretLeft, props);

    case "wallet":
      return /*#__PURE__*/_react.default.createElement(_iconSvgs.Wallet, props);

    default:
      return /*#__PURE__*/_react.default.createElement(_iconSvgs.Minus, props);
  }
};

var Icon = function Icon(_ref4) {
  var className = _ref4.className,
      onClick = _ref4.onClick,
      _ref4$background = _ref4.background,
      background = _ref4$background === void 0 ? false : _ref4$background,
      type = _ref4.type,
      _ref4$size = _ref4.size,
      size = _ref4$size === void 0 ? 16 : _ref4$size,
      _ref4$color = _ref4.color,
      color = _ref4$color === void 0 ? "black" : _ref4$color;
  return /*#__PURE__*/_react.default.createElement(StyledIcon, {
    className: className,
    background: background,
    size: size,
    onClick: onClick,
    color: color
  }, /*#__PURE__*/_react.default.createElement(SVGIcon, {
    type: type,
    height: background ? size - 4 : size,
    width: background ? size - 4 : size
  }));
};

var _default = Icon;
exports.default = _default;

//# sourceMappingURL=Icon.js.map