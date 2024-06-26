import 'bootstrap/dist/css/bootstrap.min.css'
import { Container } from 'react-bootstrap'
import { Navigate, Route, Routes } from 'react-router-dom'
import NewNote from './components/NewNote'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useMemo } from 'react'
import {v4 as uuid} from 'uuid'
import NoteList from './components/NoteList'
import NoteLayout from './components/NoteLayout'
import Note from './components/Note'
import EditNote from './components/EditNote'

export type NoteData = {
  title : string,
  body : string,
  tags : Tag[]
}

export type RawNoteData = {
  title : string,
  body : string,
  tagIds : string[]
}

export type Note = {
  id : string
} & NoteData

export type RawNote = {
  id : string
} & RawNoteData

export type Tag = {
  id : string,
  label : string
}

function App() {
  const [notes,setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
  const [tags,setTags] = useLocalStorage<Tag[]>("TAGS", [])

  const notesWithTags = useMemo(() => {
    return notes.map((note) => {
      return {...note, tags:tags.filter((tag) => note.tagIds.includes(tag.id))}
    })
  },[notes,tags])

  const onCreateNote = ({tags,...data} : NoteData) => {
    setNotes((prevNotes) => {
      return [
        ...prevNotes,
        {...data,id:uuid(),tagIds:tags.map((tag) =>   tag.id)}
      ]
    })
  }

  const onUpdateNote = (id:string,{tags,...data} : NoteData) => {
    setNotes((prevNotes) => {
      return prevNotes.map(note => {
        if(note.id === id) {
          return {
            ...note, ...data, tagIds:tags.map((tag) =>   tag.id)
          }
        }
        else {
          return note
        }
      })
    })
  }

  const onDeleteNote = (id:string) => {
    setNotes((prevNotes) => {
      return prevNotes.filter(note => note.id !== id)
    })
  }

  const addTag = (tag: Tag) => {
    setTags(prev => [...prev, tag])
  }
  return (
    <Container className='my-4'>
      <Routes>
        <Route path='/' element={<NoteList availableTags={tags} notes={notesWithTags}/>}/>
        <Route path='/new' element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags}/>}/>
        <Route path='/:id' element={<NoteLayout notes={notesWithTags}/>}>
          <Route index element={<Note onDelete={onDeleteNote}/>}/>
          <Route path='edit' element={<EditNote onSubmit={onUpdateNote} onAddTag={addTag} availableTags={tags}/>}/>
        </Route>
        <Route path='*' element={<Navigate to='/'/>}/>
      </Routes>
    </Container>
  )
}

export default App
