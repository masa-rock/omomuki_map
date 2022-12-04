import { Paper, TextField } from "@mui/material"
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import axios from 'axios'
import { useState, useEffect } from "react"
import { Scrollbars } from 'rc-scrollbars'
import 'animate.css'
import media from "styled-media-query"

export const Search = () => {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState()
  const [tags, setTags] = useState([])
  const [checkedItems, setCheckedItems] = useState([])

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/tag`)
    .then(resp => {
      setTags(resp.data)
    })
    .catch(e => {
      console.log(e.response)
    })
  },[])

  const CheckBox = ({id, value, checked, onChange}) => {
    return(
      <input
      id = {id}
      type = "checkbox"
      name = "inputNames"
      checked = {checked}
      onChange = {onChange}
      value = {value}
    />
    )
  }

  const searchParams = {
    tags: checkedItems,
    keyword: keyword 
  }  

  const checkboxChange = e => {
    if(checkedItems.includes(e.target.value)){
      setCheckedItems(checkedItems.filter(item => item !== e.target.value))
    }else{
      setCheckedItems([...checkedItems, e.target.value])
    }
  }

  const SearchSpot = () => {
    navigate(`/spot/list`, { state: { params: searchParams } })
  }

  return(
    <TopContainer className = "animate__animated animate__fadeInUp">      
      <MainMessage>      
        趣のある場所へ<br/>出かけよう
      </MainMessage>
      <Paper
        sx = {{
          p: "40px",
          width: {lg: "30%"},
          m: {lg: "200px 0"}
        }}        
        >
        <Subject>
          <h4>スポットを探す</h4>
          <p>キーワードから探す</p>
          <div>
            <TextField 
              type="text"
              id= "name"
              label= "キーワードを入力してください"
              name= "name"
              value= {keyword}
              fullWidth
              variant = "standard"
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <p>タグから探す</p>
          <Scrollbars autoHeight>
            <CheckBoxButtons>
              {tags?.map((val) => {
                return(
                  <CheckBoxButton id = {val.id} checkedItems = {checkedItems}>
                    <label htmlFor = {`id_${ val.id }`} key = {`key_${ val.id }`}>
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
          </Scrollbars>
          <Button variant="contained" color="primary" onClick={() => SearchSpot()}>
            検索する
          </Button>
        </Subject>
      </Paper>
    </TopContainer>
  )
}

const TopContainer = styled.div`
  animation-duration: 3s;
${media.greaterThan("large")`  
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row-reverse;
`}
`
const MainMessage = styled.div`
color: #fff;
font-family: 'Shippori Mincho', serif;
animation-duration: 2s;
${media.lessThan("large")`
margin-bottom: 10px;
font-size: 20px;
  &&& br{
    display: none;
  }
`}
${media.greaterThan("large")`
  text-align: right;
  font-size: 80px;
`}
`

const Subject = styled.div`
  font-size: 20px;
  text-align: left;
  ${media.lessThan("large")`
    font-size:14px;
  `}
  &&& p{
    margin-top:30px;
    ${media.lessThan("large")`
    margin-top:30px;
  `}
    :nth-child(4){
      margin-bottom: 30px;
      ${media.lessThan("large")`
        margin-bottom:10px;
      `}
    }
  }
`

const CheckBoxButton = styled.div`
  height: inherit;
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
  flex-wrap: wrap;
  height: 35px;
  font-size: 0px;
  padding: 5px;
`
