import "./ChartCard.css";
import { Card } from "./Card";

export function ChartCard({ title, subtitle, headerAction, children }) {
  return (
    <Card className="chart-card">
      <div className="chart-card-header">
        <div>
          <h3 className="chart-card-title">{title}</h3>
          {subtitle && <p className="chart-card-subtitle">{subtitle}</p>}
        </div>

        {headerAction && (
          <div className="chart-card-header-action">
            {headerAction}
          </div>
        )}
      </div>

      <div className="chart-card-body">{children}</div>
    </Card>
  );
}