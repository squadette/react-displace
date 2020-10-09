'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

function displace(WrappedComponent, options) {
  if (!global.document) {
    return class EmptyDisplace extends React.Component {
      render() {
        return false;
      }
    };
  }

  options = options || {};

  class Displaced extends React.Component {
    static defaultProps = {
      mounted: true
    };

    static WrappedComponent = WrappedComponent;

    componentWillMount() {
      this.container = (() => {
        if (!options.renderTo) {
          var result = document.createElement('div');
          document.body.appendChild(result);
          return result;
        } else if (typeof options.renderTo === 'string') {
          return document.querySelector(options.renderTo);
        } else {
          return options.renderTo;
        }
      })();
    }

    componentWillUnmount() {
      if (!options.renderTo) {
        this.container.parentNode.removeChild(this.container);
      }
    }

    renderDisplaced = () => {
      ReactDOM.unstable_renderSubtreeIntoContainer(
        this,
        React.createElement(WrappedComponent, this.props, this.props.children),
        this.container
      );
    };

    removeDisplaced = () => {
      ReactDOM.unmountComponentAtNode(this.container);
    };

    render() {
      if (this.props.mounted === false) {
        return null;
      }
      return ReactDOM.createPortal(
        React.createElement(WrappedComponent, this.props, this.props.children),
        this.container
      );
    }
  }

  return Displaced;
}

module.exports = displace;
