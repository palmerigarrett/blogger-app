import React from 'react'
import { AppContext } from "../../App";
import '../../App.css'
import BlogHome from './BlogHome'
import BlogCreate from './BlogCreate'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Row from 'react-bootstrap/Row'
import { doFetch, doAuthFetch } from '../utils'

const { useContext, useEffect, useState } = React;

function Home() {
  const { dispatch, state } = useContext(AppContext);
  const { token, user } = state;
  const [blogposts, setBlogposts] = useState([]);
  const [error, setError] = useState('')

  async function getHomeBlogposts() {
    const route = 'home/blogposts'
    const data = await doAuthFetch({url:route, token: token, type:'GET'})

    
    

    if (data.error) {
      setError(data.errorMessage)
    } else {
      setBlogposts(data.res.blogposts)
    }
  }
  useEffect(() => {
    console.log('state: ', state)
  })

  useEffect(() => {
    getHomeBlogposts()
  }, [])

  async function editPost(bp, id) {
    const bpEditID = id
    const route = `/blog/${bpEditID}`
    const requestBody = {
      ...bp
  }
    const data = await doAuthFetch({url:route, token: token, body:requestBody, type:'PUT'})
    
    if (data.error) {
      setError(data.errorMessage)
    } else {
      getHomeBlogposts()
    }
  }

  async function deletePost(id) {
    const bpDeleteID = id
    const route = `/blog/${bpDeleteID}`
    
    const data = await doAuthFetch({url:route, token: token, type:'DELETE'})

    if (data.error) {
      setError(data.errorMessage)
    } else {
      getHomeBlogposts()
    }
  }

  return (
    <>
    
      <Jumbotron>
        <h1 style={{ marginBottom: '25px' }} >Home Page</h1>
        {/* <BlogCreate onCreate={createPost} /> */}
        <BlogCreate />
      </Jumbotron>
      <Row xs={1} md={2}>
        {blogposts.map(bp => <BlogHome bp={bp} onEdit={editPost} onDelete={deletePost} key={bp.id} />)}
      </Row>
    </>
  );
}

export default Home;