// script.js — navigation, dynamic date, and certificate course logic

// ---------- Responsive navigation ----------
const hamburger = document.querySelector("#hamburger");
const primaryNav = document.querySelector("#primaryNav");

hamburger.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("open");
  hamburger.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", isOpen);
});

// ---------- Dynamic footer dates ----------
const currentYear = document.querySelector("#currentYear");
currentYear.textContent = new Date().getFullYear();

const lastModified = document.querySelector("#lastModified");
lastModified.textContent = `Last Modification: ${document.lastModified}`;

// ---------- Certificate courses ----------
// Course data for the Web and Computer Programming certificate.
// "completed" reflects courses already finished at time of writing.
const courses = [
  {
    subject: "CSE",
    number: 111,
    title: "Programming with functions",
    credits: 3,
    completed: true,
  },
  {
    subject: "CSE",
    number: 110,
    title: "Introduction to programming",
    credits: 3,
    completed: true,
  },
  {
    subject: "CSE",
    number: 210,
    title: "Programming with Classes",
    credits: 2,
    completed: false,
  },
  {
    subject: "WDD",
    number: 130,
    title: "Web Fundamentals",
    credits: 1,
    completed: true,
  },
  {
    subject: "WDD",
    number: 131,
    title: "Dynamic Web Fundamentals",
    credits: 2,
    completed: true,
  },
  {
    subject: "WDD",
    number: 231,
    title: "Web Frontend Development I",
    credits: 2,
    completed: false,
  },
];

const courseContainer = document.querySelector("#courseCards");
const creditTotal = document.querySelector("#creditTotal");
const filterButtons = document.querySelectorAll(".filter-btn");

function displayCourses(courseList) {
  courseContainer.innerHTML = "";

  courseList.forEach((course) => {
    const card = document.createElement("div");
    card.classList.add("course-card");
    if (course.completed) {
      card.classList.add("completed");
    }

    card.textContent = `${course.subject} ${course.number}`;

    card.setAttribute(
      "aria-label",
      `${course.subject} ${course.number}, ${course.title}, ${
        course.completed ? "completed" : "not yet completed"
      }`
    );

    courseContainer.appendChild(card);
  });

  updateCreditTotal(courseList);
}

function updateCreditTotal(courseList) {
  const total = courseList.reduce((sum, course) => sum + course.credits, 0);
  creditTotal.textContent = total;
}

function filterCourses(filter) {
  if (filter === "all") {
    return courses;
  }
  return courses.filter((course) => course.subject === filter);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;
    displayCourses(filterCourses(filter));
  });
});

displayCourses(courses);