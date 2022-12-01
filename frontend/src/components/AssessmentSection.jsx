import styled from 'styled-components';
import {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper';
import { Rating } from "@mui/material";
import noimg from "../images/noimg.jpg"
import media from "styled-media-query"
import { useInView } from 'react-intersection-observer'
import 'animate.css'
import  'swiper/css';
import  'swiper/css/navigation';
import  'swiper/css/pagination';

export const AssessmentSection = () => {
  const navigate = useNavigate()
  const [spots, setSpots] = useState([])
  const { ref, inView } = useInView({
    rootMargin: '-50px',
    triggerOnce: true
  })

  useEffect(() => {
    axios.get("http://0.0.0.0:3001/api/v1/posts/assessment")
    .then(resp =>{
      setSpots(resp.data);
    })
    .catch(e => {
      console.log(e.response);
    })    
  },[])

    const DisplayImg = (img) =>{
      const display_img =  img.img != 0 ? img.img : noimg
      console.log(img.img)
      return(
        <img src = {display_img} />
      )
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
        <div>
          <Rating
           value={average_review_result}
           precision = {0.1}
            />
          <span> { average_review_result.toFixed(2) } </span>
          <span> ({ total_review }) </span>
        </div>
      )
    }

  return(
    <AssessmentContainer ref= { ref } className = { inView ? "animate__animated animate__fadeInUp" : "opacity_zero" }>
      <AssessmentContainerTitle>口コミ人気スポット</AssessmentContainerTitle>
      <SwiperContainer>
        <Swiper
          modules = {[Navigation, Pagination, Autoplay]}
          navigation
          autoplay = {{
            delay:5000
          }}
          pagination ={{ 
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            clickable: true 
          }}
        >
          {spots.map((val) => (
            <SwiperSlide onClick={() => ToSinglePage(val.id)}>
              {console.log(val)}                
              <SwiperTitle>
                <div>{val.name}</div>
                <StarRating
                  props = { val.review }
                />
              </SwiperTitle>
              <div><DisplayImg img={val.image_url}/></div>
            </SwiperSlide>              
          ))}
        </Swiper>
      </SwiperContainer>
    </AssessmentContainer>
  )
}

const AssessmentContainer = styled.div`
  animation-duration: 3s;
  height: 500px;
  max-width: 600px;
  margin: 100px auto;
  padding:15px;
`

const AssessmentContainerTitle = styled.h5`
  font-family: 'Shippori Mincho', serif;
  font-size: 30px;
  border-bottom: solid 1px ;
  ${media.lessThan("medium")`
    font-size: 22px;
  `}
`

const SwiperTitle = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 30px;
`

const SwiperContainer = styled.div`
  margin: 20px 0;
  height: 100%;
  &&& img{
    object-fit: cover;    
    height: 400px;
  }
`
