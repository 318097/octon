"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  font-size: 30px;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  font-weight: bold;\n  text-transform: uppercase;\n  color: lightgrey;\n  text-align: center;\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Container = _styledComponents.default.div(_templateObject());

var PageNotFound = function PageNotFound() {
  return _react.default.createElement("section", null, _react.default.createElement(Container, null, "404: Page Not Found"));
};

var _default = PageNotFound;
exports.default = _default;

//# sourceMappingURL=PageNotFound.js.map