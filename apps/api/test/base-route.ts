import { INestApplication } from '@nestjs/common';
import * as pactum from 'pactum';
import { faker } from '@faker-js/faker';

export class BaseRouteTesting {
  app!: INestApplication;
  pathName!: string;
  accessToken!: string;
  admin!: {
    email: string,
    password: string,
  };
  adminUser: { id: string, [k: string]: unknown };
  adminId!: string;
  user!: {
    email: string,
    password: string,
  }
  userId!: string;

  constructor(app: INestApplication, pathName: string) {
    this.pathName = pathName;
    this.app = app
  }

  routeTest() {
    throw new Error('Not implemented');
  }

  async createAllUsers () {
    await Promise.all([this.createAdmin(), this.createUser()])
  }

  private async createAdmin() {
    this.admin = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 10 }),
    }

    this.adminUser = await this.customPostPrivate('auth/register')
    .withJson({
      ...this.admin,
      username: faker.internet.username(),
      role: 'Admin',
    }).expectStatus(201).returns('res.body')
    this.adminId = this.adminUser.id
    
  }

  public async createUser() {
    this.user = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 10 }),
    }

    this.userId = await this.customPostPrivate('auth/register')
    .withJson({
      ...this.user,
      username: faker.internet.username(),
    }).expectStatus(201).returns('id')
  }

  protected async setAccessToken() {
    this.accessToken = await this.getAccessToken();
  }

  protected async setAdminAccessToken() {
    this.accessToken = await this.getAdminAccessToken();
  }

  protected async getAccessToken() {
    return this.customPostPrivate('auth/login')
      .withJson(this.user)
      .expectStatus(201)
      .returns('access_token') as unknown as string;
  }

  protected async getAdminAccessToken() {
    return this.customPostPrivate('auth/login')
      .withJson(this.admin)
      .expectStatus(201)
      .returns('access_token') as unknown as string;
  }

  protected findById(id: string) {
    return pactum
      .spec()
      .get(`/${this.pathName}/{id}`)
      .withPathParams('id', id)
      .withHeaders('Authorization', `Bearer ${this.accessToken}`);
  }

  protected find() {
    return pactum
      .spec()
      .get(`/${this.pathName}`)
      .withHeaders('Authorization', `Bearer ${this.accessToken}`);
  }

  protected deleteById(id: string) {
    return pactum
      .spec()
      .delete(`/${this.pathName}/{id}`)
      .withPathParams('id', id)
      .withHeaders('Authorization', `Bearer ${this.accessToken}`);
  }

  protected updateById(id: string) {
    return pactum
      .spec()
      .patch(`/${this.pathName}/{id}`)
      .withPathParams('id', id)
      .withHeaders('Authorization', `Bearer ${this.accessToken}`);
  }

  protected create() {
    return pactum
      .spec()
      .post(`/${this.pathName}`)
      .withHeaders('Authorization', `Bearer ${this.accessToken}`);
  }

  protected customPost(path: string) {
    return pactum
      .spec()
      .post(`/${this.pathName}/${path}`)
      .withHeaders('Authorization', `Bearer ${this.accessToken}`);
  }

  protected customPostwithPath(path: string) {
    return pactum
      .spec()
      .post(`/${path}`)
      .withHeaders('Authorization', `Bearer ${this.accessToken}`);
  }

  protected customGet(path: string) {
    return pactum
      .spec()
      .get(`/${this.pathName}/${path}`)
      .withHeaders('Authorization', `Bearer ${this.accessToken}`);
  }

  protected customGetWithoutAccessToken(path: string) {
    return pactum.spec().get(`/${this.pathName}/${path}`);
  }

  protected customPostWithoutAccessToken(path: string) {
    return pactum.spec().post(`/${this.pathName}/${path}`);
  }
  private customPostPrivate(path: string) {
    return pactum.spec().post(`/${path}`);
  }

  protected customPostById(path: string, id: string) {
    return pactum
      .spec()
      .post(`/${this.pathName}/{id}/${path}`)
      .withPathParams('id', id)
      .withHeaders('Authorization', `Bearer ${this.accessToken}`);
  }

  protected customGetById(path: string, id: string) {
    return pactum
      .spec()
      .get(`/${this.pathName}/{id}/${path}`)
      .withPathParams('id', id)
      .withHeaders('Authorization', `Bearer ${this.accessToken}`);
  }

  protected itu(name: string, fn: () => Promise<unknown>) {
    it(name, async () => {
      await this.setAccessToken();
      await fn();
    });
  }

  protected ita(name: string, fn: () => Promise<unknown>) {
    it(name, async () => {
      await this.setAdminAccessToken();
      await fn();
    });
  }
}