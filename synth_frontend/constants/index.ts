const dialData = [
  {
    id: "v1SampleRate",
    min: 0,
    max: 100000,
    initialValue: 0,
    step: 1,
    label: "Sample Rate",
  },
  {
    id: "v2Amplitude",
    min: 0,
    max: 1,
    initialValue: 0,
    step: 0.1,
    label: "Amplitude",
  },
  {
    id: "v3Frequency",
    min: 0,
    max: 1000,
    initialValue: 0,
    step: 1,
    label: "Frequency",
  },
  {
    id: "v4Duration",
    min: 0,
    max: 10,
    initialValue: 0,
    step: 1,
    label: "Duration",
  },
  {
    id: "v6Attack",
    min: 0,
    max: 1,
    initialValue: 0,
    step: 0.1,
    label: "Attack",
  },
  {
    id: "v7Decay",
    min: 0,
    max: 1,
    initialValue: 0,
    step: 0.1,
    label: "Decay",
  },
  {
    id: "v8Sustain",
    min: 0,
    max: 1,
    initialValue: 0,
    step: 0.1,
    label: "Sustain",
  },
  {
    id: "v9Release",
    min: 0,
    max: 1,
    initialValue: 0,
    step: 0.1,
    label: "Release",
  },
  {
    id: "v10Cutoff",
    min: 0,
    max: 20000,
    initialValue: 0,
    step: 1,
    label: "Cutoff",
  },
];

const data = { dialData };

export default data;
