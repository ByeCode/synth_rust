import React from "react";
import Dial from "../Dial";

interface DialProps {
  id: string;
  min: number;
  max: number;
  initialValue: number;
  step: number;
  onChange: (id: string, value: number) => void;
  label: string;
}

interface DialPanelProps {
  dials: DialProps[];
}

const DialPanel: React.FC<DialPanelProps> = ({ dials }) => {
  const handleDialChange = (id: string, newValue: number) => {
    // Notify parent component about the change
    const dial = dials.find((d) => d.id === id);
    if (dial) {
      dial.onChange(id, newValue);
    }
  };

  return (
    <>
      {dials.map((dial) => (
        <Dial
          key={dial.id}
          min={dial.min}
          max={dial.max}
          initialValue={dial.initialValue}
          step={dial.step}
          onChange={(value) => handleDialChange(dial.id, value)}
          label={dial.label}
        />
      ))}
    </>
  );
};

export default DialPanel;
