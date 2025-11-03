'use client';

import { useEffect, useState } from 'react';
import PixelClock from './components/Clock';

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
  ':': [
    0,
    1,
    0,
    0,
    1,
    0,
  ],
};

function getDigitPattern(digit: string): number[] {
  return digitPatterns[digit] || [];
}

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  // 시간 문자열: "HH:MM"
  const timeChars = [hours[0], hours[1], ':', minutes[0], minutes[1]];

  // 21x6 그리드 (총 126개) - 각 숫자가 4x6, 숫자 사이 공백 1열, 콜론 1열, 콜론 왼쪽 공백 1열
  // 배치: [숫자1(4열)][공백(1열)][숫자2(4열)][공백(1열)][콜론(1열)][공백(1열)][숫자3(4열)][공백(1열)][숫자4(4열)]
  const displayPixels: number[] = new Array(126).fill(0);

  let currentCol = 0;

  // 첫 번째 숫자 (시의 10의 자리) - 4열
  const digit1 = getDigitPattern(timeChars[0]);
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      const index = row * 21 + (currentCol + col);
      displayPixels[index] = digit1[row * 4 + col];
    }
  }
  currentCol += 4;

  // 공백 - 1열
  currentCol += 1;

  // 두 번째 숫자 (시의 1의 자리) - 4열
  const digit2 = getDigitPattern(timeChars[1]);
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      const index = row * 21 + (currentCol + col);
      displayPixels[index] = digit2[row * 4 + col];
    }
  }
  currentCol += 4;

  // 공백 - 1열 (콜론 왼쪽)
  currentCol += 1;

  // 콜론 - 1열
  const colon = getDigitPattern(timeChars[2]);
  for (let row = 0; row < 6; row++) {
    const index = row * 21 + currentCol;
    displayPixels[index] = colon[row];
  }
  currentCol += 1;

  // 공백 - 1열
  currentCol += 1;

  // 세 번째 숫자 (분의 10의 자리) - 4열
  const digit3 = getDigitPattern(timeChars[3]);
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      const index = row * 21 + (currentCol + col);
      displayPixels[index] = digit3[row * 4 + col];
    }
  }
  currentCol += 4;

  // 공백 - 1열
  currentCol += 1;

  // 네 번째 숫자 (분의 1의 자리) - 4열
  const digit4 = getDigitPattern(timeChars[4]);
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      const index = row * 21 + (currentCol + col);
      displayPixels[index] = digit4[row * 4 + col];
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <h1 className="text-4xl font-bold mb-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">Digital Clock</h1>
      <div className="grid " style={{ gridTemplateColumns: 'repeat(21, minmax(0, 1fr))' }}>
        {displayPixels.map((isActive, index) => (
          <PixelClock
            key={index}
            isActive={isActive}
            pixelIndex={index}
            totalCols={21}
            totalRows={6}
            pixelMap={displayPixels}
          />
        ))}
      </div>
      <p className="mt-8 text-lg text-amber-300/80">Current Time: {hours}:{minutes}</p>
    </main>
  );
}
