import { FC, useEffect } from "react";
import { useStoreActions } from "renderer/store/actions";
import { application } from "renderer/services";
import { StoreEvents } from "types";

const StoreWrapper: FC = () => {
  const { setStore, syncStore } = useStoreActions();

  // Listening to store updates, and first fetch
  useEffect(() => {
    syncStore();
    application.listen(StoreEvents.DID_UPDATE, (event, store) => {
      setStore(store);
    });
  }, []);

  return <></>;
};

export default StoreWrapper;
