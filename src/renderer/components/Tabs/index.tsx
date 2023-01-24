import { FC, ReactNode, useState } from "react";
import { Tabs as NativeTabs } from "antd";
import { useTranslation } from "react-i18next";
import { Terminal, Settings, InstanceConfig, Resources } from "./pages";

const Actions = {
  terminal: "",
  resources: <Resources.Action />,
  instanceConfig: <InstanceConfig.Action />,
  settings: <Settings.Action />,
};

const Tabs: FC = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState<string>("terminal");
  const [action, setAction] = useState<ReactNode>();

  // Handling tab change
  const handleTabChange = (key: string) => {
    setActive(key);
    setAction(Actions[key as keyof typeof Actions]);
  };

  return (
    <NativeTabs
      size="large"
      activeKey={active}
      onChange={handleTabChange}
      tabBarExtraContent={{ right: action }}
      items={[
        {
          key: "terminal",
          label: t("TABS.TERMINAL"),
          children: <Terminal />,
        },
        {
          key: "resources",
          label: t("TABS.RESOURCES"),
          children: <Resources />,
        },
        {
          key: "instanceConfig",
          label: t("TABS.INSTANCE_CONFIG"),
          children: <InstanceConfig />,
        },
        {
          key: "settings",
          label: t("TABS.SETTINGS"),
          children: <Settings />,
        },
      ]}
    />
  );
};

export default Tabs;
