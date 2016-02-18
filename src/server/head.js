import path from 'path';
import React, { Component, PropTypes } from 'react';
import DocumentMeta from 'react-document-meta';

export default class Head extends Component {
  static propTypes = {
    additions: PropTypes.string,
    assets: PropTypes.object,
    headers: PropTypes.object,
    store: PropTypes.object
  };

  renderAdditions() {
    const { additions, headers, store } = this.props;
    if (additions) {
      const additionsNodeFn = require(path.resolve(additions)).default;
      const additionsNode = additionsNodeFn(store, headers);

      // The additionsNode will have a wrapper due to JSX limitations. However,
      // we want to remove the wrapper for valid HTML head.
      return additionsNode.props.children;
    }
  }

  render() {
    const { assets } = this.props;

    return (
      <head>
        {DocumentMeta.renderAsReact()}

        {this.renderAdditions()}

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* styles (will be present only in production with webpack extract text plugin) */}
        {Object.keys(assets.styles).map((style, key) =>
          <link href={assets.styles[style]} key={key} media="screen, projection"
                rel="stylesheet" type="text/css" charSet="UTF-8"/>
        )}
      </head>
    );
  }
}
