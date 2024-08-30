import { headers } from "next/headers";
// import PricingChart from '../client/PricingChart';
// import Modified from '../client/Modified';
import Invoice from "../client/Invoice";

const fetchApi = async () => {
  const head = headers();
  const hostname = head.get("x-hostname");
  const res = await fetch(`${hostname}/api/stripe`);
  const data = await res.json();
  let coupons = await fetch(`${hostname}/api/coupon`);
  coupons = await coupons.json();

  return [data, coupons];
};

const Dashboard = async () => {
  const [data, coupons] = await fetchApi();
  const { packages, suits } = data;

  return (
    <Invoice packages={packages} suits={suits} coupons={coupons} /> // <PricingChart packages={packages} suits={suits} /> // <Modified packages={packages} suits={suits} />
  );
};

export default Dashboard;
