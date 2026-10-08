import { ArrowRight, FlaskConical, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDate, personal } from "../components/personal/PersonalUI";
import { listSimulationResources } from "../services/api";

export default function SimulationResourcesPage() {
  const [version, setVersion] = useState(0);
  const [state, setState] = useState({ status: "loading", items: [] });
  useEffect(() => { let active = true; listSimulationResources().then(response => active && setState({ status: "success", items: Array.isArray(response?.items) ? response.items : [] })).catch(() => active && setState({ status: "error", items: [] })); return () => { active = false; }; }, [version]);
  return <div className={personal.page}>
    <header className="aevric-page-header"><div><p className="capability-label simulation">Simulation Intelligence</p><h1>Strategy Stress Tests</h1><p>Examine how saved Strategies hold up when important conditions change.</p></div></header>
    <div className="mt-8">
      {state.status === "loading" && <div role="status" className="loading-panel"><span className="loading-orbit"/><h2>Loading saved stress tests...</h2></div>}
      {state.status === "error" && <section role="alert" className="state-panel"><h2>Simulations could not be loaded</h2><p>Please try again. Your saved work has not changed.</p><button className="button secondary" onClick={() => { setState({ status: "loading", items: [] }); setVersion(value => value + 1); }}><RotateCw size={16}/>Retry</button></section>}
      {state.status === "success" && state.items.length === 0 && <section className="state-panel empty"><FlaskConical aria-hidden="true"/><h2>No stress tests yet</h2><p>Stress tests help examine how a Strategy holds up under different conditions.</p><Link className="button primary" to="/strategies">Choose a Strategy</Link></section>}
      {state.status === "success" && state.items.length > 0 && <div className="resource-grid">{state.items.map(item => <Link key={item.simulation_public_id} to={`/simulations/${encodeURIComponent(item.simulation_public_id)}`} className="resource-card simulation-card">
        <div className="resource-card-top"><span className="capability-badge simulation">Strategy Stress Test</span><span>Run {item.current_run_number}</span></div><h2>{item.title}</h2><p>Source Strategy <span className="mono-reference">{item.source_strategy_public_id}</span></p>
        <div className="resource-card-footer"><span>Revision {item.source_strategy_revision}</span><span>{formatDate(item.updated_at || item.created_at) || "Date unavailable"}</span><span className="resource-open">Review <ArrowRight size={16}/></span></div>
      </Link>)}</div>}
    </div>
  </div>;
}
