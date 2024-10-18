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

describe('GET /api', () => {
    test('GET: 200 responds with an array of all other endpoints', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({body})=> {
                expect(body.endpoints).toEqual(endpoints)
            })
    })
})

describe('GET /api/topics', () => {
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

describe('GET /api/articles/:article_id', () => {
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
                expect(body.msg).toBe('Article Not Found')                
            })
    })
})

describe('GET /api/articles', () => {
    test('GET: 200 responds with an array of articles each of which has the correct properties', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                body.articles.forEach((article) =>{
                    expect(article).toHaveProperty('author')
                    expect(article).toHaveProperty('title')
                    expect(article).toHaveProperty('article_id')
                    expect(article).toHaveProperty('topic')
                    expect(article).toHaveProperty('created_at')
                    expect(article).toHaveProperty('votes')
                    expect(article).toHaveProperty('article_img_url')
                    expect(article).not.toHaveProperty('body')
                })
            })
    })
    test('GET: 200 responds with an array of articles sorted in descending order by date', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                expect(body.articles).toBeSortedBy('created_at', {descending: true})
            })
    })
    test('GET: 200 responds with an array of articles each of which has a comment count property totalling all comments made on that article', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({body}) => {
                expect(body.articles[0]).toHaveProperty('comment_count', 2)
            })
    })
})

describe('GET /api/articles/:article_id/comments', () => {
    test('GET: 200 responds with an array of all comments associated with a given article with the correct properties', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            body.comments.forEach((comment) => {
                expect(comment).toHaveProperty('comment_id')
                expect(comment).toHaveProperty('votes')
                expect(comment).toHaveProperty('created_at')
                expect(comment).toHaveProperty('author')
                expect(comment).toHaveProperty('body')
                expect(comment).toHaveProperty('article_id')
            }) 
        })
    })
    test('GET: 200 returned comments are sorted from most recent to oldest', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toBeSortedBy('created_at', {descending: true})
        })
    })
    test('GET: 400 responds with an error message of "Bad Request" when given an invalid article id', () => {
        return request(app)
        .get('/api/articles/not-an-id/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('GET: 404 responds with an error message of "Not Found" when given a valid article id not associated with an article', () => {
        return request(app)
        .get('/api/articles/9999/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Article Not Found')
        })
    })
    test('GET: 200 responds with an empty array when given a valid article that has no comments', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.comments)).toBe(true)
            expect(body.comments).toHaveLength(0)
        })
    })
})

describe('POST /api/articles/:article_id/comments', () => {
    test('POST 201 adds a comment to the database when given a correctly formatted body and correct article id and returns the posted comment', () => {
        return request(app)
        .post('/api/articles/2/comments')
        .expect(201)
        .send({username: "butter_bridge", body: "test comment"})
        .then(({body}) => {
            expect(body.comment).toHaveProperty('author', "butter_bridge")
            expect(body.comment).toHaveProperty('body', "test comment")
        })        
    })
    test('POST 201 adds a comment to the database when given a correctly formatted body and correct article id and ignores any additional properties on the body', () => {
        return request(app)
        .post('/api/articles/2/comments')
        .expect(201)
        .send({username: "butter_bridge", body: "test comment", votes: 1000, comment_id: 5})
        .then(({body}) => {
            expect(body.comment).toHaveProperty('author', "butter_bridge")
            expect(body.comment).toHaveProperty('body', "test comment")
        })        
    })
    test('POST 400 returns an error of bad request when given a body missing either required fields', () => {
        return request(app)
        .post('/api/articles/2/comments')
        .expect(400)
        .send({ body: "test comment"})
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request - Username and body required')
        })        
    })
    test('POST 400 returns an error of bad request when given an invalid article id', () => {
        return request(app)
        .post('/api/articles/not-an-id/comments')
        .expect(400)
        .send({username: "butter_bridge", body: "test comment"})
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })        
    })
    test('POST 400 returns an error of bad request when given a username of a user that doesn\'t exist', () => {
        return request(app)
        .post('/api/articles/2/comments')
        .expect(400)
        .send({username: "tequila_sunset", body: "This is very disco"})
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })        
    })
    test('POST 404 returns an error of not found when given a valid article id for an article that doesn\'t exist', () => {
        return request(app)
        .post('/api/articles/999989/comments')
        .expect(404)
        .send({username: "rogersop", body: "test comment"})
        .then(({body}) => {
            expect(body.msg).toBe('Article Not Found')
        })        
    })
})

