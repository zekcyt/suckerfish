const addNoteBtn = document.getElementById("addNote");
const appContainer = document.getElementById("app");

function createNote(id = Date.now(), content = "", x = 100, y = 200, isNew = false) {
    const noteCard = document.createElement("div");
    noteCard.className = "noteCard";
    noteCard.dataset.id = id;
    noteCard.style.position = "absolute";
    noteCard.style.left = `${x}px`;
    noteCard.style.top = `${y}px`;

    const header = document.createElement("div");
    header.className = "noteHeader";
    noteCard.appendChild(header);

    const popoutBtn = document.createElement("button");
    popoutBtn.className = "popoutBtn";
    popoutBtn.textContent = "popout";
    header.appendChild(popoutBtn);

    const saveBtn = document.createElement("button");
    saveBtn.className = "saveBtn";
    saveBtn.textContent = "save";
    header.appendChild(saveBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "deleteBtn";
    deleteBtn.textContent = "x";
    header.appendChild(popoutBtn);
    header.appendChild(saveBtn);
    header.appendChild(deleteBtn);
    

    const textArea = document.createElement("textarea");
    textArea.className = "note";
    textArea.dataset.id = id;
    textArea.value = content;
    textArea.placeholder = "start typing...";
    textArea.style.left = `${x}px`;
    textArea.style.top = `${y}px`;


popoutBtn.addEventListener("click", () => popoutNote(noteCard));

saveBtn.addEventListener("click", () => {
    const textContent = textArea.value;
    const fileName = `note-${id}.txt`;
    saveToFile(textContent, fileName);
});

textArea.addEventListener("input", () => autosaveNotes());

deleteBtn.addEventListener("click", () => {
    deleteNote(noteCard);
});

makeDraggable(noteCard, header);
noteCard.appendChild(textArea);
appContainer.appendChild(noteCard);

    if (isNew) { 
        autosaveNotes();
        window.open("about:blank", "-blank", "width=400,height=400")
    }
}

function autosaveNotes() {
    const notes = Array.from(document.querySelectorAll(".noteCard")).map(card => {
        const textArea = card.querySelector(".textarea");
        return {
        id: card.dataset.id,
        content: textArea ? textArea.value : "",
        x: parseInt(card.style.left, 10) || 100,
        y: parseInt(card.style.top, 10) || 100,
        };
    });
    localStorage.setItem("notes", JSON.stringify(notes));
}

function saveToFile(content, filename = "note.txt") {
    const blob= new Blob([content], {type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function deleteNote(noteCard) {
    noteCard.remove();
    autosaveNotes();
}

function loadNotes() {
    const saved = JSON.parse(localStorage.getItem("notes") || "[]");
    saved.forEach((note, index) => {
        createNote(index, note.content, note.x, note.y);
    });
}

addNoteBtn.addEventListener("click", () => createNote());
window.onload = () => loadNotes();

function makeDraggable(element, handle = element) {
    let offsetX, offsetY;

    handle.addEventListener("mousedown", e => {
        offsetX = e.clientX - parseInt(element.style.left);
        offsetY = e.clientY - parseInt(element.style.top);

        function mouseMove(e) {
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        }
        function mouseUp() {
            document.removeEventListener("mousemove", mouseMove);
            document.removeEventListener("mouseup", mouseUp);
            autosaveNotes();
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