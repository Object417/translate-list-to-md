import "./main.css"
import rawUrl from "./raw.txt?url"

const inputForm = document.querySelector("form")
const inputText = document.querySelector("#inputText")
const outputText = document.querySelector("#outputText")

const Storage = {
  set: (key, val) => localStorage.setItem(key, JSON.stringify(val)),
  get: (key) => JSON.parse(localStorage.getItem(key))
}

// События формы
inputForm.onsubmit = (e) => {
  e.preventDefault()
  outputText.value = formatText(inputText.value)
}
inputForm.onreset = (e) => {
  localStorage.clear()
}

// Автозаполнение формы
new Promise((resolve, reject) => {
  if (!Storage.get("notes")) {
    fetch(rawUrl).then((res) => {
      res.ok
        ? resolve(res.text())
        : reject(new Error(`${res.status} ${res.statusText}`))
    })
  } else {
    resolve(Storage.get("notes"))
  }
})
  .then((data) => {
    Storage.set("notes", data)
    inputText.value = data
    outputText.value = formatText(inputText.value)
  })
  .catch((err) => {
    console.error(err)
  })

// Перевод текста на язык MarkDown
function formatText(str) {
  // Убираем горизонтальные разделительные линии
  str = str.replace(/\W-{3,}\W/g, "")

  // Добавляем `### ` в начало строки, которая заканчивается на двоеточие
  str = str.replace(/\n(?=.*:\n)/g, "\n### ")

  // Убираем двоеточие в конце строк
  str = str.replace(/:\n/g, "\n")

  // Заменяем 2 пробела на `* `
  str = str.replace(/\n  (?=\w)/g, "\n- ")

  // Добавляем `>` в качестве разделите групп в списке
  str = str.replace(/\n(?=\n\*)/g, "\n>")

  // Убираем переносы строк в начале
  str = str.replace(/^\n*/g, "")

  return str
}
