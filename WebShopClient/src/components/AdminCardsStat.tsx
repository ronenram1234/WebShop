import { FunctionComponent, useContext, useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
// import { GlobalProps } from "../App";
import { GlobalProps } from "../context/GlobalContext";

import { Select, MenuItem } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { Likes, PieLikes } from "../interfaces/Card";

// interface AdimCardsStatProps {}

const AdimCardsStat: FunctionComponent = () => {
  const { cardArray } = useContext(GlobalProps);

  const [pie, setPie] = useState<PieLikes[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("3");

  const [seriesValue, setSeriesValue] = useState<number[]>([3, 2, 1]);
  const [seriesGroup, setSeriesGroup] = useState<string[]>([]);

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
      if (cardArray !== null) {
        const cardPerMonth = cardArray.reduce((acc, card) => {
          const date = new Date(card.createdAt);
          const createdMonthYear = date.toLocaleString("en-US", {
            month: "short",
            year: "numeric",
          });

          if (createdMonthYear === monthYear) {
            return acc + 1;
          }
          return acc;
        }, 0);

        val.push(cardPerMonth);
      }
    }

    setSeriesGroup(series);
    setSeriesValue(val);
  }, [selectedValue, cardArray]);

  useEffect(() => {
    const likesCount: Likes[] = [{ label: 0, count: 0 }];
    const likesCountString: PieLikes[] = [];

    cardArray !== null &&
      cardArray.forEach((card) => {
        if (Array.isArray(card.likes) && card.likes.length !== undefined) {
          const found = likesCount.find(
            (like) => like.label === (card.likes ? card.likes.length : 0)
          );

          if (found) {
            found.count++;
          } else {
            likesCount.push({ label: card.likes.length, count: 1 });
          }
        }
      });

    likesCount.sort((a: Likes, b: Likes) => a.label - b.label);

    likesCount.forEach((likes) => {
      likesCountString.push({
        label: likes.label.toString(),
        value: likes.count,
      });
    });

    setPie(likesCountString);
  }, [cardArray]);

  function handleChange(event: any) {
    setSelectedValue(event.target.value as string);
  }

  return (
    <>
      <div className="col col-6">
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "20px",
          }}
        >
          <strong>Tickets Grouped by Likes Count</strong>
        </div>
        <PieChart
          series={[
            {
              data: pie,
              highlightScope: { fade: "global", highlight: "item" },
              faded: {
                innerRadius: 30,
                additionalRadius: -30,
                color: "gray",
              },
            },
          ]}
          height={200}
        />
      </div>

      <div className="col col-6">
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "20px",
          }}
        >
          <strong>New Cards by Month</strong>
        </div>
        <BarChart
          xAxis={[{ scaleType: "band", data: seriesGroup }]}
          series={[{ data: seriesValue }]}
          width={500}
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
      </div>
    </>
  );
};

export default AdimCardsStat;
