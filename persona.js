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

    function loadMustacheJS() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mustache@4.2.0/mustache.min.js';
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

    function appendToPersona(html) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Div with id "'+containerId+'" not found.');
            return;
        }
        container.innerHTML += html;
    }

    function queueTemplateRender(templateName, data) {
        console.log("queueTemplateRender => " + templateName);
        addToQueue(async () => {
            const template = await loadTemplate(templateName); // Await the template loading
            const html = Mustache.render(template, data); // Render the template using Mustache.js
            appendToPersona(html);
        });
    }

    function queueListTemplateRender(parentTemplateName, itemTemplateName, dataArray, itemKey) {
        console.log("queueListTemplateRender => " + parentTemplateName);
        addToQueue(async () => {
            const itemTemplate = await loadTemplate(itemTemplateName); // Await the item template loading
            const itemsHtml = dataArray.map(item => Mustache.render(itemTemplate, { [itemKey]: item })).join(''); // Use Mustache.render for each item

            const parentTemplate = await loadTemplate(parentTemplateName); // Await the parent template loading
            const html = Mustache.render(parentTemplate, { [itemKey + 'Items']: itemsHtml }); // Render the parent template
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

    function addInterest(interestArray) {
        console.log("addInterest");
        queueListTemplateRender('interestTemplate','interestItemTemplate', interestArray, "interest");
    }

    function addPublication(publicationArray) {
        console.log("addPublication");
        queueListTemplateRender('publicationTemplate','publicationItemTemplate', publicationArray, "publication");
    }

    function addTraining(trainingArray) {
        console.log("addTraining");
        queueListTemplateRender('trainingTemplate','trainingItemTemplate', trainingArray, "training");
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
        addInterest: addInterest,
        addPublication: addPublication,
        addTraining: addTraining,
        addFooter: addFooter,
        render: render
    };

    // Load Bootstrap JS, Mustache JS when the script is loaded
    loadBootstrapJS();
    loadMustacheJS();

}(window));
