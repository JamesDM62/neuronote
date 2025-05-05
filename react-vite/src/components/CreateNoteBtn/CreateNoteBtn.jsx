export default function CreateNoteBtn() {
    const handleClick = () => {
      alert("Open new note editor or route to /notes/new");
    };
  
    return <button onClick={handleClick}>+ New Note</button>;
  }
  