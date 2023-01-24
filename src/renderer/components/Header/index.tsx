import { FC, ReactNode, useState, useEffect } from "react";
import { TbX, TbMaximize, TbMinimize, TbMinus } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { application } from "renderer/services";
import { WindowEvents } from "types";
import { Action, Actions, Main, Title } from "./styles";

interface IActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLDivElement> {
  icon: ReactNode;
  display?: "close" | "default";
}

const ActionButton: FC<IActionButtonProps> = (props) => {
  const { icon, display = "default", ...rest } = props;
  return (
    <Action display={display} {...rest}>
      {icon}
    </Action>
  );
};

ActionButton.defaultProps = {
  display: "default",
};

const Header: FC = () => {
  const { t } = useTranslation();
  const [maximized, setMaximized] = useState<boolean>(false);

  // Handling the maximization or restore
  const handleMaximizeOrRestore = () => {
    if (maximized) {
      application.request(WindowEvents.RESTORE);
    } else {
      application.request(WindowEvents.MAXIMIZE);
    }
  };

  // Handling the minimization
  const handleMinimize = () => {
    application.request(WindowEvents.MINIMIZE);
  };

  // Handling the close
  const handleClose = () => {
    application.request(WindowEvents.CLOSE);
  };

  // Listening to window change maximized
  useEffect(() => {
    application.listen(WindowEvents.MAXIMIZED, (event, status: boolean) => {
      setMaximized(status);
      return status;
    });
  }, []);

  return (
    <Main>
      <Title>{t("HEADER.TITLE")}</Title>
      <Actions>
        <ActionButton onClick={handleMinimize} icon={<TbMinus />} />
        <ActionButton
          onClick={handleMaximizeOrRestore}
          icon={maximized ? <TbMinimize /> : <TbMaximize />}
        />
        <ActionButton onClick={handleClose} display="close" icon={<TbX />} />
      </Actions>
    </Main>
  );
};

export default Header;
