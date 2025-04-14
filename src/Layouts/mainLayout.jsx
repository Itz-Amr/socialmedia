import Header from "../Components/Header";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="col-12 h-100">
      <Header />
      <Outlet />
    </div>
  );
}
