// ==UserScript==
// @name         IXL Question Solver
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  IXL
// @author       Antonin Beliard
// @match        *://www.ixl.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // let lastQuestionNormalized = "";
    let lastQuestion = "";

    function normalizeText(text) {
        let cleanText = text.replace(/\W/g, '').toLowerCase();
        return cleanText.split('').sort().join('');
    }

function findAndPrintQuestion() {
    try {
        // const bodyText = document.body.textContent || document.body.innerText;
        // const incorrectMessageExists = bodyText.includes("Sorry, incorrect");
        // const goToRecommendationsExists = bodyText.includes("Go to recommendations");

        // if (incorrectMessageExists || goToRecommendationsExists) {
        //     console.log("Skipping due to page conditions.");
        //     return;
        // }

        // const questionComponents = document.querySelectorAll(".question-component");
        // let fullQuestion = "";

            const bodyText = document.body.textContent || document.body.innerText;
            const incorrectMessageExists = bodyText.indexOf("Sorry, incorrect") > -1;

            var questionElement = document.querySelector("main#practice-page-container section > section > div > div");
            var supportingTextElements = document.querySelectorAll("main#practice-page-container section > section > div > div > div");

            let fullQuestion = "";

        // questionComponents.forEach(component => {
        //     component.childNodes.forEach(node => {
        //         if (node.nodeType === Node.ELEMENT_NODE && !node.closest('.crisp-button')) {
        //             let textContent = node.textContent.trim();
        //             if (textContent) {
        //                 fullQuestion += " " + textContent;
        //             }
        //         }
        //         else if (node.nodeType === Node.TEXT_NODE && /\S/.test(node.nodeValue)) {
        //             fullQuestion += node.nodeValue.trim();
        //         }
        //     });
        // });

        // fullQuestion = fullQuestion.replace(/\s+/g, ' ').trim();

        // let currentQuestionNormalized = normalizeText(fullQuestion);

        // if (fullQuestion !== "" && currentQuestionNormalized !== lastQuestionNormalized) {
        //     console.log("Question found: ", fullQuestion);
        //     lastQuestionNormalized = currentQuestionNormalized;
        //     sendQuestionToServer(fullQuestion);
        // }
    // } catch (e) {
    //     console.error("An error occurred while trying to find the question element: ", e);
    // }

            if (questionElement) {
                fullQuestion += questionElement.textContent.trim();
            }

            supportingTextElements.forEach(function(elem, index) {
                if (index === 0 && fullQuestion !== "") {
                    fullQuestion += "\n";
                } else if (index > 0) {
                    fullQuestion += "\n";
                }
                fullQuestion += elem.textContent.trim();
            });

            const goToRecommendationsExists = fullQuestion === "Go to recommendations";

            if (!incorrectMessageExists && !goToRecommendationsExists && fullQuestion !== "" && fullQuestion !== lastQuestion) {
                console.log("Question found: ", fullQuestion);
                lastQuestion = fullQuestion;
                sendQuestionToServer(fullQuestion);
            } else if (incorrectMessageExists) {
                console.log("Skipping question due to 'Sorry, incorrect' message.");
            } else if (goToRecommendationsExists) {
                console.log("Skipping 'Go to recommendations' prompt.");
            }
        } catch (e) {
            console.error("An error occurred while trying to find the question element: ", e);
        }
}

    function sendQuestionToServer(question) {
        // You are a highly efficient assistant that is strictly tasked with answering questions or assignments accurately and concisely. Ensure your responses are direct and factually correct.
        const systemPrompt = `You are an advanced assistant operating under strict directives to provide answers to questions or assignments with utmost accuracy and brevity. Your responses must be concise, logically sound, and demonstrate intelligent reasoning. Short, precise answers are mandatory. Begin now.

Question:

Select the three adjectives. Don't select any articles (a, an, or the).
The heavy statue was fragile, so we wrapped it carefully in blankets
before we moved it up the narrow staircase.

Answer:

heavy
fragile
narrow

Question:

A student is creating an outline for a report about the Falkland Islands. Read the piece of information in each row, then select the section where it fits best.
Sections
Climate
History
Wildlife
French explorers built a small settlement on East Falkland in 1764.
Nearly a million penguins from five different species live on the Falkland Islands.
Average daily temperatures in the Falkland Islands range from about 35°F to 50°F, depending on the time of year.

Answer:

French explorers [...] in 1764. → History
Nearly a [...] Falkland Islands → Wildlife
Average daily [...] of year. → Climate

Question:

Order the topics from broadest to narrowest.
broader
conditions on the sun and their effects on Earth
temporary power outages over large areas of Earth
the effects of solar flares on Earth's surface
the effect of sun spots and solar flares on Earth
narrower

Answer:

conditions on the sun and their effects on Earth
the effect of sun spots and solar flares on Earth
the effects of solar flares on Earth's surface
temporary power outages over large areas of Earth

Question:

Click to capitalize the book's title correctly.
a
n
e
y
e
for
an
e
y
e

Answer:

An Eye for an Eye

Question:

Select the four adjectives. Don't select any articles (a, an, or the).
Five inspiring women started the school, despite many people who
thought the goal was impossible.

Answer:

inspiring
five
many
impossible

Question:

A journalist is writing a long-form magazine article about Tokyo. Read the piece of information in each row, then select the section where it fits best.
Sections
Location
Climate
History
Summers in Tokyo are hot and humid, though winters are relatively mild.
Edo, originally a small fishing village, was renamed Tokyo during the Meiji Restoration.
Tokyo, the capital city of Japan, lies on the west coast of Honshu, the largest of Japan's four main islands.

Answer:

Summers in [...] relatively mild. → Climate
Edo, originally [...] Meiji Restoration. → History
Tokyo, the [...] main islands. → Location

Question:

Order the topics from broadest to narrowest.
broader
the effects of violence in video games
the effects of violent video games on teens' behavior
the effects of violence in entertainment media
narrower

Answer:

the effects of violence in entertainment media
the effects of violence in video games
the effects of violent video games on teens' behavior

Question:

Click to capitalize the poem's title correctly.
"
no
man
is
an
island
"

Answer:

"No Man Is an Island"

Question:

Select all the adjectives. Don't select any articles (a, an, or the).
Jon was nervous about the upcoming play, but several successful rehearsals gave him more confidence.

Answer:

nervous
upcoming
several
successful
more

Question:

A medical student is taking notes on lupus, a chronic autoimmune disease. Read the piece of information in each row, then select the section where it fits best.
Sections
Causes
Symptoms
Treatments
A person with lupus may have joint pain and swelling.
Medications for lupus include nonsteroidal anti-inflammatories, corticosteroids (drugs that suppress the immune system), and antimalarial drugs.
Fatigue and hair loss may affect people with lupus.
Genes may be a factor, but what exactly triggers lupus is unknown.

Answer:

A person [...] and swelling. → Symptoms
Medications for [...] antimalarial drugs. → Treatments
Fatigue and [...] with lupus. → Symptoms
Genes may [...] is unknown. → Causes

Question:

Order the topics from broadest to narrowest.
broader
the activity of the human brain
delta brain waves during deep sleep
brain activity during sleep
narrower

Answer:

the activity of the human brain
brain activity during sleep
delta brain waves during deep sleep

Question:

Click to capitalize the short story's title correctly.
"
Words
for
Living
By
"

Answer:

"Words for Living By"

Question:

` + question + `

Answer:

`;

        GM_xmlhttpRequest({
            method: "POST",
            url: "http://chat.totob12.com/api",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                securityCode: "7777",
                prompt: systemPrompt
            }),
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    const data = JSON.parse(response.responseText);
                    console.log("Server response: ", data.response);
                } else {
                    console.error("Server error: ", response.status);
                }
            },
            onerror: function(error) {
                console.error("Request failed: ", error);
            }
        });
    }

    setInterval(findAndPrintQuestion, 2000);
})();
