import React from 'react';
import '../../App.css';
import BlogPreview from './BlogPreview'
import Row from 'react-bootstrap/Row'
import Jumbotron from 'react-bootstrap/Jumbotron'
import { doFetch, doAuthFetch } from '../utils'

const { useEffect, useState } = React; 

function Blogs() {
  const [blogposts, setBlogposts] = useState([]);
  const [error, setError] = useState('')

  useEffect(() => {
    getBlogPosts()
    
  }, []);

  async function getBlogPosts() {
    const route = '/blogposts'

    const data = await doFetch({ url: route, type: 'GET' })

    console.log('data res: ', data.res)

    if (data.error) {
      setError(data.errorMessage)
    } else {
      setBlogposts(data.res.blogposts)
    }

    console.log(data.res.blogposts === [])

  }
  

  return (
    <>
      <Jumbotron>
        <h1>All Posts</h1>
      </Jumbotron>
      <Row xs={1} md={2}>
        {blogposts.map(bp => <BlogPreview key={bp.id} bp={bp} isHome={false} />)}
      </Row>
    </>
  );
}

export default Blogs;