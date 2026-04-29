import "./StatCard.css";
import { Card } from "./Card";

export function StatCard({ title, value, helper, icon }) {
  return (
    <Card className="stat-card">
      <div className="stat-card-content">
        <div className="stat-card-text">
          <p className="stat-card-title">{title}</p>
          <h3 className="stat-card-value">{value}</h3>
          {helper && <p className="stat-card-helper">{helper}</p>}
        </div>

        {icon && <div className="stat-card-icon">{icon}</div>}
      </div>
    </Card>
  );
}