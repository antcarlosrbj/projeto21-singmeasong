import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";

import { recommendationService } from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "./../../src/repositories/recommendationRepository.js";

jest.mock("./../../src/repositories/recommendationRepository");

describe("recommendationService test suite", () => {

      it("should create recommendation", async () => {
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => { });
        jest.spyOn(recommendationRepository, "create").mockImplementationOnce((): any => { });

        const recommendations = {
            name: faker.word.noun(),
            youtubeLink: "http://www.youtube.com/" + faker.random.alphaNumeric(10)
        }

        await recommendationService.insert(recommendations);
        expect(recommendationRepository.create).toBeCalled();
      })

    it("should not create duplicated recommendation", async () => {
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => true);
        const recommendations = {
            name: faker.word.noun(),
            youtubeLink: "http://www.youtube.com/" + faker.random.alphaNumeric(10)
        }

        const promise = recommendationService.insert(recommendations);
        expect(promise).rejects.toEqual({ message: "Recommendations names must be unique", type: "conflict" });
    });

    it("should upvote", async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => true);
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => { });

        await recommendationService.upvote(5);
        expect(recommendationRepository.updateScore).toBeCalled();
    })

    it("should not upvote for not found id", async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => false);

        const promise = recommendationService.upvote(5);
        expect(promise).rejects.toEqual({ message: "", type: "not_found" });
    })

    it("should downvote", async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => true);
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {return {score: 9}});

        await recommendationService.downvote(5);
        expect(recommendationRepository.updateScore).toBeCalled();
    })

    it("should not downvote for not found id", async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => false);

        const promise = recommendationService.downvote(5);
        expect(promise).rejects.toEqual({ message: "", type: "not_found" });
    })

    it("should downvote and remove recommendation as the score is less than -5", async () => {
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce((): any => true);
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce((): any => {return {score: -6}});
        jest.spyOn(recommendationRepository, "remove").mockImplementationOnce((): any => { });

        await recommendationService.downvote(5);
        expect(recommendationRepository.remove).toBeCalled();
    })

    it("should find all", async () => {
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => { });

        await recommendationService.get();
        expect(recommendationRepository.findAll).toBeCalled();
    })

    it("should find top", async () => {
        jest.spyOn(recommendationRepository, "getAmountByScore").mockImplementationOnce((): any => { });

        await recommendationService.getTop(5);
        expect(recommendationRepository.getAmountByScore).toBeCalled();
    })

    it("should find random < 0.7", async () => {
        jest.spyOn(Math, "random").mockImplementation((): any => 0.6);
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {return [0, 1, 2, 3]});

        const promise = await recommendationService.getRandom();
        expect(promise).toBe(2);
    })

    it("should not find random for not found < 0.7", async () => {
        jest.spyOn(Math, "random").mockImplementation((): any => 0.6);
        jest.spyOn(recommendationRepository, "findAll").mockImplementation((): any => {return []});

        const promise = recommendationService.getRandom();
        expect(promise).rejects.toEqual({ message: "", type: "not_found" });
    })

    it("should find random > 0.7", async () => {
        jest.spyOn(Math, "random").mockImplementation((): any => 0.8);
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce((): any => {return [0, 1, 2, 3]});

        const promise = await recommendationService.getRandom();
        expect(promise).toBe(3);
    })

    it("should not find random for not found > 0.7", async () => {
        jest.spyOn(Math, "random").mockImplementation((): any => 0.8);
        jest.spyOn(recommendationRepository, "findAll").mockImplementation((): any => {return []});

        const promise = recommendationService.getRandom();
        expect(promise).rejects.toEqual({ message: "", type: "not_found" });
    })
})