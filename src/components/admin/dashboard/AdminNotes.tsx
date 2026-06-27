"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StickyNote, Save, Trash2, Plus } from "lucide-react";

export function AdminNotes() {
  const [notes, setNotes] = useState<{ id: string; text: string; date: string }[]>([]);
  const [currentNote, setCurrentNote] = useState("");

  useEffect(() => {
    const savedNotes = localStorage.getItem("admin-notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const saveNote = () => {
    if (!currentNote.trim()) return;
    const newNote = {
      id: Date.now().toString(),
      text: currentNote,
      date: new Date().toLocaleDateString(),
    };
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem("admin-notes", JSON.stringify(updatedNotes));
    setCurrentNote("");
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(n => n.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem("admin-notes", JSON.stringify(updatedNotes));
  };

  return (
    <Card className="border-border shadow-xl shadow-primary/5 rounded-[32px] overflow-hidden bg-card flex flex-col h-[400px]">
      <CardHeader className="bg-card border-b border-border py-6 px-8 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 rounded-xl">
            <StickyNote className="h-5 w-5 text-yellow-500" />
          </div>
          <CardTitle className="text-xl font-black text-foreground">Admin Scratchpad</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex flex-col h-full gap-4 overflow-hidden">
        <div className="relative shrink-0">
          <textarea
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="Type a quick note for yourself..."
            className="w-full h-24 p-4 rounded-2xl bg-muted/50 border border-border focus:ring-1 focus:ring-primary focus:outline-none transition-all resize-none text-sm font-medium"
          />
          <button
            onClick={saveNote}
            className="absolute bottom-3 right-3 p-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 no-scrollbar">
          {notes.map((note) => (
            <div key={note.id} className="p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/10 group relative">
              <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mb-2">{note.date}</p>
              <p className="text-sm font-medium text-foreground whitespace-pre-wrap">{note.text}</p>
              <button
                onClick={() => deleteNote(note.id)}
                className="absolute top-4 right-4 p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {notes.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-30 py-8">
              <StickyNote className="w-12 h-12 mb-2" />
              <p className="text-xs font-black uppercase tracking-widest">No notes yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
