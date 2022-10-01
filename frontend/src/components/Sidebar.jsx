import { useLocation } from "react-router-dom";
import { AiFillEdit } from 'react-icons/ai';
import { ImAirplane } from 'react-icons/im';

export const Sidebar = () => {
  const location = useLocation();
  return(
    <ul className="SidebarList">
      <li 
        className="SidebarRow"
        onClick ={() =>{
          window.location.pathname = "/edit-profile"
        }}>
          <AiFillEdit/>
          <span>プロフィール編集</span></li>
      <li 
        className="SidebarRow"
        onClick ={() => {
          window.location.pathname = "/want_to_go"
        }}
      >
        <ImAirplane/>
        <span>行きたい場所一覧</span></li>
    </ul>
  )
}
