import 'reflect-metadata';

import {Service} from 'typedi';
import {BaseList, ErrorHelper, ErrorStatus, SearchOption} from '@creatioart-js/express-core';
import {Logger} from '@creatioart-js/express-logging';
import {EntityError, ErrorCode, InternalError} from '@creatioart-js/express-error';
import {ErrorResponse} from '@creatioart-js/express-error-handler';
import {BaseService} from '@creatioart-js/express-storage';
import {Template} from '../entity/template';
import {TemplateRequestDto} from '../dto/template/template.request.dto';
import {TemplateResponseDto} from '../dto/template/template.response.dto';
import {ITemplateService} from './interface/itemplate.service';
import {CoreServiceLocator} from '../locator/core.service.locator';
import {RepositoryLocator} from '../locator/repository.locator';

/**
 * Template Service
 */
@Service()
export class TemplateService extends BaseService<Template> implements ITemplateService {
  /**
   * Constructor
   */
  constructor() {
    super(RepositoryLocator.TemplateRepository(), Template);
  }

  /**
   * Get Template List Dto
   * @param searchOption Search Option
   * @param traceId Trace id
   * @returns Template Response List Dto
   */
  public async getTemplateListDto(searchOption: SearchOption, traceId: string)
                                  : Promise<BaseList<TemplateResponseDto>> {
    Logger().info(`Get template list by Filter: ${JSON.stringify(searchOption.filters)}, Order: ` +
                  `${JSON.stringify(searchOption.order)}, Page: ${searchOption.page}, ` +
                  `PageCount: ${searchOption.pageCount}. Trace: ${traceId}`);
    const validated = await SearchOption.validate(searchOption);
    if (validated) {
      // return error
      Logger().error(ErrorHelper.toErrorString(validated, traceId));
      throw new ErrorResponse(validated);
    }

    let entityCount = 0;
    const list: TemplateResponseDto[] = [];

    // Get All Collection By
    const entityList = await super.findBy(searchOption.filters, searchOption.order, searchOption.page,
                                          searchOption.pageCount, traceId);

    if (entityList !== undefined) {
      entityCount = entityList.count;

      for (const item of entityList.list) {
        list.push(TemplateResponseDto.build().classEntityToClassDto(item));
      }
    }

    return new BaseList(entityCount, list);
  }

  /**
   * Get the Template Dto By Id
   * @param templateId Template Id
   * @param traceId Trace id
   * @returns Template Response Dto
   */
  public async getTemplateDtoById(templateId: number, traceId: string): Promise<TemplateResponseDto> {
    Logger().info(`Get template by ${templateId} templateId. Trace: ${traceId}`);

    try {
      if (templateId !== undefined) {
        const entity = await this.findOne(templateId, traceId);

        if (entity !== undefined) {
          return TemplateResponseDto.build().classEntityToClassDto(entity);
        }
      }
    } catch (err: any) {
      Logger().error(ErrorHelper.toErrorString(err, traceId));
      Logger().error(`You're requesting a data that doesn't exist. Trace: ${traceId}`);
    }

    // return error
    throw new ErrorResponse(new EntityError(ErrorStatus.NOT_FOUND,
      CoreServiceLocator.LocaleService().translate('template_not_found'),
      ErrorCode.NOT_FOUND_BASE, Template.Name, undefined
    ));
  }

  /**
   * Create new Template
   * @param entityDto Template Request Dto
   * @param traceId Trace id
   * @returns Template Response Dto
   */
  public async createFromDto(entityDto: TemplateRequestDto, traceId: string): Promise<TemplateResponseDto> {
    Logger().info(`Create the template. Request: ${JSON.stringify(entityDto)}. Trace: ${traceId}`);

    const validated = await TemplateRequestDto.validate(entityDto);
    if (validated) {
      // return error
      Logger().error(ErrorHelper.toErrorString(validated, traceId));
      throw new ErrorResponse(validated);
    }

    let entity = TemplateRequestDto.build().classDtoToClassEntity(entityDto);

    try {
      // Call to Super
      entity = await super.create(entity, traceId);

      if (entity !== undefined) {
        const responseDto = TemplateResponseDto.build().classEntityToClassDto(entity);

        return responseDto;
      }
    } catch (err) {
      if (err instanceof ErrorResponse) {
        throw err;
      }

      Logger().error(ErrorHelper.toErrorString(err, traceId));
    }
    Logger().error(`An error occurred while creating the tempplate. Trace: ${traceId}`);

    // return error
    throw new ErrorResponse(new InternalError(ErrorStatus.INTERNAL_SERVER_ERROR,
      CoreServiceLocator.LocaleService().translate('error_creating_template'),
      ErrorCode.INTERNAL_SERVER_ERROR_BASE));
  }

