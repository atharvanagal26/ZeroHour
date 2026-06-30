import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "../firebase";

const localizer = momentLocalizer(moment);

function CalendarView() {
  const [events, setEvents] = useState([]);

  // Load events from Firestore
  const loadEvents = async () => {
    try {
      const q = query(
        collection(db, "events"),
        where("uid", "==", auth.currentUser.uid)
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => {
  const d = doc.data();

  return {
    id: doc.id,
    title: d.title,
    start: d.start.toDate(),
    end: d.end.toDate(),
  };
});

      setEvents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Add new event
  const addEvent = async (slotInfo) => {
    const title = prompt("Enter Event Title");

    if (!title) return;

    try {
      await addDoc(collection(db, "events"), {
        uid: auth.currentUser.uid,
        title,
        start: slotInfo.start,
        end: slotInfo.end,
        type: "manual",
      });

      alert("Event Added!");

      // Refresh calendar
      loadEvents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        height: "700px",
        background: "#fff",
        borderRadius: "20px",
        padding: "20px",
      }}
    >
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={addEvent}
        style={{ height: "650px" }}
      />
    </div>
  );
}

export default CalendarView;