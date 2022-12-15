import { useState, useEffect } from "react"
import axios from 'axios'
import { Grid, Card } from "@material-ui/core"
import { CardMedia, Rating } from "@mui/material"
import { useNavigate, useLocation } from "react-router-dom"
import ReactPaginate from 'react-paginate'
import { Scrollbars } from 'rc-scrollbars'
import '../Pagination.css'
import '../Spot.css'
import styled from 'styled-components'

export const SpotList = () => {
  const [spots, setSpots] = useState([])
  const [count, setCount] = useState(0)
  const [keyword, setKeyword] = useState([])
  const [tag, setTag] = useState([])
  const [allTag, setAllTag] = useState([])
  const navigate = useNavigate()
  const location = useLocation()
  const [ offset, setOffset ] = useState(0)
  const PER_PAGE = 8
  const noImg = `${process.env.PUBLIC_URL}/noimg.jpg`
  
  const [searchParams, setSearchParams] = useState(location.state.params)
  
  const handlePageChange = (data) => {
    let page_number = data['selected']
    setOffset(page_number * PER_PAGE)
  }

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/tag`)
    .then(resp => {
      setAllTag(resp.data)
    })
    .catch( e => {
      console.log(e.response)
    })
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/posts`, {params: searchParams})
    .then(resp => {
      setSpots(resp.data.posts)
      setCount(resp.data.posts.length)
      setKeyword(searchParams.keyword)
      setTag(searchParams.tags)      
    })
    .catch(e => {
      console.log(e.response)
    })
  }, [searchParams])

  const DisplayImg = (img) =>{
      const display_img = img.length != 0 ? img : noImg
      return display_img
  }

  const toTagPage = (tag_id) => {
    setSearchParams({tags: [`${tag_id}`], keyword: ""})
  }

  const ToSinglePage = (id) => {
    navigate(`/spot/${id}`, {id: id})
  }

  const StarRating = (props) => {
    const total_review = props.props.length
    const average_review = props.props.reduce((sum, i) => sum + i.rate, 0)/total_review
    const average_review_result = average_review ? average_review : 0
    return (
      <>
        <Rating
         value = {average_review_result}
         precision = {0.1}
        />
        <span> {average_review_result.toFixed(2)} </span>
        <span> ({total_review}) </span>
      </>
    )
  }

  const TagDisplay = () => {
    const tag_names = []
    allTag.map((t) => {
      if(tag.includes(t.id.toString())){
        tag_names.push(t.name)
      }
    })
    return(
      <p>タグ：{tag_names ? tag_names.join(', ') : ""}</p>
    )
  }

  return(
    <>
      <h3>spotリスト</h3>
      <p>{keyword ? `キーワード：${keyword}`:``}</p>
      <TagDisplay/>
      <p>検索結果：{count}件がヒットしました。</p>
      <Grid container spacing = {3} sx = {{m: 2}}>
        {spots.slice(offset, offset + PER_PAGE).map((val) => {
        return(  
          <Grid item sm = {6} md = {3} xs = {12}>
            <Card className = {"spot-list-card"}>
              <div class = "spot-list-card-title">{val.name}</div>
              <CardMedia
                component = "img"
                image = {DisplayImg(val.image_url)}
                height = "200"
                onClick = {() => ToSinglePage(val.id)}
              />
              <StarRating props = {val.review}/>
              <Scrollbars autoHeight>
                <SinglePageTags>
                  {val.tags.map((data) => {
                    return(
                      <CheckBoxButton onClick = {() => toTagPage(data.id)}>
                        {data.name}
                      </CheckBoxButton>
                    )
                  })}
                </SinglePageTags>
              </Scrollbars>
            </Card>
          </Grid>
        )
        })}
      </Grid>
      <ReactPaginate
        previousLabel = '<'
        nextLabel = '>'
        breakLabel = '...'
        pageCount = {Math.ceil(spots.length/PER_PAGE)}
        marginPagesDisplayed = {2}
        pageRangeDisplayed = {5}
        onPageChange = {handlePageChange}
        containerClassName = {"pagination"}
        previousClassName = 'page-item'
        nextClassName = 'page-item'
        activeClassName = {"active"}        
      />
    </>
  )
}

const SinglePageTags = styled.dd`
  text-align: left;
  display: flex;
  flex-wrap: wrap;
  height: 70px;
`
const CheckBoxButton = styled.div`
  height: 25px;
  font-size: 16px;
  cursor: pointer;
  color: #3f51b5;
  border: 1px solid #3f51b5;
  padding: 5px;
  border-radius: 3px;
  margin: 2px;
  z-index: 100;
  &:hover{
    color: #fff;
    background-color: #3f51b5;
    transition: 0.5s;
  }
`
