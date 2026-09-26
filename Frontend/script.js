const API_URL = "https://google-keep-clone-ueuu.onrender.com/api/notes";


// ELEMENTS

const notesContainer =
  document.getElementById("notesContainer");

const noteCount =
  document.getElementById("noteCount");

const searchInput =
  document.getElementById("searchInput");

const newNoteBtn =
  document.getElementById("newNoteBtn");

const notePanel =
  document.getElementById("notePanel");

const closePanelBtn =
  document.getElementById("closePanelBtn");

const addNoteBtn =
  document.getElementById("addNoteBtn");

const titleInput =
  document.getElementById("titleInput");

const descriptionInput =
  document.getElementById("descriptionInput");

const clearAllBtn =
  document.getElementById("clearAllBtn");

const themeBtn =
  document.getElementById("themeBtn");


// EDIT ELEMENTS

const editPanel =
  document.getElementById("editPanel");

const closeEditBtn =
  document.getElementById("closeEditBtn");

const editTitle =
  document.getElementById("editTitle");

const editDescription =
  document.getElementById("editDescription");

const saveEditBtn =
  document.getElementById("saveEditBtn");


// VARIABLES

let notes = [];

let selectedColor = "#ffe66d";

let editingColor = "#ffe66d";

let editingNoteId = null;


// LOAD NOTES

document.addEventListener("DOMContentLoaded", () => {
  loadNotes();
});


// GET NOTES

async function loadNotes() {

  try {

    const response =
      await fetch(API_URL);

    const data =
      await response.json();

    if (!response.ok) {
      throw new Error("Failed to load notes");
    }

    notes = data;

    displayNotes(notes);

  } catch (error) {

    console.error(error);

    notesContainer.innerHTML = `
      <div class="empty-message">
        <h2>Unable to load notes</h2>
        <p>Make sure your backend is running.</p>
      </div>
    `;
  }
}


// DISPLAY NOTES

function displayNotes(noteList) {

  notesContainer.innerHTML = "";

  noteCount.textContent =
    `${noteList.length} ${
      noteList.length === 1
        ? "note"
        : "notes"
    }`;


  if (noteList.length === 0) {

    notesContainer.innerHTML = `
      <div class="empty-message">
        <h2>📝 No notes yet</h2>
        <p>Create your first note.</p>
      </div>
    `;

    return;
  }


  noteList.forEach((note) => {

    const card =
      document.createElement("div");

    card.className = "note-card";

    card.style.backgroundColor =
      note.color || "#ffe66d";


    card.innerHTML = `
      <div>

        <h3>
          ${escapeHTML(note.title)}
        </h3>

        <p>
          ${escapeHTML(note.description)}
        </p>

        <div class="note-date">
          Created:
          ${formatDate(note.createdAt)}
        </div>

      </div>


      <div class="note-actions">

        <button onclick="editNote('${note._id}')">
          ✏️ Edit
        </button>

        <button onclick="copyNote('${note._id}')">
          📋 Copy
        </button>

        <button onclick="deleteNote('${note._id}')">
          🗑️ Delete
        </button>

      </div>
    `;


    notesContainer.appendChild(card);

  });
}


// OPEN ADD NOTE PANEL

newNoteBtn.addEventListener("click", () => {

  notePanel.classList.remove("hidden");

});


// CLOSE ADD PANEL

closePanelBtn.addEventListener("click", () => {

  notePanel.classList.add("hidden");

});


// COLOR SELECTION

document
  .querySelectorAll(".color-btn")
  .forEach((button) => {

    button.addEventListener("click", () => {

      document
        .querySelectorAll(".color-btn")
        .forEach((btn) => {

          btn.classList.remove("active");

        });


      button.classList.add("active");

      selectedColor =
        button.dataset.color;

    });

  });


// ADD NOTE

addNoteBtn.addEventListener(
  "click",
  async () => {

    const title =
      titleInput.value.trim();

    const description =
      descriptionInput.value.trim();


    if (!title || !description) {

      alert(
        "Please enter title and description."
      );

      return;
    }


    try {

      const response =
        await fetch(API_URL, {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            title: title,

            description: description,

            color: selectedColor

          })

        });


      const data =
        await response.json();


      if (!response.ok) {

        alert(data.message);

        return;

      }


      titleInput.value = "";

      descriptionInput.value = "";

      notePanel.classList.add("hidden");


      loadNotes();


    } catch (error) {

      console.error(error);

      alert(
        "Cannot connect to backend."
      );

    }

  }
);


