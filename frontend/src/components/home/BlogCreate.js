import React from 'react';
import '../../App.css';
import { AppContext } from "../../App";
import { validString, validLength } from '../utils'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { doFetch, doAuthFetch } from '../utils'
import pageRefresh from '../utils/reusable/pageRefresh'

const { useContext, useState, useEffect } = React;

function BlogCreate(props) {
    const { onCreate } = props
    const { state } = useContext(AppContext)
    const { token } = state
    const [bpValue, setBPValue] = useState({
        title: '',
        description:'',
    })
    const [validValue, setValidValue] = useState({
        title: true,
        description: true,
    })
    const [isCreatingPost, setIsCreatingPost] = useState(false)
    const [error, setError] = useState('')

    function checkValidity() {
        let allValid = true
        let validTitle = true
        let validDescription = true

        if (validString(bpValue.title) === false || validLength(0, 100, bpValue.title) === false) {
            validTitle = false
            allValid = false
        }

        if (validString(bpValue.description) === false || validLength(0, 400, bpValue.description) === false) {
            validDescription = false
            allValid = false
        }

        setValidValue({
            title: validTitle,
            description: validDescription,
        })
        console.log('validityCheck called: ', allValid, validValue)
        return allValid
    }

    const handleCreatePost = (e) => { e.preventDefault(); if (checkValidity() === true) { createPost(); pageRefresh() }}

    const handleInputChange = (e) => {
        e.preventDefault()

        const name = e.target.name
        const value = e.target.value
        setBPValue({
            ...bpValue,
            [name]: value
        })
    }

    function toggleForm() {
        // FIXME: Use a damn ternary
        if (isCreatingPost) {
            setIsCreatingPost(false)
        } else {
            setIsCreatingPost(true)
        }
    }

    async function createPost() {
        const route = 'blog'
        const requestBody = {
            ...bpValue
        }
        const data = await doAuthFetch({url:route, token: token, body:requestBody, type:'POST'})
    
        console.log('data res: ', data.res)
    
        if (data.error) {
          setError(data.errorMessage)
        } else {
            // Should return a success message/modal. If alreadt being accomplished elsewhere,
            // no "else" block should be used.
          console.log(data.res)
        }
      }

    // ????
    // useEffect (() => {
    //     // window.location.reload(false);
    // },[isCreatingPost])

    return (
        <div className="BlogCreate">
            {isCreatingPost ?
                <Form onSubmit={handleCreatePost}>
                    <Form.Group>
                        <Form.Label>Title</Form.Label>
                        <Form.Control name="title" type="text" onChange={handleInputChange} value={bpValue.title} />
                        <Form.Text className="warningText" muted>
                            {validValue.title ? '' : '* Please enter a valid value between 1 and 100 characters'}
                        </Form.Text>
                        <Form.Label>Blogpost</Form.Label>
                        <Form.Control name="description" type="text" as="textarea" rows="5" onChange={handleInputChange} value={bpValue.description} />
                        <Form.Text className="warningText" muted>
                            {validValue.description ? '' : '* Please enter a valid value between 1 and 400 characters'}
                        </Form.Text>
                    </Form.Group>
                    <Button variant="danger" onClick={toggleForm}> Cancel </Button>
                    <Button variant="success" type="submit" > Create Post </Button>
                </Form>
                :
                // FIXME: onClick can use callback to set state if no other action is being made ie below
                // "onClick={() => setisCreatingPost(!isCreatingPost);}"
                <Button align="center" variant="primary" onClick={toggleForm}>Create a Blog Post!</Button>
            }
        </div>
    );
}

export default BlogCreate;