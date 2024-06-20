import React from "react";

interface SelectorProps {
  values: string[];
  selectedValue: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Selector: React.FC<SelectorProps> = ({
  values,
  selectedValue,
  onChange,
}) => {
  if (values.length < 2) {
    throw new Error("The list must contain at least 2 items.");
  }

  return (
    <div className="w-64 mx-auto">
      <div className="relative inline-block w-full">
        <select
          className="w-full h-10 pl-3 pr-6 text-base border rounded-lg appearance-none focus:shadow-outline bg-white text-gray-700 placeholder-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          value={selectedValue}
          onChange={onChange}
        >
          {values.map((value, index) => (
            <option key={index} value={value}>
              {value}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-4 h-4 fill-current text-gray-700 dark:text-white"
            viewBox="0 0 20 20"
          >
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      <div className="mt-2 text-center text-gray-700 dark:text-white">
        Selected: {selectedValue}
      </div>
    </div>
  );
};

export default Selector;
