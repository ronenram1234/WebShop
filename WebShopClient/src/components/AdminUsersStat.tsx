/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent, useContext, useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";

import { GlobalProps } from "../context/GlobalContext";
import { Select, MenuItem } from "@mui/material";
import { User } from "../interfaces/User";
import { getAllUsersDetail } from "../services/userServices";
import { errorMsg } from "../services/feedbackService";
import ClipLoader from "react-spinners/ClipLoader";

// interface AdinUsersStatProps {}

const AdminUsersStat: FunctionComponent = () => {
  const { token } = useContext(GlobalProps);

  const [selectedValue, setSelectedValue] = useState<string>("12");
  const [selectedValueType, setSelectedValueType] = useState<string>("1");

  const [seriesValue, setSeriesValue] = useState<number[]>([3, 2, 1]);
  const [seriesGroup, setSeriesGroup] = useState<string[]>([]);

  const [usersArray, setUsersArray] = useState<User[]>([]);

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (loading) {
      document.body.classList.add("cursor-loading");
    } else {
      document.body.classList.remove("cursor-loading");
    }
  }, [loading]);

  useEffect(() => {
    setLoading(true);

    getAllUsersDetail(token)
      .then((res) => {
        setUsersArray(res.data);
        setLoading(false);
      })
      .catch((err) => {
        errorMsg(`Transaction Error - ${err.response.data}`);
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    const series: string[] = [];
    const val: number[] = [];
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < Number(selectedValue); i++) {
      let month = currentMonth - i;
      let year = currentYear;
      if (month < 0) {
        month = 12 + month;
        year -= 1;
      }

      const monthYear = new Date(year, month).toLocaleString("en-US", {
        month: "short",
        year: "numeric",
      });

      series.push(monthYear);

      if (usersArray !== null) {
        const userPerMonth = usersArray.reduce((acc, user) => {
          const validUser: boolean =
            selectedValueType === "1" ||
            (selectedValueType === "2" &&
              !user.isAdmin &&
              !user.isRegisterUser) ||
            (selectedValueType === "3" &&
              !user.isAdmin &&
              user.isRegisterUser) ||
            (user.isAdmin && selectedValueType === "4");
          if (validUser) {
            const date = new Date(user.createdAt);

            const createdMonthYear = date.toLocaleString("en-US", {
              month: "short",
              year: "numeric",
            });

            if (createdMonthYear === monthYear) {
              return acc + 1;
            }
          }
          return acc;
        }, 0);

        val.push(userPerMonth);
      }
    }
    setSeriesGroup(series);
    setSeriesValue(val);
  }, [selectedValue, usersArray, selectedValueType]);

  function handleChange(event: any) {
    setSelectedValue(event.target.value as string);
  }
  function handleChangeType(event: any) {
    setSelectedValueType(event.target.value as string);
  }

  return (
    <>
      <p className="h1 text-center fw-bolder">{loading ? "Loading..." : ""}</p>

      {loading ? (
        <div className="spinner-container">
          <ClipLoader loading={loading} size={50} color="#00bcd4" />
        </div>
      ) : (
        <>
          <div className="col col-12">
            <div
              style={{
                textAlign: "center",
                marginBottom: "20px",
                fontSize: "20px",
              }}
            >
              <strong>New Users by Month</strong>
            </div>
            <BarChart
              xAxis={[{ scaleType: "band", data: seriesGroup }]}
              series={[{ data: seriesValue }]}
              width={1000}
              height={300}
            />
            <Select
              value={selectedValue}
              label="Time Range"
              onChange={(e) => handleChange(e)}
            >
              <MenuItem value="3">Last 3 months</MenuItem>
              <MenuItem value="6">Last 6 months</MenuItem>
              <MenuItem value="12">Last 12 months</MenuItem>
              <MenuItem value="24">Last 24 months</MenuItem>
              <MenuItem value="36">Last 36 months</MenuItem>
            </Select>

            <Select
              value={selectedValueType}
              label="Time Range"
              onChange={(e) => handleChangeType(e)}
            >
              <MenuItem value="1">User Type- All</MenuItem>
              <MenuItem value="2">User Type- Users</MenuItem>
              <MenuItem value="3">User Type- Business</MenuItem>
              <MenuItem value="4">User Type- Admin</MenuItem>
            </Select>
          </div>
        </>
      )}
    </>
  );
};

export default AdminUsersStat;
