import { FC, ReactNode } from "react";
import { Select, SelectProps } from "antd";
import CountryCodes from "country-codes-list";
import { Wrapper, Flag, Text } from "./styles";

interface IContrySelectProps extends SelectProps {
  countries?: string[];
  labels?: { [x: string]: ReactNode };
}

const CountrySelect: FC<IContrySelectProps> = (props) => {
  const { countries = [], labels = {} } = props;
  return (
    <Select
      filterOption={(input, option) =>
        (option?.name ?? "").toLowerCase().includes(input.toLowerCase())
      }
      {...props}
    >
      {CountryCodes.all()
        .filter((c) =>
          countries.length > 0 ? countries.includes(c.countryCode) : true
        )
        .map((c) => (
          <Select.Option
            key={`${c.officialLanguageCode}-${c.countryCode}`}
            name={c.countryNameLocal}
          >
            <Wrapper>
              <Flag>
                <img
                  alt={c.countryNameLocal}
                  src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${c.countryCode}.svg`}
                />
              </Flag>
              <Text>
                {labels[c.countryCode]
                  ? labels[c.countryCode]
                  : c.countryNameLocal}
              </Text>
            </Wrapper>
          </Select.Option>
        ))}
    </Select>
  );
};

CountrySelect.defaultProps = {
  countries: [],
  labels: {},
};

export default CountrySelect;
