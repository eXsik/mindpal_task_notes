document.addEventListener("DOMContentLoaded", function () {
  let notes = [];
  let noteToDeleteId = null;
  let editingNoteId = null;

  const elements = {
    notesContainer: document.getElementById("notes-container"),
    notesList: document.getElementById("notes-list"),
    addNewButton: document.getElementById("add-new"),
    emptyAddNewButton: document.getElementById("empty-add-new"),
    searchInput: document.getElementById("search"),
    emptyState: document.getElementById("empty-state"),
    deleteModal: document.getElementById("delete-modal"),
    confirmDeleteButton: document.getElementById("confirm-delete"),
    cancelDeleteButton: document.getElementById("cancel-delete"),
    noteForm: document.getElementById("note-form"),
    noteTitleInput: document.getElementById("note-title"),
    noteBodyInput: document.getElementById("note-body"),
    saveNoteButton: document.getElementById("save-note"),
    cancelNoteButton: document.getElementById("cancel-note"),
  };

  function toggleEmptyState() {
    const isEmpty = notes.length === 0;
    elements.notesContainer.style.display = isEmpty ? "none" : "block";
    elements.emptyState.style.display = isEmpty ? "block" : "none";
  }

  function createNoteElement(note) {
    const noteItem = document.createElement("div");

    noteItem.classList.add("note-item");
    noteItem.innerHTML = `
      <div class='note-header'>
        <h2>${note.title}</h2>
        <div class="note-actions">
          <button class="edit-note-btn"><img class="edit-icon" src="./img/edit-icon.png" alt="Edit note icon" /></button>
          <button class="delete-note-btn"><img class="delete-icon" src="./img/delete-icon.png" alt="Delete note icon" /></button>
        </div>
      </div>
      <div class="note-content"><p>${note.body}</p></div>
      <div class="note-date">${note.date}</div>
    `;
    attachNoteEvents(noteItem, note.id);
    return noteItem;
  }

  function attachNoteEvents(noteItem, id) {
    const deleteButton = noteItem.querySelector(".delete-note-btn");
    const editButton = noteItem.querySelector(".edit-note-btn");

    deleteButton.addEventListener("click", () => showDeleteModal(id));
    editButton.addEventListener("click", () => editNoteById(id));
  }

  function renderNotes(filteredNotes = notes) {
    elements.notesList.innerHTML = "";
    filteredNotes.forEach((note) =>
      elements.notesList.appendChild(createNoteElement(note))
    );
    toggleEmptyState();
  }

  function resetNoteForm() {
    elements.noteTitleInput.value = "";
    elements.noteBodyInput.value = "";

    editingNoteId = null;
  }

  function showNoteForm() {
    if (notes.length === 0) {
      elements.emptyState.style.display = "none";
    }
    elements.noteForm.style.display = "block";
    elements.addNewButton.style.display = "none";
  }

  function hideNoteForm() {
    elements.noteForm.style.display = "none";
    elements.addNewButton.style.display = "block";
    resetNoteForm();
    toggleEmptyState();
  }

  function editNoteById(id) {
    const note = notes.find((n) => n.id === id);
    if (note) {
      elements.noteTitleInput.value = note.title;
      elements.noteBodyInput.value = note.body;
      editingNoteId = id;
      showNoteForm();
    }
  }

  function deleteNote() {
    notes = notes.filter((note) => note.id !== noteToDeleteId);
    renderNotes();
    hideDeleteModal();
  }

  function hideDeleteModal() {
    elements.deleteModal.style.display = "none";
    noteToDeleteId = null;
  }

  function showDeleteModal(id) {
    noteToDeleteId = id;
    elements.deleteModal.style.display = "flex";
  }

  function saveNote() {
    const title = elements.noteTitleInput.value;
    const body = elements.noteBodyInput.value;
    const today = new Date();
    const formattedDate = `${today.getDate()} ${today.toLocaleString(
      "default",
      { month: "long" }
    )}`;

    if (title && body) {
      if (editingNoteId) {
        const note = notes.find((n) => n.id === editingNoteId);
        note.title = title;
        note.body = body;
        note.date = formattedDate;
      } else {
        const id = Date.now().toString();
        notes.push({ id, title, body, date: formattedDate });
      }

      elements.searchInput.value = "";

      renderNotes();
      hideNoteForm();
    }
  }

  function filterNotes(query) {
    const lowerQuery = query.toLowerCase();
    const filteredNotes = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.body.toLowerCase().includes(lowerQuery)
    );
    renderNotes(filteredNotes);
  }

  elements.addNewButton.addEventListener("click", showNoteForm);
  elements.emptyAddNewButton.addEventListener("click", showNoteForm);
  elements.cancelNoteButton.addEventListener("click", hideNoteForm);
  elements.saveNoteButton.addEventListener("click", saveNote);
  elements.searchInput.addEventListener("input", (e) =>
    filterNotes(e.target.value)
  );

  elements.confirmDeleteButton.addEventListener("click", deleteNote);
  elements.cancelDeleteButton.addEventListener("click", hideDeleteModal);

  toggleEmptyState();
});
