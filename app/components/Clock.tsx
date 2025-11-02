'use client';

import { useEffect, useState, useRef } from 'react';

interface PixelClockProps {
  isActive: boolean;
  pixelIndex: number; // 픽셀 인덱스 (0-146)
  totalCols: number; // 전체 열 수 (21)
  totalRows: number; // 전체 행 수 (7)
  pixelMap: boolean[]; // 전체 픽셀 맵
}

// 전역 기준 시간 (모든 시계가 공유)
let globalBaseTime = Date.now();

// 각 숫자 그룹의 시작 열 위치
const getDigitGroup = (col: number): number | null => {
  // 첫 번째 숫자: 0-3열
  if (col >= 0 && col < 4) return 0;
  // 두 번째 숫자: 5-8열
  if (col >= 5 && col < 9) return 1;
  // 콜론: 10열
  if (col === 10) return null; // 콜론은 제외
  // 세 번째 숫자: 12-15열
  if (col >= 12 && col < 16) return 2;
  // 네 번째 숫자: 17-20열
  if (col >= 17 && col < 21) return 3;
  return null; // 공백 영역
};

// 인접한 파란색 픽셀의 방향을 계산
const getConnectedDirections = (
  row: number,
  col: number,
  totalRows: number,
  totalCols: number,
  pixelMap: boolean[]
): { hourAngle: number; minuteAngle: number } => {
  const directions: number[] = [];

  // 상 (위쪽) - SVG rotate는 시계 방향이므로 270도
  if (row > 0) {
    const upIndex = (row - 1) * totalCols + col;
    if (pixelMap[upIndex]) {
      directions.push(270); // 위쪽
    }
  }

  // 하 (아래쪽) - SVG rotate는 시계 방향이므로 90도
  if (row < totalRows - 1) {
    const downIndex = (row + 1) * totalCols + col;
    if (pixelMap[downIndex]) {
      directions.push(90); // 아래쪽
    }
  }

  // 좌 (왼쪽) - SVG rotate는 시계 방향이므로 180도
  if (col > 0) {
    const leftIndex = row * totalCols + (col - 1);
    if (pixelMap[leftIndex]) {
      directions.push(180); // 왼쪽
    }
  }

  // 우 (오른쪽) - SVG rotate는 시계 방향이므로 0도
  if (col < totalCols - 1) {
    const rightIndex = row * totalCols + (col + 1);
    if (pixelMap[rightIndex]) {
      directions.push(0); // 오른쪽
    }
  }

  // 각도에 180도를 더해서 시침과 분침이 올바른 방향을 향하도록 보정 (90도 추가)
  const adjustedDirections = directions.map(dir => (dir + 90) % 360);

  // 인접한 파란색 픽셀이 있으면 그 방향으로 향하도록
  if (adjustedDirections.length >= 2) {
    return {
      hourAngle: adjustedDirections[0],
      minuteAngle: adjustedDirections[1],
    };
  } else if (adjustedDirections.length === 1) {
    // 하나만 있으면 시침만 사용, 분침은 반대 방향
    return {
      hourAngle: adjustedDirections[0],
      minuteAngle: (adjustedDirections[0] + 180) % 360,
    };
  }

  // 인접한 파란색 픽셀이 없으면 기본값 (랜덤 - 시침과 분침 각각 다른 각도)
  return {
    hourAngle: Math.random() * 360,
    minuteAngle: Math.random() * 360,
  };
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

  // 현재 각도 상태 (부드러운 전환을 위해)
  // 초기 각도는 랜덤하게 설정 (시침과 분침 각각 다름)
  const currentHourAngleRef = useRef<number>(Math.random() * 360);
  const currentMinuteAngleRef = useRef<number>(Math.random() * 360);

  // 파란 배경이 아닐 때 시작할 각도 (마지막으로 멈춰있던 각도)
  const startHourAngleRef = useRef<number | null>(null);
  const startMinuteAngleRef = useRef<number | null>(null);

  // 파란 배경이 아니게 되었을 때의 시간 기록
  const inactiveStartTimeRef = useRef<number | null>(null);

  // 픽셀의 행과 열 위치 계산
  const row = Math.floor(pixelIndex / totalCols);
  const col = pixelIndex % totalCols;
  const digitGroup = getDigitGroup(col);

  // 파란색 픽셀인 경우 인접한 파란색 픽셀 방향 계산
  const connectedDirections = isActive && digitGroup !== null
    ? getConnectedDirections(row, col, totalRows, totalCols, pixelMap)
    : { hourAngle: 0, minuteAngle: 0 };

  // 시침과 분침 각각 다른 랜덤 오프셋 생성
  // 파란색 픽셀인 경우에만 사용
  const hourOffsetRef = useRef<number>(Math.random() * 360);
  const minuteOffsetRef = useRef<number>(Math.random() * 360);

  const lastTimeRef = useRef<number>(Date.now());
  const prevFrameTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // 첫 마운트 시 전역 기준 시간 초기화
    if (digitGroup === 0) {
      globalBaseTime = Date.now();
    }

    let animationFrameId: number;

    const updateTime = () => {
      const now = Date.now();
      lastTimeRef.current = now;
      setTime(now);
      animationFrameId = requestAnimationFrame(updateTime);
    };

    animationFrameId = requestAnimationFrame(updateTime);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [digitGroup]);

  // isActive 변경 감지: 파란 배경이 아니게 되었을 때 시작 각도 설정
  const prevIsActiveRef = useRef<boolean>(isActive);

  useEffect(() => {
    // 파란 배경이 아니게 되었을 때, 현재 각도를 시작 각도로 설정
    if ((!isActive || digitGroup === null) && inactiveStartTimeRef.current === null) {
      startHourAngleRef.current = currentHourAngleRef.current;
      startMinuteAngleRef.current = currentMinuteAngleRef.current;
      inactiveStartTimeRef.current = Math.max(0, (Date.now() - globalBaseTime) / 1000);
    }

    // 파란 배경이 되었을 때 시작 시간 기록 초기화 (다음에 검은 배경이 될 때를 위해)
    if (isActive && digitGroup !== null && prevIsActiveRef.current !== isActive) {
      inactiveStartTimeRef.current = null;
      startHourAngleRef.current = null;
      startMinuteAngleRef.current = null;
    }

    prevIsActiveRef.current = isActive;
  }, [isActive, digitGroup]);

  // 경과 시간 계산 (초 단위, 소수점 포함)
  // 모든 시계가 같은 기준 시간 사용
  const totalSeconds = Math.max(0, (time - globalBaseTime) / 1000);

  // 시간 배율: 실제 시간보다 빠르게 (5배 빠름)
  const speedMultiplier = 5;
  const virtualSeconds = totalSeconds * speedMultiplier;

  // 목표 각도 계산
  let targetHourAngle: number;
  let targetMinuteAngle: number;

  if (isActive && digitGroup !== null) {
    // 파란색 픽셀: 인접한 파란색 픽셀 방향으로 고정 (연결 상태)
    targetHourAngle = connectedDirections.hourAngle;
    targetMinuteAngle = connectedDirections.minuteAngle;
  } else {
    // 검은색 픽셀: 움직이지 않음 (현재 각도 유지)
    targetHourAngle = currentHourAngleRef.current;
    targetMinuteAngle = currentMinuteAngleRef.current;
  }

  // 부드러운 각도 전환 (보간)
  // 시침과 분침이 같은 속도로 움직임 (느리게)
  // 10초에 360도 = 1초에 36도 * speedMultiplier(5) = 180도/초 (가상 시간)
  // 속도를 더 느리게: 180도/초 * 0.3 = 54도/초
  const angleSpeedPerSecond = 180 * 0.3; // 더 느린 속도 (54도/초)

  // deltaTime을 사용해서 프레임 레이트와 관계없이 정확한 속도로 움직임
  const deltaTime = Math.max(0, Math.min((time - prevFrameTimeRef.current) / 1000, 0.1)); // 초 단위, 최대 0.1초로 제한
  prevFrameTimeRef.current = time;

  // 프레임당 최대 움직임 (초당 속도 * deltaTime)
  // 시침과 분침이 같은 속도로 움직임
  const maxAnglePerFrame = angleSpeedPerSecond * deltaTime;

  const currentHour = currentHourAngleRef.current;
  const currentMinute = currentMinuteAngleRef.current;

  // 항상 부드럽게 전환되도록 처리
  const hourDiff = angleDifference(currentHour, targetHourAngle);
  const minuteDiff = angleDifference(currentMinute, targetMinuteAngle);

  // 각도 차이를 속도로 제한 (시침과 분침 동일)
  const hourMovement = Math.max(-maxAnglePerFrame, Math.min(maxAnglePerFrame, hourDiff));
  const minuteMovement = Math.max(-maxAnglePerFrame, Math.min(maxAnglePerFrame, minuteDiff));

  const hourAngle = normalizeAngle(currentHour + hourMovement);
  const minuteAngle = normalizeAngle(currentMinute + minuteMovement);

  // ref 업데이트
  currentHourAngleRef.current = hourAngle;
  currentMinuteAngleRef.current = minuteAngle;

  return (
    <div className="relative inline-block">
      <svg width="50" height="50" viewBox="0 0 20 20" className="relative">
        {/* 원형 시계 배경 */}
        <circle
          cx="10"
          cy="10"
          r="9"
          fill={isActive ? "#0066ff" : "#000000"}
          stroke={isActive ? "#0066ff" : "#333333"}
          strokeWidth="0.3"
        />

        {/* 시침 (밝은 색) - 인접한 파란색 픽셀까지 연결되도록 길게 */}
        <line
          x1="10"
          y1="10"
          x2="10"
          y2={isActive && digitGroup !== null ? "2" : "6"}
          stroke="#ffffff"
          strokeWidth="0.8"
          strokeLinecap="round"
          transform={`rotate(${hourAngle} 10 10)`}
        />

        {/* 분침 (밝은 색) - 인접한 파란색 픽셀까지 연결되도록 길게 */}
        <line
          x1="10"
          y1="10"
          x2="10"
          y2={isActive && digitGroup !== null ? "2" : "4"}
          stroke="#ffffff"
          strokeWidth="0.6"
          strokeLinecap="round"
          transform={`rotate(${minuteAngle} 10 10)`}
        />

        {/* 중심점 (밝은 색) */}
        <circle
          cx="10"
          cy="10"
          r="0.6"
          fill="#ffffff"
        />
      </svg>
    </div>
  );
}
