const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
beforeEach(() => {
  return seed(testData).then(() => {});
});

afterAll(() => {
  db.end();
});

describe("app", () => {
  describe("GET /api/categories", () => {
    test("should return an array of category objects, each of which should have slug description properties", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body: { categories } }) => {
          // i destructured body from response object and categories form body object
          expect(categories.length).not.toBe(0);
          categories.forEach((category) => {
            expect(category).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });
});

describe("app error handling", () => {
  describe("invalid path", () => {
    test("should return 404 no such route", () => {
      return request(app)
        .get("/api/cats")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("404 no such route");
        });
    });
  });
});
