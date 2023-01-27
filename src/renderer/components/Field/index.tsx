import { FC, ReactNode } from "react";
import { Fields, Label, Main } from "./styles";

interface IMultipleProps {
  children: ReactNode;
}

const Multiple: FC<IMultipleProps> = (props) => {
  const { children } = props;
  return <Fields>{children}</Fields>;
};

interface IFieldProps {
  component: ReactNode;
  direction?: "row" | "column";
  label: string;
}

interface IFieldSubComponents {
  Multiple: typeof Multiple;
}

const Field: FC<IFieldProps> & IFieldSubComponents = (props) => {
  const { component, label, direction = "column" }: IFieldProps = props;
  return (
    <Main direction={direction}>
      <Label>{label}</Label>
      {component}
    </Main>
  );
};

Field.Multiple = Multiple;

export default Field;
