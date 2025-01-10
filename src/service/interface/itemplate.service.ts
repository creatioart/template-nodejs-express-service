import {BaseList, SearchOption} from '@creatioart-js/express-core';
import {IBaseService} from '@creatioart-js/express-storage';
import {TemplateRequestDto} from '../../dto/template/template.request.dto.js';
import {TemplateResponseDto} from '../../dto/template/template.response.dto.js';
import {Template} from '../../entity/template.js';

/**
 * ITemplate Service
 */
export interface ITemplateService extends IBaseService<Template> {
 /**
   * Get Template List Dto
   * @param searchOption Search Option
   * @param traceId Trace id
   * @returns Template Response List Dto
   */
 getTemplateListDto(searchOption: SearchOption, traceId: string): Promise<BaseList<TemplateResponseDto>>;

  /**
   * Get the Template Dto By Id
   * @param templateId Template Id
   * @param traceId Trace id
   * @returns Template Response Dto
   */
  getTemplateDtoById(templateId: number, traceId: string): Promise<TemplateResponseDto>;

  /**
   * Create new Template
   * @param entityDto Template Request Dto
   * @param traceId Trace id
   * @returns Template Response Dto
   */
  createFromDto(entityDto: TemplateRequestDto, traceId: string): Promise<TemplateResponseDto>;

  /**
   * Update an existing Template
   * @param entityDto Template Request Dto
   * @param traceId Trace id
   * @returns Template Response Dto
   */
  updateFromDto(templateId: number, entityDto: TemplateRequestDto, traceId: string): Promise<TemplateResponseDto>;

  /**
   * Patch an existing Template
   * @param templateId Template Id
   * @param entityPatch Template Request Dto
   * @param traceId Trace id
   * @returns Template Response Dto
   */
  patchFromDto(templateId: number, entityPatch: any, traceId: string): Promise<TemplateResponseDto>;

  /**
   * Delete an existing Template
   * @param templateId Template Id
   * @param traceId Trace id
   * @returns True/False
   */
  deleteFromDto(templateId: number, traceId: string): Promise<boolean>;
}
