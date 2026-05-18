import React from 'react';
import HeroCanvasFallback from './HeroCanvasFallback';

export default class Hero3DErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.warn('[hero3d] Falling back to static image:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <HeroCanvasFallback />;
    }
    return this.props.children;
  }
}
