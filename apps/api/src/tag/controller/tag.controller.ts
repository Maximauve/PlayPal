import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Request } from "express";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { TagDto } from "@/tag/dto/tag.dto";
import { TagService } from "@/tag/service/tag.service";
import { Tag } from "@/tag/tag.entity";
import { TranslationService } from "@/translation/translation.service";
import { UserService } from "@/user/service/user.service";

@UseGuards(JwtAuthGuard)
@ApiTags('tags')
@Controller('tags')
export class TagController {
  constructor(
    private readonly tagService: TagService,
    private readonly userService: UserService,
    private readonly translationService: TranslationService
  ) { }

  @Get('')
  @ApiOperation({ summary: 'Get all tags' })
  @ApiOkResponse({ type: Tag, isArray: true })
  @ApiUnauthorizedResponse()
  async getAll(): Promise<Tag[]> {
    return this.tagService.getAll();
  }

  @Get('/:tagId')
  @ApiOperation({ summary: 'Get one tag' })
  @ApiParam({ name: 'tagId', type: 'string', required: true })
  @ApiOkResponse({ type: Tag })
  @ApiUnauthorizedResponse()
  async getOne(@Req() request: Request, @Param('tagId') tagId: string): Promise<Tag | null> {
    const me = await this.userService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }

    const tag: Tag | null = await this.tagService.getOne(tagId);
    if (!tag) {
      throw new HttpException(await this.translationService.translate('error.TAG_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }

    return tag;
  }

  @Post('')
  @ApiOperation({ summary: 'Create a tag' })
  @ApiOkResponse({ type: Tag })
  @ApiUnauthorizedResponse()
  async create(@Req() request: Request, @Body() body: TagDto): Promise<Tag | null> {
    const me = await this.userService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }

    const tag = await this.tagService.create(body);
    if (!tag) {
      throw new HttpException(await this.translationService.translate('error.TAG_NOT_CREATED'), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return tag;
  }
  
  @Put('/:tagId')
  @ApiOperation({ summary: 'Update a tag' })
  @ApiParam({ name: 'tagId', type: 'string', required: true })
  @ApiOkResponse({ type: Tag })
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  async update(@Req() request: Request, @Param('tagId') tagId: string, @Body() body: TagDto): Promise<Tag> {
    const me = await this.userService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }

    await this.tagService.update(tagId, body);
    const tag = await this.tagService.getOne(tagId);
    if (!tag) {
      throw new HttpException(await this.translationService.translate('error.TAG_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }

    return tag;
  }

  @Delete('/:tagId')
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiParam({ name: 'tagId', type: 'string', required: true })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  async delete(@Req() request: Request, @Param('tagId') tagId: string): Promise<void> {
    const me = await this.userService.getUserConnected(request);
    if (!me) {
      throw new UnauthorizedException();
    }

    await this.tagService.delete(tagId);
  }
}