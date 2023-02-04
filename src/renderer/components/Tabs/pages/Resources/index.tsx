import { BranchesOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  App,
  Breadcrumb,
  Button,
  Col,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Tooltip,
} from "antd";
import i18n from "i18next";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Field from "renderer/components/Field";
import { application, events } from "renderer/services";
import { useStoreActions } from "renderer/store/actions";
import { IResource, ResourcesErrors, ResourcesEvents } from "types";
import { FullSpace } from "../InstanceConfig/styles";
import { Main } from "../sharedStyles";

const Action: FC = () => {
  const { store } = useStoreActions();
  const { t } = useTranslation();

  // Handling the refresh
  const handleRefresh = () => {
    events.emit(ResourcesEvents.REFRESH);
  };

  return (
    <Button
      onClick={handleRefresh}
      type="primary"
      disabled={store.resources.length === 0}
    >
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
  const [loading, setLoading] = useState<boolean>(true);
  const [configuratingFields, setConfiguratingFields] = useState({
    paths: [] as string[],
    command: "",
    active: false,
  });
  const [configurating, setConfigurating] = useState({
    open: false,
    resource: "",
  });

  // Handling resources addition
  const handleAddResources = (resources: IResource[]) => {
    if (resources && store.resources) {
      let discovered = 0;

      // Mapping the received resources
      const replicated = resources.map((row) => {
        const match = store.resources.find((r) => r.name === row.name) || null;
        if (!match) discovered += 1;
        return {
          name: row.name,
          path: store.settings.resourcesFolder
            ? row.path.replace(`${store.settings.resourcesFolder}\\`, "")
            : row.path,
          active: match ? match?.active : true,
          watchOptions: match
            ? match?.watchOptions
            : {
                active: false,
                command: "ensure {{name}}",
                paths: [],
              },
        };
      });

      // Warning new resources
      if (discovered > 0) {
        message.success(t("MESSAGES.NEW_RESOURCES", { count: discovered }));
      }

      // Setting the store
      changeStore({
        resources: replicated,
      });
    }
  };

  // Handling fetch resources
  const handleFetch = async (report?: boolean) => {
    setLoading(true);
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
          message.error(t("ERRORS.RESOURCES.FOLDER_ERROR"));
          break;

        default:
          break;
      }
    }

    setLoading(false);
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

  /* Handling delete */
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
          message.success(t("MESSAGES.RESOURCE_DELETED", { resource }));
        } else {
          message.error(
            t("MESSAGES.UNEXPECTED_ERROR", {
              error: i18n.exists(`ERRORS.${response[1]}`)
                ? t(`ERRORS.${response[1]}`)
                : `(${response[1]})`,
            })
          );
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

  // Handling config
  const handleConfig = (name: string) => {
    if (store.resources) {
      const resource = store.resources.find((r) => r.name === name);
      if (resource) {
        setConfiguratingFields(resource.watchOptions);
        setConfigurating({ open: true, resource: name });
      }
    }
  };

  // handling update config field
  const handleUpdateConfigField = (
    name: keyof typeof configuratingFields,
    value: any
  ) => {
    if (configuratingFields[name] !== null && value !== null) {
      setConfiguratingFields((obj) => ({ ...obj, [name]: value }));
    }
  };

  // Handling reset
  const handleReset = () => {
    setConfiguratingFields({ paths: [], command: "", active: false });
    setConfigurating({ open: false, resource: "" });
  };

  // Handling configuration save
  const handleSaveConfig = () => {
    if (configuratingFields && configurating.resource) {
      const data = store.resources.find(
        (r) => r.name === configurating.resource
      );

      // Changing store
      if (data) {
        const resources = store.resources.filter(
          (r) => r.name !== configurating.resource
        );
        resources.push({ ...data, watchOptions: configuratingFields });
        changeStore({
          resources,
        });
      }

      // Cleaning the fields
      handleReset();
    }
  };

  // Handling refresh listener
  useEffect(() => {
    const refreshListener = events.on(ResourcesEvents.REFRESH, handleFetch);
    return () => {
      events.off(ResourcesEvents.REFRESH, refreshListener);
    };
  }, [store.resources]);

  // Handling resource folder changes
  useEffect(() => {
    handleFetch(); // Initial Fetch
  }, [store.settings.resourcesFolder]);

  return (
    <>
      <Spin size="large" spinning={loading}>
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
              (!loading &&
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
                          <Breadcrumb.Item key={Math.random()}>
                            {r}
                          </Breadcrumb.Item>
                        ))}
                      </Breadcrumb>
                    ),
                    action: (
                      <Space>
                        <Tooltip placement="top" title={t("ACTIONS.DELETE")}>
                          <Button
                            onClick={() => handleDelete(row.name)}
                            icon={<DeleteOutlined />}
                          />
                        </Tooltip>
                        <Tooltip placement="top" title={t("ACTIONS.WATCH")}>
                          <Button
                            disabled={!row.active}
                            onClick={() => handleConfig(row.name)}
                            icon={<BranchesOutlined />}
                          />
                        </Tooltip>
                      </Space>
                    ),
                    active: (
                      <Switch
                        onChange={(e) => handleActive(row.name, e)}
                        checked={row.active}
                      />
                    ),
                  }))) ||
              []
            }
            pagination={false}
            scroll={{ y: "100%" }}
          />
        </Main>
      </Spin>
      {/* Configuration Modal */}
      <Modal
        title={t("DIALOGS.RESOURCE_CONFIG_HEADER", {
          resource: configurating.resource,
        })}
        open={configurating.open}
        onCancel={handleReset}
        onOk={handleSaveConfig}
        okText={t("ACTIONS.SAVE")}
      >
        <FullSpace direction="vertical">
          <Row gutter={[16, 0]}>
            <Col flex="auto">
              <Field
                help={t("HELP.RESOURCES_COMMAND") as string}
                label={t("FIELDS.COMMON.COMMAND")}
                component={
                  <Input
                    value={configuratingFields.command}
                    onInput={(e) =>
                      handleUpdateConfigField("command", e.currentTarget.value)
                    }
                    placeholder={t("PLACEHOLDERS.TYPEHERE") as string}
                  />
                }
              />
            </Col>
            <Col flex="none">
              <Field
                label={t("FIELDS.COMMON.ACTIVE")}
                isSwitch
                component={
                  <Switch
                    checked={configuratingFields.active}
                    onChange={(state) =>
                      handleUpdateConfigField("active", state)
                    }
                  />
                }
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            <Col flex="auto">
              <Field
                help={t("HELP.RESOURCES_PATH(S)") as string}
                label={t("FIELDS.COMMON.PATH(S)")}
                component={
                  <Select
                    mode="tags"
                    open={false}
                    placeholder={t("PLACEHOLDERS.TYPEHERE") as string}
                    value={configuratingFields.paths}
                    onDeselect={(e) =>
                      handleUpdateConfigField(
                        "paths",
                        configuratingFields.paths.filter(
                          (path: string) => path !== e
                        )
                      )
                    }
                    onSelect={(e) =>
                      handleUpdateConfigField("paths", [
                        ...configuratingFields.paths,
                        e,
                      ])
                    }
                  />
                }
              />
            </Col>
          </Row>
        </FullSpace>
      </Modal>
    </>
  );
};

Resources.Action = Action;

export default Resources;
