/// <reference types="vite/client" />
import { Component, type ErrorInfo, type ReactNode } from "react";
import { ROUTES } from "../helpers/routes";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<AppErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("AppErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleGoHome = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.href = ROUTES.HOME;
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[var(--color-background)] px-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md text-center">
            <h1 className="mb-2 font-[family-name:var(--font-heading)] text-2xl font-semibold text-[var(--color-foreground)]">
              Something went wrong
            </h1>
            <p className="mb-6 text-[var(--color-text-muted)]">
              An unexpected error occurred. Please try again or return to the
              home page.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="mb-6 max-h-32 overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-background-alt)] p-3 text-left text-xs text-[var(--color-text-muted)]">
                {this.state.error.message}
              </pre>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={this.handleReload}
              className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary-foreground)] transition-colors hover:bg-[var(--color-primary-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
              aria-label="Reload the page"
            >
              Reload
            </button>
            <button
              type="button"
              onClick={this.handleGoHome}
              className="rounded-lg border-2 border-[var(--color-primary)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)] hover:text-[var(--color-primary-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
              aria-label="Go to home page"
            >
              Go home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
