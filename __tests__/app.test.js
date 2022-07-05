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
  describe("GET /api/reviews/:review_id", () => {
    test("should return a review object with the specified properties", () => {
      return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toEqual({
            review_id: 2,
            title: expect.any(String),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            category: expect.any(String),
            owner: "philippaclaire9",
            created_at: expect.any(String),
          });
        });
    });
  });
  describe("GET /api/users", () => {
    test("should return an array of all users", async () => {
      const { body } = await request(app).get("/api/users").expect(200);
      expect(body.users).toHaveLength(4);
      body.users.forEach((user) => {
        expect(user).toEqual(
          expect.objectContaining({
            user_id: expect.any(Number),
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          })
        );
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
  describe("(GET /api/reviews/:review_id) passing invalid review id", () => {
    test("should return a no content message when passed not existing id", () => {
      return request(app)
        .get("/api/reviews/10999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("no review id = 10999");
        });
    });
  });
  describe("(GET /api/reviews/:review_id) passing invalid review id", () => {
    test("should return a no content message when passed invalid review_id", () => {
      return request(app)
        .get("/api/reviews/beyar")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid input");
        });
    });
  });
});
