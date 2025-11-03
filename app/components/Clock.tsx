'use client';

import { useEffect, useState, useRef } from 'react';

interface PixelClockProps {
  isActive: number; // 0 또는 1
  pixelIndex: number; // 픽셀 인덱스 (0-146)
  totalCols: number; // 전체 열 수 (21)
  totalRows: number; // 전체 행 수 (7)
  pixelMap: number[]; // 전체 픽셀 맵 (0 또는 1)
}

// 전역 기준 시간
let globalBaseTime = Date.now();

// 각 숫자 값(0 또는 1)별 전역 시간 저장소
// 같은 숫자 값을 가진 모든 시계는 동일한 시간 사용
// isActive -> baseTime
const valueBaseTimes: { [key: number]: number } = {};

// 각 숫자 그룹의 시작 열 위치 (main 페이지용)
const getDigitGroup = (col: number, totalCols: number): number | null => {
  // test 페이지는 4x7 그리드이므로 항상 0 반환
  if (totalCols === 4) return 0;

  // main 페이지 (21x7 그리드)
  if (col >= 0 && col < 4) return 0;
  if (col >= 5 && col < 9) return 1;
  if (col === 10) return null;
  if (col >= 12 && col < 16) return 2;
  if (col >= 17 && col < 21) return 3;
  return null;
};

// isActive 값에 따라 시침/분침 기본 각도 결정
// 숫자 패턴이 곧 시계의 형태
const valueToAngles = (isActive: number): { hourAngle: number; minuteAngle: number } => {
  const up = (270 + 90) % 360;      // 0도 (12시)
  const right = (0 + 90) % 360;      // 90도 (3시)
  const down = (90 + 90) % 360;      // 180도 (6시)
  const left = (180 + 90) % 360;     // 270도 (9시)
  const defaultAngle = (270 - 210 + 90) % 360; // 7시 방향 (150도)

  if (isActive === 1) {
    // 1: 시침 12시, 분침 6시
    return { hourAngle: up, minuteAngle: down };
  } else if (isActive === 2) {
    // 2: 시침 3시, 분침 9시
    return { hourAngle: right, minuteAngle: left };
  } else if (isActive === 3) {
    // 3: 시침 3시, 분침 6시
    return { hourAngle: right, minuteAngle: down };
  } else if (isActive === 4) {
    // 4: 시침 9시, 분침 6시
    return { hourAngle: left, minuteAngle: down };
  } else if (isActive === 5) {
    // 5: 시침 12시, 분침 3시
    return { hourAngle: up, minuteAngle: right };
  } else if (isActive === 6) {
    // 6: 시침 9시, 분침 12시
    return { hourAngle: left, minuteAngle: up };
  } else {
    // 0: 정지 또는 기본 위치
    return { hourAngle: defaultAngle, minuteAngle: defaultAngle };
  }
};

// 각도 간의 최단 경로를 계산하는 함수
const normalizeAngle = (angle: number): number => {
  while (angle < 0) angle += 360;
  while (angle >= 360) angle -= 360;
  return angle;
};

// 두 각도 간의 최단 거리 계산
const angleDifference = (from: number, to: number): number => {
  const diff = normalizeAngle(to - from);
  if (diff > 180) return diff - 360;
  return diff;
};

