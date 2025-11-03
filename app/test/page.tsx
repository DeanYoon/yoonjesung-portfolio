'use client';

import { useState } from 'react';
import PixelClock from '../components/Clock';

// 4x6 그리드로 숫자 패턴 정의 (7-segment 스타일)
const digitPatterns: { [key: string]: number[] } = {
  '0': [
    3, 2, 2, 4,
    1, 3, 4, 1,
    1, 1, 1, 1,
    1, 1, 1, 1,
    1, 5, 6, 1,
    5, 2, 2, 6,
  ],
  '1': [
    3, 2, 4, 0,
    5, 4, 1, 0,
    0, 1, 1, 0,
    0, 1, 1, 0,
    3, 6, 5, 4,
    5, 2, 2, 6,
  ],
  '2': [
    3, 2, 2, 4,
    5, 2, 4, 1,
    3, 2, 6, 1,
    1, 3, 2, 6,
    1, 5, 2, 4,
    5, 2, 2, 6,
  ],
  '3': [
    3, 2, 2, 4,
    5, 2, 4, 1,
    3, 2, 6, 1,
    5, 2, 4, 1,
    3, 2, 6, 1,
    5, 2, 2, 6,
  ],
  '4': [
    3, 4, 3, 4,
    1, 1, 1, 1,
    1, 5, 6, 1,
    5, 2, 4, 1,
    0, 0, 1, 1,
    0, 0, 5, 6,
  ],
  '5': [
    3, 2, 2, 4,
    1, 3, 2, 6,
    1, 5, 2, 4,
    5, 2, 4, 1,
    3, 2, 6, 1,
    5, 2, 2, 6,
  ],
  '6': [
    3, 2, 2, 4,
    1, 3, 2, 6,
    1, 5, 2, 4,
    1, 3, 4, 1,
    1, 5, 6, 1,
    5, 2, 2, 6,
  ],
  '7': [
    3, 2, 2, 4,
    1, 3, 4, 1,
    5, 6, 1, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 0, 5, 6,
  ],
  '8': [
    3, 2, 2, 4,
    1, 3, 4, 1,
    1, 5, 6, 1,
    1, 3, 4, 1,
    1, 5, 6, 1,
    5, 2, 2, 6,
  ],
  '9': [
    3, 2, 2, 4,
    1, 3, 4, 1,
    1, 5, 6, 1,
    5, 2, 4, 1,
    3, 2, 6, 1,
    5, 2, 2, 6,
  ],
};

function getDigitPattern(digit: string): number[] {
  return digitPatterns[digit] || [];
}

export default function TestPage() {
  const [currentDigit, setCurrentDigit] = useState(0);

  const handleNext = () => {
    setCurrentDigit((prev) => (prev + 1) % 10);
  };

  // 4x6 그리드 (총 24개)
  const displayPixels: number[] = new Array(24).fill(0);

  // 현재 숫자 패턴 가져오기
  const digitPattern = getDigitPattern(currentDigit.toString());

  // 패턴을 displayPixels에 적용
  for (let row = 0; row < 6; row++) {
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
            totalRows={6}
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

