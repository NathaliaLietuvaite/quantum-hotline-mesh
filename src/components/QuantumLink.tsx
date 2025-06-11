
import { cn } from "@/lib/utils";

interface QuantumLinkProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  quality: number;
  active: boolean;
  type: 'background' | 'hotstandby';
  communicationActive?: boolean;
}

export const QuantumLink = ({ from, to, quality, active, type, communicationActive }: QuantumLinkProps) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  const getStrokeColor = () => {
    if (communicationActive) return '#ef4444'; // red for active communication
    if (type === 'hotstandby') return '#10b981'; // green for hot-standby
    if (quality > 0.9) return '#06b6d4'; // cyan for high quality
    if (quality > 0.8) return '#eab308'; // yellow for medium quality
    return '#6b7280'; // gray for low quality
  };

  const getStrokeWidth = () => {
    if (type === 'hotstandby') return 4;
    return 2;
  };

  const getOpacity = () => {
    if (!active) return 0.3;
    if (communicationActive) return 1;
    return quality;
  };

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: from.x,
        top: from.y,
        width: length,
        height: 2,
        transformOrigin: '0 50%',
        transform: `rotate(${angle}deg)`,
      }}
    >
      <div
        className={cn(
          "w-full h-full transition-all duration-300",
          type === 'hotstandby' && "animate-pulse",
          communicationActive && "animate-ping"
        )}
        style={{
          background: `linear-gradient(90deg, ${getStrokeColor()}, transparent, ${getStrokeColor()})`,
          opacity: getOpacity(),
          height: getStrokeWidth(),
        }}
      />
      
      {/* Quality indicator */}
      {type === 'background' && (
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-6 text-xs text-foreground bg-background/80 px-1 rounded"
          style={{ opacity: active ? 1 : 0.5 }}
        >
          {(quality * 100).toFixed(0)}%
        </div>
      )}

      {/* Communication pulse effect */}
      {communicationActive && (
        <div
          className="absolute top-0 left-0 w-4 h-4 bg-red-500 rounded-full opacity-80 animate-pulse"
          style={{
            animation: `move-along-line ${2}s linear infinite`,
          }}
        />
      )}
    </div>
  );
};
