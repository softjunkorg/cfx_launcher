import { application, events } from "renderer/services";
import { useStoreActions } from "renderer/store/actions";
import { DeleteOutlined } from "@ant-design/icons";
import { IResource, ResourcesErrors, ResourcesEvents } from "types";
import { App, Breadcrumb, Button, Switch, Table, Tooltip } from "antd";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { Main } from "../sharedStyles";

const Action: FC = () => {
  const { t } = useTranslation();

  // Handling the refresh
  const handleRefresh = () => {
    events.emit(ResourcesEvents.REFRESH);
  };

  return (
    <Button onClick={handleRefresh} type="primary">
      {t("ACTIONS.REFRESH")}
    </Button>
  );
};

interface IResourcesExtraActions {
  Action: typeof Action;
}

const Resources: FC & IResourcesExtraActions = () => {
  const { t } = useTranslation();
  const { store, changeStore } = useStoreActions();
  const { message, modal } = App.useApp();

  // Handling resources addition
  const handleAddResources = (resources: IResource[]) => {
    if (resources && store.resources) {
      const replicated = resources.map((row) => {
        const match = store.resources.find((r) => r.name === row.name) || null;
        return {
          name: row.name,
          path: store.settings.resourcesFolder
            ? row.path.replace(`${store.settings.resourcesFolder}\\`, "")
            : row.path,
          active: match ? match?.active : true,
        };
      });

      // Setting the store
      changeStore({
        resources: replicated,
      });
    }
  };

  // Handling fetch resources
  const handleFetch = async (report?: boolean) => {
    const response = await application.request(ResourcesEvents.FETCH);

    // Handling the response
    if (response[0]) {
      handleAddResources(response[1]);
    } else {
      changeStore({
        resources: [],
      });
    }

    // Reporting any errors
    if (report) {
      switch (response[1]) {
        case ResourcesErrors.FOLDER_ERROR:
          message.open({
            type: "error",
            content: t("ERRORS.RESOURCES.FOLDER_ERROR"),
          });
          break;

        default:
          break;
      }
    }

    return true;
  };

  // Handling active change
  const handleActive = (resource: string, state: boolean) => {
    const data = store.resources.find((r) => r.name === resource);
    if (data) {
      const resources = store.resources.filter((r) => r.name !== resource);
      resources.push({ ...data, active: state });
      changeStore({
        resources,
      });
    }
  };

  // Delete
  const handleDelete = async (resource: string) => {
    async function trigger() {
      const data = store.resources.find((r) => r.name === resource);
      if (data) {
        const response = await application.request(
          ResourcesEvents.DELETE,
          resource
        );

        // Handling the response
        if (response && response[0]) {
          message.open({
            type: "success",
            content: t("MESSAGES.RESOURCE_DELETED", { resource }),
          });
        } else {
          message.open({
            type: "error",
            content: t("MESSAGES.UNEXPECTED_ERROR", {
              error: i18n.exists(`ERRORS.${response[1]}`)
                ? t(`ERRORS.${response[1]}`)
                : `(${response[1]})`,
            }),
          });
        }
      }
    }

    // Openning the modal
    modal.confirm({
      title: t("DIALOGS.RESOURCE_DELETE_HEADER"),
      content: t("DIALOGS.RESOURCE_DELETE_BODY", { resource }),
      okText: t("ACTIONS.DELETE"),
      onOk: trigger,
    });
  };

  useEffect(() => {
    const refreshListener = events.on(ResourcesEvents.REFRESH, handleFetch);

    // Cleaning up
    return () => {
      events.off(ResourcesEvents.REFRESH, refreshListener);
    };
  }, [store.resources]);

  // Handling resource folder changes
  useEffect(() => {
    handleFetch(); // Initial Fetch
  }, [store.settings.resourcesFolder]);

  return (
    <Main>
      <Table
        sticky
        columns={[
          {
            title: t("FIELDS.COMMON.NAME"),
            dataIndex: "name",
            width: "20%",
          },
          {
            title: t("FIELDS.COMMON.PATH"),
            dataIndex: "path",
            width: "30%",
          },
          {
            align: "center",
            title: t("FIELDS.COMMON.ACTION"),
            dataIndex: "action",
            width: "8%",
          },
          {
            align: "center",
            title: t("FIELDS.COMMON.ACTIVE"),
            dataIndex: "active",
            width: "8%",
          },
        ]}
        dataSource={
          store.resources &&
          [...store.resources]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((row, i) => ({
              key: i,
              align: "center",
              name: row.name,
              path: (
                <Breadcrumb>
                  {row.path.split("\\").map((r) => (
                    <Breadcrumb.Item key={Math.random()}>{r}</Breadcrumb.Item>
                  ))}
                </Breadcrumb>
              ),
              action: (
                <Tooltip placement="top" title={t("ACTIONS.DELETE")}>
                  <Button
                    onClick={() => handleDelete(row.name)}
                    icon={<DeleteOutlined />}
                  />
                </Tooltip>
              ),
              active: (
                <Switch
                  onChange={(e) => handleActive(row.name, e)}
                  checked={row.active}
                />
              ),
            }))
        }
        pagination={false}
        scroll={{ y: "100%" }}
      />
    </Main>
  );
};

Resources.Action = Action;

export default Resources;
