import { useNavigate } from 'react-router-dom'
import { TextField } from "@mui/material"
import { useState, useContext, useMemo } from "react"
import Button from '@material-ui/core/Button'
import axios from 'axios'
import { AuthContext } from "../App"
import { Sidebar } from './modules/Sidebar'

export const EditProfile = () =>{
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const { currentUser, setCurrentUser } = useContext(AuthContext)

  const currentUserUpdate = useMemo(() => {
    if(currentUser){
      setEmail(currentUser.email)
      setName(currentUser.name)
    }
  },[currentUser])

  const generateParams = () =>{
    const updateParams = {
      email: email,
      name: name
    }
    return updateParams
  }

  const handleSignInSubmit = async (e) => {
    e.preventDefault()
    const params = generateParams()    
    axios.patch(`http://0.0.0.0:3001/api/v1/users/${currentUser.id}`, {params: currentUser, data: params})
    .then(resp => {
      setCurrentUser(resp.data.current_user)
      navigate(``, {state: {flash_message: "プロフィールの更新に成功しました", response: "success"}} )
    }).catch(e => {
      console.log(e.response)
      navigate(``, {state: {flash_message: "プロフィールの更新に失敗しました", response: "error"}} )
    })
  }

  return(
    <div className = 'mypage-container'>
      <div className = 'sidebar-container'>
        <Sidebar/>
      </div>
      <div className = "mypage-main-container">
        <p>編集ページ</p>
        <form>
          <TextField 
            type = "email"
            id = "update-email"
            label = "メールアドレス"
            name = "email"
            value = {email}
            fullWidth
            variant = "standard"
            onChange = {(e) => setEmail(e.target.value)}
            margin = "normal"
          />
          <TextField
            type = "text"
            id = "update-name"
            label = "アカウント名"
            name = "name"
            value = {name}
            fullWidth
            variant = "standard"
            onChange = {(e) => setName(e.target.value)}
            margin = "normal"
          />
          <Button type = "submit" variant = "contained" color = "primary" onClick = {(e) => handleSignInSubmit(e)}>
            更新
          </Button>
      </form>
      </div>
    </div>
  )
}
