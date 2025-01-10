import 'reflect-metadata';

import {IsInt, IsNotEmpty, IsString, Min, validate} from 'class-validator';
import {BaseDto, BaseError, ClassNameGetter, ErrorStatus, StringHelper, ValidationOptionsDecorator, ValidationType,
        ValidatorHelper} from '@creatioart-js/express-core';
import {ErrorCode, ValidationError} from '@creatioart-js/express-error';
import {CoreServiceLocator} from '../../locator/core.service.locator.js';
import {Template} from '../../entity/template.js';

/**
 * Template Response Dto
 */
@ClassNameGetter
export class TemplateResponseDto extends BaseDto<TemplateResponseDto> {
  /**
   * Build factory method
   * @returns Instance
   */
  public static build() {
    return new this();
  }

  /**
   * Validate the instance
   * @param instance Template Response Dto
   * @returns Base Error | undefined
   */
  public static async validate(instance: TemplateResponseDto): Promise<BaseError | undefined> {
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
    return await TemplateResponseDto.validate(this);
  }

  /**
   * Create class from Request
   * @param source Body Request
   * @returns Template Response Dto
   */
  public override plainToClass(source: any): TemplateResponseDto {
    const instance = new TemplateResponseDto();

    if (source !== undefined) {
      instance.id = source.id ?? 0;
      instance.name = StringHelper.transformString(source.name);
      instance.description = StringHelper.transformString(source.description);
    }

    return instance;
  }

  /**
   * Create class from another class
   * @param source Template Response Dto
   * @return Template Response Dto
   */
  public override classToClass(source: TemplateResponseDto): TemplateResponseDto {
    const instance = new TemplateResponseDto();

    if (source !== undefined) {
      instance.id = source.id;
      instance.name = source.name;
      instance.description = source.description;
    }

    return instance;
  }

  /**
   * Create class entity from class dto
   * @param source Template Response Dto
   * @returns Template
   */
  public classDtoToClassEntity(source: TemplateResponseDto): Template {
    const instance = new Template();

    if (source !== undefined) {
      instance.id = source.id;
      instance.name = source.name;
      instance.description = source.description;
    }

    return instance;
  }

  /**
   * Create class dto from class entity
   * @param source Template
   * @returns Template Response Dto
   */
  public classEntityToClassDto(source: Template): TemplateResponseDto {
    const instance = new TemplateResponseDto();

    if (source !== undefined) {
      instance.id = Number.isInteger(source.id) ? source.id as number : 0;
      instance.name = source.name;
      instance.description = source.description;
    }

    return instance;
  }

  @IsNotEmpty(ValidationOptionsDecorator(ValidationType.IS_NOT_EMPTY))
  @IsInt(ValidationOptionsDecorator(ValidationType.IS_INT))
  @Min(1, ValidationOptionsDecorator(ValidationType.MIN))
  public id: number;

  @IsString(ValidationOptionsDecorator(ValidationType.IS_STRING))
  @IsNotEmpty(ValidationOptionsDecorator(ValidationType.IS_NOT_EMPTY))
  public name: string;

  @IsString(ValidationOptionsDecorator(ValidationType.IS_STRING))
  public description: string;

  // Constructor Overloading
  constructor();
  constructor(id: number, name: string, description: string);
  constructor(id?: number, name?: string, description?: string) {
    super();
    this.id = id ?? 0;
    this.name = name ?? '';
    this.description = description ?? '';
  }
}
