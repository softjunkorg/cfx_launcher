import { Input, Popover } from "antd";
import { FC, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useTranslation } from "react-i18next";
import { Indicator } from "./styles";

interface IColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: FC<IColorPickerProps> = (props) => {
  const { t } = useTranslation();
  const [error, setError] = useState<boolean>(false);
  const { color, onChange } = props;

  /* Handling change */
  const handleChange = (value: string) => {
    if (color !== value) {
      if (error) setError(false);
      onChange(value);
    }
  };

  /* Handling the color validation */
  const handleValidation = () => {
    if (!/^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/g.test(color.toUpperCase())) {
      setError(true);
    }
  };

  return (
    <Popover
      content={<HexColorPicker color={color} onChange={handleChange} />}
      trigger="click"
      placement="topLeft"
    >
      <Input
        prefix={<Indicator color={color} />}
        placeholder={t("PLACEHOLDERS.SELECTHERE") as string}
        value={color}
        onChange={(e) => handleChange(e.currentTarget.value)}
        onBlur={handleValidation}
        status={error ? "error" : undefined}
      />
    </Popover>
  );
};

export default ColorPicker;
