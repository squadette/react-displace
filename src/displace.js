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

    constructor(props) {
      super(props);
      this.state = { mounted: false };
    }

    componentDidMount() {
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
      this.setState({ mounted: true });
    }

    componentWillUnmount() {
      if (!options.renderTo) {
        this.container.parentNode.removeChild(this.container);
      }
    }

    render() {
      if (this.props.mounted === false) {
        return null;
      }
      if (!this.state.mounted) {
        return null;
      }
      if (!this.container) {
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
