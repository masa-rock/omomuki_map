import { Paper, TextField } from "@mui/material"
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import { useState, useContext } from "react"
import { Scrollbars } from 'rc-scrollbars'
import 'animate.css'
import media from "styled-media-query"
import { TagSelects } from "./modules/TagButton"
import { TagContext } from "../App"

export const Search = () => {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState()    
  const value = useContext(TagContext)

  const searchParams = {
    tags: value.checkedItems,
    keyword: keyword 
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
            <TagSelects/>            
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
