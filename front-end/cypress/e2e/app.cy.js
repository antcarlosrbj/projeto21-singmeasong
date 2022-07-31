/// <reference types="cypress" />

import { faker } from "@faker-js/faker";

const URL = "http://localhost:3000";

describe("app test", () => {
  
  beforeEach(() => {
    cy.resetRecommendations();
  })

  after(() => {
    cy.resetRecommendations();
  })
  
  it("should show recommendation after entering", () => {
    const name = faker.word.noun()
    const youtubeLink = "http://www.youtube.com/" + faker.random.alphaNumeric(10)

    cy.visit(`${URL}/`);
    cy.get("#name").type(name);
    cy.get("#youtube-link").type(youtubeLink);

    cy.intercept("POST", "/recommendations").as("recommendations");
    cy.get("#insert-button").click();
    cy.wait("@recommendations");
    
    cy.get(".name-recommendation").should("contain.text", name);
  })

  it("should increase score after upvote", () => {
    const recommendations = {
        name: faker.word.noun(),
        youtubeLink: "http://www.youtube.com/" + faker.random.alphaNumeric(10)
    }

    cy.visit(`${URL}/`);
    
    cy.insertRecommendations(recommendations).then(id => {

      cy.get(".score").should("contain.text", 0);
    
      cy.intercept("POST", `/recommendations/${id}/upvote`).as("upvote");
      cy.get("svg.upvote").click();
      cy.wait("@upvote")

      cy.get(".score").should("contain.text", 1);

    });
  })

  it("should decrease score after downvote", () => {
    const recommendations = {
        name: faker.word.noun(),
        youtubeLink: "http://www.youtube.com/" + faker.random.alphaNumeric(10)
    }

    cy.visit(`${URL}/`);
    
    cy.insertRecommendations(recommendations).then(id => {

      cy.get(".score").should("contain.text", 0);
    
      cy.intercept("POST", `/recommendations/${id}/downvote`).as("downvote");
      cy.get(".downvote").click();
      cy.wait("@downvote")

      cy.get(".score").should("contain.text", -1);

    });
  })

  it("should show top recommendation after entering", () => {
    const recommendations = {
        name: faker.word.noun(),
        youtubeLink: "http://www.youtube.com/" + faker.random.alphaNumeric(10)
    }

    cy.visit(`${URL}/`);
    cy.insertRecommendations(recommendations).then(id => {
      cy.contains("Top").click();
      cy.get(".name-recommendation").should("contain.text", recommendations.name);
    });
  })

  it("should show random recommendation after entering", () => {
    const recommendations = {
        name: faker.word.noun(),
        youtubeLink: "http://www.youtube.com/" + faker.random.alphaNumeric(10)
    }

    cy.visit(`${URL}/`);
    cy.insertRecommendations(recommendations).then(id => {
      cy.contains("Random").click();
      cy.get(".name-recommendation").should("contain.text", recommendations.name);
    });
  })

})