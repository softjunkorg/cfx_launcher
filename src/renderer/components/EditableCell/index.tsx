import { Checkbox, Input, Form } from "antd";
import { Rule } from "antd/es/form";
import { FC } from "react";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "checkbox" | "text";
  record: any;
  index: number;
  required: boolean;
  children: React.ReactNode;
  customRules: Rule[];
}

const EditableCell: FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  required,
  customRules,
  ...restProps
}) => {
  const inputNode = inputType === "checkbox" ? <Checkbox /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          valuePropName={inputType === "checkbox" ? "checked" : "value"}
          rules={[
            {
              required,
              message: `Please Input ${title}!`,
            },
            ...(customRules || []),
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;
