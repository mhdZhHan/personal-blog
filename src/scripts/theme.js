window.addEventListener('load', ()=>{
    let darkMode = localStorage.getItem('light')
    
    const darkModeToggle = document.querySelector('#toggle_theme')

    let confirmText = "light mode is currently functional, but we're not satisfied with its performance just yet"

    const enableLightMode = ()=>{
        document.body.classList.add('light')
        localStorage.setItem('light', 'enabled')
    }

    const disableLightMode = () => {
        document.body.classList.remove('light')
        localStorage.setItem('light', null)
    }

    if (darkMode === 'enabled') {
        enableLightMode()
    }

    darkModeToggle.addEventListener('click', () => {
        darkMode = localStorage.getItem('light')
        if (darkMode !== 'enabled' && confirm(confirmText)) {
            enableLightMode()
        }else {
            disableLightMode()
        }
    })
})
