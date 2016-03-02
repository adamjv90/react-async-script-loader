'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var loadedScript = [];
var failedScript = [];

var scriptLoader = function scriptLoader() {
  for (var _len = arguments.length, scripts = Array(_len), _key = 0; _key < _len; _key++) {
    scripts[_key] = arguments[_key];
  }

  return function (WrappedComponent) {

    var addCache = function addCache(entry) {
      if (loadedScript.indexOf(entry) < 0) {
        loadedScript.push(entry);
      }
    };

    var removeFailedScript = function removeFailedScript() {
      if (failedScript.length > 0) {
        failedScript.forEach(function (script) {
          var node = document.querySelector('script[src=\'' + script + '\']');
          if (node != null) {
            node.parentNode.removeChild(node);
          }
        });

        failedScript = [];
      }
    };

    var ScriptLoader = function (_Component) {
      _inherits(ScriptLoader, _Component);

      function ScriptLoader(props, context) {
        _classCallCheck(this, ScriptLoader);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ScriptLoader).call(this, props, context));

        _this.state = {
          isScriptLoaded: false,
          isScriptLoadSucceed: false
        };
        return _this;
      }

      _createClass(ScriptLoader, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          var _this2 = this;

          // sequence load
          var loadNewScript = function loadNewScript(src) {
            if (loadedScript.indexOf(src) < 0) return (0, _utils.newScript)(src);
          };
          var tasks = scripts.map(function (src) {
            if (Array.isArray(src)) {
              return src.map(loadNewScript);
            } else return loadNewScript(src);
          });

          _utils.series.apply(undefined, _toConsumableArray(tasks))(function (err, src) {
            if (err) {
              failedScript.push(src);
            } else {
              if (Array.isArray(src)) {
                src.forEach(addCache);
              } else addCache(src);
            }
          })(function (err) {
            removeFailedScript();

            _this2.setState({
              isScriptLoaded: true,
              isScriptLoadSucceed: !err
            }, function () {
              if (!err) {
                _this2.props.onScriptLoaded();
              }
            });
          });
        }
      }, {
        key: 'render',
        value: function render() {
          var props = _extends({}, this.props, this.state);

          return _react2.default.createElement(WrappedComponent, props);
        }
      }]);

      return ScriptLoader;
    }(_react.Component);

    ScriptLoader.propTypes = {
      onScriptLoaded: _react.PropTypes.func
    };
    ScriptLoader.defaultProps = {
      onScriptLoaded: function onScriptLoaded() {}
    };


    return (0, _hoistNonReactStatics2.default)(ScriptLoader, WrappedComponent);
  };
};

exports.default = scriptLoader;