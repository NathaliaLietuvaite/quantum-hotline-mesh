
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NetworkNodeProps {
  node: {
    id: string;
    name: string;
    type: 'planet' | 'repeater';
    position: { x: number; y: number };
    poolSize: number;
    maxPool: number;
  };
  active: boolean;
  communicationActive: boolean;
}

export const NetworkNode = ({ node, active, communicationActive }: NetworkNodeProps) => {
  const isPlanet = node.type === 'planet';
  const size = isPlanet ? 'w-16 h-16' : 'w-12 h-12';
  
  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: node.position.x, top: node.position.y }}
    >
      {/* Node Circle */}
      <div
        className={cn(
          size,
          "rounded-full border-2 flex items-center justify-center transition-all duration-300",
          isPlanet ? "bg-gradient-to-br from-blue-500 to-purple-600" : "bg-gradient-to-br from-yellow-400 to-orange-500",
          active ? "border-cyan-400 shadow-lg shadow-cyan-400/50" : "border-gray-600",
          communicationActive && "animate-pulse shadow-xl shadow-red-500/70 border-red-400"
        )}
      >
        {isPlanet && (
          <div className="text-xs font-bold text-white text-center">
            {node.name === 'Erde' ? '🌍' : '🔴'}
          </div>
        )}
        {!isPlanet && (
          <div className="text-xs text-white">📡</div>
        )}
      </div>

      {/* Node Label */}
      <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-sm font-medium text-foreground">{node.name}</div>
        {isPlanet && (
          <Badge variant="secondary" className="text-xs mt-1">
            Pool: {node.poolSize}/{node.maxPool}
          </Badge>
        )}
      </div>

      {/* Activity Indicator */}
      {active && (
        <div className="absolute -inset-2 rounded-full border border-cyan-400/30 animate-ping" />
      )}
    </div>
  );
};
