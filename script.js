// ================================================================
//  Personal Information Generator — lógica del formulario
// ================================================================

// ---------- 1. Referencias a los elementos del HTML ----------
const form = document.getElementById("form");
const formError = document.getElementById("formError");
const result = document.getElementById("result");
const textBox = document.getElementById("text");
const photo = document.getElementById("photo");
const ageInput = document.getElementById("age");
const pictureInput = document.getElementById("picture");
const fileName = document.getElementById("fileName");

// Lista de los campos de texto (ids del HTML) en orden
const textFields = [
  "name", "age", "address", "city", "country", "nationality",
  "marital", "occupation", "workplace", "hobby", "subject"
];


// ---------- 2. Funciones para corregir mayúsculas ----------

// Quita espacios de más: "  juan   perez " -> "juan perez"
function clean(text) {
  return text.trim().replace(/\s+/g, " ");
}

// Primera letra en mayúscula y el resto en minúscula: "mATH" -> "Math"
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

// Cada palabra con mayúscula inicial: "university of chile" -> "University of Chile"
// Las palabras cortas (of, de, the...) quedan en minúscula si no son la primera.
const smallWords = ["of", "the", "and", "at", "in", "on", "de", "del", "la", "las", "los", "el", "y"];

function titleCase(text) {
  return clean(text)
    .split(" ")
    .map(function (word, index) {
      if (index > 0 && smallWords.includes(word.toLowerCase())) {
        return word.toLowerCase();
      }
      return capitalize(word);
    })
    .join(" ");
}

// Todo en minúscula (para usar dentro de una oración): "SINGLE" -> "single"
function lower(text) {
  return clean(text).toLowerCase();
}

// Elige "a" o "an" según la primera letra: "a teacher", "an engineer"
function article(word) {
  if (/^(uni|use|eu)/i.test(word)) return "a";
  return /^[aeiou]/i.test(word) ? "an" : "a";
}


// ---------- 3. El campo Age solo acepta números ----------
// Cada vez que el usuario escribe, se borra todo lo que no sea dígito.
ageInput.addEventListener("input", function () {
  ageInput.value = ageInput.value.replace(/\D/g, "");
});


// ---------- 4. Mostrar el nombre de la foto elegida ----------
pictureInput.addEventListener("change", function () {
  if (pictureInput.files.length > 0) {
    fileName.textContent = pictureInput.files[0].name;
    clearFieldError(pictureInput);
  } else {
    fileName.textContent = "No file selected";
  }
});

// El botón de foto también se puede activar con ENTER o espacio desde el teclado
document.querySelector(".file-btn").addEventListener("keydown", function (e) {
  if (e.key === " ") {
    e.preventDefault();
    pictureInput.click();
  }
  if (e.key === "Enter") {
    e.preventDefault();
    generate();
  }
});


// ---------- 5. Mensajes de error ----------
function showFieldError(input, message) {
  const field = input.closest(".field");
  field.classList.add("invalid");
  field.querySelector(".error").textContent = message;
}

function clearFieldError(input) {
  const field = input.closest(".field");
  field.classList.remove("invalid");
  field.querySelector(".error").textContent = "";
}

// Al escribir en un campo con error, el error desaparece
textFields.forEach(function (id) {
  const input = document.getElementById(id);
  input.addEventListener("input", function () {
    clearFieldError(input);
  });
});


// ---------- 6. Validar todo el formulario ----------
// Devuelve true si todo está bien, false si falta algo.
function validate() {
  let missing = 0;

  textFields.forEach(function (id) {
    const input = document.getElementById(id);
    if (clean(input.value) === "") {
      showFieldError(input, "This field is required.");
      missing++;
    } else {
      clearFieldError(input);
    }
  });

  // Validación extra de la edad (debe ser un número razonable)
  const age = Number(ageInput.value);
  if (ageInput.value !== "" && (age < 1 || age > 120)) {
    showFieldError(ageInput, "Please enter a valid age (1-120).");
    missing++;
  }

  // La foto también es obligatoria
  if (pictureInput.files.length === 0) {
    showFieldError(pictureInput, "Please upload a picture.");
    missing++;
  }

  if (missing > 0) {
    formError.textContent = "Error: please complete all the required fields correctly (" +
      missing + (missing === 1 ? " problem found)." : " problems found).");
    formError.hidden = false;
    return false;
  }

  formError.hidden = true;
  return true;
}


