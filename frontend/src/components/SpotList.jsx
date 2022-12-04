import { useState, useEffect } from "react";
import axios from 'axios';
import { Grid, CardHeader, Card } from "@material-ui/core";
import { CardMedia, Rating } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ReactPaginate from 'react-paginate';
import '../Pagination.css'
import '../Spot.css'
import styled from 'styled-components';

export const SpotList = () => {
  const [spots, setSpots] = useState([])
  const [count, setCount] = useState(0)
  const [keyword, setKeyword] = useState([])
  const [tag, setTag] = useState([])
  const [allTag, setAllTag] = useState([])
  const navigate = useNavigate()
  const location = useLocation()
  const searchparams = location.state.params
  const [ offset, setOffset ] = useState(0);
  const perPage = 8;
  const noImg = `${process.env.PUBLIC_URL}/noimg.jpg`

  const handlePageChange = (data) => {
    let page_number = data['selected'];
    setOffset(page_number*perPage)
  }

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/tag`)
    .then(resp => {
      setAllTag(resp.data)
    })
    .catch( e => {
      console.log(e.response);
    })
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/posts`, {params: searchparams})
    .then(resp => {
      setSpots(resp.data.posts);
      setCount(resp.data.posts.length);
      setKeyword(searchparams.keyword);
      setTag(searchparams.tags);      
    })
    .catch( e => {
      console.log(e.response);
    })
  },[])

  const DisplayImg = (img) =>{
      console.log(img)
      const display_img =  img.length != 0 ? img : noImg
      return display_img
  }

  const toTagPage = (data) => {
    navigate(`/spot/list`, {state: {tags: data}})
  }

  const ToSinglePage = (id) => {
    navigate(`/spot/${id}`,{id: id})
  }

  const StarRating = (props) => {
    console.log(props)
    const total_review = props.props.length
    const average_review = props.props.reduce((sum, i) => sum + i.rate, 0)/total_review;
    const average_review_result = average_review ? average_review : 0
    return (
      <>
        <Rating
         value={average_review_result}
         precision = {0.1}
          />
        <span> { average_review_result.toFixed(2) } </span>
        <span> ({ total_review }) </span>
      </>
    )
  }

  const TagDisplay = () => {
    const tag_names = []    
    allTag.map((t) => {
      console.log(t.id)
      if( tag.includes(t.id.toString()) ){
        console.log('goog')
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
      <p>検索結果：{count}件がヒットしました。</p>      
      <TagDisplay/>
      <Grid container spacing={3} sx={{ m:2 }}>
        {spots.slice(offset, offset+ perPage).map((val) => {
        return(  
          <Grid item sm={6} md={3} xs={12} >
            <Card onClick={() => ToSinglePage(val.id)} className = {"spot-list-card"}>
              {console.log(val.tags)}
              <span>{ val.name }</span>
              <CardMedia
              component = "img"
              image = { DisplayImg(val.image_url) }
              height = "200"
              />
              <StarRating props = { val.review }/>
              <SinglePageTags>{ val.tags.map((data) => {
              {console.log(data)}
              return(
                <CheckBoxButton onClick={() => toTagPage(data.name)}>
                  {data.name}
                </CheckBoxButton>
              )
            }) }</SinglePageTags>
            </Card>
          </Grid>  
        )
        })}
      </Grid>
      <ReactPaginate
        previousLabel='<'
        nextLabel='>'
        breakLabel='...'
        pageCount={Math.ceil(spots.length/perPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={ "pagination" }
        // subContainerClassName={ pagination }
        previousClassName='page-item' // '<'の親要素(li)のクラス名
        nextClassName='page-item' //'>'の親要素(li)のクラス名
        activeClassName={ "active" }
        // disabledClassName={ pagination_disabled } // 使用不可の「<,>」に着くクラス名
        // pageClassName='page-item'
        // pageLinkClassName='page-link'
        // previousLinkClassName='page-link'  //'<'のリンクのクラス名
        // nextLinkClassName='page-link'//'>'のリンクのクラス名
        // breakClassName='page-item' // 上記の「…」のクラス名
        // breakLinkClassName='page-link' // 「…」の中のリンクにつけるクラス
      />
    </>
  )
}

const SinglePageTags = styled.dd`
  width: 70%;
  text-align: left;
  display: flex;
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
