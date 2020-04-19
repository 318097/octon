"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _colors = _interopRequireDefault(require("../../colors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  background: ", ";\n  height: inherit;\n  width: inherit;\n  border-radius: 10px;\n  border: 1px solid ", ";\n  box-shadow: 3px 3px 3px ", ";\n  transition: 1s;\n  position: relative;\n  overflow: hidden;\n  &:after {\n    content: \"\";\n    position: absolute;\n    bottom: 0px;\n    left: 0;\n    width: 100%;\n    height: 5px;\n    background: ", ";\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Wrapper = _styledComponents.default.div(_templateObject(), _colors.default.white, _colors.default.bg, _colors.default.bg, _colors.default.strokeTwo);

var Card = function Card(props) {
  return /*#__PURE__*/_react.default.createElement(Wrapper, {
    className: "card"
  }, props.children);
};

var _default = Card;
exports.default = _default;

//# sourceMappingURL=Card.js.map