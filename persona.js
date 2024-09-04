(function(global) {
    function generatePersona(data) {
        const container = document.getElementById('persona');
        container.innerHTML = `
            <h1>${data.name}</h1>
            <h2>${data.title}</h2>
            <p>${data.description}</p>
            <h3>Experience</h3>
            <ul>
                ${data.experience.map(exp => `<li>${exp}</li>`).join('')}
            </ul>
        `;
    }

    // Expose the library to the global object
    global.PersonaLib = {
        generatePersona: generatePersona
    };

}(window));