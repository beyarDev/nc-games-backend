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
    test("should return all reviews sorted by date DESC defalut", async () => {
      const {
        body: { reviews },
      } = await request(app).get("/api/reviews").expect(200);
      expect(reviews.length).not.toBe(0);
      expect(reviews).toBeSortedBy("created_at", { descending: true });
    });
    test("sort_by, which sorts the reviews by any valid column", async () => {
      const {
        body: { reviews },
      } = await request(app).get("/api/reviews?sort_by=votes").expect(200);
      expect(reviews.length).not.toBe(0);
      expect(reviews).toBeSortedBy("votes", { descending: true });
    });
    test("sort_by, which sorts the reviews by any valid column", async () => {
      const {
        body: { reviews },
      } = await request(app).get("/api/reviews?sort_by=designer").expect(200);
      expect(reviews.length).not.toBe(0);
      expect(reviews).toBeSortedBy("designer", { descending: true });
    });
    test("order, which order the reviews in ASC or DESC , DESC defalut by created_at defualt", async () => {
      const {
        body: { reviews },
      } = await request(app).get("/api/reviews?order=ASC").expect(200);
      expect(reviews.length).not.toBe(0);
      expect(reviews).toBeSortedBy("created_at");
    });
    test("sort_by, and order the reviews by any valid column", async () => {
      const {
        body: { reviews },
      } = await request(app)
        .get("/api/reviews?sort_by=review_id&&order=ASC")
        .expect(200);
      expect(reviews.length).not.toBe(0);
      expect(reviews).toBeSortedBy("review_id");
    });
    test("filter the reviews by givin category", async () => {
      const {
        body: { reviews },
      } = await request(app).get("/api/reviews?category=euro+game").expect(200);
      expect(reviews.length).not.toBe(0);
      reviews.forEach((review) => {
        expect(review).toEqual({
          title: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_img_url: expect.any(String),
          review_body: expect.any(String),
          category: "euro game",
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(String),
          review_id: expect.any(Number),
        });
      });
    });
  });
  describe("GET /api/reviews/:review_id/comments", () => {
    test("should return an array of comments for the given review ID", async () => {
      const {
        body: { comments },
      } = await request(app).get("/api/reviews/2/comments").expect(200);
      expect(comments).toHaveLength(3);
      comments.forEach((comment) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: 2,
          })
        );
      });
    });
    test("should return an empty array if no comments found the given review ID", async () => {
      const {
        body: { comments },
      } = await request(app).get("/api/reviews/1/comments").expect(200);
      expect(comments).toEqual([]);
    });
  });
  describe("POST /api/reviews/:review_id/comments", () => {
    test("should post a new comment and return it", async () => {
      const {
        body: { comment },
      } = await request(app)
        .post("/api/reviews/1/comments")
        .send({ username: "bainesface", body: "what an awesome game" })
        .expect(201);
      expect(comment).toEqual(
        expect.objectContaining({
          author: "bainesface",
          body: "what an awesome game",
          review_id: 1,
        })
      );
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
          expect(msg).toBe("invalid input ID (beyar)");
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
  describe("GET /api/reviews/:review_id/comments error handler", () => {
    test("should return 404 not found when there is no no such review id", async () => {
      const {
        body: { msg },
      } = await request(app).get("/api/reviews/9999/comments").expect(404);
      expect(msg).toBe("9999 does not exist");
    });
    test("should return 400 bad request when passed invalid review id", async () => {
      const {
        body: { msg },
      } = await request(app).get("/api/reviews/beyar/comments").expect(400);
      expect(msg).toBe("invalid review ID (beyar)");
    });
  });
  describe("POST /api/reviews/:review_id/comments error handler", () => {
    test("return 404 review id does not exist", async () => {
      const {
        body: { msg },
      } = await request(app)
        .post("/api/reviews/999/comments")
        .send({ username: "bainesface", body: "what an awesome game" })
        .expect(404);
      expect(msg).toBe("999 does not exist");
    });
    test("return 400 invalid review id", async () => {
      const {
        body: { msg },
      } = await request(app)
        .post("/api/reviews/banana/comments")
        .send({ username: "bainesface", body: "what an awesome game" })
        .expect(400);
      expect(msg).toBe("invalid review ID (banana)");
    });
    test("return 404 username does not exsit", async () => {
      const {
        body: { msg },
      } = await request(app)
        .post("/api/reviews/1/comments")
        .send({ username: "beyar", body: "what an awesome game" })
        .expect(404);
      expect(msg).toBe("beyar does not exist");
    });
    test("return 400 bad request no body", async () => {
      const {
        body: { msg },
      } = await request(app)
        .post("/api/reviews/1/comments")
        .send({ username: "beyar" })
        .expect(400);
      expect(msg).toBe("please provide comment body");
    });
  });
});
