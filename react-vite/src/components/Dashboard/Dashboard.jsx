import { useSelector } from "react-redux";
import NotebookList from "../NotebookList/NotebookList";
import TagList from "../TagList/TagList";
import CreateNoteBtn from "../CreateNoteBtn/CreateNoteBtn";
import NoteList from "../NoteList/NoteList";
import "./Dashboard.css";

export default function Dashboard() {
  const user = useSelector((state) => state.session.user);

  if (!user) return null;

  return (
    <div className="dashboard">
      <aside>
      <h2>{user.first_name}&apos;s Workspace</h2>
        <NotebookList />
        <TagList />
      </aside>
      <main>
        <CreateNoteBtn />
        <NoteList />
      </main>
    </div>
  );
}

