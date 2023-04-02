const inputText = document.getElementById("inputText");
const fromLanguage = document.getElementById("fromLanguage");
const toLanguage = document.getElementById("toLanguage");
const translateButton = document.getElementById("translateButton");
const resultText = document.getElementById("resultText");
const copyButton = document.getElementById("copyButton");

translateButton.addEventListener("click", async () => {
  const text = inputText.value.trim();
  const langPair = `${fromLanguage.value}|${toLanguage.value}`;

  if (!text) return;

  const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=${encodeURIComponent(langPair)}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error fetching translation: ${response.status}`);
    }

    const data = await response.json();
    resultText.value = data.responseData.translatedText;
  } catch (error) {
    console.error("Error:", error.message);
    resultText.value = "There was an error translating";
  }
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      // ...

      // Add this line to save the translation to history
      saveTranslationToHistory(text, resultText.value);
    });
});

const swapIcon = document.getElementById("swapIcon");

swapIcon.addEventListener("click", () => {
  const fromLanguage = document.getElementById("fromLanguage");
  const toLanguage = document.getElementById("toLanguage");

  const tempValue = fromLanguage.value;
  fromLanguage.value = toLanguage.value;
  toLanguage.value = tempValue;

  const inputTextValue = inputText.value;
  const resultTextValue = resultText.value;
  inputText.value = resultTextValue;
  resultText.value = "";
});

copyButton.addEventListener("click", () => {
  resultText.select();
  document.execCommand("copy");
});

function saveTranslationToHistory(inputText, resultText) {
  let history = JSON.parse(localStorage.getItem("translationHistory")) || [];

  history.unshift({ inputText, resultText });
  if (history.length > 10) {
    history.pop();
  }

  localStorage.setItem("translationHistory", JSON.stringify(history));
}

function showHistory() {
  let history = JSON.parse(localStorage.getItem("translationHistory")) || [];
  let table = document.getElementById("historyTable");
  let tableBody = table.getElementsByTagName("tbody")[0];

  tableBody.innerHTML = "";

  history.forEach((entry) => {
    let row = tableBody.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);

    cell1.textContent = entry.inputText;
    cell2.textContent = entry.resultText;
  });

  table.classList.toggle("hidden");
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("translationHistory")) || [];
  const historyBody = document.getElementById("historyBody");
  historyBody.innerHTML = "";

  for (let item of history) {
    const row = document.createElement("tr");

    const fromCell = document.createElement("td");
    fromCell.innerText = item.from;
    row.appendChild(fromCell);

    const toCell = document.createElement("td");
    toCell.innerText = item.to;
    row.appendChild(toCell);

    const originalTextCell = document.createElement("td");
    originalTextCell.innerText = item.originalText;
    row.appendChild(originalTextCell);

    const translatedTextCell = document.createElement("td");
    translatedTextCell.innerText = item.translatedText;
    row.appendChild(translatedTextCell);

    historyBody.appendChild(row);
  }
}

document
  .getElementById("viewHistoryButton")
  .addEventListener("click", showHistory);

const clearHistoryButton = document.getElementById("clearHistoryButton");
clearHistoryButton.addEventListener("click", clearHistory);

function clearHistory() {
  localStorage.removeItem("translation.History");
  historyTable.style.display = "none";
  localStorage.clear();
}
