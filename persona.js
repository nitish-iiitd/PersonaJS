(function(global) {
    // Load Bootstrap JS
    function loadBootstrapJS() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
        script.async = true;
        document.head.appendChild(script);
    }

    // Function to load a template from an external file
    function loadTemplate(templateUrl) {
        return fetch(templateUrl)
            .then(response => response.text())
            .catch(err => {
                console.error(`Error loading template: ${templateUrl}`, err);
                return '';
            });
    }

    // Function to replace placeholders in a template with actual values
    function replacePlaceholders(template, values) {
        return template.replace(/{{\s*([\w.]+)\s*}}/g, function(match, key) {
            const keys = key.split('.'); // Split key by '.'
            let value = values;

            // Traverse through the object structure
            keys.forEach(k => {
                if (value && value[k] !== undefined) {
                    value = value[k];
                } else {
                    value = match; // If no match, return the placeholder
                }
            });

            return value;
        });
    }


    // Internal function to append content to the persona div
    function appendToPersona(html) {
        const container = document.getElementById('persona');
        if (!container) {
            console.error('Div with id "persona" not found.');
            return;
        }
        container.innerHTML += html;
    }

    // Function to add the name
    function addIntro(name, title, about_me, profile_pic) {
        loadTemplate('templates/introTemplate.html').then(template => {
            const html = replacePlaceholders(template, { name, title, about_me, profile_pic });
            appendToPersona(html);
        });
    }

    function addExperience(experienceArray) {
        loadTemplate('templates/experienceItemTemplate.html').then(itemTemplate => {
            const experienceItems = experienceArray.map(exp => {
                return replacePlaceholders(itemTemplate, { exp });
            }).join('');

            loadTemplate('templates/experienceTemplate.html').then(template => {
                const html = replacePlaceholders(template, { experienceItems });
                appendToPersona(html);
            });
        });
    }

    function addSkills(skillsArray) {
        loadTemplate('templates/skillItemTemplate.html').then(itemTemplate => {
            const skillItems = skillsArray.map(skill => {
                return replacePlaceholders(itemTemplate, { skill });
            }).join('');

            loadTemplate('templates/skillTemplate.html').then(template => {
                const html = replacePlaceholders(template, { skillItems });
                appendToPersona(html);
            });
        });
    }

    function addProjects(projectsArray) {
        loadTemplate('templates/projectItemTemplate.html').then(itemTemplate => {
            const projectItems = projectsArray.map(project => {
                return replacePlaceholders(itemTemplate, { project });
            }).join('');

            loadTemplate('templates/projectTemplate.html').then(template => {
                const html = replacePlaceholders(template, { projectItems });
                appendToPersona(html);
            });
        });
    }

    function addEducation(educationArray) {
        loadTemplate('templates/educationItemTemplate.html').then(itemTemplate => {
            const educationItems = educationArray.map(education => {
                return replacePlaceholders(itemTemplate, { education });
            }).join('');

            loadTemplate('templates/educationTemplate.html').then(template => {
                const html = replacePlaceholders(template, { educationItems });
                appendToPersona(html);
            });
        });
    }

    // Expose the library to the global object
    global.PersonaJS = {
        addIntro: addIntro,
        addExperience: addExperience,
        addSkills: addSkills,
        addProjects: addProjects,
        addEducation: addEducation
    };

    // Load Bootstrap JS when the script is loaded
    loadBootstrapJS();

}(window));
