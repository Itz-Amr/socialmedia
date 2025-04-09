import SideMenu from "../Components/SideMenu";
import styles from "./index.module.css";
import Messages from "../Components/Messages";
import MessagesContent from "../Components/Chat";

export default function Chat() {
  return (
    <div className="col-12 h-100 d-flex">
      <MessagesContent />

      <Messages />

      <SideMenu />
    </div>
  );
}
