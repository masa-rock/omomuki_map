import { useNavigate, useLocation } from "react-router-dom"
import { AiFillEdit } from 'react-icons/ai'
import { ImAirplane } from 'react-icons/im'
import { FaKey } from 'react-icons/fa'

export const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return(
    <ul className="SidebarList">
      <li 
        className="SidebarRow"
        onClick ={() =>{          
          navigate("/edit-profile")
        }}>
          <AiFillEdit/>
          <span>プロフィール編集</span></li>
      <li 
        className="SidebarRow"
        onClick ={() => {
          navigate("/want_to_go")
        }}
      >
        <ImAirplane/>
        <span>行きたい場所一覧</span></li>
      <li 
        className="SidebarRow"
        onClick ={() => {          
          navigate("/update-password")
        }}
      >
        <FaKey/>
        <span>パスワード変更</span></li>
    </ul>
  )
}
