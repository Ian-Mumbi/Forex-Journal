console.log('Client js loaded')

document.querySelector("#sortBy").addEventListener('change', ( e) => {
    fetch('/trades?sort='+e.target.value)
})