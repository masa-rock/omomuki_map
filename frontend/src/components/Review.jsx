import styled from 'styled-components'
import { TextField, Card } from "@material-ui/core"
import { Typography, CardMedia, Rating } from "@mui/material"
import Button from '@material-ui/core/Button'
import { useState, useMemo, useContext } from "react"
import { useModal } from 'react-hooks-use-modal'
import { AuthContext } from '../App'
import { FlagContext } from './SpotSinglePage'
import client from "../apis/client"
import { useNavigate } from 'react-router-dom'
import media from "styled-media-query"

const Review = () => {
  const {isSignedIn, loading} = useContext(AuthContext)  
  const navigate = useNavigate()
  const value = useContext(FlagContext)  
  const [titleBlank, setTitleBlank] = useState(false)
  const [commentBlank, setCommentBlank] = useState(false)
  const [rateBlank, setRateBlank] = useState(false)

  const DoReview = () => {
    if (!loading){
      if (isSignedIn){
        return(
          <ModalButton onClick = {open}>
            投稿する
          </ModalButton>
        )
      } else{
        return(
          <p>※レビューを投稿する場合は、ログインしてください</p>
        )
      }}
  }

  const [Modal, open, isOpen] = useModal('root', {
    preventScroll: true
  })

  const error_message_display = useMemo(() => {
    setTitleBlank(false)
    setCommentBlank(false)
    setRateBlank(false)
  }, [isOpen])

  const handleSpotRegistration = async(e) => {
    e.preventDefault()
    if(value.title && value.reviewComment && value.star > 0){
      const params = await generateParams()
      try{
        const data = client.post('reviews', params)
        navigate(-1)
      }catch(e){
        console.log(e)
      }
    }else{
      console.log("good")
      value.title ? setTitleBlank(false) : setTitleBlank(true)
      value.reviewComment ? setCommentBlank(false) : setCommentBlank(true)
      value.star == 0 ? setRateBlank(true) : setRateBlank(false)
    }
  }

  const handleImageSelect = async(e) => {
    const reader = new FileReader()
    const file = e.target.files[0]
    if (file){
      reader.onload = () => {
        value.setImages({
          data: reader.result,
          name: file.name
        })
      }
      reader.readAsDataURL(file)
    }
    return 
  }

  const DisplayImg = (img) =>{
    const display_img = img.length != 0 ? img : `${process.env.PUBLIC_URL}/noimg.jpg`
    return display_img
}

  const generateParams = () => {
    const reviewParams = {
      title: value.title,
      comment: value.reviewComment,
      rate: value.star,
      user_id: value.userId,
      post_id: value.post.id,
      images: value.images
    }
    return reviewParams
  }

  return (
  <>
    <ReviewTitleContainer>
      <SinglePageTitle>
        レビュー
      </SinglePageTitle>
      <DoReview/>
    </ReviewTitleContainer>
    <ReviewIndex>
      { value.reviews.map((key) => {
        return(
          <Card className = {"spot-list-card review-container"}>
            <CardMedia
              component = "img"
              image = {DisplayImg(key.image_url)}
              height = "200"
              />
            <ReviewMainContainer>
                <RatingContainer>
                  <Rating 
                    value = {key.rate}
                    precision = {0.1}
                     />
                  <span>{key.rate}</span>
                </RatingContainer>
              <ReviewTop>
                <h3> {key.title} </h3>                
                <h4> {key.user.name} </h4>
              </ReviewTop>
              <p>{key.comment}</p>
            </ReviewMainContainer>
          </Card>
        )
      })}
    </ReviewIndex>
    <Modal>
      <ModalStyle>
        <form>
          { titleBlank ? <ErrorMessage>※タイトルを入力してください</ErrorMessage> : "" }
          { commentBlank ? <ErrorMessage>※コメントを入力してください</ErrorMessage> : "" }
          { rateBlank ? <ErrorMessage>※評価を0以上に設定してください</ErrorMessage> : "" }
          <SingleSpotTitle>"{value.post.name}"のレビューを追加する</SingleSpotTitle>
          <Assessment>
            <SingleSpotTitle>評価</SingleSpotTitle>
            <Rating
              value = {value.star}              
              onChange = {(e) => value.setStar(e.target.value)}
              precision = {0.1}
              />
            <TextField
              type = "number"
              value = {value.star}
              inputProps = {{ step: 0.1, max: 5, min: 0 }}
              onChange = {(e) => value.setStar(e.target.value)}
            />
          </Assessment>              
          <TextField 
            type = "text"
            id = "title"
            label = "タイトルを入れてください"
            name = "title"
            value = {value.title}
            fullWidth
            variant = "standard"
            onChange = {(e) => value.setTitle(e.target.value)}
          />
          <TextField 
            type = "text"
            id = "review"
            label = "レビュー内容を入れてください"
            name = "review"
            value = { value.reviewComment }
            fullWidth
            multiline
            rows = {15}
            variant = "standard"
            onChange = {(e) => value.setReviewComment(e.target.value)}
          />
          <Typography variant = {"h5"} sx = {{ mt: "30px" }}>
            画像アップロード
              <input 
              type = "file"
              name = "images"
              onChange = {handleImageSelect}
              />
          </Typography>
          <Button type = "submit" variant = "contained" color = "primary" onClick = {(e) => handleSpotRegistration(e)}>
            登録する
          </Button>
        </form>
      </ModalStyle>
    </Modal>
  </>
  )
}

export default Review

const ReviewTitleContainer = styled.div`
  display: flex;
  align-items: center;
  ${media.lessThan("medium")`
    display: block
  `}
`
const SinglePageTitle = styled.h3`
  font-size: 20px;
  text-align: left;
`
  
const SingleSpotTitle = styled.h3`
  font-size: 20px;
  text-align: left;
  margin: 10px 0;
`

const ModalButton = styled.button`
  margin-left: 50px;
  &:hover{
    cursor: pointer;
  }
`

const ModalStyle = styled.div`
  background-color: #fff;
  width: 800px;
  height: 600px;
  padding: 60px 100px;
  border-radius: 10px;
`

const Assessment = styled.div`
  display: flex;
  align-items: center;
  &&& h3{
    margin-right: 20px;
  }
`

const ReviewIndex = styled.div`
  width: 80%;
`

const ReviewMainContainer = styled.div`
  width: 60%;
  margin: 0 auto;
  &&& span{
    text-align: left;
  }
  &&& p{
    text-align: left;
    margin: 10px;
  }
  ${media.lessThan("medium")`
    margin: 0;
    width: 100%;
    &&& h3{
      text-align: left;
      font-size: 16px;
    }
  `}
`

const ReviewTop = styled.div`
  align-items: center;
  justify-content: space-between;
  border-bottom: solid 1px #eeece4;
  &&& h3{
    text-align: left;
    margin: 5px;
  }
  &&& h4{
    text-align: right;
    margin: 5px;
  }
  ${media.lessThan("medium")`
  display: block;
  `}
`

const RatingContainer = styled.div`
  dispaly: flex;  
  text-align: right;
  &&& span{
    font-size: 22px;
    padding-left: 5px;
    font-weight: bold;
    color: red;
  }
`

const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
`
