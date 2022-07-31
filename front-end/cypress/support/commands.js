const URL = process.env.REACT_APP_API_BASE_URL;

Cypress.Commands.add("resetRecommendations", () => {
    cy.request("POST", "http://localhost:5000/reset");
})

Cypress.Commands.add("insertRecommendations", (recommendations) => {
    cy.request("POST", "http://localhost:5000/recommendations", recommendations).then(res => {
        cy.request("GET", "http://localhost:5000/recommendations").then(res => {
            return JSON.stringify(res.body[0].id)
        });
    });
});