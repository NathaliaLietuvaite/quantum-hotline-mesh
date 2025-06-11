
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ConnectionPoolProps {
  title: string;
  node: {
    id: string;
    name: string;
    poolSize: number;
    maxPool: number;
  };
  isRunning: boolean;
}

export const ConnectionPool = ({ title, node, isRunning }: ConnectionPoolProps) => {
  const poolPercentage = (node.poolSize / node.maxPool) * 100;
  
  const getPoolStatus = () => {
    if (poolPercentage >= 80) return { color: "text-green-400", status: "OPTIMAL" };
    if (poolPercentage >= 50) return { color: "text-yellow-400", status: "MEDIUM" };
    return { color: "text-red-400", status: "NIEDRIG" };
  };

  const { color, status } = getPoolStatus();

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Hot-Standby Verbindungen</span>
            <Badge variant="outline" className={cn(color)}>
              {status}
            </Badge>
          </div>
          
          <Progress value={poolPercentage} className="h-3" />
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{node.poolSize} / {node.maxPool} verfügbar</span>
            <span>{poolPercentage.toFixed(0)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 mt-4">
          {Array.from({ length: node.maxPool }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-8 rounded border-2 flex items-center justify-center text-xs transition-all duration-300",
                i < node.poolSize 
                  ? "bg-gradient-to-b from-green-400 to-green-600 border-green-300 text-white" 
                  : "bg-slate-700 border-slate-600 text-slate-400",
                isRunning && i < node.poolSize && "animate-pulse"
              )}
            >
              {i < node.poolSize ? "🔗" : "∅"}
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
          <strong>Funktionsweise:</strong> Diese verschränkten Quantenlinks werden kontinuierlich 
          im Hintergrund erzeugt und stehen für sofortige Kommunikation bereit.
        </div>
      </CardContent>
    </Card>
  );
};
