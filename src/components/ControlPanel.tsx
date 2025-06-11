
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Settings, Activity, Zap } from "lucide-react";

interface ControlPanelProps {
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  onSendMessage: () => void;
  canSendMessage: boolean;
}

export const ControlPanel = ({ isRunning, onToggle, onReset, onSendMessage, canSendMessage }: ControlPanelProps) => {
  return (
    <Card className="bg-card/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          PQMS Kontrolle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={onToggle}
            variant={isRunning ? "destructive" : "default"}
            className="flex-1"
          >
            <Activity className="h-4 w-4 mr-2" />
            {isRunning ? 'Stop' : 'Start'}
          </Button>
          
          <Button onClick={onReset} variant="outline" className="flex-1">
            Reset
          </Button>
        </div>

        <Button 
          onClick={onSendMessage}
          disabled={!canSendMessage}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
        >
          <Zap className="h-4 w-4 mr-2" />
          Quantensignal Senden
        </Button>

        <div className="text-sm text-muted-foreground">
          Das System arbeitet proaktiv im Hintergrund und hält verschränkte Verbindungen bereit.
        </div>
      </CardContent>
    </Card>
  );
};
