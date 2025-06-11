
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { NetworkNode } from "./NetworkNode";
import { QuantumLink } from "./QuantumLink";
import { ControlPanel } from "./ControlPanel";
import { ConnectionPool } from "./ConnectionPool";
import { Play, Pause, RotateCcw, Zap } from "lucide-react";

interface NetworkState {
  nodes: {
    id: string;
    name: string;
    type: 'planet' | 'repeater';
    position: { x: number; y: number };
    active: boolean;
    poolSize: number;
    maxPool: number;
  }[];
  links: {
    id: string;
    from: string;
    to: string;
    quality: number;
    active: boolean;
    type: 'background' | 'hotstandby';
  }[];
  isRunning: boolean;
  communicationActive: boolean;
  lastMessage: string;
  messageCount: number;
}

export const PQMSSimulator = () => {
  const [networkState, setNetworkState] = useState<NetworkState>({
    nodes: [
      { id: 'earth', name: 'Erde', type: 'planet', position: { x: 100, y: 300 }, active: true, poolSize: 8, maxPool: 10 },
      { id: 'mars', name: 'Mars', type: 'planet', position: { x: 700, y: 200 }, active: true, poolSize: 6, maxPool: 10 },
      { id: 'moon', name: 'Mond', type: 'repeater', position: { x: 200, y: 150 }, active: true, poolSize: 4, maxPool: 6 },
      { id: 'sat1', name: 'Satellit 1', type: 'repeater', position: { x: 400, y: 100 }, active: true, poolSize: 3, maxPool: 6 },
      { id: 'sat2', name: 'Satellit 2', type: 'repeater', position: { x: 550, y: 350 }, active: true, poolSize: 5, maxPool: 6 },
    ],
    links: [
      { id: 'earth-moon', from: 'earth', to: 'moon', quality: 0.95, active: true, type: 'background' },
      { id: 'moon-sat1', from: 'moon', to: 'sat1', quality: 0.92, active: true, type: 'background' },
      { id: 'sat1-mars', from: 'sat1', to: 'mars', quality: 0.88, active: true, type: 'background' },
      { id: 'earth-sat2', from: 'earth', to: 'sat2', quality: 0.91, active: true, type: 'background' },
      { id: 'sat2-mars', from: 'sat2', to: 'mars', quality: 0.89, active: true, type: 'background' },
      { id: 'earth-mars-hotstandby', from: 'earth', to: 'mars', quality: 0.97, active: true, type: 'hotstandby' },
    ],
    isRunning: true,
    communicationActive: false,
    lastMessage: '',
    messageCount: 0,
  });

  // Simulation der kontinuierlichen Verschränkungsverteilung
  useEffect(() => {
    if (!networkState.isRunning) return;

    const interval = setInterval(() => {
      setNetworkState(prev => {
        const newState = { ...prev };
        
        // Aktualisiere Link-Qualitäten (Dekohärenz-Simulation)
        newState.links = prev.links.map(link => ({
          ...link,
          quality: Math.max(0.7, link.quality - Math.random() * 0.01 + Math.random() * 0.02)
        }));

        // Regeneriere schwache Links
        newState.links = newState.links.map(link => {
          if (link.quality < 0.8) {
            return { ...link, quality: 0.95 + Math.random() * 0.05 };
          }
          return link;
        });

        // Aktualisiere Pool-Größen
        newState.nodes = prev.nodes.map(node => {
          const poolChange = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          return {
            ...node,
            poolSize: Math.max(0, Math.min(node.maxPool, node.poolSize + poolChange))
          };
        });

        return newState;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [networkState.isRunning]);

  const sendMessage = () => {
    setNetworkState(prev => ({
      ...prev,
      communicationActive: true,
      lastMessage: `Quantensignal #${prev.messageCount + 1}`,
      messageCount: prev.messageCount + 1,
    }));

    // Reduziere Pool-Größe bei Nutzung
    setTimeout(() => {
      setNetworkState(prev => ({
        ...prev,
        communicationActive: false,
        nodes: prev.nodes.map(node => 
          node.id === 'earth' ? { ...node, poolSize: Math.max(0, node.poolSize - 1) } : node
        )
      }));
    }, 2000);
  };

  const toggleSimulation = () => {
    setNetworkState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetSimulation = () => {
    setNetworkState(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => ({ ...node, poolSize: node.maxPool })),
      links: prev.links.map(link => ({ ...link, quality: 0.95 })),
      messageCount: 0,
      lastMessage: '',
      communicationActive: false,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" />
            Systemsteuerung
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <Button 
              onClick={toggleSimulation}
              variant={networkState.isRunning ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {networkState.isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {networkState.isRunning ? 'Pausieren' : 'Starten'}
            </Button>
            
            <Button onClick={resetSimulation} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>

            <Button 
              onClick={sendMessage} 
              disabled={!networkState.isRunning || networkState.nodes.find(n => n.id === 'earth')?.poolSize === 0}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
            >
              Quantensignal senden
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm">Status:</span>
              <Badge variant={networkState.isRunning ? "default" : "secondary"}>
                {networkState.isRunning ? 'AKTIV' : 'PAUSIERT'}
              </Badge>
            </div>

            {networkState.lastMessage && (
              <div className="text-sm text-muted-foreground">
                Letztes Signal: {networkState.lastMessage}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Network Visualization */}
      <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
        <CardHeader>
          <CardTitle>Netzwerk-Topologie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg overflow-hidden">
            {/* Background stars */}
            <div className="absolute inset-0">
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-30"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>

            {/* Quantum Links */}
            {networkState.links.map(link => {
              const fromNode = networkState.nodes.find(n => n.id === link.from);
              const toNode = networkState.nodes.find(n => n.id === link.to);
              if (!fromNode || !toNode) return null;

              return (
                <QuantumLink
                  key={link.id}
                  from={fromNode.position}
                  to={toNode.position}
                  quality={link.quality}
                  active={link.active && networkState.isRunning}
                  type={link.type}
                  communicationActive={networkState.communicationActive && link.type === 'hotstandby'}
                />
              );
            })}

            {/* Network Nodes */}
            {networkState.nodes.map(node => (
              <NetworkNode
                key={node.id}
                node={node}
                active={node.active && networkState.isRunning}
                communicationActive={networkState.communicationActive && (node.id === 'earth' || node.id === 'mars')}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connection Pools */}
      <div className="grid md:grid-cols-2 gap-6">
        <ConnectionPool
          title="Erde - Verbindungspool"
          node={networkState.nodes.find(n => n.id === 'earth')!}
          isRunning={networkState.isRunning}
        />
        <ConnectionPool
          title="Mars - Verbindungspool"
          node={networkState.nodes.find(n => n.id === 'mars')!}
          isRunning={networkState.isRunning}
        />
      </div>

      {/* System Statistics */}
      <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
        <CardHeader>
          <CardTitle>System-Statistiken</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-2">Durchschnittliche Link-Qualität</h4>
              <Progress 
                value={networkState.links.reduce((acc, link) => acc + link.quality, 0) / networkState.links.length * 100} 
                className="h-2"
              />
              <span className="text-sm text-muted-foreground">
                {((networkState.links.reduce((acc, link) => acc + link.quality, 0) / networkState.links.length) * 100).toFixed(1)}%
              </span>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Gesendete Nachrichten</h4>
              <div className="text-2xl font-bold text-primary">{networkState.messageCount}</div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Verfügbare Hot-Standby Links</h4>
              <div className="text-2xl font-bold text-green-400">
                {networkState.nodes.reduce((acc, node) => acc + node.poolSize, 0)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
