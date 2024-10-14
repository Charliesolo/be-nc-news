const app = require('../app.js');
const request = require('supertest');
const db = require('../db/connection.js');
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');
const endpoints = require('../endpoints.json')

beforeEach(() => seed(testData));
afterAll(() => db.end())

describe('/api/not-a-url', () => {
    test('404 responds with an error with a message reading "Not Found"', () => {
        return request(app)
            .get('/api/not-a-url')
            .expect(404)
            .then(({body})=> {
                expect(body.msg).toBe("Not Found")
            })
    })
})

describe('/api', () => {
    test('GET: 200 responds with an array of all other endpoints', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({body})=> {
                expect(body.endpoints).toEqual(endpoints)
            })
    })
})

describe('/api/topics', () => {
    test('GET: 200 responds with an array of topics with each of which has a slug and description property', () => {
        return request(app)
            .get('/api/topics/')
            .expect(200)
            .then(({body})=> {
                body.topics.forEach((topic) => {
                    expect(topic).toHaveProperty('slug')
                    expect(topic).toHaveProperty('description')
                })
            })
    })
})

describe('/api/articles/:article_id', () => {
    test('GET: 200 responds with an article object with the correct properties', () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({body})=> {
                expect(body.article).toHaveProperty('author', 'butter_bridge')
                expect(body.article).toHaveProperty('title', 'Living in the shadow of a great man')
                expect(body.article).toHaveProperty('article_id', 1)
                expect(body.article).toHaveProperty('topic', 'mitch')
                expect(body.article).toHaveProperty('body', 'I find this existence challenging')
                expect(body.article).toHaveProperty('votes', 100)
                expect(body.article).toHaveProperty('article_img_url', "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
                expect(body.article).toHaveProperty('created_at', "2020-07-09 21:11:00")
            })
    })
    test('GET: 400 responds with an error with message of bad request when given an invalid article id', () => {
        return request(app)
            .get('/api/articles/not-an-id')
            .expect(400)
            .then(({body})=> {
                expect(body.msg).toBe('Bad Request')                
            })
    })
    test('GET: 404 responds with an error with message of Not Found when given a valid article id for an article that doesn\'t exist', () => {
        return request(app)
            .get('/api/articles/99999')
            .expect(404)
            .then(({body})=> {
                expect(body.msg).toBe('Not Found')                
            })
    })
})




