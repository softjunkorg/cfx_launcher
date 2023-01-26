/* eslint-disable no-nested-ternary */
import { ReactNode, FC, useEffect } from "react";
import {
  Collapse,
  Col,
  Row,
  Input,
  Select,
  InputNumber,
  Upload,
  App,
} from "antd";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import Field from "renderer/components/Field";
import CountrySelect from "renderer/components/CountrySelect";
import merge from "deepmerge";
import baseConfig from "config";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useLoadingFields } from "renderer/hooks";
import {
  RcFile,
  UploadChangeParam,
  UploadFile,
} from "antd/es/upload/interface";
import { resizeImage } from "renderer/utils";
import { Panel, FullSpace, UploadContainer, UploadImage } from "./styles";

type PanelConfigReplicated = { [x: string]: any };

interface IPanelConfig {
  key: string;
  name: string;
  isWrapper?: boolean;
  useChildren:
    | ReactNode
    | ((
        t: TFunction<"translation", undefined, "translation">,
        replicated: PanelConfigReplicated,
        setReplicated: (value: PanelConfigReplicated) => void
      ) => ReactNode)
    | IPanelConfig[];
}

interface IPanelConfigProps {
  config: IPanelConfig[];
  replicated: PanelConfigReplicated;
  onReplicated: (value: PanelConfigReplicated) => void;
}

const PanelConfig: FC<IPanelConfigProps> = (props) => {
  const { config, replicated, onReplicated } = props;
  const { t } = useTranslation();

  // Handling the replication
  const handleReplicate = (value: PanelConfigReplicated) => {
    if (value && replicated) {
      return onReplicated(
        merge(replicated, value, {
          arrayMerge: (_, sourceArray) => sourceArray,
        })
      );
    }

    return false;
  };

  return (
    <Collapse bordered={false} style={{ background: "transparent" }}>
      {config.map((panel) => (
        <Panel key={panel.key} header={t(panel.name)}>
          {panel.isWrapper ? (
            <PanelConfig
              config={panel.useChildren as IPanelConfig[]}
              replicated={replicated}
              onReplicated={onReplicated}
            />
          ) : typeof panel.useChildren === "function" ? (
            panel.useChildren(t, replicated, handleReplicate)
          ) : (
            (panel.useChildren as ReactNode)
          )}
        </Panel>
      ))}
    </Collapse>
  );
};

