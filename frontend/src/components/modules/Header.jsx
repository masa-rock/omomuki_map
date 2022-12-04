import React,{ useContext, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import styled from 'styled-components'
import { Link, useNavigate, useLocation } from "react-router-dom"
import { AuthContext } from '../../App'
import { signOut } from '../../apis/auth'
import Cookies from 'js-cookie'
import Sidebar from 'react-sidebar'
import { MediaQueryContext } from '../Provider/MediaQueryProvider'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

export default function ButtonAppBar() {
  const {setIsSignedIn, isSignedIn, currentUser, loading} = useContext(AuthContext)
  const { isMobileSite, isTabletSite, isPcSite } = useContext(MediaQueryContext)
  const classes = useStyles()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [flashMessage, setFlashMessage] = useState("")
  const location = useLocation()

  const handleSignOut = async (e) => {
    e.preventDefault()
    try {
      const res = await signOut()
      if (res.data.success === true) {
        Cookies.remove("_access_token")
        Cookies.remove("_client")
        Cookies.remove("_uid")

        setIsSignedIn(false)
        navigate("/", {state: {flash_message: "ログアウトしました", response: "succeess"}})
        console.log("Succeeded in sign out")
      } else {
        console.log("Failed in sign out")
      }
    } catch (e) {
      console.log(e)
    }
  }

  const sidebarOpenBtn = () => {
    if (sidebarOpen){
      setSidebarOpen(false)
    }
    else{
      setSidebarOpen(true)
    }
  }

  const AuthButtons = () => {
    if (!loading){
      if (isSignedIn) {
        return(
          <>
            <Button color="inherit" component={Link} to="../edit-profile">
              {currentUser?.name}
            </Button>
            <Button color="inherit" className={classes.linkBtn} onClick={handleSignOut}>
              Sign out
            </Button>
            <Button color="inherit" component={Link} to="/">Home</Button>
          </>
        )
      } else {
        return(
        <>
          <Button color="inherit" component={Link} to="../Signin">Login</Button>
          <Button color="inherit" component={Link} to="../Signup">Sign up</Button>
          <Button color="inherit" component={Link} to="/">Home</Button>
        </>
        )
      }
    } else {
      return(
        <></>
      )
    }
  }

  const sideBarContainer = () => {
    return(
      <SidebarContainerStyle>
        <AuthButtons/>
      </SidebarContainerStyle>
    )
  }

  const FlashMessage = () => {
    console.log(location.state)
    if(location.state === undefined || location.state === null){
      setFlashMessage("")
    }else{
      setFlashMessage(location.state.flash_message)
      return(
        location.state.response == "success" ? 
        <FlashMessageStyle response = {location.state.response}> {flashMessage} </FlashMessageStyle> : 
        <FlashMessageStyle response = {location.state.response}> {flashMessage} </FlashMessageStyle>
      )
    }
  }

  return (
    <>
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            {isMobileSite &&(
            <>
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={sidebarOpenBtn} >
                <MenuIcon />
                <Sidebar
                  sidebar = {sideBarContainer()}
                  open = {sidebarOpen}
                  styles={{ sidebar: { background: "gray", width: "200px", position:"fixed" } }}      
                  >
                  </Sidebar>
              </IconButton>
            </>
            )}
            <Typography variant="p" className={classes.title}>
              趣map
            </Typography>
            {(isPcSite || isTabletSite)&&(
              <AuthButtons />
            )}
          </Toolbar>
          <FlashMessage/>
        </AppBar>
      </div>
    </>
  )
}

const SidebarContainerStyle = styled.div`
  padding: 100px 0;
  &&& a{
    display: block;
  }
`

const FlashMessageStyle = styled.p`
  font-size: 8px;
  background-color: ${props => props.response == "success" ? "#7bc890" : "#dc3545" }
`
