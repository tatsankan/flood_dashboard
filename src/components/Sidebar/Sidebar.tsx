import React from "react";
import { useAppStore } from "../../hooks/useAppState";
import { FilterBar } from "./FilterBar";
import { PropertyList } from "./PropertyList";
import { PropertyDetail } from "./PropertyDetail/PropertyDetail";
import { PanelRightClose, PanelRightOpen } from "lucide-react";

export const Sidebar: React.FC = () => {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const selectedPropertyId = useAppStore((s) => s.selectedPropertyId);

  return (
    <>
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        style={{ right: sidebarOpen ? 400 : 0 }}
      >
        {sidebarOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
      </button>
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        {selectedPropertyId ? (
          <PropertyDetail />
        ) : (
          <>
            <FilterBar />
            <PropertyList />
          </>
        )}
      </aside>
    </>
  );
};
