import { Notification, NotificationConstructorOptions } from "electron";

function create(options: NotificationConstructorOptions) {
  if (renderWindow && !renderWindow.isFocused()) {
    const notify = new Notification(options);
    notify.show();
  }
}

export { create };
