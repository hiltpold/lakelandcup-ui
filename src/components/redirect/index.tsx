import { Component } from 'preact';
import { route } from 'preact-router';
import { PropertySignature } from 'typescript';

type Props = {
    to: string
}

type State = {}

export default class Redirect extends Component<Props, State> {
  componentWillMount() {
    route(this.props.to, true);
  }

  render() {
    return null;
  }
}