import { useRoutes } from "react-router-dom";
import Login from "../Components/View/Authentication/Login";
import CRM from "../Components/View/CRM/CRM";
import CRMReports from "../Components/View/CRM/CRMReports";
import React from "react";
import BillEntry from "../Components/View/CRM/Bills/BillEntry";
import Booking from "../Components/View/CRM/OT/Booking";

export default function Routing() {
  let elements = useRoutes([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "crm",
      element: <CRM />,
    },
    {
      path: "reports",
      element: <CRMReports />,
    },
    {
      path: "billentry",
      element: <BillEntry />,
    },
    {
      path: "otbooking",
      element: <Booking />,
    },
  ]);

  return elements;
}
