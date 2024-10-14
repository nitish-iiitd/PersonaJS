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
            console.error('Div with id "' + containerId + '" not found.');
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
            const itemsHtml = dataArray.map(item => Mustache.render(itemTemplate, {[itemKey]: item})).join(''); // Use Mustache.render for each item

            const parentTemplate = await loadTemplate(parentTemplateName); // Await the parent template loading
            const html = Mustache.render(parentTemplate, {[itemKey + 'Items']: itemsHtml}); // Render the parent template
            appendToPersona(html);
        });
    }

    /**
     * Adds the introduction
     * @param {string} name - Name of the user.
     * @param {string} title - Title of the user.
     * @param {string} about_me - Bio of the user.
     * @param {string} profile_pic - Picture of the user.
     * @example PersonaJS.addIntro("John Doe", "Web Developer", "I am a Full-Stack Developer", "john_doe.png");
     */
    function addIntro(name, title, about_me, profile_pic) {
        console.log("addIntro");
        queueTemplateRender('introTemplate', {name, title, about_me, profile_pic});
    }

    /**
     * Adds the contact
     * @param {string} phone - Phone number of the user.
     * @param {string} email - Email of the user.
     * @example PersonaJS.addContact("+91-88888888", "johndoe@personajs.com");
     */
    function addContact(phone, email) {
        console.log("addContact");
        queueTemplateRender('contactTemplate', {phone, email});
    }

    /**
     * Adds the user's professional experience details.
     * @param {Array<Object>} experienceArray - An array of experience objects.
     * @param {string} experienceArray[].organization_name - Name of the organization.
     * @param {string} experienceArray[].organization_logo - Logo of the organization (URL).
     * @param {string} experienceArray[].experience_type - Type of the experience (e.g., Professional, Internship).
     * @param {string} experienceArray[].work_duration - Duration of work at the organization.
     * @param {string} experienceArray[].role - Role or position held by the user.
     * @param {string} experienceArray[].supervisor - Supervisor's name during the experience.
     * @param {string} experienceArray[].work_description - Brief description of the work or responsibilities.
     * @example PersonaJS.addExperience([
     *  {
     *      "organization_name": "Newfold Digital (formerly Endurance International Group)",
     *      "organization_logo": "https://www.newfold.com/design-assets/_jcr_content/root/section_2010446581_c/responsivecolumns/column-1/image.coreimg.png/1685529184425/newfold-asset-logo.png",
     *      "experience_type": "Professional",
     *      "work_duration": "Jul'18 – Present",
     *      "role": "Lead Engineer",
     *      "supervisor": "Mr. Arnav Chaudhary",
     *      "work_description": "Part of Products Engineering Team whose main job is to integrate and maintain all hosting products for APAC region."
     *  }
     * ]);
     */
    function addExperience(experienceArray) {
        console.log("addExperience");
        queueListTemplateRender('experienceTemplate', 'experienceItemTemplate', experienceArray, 'experience');
    }

    /**
     * Adds the user's professional skill details.
     * @param {Array<Object>} skillsArray - An array of skill objects.
     * @param {string} skillsArray[].skill_name - Name of the skill.
     * @param {string} skillsArray[].logo_image - Logo or Icon of the skill (Devicon).
     * @example PersonaJS.addSkills([
     *  {
     *      "skill_name" : "Python",
     *      "logo_image" : "<i class='devicon-python-plain-wordmark colored'></i>"
     *  },
     *  {
     *      "skill_name" : "Django",
     *      "logo_image" : "<i class='devicon-django-plain colored'></i>"
     *  }
     * ]);
     */
    function addSkills(skillsArray) {
        console.log("addSkills");
        queueListTemplateRender('skillTemplate', 'skillItemTemplate', skillsArray, "skill");
    }

    /**
     * Adds the user's project details.
     * @param {Array<Object>} projectsArray - An array of project objects.
     * @param {string} projectsArray[].project_name - Name of the project.
     * @param {string} projectsArray[].project_duration - Duration of the project.
     * @param {string} projectsArray[].project_guide - Guide or mentor for the project.
     * @param {string} projectsArray[].team_size - Size of the project team.
     * @param {string} projectsArray[].description - Brief description of the project.
     * @param {string} projectsArray[].language_used - Programming language used in the project.
     * @param {string} projectsArray[].technology_used - Technologies or frameworks used in the project.
     * @example PersonaJS.addProjects([
     *  {
     *      "project_name": "Emotion Mining in Text",
     *      "project_duration": "(Aug,17 – Nov,17)",
     *      "project_guide": "Dr. Anubha Gupta",
     *      "team_size": "4",
     *      "description": "A system for detecting emotion from an english text, developed using supervised machine learning techniques.",
     *      "language_used": "Python",
     *      "technology_used": "Scikit Learn, Python Flask"
     *  }
     * ]);
     */
    function addProjects(projectsArray) {
        console.log("addProjects");
        queueListTemplateRender('projectTemplate', 'projectItemTemplate', projectsArray, "project");
    }

    /**
     * Adds the user's education details.
     * @param {Array<Object>} educationArray - An array of education objects.
     * @param {string} educationArray[].institute_logo - URL of the institute's logo.
     * @param {string} educationArray[].institute - Name of the institute.
     * @param {string} educationArray[].degree - Degree or qualification obtained.
     * @param {string} educationArray[].score_type - Type of score (e.g., CGPA, Percentage).
     * @param {string} educationArray[].score_value - Value of the score.
     * @param {string} educationArray[].duration - Duration of the education (start and end year).
     * @example PersonaJS.addEducation([
     *  {
     *      "institute_logo": "https://www.iiitd.ac.in/sites/default/files/images/logo/logo.jpg",
     *      "institute": "Indraprastha Institute of Information Technology, New Delhi",
     *      "degree": "M.tech (Data Engineering)",
     *      "score_type": "CGPA",
     *      "score_value": "8.63",
     *      "duration": "2016-2018"
     *  }
     * ]);
     */
    function addEducation(educationArray) {
        console.log("addEducation");
        queueListTemplateRender('educationTemplate', 'educationItemTemplate', educationArray, "education");
    }

    /**
     * Adds the user's social media profiles.
     * @param {Array<Object>} socialArray - An array of social media profile objects.
     * @param {string} socialArray[].platform_name - Name of the social media platform.
     * @param {string} socialArray[].platform_logo_bi_class - CSS class for the platform's logo (Bootstrap Icons).
     * @param {string} socialArray[].profile_url - URL of the user's profile on the platform.
     * @example PersonaJS.addSocial([
     *  {
     *      "platform_name": "LinkedIn",
     *      "platform_logo_bi_class": "linkedin",
     *      "profile_url": "https://www.linkedin.com/in/nitish-srivastava-353a61129/"
     *  }
     * ]);
     */
    function addSocial(socialArray) {
        console.log("addSocial");
        queueListTemplateRender('socialTemplate', 'socialItemTemplate', socialArray, "social");
    }

    /**
     * Adds the user's achievements.
     * @param {Array<string>} achievementArray - An array of achievement strings.
     * @example PersonaJS.addAchievement([
     *  "Secured City Rank-1 and AIR-3 in Indian Engineering Olympiad - 2016 (Computer Science).",
     *  "Published 'Create and Deploy a Java Web App to GAE' article on wikiHow with a 'Rising Star' award and 15,000+ views.",
     *  "Published 'Create and Deploy a Simple Ruby on Rails App' article on wikiHow having 7500+ views."
     * ]);
     */
    function addAchievement(achievementArray) {
        console.log("addAchievement");
        queueListTemplateRender('achievementTemplate', 'achievementItemTemplate', achievementArray, "achievement");
    }

    /**
     * Adds the user's interests.
     * @param {Array<string>} interestArray - An array of interest strings.
     * @example PersonaJS.addInterest([
     *  "Climate Change Adaptation and Mitigation",
     *  "Livelihood development and Social Impact Assessment"
     * ]);
     */
    function addInterest(interestArray) {
        console.log("addInterest");
        queueListTemplateRender('interestTemplate', 'interestItemTemplate', interestArray, "interest");
    }

    /**
     * Adds the user's publications.
     * @param {Array<string>} publicationArray - An array of publication strings.
     * @example PersonaJS.addPublication([
     *  "Scientific paper published in the Journal of Phytological Research. ISSN 0970-5767. Titled Light Microscopic study of pollen morphology on selected species of Jatropha L."
     * ]);
     */
    function addPublication(publicationArray) {
        console.log("addPublication");
        queueListTemplateRender('publicationTemplate', 'publicationItemTemplate', publicationArray, "publication");
    }

    /**
     * Adds the user's training experiences.
     * @param {Array<string>} trainingArray - An array of training experience descriptions.
     * @example PersonaJS.addTraining([
     *  "Visited Nainital, Uttarakhand in the academic session 2016-2017. For the study and identification of the local flora and fauna, collection of various gymnosperms and bryophytes found in that region and the compilation of herbarium of the collection.",
     *  "Visited Asan Barrage Dehradun in the academic year 2016-2017 for the study and identification of migratory and resident birds of Asian-Australasian flyway."
     * ]);
     */
    function addTraining(trainingArray) {
        console.log("addTraining");
        queueListTemplateRender('trainingTemplate', 'trainingItemTemplate', trainingArray, "training");
    }

    /**
     * Adds the footer
     * @param {string} name - Name of the user.
     * @example PersonaJS.addFooter("John Doe");
     */
    function addFooter(name) {
        console.log("addFooter");
        queueTemplateRender('footerTemplate', {name});
    }

    /**
     * Renders the complete page. It is required to generate the page.
     * @example PersonaJS.render();
     */
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
