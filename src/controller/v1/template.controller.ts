import 'reflect-metadata';

import {Service} from 'typedi';
import {QueryRequestHelper, SearchOption, TraceHelper} from '@creatioart-js/express-core';
import {Logger} from '@creatioart-js/express-logging';
import {Res, JsonController, Get, Authorized, Param, Post, Body, Req, QueryParams, Put, Patch, Delete,
        OnUndefined} from 'routing-controllers';
import {ServiceLocator} from '../../locator/service.locator';
import {PermissionConfig} from '../../config/permission.config';
import {TemplateRequestDto} from '../../dto/template/template.request.dto';
import {TemplateResponseDto} from '../../dto/template/template.response.dto';

@Service()
@JsonController('/v1/templates')
export class TemplateController {
  /**
   * Get Templates
   * @param request Request
   * @param query Query params
   * @param response Response
   * @returns Template Response List Dto
   */
  @Get()
  @Authorized(PermissionConfig.NO_AUTHORIZATION)
  public async getTemplates(@Req() request: any, @QueryParams() query: any, @Res() response: any)
                            : Promise<TemplateResponseDto[]> {
    const traceId = TraceHelper.getHTTPTraceIdentifier(request);
    Logger().info(`Event Get<Template> was received at ${new Date().toISOString()}. Trace: ${traceId}`);

    const searchOption = QueryRequestHelper.getSearchOptionByQueryParam([], query, traceId);

    // Get Templates
    const entityList = await ServiceLocator.TemplateService().getTemplateListDto(searchOption, traceId);

    response.setHeader('count', entityList.count);
    return entityList.list;
  }

  /**
   * Search App Users in Deployment
   * @param deploymentId Deployment Id
   * @param options Search Options
   * @param request Request
   * @param response Response
   * @returns App User Response List Dto
   */
  @Post('/search')
  @Authorized(PermissionConfig.NO_AUTHORIZATION)
  public async searchTemplates(@Body({options: {limit: '32mb'}}) options: any, @Req() request: any,
                               @Res() response: any): Promise<TemplateResponseDto[]> {
    const traceId = TraceHelper.getHTTPTraceIdentifier(request);
    Logger().info(`Event Search<Template> was received at ${new Date().toISOString()}. Trace: ${traceId}`);

    const searchOption = SearchOption.build().plainToClass(options);

    // Get Templates
    const entityList = await ServiceLocator.TemplateService().getTemplateListDto(searchOption, traceId);

    response.setHeader('count', entityList.count);
    return entityList.list;
  }

  /**
   * Get a Template
   * @param request Request
   * @param templateId Template Id
   * @returns Template Response Dto
   */
  @Get('/:templateId')
  @Authorized(PermissionConfig.NO_AUTHORIZATION)
  public async getTemplate(@Req() request: any, @Param('templateId') templateId: number)
                           : Promise<TemplateResponseDto> {
    const traceId = TraceHelper.getHTTPTraceIdentifier(request);
    Logger().info(`Event Get<Template> was received at ${new Date().toISOString()} by ${templateId} template. ` +
                  `Trace: ${traceId}`);

    // Get Template
    return await ServiceLocator.TemplateService().getTemplateDtoById(templateId, traceId);
  }

  /**
   * Create Template
   * @param request Request
   * @param entity Template
   * @returns Template Response Dto
   */
  @Post()
  @Authorized(PermissionConfig.NO_AUTHORIZATION)
  public async createTemplate(@Req() request: any, @Body({options: {limit: '32mb'}}) entity: any)
                              : Promise<TemplateResponseDto> {
    const traceId = TraceHelper.getHTTPTraceIdentifier(request);
    Logger().info(`Event Create<Template> was received at ${new Date().toISOString()}. Trace: ${traceId}`);

    const entityDto = TemplateRequestDto.build().plainToClass(entity);

    // Create User
    return await ServiceLocator.TemplateService().createFromDto(entityDto, traceId);
  }

  /**
   * Update Template
   * @param request Request
   * @param templateId Template id
   * @param entity Template
   * @returns Template Response Dto
   */
  @Put('/:templateId')
  @Authorized(PermissionConfig.NO_AUTHORIZATION)
  public async updateTemplate(@Req() request: any, @Param('templateId') templateId: number,
                              @Body({options: {limit: '32mb'}}) entity: any): Promise<TemplateResponseDto> {
    const traceId = TraceHelper.getHTTPTraceIdentifier(request);
    Logger().info(`Event Update<Template> by ${templateId} template was received at ${new Date().toISOString()}. ` +
                  `Trace: ${traceId}`);

    const entityDto = TemplateRequestDto.build().plainToClass(entity);

    // Update User
    return await ServiceLocator.TemplateService().updateFromDto(templateId, entityDto, traceId);
  }

  /**
   * Update Template
   * @param request Request
   * @param templateId Template id
   * @param entityPatch Template Patch
   * @returns Template Response Dto
   */
  @Patch('/:templateId')
  @Authorized(PermissionConfig.NO_AUTHORIZATION)
  public async patchTemplate(@Req() request: any, @Param('templateId') templateId: number,
                             @Body({options: {limit: '32mb'}}) entityPatch: any): Promise<TemplateResponseDto> {
    const traceId = TraceHelper.getHTTPTraceIdentifier(request);
    Logger().info(`Event Patch<Template> by ${templateId} template was received at ${new Date().toISOString()}. ` +
                  `Trace: ${traceId}`);

    // Update User
    return await ServiceLocator.TemplateService().patchFromDto(templateId, entityPatch, traceId);
  }

  /**
   * Delete Template
   * @param request Request
   * @param templateId Template id
   * @returns No Content
   */
  @Delete('/:templateId')
  @OnUndefined(204)
  @Authorized(PermissionConfig.NO_AUTHORIZATION)
  public async deleteTemplate(@Req() request: any, @Param('templateId') templateId: number): Promise<void> {
    const traceId = TraceHelper.getHTTPTraceIdentifier(request);
    Logger().info(`Event Delete<Template> by ${templateId} template was received at ${new Date().toISOString()}. ` +
                  `Trace: ${traceId}`);

    // Delete User
    await ServiceLocator.TemplateService().deleteFromDto(templateId, traceId);
    return;
  }
}
