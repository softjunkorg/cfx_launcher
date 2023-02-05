import config from "config";
import { Button, Input } from "antd";
import merge from "deepmerge";
import { isEqual } from "lodash";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CountrySelect from "renderer/components/CountrySelect";
import Field from "renderer/components/Field";
import { useInstanceStatus, useLoadingFields } from "renderer/hooks";
import { application, events } from "renderer/services";
import { useStoreActions } from "renderer/store/actions";
import { SettingsEvents } from "types";
import { Main } from "../sharedStyles";
import { Side } from "./styles";

const Action: FC = () => {
  const { t } = useTranslation();
  const { changeStore } = useStoreActions();
  const [disabled, setDisabled] = useState<boolean>(true);
  const [replicated, setReplicated] = useState(null);

  // Handling the save
  const handleSave = () => {
    changeStore({ settings: replicated });
  };

  // Listen to settings updates
  useEffect(() => {
    events.on(SettingsEvents.SAVE_DATA, (shared: any, data: any) => {
      if (shared !== undefined) {
        setDisabled(isEqual(data, shared));
        setReplicated(data);
      }
    });
  }, []);

  return (
    <Button disabled={disabled} onClick={handleSave} type="primary">
      {t("ACTIONS.SAVE")}
    </Button>
  );
};

interface ISettingsExtraActions {
  Action: typeof Action;
}

const Settings: FC & ISettingsExtraActions = () => {
  const { t } = useTranslation();
  const { store } = useStoreActions();
  const { isStarting, isRunning } = useInstanceStatus();
  const [replicated, setReplicated] = useState<any>(store.settings);
  const [loading, setLoading] = useLoadingFields({
    artifactsFolder: false,
    resourcesFolder: false,
  });

  // Handling the replication
  const handleReplicate = (value: any) => {
    if (value && replicated) {
      return setReplicated(
        merge(replicated, value, {
          arrayMerge: (_: any, sourceArray: any) => sourceArray,
        })
      );
    }

    return false;
  };

  // Handling the artifacts folder
  const handleFindArtifactsFolder = async () => {
    setLoading("artifactsFolder", true);

    // Request the application for folder
    const result = await application.request(
      SettingsEvents.FIND_ARTIFACTS_FOLDER
    );

    // Validating the result
    if (result !== null) {
      setLoading("artifactsFolder", false);

      if (result.length > 0 && result !== replicated.artifactsFolder)
        handleReplicate({
          artifactsFolder: result,
        });
    }
  };

  // Handling the resources folder
  const handleFindResourcesFolder = async () => {
    setLoading("resourcesFolder", true);

    // Request the application for folder
    const result = await application.request(
      SettingsEvents.FIND_RESOURCES_FOLDER
    );

    // Validating the result
    if (result !== null) {
      setLoading("resourcesFolder", false);

      if (result.length > 0 && result !== replicated.resourcesFolder)
        handleReplicate({
          resourcesFolder: result,
        });
    }
  };

  // Handling instance arguments
  const handleInstanceArguments = async (e: any) => {
    const { value } = e.currentTarget;
    handleReplicate({
      instanceArguments: value,
    });
  };

  // Listen to replicated settings changes
  useEffect(() => {
    events.emit(SettingsEvents.SAVE_DATA, store.settings, replicated);
  }, [replicated]);

  // Listen to shared store update
  useEffect(() => {
    if (store.settings !== replicated) {
      setReplicated(store.settings);
    }
  }, [store.settings]);

  // Create custom labels
  const handleLanguageLabels = () => {
    const labels: { [x: string]: string } = {};

    // Mapping the configured languages
    config.languages.map((c) => {
      labels[c.split("-")[1]] = t(`LANGUAGES.${c}.UNIVERSAL_NAME`);
      return c;
    });

    return labels;
  };

  return (
    <Main direction="row">
      <Side>
        <Field.Multiple>
          {/* Artifacts Folder */}
          <Field
            label={t("FIELDS.SETTINGS.ARTIFACTS_FOLDER")}
            component={
              <Input.Search
                allowClear
                placeholder={t("PLACEHOLDERS.SELECTHERE") as string}
                loading={loading.artifactsFolder}
                value={replicated.artifactsFolder}
                enterButton={t("ACTIONS.BROWSE")}
                onSearch={handleFindArtifactsFolder}
                disabled={isStarting || isRunning}
              />
            }
          />
          {/* Resources Folder */}
          <Field
            label={t("FIELDS.SETTINGS.RESOURCES_FOLDER")}
            component={
              <Input.Search
                allowClear
                placeholder={t("PLACEHOLDERS.SELECTHERE") as string}
                loading={loading.resourcesFolder}
                value={replicated.resourcesFolder}
                enterButton={t("ACTIONS.BROWSE")}
                onSearch={handleFindResourcesFolder}
                disabled={isStarting || isRunning}
              />
            }
          />
          {/* Instance Arguments */}
          <Field
            label={t("FIELDS.SETTINGS.INSTANCE_ARGUMENTS")}
            component={
              <Input
                allowClear
                placeholder={t("PLACEHOLDERS.TYPEHERE") as string}
                value={replicated.instanceArguments}
                onInput={handleInstanceArguments}
                disabled={isStarting || isRunning}
              />
            }
          />
        </Field.Multiple>
      </Side>
      <Side>
        <Field.Multiple>
          {/* Language */}
          <Field
            label={t("FIELDS.SETTINGS.LANGUAGE")}
            component={
              <CountrySelect
                placeholder={t("PLACEHOLDERS.SELECTHERE") as string}
                countries={config.languages.map((c) => c.split("-")[1])}
                labels={handleLanguageLabels()}
                value={replicated.language}
                onChange={(e) => handleReplicate({ language: e })}
              />
            }
          />
          {/* Theme Color */}
          <Field
            label={t("FIELDS.SETTINGS.THEME_COLOR")}
            component={
              <CountrySelect
                placeholder={t("PLACEHOLDERS.SELECTHERE") as string}
                countries={config.languages.map((c) => c.split("-")[1])}
                labels={handleLanguageLabels()}
                value={replicated.language}
                onChange={(e) => handleReplicate({ language: e })}
              />
            }
          />
        </Field.Multiple>
      </Side>
    </Main>
  );
};

Settings.Action = Action;

export default Settings;
