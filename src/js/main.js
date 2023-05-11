/* profession input script */
let professions = [
	"Адвокат",
	"Актер",
	"Акробат",
	"Ветеринар",
	"Врач-диетолог",
	"Врач-терапевт"
]

let professionInput = document.querySelector("#profession")
let professionList = document.querySelector(".field-profession__list")

// при потере фокуса инпутом - скрыть выпадающий список профессий
document.addEventListener("click", function (e) {
	if (e.target.closest(".field-profession")) {
		return false
	}
	if (
		professionList.classList.contains("show") &&
		!e.target.closest(".field-profession__list")
	) {
		professionList.classList.remove("show")
	}
})

// при вводе текста в инпут - показывать соответствующие элементы списка
professionInput.addEventListener("input", function (e) {
	if (professionInput.value.length == "") {
		professionList.classList.remove("show")
		return
	}

	let result = professions.filter((value) =>
		value.toLowerCase().startsWith(e.target.value.toLowerCase())
	)

	professionList.innerHTML = ""

	if (result.length > 0) {
		result.forEach((entry) => {
			let professionItems = document.querySelectorAll("#professions-list li")

			if (
				Array.from(professionItems).filter((elem) =>
					elem.textContent.includes(entry)
				).length == 0
			) {
				professionList.insertAdjacentHTML("afterbegin", `<li>${entry}</li>`)
			}
		})
		professionList.classList.add("show")
		return
	}
	professionList.classList.remove("show")
})

// при выборе элемента из выпадающего списка - подставить значение в инпут
// и скрыть выпадающий список
professionList.addEventListener("click", function (e) {
	if (e.target.closest("li")) {
		professionInput.value = e.target.textContent
		professionList.classList.remove("show")
	}
})

/* phone input script */
// by https://github.com/jackocnr/intl-tel-input
var phoneInput = document.querySelector("#telephone")
const iti = window.intlTelInput(phoneInput, {
	utilsScript:
		"https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js",
	initialCountry: "ru",
	preferredCountries: ["ru", "by", "kz"]
})

// validate phone
const reset = () => {
	phoneInput.classList.remove("error")
}

// on blur: validate
phoneInput.addEventListener("blur", () => {
	reset()
	if (phoneInput.value.trim()) {
		if (iti.isValidNumber()) {
			return
		} else {
			phoneInput.classList.add("error")
		}
	}
})

// on keyup / change flag: reset
phoneInput.addEventListener("change", reset)
phoneInput.addEventListener("keyup", reset)

/* validate form */
let nameInput = document.querySelector('input[name="firstname"]')
let surnameInput = document.querySelector('input[name="surname"]')
let telephoneInput = document.querySelector('input[name="telephone"]')

document.querySelector("form").addEventListener("submit", function (e) {
	let inputs = document.querySelectorAll("form input")
	let isValidate = true

	for (let i = 0; i < inputs.length; i++) {
		if (!inputs[i].value) {
			inputs[i].classList.add("error")
			isValidate = false
		} else {
			inputs[i].classList.remove("error")
		}
	}

	if (!iti.isValidNumber()) {
		telephoneInput.classList.add("error")
		isValidate = false
	}

	if (isValidate) {
		alert("Данные успешно отправлены")
		return true
	}
	e.preventDefault()
	return false
})
