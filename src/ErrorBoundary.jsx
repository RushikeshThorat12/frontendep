// src/ErrorBoundary.jsx
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
          <h1 style={{ color: "crimson" }}>Something went wrong.</h1>
          <pre>{String(this.state.error)}</pre>
          <p>Check browser console for details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
