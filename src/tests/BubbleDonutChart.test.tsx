import React from "react";
import "./helpers/mock-bubble-donut-worker";
import { render } from "@testing-library/react";
import BubbleDonutChart from "../ui/bubble-donut-chart/BubbleDonutChart";
import dataSample from "./fixtures/data-sample.json";

describe("BubbleDonutChart", () => {
  test("BubbleDonutChart should render circles", (done) => {
    const { container } = render(<BubbleDonutChart rawData={dataSample} />);

    // wait for animations
    setTimeout(() => {
      expect(container).toMatchSnapshot();
      done();
    }, 1000);
  });
});
