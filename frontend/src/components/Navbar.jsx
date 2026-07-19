import React from "react";
import { ConnectButton } from "thirdweb/react";
import { client } from "../client";
import { Hexagon, LayoutDashboard, Settings } from "lucide-react";
import "./Navbar.css";

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Hexagon className="logo-icon" size={32} />
        <span className="logo-text">Nexus</span>
      </div>
      <div className="navbar-links">
        <a href="#dashboard" className="nav-link">
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </a>
        <a href="#settings" className="nav-link">
          <Settings size={18} />
          <span>Settings</span>
        </a>
      </div>
      <div className="navbar-connect">
        <ConnectButton
          client={client}
          appMetadata={{
            name: "Nexus",
            url: "https://example.com",
          }}
        />
      </div>
    </nav>
  );
}
