import { Component, type ReactNode } from "react";

/** Catches a crash in any page and shows a friendly screen instead of a blank page. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error(error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="crash">
        <h1>Something went wrong</h1>
        <p>Щось пішло не так. Please reload the page.</p>
        <a className="btn" href="/">
          Verra Estates
        </a>
      </main>
    );
  }
}
