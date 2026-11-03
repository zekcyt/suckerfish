const addNoteBtn = document.getElementById("addNote");
const buttonContainer = document.getElementById("buttoncontainer");

function createNote(id = Date.now(), content = "", x = 100, y = 100) {
    const textArea = document.createElement("textarea");
    textArea.className = "note";
    textArea.value = content;
    textArea.style.left = x + "px";
    textArea.style.top = y + "px";

    textArea.addEventListener("input", () => saveNotes());
    textArea.addEventListener("mouseup", () => saveNotes());
    textArea.addEventListener("touchend", () => saveNotes());

    makeDraggable(textArea);

    buttonContainer.appendChild(textArea);
    saveNotes();

    window.open("_blank", "height=500,width=500");
}

function saveNotes() {
    const notes = Array.from(document.querySelectorAll(".note")).map(note => ({
        content: note.value,
        x: parseInt(note.style.left, 10),
        y: parseInt(note.style.top, 10),
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
        document.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseup", mouseUp);
        saveNotes();
    })
}