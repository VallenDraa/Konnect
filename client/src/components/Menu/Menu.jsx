import { Fragment, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ModalContext } from "../../context/modal/modalContext";
import { UserContext } from "../../context/user/userContext";
import { MessageLogsContext } from "../../context/messageLogs/MessageLogsContext";
import { MyProfileModalContent } from "../Modal/Content/MyProfileModalContent/MyProfileModalContent";
import { OthersProfileModalContent } from "../Modal/Content/OthersProfileModalContent/OthersProfileModalContent";
import NotifBadge from "../NotifBadge/NotifBadge";
import MODAL_ACTIONS from "../../context/modal/modalActions";
import RenderIf from "../../utils/React/RenderIf";
import { NotifContext } from "../../context/notifContext/NotifContext";
import { SettingsContext } from "../../context/settingsContext/SettingsContext";

export const Menu = ({
  menus,
  activeMenuState,
  urlHistory,
  isMenuNavigateWithBtn,
}) => {
  const { activeMenu, setActiveMenu } = activeMenuState;
  const location = useLocation();
  const { modalDispatch } = useContext(ModalContext);
  const { userState } = useContext(UserContext);
  const { notifs, notifUnseen } = useContext(NotifContext);
  const { msgUnread } = useContext(MessageLogsContext);
  const { settings } = useContext(SettingsContext);
  const { general } = settings;

  // check if the pathname is heading for a user profile
  useEffect(() => {
    const { pathname, search } = location;
    if (pathname.includes("/user")) {
      const usernamePath = pathname.split("/")[2];
      // check if the target user is the current logged in user
      if (usernamePath !== userState.user.username) {
        modalDispatch({
          type: MODAL_ACTIONS.show,
          prevUrl: urlHistory?.current,
          onExitReturnToHome: false,
          content: <OthersProfileModalContent username={usernamePath} />,
          title: `${usernamePath}'s Profile`,
        });
      } else {
        modalDispatch({
          type: MODAL_ACTIONS.show,
          prevUrl: urlHistory?.current,
          onExitReturnToHome: false,
          content: <MyProfileModalContent />,
          title: "Settings",
        });
      }
    }
  }, [location]);

  // to change the active menu according to the current URL path
  useEffect(() => {
    const newActiveMenu = location.pathname.split("/")[1];

    // check if the new active menu is valid
    const isValid = menus.some(({ name }) => name === newActiveMenu);

    if (!isValid) return;
    if (newActiveMenu !== activeMenu) {
      setActiveMenu(newActiveMenu || "chats");
    }
  }, [location]);

  const NotifBadgeSwitcher = ({ menuName }) => {
    switch (menuName) {
      case "chats":
        if (msgUnread) {
          return (
            <NotifBadge
              isActive={
                msgUnread.total !== 0 && typeof msgUnread.total === "number"
              }
            >
              {msgUnread.total <= 99 ? msgUnread.total : "99+"}
            </NotifBadge>
          );
        }
        return;
      case "contacts":
        return;
      case "search":
        return;
      case "notifications":
        if (notifUnseen) {
          return (
            <NotifBadge
              isActive={
                notifUnseen.total !== 0 && typeof notifUnseen.total === "number"
              }
            >
              {notifUnseen.total <= 99 ? notifUnseen.total : "99+"}
            </NotifBadge>
          );
        }
      default:
        break;
    }
  };

  const linkSwitcher = (menuName) => {
    if (menuName === "notifications") {
      return "/notifications?box=inbox";
    } else {
      return `/${menuName}`;
    }
  };

  return (
    <ul className="flex justify-evenly gap-x-2 divide-gray-300">
      {menus.map((menu, i) => {
        return (
          <Fragment key={i}>
            <li
              onClick={() => {
                setActiveMenu(menu.name);
                isMenuNavigateWithBtn.current = true;
              }}
              className={`basis-1/4 text-xxs w-full p-1 rounded-lg  cursor-pointer
              ${
                activeMenu === menu.name
                  ? "text-blue-400"
                  : "text-gray-500 hover:text-blue-400"
              }
              ${general?.animation ? "duration-200" : ""}`}
            >
              <Link
                to={`${linkSwitcher(menu.name)}`}
                className="cursor-pointer flex flex-col items-center gap-1 relative w-full h-full"
              >
                <RenderIf conditionIs={activeMenu !== menu.name}>
                  <menu.icon className="text-2xl" />
                </RenderIf>
                <RenderIf conditionIs={activeMenu === menu.name}>
                  <menu.activeIcon className="text-2xl" />
                </RenderIf>

                <NotifBadgeSwitcher menuName={menu.name} />

                <span className="capitalize text-xxs">{menu.name}</span>
              </Link>
            </li>

            <RenderIf conditionIs={i !== menus.length - 1}>
              <li
                style={{
                  margin: "4px 0",
                  border: "0.2px solid rgb(229 231 235)",
                }}
              />
            </RenderIf>
          </Fragment>
        );
      })}
    </ul>
  );
};
