import React from 'react';
import { useParams } from 'react-router'
import '../../App.css';

const { useEffect, useState } = React; 

function Blog() {
  const { id } = useParams()
  const [blogpost, setBlogpost] = useState({});

  useEffect(() => {
    fetch(`/blogpost/${id}`).then(res => res.json()).then(data => {
      console.log('blogpost data: ', data)
      setBlogpost(data);
    });
  }, [id]);

  return (
    <div className="Blog">
      <header className="Blog-header">
        <h1>Title: {blogpost.title}</h1>
        <h4>Date: {blogpost.created_at}</h4>
        <h4>Description: {blogpost.description}</h4>
      </header>
    </div>
  );
}

export default Blog;