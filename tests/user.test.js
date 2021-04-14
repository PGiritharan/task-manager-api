const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const {user1Id,user1,setupDatabase} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should signup a new user',async ()=>{
    const response = await request(app)
        .post('/users')
        .send({
            name:'giri',
            email: 'giri@example.com',
            password: 'mypasscode777!'
        })
        .expect(201);
    
    //Assert that the db was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull();
    expect(user.password).not.toBe('mypasscode777!')

    // Assert about the response
    expect(response.body).toMatchObject({
        user:{
            name:'giri',
            email: 'giri@example.com'
        },
        token: user.tokens[0].token
    })
});

test('Should login existing user', async ()=>{
    const response = await request(app)
        .post('/users/login')
        .send({
            email: user1.email,
            password: user1.password
        })
        .expect(200);
    const user = await User.findById(user1Id);
    expect(response.body.token).toBe(user.tokens[1].token)
});

test('Should not login non-existing user', async ()=>{
    await request(app)
        .post('/users/login')
        .send({
        email: 'test@ee.com',
        password: '123ERE@11'
    }).expect(400);
});


test('Should get profile for user', async ()=>{
    await request(app)
        .get('/users/me')
        .set('Authorization',`Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200);
});

test('should not get profile for unathenticated user',async ()=>{
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
})

test('Should delete account for user', async ()=>{
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization',`Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200);
    const user = await User.findById(user1Id);
    expect(user).toBeNull();
});

test('should not delete account for unathenticated user',async ()=>{
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
})

test('Should upload avatar image', async ()=>{
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization',`Bearer ${user1.tokens[0].token}`)
        .attach('avatar','tests/fixtures/profile-pic.jpg')
        .expect(200);
    const user = await User.findById(user1Id);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async ()=>{
    await request(app)
        .patch('/users/me')
        .send({
            name: 'Test User 1'
        })
        .set('Authorization',`Bearer ${user1.tokens[0].token}`)
        .expect(200);
    const user = await User.findById(user1Id);
    expect(user.name).toBe('Test User 1');
});

test('Should not update ivalid user fields', async ()=>{
    const response = await request(app)
        .patch('/users/me')
        .send({
            location: 'Madurai'
        })
        .set('Authorization',`Bearer ${user1.tokens[0].token}`)
        .expect(400);
})

