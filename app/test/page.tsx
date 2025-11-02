'use client';

import { useState } from 'react';
import PixelClock from '../components/Clock';

// 4x7 그리드로 숫자 패턴 정의 (7-segment 스타일)
const digitPatterns: { [key: string]: boolean[] } = {
  '0': [
    true, true, true, true,
    true, false, false, true,
    true, false, false, true,
    true, false, false, true,
    true, false, false, true,
    true, false, false, true,
    true, true, true, true,
  ],
  '1': [
    false, false, true, false,
    false, true, true, false,
    false, false, true, false,
    false, false, true, false,
    false, false, true, false,
    false, false, true, false,
    false, true, true, true,
  ],
  '2': [
    true, true, true, true,
    false, false, false, true,
    false, false, false, true,
    true, true, true, true,
    true, false, false, false,
    true, false, false, false,
    true, true, true, true,
  ],
  '3': [
    true, true, true, true,
    false, false, false, true,
    false, false, false, true,
    true, true, true, true,
    false, false, false, true,
    false, false, false, true,
    true, true, true, true,
  ],
  '4': [
    true, false, false, true,
    true, false, false, true,
    true, false, false, true,
    true, true, true, true,
    false, false, false, true,
    false, false, false, true,
    false, false, false, true,
  ],
  '5': [
    true, true, true, true,
    true, false, false, false,
    true, false, false, false,
    true, true, true, true,
    false, false, false, true,
    false, false, false, true,
    true, true, true, true,
  ],
  '6': [
    true, true, true, true,
    true, false, false, false,
    true, false, false, false,
    true, true, true, true,
    true, false, false, true,
    true, false, false, true,
    true, true, true, true,
  ],
  '7': [
    true, true, true, true,
    false, false, false, true,
    false, false, false, true,
    false, false, false, true,
    false, false, false, true,
    false, false, false, true,
    false, false, false, true,
  ],
  '8': [
    true, true, true, true,
    true, false, false, true,
    true, false, false, true,
    true, true, true, true,
    true, false, false, true,
    true, false, false, true,
    true, true, true, true,
  ],
  '9': [
    true, true, true, true,
    true, false, false, true,
    true, false, false, true,
    true, true, true, true,
    false, false, false, true,
    false, false, false, true,
    true, true, true, true,
  ],
};

function getDigitPattern(digit: string): boolean[] {
  return digitPatterns[digit] || [];
}

export default function TestPage() {
  const [currentDigit, setCurrentDigit] = useState(0);

  const handleNext = () => {
    setCurrentDigit((prev) => (prev + 1) % 10);
  };

  // 4x7 그리드 (총 28개)
  const displayPixels: boolean[] = new Array(28).fill(false);

  // 현재 숫자 패턴 가져오기
  const digitPattern = getDigitPattern(currentDigit.toString());

  // 패턴을 displayPixels에 적용
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 4; col++) {
      const index = row * 4 + col;
      displayPixels[index] = digitPattern[row * 4 + col];
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <h1 className="text-4xl font-bold mb-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">Test Clock</h1>
      <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        {displayPixels.map((isActive, index) => (
          <PixelClock
            key={index}
            isActive={isActive}
            pixelIndex={index}
            totalCols={4}
            totalRows={7}
            pixelMap={displayPixels}
          />
        ))}
      </div>
      <div className="mt-8 flex flex-col items-center gap-4">
        <p className="text-lg text-amber-300/80">Current Digit: {currentDigit}</p>
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-colors shadow-lg shadow-amber-500/50"
        >
          Next Digit
        </button>
      </div>
    </main>
  );
}

