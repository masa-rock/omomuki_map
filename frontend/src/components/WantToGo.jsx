import styled from 'styled-components';
import { Sidebar } from './modules/Sidebar';
import { useState, useEffect, useContext } from "react";
import { Card, CardMedia } from "@material-ui/core";
import { AuthContext } from '../App';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import media from "styled-media-query"

export const WantToGo = () => {
  const [post, setPost] = useState([])
  const { currentUser } = useContext(AuthContext);
  const noImg = `${process.env.PUBLIC_URL}/noimg.jpg`
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/want_to_goes`, {params: {user_id: currentUser.id}})
    .then(resp => {
      setPost(resp.data.posts)
    })
    .catch(e => {
      console.log(e.response)
    })
  },[currentUser])

  const ToSinglePage = (id) => {
    navigate(`/spot/${id}`, {id: id})
  }

  const DisplayImg = (img) =>{
    const display_img =  img.length != 0 ? img : noImg
    return display_img
  }

  const WantToGoPost = (prop) =>{
    return(
      <Card onClick = {() => ToSinglePage(prop.val.id)} className = {"want-to-go-card"}>        
        <CardMedia
          component = "img"
          image = {DisplayImg(prop.val.image_url)}
          height = "200"
        />
        <div className = {"want-to-go-right-text"}>
          <p>{prop.val.name}</p>
        </div>
      </Card>
    )
  }

  return(
  <div className = 'mypage-container'>
    <div className = 'sidebar-container'>
      <Sidebar/>
    </div>
    <div className = "mypage-main-container">
      <WantToGoPosts>
        <h4>行きたい場所一覧</h4>
        {post?.map((val) => {
          return(
            <WantToGoPost val = {val}/>
          )
        })}
      </WantToGoPosts>
    </div>
  </div>
  )
}

const WantToGoPosts = styled.div`
  background-color: #f5f5f5;
  width: calc(100% - 200px);
  ${media.lessThan("medium")`
    width: 100%;
  `}
  &&& h4{
    font-family: 'Shippori Mincho', serif;
    font-size: 30px;
    ${media.lessThan("medium")`
      font-size: 24px;
    `}
  }
`
