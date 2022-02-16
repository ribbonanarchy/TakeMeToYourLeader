var goBackBtn = document.querySelector("#goBack");

// will link to result page once its created
var gamePage = "./game";

goBackBtn.addEventListener("click", function () {
  document.location.replace(gamePage);
});
