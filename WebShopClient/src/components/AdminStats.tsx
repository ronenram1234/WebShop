import { FunctionComponent } from "react";

import AdminCardsStat from "./AdminCardsStat";
import AdminUsersStat from "./AdminUsersStat";

interface AdminStatsProps {}

const AdminStats: FunctionComponent<AdminStatsProps> = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          <AdminCardsStat />
        </div>
        <div className="row">
          <AdminUsersStat />
        </div>
      </div>
    </>
  );
};

export default AdminStats;
