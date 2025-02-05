// Array to store routines
const routines = [];

// Initialize Sortable.js for the tasks container
const tasksContainer = document.getElementById("tasks-container");

Sortable.create(tasksContainer, {
  animation: 150,
  handle: ".task-row", // Specify the draggable handle
  ghostClass: "sortable-ghost", // Class name for the placeholder element
  filter: "#color-selector", // Exclude the color selector from being draggable
  preventOnFilter: false, // Allow interaction with the filtered element
  onEnd: function (evt) {
    const { oldIndex, newIndex } = evt;
    // Reorder the `currentRoutineTasks` array based on the new task order
    const movedTask = currentRoutineTasks.splice(oldIndex, 1)[0];
    currentRoutineTasks.splice(newIndex, 0, movedTask);
  },
});

function updateHomeView() {
  const homeImage = document.getElementById("home-image");
  const headerText = document.querySelector(".rethink-sans-header");
  const subheaderText = document.querySelector(".subheader");

  if (routines.length === 0) {
    homeImage.style.display = "block"; // Show the image
    headerText.textContent = "Routini"; // Initial app name
    headerText.style.fontSize = "50px"; // Slightly larger font size
    subheaderText.style.display = "block"; // Show the subheader
  } else {
    homeImage.style.display = "none"; // Hide the image
    headerText.textContent = "My Routines"; // Switch to "My Routines"
    headerText.style.fontSize = "32px"; // Normal font size
    subheaderText.style.display = "none"; // Hide the subheader
  }
}

document.addEventListener("DOMContentLoaded", () => {
  updateHomeView();
});

// Navigation function
// Navigation function
function navigateTo(view) {
  const homeView = document.getElementById("home-view");
  const newRoutineView = document.getElementById("new-routine-view");
  const playingView = document.getElementById("playing-view");
  const taskSheet = document.getElementById("task-sheet");

  // Hide all views first
  homeView.classList.add("hidden");
  newRoutineView.classList.add("hidden");
  playingView.classList.add("hidden");

  // Ensure task sheet is hidden initially
  taskSheet.classList.add("hidden");
  taskSheet.classList.remove("show");

  // Show the selected view
  if (view === "new-routine") {
    newRoutineView.classList.remove("hidden");

    // Reset Routine Name field to "Routine name"
    const routineNameInput = document.getElementById("routine-name");
    routineNameInput.value = ""; // Clear the field
    routineNameInput.placeholder = "✎ Routine name"; // Reset placeholder
  } else if (view === "home") {
    homeView.classList.remove("hidden");
  } else if (view === "playing") {
    playingView.classList.remove("hidden");
  }

  if (view !== "playing") {
    clearInterval(countdownInterval); // Stop countdowns on exit
  }
}

// References to the task sheet
const taskSheet = document.getElementById("task-sheet");
let currentRoutineTasks = []; // Array to store tasks for the current routine
let countdownInterval; // Store the interval globally for clearing

// Show the task sheet when the Add Task button is clicked
// Show the task sheet when the Add Task button is clicked
document.getElementById("add-task-btn").addEventListener("click", () => {
  taskSheet.classList.remove("hidden");
  taskSheet.classList.add("show");

  const scrim = document.getElementById("scrim");
  scrim.classList.remove("hidden"); // Show the scrim

  // Reset Task Name field to "Task Name"
  const taskNameInput = document.getElementById("task-name");
  taskNameInput.value = ""; // Clear the field
  taskNameInput.placeholder = "✎ Task Name"; // Reset placeholder
});

document.getElementById("scrim").addEventListener("click", () => {
  hideTaskSheet(); // This hides both the task sheet and the scrim
});

function hideTaskSheet() {
  taskSheet.classList.remove("show");
  taskSheet.classList.add("hidden");

  const scrim = document.getElementById("scrim");
  scrim.classList.add("hidden"); // Ensure scrim is hidden
}

// Routine name input field interactions
const routineNameInput = document.getElementById("routine-name");

routineNameInput.addEventListener("focus", () => {
  if (routineNameInput.value === "") {
    routineNameInput.placeholder = "";
  }
});

routineNameInput.addEventListener("blur", () => {
  if (routineNameInput.value === "") {
    routineNameInput.placeholder = "✎ Routine name";
  }
});

// Routine and Task classes
class Routine {
  constructor(name, tasks) {
    this.name = name;
    this.tasks = tasks;
  }
}

class Task {
  constructor(name, emoji, color, minutes, seconds) {
    this.name = name;
    this.emoji = emoji;
    this.color = color;
    this.minutes = minutes;
    this.seconds = seconds;
  }
}