describe('PATCH /api/articles/:article_id', () => {
    test('PATCH 200 increases the votes of a given article by the value provided in the body and returns the updated article', () => {
        return request(app)
        .patch('/api/articles/2')
        .expect(200)
        .send({inc_votes: -5})
        .then(({body}) => {
            expect(body.article.votes).toBe(-5)
        })
    })
    test('PATCH 400 returns bad request when given a body without the correct key', () => {
        return request(app)
        .patch('/api/articles/2')
        .expect(400)
        .send({})
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('PATCH 400 returns bad request when given a body with the correct key but invalid fields', () => {
        return request(app)
        .patch('/api/articles/2')
        .expect(400)
        .send({inc_votes: 'Not a number'})
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('PATCH 400 returns bad request when given an invalid article id', () => {
        return request(app)
        .patch('/api/articles/not-an-id')
        .expect(400)
        .send({inc_votes: 5})
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('PATCH 404 returns Not Found when given a valid article id for an article that doesn\'t exist', () => {
        return request(app)
        .patch('/api/articles/9999')
        .expect(404)
        .send({inc_votes: 5})
        .then(({body}) => {
            expect(body.msg).toBe('Article Not Found')
        })
    })
})

describe('DELETE /api/comments/:comment_id', () => {
    test('DELETE 204 deletes a given comment', () =>{
        return request(app)
        .delete('/api/comments/3')
        .expect(204)
        .then(() => {
            return db.query(`SELECT * FROM COMMENTS`)            
        })
        .then(({rows}) => {
            expect(rows).toHaveLength(17)
        })
    })
    test('DELETE 400 returns Bad Request when given an invalid comment id', () =>{
        return request(app)
        .delete('/api/comments/not-an-id')
        .expect(400)        
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('DELETE 404 returns Not Found when given the id of a comment that doesn\'t exist', () =>{
        return request(app)
        .delete('/api/comments/9999')
        .expect(404)        
        .then(({body}) => {
            expect(body.msg).toBe('Comment Not Found')
        })
    })
})

describe('GET /api/users',()=> {
    test('GET 200 responds with an array of users each with username, name and avatar_url properties', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            body.users.forEach((user) => {
                expect(user).toHaveProperty('username')
                expect(user).toHaveProperty('name')
                expect(user).toHaveProperty('avatar_url')
            })
        })
    })
})

describe(' GET /api/articles (sorting queries)', () => {
    test('GET 200 returned articles are by default sorted by created_at desc', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('created_at', {descending: true})
        })
    })
    test('GET 200 returned articles are sorted by sorted_by query if provided, defaulting to descending', () => {
        return request(app)
        .get('/api/articles?sorted_by=votes')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('votes', {descending: true})
        })
    })
    test('GET 400 returns bad request if trying to sort by an invalid category', () => {
        return request(app)
        .get('/api/articles?sorted_by=body')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Input')
        })
    })
    test('GET 200 returned articles are sorted by sorted_by query and ordered by order query', () => {
        return request(app)
        .get('/api/articles?sorted_by=votes&order=asc')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('votes', {descending: false})
        })
    })
    test('GET 400 returns bad request if trying to order by an invalid category', () => {
        return request(app)
        .get('/api/articles?sorted_by=body&order=sideways')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Invalid Input')
        })
    })
    test('GET 400 returns bad request if trying to use an invalid query', () => {
        return request(app)
        .get('/api/articles?spppprted_by=votes&order=asc')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
})

