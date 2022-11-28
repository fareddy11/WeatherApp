import React, { useState, useEffect, useMemo } from "react";

import sunriseAndSunsetData from "./sunrise-sunset.json";

// Step 1：載入emotion的styled套件
import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";
import WeatherCard from "./WeatherCard";
import WeatherSetting from "./WeatherSetting";
import useWeatherApi from "./useWeatherApi";

// STEP 2：定義帶有 styled 的 component
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282"
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc"
  }
};

const getMoment = (locationName) => {
  // 從日落日出時間中找出符合的地區
  const location = sunriseAndSunsetData.find(
    (data) => data.locationName === locationName
  );

  // 找不到回傳null
  if (!location) return null;

  // 取得當前時間
  const now = new Date();

  // 將當前時間以"2019-10-18"的時間格式呈現
  const nowDate = Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    minute: "2-digit"
  })
    .format(now)
    .replace(/\//g, "-");

  // 從該地區找對應的日期
  const locationDate =
    location.time && location.time.find((time) => time.dataTime === nowDate);

  // 將日出日落以及當前時間轉成時間戳記(TimeStamp)
  const sunriseTimeStamp = new Date(
    `${locationDate.DataTime}${locationDate.sunrise}`
  ).getTime();
  const sunsetTimeStamp = new Date(
    `${locationDate.DataTime}${locationDate.sunrise}`
  ).getTime();
  const nowTimeStamp = now.getTime();

  return sunriseTimeStamp <= nowTimeStamp && nowTimeStamp <= sunsetTimeStamp
    ? "day"
    : "night";
};

// STEP 3：把上面定義好的 styled-component 當成元件使用
const WeatherApp = () => {
  console.log("invoke function component");

  const [currentTheme, setCurrentTheme] = useState("light");

  const [weatherElement, fetchData] = useWeatherApi();

  const { locationName, isLoading } = weatherElement;

  const [currentPage, setCurrentPage] = useState("WeatherCard");

  const moment = useMemo(() => getMoment(locationName), [locationName]);

  useEffect(() => {
    setCurrentTheme(moment === "day" ? "light" : "dark");
  }, [moment]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {console.log("render, isLoding:", isLoading)}
        {currentPage === "WeatherCard" && (
          <WeatherCard
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            setCurrentPage={setCurrentPage}
          />
        )}
        {currentPage === "WeatherSetting" && (
          <WeatherSetting setCurrentPage={setCurrentPage} />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default WeatherApp;
