import supertest from "supertest";
import app from "./../src/app.js";
import { prisma } from "./../src/database.js";

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

async function deleteRecommendation(name) {
    await prisma.$executeRaw`DELETE FROM recommendations WHERE name = ${name}`;
};