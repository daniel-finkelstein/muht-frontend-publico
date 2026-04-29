import "./Card.css";

export function Card({ children, className = "" }) {
  return <section className={`card ${className}`}>{children}</section>;
}