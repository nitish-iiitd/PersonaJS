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

    /* ----------------------------------------------------------
       Theming
       Two presentation modes share the same rendered sections:
         'paper' -> printable two-column résumé sheet (default)
         'web'   -> immersive scrolling portfolio website
       Switchable any time via PersonaJS.setTheme(mode).
       ---------------------------------------------------------- */
    let currentTheme = 'paper';
    let rawSectionsHTML = null;   // cache of flat rendered sections

    function setTheme(mode) {
        currentTheme = (mode === 'web') ? 'web' : 'paper';
        if (rawSectionsHTML !== null) {
            applyTheme();
        }
        return currentTheme;
    }

    function captureRawSections() {
        const container = document.getElementById(containerId);
        if (!container) return;
        rawSectionsHTML = Array.from(container.children)
            .filter(el => el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE')
            .map(el => el.outerHTML);
    }

    function teardownInteractions() {
        if (global.__personaScroll) {
            window.removeEventListener('scroll', global.__personaScroll);
            global.__personaScroll = null;
        }
        if (global.__personaObserver) {
            global.__personaObserver.disconnect();
            global.__personaObserver = null;
        }
    }

    function applyTheme() {
        const container = document.getElementById(containerId);
        if (!container || rawSectionsHTML === null) return;

        teardownInteractions();
        container.className = '';
        container.innerHTML = rawSectionsHTML.join('');

        document.body.classList.remove('persona-mode-paper', 'persona-mode-web');
        document.body.classList.add(currentTheme === 'web' ? 'persona-mode-web' : 'persona-mode-paper');

        if (currentTheme === 'web') {
            buildWebLayout(container);
        } else {
            buildPaperLayout(container);
        }
    }

    /* ---- Paper: two-column résumé sheet ---- */
    function buildPaperLayout(container) {
        const sidebar = document.createElement('aside');
        sidebar.className = 'persona-sidebar';
        const main = document.createElement('main');
        main.className = 'persona-main';
        const footerWrap = document.createElement('div');
        footerWrap.className = 'persona-footer-wrap';

        Array.from(container.children).forEach(child => {
            if (child.classList.contains('persona-aside')) {
                sidebar.appendChild(child);
            } else if (child.classList.contains('persona-footer')) {
                footerWrap.appendChild(child);
            } else {
                main.appendChild(child);
            }
        });

        container.innerHTML = '';
        container.classList.add('persona-grid');
        container.appendChild(sidebar);
        container.appendChild(main);
        if (footerWrap.children.length) {
            container.appendChild(footerWrap);
        }
    }

    /* ---- Web: immersive scrolling portfolio ---- */
    function buildWebLayout(container) {
        const byType = {};
        Array.from(container.children).forEach(el => {
            const t = el.getAttribute && el.getAttribute('data-section');
            if (t) byType[t] = el;
        });

        const intro = byType.intro;
        const text = sel => (intro && intro.querySelector(sel)) ? intro.querySelector(sel).textContent.trim() : '';
        const name = text('.persona-intro__name');
        const title = text('.persona-intro__title');
        const about = text('.persona-intro__about');
        const photo = (intro && intro.querySelector('.persona-intro__photo'))
            ? intro.querySelector('.persona-intro__photo').getAttribute('src') : '';

        // Social icons (reused in hero + contact)
        let socialHTML = '';
        if (byType.social) {
            byType.social.querySelectorAll('.persona-social-link').forEach(a => {
                const icon = a.querySelector('i') ? a.querySelector('i').outerHTML : '';
                const label = a.getAttribute('aria-label') || '';
                socialHTML += '<a href="' + a.getAttribute('href') + '" target="_blank" rel="noopener" '
                    + 'class="persona-web-social" aria-label="' + label + '">' + icon + '</a>';
            });
        }

        // Contact details (email href may be obfuscated by the host, so fall back to text)
        let phone = '', email = '';
        if (byType.contact) {
            byType.contact.querySelectorAll('a').forEach(a => {
                const href = a.getAttribute('href') || '';
                const txt = a.textContent.trim();
                if (href.indexOf('tel:') === 0) {
                    phone = txt;
                } else if (href.indexOf('mailto:') === 0 || txt.indexOf('@') !== -1) {
                    email = txt;
                }
            });
        }

        // Progress bar
        const progress = document.createElement('div');
        progress.className = 'persona-web-progress';

        // Nav (auto-built from body sections)
        const navOrder = ['experience', 'projects', 'skills', 'education', 'achievements', 'publications', 'trainings', 'interests'];
        let navLinks = '';
        navOrder.forEach(t => {
            if (byType[t]) {
                const h = byType[t].querySelector('.persona-heading h2, .persona-aside-heading');
                const label = h ? h.textContent.trim() : t;
                navLinks += '<a href="#sec-' + t + '" class="persona-web-navlink">' + label + '</a>';
            }
        });
        const nav = document.createElement('header');
        nav.className = 'persona-web-nav';
        nav.innerHTML =
            '<a href="#top" class="persona-web-brand">' + name + '</a>'
            + '<nav class="persona-web-navlinks">' + navLinks + '</nav>'
            + '<a href="#sec-contact" class="persona-web-navcta">Get in touch</a>';

        // Hero
        const hero = document.createElement('section');
        hero.className = 'persona-web-hero';
        hero.id = 'top';
        hero.innerHTML =
            '<div class="persona-web-hero__bg" aria-hidden="true"></div>'
            + '<div class="persona-web-hero__inner">'
            +   '<div class="persona-web-hero__text">'
            +     '<p class="persona-web-eyebrow">' + title + '</p>'
            +     '<h1 class="persona-web-hero__name">' + name + '</h1>'
            +     '<p class="persona-web-hero__about">' + about + '</p>'
            +     '<div class="persona-web-hero__actions">'
            +       '<a href="#sec-contact" class="persona-web-btn persona-web-btn--solid">Let&rsquo;s talk</a>'
            +       '<a href="#sec-experience" class="persona-web-btn persona-web-btn--ghost">View my work</a>'
            +     '</div>'
            +     (socialHTML ? '<div class="persona-web-hero__social">' + socialHTML + '</div>' : '')
            +   '</div>'
            +   (photo ? '<div class="persona-web-hero__photo"><img src="' + photo + '" alt="' + name + '"></div>' : '')
            + '</div>'
            + '<a href="#sec-' + (byType.experience ? 'experience' : 'projects') + '" class="persona-web-scrollcue" aria-label="Scroll down"><i class="bi bi-chevron-down"></i></a>';

        // Body sections (ordered)
        const bodyWrap = document.createElement('div');
        bodyWrap.className = 'persona-web-body';
        const bodyOrder = ['experience', 'skills', 'projects', 'education', 'achievements', 'publications', 'trainings', 'interests'];
        bodyOrder.forEach(t => {
            if (byType[t]) {
                const el = byType[t];
                el.id = 'sec-' + t;
                el.classList.add('persona-web-section', 'persona-reveal');
                bodyWrap.appendChild(el);
            }
        });

        // Contact band
        const contact = document.createElement('section');
        contact.className = 'persona-web-contact persona-reveal';
        contact.id = 'sec-contact';
        contact.innerHTML =
            '<div class="persona-web-contact__inner">'
            + '<p class="persona-web-eyebrow">Get in touch</p>'
            + '<h2 class="persona-web-contact__title">Let&rsquo;s build something together.</h2>'
            + '<div class="persona-web-contact__actions">'
            + (email ? '<a class="persona-web-btn persona-web-btn--solid" href="mailto:' + email + '"><i class="bi bi-envelope-fill"></i> ' + email + '</a>' : '')
            + (phone ? '<a class="persona-web-btn persona-web-btn--ghost" href="tel:' + phone + '"><i class="bi bi-telephone-fill"></i> ' + phone + '</a>' : '')
            + '</div>'
            + (socialHTML ? '<div class="persona-web-contact__social">' + socialHTML + '</div>' : '')
            + '</div>';

        const footer = byType.footer || null;

        container.innerHTML = '';
        container.classList.add('persona-web');
        container.appendChild(progress);
        container.appendChild(nav);
        container.appendChild(hero);
        container.appendChild(bodyWrap);
        container.appendChild(contact);
        if (footer) container.appendChild(footer);

        initWebInteractions(container);
    }

    function initWebInteractions(container) {
        // Scroll-reveal
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('is-visible');
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        container.querySelectorAll('.persona-reveal').forEach(el => observer.observe(el));
        global.__personaObserver = observer;

        // Progress bar + scroll-spy + nav background
        const progress = container.querySelector('.persona-web-progress');
        const nav = container.querySelector('.persona-web-nav');
        const navlinks = Array.from(container.querySelectorAll('.persona-web-navlink'));
        const targets = navlinks.map(a => container.querySelector(a.getAttribute('href'))).filter(Boolean);

        function onScroll() {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const y = window.pageYOffset || document.documentElement.scrollTop;
            if (progress) progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
            if (nav) nav.classList.toggle('is-scrolled', y > 40);
            let activeIdx = -1;
            targets.forEach((t, i) => {
                if (t.getBoundingClientRect().top <= window.innerHeight * 0.35) activeIdx = i;
            });
            navlinks.forEach((a, i) => a.classList.toggle('is-active', i === activeIdx));
        }
        global.__personaScroll = onScroll;
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /**
     * Sets the presentation mode.
     * @param {('paper'|'web')} mode - 'paper' (printable résumé, default) or 'web' (immersive portfolio).
     * @example PersonaJS.setTheme('web');
     */
    function publicSetTheme(mode) { return setTheme(mode); }

    /**
     * Renders the complete page. It is required to generate the page.
     * @example PersonaJS.render();
     */
    function render() {
        console.log("render");
        processQueue().then(() => {
            captureRawSections();
            applyTheme();
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
        setTheme: publicSetTheme,
        render: render
    };

    // Load Bootstrap JS, Mustache JS when the script is loaded
    loadBootstrapJS();
    loadMustacheJS();

}(window));