// SEARCH

searchInput.addEventListener(
  "input",
  () => {

    const searchText =
      searchInput.value
        .toLowerCase()
        .trim();


    const filteredNotes =
      notes.filter((note) =>

        note.title
          .toLowerCase()
          .includes(searchText)

        ||

        note.description
          .toLowerCase()
          .includes(searchText)

      );


    displayNotes(filteredNotes);

  }
);


// EDIT NOTE

async function editNote(id) {

  try {

    const response =
      await fetch(`${API_URL}/${id}`);

    const note =
      await response.json();


    if (!response.ok) {

      alert(note.message);

      return;

    }


    editingNoteId = id;


    editTitle.value =
      note.title;

    editDescription.value =
      note.description;


    editingColor =
      note.color || "#ffe66d";


    document
      .querySelectorAll(".edit-color-btn")
      .forEach((button) => {

        button.classList.remove("active");


        if (
          button.dataset.color ===
          editingColor
        ) {

          button.classList.add("active");

        }

      });


    editPanel.classList.remove(
      "hidden"
    );


  } catch (error) {

    console.error(error);

    alert("Failed to open note.");

  }

}


// EDIT COLOR

document
  .querySelectorAll(".edit-color-btn")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(
            ".edit-color-btn"
          )
          .forEach((btn) => {

            btn.classList.remove(
              "active"
            );

          });


        button.classList.add(
          "active"
        );


        editingColor =
          button.dataset.color;

      }
    );

  });


// CLOSE EDIT

closeEditBtn.addEventListener(
  "click",
  () => {

    editPanel.classList.add(
      "hidden"
    );

  }
);


// SAVE EDIT

saveEditBtn.addEventListener(
  "click",
  async () => {

    const title =
      editTitle.value.trim();

    const description =
      editDescription.value.trim();


    if (!title || !description) {

      alert(
        "Title and description are required."
      );

      return;

    }


    try {

      const response =
        await fetch(
          `${API_URL}/${editingNoteId}`,
          {

            method: "PUT",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              title: title,

              description:
                description,

              color: editingColor

            })

          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        alert(data.message);

        return;

      }


      editPanel.classList.add(
        "hidden"
      );


      loadNotes();


    } catch (error) {

      console.error(error);

      alert("Failed to update note.");

    }

  }
);


// DELETE NOTE

async function deleteNote(id) {

  const confirmDelete =
    confirm(
      "Delete this note?"
    );


  if (!confirmDelete) {
    return;
  }


  try {

    const response =
      await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE"
        }
      );


    if (!response.ok) {

      const data =
        await response.json();

      alert(data.message);

      return;

    }


    loadNotes();


  } catch (error) {

    console.error(error);

    alert(
      "Failed to delete note."
    );

  }

}


// COPY NOTE

async function copyNote(id) {

  try {

    const response =
      await fetch(
        `${API_URL}/${id}`
      );


    const note =
      await response.json();


    const copyResponse =
      await fetch(API_URL, {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          title:
            note.title + " Copy",

          description:
            note.description,

          color:
            note.color

        })

      });


    if (!copyResponse.ok) {

      const data =
        await copyResponse.json();

      alert(data.message);

      return;

    }


    loadNotes();


  } catch (error) {

    console.error(error);

    alert("Failed to copy note.");

  }

}


// CLEAR ALL

clearAllBtn.addEventListener(
  "click",
  async () => {

    if (
      !confirm(
        "Delete all notes?"
      )
    ) {
      return;
    }


    try {

      const response =
        await fetch(API_URL, {

          method: "DELETE"

        });


      if (!response.ok) {

        const data =
          await response.json();

        alert(data.message);

        return;

      }


      loadNotes();


    } catch (error) {

      console.error(error);

      alert(
        "Failed to delete notes."
      );

    }

  }
);


// DARK / LIGHT MODE

themeBtn.addEventListener(
  "click",
  () => {

    document.body.classList.toggle(
      "light"
    );


    if (
      document.body.classList.contains(
        "light"
      )
    ) {

      themeBtn.textContent = "🌙";

    } else {

      themeBtn.textContent = "☀️";

    }

  }
);


// FORMAT DATE

function formatDate(date) {

  return new Date(date)
    .toLocaleString("en-IN", {

      day: "2-digit",

      month: "short",

      year: "numeric",

      hour: "2-digit",

      minute: "2-digit"

    });

}


// SECURITY

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}