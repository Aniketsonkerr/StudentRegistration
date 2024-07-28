const button = document.querySelector(".button");
const textName = document.querySelector(".textName");
const textId = document.querySelector(".textId");
const textClass = document.querySelector(".textClass");
const textRollNo = document.querySelector(".textRollNo");

// Adds an event listener to the button to call registerStudent function on click
button.addEventListener("click", registerStudent);

// Loads students from localStorage and displays them when the page is loaded
document.addEventListener("DOMContentLoaded", loadStudents);

// Validates that the input name contains only characters and spaces
function validateInput(name) {
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!name.match(nameRegex)) {
    alert("Name should contain only characters.");
    return false;
  }

  return true;
}

// Function to register a new student
function registerStudent() {
  // Checks if all input fields are filled
  if (
    !textName.value ||
    !textId.value ||
    !textClass.value ||
    !textRollNo.value
  ) {
    return;
  }

  // Validates the name input
  if (!validateInput(textName.value)) {
    return;
  }

  // Creates a student object with input values
  const student = {
    name: textName.value,
    id: textId.value,
    class: textClass.value,
    rollNo: textRollNo.value,
  };

  // Adds the student to the table and saves the student in localStorage
  addStudentToTable(student);
  saveStudent(student);

  // Clears input fields after registration
  textName.value = "";
  textId.value = "";
  textClass.value = "";
  textRollNo.value = "";
}

// Function to save student in localStorage
function saveStudent(student) {
  const students = JSON.parse(localStorage.getItem("students")) || [];
  students.push(student);
  localStorage.setItem("students", JSON.stringify(students));
}

// Function to load students from localStorage and display them in the table
function loadStudents() {
  const students = JSON.parse(localStorage.getItem("students")) || [];
  students.forEach(addStudentToTable);
}

// Function to add a student row to the table
function addStudentToTable(student) {
  const table = document.querySelector("tbody");

  const detail = document.createElement("tr");
  detail.classList.add("studentsDetail");

  // Creates table row with student details and action buttons
  detail.innerHTML = `
    <td>${student.name}</td>
    <td>${student.id}</td>
    <td>${student.class}</td>
    <td>${student.rollNo}</td>
    <td>
      <button class="edit">edit</button>
      <button class="delete">delete</button>
    </td>
  `;

  table.appendChild(detail);

  // Adds event listeners for delete and edit buttons
  detail
    .querySelector(".delete")
    .addEventListener("click", () => removeStudent(detail, student.id));
  detail
    .querySelector(".edit")
    .addEventListener("click", () => editStudent(detail, student));
}

// Function to remove a student row from the table and localStorage
function removeStudent(detail, studentId) {
  detail.remove();

  const students = JSON.parse(localStorage.getItem("students")) || [];
  const updatedStudents = students.filter(
    (student) => student.id !== studentId
  );
  localStorage.setItem("students", JSON.stringify(updatedStudents));
}

// Function to enable editing of a student row
function editStudent(detail, student) {
  const cells = detail.querySelectorAll("td");

  // Replaces table cells with input fields for editing
  cells[0].innerHTML = `<input type="text" value="${student.name}">`;
  cells[1].innerHTML = `<input type="text" value="${student.id}" readonly>`;
  cells[2].innerHTML = `<input type="text" value="${student.class}">`;
  cells[3].innerHTML = `<input type="text" value="${student.rollNo}">`;

  const saveButton = document.createElement("button");
  saveButton.textContent = "save";
  saveButton.classList.add("save");
  cells[4].appendChild(saveButton);

  // Adds event listener to save the edited student details
  saveButton.addEventListener("click", () => {
    const updatedStudent = {
      name: cells[0].querySelector("input").value,
      id: cells[1].querySelector("input").value,
      class: cells[2].querySelector("input").value,
      rollNo: cells[3].querySelector("input").value,
    };

    // Validates the updated input
    if (!validateInput(updatedStudent.name)) {
      return;
    }

    const students = JSON.parse(localStorage.getItem("students")) || [];
    const studentIndex = students.findIndex((s) => s.id === student.id);

    // Updates the student in localStorage if found
    if (studentIndex !== -1) {
      students[studentIndex] = updatedStudent;
      localStorage.setItem("students", JSON.stringify(students));

      // Reverts input fields back to text after saving
      cells[0].innerText = updatedStudent.name;
      cells[1].innerText = updatedStudent.id;
      cells[2].innerText = updatedStudent.class;
      cells[3].innerText = updatedStudent.rollNo;
      cells[4].removeChild(saveButton);
    }
  });
}
