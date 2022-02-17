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
