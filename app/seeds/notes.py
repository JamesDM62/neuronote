from app.models import db, Note, environment, SCHEMA
from sqlalchemy.sql import text

def seed_notes():
    notes = [
        #Notebook 1 user 1
        Note(user_id=1, notebook_id=1, title="Meeting Recap", content="Discussed priorities and timelines. Next steps agreed for the upcoming milestone."),
        Note(user_id=1, notebook_id=1, title="Wirefram Draft", content="Created initial wireframe layout in Figma, noted key user flow interactions."),
        Note(user_id=1, notebook_id=1, title="Journal Entry", content="Reflected on today's progress and setbacks. Need to improve time tracking."),
        Note(user_id=1, notebook_id=1, title="Next Steps", content="Outlined remaining work before deadline and identified blockers."),
        Note(user_id=1, notebook_id=1, title="Task Breakdown", content="Broke down deliverables into actionable tasks with time estimates."),

        #Notebook 2 user1
        Note(user_id=1, notebook_id=2, title="Roadmap Outline", content="Detailed roadmap for upcoming Q3 milestones and product phases."),
        Note(user_id=1, notebook_id=2, title="Launch Timeline", content="Projected launch dates and dependencies for each release phase."),
        Note(user_id=1, notebook_id=2, title="Client Call Summary", content="Summarized key takeaways and concerns from client sync."),
        Note(user_id=1, notebook_id=2, title="Design Audit", content="Reviewed current UI components and identified inconsistencies."),
        Note(user_id=1, notebook_id=2, title="Component Guidelines", content="Best practices and structure for reusable components."),

         # Notebook 3 user 2
        Note(user_id=2, notebook_id=3, title="Reflection - Week 1", content="Felt productive this week; struggled with focus midweek."),
        Note(user_id=2, notebook_id=3, title="Goals for April", content="Establish note syncing, mobile optimizations, and sharing."),
        Note(user_id=2, notebook_id=3, title="Team Feedback", content="Internal feedback on proposed task tagging implementation."),
        Note(user_id=2, notebook_id=3, title="Sync Notes", content="Meeting notes on frontend/backend interface agreements."),
        Note(user_id=2, notebook_id=3, title="Sketch Concepts", content="Three alternate layouts for dashboard redesign."),

        # Notebook 4 user 2
        Note(user_id=2, notebook_id=4, title="Retrospective Summary", content="Reflected on what went well and areas to improve."),
        Note(user_id=2, notebook_id=4, title="Feature Proposal", content="Wrote up idea for inline tagging inside notes."),
        Note(user_id=2, notebook_id=4, title="Interview Notes", content="Candidate A strong in React, candidate B good in SQL."),
        Note(user_id=2, notebook_id=4, title="Issue Review", content="Discussed open bugs and prioritized user-facing issues."),
        Note(user_id=2, notebook_id=4, title="Journal - Friday", content="Feeling burned out. Need to take better breaks."),

        # Notebook 5 user 3
        Note(user_id=3, notebook_id=5, title="User Flow Map", content="Mapped revised user flow for multi-step note creation."),
        Note(user_id=3, notebook_id=5, title="Review Highlights", content="Key points from code review on task filters."),
        Note(user_id=3, notebook_id=5, title="Documentation To-Do", content="List of gaps in current project docs."),
        Note(user_id=3, notebook_id=5, title="Notebook Wireframe", content="First version of the notebook overview UI."),
        Note(user_id=3, notebook_id=5, title="Workload Forecast", content="Estimate of upcoming sprint tasks and timing."),

        # Notebook 6 user 3
        Note(user_id=3, notebook_id=6, title="Priority Matrix", content="Classified features by urgency and business value."),
        Note(user_id=3, notebook_id=6, title="Postmortem", content="Lessons learned from recent feature delay."),
        Note(user_id=3, notebook_id=6, title="Script Draft", content="Outline for product walkthrough video."),
        Note(user_id=3, notebook_id=6, title="Metrics Recap", content="Week-over-week growth and retention trends."),
        Note(user_id=3, notebook_id=6, title="Editor Experience", content="Notes on improving rich text editing in notes.")
    ]

    db.session.add_all(notes)
    db.session.commit()

def undo_notes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.notes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text(f"DELETE FROM notes"))
    db.session.commit()
