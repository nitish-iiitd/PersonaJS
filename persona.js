(function(global) {

    const queue = []; // Queue to store function calls
    const containerId = 'persona';

    function addToQueue(func) {
        queue.push(func);
    }

    async function processQueue() {
        for (const func of queue) {
            await func(); // Ensure each function is awaited before moving to the next one
        }
    }

    function loadBootstrapJS() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js';
        script.async = true;
        document.head.appendChild(script);
    }

    function getPersonaHostURL() {
        // Get the URL of the currently loaded persona.js file
        const script = document.querySelector('script[src*="persona.js"]');
        const scriptUrl = script.src;
        // Return the base URL (excluding persona.js filename)
        return scriptUrl.replace(/\/persona.js$/, '');
    }

    function loadTemplate(templateName) {
        const baseUrl = getPersonaHostURL();
        const templateUrl = `${baseUrl}/templates/${templateName}.html`;

        return fetch(templateUrl)
            .then(response => response.text())
            .catch(err => {
                console.error(`Error loading template: ${templateUrl}`, err);
                return '';
            });
    }

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

    function appendToPersona(html) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Div with id "'+containerId+'" not found.');
            return;
        }
        container.innerHTML += html;
    }

    function queueTemplateRender(templateName, data) {
        console.log("queueTemplateRender => "+templateName);
        addToQueue(async () => {
            const template = await loadTemplate(templateName); // Await the template loading
            const html = replacePlaceholders(template, data);
            appendToPersona(html);
        });
    }

    function queueListTemplateRender(parentTemplateName, itemTemplateName, dataArray, itemKey) {
        console.log("queueListTemplateRender => "+parentTemplateName);
        addToQueue(async () => {
            const itemTemplate = await loadTemplate(itemTemplateName); // Await the item template loading
            const itemsHtml = dataArray.map(item => {
                return replacePlaceholders(itemTemplate, { [itemKey]: item });
            }).join('');

            const parentTemplate = await loadTemplate(parentTemplateName); // Await the parent template loading
            const html = replacePlaceholders(parentTemplate, { [itemKey + 'Items'] : itemsHtml });
            appendToPersona(html);
        });
    }

    function addIntro(name, title, about_me, profile_pic) {
        console.log("addIntro");
        queueTemplateRender('introTemplate', { name, title, about_me, profile_pic });
    }

    function addContact(phone, email) {
        console.log("addContact");
        queueTemplateRender('contactTemplate', { phone, email });
    }

    function addExperience(experienceArray) {
        console.log("addExperience");
        queueListTemplateRender('experienceTemplate', 'experienceItemTemplate', experienceArray, 'experience');
    }

    function addSkills(skillsArray) {
        console.log("addSkills");
        queueListTemplateRender('skillTemplate','skillItemTemplate', skillsArray, "skill");
    }

    function addProjects(projectsArray) {
        console.log("addProjects");
        queueListTemplateRender('projectTemplate','projectItemTemplate', projectsArray, "project");
    }

    function addEducation(educationArray) {
        console.log("addEducation");
        queueListTemplateRender('educationTemplate','educationItemTemplate', educationArray, "education");
    }

    function addSocial(socialArray) {
        console.log("addSocial");
        queueListTemplateRender('socialTemplate','socialItemTemplate', socialArray, "social");
    }

    function addAchievement(achievementArray) {
        console.log("addAchievement");
        queueListTemplateRender('achievementTemplate','achievementItemTemplate', achievementArray, "achievement");
    }

    function addFooter(name) {
        console.log("addFooter");
        queueTemplateRender('footerTemplate', { name });
    }

    function render() {
        console.log("render");
        processQueue().then(() => {
            console.log('All sections rendered in sequence');
        });
    }

    // Expose the library to the global object
    global.PersonaJS = {
        addIntro: addIntro,
        addContact: addContact,
        addExperience: addExperience,
        addSkills: addSkills,
        addProjects: addProjects,
        addEducation: addEducation,
        addSocial: addSocial,
        addAchievement: addAchievement,
        addFooter: addFooter,
        render: render
    };

    // Load Bootstrap JS when the script is loaded
    loadBootstrapJS();

}(window));
