import { useRecoilState } from "recoil";
import { application } from "renderer/services";
import { StoreEvents } from "types";
import merge from "deepmerge";
import { storeData } from "../state";

export default function useStoreActions() {
  const [store, setStore] = useRecoilState(storeData);

  // Syncying the store
  const syncStore = async () => {
    const request = await application.request(StoreEvents.FETCH);
    if (request) setStore(request);
  };

  // Chaning the store
  const changeStore = (object: object) => {
    const data = merge(store, object, {
      arrayMerge: (_, sourceArray) => sourceArray,
    });

    setStore(data);
    return application.request(StoreEvents.UPDATE, data);
  };

  return { store, setStore, changeStore, syncStore };
}
