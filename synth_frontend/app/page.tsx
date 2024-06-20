"use client";

import Image from "next/image";
import axios from "axios";

import { useState } from "react";
import Keyboard from "../components/Keyboard";
import Selector from "../components/Selector";

import DialPanel from "../components/panels/DialPanel";

import data from "../constants";

export default function Home() {
  const playSound = async () => {
    try {
      const params = {
        sample_rate:
          dials.find((d) => d.id === "v1SampleRate")?.initialValue || 44100,
        frequency:
          dials.find((d) => d.id === "v3Frequency")?.initialValue || 440.0,
        duration: dials.find((d) => d.id === "v4Duration")?.initialValue || 2.0,
        waveform: selectedWaveform,
        adsr: {
          attack: dials.find((d) => d.id === "v6Attack")?.initialValue || 0.1,
          decay: dials.find((d) => d.id === "v7Decay")?.initialValue || 0.2,
          sustain: dials.find((d) => d.id === "v8Sustain")?.initialValue || 0.7,
          release: dials.find((d) => d.id === "v9Release")?.initialValue || 0.5,
        },
      };

      const response = await axios.post(
        "http://127.0.0.1:8080/play_sound",
        params
      );
      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 429) {
          console.log("Currently already playing a sound");
        } else {
          console.error("Error playing sound:", error);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  const [dials, setDials] = useState(data.dialData);

  const handleDialChange = (id: string, newValue: number) => {
    setDials((prevDials) =>
      prevDials.map((dial) =>
        dial.id === id ? { ...dial, initialValue: newValue } : dial
      )
    );
  };

  const [selectedWaveform, setSelectedWaveform] = useState("Sine");
  const waveforms = ["Sine", "Square", "Triangle", "Sawtooth"];

  const handleWaveformChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedWaveform(event.target.value);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
        {/* <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div> */}
      </div>

      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        {/* <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Templates{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Explore starter templates for Next.js.
          </p>
        </a> */}

        <Selector
          values={waveforms}
          selectedValue={selectedWaveform}
          onChange={handleWaveformChange}
        />

        <DialPanel
          dials={dials.map((dial) => ({
            id: dial.id,
            min: dial.min,
            max: dial.max,
            initialValue: dial.initialValue,
            step: dial.step,
            onChange: handleDialChange,
            label: dial.label,
          }))}
        />

        <a
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          onClick={playSound}
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Play{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-balance text-sm opacity-50">
            Let&apos;s try playing a basic note on our synth.
          </p>
        </a>
      </div>

      {/* <Keyboard numKeys={20} /> */}
    </main>
  );
}
