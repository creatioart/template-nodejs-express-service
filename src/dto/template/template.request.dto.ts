import 'reflect-metadata';

import {IsNotEmpty, IsString, validate} from 'class-validator';
import {BaseDto, BaseError, ClassNameGetter, ErrorStatus, StringHelper, ValidationOptionsDecorator, ValidationType,
        ValidatorHelper} from '@creatioart-js/express-core';
import {ErrorCode, ValidationError} from '@creatioart-js/express-error';
import {CoreServiceLocator} from '../../locator/core.service.locator';
import {Template} from '../../entity/template';

/**
 * Template Request Dto
 */
@ClassNameGetter
export class TemplateRequestDto extends BaseDto<TemplateRequestDto> {
  /**
   * Build factory method
   * @returns Instance
   */
  public static build() {
    return new this();
  }

  /**
   * Validate the instance
   * @param instance Template Request Dto
   * @returns Base Error | undefined
   */
  public static async validate(instance: TemplateRequestDto): Promise<BaseError | undefined> {
    const validationError: any = await validate(instance, {validationError: {target: false, value: false}});
    let validation: any[] = [];
    if (validationError.length > 0) {
      validation = validation.concat(ValidatorHelper.getValidation(validationError));
    }

    if (validation.length > 0) {
      // Has error validation
      return new ValidationError(
        ErrorStatus.UNPROCESSABLE_ENTITY,
        CoreServiceLocator.LocaleService().translate('validation_errors'),
        ErrorCode.UNPROCESSABLE_ENTITY_BASE,
        this.Name,
        ValidatorHelper.getValidation(validationError)
      );
    }

    return undefined;
  }

  /**
   * Validate the instance
   * @returns Base Error | undefined
   */
  public override async validate(): Promise<BaseError | undefined> {
    return await TemplateRequestDto.validate(this);
  }

  /**
   * Create class from Request
   * @param source Body Request
   * @returns Template Request Dto
   */
  public override plainToClass(source: any): TemplateRequestDto {
    const instance = new TemplateRequestDto();

    if (source !== undefined) {
      instance.name = StringHelper.transformString(source.name);
      instance.description = StringHelper.transformString(source.description);
    }

    return instance;
  }

  /**
   * Create class from another class
   * @param source Template Request Dto
   * @return Template Request Dto
   */
  public override classToClass(source: TemplateRequestDto): TemplateRequestDto {
    const instance = new TemplateRequestDto();

    if (source !== undefined) {
      instance.name = source.name;
      instance.description = source.description;
    }

    return instance;
  }

  /**
   * Create class entity from class dto
   * @param source Template Request Dto
   * @returns Template
   */
  public classDtoToClassEntity(source: TemplateRequestDto): Template {
    const instance = new Template();

    if (source !== undefined) {
      instance.name = source.name;
      instance.description = source.description;
    }

    return instance;
  }

  /**
   * Create class dto from class entity
   * @param source Template
   * @returns Template Request Dto
   */
  public classEntityToClassDto(source: Template): TemplateRequestDto {
    const instance = new TemplateRequestDto();

    if (source !== undefined) {
      instance.name = source.name;
      instance.description = source.description;
    }

    return instance;
  }

  @IsString(ValidationOptionsDecorator(ValidationType.IS_STRING))
  @IsNotEmpty(ValidationOptionsDecorator(ValidationType.IS_NOT_EMPTY))
  public name: string;

  @IsString(ValidationOptionsDecorator(ValidationType.IS_STRING))
  public description: string;

  // Constructor Overloading
  constructor();
  constructor(name: string, description: string);
  constructor(name?: string, description?: string) {
    super();
    this.name = name ?? '';
    this.description = description ?? '';
  }
}
