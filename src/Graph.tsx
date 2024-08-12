import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

class Graph extends Component<IProps, {}> {
  private table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Use type assertion to confirm that the element is of the correct type
    const elem = document.getElementsByTagName('perspective-viewer')[0] as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      elem.load(this.table);
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update(this.props.data.map((el: any) => ({
        stock: el.stock,
        top_ask_price: el.top_ask && el.top_ask.price || 0,
        top_bid_price: el.top_bid && el.top_bid.price || 0,
        timestamp: el.timestamp,
      })));
    }
  }
}

export default Graph;