// ---------- 7. Generar el texto en inglés ----------
function generate() {
  // Si falta algo, NO se genera el texto y se oculta el resultado anterior
  if (!validate()) {
    result.hidden = true;
    return;
  }

  // Leer y corregir cada dato
  const name = titleCase(document.getElementById("name").value);
  const age = Number(ageInput.value);
  const address = titleCase(document.getElementById("address").value);
  const city = titleCase(document.getElementById("city").value);
  const country = titleCase(document.getElementById("country").value);
  const nationality = titleCase(document.getElementById("nationality").value);
  const marital = lower(document.getElementById("marital").value);
  // Si escriben "a teacher", quitamos el "a" porque lo agregamos nosotros
  const occupation = lower(document.getElementById("occupation").value).replace(/^(a|an)\s+/, "");
  const workplace = titleCase(document.getElementById("workplace").value)
    .replace(/^The /, "the ")
    .replace(/^University of/, "the University of");
  const hobby = lower(document.getElementById("hobby").value);
  const subject = titleCase(document.getElementById("subject").value);

  // Si es estudiante decimos "study at", si no "work at"
  const verb = occupation.includes("student") ? "study" : "work";
  const years = age === 1 ? "year" : "years";

  const text =
    "Hello! My name is " + name + " and I am " + age + " " + years + " old. " +
    "I live at " + address + ", in " + city + ", " + country + ". " +
    "I am " + nationality + " and I am " + marital + ". " +
    "I am " + article(occupation) + " " + occupation + " and I " + verb + " at " + workplace + ". " +
    "My favorite subject is " + subject + ", and in my free time my favorite hobby is " + hobby + ". " +
    "Nice to meet you!";

  textBox.textContent = text;

  // Mostrar la foto subida
  photo.src = URL.createObjectURL(pictureInput.files[0]);

  // Mostrar la tarjeta con animación (se reinicia cada vez)
  result.hidden = false;
  result.classList.remove("show");
  void result.offsetWidth; // truco para reiniciar la animación
  result.classList.add("show");
  result.scrollIntoView({ behavior: "smooth" });
}


// ---------- 8. Botón GENERATE y tecla ENTER ----------
// El evento "submit" ocurre al hacer clic en GENERATE
// y también al presionar ENTER dentro de cualquier campo de texto.
form.addEventListener("submit", function (e) {
  e.preventDefault(); // evita que la página se recargue
  generate();
});


// ---------- 9. EXTRA: botón CLEAR ----------
document.getElementById("clearBtn").addEventListener("click", function () {
  form.reset();
  textFields.forEach(function (id) {
    clearFieldError(document.getElementById(id));
  });
  clearFieldError(pictureInput);
  fileName.textContent = "No file selected";
  formError.hidden = true;
  result.hidden = true;
  document.getElementById("name").focus();
});


// ---------- 10. EXTRA: copiar el texto generado ----------
const copyBtn = document.getElementById("copyBtn");
copyBtn.addEventListener("click", function () {
  navigator.clipboard.writeText(textBox.textContent).then(function () {
    copyBtn.textContent = "✅ Copied!";
    setTimeout(function () {
      copyBtn.textContent = "📋 Copy text";
    }, 1500);
  });
});


// ---------- 11. EXTRA: tema claro / oscuro ----------
const themeBtn = document.getElementById("themeBtn");
themeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeBtn.textContent = isDark ? "☀️ Light mode" : "🌙 Dark mode";
});
