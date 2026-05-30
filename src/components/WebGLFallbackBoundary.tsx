import React, { ErrorInfo, ReactNode } from "react";
import { useStore } from "../store/useStore";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class WebGLFallbackBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("WebGL crash detected, gracefully degrading to fallback tier.", error, errorInfo);
    // Asynchronously update the store to avoid React state update warnings during render
    setTimeout(() => {
      useStore.getState().setQualityTier("fallback");
    }, 0);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}
