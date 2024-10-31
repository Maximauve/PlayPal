import { INestApplication } from '@nestjs/common';
import { BaseRouteTesting } from './base-route';
import {faker} from '@faker-js/faker'
import { Role } from '@/user/role.enum';
export class AuthTesting extends BaseRouteTesting {
  constructor(app: INestApplication) {
    super(app, 'auth');
  }

  routeTest() {
    describe('route', () => {
      const commonEmail = faker.internet.email()
      beforeAll(async () => {
        await this.createAllUsers()
      })
      describe('auth', () => {
        describe('post auth/register', () => {
          it('should return 201', async () => {
            await this.customPostWithoutAccessToken('register')
              .withJson({
                email: commonEmail,
                username: faker.internet.username(),
                password: 'Qwertyuiop123!',
              })
              .expectStatus(201)
              .expectBodyContains('accessToken');
          });

          it('should return 409 for user alreay exist', (): any => {
            return this.customPostWithoutAccessToken('register')
              .withJson({
                email: commonEmail,
                username: faker.internet.username(),
                password: 'Qwertyuiop123!',
              })
              .expectStatus(409);
          });

          it('should return 400 for email not correct', (): any => {
            return this.customPostWithoutAccessToken('register')
              .withJson({
                email: faker.internet.username(),
                username: faker.internet.username(),
                password: 'Qwertyuiop123!',
              })
              .expectStatus(400);
          });

          it('should return 400 because username is mandatory', (): any => {
            return this.customPostWithoutAccessToken('register')
              .withJson({
                email: 'test@test2.test',
                password: 'Qwertyuiop123!',
              })
              .expectStatus(400);
          });
        });
        describe('post auth/login', () => {
          it('should return 201', (): any => {
            return this.customPostWithoutAccessToken('login')
              .withJson({
                email: commonEmail,
                password: 'Qwertyuiop123!',
              })
              .expectStatus(201)
              .expectBodyContains('accessToken');
          });
          it('should return 401 wrong passsword', (): any => {
            return this.customPostWithoutAccessToken('login')
              .withJson({
                email: commonEmail,
                password: 'Qwertyuiop12!',
              })
              .expectStatus(401);
          });
        });
        // get me
        // describe('get /users/me', () => {
        //   it('should return 401', (): any => {
        //     return this.customGetWithoutAccessToken('me').expectStatus(401);
        //   });
        //   this.itu('should return 200', async () => {
        //     return this.customGet('me')
        //       .expectStatus(200)
        //       .expectJsonSchema({
        //         type: 'object',
        //         properties: {
        //           username: {
        //             type: 'string',
        //           },
        //           email: {
        //             type: 'string',
        //           },
        //           id: {
        //             type: 'string',
        //           },
        //           role: {
        //             type: 'string',
        //           },
        //         },
        //       })
        //       .expectBodyContains(this.user.email);
        //   });
        // });

      });
    });
  }
}