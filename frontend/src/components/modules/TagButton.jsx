import media from "styled-media-query"
import styled from 'styled-components'
import axios from 'axios'
import { useState, useEffect, useContext } from "react"
import { TagContext } from "../Search"

export const TagSelects = () => {
  const [tags, setTags] = useState([])
  const value = useContext(TagContext)

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/tag`)
    .then(resp => {
      setTags(resp.data)
    })
    .catch(e => {
      console.log(e.response)
    })
  },[])

  const checkboxChange = e => {
    if(value.checkedItems.includes(e.target.value)){
      value.setCheckedItems(value.checkedItems.filter(item => item !== e.target.value))
    }else{
      value.setCheckedItems([...value.checkedItems, e.target.value])
    }
  }

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

  return(
  <CheckBoxButtons>
    {tags?.map((val) => {
      return(
        <CheckBoxButton id = {val.id} checkedItems = {value.checkedItems}>
          <label htmlFor = {`id_${ val.id }`} key = {`key_${ val.id }`}>
            <CheckBox
              id = {`id_${val.id}`}
              value = {val.id}
              onChange = {checkboxChange}
              checked = {value.checkedItems.includes(`${val.id}`)}
            />
            {val.name}
          </label>
        </CheckBoxButton>
      )
    })}
  </CheckBoxButtons>
  )
}

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
    transition: 0.5s;
  }
`

const CheckBoxButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 35px;
  font-size: 0px;
  padding: 5px;
`