describe('GET /api/articles (topic query)', () => {
    test('GET 200 returns articles filtered by provided topic', () => {
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then(({body}) => {
            body.articles.forEach((article) => {
                expect(article.topic).toBe('mitch')
            })
        })
    })
    test('GET 200 returns an empty array when provided a topic which has no articles', () => {
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({body}) => {
            expect(Array.isArray(body.articles)).toBe(true)
            expect(body.articles).toHaveLength(0)
            
        })
    })
    test('GET 404 returns not found when given a topic that doesn\'t exist', () => {
        return request(app)
        .get('/api/articles?topic=notatopic')
        .expect(404)
        .then(({body}) => {            
            expect(body.msg).toBe('Topic Not Found')            
        })
    })
})

describe('GET /api/articles/:article_id (comment_count)', () => {
    test('GET 200 an article response object should contain a comment_count property showing the total number of comments', () => {
        return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then(({body}) =>{            
            expect(body.article).toHaveProperty('comment_count', 0)
        })
    })
})

describe('GET /api/users/:username', () => {
    test('GET 200 responds with a user object which should have  a username, avatar_url and name properties', () => {
        return request(app)
        .get('/api/users/lurker')
        .expect(200)
        .then(({body}) => {
            expect(body.user).toHaveProperty('username', 'lurker')
            expect(body.user).toHaveProperty('name', 'do_nothing')
            expect(body.user).toHaveProperty('avatar_url', 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png')
        })
    })
    test('GET 404 responds with user not found when given the username of a user that doesn\'t exist', () => {
        return request(app)
        .get('/api/users/notauser')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('User not found')
        })
    })
})

describe('PATCH /api/comments/:comment_id', () => {
    test('PATCH 200 increases the votes of a given comment by the value provided in the body and returns the updated comment', () => {
        return request(app)
        .patch('/api/comments/5')
        .send({inc_votes: 5})
        .expect(200)
        .then(({body}) => {
            expect(body.comment).toHaveProperty('votes', 5)
        })
    })
    test('PATCH 400 returns bad request when given a body without the correct key', ()=> {
        return request(app)
        .patch('/api/comments/5')
        .send({})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('PATCH 400 returns bad request when given a body with the correct key but invalid fields', ()=> {
        return request(app)
        .patch('/api/comments/5')
        .send({inc_votes: "string"})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('PATCH 400 returns bad request when given an invalid article id', ()=> {
        return request(app)
        .patch('/api/comments/not-an-id')
        .send({inc_votes: 5})
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('PATCH 404 returns Not Found when given a valid article id for an article that doesn\'t exist', ()=> {
        return request(app)
        .patch('/api/comments/98765')
        .send({inc_votes: 5})
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Comment Not Found')
        })
    })
})

describe('POST /api/articles', () => {
    test('POST 201 posts an article and responds with the new article with the correct properties', () => {
        return request(app)
        .post('/api/articles')
        .send({
            author: 'rogersop',
            title: 'Test Article',
            body: 'This is a test article about cats',
            topic: 'cats',
            article_img_url: 'https://en.wikipedia.org/wiki/Cat#/media/File:Cat_August_2010-4.jpg'
        })
        .expect(201)
        .then(({body}) => {
            expect(body.article).toHaveProperty('author')
            expect(body.article).toHaveProperty('title')
            expect(body.article).toHaveProperty('body')
            expect(body.article).toHaveProperty('topic')
            expect(body.article).toHaveProperty('article_img_url')
            expect(body.article).toHaveProperty('article_id')
            expect(body.article).toHaveProperty('votes')
            expect(body.article).toHaveProperty('created_at')
            expect(body.article).toHaveProperty('comment_count')
        })
    })
    test('POST 201 posts an article and responds with the new article with the using the default img_url if none provided', () => {
        return request(app)
        .post('/api/articles')
        .send({
            author: 'rogersop',
            title: 'Test Article',
            body: 'This is a test article about cats',
            topic: 'cats'
            
        })
        .expect(201)
        .then(({body}) => {
            expect(body.article).toHaveProperty('author')
            expect(body.article).toHaveProperty('title')
            expect(body.article).toHaveProperty('body')
            expect(body.article).toHaveProperty('topic')
            expect(body.article).toHaveProperty('article_img_url', 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700')
            expect(body.article).toHaveProperty('article_id')
            expect(body.article).toHaveProperty('votes')
            expect(body.article).toHaveProperty('created_at')
            expect(body.article).toHaveProperty('comment_count')
        })
    })
    test('POST 201 adding extraneous elements to the request body still results in successfully posting the article', () => {
        return request(app)
        .post('/api/articles')
        .send({
            author: 'rogersop',
            title: 'Test Article',
            body: 'This is a test article about cats',
            topic: 'cats',
            additional_info: 'test data'
            
        })
        .expect(201)
        .then(({body}) => {
            expect(body.article).toHaveProperty('author')
            expect(body.article).toHaveProperty('title')
            expect(body.article).toHaveProperty('body')
            expect(body.article).toHaveProperty('topic')
            expect(body.article).toHaveProperty('article_img_url', 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700')
            expect(body.article).toHaveProperty('article_id')
            expect(body.article).toHaveProperty('votes')
            expect(body.article).toHaveProperty('created_at')
            expect(body.article).toHaveProperty('comment_count')
        })
    })
    test('POST 400 responds with bad request if any required elements are missing from the request body', () => {
        return request(app)
        .post('/api/articles')
        .send({
            author: 'rogersop',            
            body: 'This is a test article about cats',
            topic: 'cats',
            additional_info: 'test data'
            
        })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
            
        })
    })
    test('POST 400 responds with bad request if non existent author is provided', () => {
        return request(app)
        .post('/api/articles')
        .send({
            author: 'testAuthor',
            title: 'Test Article',
            body: 'This is a test article about cats',
            topic: 'cats',
            additional_info: 'test data'            
        })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
            
        })
    })
    test('POST 400 responds with bad request if non existent topic is provided', () => {
        return request(app)
        .post('/api/articles')
        .send({
            author: 'rogersop',
            title: 'Test Article',
            body: 'This is a test article about cats',
            topic: 'testing',
            additional_info: 'test data'            
        })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')
            
        })
    })
})

