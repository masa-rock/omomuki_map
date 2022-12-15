import { useNavigate } from 'react-router-dom';
import { Paper, TextField, Typography, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel } from "@mui/material";
import { useState, useEffect } from "react";
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import client from "../apis/client";
import axios from 'axios';
import { LoadScript } from '@react-google-maps/api';
import Geocode from "react-geocode";
import { useInView } from 'react-intersection-observer';
import 'animate.css';

export const SpotNew = () =>{
  const navigate = useNavigate();
  const [name, setName] = useState();
  const [address, setAddress] = useState();
  const [description, setDescription] = useState();
  const [businessHourStart, setBusinessHourStart] = useState();
  const [businessHourEnd, setBusinessHourEnd] = useState();
  const [fee, setFee] = useState();
  const [stayTime, setStayTime] = useState(0);
  const [eatWalk, setEatWalk] = useState();
  const [images, setImages] = useState({data: "", name: ""});
  const [lat,setLat] = useState(0);
  const [lng,setLng] = useState(0);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState();
  const [checkedItems, setCheckedItems] = useState([])
  const [map, setMap] = useState(null);
  const [maps, setMaps] = useState(null);
  const [geocoder, setGeocoder] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/tag`)
    .then(resp => {
      console.log(resp)
      setTags(resp.data)
    })
    .catch(e => {
      console.log(e.response)
    })
  },[])

  const { ref, inView } = useInView({
    rootMargin: '-100px',
    triggerOnce: true
  })

  const handleImageSelect = async(e) => {
    const reader = new FileReader()
    const file = e.target.files[0]
    if (file){
      reader.onload = () => {
        setImages({
          data: reader.result,
          name: file.name
        })
      }
      reader.readAsDataURL(file)
    }
    return ;
  }

  const setLatLng = (lat, lng) =>{
    console.log(lat)
    console.log(lng)
    setLat(lat)
    setLng(lng)
  }

  const geoCode = () => {
    return new Promise((resolve, reject) => {      
      Geocode.setApiKey("AIzaSyBEJP2G58LPR_hjMtxUDkRcTxWkzSOWiAA");
      Geocode.fromAddress(address).then(
        response => {
            const { lat, lng } = response.results[0].geometry.location;
            console.log(lat)
            setLatLng(lat, lng)
            return resolve("good")
        },
        error => {
            console.error(error);
            return reject(null)
        }
    )
      })}

  const handleTagRegistration = async(e) => {
    e.preventDefault();
    
    const params = generateTagParams();
    try{
      client.post('tag',params)
      navigate("/")
    }catch(e){
      console.log(e)
    }
  }

  const CheckBox = ({id, value, checked, onChange}) => {
    return(
      <input
      id={id}
      type="checkbox"
      name="inputNames"
      checked={checked}
      onChange={onChange}
      value={value}
    />
    )
  }

  const checkboxChange = e => {
    if(checkedItems.includes(e.target.value)){
      setCheckedItems(checkedItems.filter(item => item !== e.target.value));
    }else{
      setCheckedItems([...checkedItems, e.target.value]);
    }
  }

  const generateTagParams = () => {
    const newTagParams = {
      name: newTag,
    }
    return newTagParams
  }
  
  const generateParams = () => {
    const newSpotParams = {
      name: name,
      address: address,
      description: description,
      business_hours_Start: businessHourStart,
      business_hours_end: businessHourEnd,
      fee: fee,
      stay_time: stayTime,
      eat_walk: eatWalk,
      images: images,
      tag_ids: checkedItems,
      lat: lat,
      lng: lng
    }
    return newSpotParams
  }

  async function handleSpotRegistration(e) {
    e.preventDefault();
    const params = generateParams();
    try{
      client.post('posts', params)
      .then(resp => {
        console.log(resp)
      }).catch(e => {
        console.log(e)
      })
      
    }catch(e){
      console.log(e)
    }
  }

  return(
    <Paper
    sx = {{
      p: "100px",
      width: "400px",
      m: "0 auto"
    }}
    >
      
    <Typography variant={"h5"} sx={{ m: "30px" }}>
      スポット登録画面
    </Typography>
    <form>
      <div>
        <TextField 
          type="text"
          id= "name"
          label= "スポット名"
          name= "name"
          value= {name}
          fullWidth
          variant = "standard"
          onChange={(e) => setName(e.target.value)}
        />
        </div>
        <div>
        <TextField 
          type="text"
          id= "address"
          label= "住所"
          name= "address"
          value= {address}
          fullWidth
          variant = "standard"
          onChange={(e) => {
            setAddress(e.target.value)
            geoCode()}}
        />
        </div>
        <div>
        <TextField 
          type="text"
          id= "description"
          label= "スポットの説明"
          name= "description"
          value= {description}
          fullWidth
          multiline
          rows = {5}
          variant = "standard"
          onChange={(e) => setDescription(e.target.value)}
        />
        </div>
        <div>
        <Typography align="left" variant={"h6"} sx={{ mt: "70px" }}>
          営業時間
        </Typography>
        <TimeInput>
          <div>
            <label htmlFor="business_hour_start">
              <Typography variant={"h6"} sx={{ mt: "10px" }}>
                開始時間
              </Typography>
            </label>
            <TextField 
              type="time"
              id= "business_hour_start"
              name= "business_hour_start"
              value= {businessHourStart}
              variant = "standard"
              onChange={(e) => setBusinessHourStart(e.target.value)}
              />
          </div>
          <div>
            <label htmlFor="business_hour_end">
            <Typography variant={"h6"} sx={{ mt: "10px" }}>
                終了時間
            </Typography>
            </label>
            <TextField 
              type="time"
              id= "business_hour_end"
              name= "business_hour_end"
              value= {businessHourEnd}
              variant = "standard"
              onChange={(e) => setBusinessHourEnd(e.target.value)}
              />
          </div>
        </TimeInput>
        <div>
          <TextField 
            type="number"
            id= "fee"
            label= "費用"
            name= "fee"
            value= {fee}
            variant = "standard"
            onChange={(e) => setFee(e.target.value)}
          />
        </div>
        <div>
          <FormControl style={{minWidth: 200}}>
            <InputLabel id="stay_time">滞在時間</InputLabel>
            <Select
              labelid= "stay_time"
              label= "滞在時間"
              name= "stay_time"
              value= {stayTime}
              onChange={(e) => setStayTime(e.target.value)}
            >
              <MenuItem value={0}></MenuItem>
              <MenuItem value={1}>1時間未満</MenuItem>
              <MenuItem value={2}>1~2時間</MenuItem>
              <MenuItem value={3}>半日</MenuItem>
              <MenuItem value={4}>一日</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div>
          <FormControlLabel 
            control={<Checkbox
              value= {eatWalk}
              onChange={(e) => setEatWalk(e.target.value)}
              name= "eat_walk"
            />}
            label= "食べ歩きできるか（できる場合チェック）"
          />
        </div>
      </div>
      
      <p>タグを選択する</p>
      <CheckBoxButtons>
        {tags.map((val) => {
          return(
            <CheckBoxButton id={val.id} checkedItems={checkedItems}>
              <label htmlFor={`id_${val.id}`} key = {`key_${val.id}`}>
                <CheckBox
                  id = {`id_${val.id}`}
                  value = {val.id}
                  onChange = {checkboxChange}
                  checked = {checkedItems.includes(`${val.id}`)}
                />
                {val.name}
              </label>
            </CheckBoxButton>
          )
        })}
      </CheckBoxButtons>

      <TextField 
          type="text"
          id= "tag"
          label= "タグの追加"
          name= "tag"
          value= {newTag}
          fullWidth
          variant = "standard"
          onChange={(tag) => setNewTag(tag.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" onClick={(tag) => handleTagRegistration(tag)} >
            <p>タグを追加する</p>
        </Button>
        <div className="animate__animated animate__fadeIn" ref={ref} >
        {inView && (
          <p>ふわっと表示</p>
        )}
        </div>
      
      <Typography variant={"h5"} sx={{ m: "30px" }}>
      画像アップロード
        <input 
        type="file"
        name = "images"
        onChange = {handleImageSelect}
         />
      </Typography>
      <Button type="submit" variant="contained" color="primary" onClick={(e) => handleSpotRegistration(e)}>
        登録する
      </Button>
      <LoadScript googleMapsApiKey= {"AIzaSyAWyQfXaQA7ITensdfjr7MOt081KlrKLec"}>
      </LoadScript>
    </form>
    </Paper>
  )
}

const TimeInput = styled.div`
  display: flex;
  justify-content: space-between;
  color: currentColor;
`

const CheckBoxButton = styled.div`
  &&& input{
    display: none;
  }
  &&& label{
    font-size:16px;
    cursor: pointer;
    border:1px solid #3f51b5;
    background-color: ${props => props.checkedItems.includes(String(props.id)) ? '#3f51b5' : '#fff' };
    color: ${props => props.checkedItems.includes(String(props.id)) ? '#fff' : '#3f51b5' };
    padding: 5px;
    border-radius:3px;
    margin:2px;
    &:hover{
      color: #fff;
      background-color: #3f51b5;
      transition: 0.5s;
    }
  }
`

const CheckBoxButtons = styled.div`
  display: flex;
  height:50px;
  font-size: 0px;
`
