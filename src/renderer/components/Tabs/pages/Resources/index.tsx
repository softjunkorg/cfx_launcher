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
  const { message } = App.useApp();

  // Handling resources addition
  const handleAddResources = (resources: IResource[]) => {
    if (resources && store.resources) {
      const discovered: IResource[] = [];
      const deleted: string[] = [];

      // Mapping resources
      resources.map((row) => {
        const match = store.resources.find((s) => s.name === row.name);

        if (!match) {
          discovered.push({
            name: row.name,
            path: store.settings.resourcesFolder
              ? row.path.replace(`${store.settings.resourcesFolder}\\`, "")
              : row.path,
            active: true,
          });
          return true;
        }

        return false;
      });

      // Checking discovered
      if (discovered.length > 0) {
        changeStore({
          resources: [...store.resources, ...discovered],
        });
      }

      // Mapping store resources
      store.resources.map((row) => {
        const match = resources.find((s) => s.name === row.name);

        if (!match) {
          deleted.push(row.name);
          return true;
        }

        return false;
      });

      // Checking deleted
      if (deleted.length > 0) {
        changeStore({
          resources: store.resources.filter((r) => !deleted.includes(r.name)),
        });
      }
    }
  };

  // Handling fetch resources
  const handleFetch = async () => {
    const response = await application.request(ResourcesEvents.FETCH);

    // Handling the response
    if (response && response[0]) {
      return handleAddResources(response[1]);
    }

    switch (response[0]) {
      case ResourcesErrors.FOLDER_DOESNT_EXISTS:
        return "Doesnt Exists";
        break;

      case ResourcesErrors.NO_FOLDER_SET:
        return "No folder set";
        break;

      default:
        return "Error not found.";
        break;
    }
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
  };

  // Handling first fetch
  useEffect(() => {
    handleFetch();
    events.on(ResourcesEvents.REFRESH, handleFetch);
  }, []);

  // Handling resource folder changes
  useEffect(() => {
    handleFetch();
  }, [store.settings]);

  return (
    <Main>
      <Table
        sticky
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            width: "20%",
          },
          {
            title: "Path",
            dataIndex: "path",
            width: "30%",
          },
          {
            align: "center",
            title: "Action",
            dataIndex: "action",
            width: "8%",
          },
          {
            align: "center",
            title: "Active",
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
