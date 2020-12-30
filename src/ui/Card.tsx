import React, { FunctionComponent } from "react";

const Card: FunctionComponent = ({ children }) => (
  <div className="space-y-4 rounded-lg p-4 bg-gray-900 border border-gray-700 flex flex-col bg-opacity-60">
    {children}
  </div>
);

export default Card;
