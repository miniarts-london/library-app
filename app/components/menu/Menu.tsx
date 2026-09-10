import React from "react"
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import CoPresentOutlinedIcon from '@mui/icons-material/CoPresentOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined'
import RadarIcon from '@mui/icons-material/Radar'
import TuneIcon from '@mui/icons-material/Tune'

export const Menu = [
  {
    id:"dashboard",
    icon: <DashboardOutlinedIcon />,
    title: "Dashboard",
    link: "/dashboard",
    items: []
  },
  {
    id: "pupils",
    icon: <GroupOutlinedIcon />,
    title: "Learners",
    link: "/pupils",
    items: []
  },
  {
    id:"classes",
    icon: <CoPresentOutlinedIcon />,
    title: "Classes",
    link: "/classes",
    items: []
  },
  {
    id: "provision",
    icon: <RadarIcon />,
    title: "Provision",
    link: "/provision",
    items: []
  },
  {
    id: "analysis",
    icon: <TimelineOutlinedIcon />,
    title: "Analysis",
    link: "",
    items: [
      {
        id: "analysisDashboard",
        icon: null,
        title: "Analysis dashboard",
        link: "/analysis/analysisDashboard",
        items: []
      },
      {
        id: "support",
        icon: null,
        title: "Learners Receiving Support",
        link: "/analysis/support",
        items: []
      },
      {
        id: "reviews",
        icon: null,
        title: "Reviews Completed",
        link: "/analysis/reviews",
        items: []
      },
       {
        id: "investment",
        icon: null,
        title: "Provisions Investment",
        link: "/analysis/investment",
        items: []
      },
    ]
  },
  {
    id: "admin",
    icon: <TuneIcon />,
    title: "Admin",
    link: "",
    items: [
      {
        id: "employee",
        icon: null,
        title: "Employees",
        link: "/admin/employee",
        items: []
      },
      {
        id: "agency",
        icon: null,
        title: "Agencies",
        link: "/admin/agency",
        items: []
      },
       {
        id: "termDates",
        icon: null,
        title: "Term Dates",
        link: "/admin/termDates",
        items: []
      },
    ]
  },
]


export const MenuProfile = [
  {
    id:"profile",
    icon: <DashboardOutlinedIcon />,
    title: "Profile",
    link: "/profile",
    items: []
  },
]
