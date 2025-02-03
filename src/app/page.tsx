import styles from "./page.module.css";
import TradingPlanForm from "@/components/TradingPlanForm/page";

export default function Home() {
  return (
    <div className={styles.page}>
      <TradingPlanForm />
    </div>
  );
}
