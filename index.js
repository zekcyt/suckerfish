const addNoteBtn = document.getElementById("addNote");
const appContainer = document.getElementById("app");

function createNote(id = Date.now(), content = "", x = 100, y = 100, isNew = false) {
    const textArea = document.createElement("textarea");
    textArea.className = "note";
    textArea.dataset.id = id;
    textArea.value = content;
    textArea.style.left = `${x}px`;
    textArea.style.top = `${y}px`;

    textArea.addEventListener("input", () => saveNotes());

    makeDraggable(textArea);
    appContainer.appendChild(textArea);

    if (isNew) { 
        saveNotes();
        window.open("about:blank", "-blank", "width=400,height=400")
    }
}

function saveNotes() {
    const notes = Array.from(document.querySelectorAll(".note")).map(note => ({
        id: note.dataset.id,
        content: note.value,
        x: parseInt(note.style.left, 10) || 100,
        y: parseInt(note.style.top, 10) || 100,
    }));
    localStorage.setItem("notes", JSON.stringify(notes));
}

function loadNotes() {
    const saved = JSON.parse(localStorage.getItem("notes") || "[]");
    saved.forEach((note, index) => {
        createNote(index, note.content, note.x, note.y);
    });
}

addNoteBtn.addEventListener("click", () => createNote());
window.onload = () => loadNotes();

function makeDraggable(element) {
    let offsetX, offsetY;

    element.addEventListener("mousedown", e => {
        offsetX = e.clientX - parseInt(element.style.left);
        offsetY = e.clientY - parseInt(element.style.top);

        function mouseMove(e) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        }
        function mouseUp() {
            document.removeEventListener("mousemove", mouseMove);
            document.removeEventListener("mouseup", mouseUp);
            saveNotes();
        }

        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", mouseUp);
    });
}

function openNoteWindow() {
    const popup = window.open("", "Note", "width=400,height=400, resizeable=yes");
    if (!popup) return;

    popup.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>New Note</title>
            <style>
                body { background: #121212; color: #efefef; font-family: monospace; padding: 10px; margin: 0; }
                textarea { width: 100%; height: 90vh; background: transparent; color: #efefef; border: none; outline: none; resize: none; font-size: 1rem; }
            </style>
        </head>
        <body>
            <textarea id="popupNote" placeholder="Type note here..."></textarea>
            <script>
                const ta = document.getElementById('popupNote');
                ta.value = localStorage.getItem('transient_note') || '';
                ta.addEventListener('input', () => {
                    localStorage.setItem('transient_note', ta.value);
                });
            </script>
        </body>
        </html>
    `);
}