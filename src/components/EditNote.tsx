import { NoteData, Tag } from "../App"
import NoteForm from "./NoteForm"
import { useNote } from "./NoteLayout"

type EditNoteProps = {
   
    onSubmit : ( id : string, data:NoteData) => void,
    onAddTag : (tag:Tag) => void,
    availableTags : Tag[]
}

const EditNote = ({onSubmit,onAddTag,availableTags} : EditNoteProps) => {
    const note = useNote()
  return (
    <>
        <h1 className='mb-5'>New Note</h1>
        <NoteForm 
            title={note.title}
            body = {note.body}
            tags = {note.tags}
            onSubmit={data => onSubmit(note.id,data)} 
            onAddTag={onAddTag} availableTags={availableTags}
        />
    </>
  )
}

export default EditNote