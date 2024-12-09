import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";

export interface TabProperties {
  content: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface TabsProperties {
  tabs: TabProperties[];
  classes?: string;
}

export const Tabs = ({ tabs, classes }: TabsProperties) => {
  if (tabs.length === 0) {
    return null;
  }

  useEffect(() => {
    const activeTab = tabs.find((tab) => tab.isActive);
    if (activeTab) {
      setActiveTab(activeTab);
    }
  }, [tabs]);

  const handleTabClick = (tab: TabProperties) => {
    setActiveTab(tab);
    tabs.forEach((t) => (t.isActive = false));
    tab.isActive = true;
  };

  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div>
      <div className={`flex items-center space-x-2 ${classes}`}>
        {tabs.map((tab, index) => (
          <Fragment key={index}>
            <span
              className={`${
                tab.isActive || activeTab === tab
                  ? "font-semibold text-blue-600"
                  : "text-gray-600 hover:text-blue-500 cursor-pointer"
              }`}
              onClick={() => handleTabClick(tab)}
              role="button"
            >
              {tab.label}
            </span>
            {index < tabs.length - 1 && <span className="text-gray-400">|</span>}
          </Fragment>
        ))}
      </div>
      <div className="mt-4">
        {activeTab?.content}
      </div>
    </div>
  );
};