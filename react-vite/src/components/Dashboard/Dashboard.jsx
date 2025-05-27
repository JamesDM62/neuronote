import { useSelector } from "react-redux";
import NotebookList from "../NotebookList/NotebookList";
import BackgroundMedia from "../BackgroundMedia/BackgroundMedia";
import NoteList from "../NoteList/NoteList";
import "./Dashboard.css"; // Assuming you have a CSS file for styling

export default function Dashboard() {
  const user = useSelector((state) => state.session.user);
  if (!user) return null;

  return (
    <div className="relative min-h-screen">
      <BackgroundMedia
        src="/20250526_2007_Vibrant Brain Signals_simple_compose_01jw7mfvcged389phmbbecaz7g.mp4"
        type="video"
      />

      <div className="dashboard-layout relative z-10">
        <main className="dashboard-main">
          <h2>{user.first_name}&apos;s Workspace</h2>
          <NotebookList />
          <NoteList />
        </main>
      </div>
    </div>
  );
}




