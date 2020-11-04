import React from 'react';
import '../../App.css';
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'

function BlogPreview(props) {
  const { bp, isHome } = props

  const splitBlogpostDescription = bp.description.split(' ')
  const bpPreviewList = splitBlogpostDescription.slice(0, 20)
  const bpPreviewString = bpPreviewList.join(' ')
  const bpPreview = `${bpPreviewString}...`

  const bpLink = `blog/${bp.id}`

  return (
      <Col className="BlogPreview">
          <Card style={{ margin: '5px' }}>
          {/* <Card.Img/> */}
          <Card.Body>
              <Card.Title>{bp.title} {isHome} </Card.Title>
              <Card.Text>
                  {bpPreview}
              </Card.Text>
              <Button variant="primary" href={bpLink} >View Full Post</Button>
          </Card.Body>
          </Card>
      </Col>
  );
}

export default BlogPreview;