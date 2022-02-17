// delete sentence on click
const delButtonHandler = async (event) => {
  if (event.target.hasAttribute("data-id")) {
    const id = event.target.getAttribute("data-id");

    const response = await fetch(`/api/sentence/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      document.location.replace("/sentence");
    } else {
      alert("Failed to delete sentence");
    }
  }
};

document
  .querySelector("#sentence-list")
  .addEventListener("click", delButtonHandler);


// Array of color and moods
let colorArray = ['gray', 'green', 'blue'];
let moodArray = ['clumsy', 'evil', 'giggly', 'itchy', 'serious', 'sleepy'];

let colorIndex = 0;
let moodIndex = 0;

let userMood = document.getElementById('current-mood').textContent;
let userColor = document.getElementById('current-color').textContent;

let mood = userMood[0].toUpperCase() + userMood.substring(1);
let color = userColor[0].toUpperCase() + userColor.substring(1);

const changeColor = async () =>  {
  color = colorArray[colorIndex];

  colorIndex++;
  if(colorIndex === (colorArray.length)){
    colorIndex = 0;
  }

  document.getElementById('current-color').textContent = color[0].toUpperCase() + color.substring(1);
  document.getElementById('alien-image').src = "/images/" + mood + "/" + color + ".png";

  // Send a POST request to the API endpoint
  const response = await fetch('/api/user/color', {
    method: 'PUT',
    body: JSON.stringify({ color }),
    headers: { 'Content-Type': 'application/json' },
    });
}

const changeMood = async () => {
  mood = moodArray[moodIndex];

  moodIndex++;
  if(moodIndex === (moodArray.length)){
    moodIndex = 0;
  }

  document.getElementById('current-mood').textContent = mood[0].toUpperCase() + mood.substring(1);
  document.getElementById('alien-image').src = "/images/" + mood + "/" + color + ".png";

  // Send a POST request to the API endpoint
  const response = fetch('/api/user/mood', {
    method: 'PUT',
    body: JSON.stringify({ mood }),
    headers: { 'Content-Type': 'application/json' },
    });
}