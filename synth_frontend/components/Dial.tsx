import { useState, useRef } from "react";

interface DialProps {
  min: number;
  max: number;
  step: number;
  initialValue?: number;
  onChange?: (value: number) => void;
  label: string;
}

const Dial: React.FC<DialProps> = ({
  min,
  max,
  step,
  initialValue = 0,
  onChange,
  label,
}) => {
  const [value, setValue] = useState(initialValue);
  const dialRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    const dial = dialRef.current;
    if (dial) {
      const rect = dial.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle =
        Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
      let newValue = ((angle + 180) / 360) * (max - min) + min;
      newValue = Math.round(newValue / step) * step; // Apply step
      newValue = Math.max(min, Math.min(max, newValue));
      setValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = () => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const rotation = ((value - min) / (max - min)) * 360 - 180;

  return (
    <div className="flex flex-col items-center">
      <span className="mb-2 text-lg font-medium">{label}</span>{" "}
      {/* Added label */}
      <div
        ref={dialRef}
        className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer"
        onMouseDown={handleMouseDown}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <div className="w-1 h-6 bg-red-500" />
      </div>
      <span className="mt-2 text-xl">{value}</span>
    </div>
  );
};

export default Dial;