// Adding functionality for "Add" button in task sheet
document.getElementById("add-task-to-list").addEventListener("click", () => {
  const taskName = document.getElementById("task-name").value.trim();
  const emoji = document.getElementById("emoji-selector").value;
  const color = document.getElementById("color-selector").value;
  const minutes =
    parseInt(document.getElementById("minutes-selector").value.trim(), 10) || 0;
  const seconds =
    parseInt(document.getElementById("seconds-selector").value.trim(), 10) || 0;

  if (
    !taskName ||
    (minutes === 0 && seconds === 0) ||
    isNaN(minutes) ||
    isNaN(seconds)
  ) {
    alert("Please provide a task name and a valid duration.");
    return;
  }

  const newTask = new Task(taskName, emoji, color, minutes, seconds);
  currentRoutineTasks.push(newTask);

  // Call the update function here
  updateCreateRoutineButtonState();

  const tasksContainer = document.getElementById("tasks-container");
  const taskRow = document.createElement("div");
  taskRow.classList.add("task-row");

  taskRow.innerHTML = `
  <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="2.9999" cy="2.10732" r="2.10732" fill="#9D9D9D"/>
<circle cx="2.9999" cy="10" r="2.10732" fill="#9D9D9D"/>
<circle cx="2.9999" cy="17.8927" r="2.10732" fill="#9D9D9D"/>
<circle cx="10.8927" cy="2.10732" r="2.10732" fill="#9D9D9D"/>
<circle cx="10.8927" cy="10" r="2.10732" fill="#9D9D9D"/>
<circle cx="10.8927" cy="17.8927" r="2.10732" fill="#9D9D9D"/>
</svg>

      <div class="task-name">${newTask.name}</div>
    </div>
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="font-size: 24px;">${newTask.emoji}</span>
      <div style="width: 20px; height: 20px; border-radius: 50%; background-color: ${newTask.color};"></div>
      <span class="task-duration">${newTask.minutes}m ${newTask.seconds}s</span>
      <span class="delete-task-icon">×</span>
    </div>
  </div>
`;

  taskRow.querySelector(".delete-task-icon").addEventListener("click", () => {
    currentRoutineTasks = currentRoutineTasks.filter(
      (task) => task !== newTask
    );
    taskRow.remove();
    updateCreateRoutineButtonState();
  });

  tasksContainer.appendChild(taskRow);

  document.getElementById("task-name").value = "";
  document.getElementById("minutes-selector").value = "";
  document.getElementById("seconds-selector").value = "";
  document.getElementById("color-selector").value = "#e0e0e0";

  hideTaskSheet();
});

// Add this new function to the end of your file
function updateCreateRoutineButtonState() {
  const createRoutineBtn = document.getElementById("create-routine-btn");
  if (currentRoutineTasks.length > 0) {
    createRoutineBtn.classList.remove("disabled");
    createRoutineBtn.disabled = false;
  } else {
    createRoutineBtn.classList.add("disabled");
    createRoutineBtn.disabled = true;
  }
}

// Call the function to initialize the state
updateCreateRoutineButtonState();

// Format duration as "Xm Ys"
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

document.getElementById("create-routine-btn").addEventListener("click", () => {
  const routineName = document.getElementById("routine-name").value.trim();

  if (!routineName) {
    alert("Please enter a routine name.");
    return;
  }

  if (currentRoutineTasks.length === 0) {
    alert("Please add at least one task to the routine.");
    return;
  }

  const newRoutine = new Routine(routineName, currentRoutineTasks);
  routines.push(newRoutine);

  const routinesContainer = document.getElementById("routines-container");
  const routineButton = document.createElement("button");
  routineButton.classList.add("btn", "routine-btn");
  routineButton.textContent = newRoutine.name;
  routineButton.addEventListener("click", () => {
    playRoutine(newRoutine.name);
  });
  routinesContainer.appendChild(routineButton);

  alert(
    `Routine "${newRoutine.name}" created with ${newRoutine.tasks.length} tasks!`
  );
  document.getElementById("routine-name").value = "";
  document.getElementById("tasks-container").innerHTML = "";
  currentRoutineTasks = [];
  navigateTo("home");

  updateHomeView(); // Update the home view
});

// Function to play a routine
function playRoutine(routineName) {
  const routine = routines.find((r) => r.name === routineName);
  if (!routine) {
    console.error(`Routine "${routineName}" not found.`);
    return;
  }

  const playingView = document.getElementById("playing-view");
  const playingMessage = document.getElementById("playing-message");

  playingMessage.innerHTML = "";
  navigateTo("playing");

  let currentTaskIndex = 0;

  function visualizeTask(task, durationInMilliseconds) {
    playingView.style.backgroundColor = task.color || "var(--bg)";
    const totalSeconds = Math.floor(durationInMilliseconds / 1000);
    let remainingSeconds = totalSeconds;

    playingMessage.innerHTML = `
            <div style="font-size: 100px; margin-bottom: 20px;">${
              task.emoji
            }</div>
            <div style="font-size: 24px; margin-bottom: 10px;">${
              task.name
            }</div>
            <div id="countdown" style="font-size: 32px;">${formatTime(
              remainingSeconds
            )}</div>
        `;

    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
      remainingSeconds--;
      document.getElementById("countdown").textContent =
        formatTime(remainingSeconds);

      if (remainingSeconds <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);
  }

  function playNextTask() {
    if (currentTaskIndex < routine.tasks.length) {
      const task = routine.tasks[currentTaskIndex];
      const durationInMilliseconds = (task.minutes * 60 + task.seconds) * 1000;

      visualizeTask(task, durationInMilliseconds);

      setTimeout(() => {
        clearInterval(countdownInterval);
        currentTaskIndex++;
        playNextTask();
      }, durationInMilliseconds);
    } else {
      clearInterval(countdownInterval);
      playingView.style.backgroundColor = "var(--bg)";
      navigateTo("home");
    }
  }

  playNextTask();
}

// Reference to the Task Name input field
const taskNameInput = document.getElementById("task-name");

// Clear placeholder on focus
taskNameInput.addEventListener("focus", () => {
  if (taskNameInput.value === "") {
    taskNameInput.placeholder = ""; // Clear placeholder
  }
});

// Restore placeholder if left blank
taskNameInput.addEventListener("blur", () => {
  if (taskNameInput.value === "") {
    taskNameInput.placeholder = "✎ Task Name"; // Restore placeholder
  }
});
