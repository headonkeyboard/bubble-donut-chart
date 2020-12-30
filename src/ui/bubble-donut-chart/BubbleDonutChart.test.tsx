import React from "react";
import { render } from "@testing-library/react";
import BubbleDonutChart from "./BubbleDonutChart";
import { RawData } from "../../lib/core/models";

const data: RawData[] = [
  { id: "1", group: "group 1", weight: 10 },
  { id: "2", group: "group 1", weight: 10 },
  { id: "3", group: "group 2", weight: 10 },
  { id: "4", group: "group 2", weight: 10 },
];

describe("BubbleDonutChart", () => {
  test("BubbleDonutChart should render circles", (done) => {
    const { container } = render(<BubbleDonutChart rawData={data} />);

    // wait for animations
    setTimeout(() => {
      expect(container).toMatchSnapshot();
      done();
    }, 1000);
  });
});
