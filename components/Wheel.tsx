import React, { useRef, useState } from 'react';
import { Question } from '../types';
import { audioService } from '../services/audioService';

interface WheelProps {
  questions: Question[];
  answeredIds: string[];
  colors: string[];
  onSelectQuestion: (question: Question) => void;
}

const Wheel: React.FC<WheelProps> = ({ questions, answeredIds, colors, onSelectQuestion }) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelRef = useRef<SVGSVGElement>(null);

  const totalSegments = questions.length;
  const anglePerSegment = 360 / totalSegments;

  // Filter available questions to spin to
  const availableQuestions = questions.filter((q) => !answeredIds.includes(q.id));

  const spin = () => {
    if (isSpinning || availableQuestions.length === 0) return;

    setIsSpinning(true);
    
    // Pick a random winner from available questions ONLY
    const randomAvailable = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    const winnerIndex = questions.findIndex(q => q.id === randomAvailable.id);
    
    // --- Precise Angle Calculation ---
    // In SVG (0,0) is top-left.
    // 0 deg is 3 o'clock (East).
    // Pointer is at Top (12 o'clock), which is 270 deg (or -90 deg).
    
    // Center angle of the winning segment currently (assuming 0 rotation):
    // Segment i starts at i * anglePerSegment
    const segmentCenterAngle = (winnerIndex * anglePerSegment) + (anglePerSegment / 2);
    
    // We want to rotate the wheel such that:
    // (segmentCenterAngle + rotation) % 360 = 270
    // rotation = 270 - segmentCenterAngle
    
    // Add multiple full spins (5 spins = 1800 deg)
    const minSpins = 5 * 360;
    
    // Calculate target rotation relative to current position to ensure smooth forward spin
    let targetRotation = 270 - segmentCenterAngle;
    
    // Adjust target to be ahead of current rotation
    const currentRotationNormalized = rotation;
    while (targetRotation < currentRotationNormalized + minSpins) {
        targetRotation += 360;
    }

    // Add random fuzz within the segment (avoiding edges)
    // +/- 40% of the segment width
    const fuzz = (Math.random() * anglePerSegment * 0.8) - (anglePerSegment * 0.4);
    const finalRotation = targetRotation + fuzz;

    setRotation(finalRotation);

    // --- Audio Synchronization ---
    const totalDuration = 4000; // Matches CSS duration
    let tickDelay = 50; // Start fast
    let elapsedTime = 0;

    const playTickLoop = () => {
        if (elapsedTime >= totalDuration) return;

        audioService.playTick();
        
        // Increase delay to simulate slowing down (exponential decay of speed)
        tickDelay = tickDelay * 1.1; 
        elapsedTime += tickDelay;

        if (tickDelay < 400) { // Don't tick if it gets too slow at the very end
             setTimeout(playTickLoop, tickDelay);
        }
    };
    
    // Start ticking
    playTickLoop();

    // Reset spinning state after animation
    setTimeout(() => {
      setIsSpinning(false);
      audioService.playWheelStop(); // Play final thud
      onSelectQuestion(questions[winnerIndex]);
    }, totalDuration);
  };

  const getSegmentPath = (index: number) => {
    // SVG path for a circular sector
    const startAngle = index * anglePerSegment;
    const endAngle = (index + 1) * anglePerSegment;

    // Convert polar to cartesian
    // Center is 50, 50. Radius 50.
    const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
    const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
    const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
    const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

    return `M50,50 L${x1},${y1} A50,50 0 0,1 ${x2},${y2} Z`;
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto aspect-square p-4">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-8 h-10 -mt-2">
         <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-slate-800 drop-shadow-lg"></div>
      </div>

      {/* Wheel */}
      <div className="relative w-full h-full drop-shadow-2xl rounded-full border-4 border-slate-800 bg-white">
        <svg
            ref={wheelRef}
            viewBox="0 0 100 100"
            className="w-full h-full transform transition-transform duration-[4000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ transform: `rotate(${rotation}deg)` }}
        >
            {questions.map((q, i) => {
                const isAnswered = answeredIds.includes(q.id);
                return (
                <g key={q.id}>
                    <path
                    d={getSegmentPath(i)}
                    fill={isAnswered ? '#94a3b8' : colors[i % colors.length]} // Gray if answered
                    stroke="#fff"
                    strokeWidth="0.5"
                    />
                    {/* Text Label - rotated to center of wedge */}
                    <text
                    x="50"
                    y="50"
                    fill="white"
                    fontSize="4"
                    fontWeight="bold"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    transform={`rotate(${(i * anglePerSegment) + (anglePerSegment / 2)}, 50, 50) translate(35, 0)`}
                    >
                    {isAnswered ? '✓' : i + 1}
                    </text>
                </g>
                );
            })}
        </svg>
      </div>

      {/* Spin Button */}
      <button
        onClick={spin}
        disabled={isSpinning || availableQuestions.length === 0}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white border-4 border-slate-800 rounded-full flex items-center justify-center text-slate-800 font-bold shadow-lg z-10 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {availableQuestions.length === 0 ? 'انتهى' : 'دوّر'}
      </button>
    </div>
  );
};

export default Wheel;