  /**
   * Update an existing Template
   * @param entityDto Template Request Dto
   * @param traceId Trace id
   * @returns Template Response Dto
   */
  public async updateFromDto(templateId: number, entityDto: TemplateRequestDto, traceId: string)
                             : Promise<TemplateResponseDto> {
    Logger().info(`Update template by the ${templateId} template. Request: ${JSON.stringify(entityDto)}. ` +
                  `Trace: ${traceId}`);

    const validated = await TemplateRequestDto.validate(entityDto);
    if (validated !== undefined) {
      // return error
      Logger().error(ErrorHelper.toErrorString(validated, traceId));
      throw new ErrorResponse(validated);
    }

    // Check if the Template Exist
    let entity = await this.get(templateId, traceId);

    try {
      // Update Entity
      entity = Template.build().classToClass(entity);
      entity.name = entityDto.name;
      entity.description = entityDto.description;

      // Call to Super
      entity = await super.update(entity, traceId);

      if (entity !== undefined) {
        const responseDto = TemplateResponseDto.build().classEntityToClassDto(entity);

        return responseDto;
      }
    } catch (err) {
      if (err instanceof ErrorResponse) {
        throw err;
      }

      Logger().error(ErrorHelper.toErrorString(err, traceId));
    }
    Logger().error(`An error occurred while updating the template. Trace: ${traceId}`);

    // return error
    throw new ErrorResponse(new InternalError(ErrorStatus.INTERNAL_SERVER_ERROR,
      CoreServiceLocator.LocaleService().translate('error_updating_template'),
      ErrorCode.INTERNAL_SERVER_ERROR_BASE));
  }

  /**
   * Patch an existing Template
   * @param templateId Template Id
   * @param entityPatch Template Request Dto
   * @param traceId Trace id
   * @returns Template Response Dto
   */
  public async patchFromDto(templateId: number, entityPatch: any, traceId: string): Promise<TemplateResponseDto> {
    Logger().info(`Path the template by the ${templateId} template. Request: ${JSON.stringify(entityPatch)}. ` +
                  `Trace: ${traceId}`);

    // Check if the Template Exist
    const entityStored: any = await this.get(templateId, traceId);

    try {
      const emptyEntity = Template.build();
      const propertiesToUpdate = [];
      const propertiesNotUpdated = [];

      // Patch Entity
      for (const key in entityPatch) {
        Logger().info(`Path -> Key: ${key}. Trace: ${traceId}`);

        if (Object.prototype.hasOwnProperty.call(entityPatch, key) &&
            Object.prototype.hasOwnProperty.call(emptyEntity, key)) {
          let is_valid = true;

          // Check for Validation ==> Can Update the Field
          if (is_valid === true && Template.CanUpdateField.includes(key) === false) {
            is_valid = false;
          }

          if (is_valid === true) {
            propertiesToUpdate.push(key);
            entityStored[key] = entityPatch[key];
          } else {
            propertiesNotUpdated.push(key);
          }
        }
      }

      // Properties Not Updated
      if (propertiesNotUpdated.length > 0) {
        Logger().warn(`Properties not Updated in the Template: ${propertiesNotUpdated.join(',')}. ` +
                      `Trace: ${traceId}`);
      }

      // Properties Updated
      Logger().info(`Properties to Update in the Template: ${propertiesToUpdate.join(',')}. Trace: ${traceId}`);
      if (propertiesToUpdate.length > 0) {
        // Call to Super
        let entity = Template.build().classToClass(entityStored);
        entity = await super.update(entity, traceId);

        if (entity !== undefined) {
          const responseDto = TemplateResponseDto.build().classEntityToClassDto(entity);

          return responseDto;
        }

        Logger().error(`An error occurred while updating the template for the ${templateId} template. ` +
                        `Trace: ${traceId}`);

        // return error
        throw new ErrorResponse(new InternalError(ErrorStatus.INTERNAL_SERVER_ERROR,
          CoreServiceLocator.LocaleService().translate('error_updating_template'),
          ErrorCode.INTERNAL_SERVER_ERROR_BASE));
      }

      return TemplateResponseDto.build().classEntityToClassDto(entityStored);
    } catch (err) {
      if (err instanceof ErrorResponse) {
        throw err;
      }

      Logger().error(ErrorHelper.toErrorString(err, traceId));
      Logger().error(`Some error ocurr while updating template by the ${templateId} template. Trace: ${traceId}`);
    }

    // return error
    throw new ErrorResponse(new InternalError(ErrorStatus.INTERNAL_SERVER_ERROR,
      CoreServiceLocator.LocaleService().translate('error_updating_template'),
      ErrorCode.INTERNAL_SERVER_ERROR_BASE));
  }

  /**
   * Delete an existing Template
   * @param templateId Template Id
   * @param traceId Trace id
   * @returns True/False
   */
  public async deleteFromDto(templateId: number, traceId: string): Promise<boolean> {
    Logger().info(`Delete the Template by the ${templateId} template. Trace: ${traceId}`);
    let response = false;

    try {
      const entity = await this.get(templateId, traceId);

      // Remove the collection
      response = await super.delete(entity.id as number, traceId);
    } catch (err) {
      Logger().error(ErrorHelper.toErrorString(err, traceId));
      Logger().error(`Some error ocurr while deleting the template by the ${templateId} template. Trace: ${traceId}`);
    }

    Logger().info(`Delete Template by the ${templateId} template. Result Operation: ${response}. Trace: ${traceId}`);
    return response;
  }
}
