import Cookies from "js-cookie"
import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signUp } from "../apis/auth"
import { AuthContext } from "../App"
import Button from '@material-ui/core/Button'
import { Paper, TextField, Typography } from "@mui/material"
import styled from 'styled-components'
import { MediaQueryContext } from './Provider/MediaQueryProvider'

export const SignUp = () => {
  const navigate = useNavigate()
  const {setIsSignedIn, setCurrentUser} = useContext(AuthContext)
  const {isMobileSite, isTabletSite, isPcSite} = useContext(MediaQueryContext)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")

  const generateParams = () => {
    const signUpParams = {
      name: name,
      email: email,
      password: password,
      passwordConfirmation: passwordConfirmation,
    }
    return signUpParams
  }

  const handleSignUpSubmit = async (e) => {
    e.preventDefault()
    const params = generateParams()
    try {
      const res = await signUp(params)
      if (res.status === 200){
        Cookies.set("_access_token", res.headers["access-token"])
        Cookies.set("_client", res.headers["client"])
        Cookies.set("_uid", res.headers["uid"])
        setIsSignedIn(true)
        setCurrentUser(res.data.data)
        navigate("/")
      }
    }catch(e) {
      console.log(e)
    }
  }

  return (
    <>
      {isPcSite && (
        <Paper
          sx = {{
            p: "100px",
            width: "400px",
            m: "0 auto"
          }}
        >
          <Typography variant = {"h5"} sx = {{ m: "30px" }}>
            アカウントを作成する
          </Typography>
          <form>
            <TextField
              type = "text"
              id = "name"
              label = "アカウント名"
              name = "name"
              value = {name}
              fullWidth
              variant = "standard"
              onChange = {(e) => setName(e.target.value)}
            />
            <TextField
              type = "email"
              id = "email"
              label = "メールアドレス"
              name = "email"
              value = {email}
              fullWidth
              variant = "standard"
              onChange = {(e) => setEmail(e.target.value)}
            />
            <TextField
              type = "password"
              label = "パスワード"
              id = "password"
              name = "password"
              value = {password}
              fullWidth
              variant = "standard"
              onChange = {(e) => setPassword(e.target.value)}
            />
            <TextField
              type = "password"
              id = "password_confirmation"
              label = "パスワード（確認用）"
              name = "password_confirmation"
              value = {passwordConfirmation}
              fullWidth
              variant = "standard"
              onChange = {(e) => setPasswordConfirmation(e.target.value)}
            />
            <Button type = "submit" variant = "contained" color = "primary" onClick = {(e) => handleSignUpSubmit(e)}>
              登録する
            </Button>
          </form>
          <Space>
            <Button variant = "outlined" color = "primary" component = {Link} to = "/signin">
              ログインする
            </Button>
          </Space>
          <Button variant = "outlined" color = "primary" component = {Link} to = "/">
            トップへ戻る
          </Button>
        </Paper>
      )}
      {(isTabletSite || isMobileSite) &&(
        <Paper
        sx = {{
          p: "20px",
          width: "300px",
          m: "0 auto"
        }}
        >
          <Typography variant = {"h5"} sx = {{ m: "30px" }}>
            アカウントを作成する
          </Typography>
          <form>
            <TextField
              type = "text"
              id = "name"
              label = "アカウント名"
              name = "name"
              value = {name}
              fullWidth
              variant = "standard"
              onChange = {(e) => setName(e.target.value)}
            />
            <TextField
              type = "email"
              id = "email"
              label = "メールアドレス"
              name = "email"
              value = {email}
              fullWidth
              variant = "standard"
              onChange = {(e) => setEmail(e.target.value)}
            />
            <TextField
              type = "password"
              label = "パスワード"
              id = "password"
              name = "password"
              value = {password}
              fullWidth
              variant = "standard"
              onChange = {(e) => setPassword(e.target.value)}
            />
            <TextField
              type = "password"
              id = "password_confirmation"
              label = "パスワード（確認用）"
              name = "password_confirmation"
              value = {passwordConfirmation}
              fullWidth
              variant = "standard"
              onChange = {(e) => setPasswordConfirmation(e.target.value)}
              />
            <Button type = "submit" variant = "contained" color = "primary" onClick = {(e) => handleSignUpSubmit(e)}>
              登録する
            </Button>
          </form>
          <Space>
            <Button variant = "outlined" color = "primary" component = {Link} to = "/signin">
              ログインする
            </Button>
          </Space>
          <Button variant = "outlined" color = "primary" component = {Link} to = "/">
            トップへ戻る
          </Button>
        </Paper>
      )}
    </>
  )
}

const Space = styled.div`
  margin-right:10px;
  display:inline;
`
