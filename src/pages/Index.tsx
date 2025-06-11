
import { PQMSSimulator } from "@/components/PQMSSimulator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-foreground">
      <div className="container mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Proaktives Quanten-Mesh System
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
            Interplanetare Quantenkommunikation ohne Verbindungsaufbau-Latenz
          </p>
        </div>
        <PQMSSimulator />
      </div>
    </div>
  );
};

export default Index;
