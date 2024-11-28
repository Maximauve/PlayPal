import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Put, UseGuards } from "@nestjs/common";
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { Tag } from "@playpal/schemas";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { TagRequest } from "@/tag/decorators/tag.decorator";
import { TagDto } from "@/tag/dto/tag.dto";
import { TagUpdatedDto } from "@/tag/dto/tagUpdated.dto";
import { TagGuard } from "@/tag/guards/tag.guard";
import { TagService } from "@/tag/service/tag.service";
import { TranslationService } from "@/translation/translation.service";

@UseGuards(JwtAuthGuard)
@ApiTags('tags')
@Controller('/tags')
export class TagController {
  constructor(
    private readonly tagService: TagService,
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

  @UseGuards(TagGuard)
  @Get('/:tagId')
  @ApiOperation({ summary: 'Get one tag' })
  @ApiParam({ name: 'tagId', type: 'string', required: true })
  @ApiOkResponse({ type: Tag })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  getOne(@TagRequest() tag: Tag): Tag {
    return tag;
  }

  @Post('')
  @ApiOperation({ summary: 'Create a tag' })
  @ApiOkResponse({ type: Tag })
  @ApiUnauthorizedResponse()
  @ApiInternalServerErrorResponse()
  async create(@Body() body: TagDto): Promise<Tag | null> {
    const tag = await this.tagService.create(body);
    if (!tag) {
      throw new HttpException(await this.translationService.translate('error.TAG_NOT_CREATED'), HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return tag;
  }
  
  @UseGuards(TagGuard)
  @Put('/:tagId')
  @ApiOperation({ summary: 'Update a tag' })
  @ApiParam({ name: 'tagId', required: true })
  @ApiOkResponse({ type: Tag })
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  async update(@TagRequest() tag: Tag, @Body() body: TagUpdatedDto): Promise<Tag> {
    await this.tagService.update(tag.id, body);
    const tagUpdated: Tag | null = await this.tagService.getOne(tag.id);
    if (!tagUpdated) {
      throw new HttpException(await this.translationService.translate('error.TAG_NOT_FOUND'), HttpStatus.NOT_FOUND);
    }
    return tagUpdated;
  }

  @UseGuards(TagGuard)
  @Delete('/:tagId')
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiParam({ name: 'tagId', type: 'string', required: true })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse()
  async delete(@TagRequest() tag: Tag): Promise<void> {
    if (await this.tagService.checkIsInGame(tag.id)) {
      throw new HttpException(await this.translationService.translate("error.TAGS_IS_IN_GAME"), HttpStatus.CONFLICT);
    }
    await this.tagService.delete(tag.id);
  }
}
