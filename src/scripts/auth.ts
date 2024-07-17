import { actions } from "astro:actions"

const authForm = document.querySelector("#authForm") as HTMLFormElement

authForm?.addEventListener("submit", async (event) => {
    event.preventDefault()
    const formData = new FormData(authForm)
    console.log(formData)
    // passing the form data to createAccount action
    await actions.createAccount(formData)
})