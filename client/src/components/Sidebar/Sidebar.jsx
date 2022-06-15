import { useState, useEffect, useRef, useContext } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { ChatList } from '../ChatList/ChatList';
import { ContactList } from '../ContactList/ContactList';
import { Menu } from '../Menu/Menu';
import { ModalContext } from '../../context/Modal/modalContext';
import { MyProfileModalContent } from '../Modal/Content/MyProfileModalContent/MyProfileModalContent';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/User/userContext';
import MODAL_ACTIONS from '../../context/Modal/modalActions';
import CTA from '../CTA/CTA';
import Pill from '../Buttons/Pill';
import USER_ACTIONS from '../../context/User/userAction';
import socket from '../../utils/socketClient/socketClient';
import RenderIf from '../../utils/RenderIf';
import SearchList from '../SearchList/SearchList';
import MENUS from '../Menu/MenuList/MenuList';
import SIDEBAR_APPEARANCE from './SidebarAppearance/SidebarAppearance';

export const Sidebar = ({ setActiveChat, sidebarState }) => {
  const Navigate = useNavigate();
  const { isSidebarOn, setIsSidebarOn } = sidebarState;
  const [activeMenu, setActiveMenu] = useState(MENUS[0].name);
  const { modalDispatch } = useContext(ModalContext);
  const sidebar = useRef();
  const { userState, userDispatch } = useContext(UserContext);

  const handleLogout = () => {
    socket.emit('logout', userState.user._id, (success, message) => {
      if (success) {
        userDispatch({ type: USER_ACTIONS.logout });
        sessionStorage.removeItem('token');
        Navigate('/login');
      } else {
        alert(message);
      }
    });
  };

  // for handling close and open through button press
  useEffect(() => {
    if (!sidebar.current) return;

    if (isSidebarOn) {
      sidebar.current.className = SIDEBAR_APPEARANCE.OPEN;

      // disable body scrolling if window size is less than 1024
      if (window.innerWidth <= 1024) {
        document.body.style.overflowY = 'hidden';
      }
    } else {
      sidebar.current.className = SIDEBAR_APPEARANCE.CLOSED;
      document.body.style.overflowY = 'auto';

      // remove slide out animation if window size is larger than 1024
      if (window.innerWidth >= 1024) {
        sidebar.current.classList.remove('animate-sidebar-out');
      }
    }
  }, [isSidebarOn]);

  // for handling close and open through screen size
  useEffect(() => {
    const closeSidebar = () => {
      if (window.innerWidth >= 1024) {
        isSidebarOn && setIsSidebarOn(false);
      }
    };

    window.addEventListener('resize', () => closeSidebar());

    return () => window.removeEventListener('resize', () => closeSidebar());
  }, [setIsSidebarOn, isSidebarOn]);

  return (
    <aside ref={sidebar}>
      <header className="border-b-2 pb-2 space-y-5 basis-1/6 ">
        {/* profile and more menu */}
        <div className="flex justify-between items-center gap-2">
          {/* profile  */}
          <Link
            to={`user/${userState.user.username}`}
            onClick={() =>
              modalDispatch({
                type: MODAL_ACTIONS.show,
                onExitReturnToHome: true,
                pathname: `/user/${userState.user.username}`,
                content: <MyProfileModalContent />,
              })
            }
            className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 w-full p-2 duration-200 rounded-full"
          >
            <img
              src="https://picsum.photos/200/200"
              alt=""
              className="rounded-full h-8 w-8"
            />
            <div className="flex flex-col items-start">
              <span className="text-xs max-w-[200px] truncate">VallenDra</span>
              <span className="text-xxs text-gray-500 relative z-10 max-w-[200px] truncate">
                Status
              </span>
            </div>
          </Link>
          <Pill
            onClick={handleLogout}
            className="max-w-[100px] hover:bg-pink-400 hover:text-white"
          >
            <BiLogOut />
            <span>Log Out</span>
          </Pill>
        </div>
        {/* menus */}
        <Menu menus={MENUS} activeMenuState={{ activeMenu, setActiveMenu }} />
        {/* cta */}
        <CTA />
      </header>
      <main className="px-1 basis-5/6 overflow-y-auto overflow-x-auto">
        <RenderIf conditionIs={activeMenu === 'chats'}>
          <ChatList
            setActiveChat={setActiveChat}
            setIsSidebarOn={setIsSidebarOn}
          />
        </RenderIf>
        <RenderIf conditionIs={activeMenu === 'contacts'}>
          <ContactList
            setActiveChat={setActiveChat}
            setIsSidebarOn={setIsSidebarOn}
          />
        </RenderIf>
        <RenderIf conditionIs={activeMenu === 'search'}>
          <SearchList />
        </RenderIf>
      </main>
    </aside>
  );
};
