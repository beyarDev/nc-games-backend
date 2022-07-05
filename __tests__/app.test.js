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
            comment_count: "3",
          });
        });
    });
    test("should return a review object with comment count equal to zero if no comments", () => {
      return request(app)
        .get("/api/reviews/7")
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review.comment_count).toBe("0");
        });
    });
  });

  describe("PATCH /api/reviews/:review_id", () => {
    test("should add review votes when passed positive votes", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toEqual({
            review_id: 1,
            title: "Agricola",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Farmyard fun!",
            category: "euro game",
            created_at: expect.any(String),
            votes: 2,
          });
        });
    });
    test("should subtract review votes when passed negative votes", async () => {
      const {
        body: { review },
      } = await request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: -10 })
        .expect(200);
      expect(review).toEqual({
        review_id: 1,
        title: "Agricola",
        designer: "Uwe Rosenberg",
        owner: "mallionaire",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "Farmyard fun!",
        category: "euro game",
        created_at: expect.any(String),
        votes: -9,
      });
    });
    test("should ignore extra keys", async () => {
      const {
        body: { review },
      } = await request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: 1, name: "Mitch" })
        .expect(200);
      expect(review).toEqual({
        review_id: 1,
        title: "Agricola",
        designer: "Uwe Rosenberg",
        owner: "mallionaire",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "Farmyard fun!",
        category: "euro game",
        created_at: expect.any(String),
        votes: 2,
      });
    });
    describe("GET /api/users", () => {
      test("should return an array of all users", async () => {
        const { body } = await request(app).get("/api/users").expect(200);
        expect(body.users).toHaveLength(4);
        body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
    });
  });
  describe("GET /api/reviews", () => {
    test("should return all reviews with specified properties", async () => {
      const {
        body: { reviews },
      } = await request(app).get("/api/reviews").expect(200);
      reviews.forEach((review) => {
        expect(review).toEqual(
          expect.objectContaining({
            review_id: expect.any(Number),
            title: expect.any(String),
            review_body: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            votes: expect.any(Number),
            category: expect.any(String),
            owner: expect.any(String),
            created_at: expect.any(String),
            comment_count: expect.any(String),
          })
        );
      });
    });
    test("should return all reviews sorted by date DESC", async () => {
      const {
        body: { reviews },
      } = await request(app).get("/api/reviews").expect(200);
      expect(reviews).toBeSortedBy("created_at", { descending: true });
    });
  });
});

// error handling tests

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
  describe("(GET /api/reviews/:review_id) error handler", () => {
    test("should return a no content message when passed not existing id", () => {
      return request(app)
        .get("/api/reviews/10999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("no review id = 10999");
        });
    });
    test("should return a no content message when passed invalid review_id", () => {
      return request(app)
        .get("/api/reviews/beyar")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid input");
        });
    });
  });
  describe("(PATH /api/reviews/:review_id) error handler", () => {
    test("should return a no content message when passed invalid review_id", () => {
      return request(app)
        .patch("/api/reviews/beyar")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid input");
        });
    });
    test("should return 404 when passed a review_id that does not exist", () => {
      return request(app)
        .patch("/api/reviews/10009")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("no review id = 10009");
        });
    });
    test("should return 400 when No `inc_votes`", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("please input valid inc_votes value");
        });
    });
    test("should return 400 when passed Invalid inc_votes", () => {
      return request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: "cat" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("please input valid inc_votes value");
        });
    });
  });
});
