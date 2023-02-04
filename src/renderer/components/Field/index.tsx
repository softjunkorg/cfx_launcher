import { QuestionOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { FC, ReactNode } from "react";
import { Fields, Help, Label, Main } from "./styles";

interface IMultipleProps {
  children: ReactNode;
}

const Multiple: FC<IMultipleProps> = (props) => {
  const { children } = props;
  return <Fields>{children}</Fields>;
};

interface IFieldProps {
  component: ReactNode;
  help?: string;
  direction?: "row" | "column";
  isSwitch?: boolean;
  label: string;
}

interface IFieldSubComponents {
  Multiple: typeof Multiple;
}

const Field: FC<IFieldProps> & IFieldSubComponents = (props) => {
  const {
    component,
    label,
    help,
    isSwitch,
    direction = "column",
  }: IFieldProps = props;
  return (
    <Main direction={direction} isSwitch={isSwitch}>
      <Label>
        {label}
        {help && (
          <Tooltip
            placement="right"
            // eslint-disable-next-line react/no-danger
            title={<span dangerouslySetInnerHTML={{ __html: help }} />}
          >
            <Help>
              <QuestionOutlined />
            </Help>
          </Tooltip>
        )}
      </Label>
      {isSwitch ? <div>{component}</div> : component}
    </Main>
  );
};

Field.Multiple = Multiple;

export default Field;
