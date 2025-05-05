import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NotebookList from "../NotebookList/NotebookList";
import TagList from "../TagList/TagList";
import CreateNoteBtn from "../CreateNoteBtn/CreateNoteBtn";
import NoteList from "../NoteList/NoteList";
import "./Dashboard.css";

export default function Dashboard() {
    const user = useSelector((state) => state.session.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate("/login");
    }, [user, navigate]);

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <CreateNoteBtn />
                <NotebookList />
                <TagList />
            </aside>

            <main className="dashboard-main">
                <h1>Welcome, {user?.username}</h1>
                <NoteList />
            </main>
        </div>
    );
}
