import React from "react";
import { act, render } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  let container: Element;

  beforeEach(() => {
    jest.useFakeTimers();
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  test("App should render builder and chart", () => {
    act(() => {
      render(<App />, {
        container,
      });
    });

    expect(container).toMatchSnapshot();
  });
});
