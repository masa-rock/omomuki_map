import { useState, useEffect, useContext, createContext } from "react"
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'
import Button from '@material-ui/core/Button'
import { AuthContext } from '../App'
import Review from "./Review"
import { Rating } from "@mui/material"
import { ImAirplane } from 'react-icons/im'
import { IconContext } from "react-icons/lib"
import { MediaQueryContext } from './Provider/MediaQueryProvider'
import media from "styled-media-query"

export const FlagContext = createContext()

export const SpotSinglePage = () => {
  const navigate = useNavigate()
  const [post, setPost] = useState("")
  const [img, setImg] = useState([])
  const [tags, setTags] = useState([])
  const [title, setTitle] = useState()
  const [userId, setUserId] = useState()
  const params = useParams()
  const [star, setStar] = useState(0)
  const [images, setImages] = useState({data: "", name: ""})
  const [reviews, setReviews] = useState([])
  const [reviewComment, setReviewComment] = useState()
  const [iconColor, setIconColor] = useState("#d3d3d3")
  const { currentUser } = useContext(AuthContext)
  const [postReview, setPostReview] = useState([])
  const [wantToGoUserId, setWantToGoUserId] = useState([])
  const [wantToGo, setWantToGo] = useState([])
  const [wantToGoData, setWantToGoData] = useState([])
  const { isMobileSite, isTabletSite } = useContext(MediaQueryContext)
  const total_review = postReview.length
  const average_review = total_review ? postReview.reduce((sum, i) => sum + i.rate, 0)/total_review : 0 
  const value = {
    reviews,
    setReviews,
    star,
    setStar,
    title,
    setTitle,
    reviewComment,
    setReviewComment,
    userId,
    post,
    images,
    setImages,
  }
  
  useEffect(() => {
    async function fetchData(){
    const getSpot = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/posts/${params.id}`)
    const getReviews = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/posts/review_data/${params.id}`)
    setPost(getSpot.data.post)
    setImg(getSpot.data.post.image_url)
    setTags(getSpot.data.post.tags)
    setUserId(currentUser?.id)
    setReviews(getReviews.data)
    setPostReview(getSpot.data.post.review)
    setWantToGo(getSpot.data.post.want_to_goes)
    setWantToGoUserId(getSpot.data.post.want_to_goes.map((d) => {return d.user_id}))
  }
  fetchData()
},[iconColor])

  useEffect(() => {
    if(currentUser){
      wantToGoUserId.includes(currentUser.id) ? setIconColor("#B2D235") : setIconColor("#d3d3d3")
      setWantToGoData(wantToGo.map((key) => {
            if(key.user_id = currentUser.id){
              return key
            }
          }))
    }
  },[wantToGoUserId])

  const DisplayImg = () => {
    const display_img =  img.length != 0 ? img : `${process.env.PUBLIC_URL}/noimg.jpg`
    return(
      <img src = {display_img}/>
    )
  }

  const dataDelete = (delete_id) => {
    if (window.confirm("投稿を削除しますがよろしいでしょうか")){
      axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/posts/${delete_id}`)
      .then(
        navigate("/spot/list")
      )
      .catch(e => {
        console.log(e.response)
      })
    }
  }

  const generateParams = (data) => {
    const tag_param = [data]
    const select_tag = {
      tags: tag_param
    }
    return select_tag
  }

  const toTagPage = (data) => {
    const params = generateParams(data)
    navigate(`/spot/list`, {state: {params: params}})
  }

  const Stay = () => {
    const stay_time = {
      "1": "1時間未満",
      "2": "1~2時間",
      "3": "半日",
      "4": "一日"
    }
    return (
      <>
        {stay_time[post.stayTime]}
      </>
    )
  }

  const IconControll = () => {
    const wantToGoParams = {
      user_id: currentUser.id,
      post_id: post.id
    }
    const uid = currentUser.id
    const wantToGoDataId = wantToGoData[0] ? wantToGoData[0].id : ""
    if (wantToGoUserId.includes(uid)){
      try{
        axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/want_to_goes/${wantToGoDataId}`)
        setIconColor("#d3d3d3")
        setWantToGoUserId([])
      }catch(e){
        console.log(e)
      }
    }else{
      try{
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/want_to_goes`, wantToGoParams)
        setIconColor("#B2D235")
      }catch(e){
        console.log(e)
      }
    }
  }

  const WantToGo = () => {
    return(
      <IconContext.Provider
        value = {{size: "20px", color: iconColor}}
        className = {"want-to-go-icon"}
        >
        <WantToGoIconBtn wantToGoData = {wantToGoData[0]} onClick = {() => IconControll()}>
        <ImAirplane/>
        {wantToGoData[0] ?
          <span> 行きたい場所に登録済み </span> :
          <span> 行きたい場所に未登録 </span>
        }
        
        </WantToGoIconBtn>
      </IconContext.Provider>
    )
  }

  return(
    <SinglePageContainer>
      <SingleSpotTitle>
        {post.name}
        {(isMobileSite || isTabletSite) && (
          <br/>
        )}
        <Rating
         value = {average_review}
         precision = {0.1}
         readOnly = {true}
          />
        <span> {average_review.toFixed(2)} </span>
        ({total_review})
      </SingleSpotTitle>
      <SinglePageMain>
        <ImageContainer>
          <DisplayImg/>
        </ImageContainer>
        <SinglePageRightContainer>
          {currentUser ? <WantToGo/> : <></>}
          <SpotContents>
            <SinglePageSubject>住所</SinglePageSubject>
            <SinglePageText><p>{post.address}</p></SinglePageText>
          </SpotContents>
          <SpotContents>
            <SinglePageSubject>タグ</SinglePageSubject>
            <SinglePageTags>{ tags.map((data) => {
              return(
                <CheckBoxButton onClick={() => toTagPage(data.id)}>
                  {data.name}
                </CheckBoxButton>
              )
            })}</SinglePageTags>
          </SpotContents>
          <SpotContents>
            <SinglePageSubject>滞在時間</SinglePageSubject>
            <SinglePageText><p><Stay/></p></SinglePageText>
          </SpotContents>
          <SpotContents>
            <SinglePageSubject>場所の説明</SinglePageSubject>
            <SinglePageText><p>{post.description}</p></SinglePageText>
          </SpotContents>
          <Button onClick={() => dataDelete(post.id)}>
            削除
          </Button>
          <Button onClick={() => { navigate(-1) }}>一覧ページに戻る</Button>
        </SinglePageRightContainer>
      </SinglePageMain>
      <FlagContext.Provider value={value} >
        <Review/>
      </FlagContext.Provider>
    </SinglePageContainer>
  )
}

const SinglePageContainer = styled.div`
  background-color: #fff;
  max-width: 1800px;
  margin: 100px auto;
  padding: 100px;
  color: black;
  border-radius: 20px;
  ${media.lessThan("medium")`
    padding: 50px;
    margin: 0 auto;
  `}
`

const SingleSpotTitle = styled.div`
  font-size: 38px;
  text-align: left;
  margin-left: 20px;
  ${media.lessThan("medium")`
    font-size: 22px;
  `}
  &&& span{
    color: red;
  } 
`

const SinglePageTitle = styled.h3`
  font-size: 38px;
  text-align: left;
`

const ImageContainer = styled.div`
  width: 50%;
  ${media.lessThan("medium")`
    width: 100%;    
  `}
  &&& img{
    display: block;
    width: 100%;
    max-height: 500px;
    border-radius:10px;
  }
`

const SinglePageMain = styled.div`
  display: flex;
  ${media.lessThan("medium")`
    display: block;
  `}
`

const SinglePageRightContainer = styled.div`
  padding: 50px;
  width:50%;
  ${media.lessThan("medium")`
    width: 100%;
    padding:20px 0;
  `}
`

const SinglePageSubject = styled.dt`
  font-size: 20px;
  width: 30%;
  text-align: left;
`

const SpotContents = styled.dl`
  display: flex;
  border-bottom: solid 1px #ccc;
  align-items: center;
  margin-bottom: 50px;
  padding: 10px 0;
`

const SinglePageText = styled.dd`
  width: 70%;
  text-align: left;
`

const SinglePageTags = styled.dd`
  width: 70%;
  text-align: left;
  display: flex;
  flex-wrap: wrap;
`
const CheckBoxButton = styled.div`
  font-size:16px;
  cursor: pointer;
  color: #3f51b5;
  border:1px solid #3f51b5;
  padding: 5px;
  border-radius:3px;
  margin:2px;
  &:hover{
    color: #fff;
    background-color: #3f51b5;
    transition: 0.5s;
  }
`

const WantToGoIconBtn = styled.div`
  font-size: 20px;
  text-align: left;
  &&& span{
    margin-left:10px;
    color: ${props => props.wantToGoData ? '#B2D235' : '#d3d3d3'}
  }
` 