const defaultConfiguration: IPanelConfig[] = [
  {
    key: "project",
    name: "PANELS.PROJECT.NAME",
    useChildren: (t, replicated, setReplicated) => {
      const { message } = App.useApp();
      const [loading, setLoading] = useLoadingFields({ icon: false });

      // Default upload content
      const uploadContent = (
        <div>
          {loading.icon ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 4 }}>{t("ACTIONS.UPLOAD")}</div>
        </div>
      );

      // Get base64 for image upload
      const getBase64 = (img: RcFile, callback: (url: string) => void) => {
        const reader = new FileReader();

        // On reader load
        reader.addEventListener("load", () =>
          callback(reader.result as string)
        );

        reader.readAsDataURL(img);
      };

      // Handling before the upload
      const handleBeforeUpload = (file: RcFile) => {
        // Runtime Check
        if (
          file.type !== "image/jpeg" &&
          file.type !== "image/png" &&
          file.type !== "image/gif"
        ) {
          message.open({
            type: "error",
            content: t("ERRORS.UPLOAD.IMAGE_EXTENSION"),
          });
          return false;
        }
        if (!(file.size / 1024 / 1024 < 10)) {
          message.open({
            type: "error",
            content: t("ERRORS.UPLOAD.SIZE_UPLOAD"),
          });
          return false;
        }

        return true;
      };

      // Handling the upload
      const handleUpload = async (
        info: UploadChangeParam<UploadFile>,
        field: string
      ) => {
        // Once status is uploading
        if (info.file.status === "uploading") {
          setLoading(field, true);
          return;
        }

        // Once status is done
        if (info.file.status === "done") {
          // Finishing with base64 decryption
          getBase64(info.file.originFileObj as RcFile, (url) => {
            setLoading(field, false);
            setReplicated({ [field]: url });
          });
        }
      };

      return (
        <FullSpace direction="vertical" size="middle">
          {/* Project Name */}
          <Row>
            <Col span={24}>
              <Field
                label={t("PANELS.PROJECT.TAGS.NAME")}
                component={
                  <Input
                    placeholder={t("PLACEHOLDERS.TYPEHERE") as string}
                    value={replicated.sv_projectName}
                    onInput={(e) =>
                      setReplicated({ sv_projectName: e.currentTarget.value })
                    }
                  />
                }
              />
            </Col>
          </Row>
          {/* Project Description */}
          <Row>
            <Col span={24}>
              <Field
                label={t("PANELS.PROJECT.TAGS.DESCRIPTION")}
                component={
                  <Input.TextArea
                    placeholder={t("PLACEHOLDERS.TYPEHERE") as string}
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    value={replicated.sv_projectDesc}
                    onInput={(e) =>
                      setReplicated({ sv_projectDesc: e.currentTarget.value })
                    }
                  />
                }
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            {/* Project Locale */}
            <Col span={8}>
              <Field
                label={t("PANELS.PROJECT.TAGS.LOCALE")}
                component={
                  <CountrySelect
                    showSearch
                    placeholder={t("PLACEHOLDERS.SELECTHERE") as string}
                    onChange={(e) => setReplicated({ locale: e })}
                    value={replicated.locale}
                  />
                }
              />
            </Col>
            {/* Project TAGS */}
            <Col span={16}>
              <Field
                label={t("PANELS.PROJECT.TAGS.TAGS")}
                component={
                  <Select
                    mode="tags"
                    open={false}
                    placeholder={t("PLACEHOLDERS.TYPEHERE") as string}
                    value={replicated.tags}
                    onDeselect={(e) =>
                      setReplicated({
                        tags: replicated.tags.filter(
                          (tag: string) => tag !== e
                        ),
                      })
                    }
                    onSelect={(e) =>
                      setReplicated({
                        tags: [...replicated.tags, e],
                      })
                    }
                  />
                }
              />
            </Col>
          </Row>
          <Row gutter={[16, 0]}>
            {/* Project Icon */}
            <Col flex="124px">
              <Field
                label={t("PANELS.PROJECT.TAGS.ICON")}
                component={
                  <Upload.Dragger
                    openFileDialogOnClick
                    listType="picture-card"
                    height={108}
                    showUploadList={false}
                    customRequest={({ onSuccess }) => {
                      if (onSuccess) onSuccess("ok");
                    }}
                    beforeUpload={handleBeforeUpload}
                    onChange={(data) => handleUpload(data, "load_server_icon")}
                  >
                    {replicated.load_server_icon ? (
                      <UploadContainer>
                        <UploadImage src={replicated.load_server_icon} />
                      </UploadContainer>
                    ) : (
                      uploadContent
                    )}
                  </Upload.Dragger>
                }
              />
            </Col>
            {/* Project Banner Detail */}
            <Col flex="auto">
              <Row gutter={[0, 16]}>
                <Col span={24}>
                  <Field
                    label={t("PANELS.PROJECT.TAGS.BANNER_DETAIL")}
                    component={
                      <Input
                        placeholder={t("PLACEHOLDERS.TYPEHERE") as string}
                        value={replicated.banner_detail}
                        onInput={(e) =>
                          setReplicated({
                            banner_detail: e.currentTarget.value,
                          })
                        }
                      />
                    }
                  />
                </Col>
                <Col span={24}>
                  <Field
                    label={t("PANELS.PROJECT.TAGS.BANNER_CONNECTING")}
                    component={
                      <Input
                        placeholder={t("PLACEHOLDERS.TYPEHERE") as string}
                        value={replicated.banner_connecting}
                        onInput={(e) =>
                          setReplicated({
                            banner_connecting: e.currentTarget.value,
                          })
                        }
                      />
                    }
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </FullSpace>
      );
    },
  },
  {
    key: "server",
    name: "PANELS.SERVER",
    isWrapper: true,
    useChildren: [
      {
        key: "server_properties",
        name: "PANELS.SERVER_PROPERTIES.NAME",
        useChildren: (t, replicated, setReplicated) => {
          // Listening to gamename changes
          useEffect(() => {
            if (replicated.gamename) {
              setReplicated({
                sv_enforceGameBuild:
                  baseConfig.game.builds[
                    replicated.gamename as keyof typeof baseConfig.game.builds
                  ][0],
              });
            }
          }, [replicated.gamename]);

          return (
            <FullSpace direction="vertical" size="middle">
              {/* Properties Hostname */}
              <Row>
                <Col span={24}>
                  <Field
                    label={t("PANELS.SERVER_PROPERTIES.TAGS.HOSTNAME")}
                    component={
                      <Input
                        placeholder={t("PLACEHOLDERS.TYPEHERE") as string}
                        value={replicated.sv_hostname}
                        onInput={(e) =>
                          setReplicated({
                            sv_hostname: e.currentTarget.value,
                          })
                        }
                      />
                    }
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]}>
                {/* Properties GameName */}
                <Col span={12}>
                  <Field
                    label={t("PANELS.SERVER_PROPERTIES.TAGS.GAMENAME")}
                    component={
                      <Select
                        placeholder={t("PLACEHOLDERS.SELECTHERE") as string}
                        value={replicated.gamename}
                        options={baseConfig.game.names.map((game) => ({
                          label: game.name,
                          value: game.value,
                        }))}
                        onChange={(e) =>
                          setReplicated({
                            gamename: e,
                          })
                        }
                      />
                    }
                  />
                </Col>
                {/* Properties GameBuild */}
                <Col span={12}>
                  <Field
                    label={t("PANELS.SERVER_PROPERTIES.TAGS.GAMEBUILD")}
                    component={
                      <Select
                        placeholder={t("PLACEHOLDERS.SELECTHERE") as string}
                        value={replicated.sv_enforceGameBuild}
                        options={
                          replicated.gamename &&
                          baseConfig.game.builds[
                            replicated.gamename as keyof typeof baseConfig.game.builds
                          ].map((build, index) => ({
                            label:
                              index === 0
                                ? `${build} (${t("BUILDS.LATEST")})`
                                : build,
                            value: build,
                          }))
                        }
                        onChange={(e) =>
                          setReplicated({
                            sv_enforceGameBuild: e,
                          })
                        }
                      />
                    }
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]}>
                {/* Properties Private */}
                <Col span={8}>
                  <Field
                    label={t("PANELS.SERVER_PROPERTIES.TAGS.PRIVATE")}
                    component={
                      <Select
                        placeholder={t("PLACEHOLDERS.SELECTHERE") as string}
                        value={replicated.sv_master1}
                        options={[
                          {
                            label: t("BOOLEAN.TRUE"),
                            value: "1",
                          },
                          {
                            label: t("BOOLEAN.FALSE"),
                            value: false,
                          },
                        ]}
                        onChange={(e) =>
                          setReplicated({
                            sv_master1: e,
                          })
                        }
                      />
                    }
                  />
                </Col>
                {/* Properties OneSync */}
                <Col span={8}>
                  <Field
                    label={t("PANELS.SERVER_PROPERTIES.TAGS.ONESYNC")}
                    component={
                      <Select
                        placeholder={t("PLACEHOLDERS.SELECTHERE") as string}
                        value={replicated.onesync}
                        options={[
                          {
                            label: t("MODE.ON"),
                            value: "on",
                          },
                          {
                            label: t("MODE.OFF"),
                            value: "off",
                          },
                          {
                            label: "Legacy",
                            value: "legacy",
                          },
                        ]}
                        onChange={(e) =>
                          setReplicated({
                            onesync: e,
                          })
                        }
                      />
                    }
                  />
                </Col>
                {/* Properties ScriptHook */}
                <Col span={8}>
                  <Field
                    label={t("PANELS.SERVER_PROPERTIES.TAGS.SCRIPT_HOOK")}
                    component={
                      <Select
                        placeholder={t("PLACEHOLDERS.SELECTHERE") as string}
                        value={replicated.sv_scriptHookAllowed}
                        options={[
                          {
                            label: t("BOOLEAN.TRUE"),
                            value: 1,
                          },
                          {
                            label: t("BOOLEAN.FALSE"),
                            value: 0,
                          },
                        ]}
                        onChange={(e) =>
                          setReplicated({
                            sv_scriptHookAllowed: e,
                          })
                        }
                      />
                    }
                  />
                </Col>
              </Row>
            </FullSpace>
          );
        },
      },
      {
        key: "server_connection",
        name: "PANELS.SERVER_CONNECTION.NAME",
        useChildren: (t, replicated, setReplicated) => {
          return (
            <FullSpace direction="vertical" size="middle">
              <Row gutter={[16, 0]}>
                {/* Connection TCP Endpoint */}
                <Col span={12}>
                  <Field
                    label={t("PANELS.SERVER_CONNECTION.TAGS.TCP_ENDPOINT")}
                    component={
                      <Input
                        placeholder={t("PLACEHOLDERS.TYPEHERE") as string}
                        value={replicated.endpoint_add_tcp}
                        onInput={(e) =>
                          setReplicated({
                            endpoint_add_tcp: e.currentTarget.value.replaceAll(
                              /[A-Za-z]/g,
                              ""
                            ),
                          })
                        }
                      />
                    }
                  />
                </Col>
                {/* Connection UDP Endpoint */}
                <Col span={12}>
                  <Field
                    label={t("PANELS.SERVER_CONNECTION.TAGS.UDP_ENDPOINT")}
                    component={
                      <Input
                        placeholder={t("PLACEHOLDERS.TYPEHERE") as string}
                        value={replicated.endpoint_add_udp}
                        onInput={(e) =>
                          setReplicated({
                            endpoint_add_udp: e.currentTarget.value.replaceAll(
                              /[A-Za-z]/g,
                              ""
                            ),
                          })
                        }
                      />
                    }
                  />
                </Col>
              </Row>
              <Row gutter={[16, 0]}>
                {/* Connection Max Clients */}
                <Col span={8}>
                  <Field
                    label={t("PANELS.SERVER_CONNECTION.TAGS.MAX_CLIENTS")}
                    component={
                      <InputNumber
                        style={{ width: "100%" }}
                        value={replicated.sv_maxClients}
                        onChange={(e) =>
                          setReplicated({
                            sv_maxClients: e,
                          })
                        }
                      />
                    }
                  />
                </Col>
                {/* Connection Pure Level */}
                <Col span={8}>
                  <Field
                    label={t("PANELS.SERVER_CONNECTION.TAGS.PURE_LEVEL")}
                    component={
                      <Select
                        placeholder={t("PLACEHOLDERS.SELECTHERE") as string}
                        value={replicated.sv_pureLevel}
                        options={[
                          {
                            label: 1,
                            value: 1,
                          },
                          {
                            label: 2,
                            value: 2,
                          },
                          {
                            label: t("MODE.DISABLED"),
                            value: false,
                          },
                        ]}
                        onChange={(e) =>
                          setReplicated({
                            sv_pureLevel: e,
                          })
                        }
                      />
                    }
                  />
                </Col>
                {/* Connection Endpoint Privacy */}
                <Col span={8}>
                  <Field
                    label={t("PANELS.SERVER_CONNECTION.TAGS.ENDPOINT_PRIVACY")}
                    component={
                      <Select
                        placeholder={t("PLACEHOLDERS.SELECTHERE") as string}
                        value={replicated.sv_endpointPrivacy}
                        options={[
                          {
                            label: t("BOOLEAN.TRUE"),
                            value: true,
                          },
                          {
                            label: t("BOOLEAN.FALSE"),
                            value: false,
                          },
                        ]}
                        onChange={(e) =>
                          setReplicated({
                            sv_endpointPrivacy: e,
                          })
                        }
                      />
                    }
                  />
                </Col>
              </Row>
            </FullSpace>
          );
        },
      },
      {
        key: "server_secrets",
        name: "PANELS.SERVER_SECRET.NAME",
        useChildren: (t, replicated, setReplicated) => {
          return (
            <FullSpace direction="vertical" size="middle">
              {/* Secret Steam API Key */}
              <Row>
                <Col span={24}>
                  <Field
                    label={t("PANELS.SERVER_SECRET.TAGS.STEAM_API_KEY")}
                    component={
                      <Input
                        placeholder={t("PLACEHOLDERS.TYPEHERE") as string}
                        value={replicated.steam_webApiKey}
                        onInput={(e) =>
                          setReplicated({
                            steam_webApiKey: e.currentTarget.value,
                          })
                        }
                      />
                    }
                  />
                </Col>
              </Row>
              {/* Secret Liscense Key */}
              <Row>
                <Col span={24}>
                  <Field
                    label={t("PANELS.SERVER_SECRET.TAGS.LICENSE_KEY")}
                    component={
                      <Input
                        placeholder={t("PLACEHOLDERS.TYPEHERE") as string}
                        value={replicated.sv_licenseKey}
                        onInput={(e) =>
                          setReplicated({
                            sv_licenseKey: e.currentTarget.value,
                          })
                        }
                      />
                    }
                  />
                </Col>
              </Row>
            </FullSpace>
          );
        },
      },
    ],
  },
];

export default PanelConfig;
export { defaultConfiguration };
