import React, { useEffect, useState, useMemo, useContext, createContext } from "react"
import axios from 'axios'
import { LoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api'
import { Select, MenuItem, FormControl, InputLabel, Rating } from "@mui/material"
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router-dom'
import { MediaQueryContext } from './Provider/MediaQueryProvider'
import media from "styled-media-query"
import styled from 'styled-components'
import 'animate.css'
import { TagSelects } from "./modules/TagButton"
import { TagContext } from "../App"

export const SearchMapSection = () => {
  const [spots, setSpots] = useState([])
  const [select, setSelect] = useState("off")
  const [key, setKey] = useState(0)
  const [initialLat, setInitialLat] = useState(35.30486957565305)
  const [initialLng, setInitialLng] = useState(136.9142007392334)
  const [zoom, setZoom] = useState(9.5)
  const [tags, setTags] = useState([])
  const navigate = useNavigate()
  const {isPcSite} = useContext(MediaQueryContext)
  const {ref, inView} = useInView({
    rootMargin: '-50px',
    triggerOnce: true
  })

  const value = useContext(TagContext)
  
  const initialCenter = {
    lat: initialLat,
    lng: initialLng
  }
  
  const checkedTag = {
    tags: value.checkedItems
  }

  const region = {
    1:{lat: 43.439734, lng: 142.644880, zoom: 7},
    2:{lat: 38.945414, lng: 140.618773, zoom: 7.2},
    3:{lat: 36.074958, lng: 139.697900, zoom: 8.2},
    4:{lat: 36.065211, lng: 137.822263, zoom: 7.6},
    5:{lat: 34.614988, lng: 135.731529, zoom: 8},
    6:{lat: 34.496608, lng: 132.679781, zoom: 7.8},
    7:{lat: 32.078384, lng: 131.040306, zoom: 7.5},
    8:{lat: 27.361925, lng: 128.576300, zoom: 7.7}
  }

  useEffect(() => {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/tag`)
      .then(resp => {
        setTags(resp.data)
      })
      .catch(e => {
        console.log(e.response)
      })
  },[])

  const StarRating = (props) => {
    const total_review = props.props.length
    const average_review = props.props.reduce((sum, i) => sum + i.rate, 0)/total_review
    const average_review_result = average_review ? average_review : 0
    return (
      <>
        <Rating
         value = {average_review_result}
         precision = {0.1}
         readOnly = {true}
          />
        <span> ({ total_review }) </span>
      </>
    )
  }

  const ToSinglePage = (id) => {
    navigate(`/spot/${id}`, {id: id})
  }
  
  const MarkerMap = () =>{
    return(
      spots.map((val) => (
        <>
          <Marker 
            key = {val.id} 
            position = {{lat:val.lat, lng:val.lng}}
            onMouseOver = {() => {
              setSelect("on")
              setKey(val.id)
            }}
            onClick={() => {
              setSelect("on")
              setKey(val.id)
            }}
            />
            
          {select === "on" && key === val.id?
            <InfoWindow key={val.id} position={{lat:val.lat, lng:val.lng}} options={{pixelOffset: new window.google.maps.Size(0,-40)}} >
              <div onClick={() => ToSinglePage(val.id)} className = "hover-point">
                <p>{val.name}</p>
                <StarRating props = {val.review} />
              </div>
            </InfoWindow>        
          : ""}
        </>
      ))    
    )}

  const regionSelect = (e) => {
    const newRegion = region[e]
    console.log(region[e].lat)
    setInitialLat(newRegion.lat)
    setInitialLng(newRegion.lng)
    setZoom(newRegion.zoom)
  }

  const HandleCenterChanged = () => {
  }

  const center = useMemo(() => (initialCenter), [initialCenter])
  const new_zoom = useMemo(() => zoom, [zoom])
  const updateMapTag = useMemo(() => {
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/posts`, {params: checkedTag})
      .then(resp => {
        setSpots(resp.data.posts)
      })
      .catch( e => {
        console.log(e.response)
      })
    },[value.checkedItems])

  const mapContainerSize = () => {
    if(isPcSite){
      return(
      {height: '50vh', width: '100%'})}
      else{
        return(
      {height: '30vh', width: '100%'}
        )
      }
    }

  return(
    <SearchMapContainer ref = {ref}>
      <MapContainer className = {inView ? "animate__animated animate__fadeInUp" : "opacity_zero"}>
        <LoadScript googleMapsApiKey = "AIzaSyAWyQfXaQA7ITensdfjr7MOt081KlrKLec">
          <GoogleMap
            mapContainerStyle = {mapContainerSize()}
            center = {center} 
            zoom = {new_zoom}
            onCenterChanged = {HandleCenterChanged}
            >
            <MarkerMap/>
          </GoogleMap>
        </LoadScript>
      </MapContainer>
      <MapContext className = {inView ? "animate__animated animate__fadeInUp" : "opacity_zero"}>
        <p>地域からスポットを探す</p>
        <div className = "region-select-container">
          <FormControl className = "region-select-box">
            <InputLabel id = "region">地域を選択する</InputLabel>
            <Select
              labelid = "region"
              label = "地域"
              name = "region"
              onChange = {(e) => regionSelect(e.target.value)}
            >
              <MenuItem value = {0}>未選択</MenuItem>
              <MenuItem value = {1}>北海道</MenuItem>
              <MenuItem value = {2}>東北</MenuItem>
              <MenuItem value = {3}>関東</MenuItem>
              <MenuItem value = {4}>中部</MenuItem>
              <MenuItem value = {5}>近畿</MenuItem>
              <MenuItem value = {6}>中国・四国</MenuItem>
              <MenuItem value = {7}>九州</MenuItem>
              <MenuItem value = {8}>沖縄</MenuItem>
            </Select>
          </FormControl>
          <SearchMapTag>
            <h5>タグで絞り込む</h5>
            <div className = "check-box-buttons">
            <TagSelects/>
          </div>
          </SearchMapTag>
        </div>
      </MapContext>
    </SearchMapContainer>
  )
}

const SearchMapContainer = styled.div`
  background-color: #f4f2ee;
  display: flex;
  justify-content: space-between;
  padding: 100px;
  ${media.lessThan("medium")`
    display: block;
    padding: 20px 20px;
  `}
`

const MapContainer = styled.div`
  width: 50%;
  animation-duration: 4s;
  ${media.lessThan("medium")`
    width: 100%;
  `}
`

const MapContext = styled.div`
  width: 40%;
  padding: 30px;
  margin: auto 0;
  animation-duration: 3s;
  ${media.lessThan("medium")`
    width: inherit;
  `}
  &&& p{
    font-family: 'Shippori Mincho', serif;
    text-align: center;
    font-size: 30px;
    border-bottom: solid 1px ;
    ${media.lessThan("medium")`
      font-size: 22px;
    `}
  }
`

const SearchMapTag = styled.div`
  margin-top: 50px;
  &&& h5{
    font-family: 'Shippori Mincho', serif;
    font-size: 16px;
    text-align: left;
  }
`
