import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Request } from "express";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { GameService } from "@/game/service/game.service";
import { TagDto } from "@/tag/dto/tag.dto";
import { TagGuard } from "@/tag/guards/tag.guard";
import { TagService } from "@/tag/service/tag.service";
import { Tag } from "@/tag/tag.entity";
import { TranslationService } from "@/translation/translation.service";
import { UserService } from "@/user/service/user.service";

@UseGuards(JwtAuthGuard, TagGuard)
@ApiTags('tags')
@Controller('/games/:gameId/tags')
export class TagController {
  constructor(
    private readonly tagService: TagService,
    private readonly userService: UserService,
    private readonly gameService: GameService,
    private readonly translationService: TranslationService
  ) { }

  @Get("")
  @ApiOperation({ summary: 'Get all game\'s tags' })
  @ApiOkResponse({ type: Tag, isArray: true })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  async getAllTags(): Promise<Tag[]> {
    return this.tagService.getAll();
  }

  @Get('/:tagId')
  @ApiOperation({ summary: 'Get one tag' })
  @ApiParam({ name: 'tagId', type: 'string', required: true })
  @ApiOkResponse({ type: Tag })
  @ApiUnauthorizedResponse()
  async getOne(@Req() request: Request, @Param('tagId') tagId: string): Promise<Tag | null> {
    const tag = await this.tagService.getOne(tagId);
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
    await this.tagService.delete(tagId);
  }
}