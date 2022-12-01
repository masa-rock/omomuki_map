import styled from 'styled-components';
import about_img from '../images/about-img.jpg';
import media from "styled-media-query"
import { useInView } from 'react-intersection-observer'
import 'animate.css'

export const AboutSection = () => {
  const { ref, inView } = useInView({
    rootMargin: '-50px',
    triggerOnce: true
  })

  return(
    <AboutContainer ref = { ref }  className = {inView ? "animate__animated animate__fadeInUp" : "opacity_zero"}>
      <AboutRight></AboutRight>
      <AboutLeft>
        <h2>趣mapとは</h2>
        <p>趣mapとは、古風な街並みや城下町など、非日常感の味わえる"趣のある場所"にスポットを当てた旅行先検索サイトです。日帰り旅行やお泊まり旅行の行き先の一つとして趣のある場所を検索できます。</p>
      </AboutLeft>
    </AboutContainer>
  )
}

const AboutContainer = styled.div`
  padding: 100px;
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  animation-duration: 3s;
  ${media.lessThan("medium")`
    display: block;
    padding: 50px;
    margin: 40px auto;
  `}
`

const AboutLeft = styled.div`
  width: 40%;
  margin: auto 0;
  ${media.lessThan("medium")`
    width: 100%;
  `}
  &&& h2{
    font-family: 'Shippori Mincho', serif;
    text-align: center;
    font-size: 30px;
    border-bottom: solid 1px ;
    margin-bottom: 50px;
    ${media.lessThan("medium")`
      font-size: 22px;
    `}
  }
  &&& p{
    text-align:left;
    font-family: 'Shippori Mincho', serif;
    font-size: 22px;
    ${media.lessThan("medium")`
      font-size: 18px;
    `}
  }
`

const AboutRight = styled.div`
  width: 50%;
  height: 600px;
  background: url(${about_img}) no-repeat center / cover;
  ${media.lessThan("medium")`
    width: 100%;
    height: 300px;
  `}
`
