import supertest from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/database.js";

const name = "Falamansa - Xote dos Milagres";
const youtubeLink = "https://www.youtube.com/watch?v=chwyjJbcs1Y";

describe("Creating recommendations tests suite", () => {

    it("given name and Youtube link, create a new recommendation", async () => {
        await deleteRecommendation(name);

        const response = await supertest(app).post(`/recommendations`).send({ name, youtubeLink });
        expect(response.statusCode).toBe(201);

        const recommendation = await prisma.recommendation.findFirst({
            where: { name: name }
        });
        expect(recommendation.youtubeLink).toBe(youtubeLink);

        await deleteRecommendation(name);
    });

    it("given name in error, create a new recommendation", async () => {
        const response = await supertest(app).post(`/recommendations`).send({ name: "", youtubeLink });
        expect(response.statusCode).toBe(422);
    });

    it("given Youtube link in error, create a new recommendation", async () => {
        const response = await supertest(app).post(`/recommendations`).send({ name, youtubeLink: "" });
        expect(response.statusCode).toBe(422);
    });

    it("create two equal recommendations", async () => {
        await deleteRecommendation(name);

        const response = await supertest(app).post(`/recommendations`).send({ name, youtubeLink });
        expect(response.statusCode).toBe(201);

        const recommendation = await prisma.recommendation.findFirst({
            where: { name: name }
        });
        expect(recommendation.youtubeLink).toBe(youtubeLink);

        const secondResponse = await supertest(app).post(`/recommendations`).send({ name, youtubeLink });
        expect(secondResponse.statusCode).toBe(409);

        await deleteRecommendation(name);
    });

});

describe("Recommendation score tests suite", () => {

    it("add a point to the recommendation score", async () => {
        await deleteRecommendation(name);

        const response = await supertest(app).post(`/recommendations`).send({ name, youtubeLink });
        expect(response.statusCode).toBe(201);

        const recommendation = await prisma.recommendation.findFirst({
            where: { name: name }
        });
        expect(recommendation.youtubeLink).toBe(youtubeLink);

        const previousScore = recommendation.score;
        const responseUpvote = await supertest(app).post(`/recommendations/${recommendation.id}/upvote`);
        expect(responseUpvote.statusCode).toBe(200);

        const recommendationAfterUpvote = await prisma.recommendation.findFirst({
            where: { name: name }
        });
        expect(recommendationAfterUpvote.score).toBe(previousScore + 1);

        await deleteRecommendation(name);
    });

    it("remove a point from the recommendation score", async () => {
        await deleteRecommendation(name);

        const response = await supertest(app).post(`/recommendations`).send({ name, youtubeLink });
        expect(response.statusCode).toBe(201);

        const recommendation = await prisma.recommendation.findFirst({
            where: { name: name }
        });
        expect(recommendation.youtubeLink).toBe(youtubeLink);

        const previousScore = recommendation.score;
        const responseDownvote = await supertest(app).post(`/recommendations/${recommendation.id}/downvote`);
        expect(responseDownvote.statusCode).toBe(200);

        const recommendationAfterDownvote = await prisma.recommendation.findFirst({
            where: { name: name }
        });
        expect(recommendationAfterDownvote.score).toBe(previousScore - 1);

        await deleteRecommendation(name);
    });

});

describe("Getting recommendations tests suite", () => {

    it("enter twelve recommendations and take only the last ten", async () => {
        await deleteAllRecommendation();

        await insertRecommendationsTimes(12);

        const response = await supertest(app).get(`/recommendations`);
        const recommendations = response.body

        let answer = true;

        for (let i = 0; i < 10; i++) {
            if (recommendations[i].name !== name+(12-i)) {
                answer = false
            }
        }

        expect(answer).toBe(true);

        await deleteAllRecommendation();
    });

    it("get recommendation by id", async () => {
        await deleteRecommendation(name);

        const id = await insertRecommendation({ name, youtubeLink });

        const response = await supertest(app).get(`/recommendations/${id}`);
        const recommendation = response.body

        expect(recommendation.name).toBe(name);
        expect(recommendation.youtubeLink).toBe(youtubeLink);

        await deleteRecommendation(name);
    });

    it("get recommendation random", async () => {
        await deleteAllRecommendation();

        const emptyResponse = await supertest(app).get(`/recommendations/random`);
        expect(emptyResponse.statusCode).toBe(404);

        const id = await insertRecommendation({ name, youtubeLink });

        const response = await supertest(app).get(`/recommendations/random`);
        const recommendation = response.body

        expect(recommendation.name).toBe(name);
        expect(recommendation.youtubeLink).toBe(youtubeLink);

        await deleteAllRecommendation();
    });

    it("get top recommendation", async () => {
        await deleteAllRecommendation();

        for (let i = 0; i < 10; i++){
            const data = {name: name+i, youtubeLink: youtubeLink+i};
            const id = await insertRecommendation(data);
        }

        const random = randomBetween(5, 10);


        const response = await supertest(app).get(`/recommendations/top/${random}`);
        const recommendations = response.body

        expect(recommendations.length).toBe(random);

        await deleteAllRecommendation();
    });

});

async function deleteRecommendation(name) {
    await prisma.$executeRaw`DELETE FROM recommendations WHERE name = ${name}`;
};

async function deleteAllRecommendation() {
    await prisma.$executeRaw`DELETE FROM recommendations`;
};

async function insertRecommendationsTimes(times) {
    for (let i = 1; i <= times; i++) {
        const numberedName = name + i;
        const numberedYoutubeLink = youtubeLink + i;

        await supertest(app).post(`/recommendations`).send({ name: numberedName, youtubeLink: numberedYoutubeLink });
    }
}

async function insertRecommendation(data) {
    await supertest(app).post(`/recommendations`).send(data);
    
    const recommendation = await prisma.recommendation.findFirst({
        where: { name: data.name }
    });
    
    return recommendation.id;
}

function randomBetween(min: number, max: number) {
    const interval = max - min + 1;
    const random = Math.floor(Math.random()*interval)+min
    return random;
}