export default function PixelClock({ isActive, pixelIndex, totalCols, totalRows, pixelMap }: PixelClockProps) {
  const [time, setTime] = useState(Date.now());

  // 픽셀의 행과 열 위치 계산
  const row = Math.floor(pixelIndex / totalCols);
  const col = pixelIndex % totalCols;
  const digitGroup = getDigitGroup(col, totalCols);

  // 같은 숫자 값(isActive)을 가진 모든 시계가 동일한 시간을 사용하도록 값별 기준 시간 초기화
  useEffect(() => {
    if (!valueBaseTimes[isActive]) {
      valueBaseTimes[isActive] = Date.now();
    }
  }, [isActive]);

  // 전역 시간 업데이트
  useEffect(() => {
    if (digitGroup === 0 || (totalCols === 4)) {
      globalBaseTime = Date.now();
    }

    let animationFrameId: number;

    const updateTime = () => {
      setTime(Date.now());
      animationFrameId = requestAnimationFrame(updateTime);
    };

    animationFrameId = requestAnimationFrame(updateTime);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [digitGroup, totalCols]);

  // 콜론인 경우 실제 현재 시간 계산
  const isColon = digitGroup === null;
  let targetHourAngle: number;
  let targetMinuteAngle: number;
  let targetSecondAngle: number = 0;

  if (isColon && isActive !== 0) {
    // 콜론이고 활성화된 경우: 실제 현재 시간 표시
    const now = new Date(time);
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // 시침: 12시간 기준, 분과 초도 고려
    // 1시간 = 30도, 1분 = 0.5도
    // 0도가 위쪽(12시)이므로 계산된 각도를 그대로 사용
    const hourAngleValue = (hours % 12) * 30 + minutes * 0.5;

    // 분침: 60분 기준, 초도 고려
    // 1분 = 6도, 1초 = 0.1도
    // 0도가 위쪽(12시)이므로 계산된 각도를 그대로 사용
    const minuteAngleValue = minutes * 6 + seconds * 0.1;

    // 초침: 60초 기준
    // 1초 = 6도
    const secondAngleValue = seconds * 6;

    targetHourAngle = normalizeAngle(hourAngleValue);
    targetMinuteAngle = normalizeAngle(minuteAngleValue);
    targetSecondAngle = normalizeAngle(secondAngleValue);
  } else {
    // 숫자 패턴: isActive 값에 따라 기본 각도 결정
    const baseAngles = valueToAngles(isActive);
    targetHourAngle = baseAngles.hourAngle;
    targetMinuteAngle = baseAngles.minuteAngle;
  }

  // 현재 각도 상태 (부드러운 전환을 위해)
  const currentHourAngleRef = useRef<number>(targetHourAngle);
  const currentMinuteAngleRef = useRef<number>(targetMinuteAngle);
  const currentSecondAngleRef = useRef<number>(targetSecondAngle);
  const prevFrameTimeRef = useRef<number>(Date.now());

  // 부드러운 각도 전환 (보간)
  const angleSpeedPerSecond = 180 * 0.3; // 54도/초

  // deltaTime을 사용해서 프레임 레이트와 관계없이 정확한 속도로 움직임
  const deltaTime = Math.max(0, Math.min((time - prevFrameTimeRef.current) / 1000, 0.1));
  prevFrameTimeRef.current = time;

  // 프레임당 최대 움직임
  const maxAnglePerFrame = angleSpeedPerSecond * deltaTime;

  const currentHour = currentHourAngleRef.current;
  const currentMinute = currentMinuteAngleRef.current;
  const currentSecond = currentSecondAngleRef.current;

  // 부드럽게 전환되도록 처리
  const hourDiff = angleDifference(currentHour, targetHourAngle);
  const minuteDiff = angleDifference(currentMinute, targetMinuteAngle);
  const secondDiff = isColon && isActive !== 0
    ? angleDifference(currentSecond, targetSecondAngle)
    : 0;

  // 각도 차이를 속도로 제한
  const hourMovement = Math.max(-maxAnglePerFrame, Math.min(maxAnglePerFrame, hourDiff));
  const minuteMovement = Math.max(-maxAnglePerFrame, Math.min(maxAnglePerFrame, minuteDiff));
  const secondMovement = isColon && isActive !== 0
    ? Math.max(-maxAnglePerFrame, Math.min(maxAnglePerFrame, secondDiff))
    : 0;

  const hourAngle = normalizeAngle(currentHour + hourMovement);
  const minuteAngle = normalizeAngle(currentMinute + minuteMovement);
  const secondAngle = isColon && isActive !== 0
    ? normalizeAngle(currentSecond + secondMovement)
    : 0;

  // ref 업데이트
  currentHourAngleRef.current = hourAngle;
  currentMinuteAngleRef.current = minuteAngle;
  if (isColon && isActive !== 0) {
    currentSecondAngleRef.current = secondAngle;
  }

  return (
    <div className="relative inline-block hover:brightness-150 transition-all duration-200 cursor-pointer">
      <svg width="50" height="50" viewBox="0 0 20 20" className="relative">
        {/* 원형 시계 배경 - 콜론은 색상 있음 */}
        <circle
          cx="10"
          cy="10"
          r="9"
          fill={isActive !== 0 && digitGroup === null ? "#2C5282" : "#0F172A"}
          stroke={isActive !== 0 && digitGroup === null ? "#3B82F6" : "#1E293B"}
          strokeWidth="0.3"
        />

        {/* 시침 - 위쪽 콜론(1행) 또는 숫자에만 표시 */}
        {((isColon && isActive !== 0 && row === 1) || (isActive !== 0 && digitGroup !== null)) && (
          <line
            x1="10"
            y1="10"
            x2="10"
            y2={isActive !== 0 && digitGroup !== null ? "2" : "2"}
            stroke="#F59E0B"
            strokeWidth="0.8"
            strokeLinecap="round"
            transform={`rotate(${hourAngle} 10 10)`}
          />
        )}

        {/* 분침 - 위쪽 콜론(1행) 또는 숫자에만 표시 */}
        {((isColon && isActive !== 0 && row === 1) || (isActive !== 0 && digitGroup !== null)) && (
          <line
            x1="10"
            y1="10"
            x2="10"
            y2={isActive !== 0 && digitGroup !== null ? "2" : "2"}
            stroke="#FBBF24"
            strokeWidth="0.6"
            strokeLinecap="round"
            transform={`rotate(${minuteAngle} 10 10)`}
          />
        )}

        {/* 초침 - 아래쪽 콜론(4행)에만 표시 */}
        {isColon && isActive !== 0 && row === 4 && (
          <line
            x1="10"
            y1="10"
            x2="10"
            y2="1.5"
            stroke="#EF4444"
            strokeWidth="0.4"
            strokeLinecap="round"
            transform={`rotate(${secondAngle} 10 10)`}
          />
        )}

        {/* 중심점 - 반 고흐 작품의 금색 */}
        <circle
          cx="10"
          cy="10"
          r="0.6"
          fill="#F59E0B"
        />
      </svg>
    </div>
  );
}