describe('GET /api/articles (pagination)', () => {
    test('GET 200 when no limit is set 10 articles are returned and body has total_count property showing total number of articles', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toHaveLength(10)
            expect(body.articles[0]).toHaveProperty('total_count', 13)
        })
    })
    test('GET 200 when a limit is set that number of articles is returned and body has total_count property showing total number of articles', () => {
        return request(app)
        .get('/api/articles?limit=5')
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toHaveLength(5)
            expect(body.articles[0]).toHaveProperty('total_count', 13)
        })
    })
    test('GET 200 when a filtering query is set the total_count property shows total number of articles after any filters', () => {
        return request(app)
        .get('/api/articles?limit=5&topic=cats')
        .expect(200)
        .then(({body}) => {            
            expect(body.articles[0]).toHaveProperty('total_count', 1)
        })
    })
    test('GET 200 when p is set the returned articles are sent offset in relation to limit', () => {
        return request(app)
        .get('/api/articles?limit=5&sorted_by=article_id&order=asc&p=2')
        .expect(200)
        .then(({body}) => { 
            let expectedId = 6           
            body.articles.forEach((article) => {
                expect(article.article_id).toBe(expectedId)
                expectedId++
            })
        })
    })
    test('GET 400 returns bad request when given an invalid limit', () => {
        return request(app)
        .get('/api/articles?limit=not-a-valid-limit')
        .expect(400)
        .then(({body}) => { 
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('GET 400 returns bad request when given an invalid p', () => {
        return request(app)
        .get('/api/articles?p=not-a-valid-p')
        .expect(400)
        .then(({body}) => { 
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('GET 404 returns not found when given a p larger than the number of pages', () => {
        return request(app)
        .get('/api/articles?limit=5&p=100')
        .expect(404)
        .then(({body}) => { 
            expect(body.msg).toBe('Not Found')
        })
    })
})

describe('GET /api/articles/:article_id/comments (pagination)', () => {
    test('GET 200 when no limit is set 10 comments are returned', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toHaveLength(10)
        })
    })
    test('GET 200 when a limit is set that number of comments are returned', () => {
        return request(app)
        .get('/api/articles/1/comments?limit=5')
        .expect(200)
        .then(({body}) => {
            expect(body.comments).toHaveLength(5)
        })
    })
    test('GET 200 when p is set the returned comments are sent offset in relation to limit', () => {
        return request(app)
        .get('/api/articles/1/comments?limit=5&p=3')
        .expect(200)
        .then(({body}) => {
            
            expect(body.comments).toHaveLength(1)
        })
    })
    test('GET 400 returns bad request when given an invalid limit', () => {
        return request(app)
        .get('/api/articles/1/comments?limit=not-a-limit&p=3')
        .expect(400)
        .then(({body}) => {
            
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('GET 400 returns bad request when given an invalid p', () => {
        return request(app)
        .get('/api/articles/1/comments?limit=5&p=not-a-p')
        .expect(400)
        .then(({body}) => {
            
            expect(body.msg).toBe('Bad Request')
        })
    })
    test('GET 404 returns Not Found when given a p larger than the number of pages', () => {
        return request(app)
        .get('/api/articles/1/comments?limit=5&p=20')
        .expect(404)
        .then(({body}) => {
            
            expect(body.msg).toBe('Not Found')
        })
    })
})
describe('POST /api/topics', () => {
    test('POST 201 posts a topic and responds with the new article with the correct properties', () => {
        return request(app)
        .post('/api/topics')
        .send({slug: "New Topic!", description: "This is the new topic I wish to post."})
        .expect(201)
        .then(({body}) => {
            expect(body.topic).toHaveProperty('slug', 'New Topic!')
            expect(body.topic).toHaveProperty('description', "This is the new topic I wish to post.")
        })
    })
    test('POST 201 adding extraneous elements to the request body still results in successfully posting the article', () => {
        return request(app)
        .post('/api/topics')
        .send({slug: "New Topic!", description: "This is the new topic I wish to post.", comment: "this shouldn't be here"})
        .expect(201)
        .then(({body}) => {
            expect(body.topic).toHaveProperty('slug', 'New Topic!')
            expect(body.topic).toHaveProperty('description', "This is the new topic I wish to post.")
        })
    })
    test('POST 400 responds with bad request if any required elements are missing from the request body', () => {
        return request(app)
        .post('/api/topics')
        .send({slug: "New Topic!" })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request - Slug and Description required')            
        })
    })
    test('POST 400 responds with bad request if topic already exists (based on slug)', () => {
        return request(app)
        .post('/api/topics')
        .send({slug: "cats", description: "feline friends" })
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')            
        })
    })
})

describe('DELETE /api/articles/:article_id', () => {
    test('DELETE 204 deletes a given article and any associated comments', () => {
        return request(app)
        .delete('/api/articles/7')
        .expect(204)
        .then(() => {
            return db.query(`
                SELECT * FROM articles
                WHERE article_id = 7;
                `)                
        })
        .then(({rows}) => {
            expect(rows).toHaveLength(0)
        })
        .then(() => {
            return db.query(`
                SELECT * FROM comments
                WHERE article_id = 7;
                `)                
        })
        .then(({rows}) => {
            expect(rows).toHaveLength(0)
        })
    })
    test('DELETE 400 returns bad request when given an invalid article_id', () => {
        return request(app)
        .delete('/api/articles/not-an-id')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('Bad Request')               
        })        
    })
    test('DELETE 404 returns Not Found when given a valid article_id for an article that doesn\'t exist', () => {
        return request(app)
        .delete('/api/articles/55555')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('Article Not Found')               
        })        
    })
})



