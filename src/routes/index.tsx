import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Choose";
import OfflineRoom from "../pages/OffilineRoom";
import OnlineRoom from "../pages/OnlineRoom";

export const routes = {
  home: "/escolher",
  offlineRoom: "/",
  onlineRoom: "/online/:room_id",
};

export default function MainRoutes() {
  return (
    <Routes>
      <Route path={routes.onlineRoom} element={<OnlineRoom />} />
      <Route path={routes.home} element={<Home />} />
      <Route path={routes.offlineRoom} element={<OfflineRoom />} />
    </Routes>
  );
}
