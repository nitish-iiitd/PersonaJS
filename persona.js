(function(global) {

    // Load Bootstrap JS
    function loadBootstrapJS() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
        script.async = true;
        document.head.appendChild(script);
    }

    // HTML templates with placeholders
    const templates = {
        navbar: `<nav class="navbar navbar-expand-lg navbar-dark">
                    <a class="navbar-brand" href="#" id="name">{{name}}</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ml-auto">
                            <li class="nav-item">
                                <a class="nav-link" href="#about">About Me</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#projects">Projects</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#contact">Contact</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#education">Education</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#skills">Skills</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#experience">Experience</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#achievements">Achievements</a>
                            </li>
                        </ul>
                    </div>
                </nav>`,
        main_content: `<div class="container mt-5"></div>`,
        name: `<h1 class="persona-name">{{name}}</h1>`,
        title: `<h2 class="persona-title">{{title}}</h2>`,
        about_me: `<p class="persona-description">{{description}}</p>`,
        experience: `<div class="persona-experience"><h3>Experience</h3><ul>{{experienceItems}}</ul></div>`,
        experienceItem: `<li>{{experience}}</li>`,
        footer: `<footer class="text-center py-3">
                    <p>&copy; 2024 {name}. All rights reserved.</p>
                </footer>`
    };

    // Internal function to append content to the persona div
    function appendToPersona(html) {
        const container = document.getElementById('persona');
        if (!container) {
            console.error('Div with id "persona" not found.');
            return;
        }
        container.innerHTML += html;
    }

    // Function to replace placeholders in a template with actual values
    function replacePlaceholders(template, values) {
        return template.replace(/{{(\w+)}}/g, function(match, key) {
            return values[key] !== undefined ? values[key] : match;
        });
    }

    function addNavbar(name) {
        const html = replacePlaceholders(templates.navbar, { name });
        appendToPersona(html);
    }

    function addMainContent(name) {
        const html = replacePlaceholders(templates.main_content, { name });
        appendToPersona(html);
    }

    function addName(name) {
        const html = replacePlaceholders(templates.name, { name });
        appendToPersona(html);
    }

    // Function to add the title
    function addTitle(title) {
        const html = replacePlaceholders(templates.title, { title });
        appendToPersona(html);
    }

    // Function to add the description
    function addDescription(description) {
        const html = replacePlaceholders(templates.description, { description });
        appendToPersona(html);
    }

    // Function to add the experience
    function addExperience(experienceArray) {
        const experienceItems = experienceArray.map(exp => replacePlaceholders(templates.experienceItem, { experience: exp })).join('');
        const html = replacePlaceholders(templates.experience, { experienceItems });
        appendToPersona(html);
    }

    function addFooter(name) {
        const html = replacePlaceholders(templates.footer, { name });
        appendToPersona(html);
    }

    // Expose the library to the global object
    global.PersonaJS = {
        addNavbar: addNavbar,
        addMainContent: addMainContent,
        addName: addName,
        addTitle: addTitle,
        addDescription: addDescription,
        addExperience: addExperience,
        addFooter: addFooter
    };

    loadBootstrapJS();

}(window));
