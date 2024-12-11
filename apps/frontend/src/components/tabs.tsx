import { useEffect, useState } from "react";
import { Fragment } from "react/jsx-runtime";

export interface TabProperties {
  content: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  ytbLink?: string;
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
      {/* Youtube iframe */}
      {activeTab?.ytbLink && (
        <div className="mt-4">
          <iframe
            width="100%"
            height="250px"
            src={`https://www.youtube-nocookie.com/embed/${activeTab.ytbLink}?mute=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
            allowFullScreen
          ></iframe>
        </div>
      )}
      {/* Content */}
      <div className="mt-4 text-black">
        {activeTab?.content}
      </div>
    </div>
  );
};