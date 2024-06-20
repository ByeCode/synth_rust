import React from "react";

interface KeyboardProps {
  numKeys: number;
}

const Keyboard: React.FC<KeyboardProps> = ({ numKeys }) => {
  const keys = [];
  let blackKeyCounter = 0;
  let isFourSet = true;

  const handleKeyPress = (key: string) => {
    console.log(`Key pressed: ${key}`);
  };

  for (let i = 0; i < numKeys; i++) {
    keys.push(
      <div
        key={`white-${i}`}
        className="relative w-16 h-40 bg-white border border-gray-300 inline-block"
        onClick={() => handleKeyPress(`white-${i}`)}
      >
        {(isFourSet &&
          (blackKeyCounter === 1 ||
            blackKeyCounter === 2 ||
            blackKeyCounter === 3)) ||
        (!isFourSet && (blackKeyCounter === 1 || blackKeyCounter === 2)) ? (
          <div
            key={`black-${i}`}
            className="absolute w-10 h-24 bg-black -top-24 left-10 z-10"
            onClick={(e) => {
              e.stopPropagation();
              handleKeyPress(`black-${i}`);
            }}
          ></div>
        ) : null}
        {isFourSet && blackKeyCounter === 3
          ? ((blackKeyCounter = 0), (isFourSet = false))
          : !isFourSet && blackKeyCounter === 2
          ? ((blackKeyCounter = 0), (isFourSet = true))
          : blackKeyCounter++}
      </div>
    );
  }

  return <div className="flex">{keys}</div>;
};

export default Keyboard;
