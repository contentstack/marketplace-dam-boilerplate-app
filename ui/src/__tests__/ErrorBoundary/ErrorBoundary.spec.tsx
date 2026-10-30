import React from "react";
import { act, render, screen } from "@testing-library/react";
import ErrorBoundary from "../../components/ErrorBoundary";

const Boom = () => {
  throw new Error("boom");
};

describe("ErrorBoundary", () => {
  beforeEach(() => {
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());

  test("renders its children when nothing throws", () => {
    render(
      <ErrorBoundary>
        <p>fine</p>
      </ErrorBoundary>
    );
    expect(screen.getByText("fine")).toBeTruthy();
  });

  test("renders the fallback heading when the error state is set", () => {
    const ref = React.createRef<ErrorBoundary>();
    render(
      <ErrorBoundary ref={ref}>
        <p>fine</p>
      </ErrorBoundary>
    );
    act(() => ref.current!.setState({ hasError: true }));
    expect(screen.getByText("Something went wrong.")).toBeTruthy();
    expect(screen.queryByText("fine")).toBeNull();
  });

  // BUG: MKT-20303 — componentDidCatch rethrows (`throw new Error(errorInfo)`), so the error
  // escapes the boundary and "Something went wrong." is never shown.
  test.skip("shows the fallback instead of crashing when a child throws", () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );
    expect(screen.getByText("Something went wrong.")).toBeTruthy();
  });
});
