import CreatableReactSelect from 'react-select/creatable'
import { Button, Col, Form, Row, Stack } from 'react-bootstrap'
import {v4 as uuid} from 'uuid'
import { Link, useNavigate } from 'react-router-dom'
import { FormEvent, useRef, useState } from 'react'
import { NoteData, Tag } from '../App'


type NoteFormProps = {
    onSubmit : (data : NoteData) => void,
    onAddTag : (tag:Tag) => void,
    availableTags : Tag[]
}

const NoteForm = ({onSubmit,onAddTag,availableTags} : NoteFormProps) => {
  const titleRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [selectedTags,setSelectedTags] = useState<Tag[]>([])
  const navigate = useNavigate()

  const handleSubmit = (e : FormEvent) => {
    e.preventDefault()
    onSubmit({
        title : titleRef.current!.value,
        body : textareaRef.current!.value,
        tags : selectedTags
    })
    navigate("..")
  }
  return (
    <>
    <Form onSubmit={handleSubmit}>
        <Stack gap={4}>
            <Row>
                <Col>
                    <Form.Group controlId='title'>
                        <Form.Label>Title</Form.Label>
                        <Form.Control required ref={titleRef}/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId='tags'>
                        <Form.Label>Tags</Form.Label>
                        <CreatableReactSelect 
                            value={selectedTags.map((tag) => {
                                return {label:tag.label, value:tag.id}
                            })}
                            onCreateOption ={(label) => {
                                const newTag = {id : uuid(),label}
                                onAddTag(newTag)
                                setSelectedTags((prev) => [...prev,newTag])
                            }}
                            options={availableTags.map((tag) => (
                                {label:tag.label, value:tag.id}
                            ))}
                            onChange={(tags) => {
                                setSelectedTags(tags.map(tag => {
                                    return {label:tag.label,id:tag.value}
                                }))
                            } }
                            isMulti
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group controlId='textarea'>
                <Form.Label>Body</Form.Label>
                <Form.Control required as='textarea' rows={12} ref={textareaRef}/>
            </Form.Group>
            <Stack direction='horizontal' gap={2} className='justify-content-end'>
                <Link to='..'>
                    <Button type='button' variant='outline-secondary'>Cancel</Button>
                </Link>
                <Button type='submit' variant='primary'>Save</Button>
            </Stack>
   
            </Stack>
    </Form>
    </>
  )
}

export default NoteForm