import 'reflect-metadata';

import {Service} from 'typedi';
import {Logger} from '@creatioart-js/express-logging';
import {Filter, Order, BaseList, SortType, ErrorStatus, OperatorType} from '@creatioart-js/express-core';
import {IRepositoryManager} from '@creatioart-js/express-storage';
import {ErrorResponse} from '@creatioart-js/express-error-handler';
import {ErrorCode, InternalError} from '@creatioart-js/express-error';
import {Template} from '../entity/template.js';

// Template Repository
@Service()
export class TemplateRepository implements IRepositoryManager<Template> {
  public key: string;

  private templateSource: Template[];

  public _: boolean;

  /**
   * Constructor
   */
  constructor() {
    this.templateSource = [
      new Template(1, 'template1', 'Template #1'),
      new Template(2, 'template2', 'Template #2'),
      new Template(3, 'template3', 'Template #3'),
      new Template(4, 'template4', 'Template #4'),
      new Template(5, 'template5', 'Template #5'),
      new Template(6, 'template6', 'Template #6'),
      new Template(7, 'template7', 'Template #7'),
      new Template(8, 'template8', 'Template #8'),
      new Template(9, 'template9', 'Template #9')
    ];
    this.key = Template.Name;
    this._ = true;
  }

  /**
   * Create the template
   * @param item Template
   * @param traceId Trace id | Optional
   */
  public async create(item: Template, traceId?: string): Promise<Template> {
    Logger().info(`Create Entity on Memory by ${this.key} ${traceId !== undefined ? `. Trace: ${traceId}` : ''}`);

    // Create new Id
    const lastEntity = this.templateSource.findLast((x) => Number.isInteger(x.id) === true);
    item.id = lastEntity !== undefined ? (lastEntity.id as number) + 1 : 1;

    // Insert
    this.templateSource.push(item);

    return item;
  }

  /**
   * Update the template
   * @param item Template
   * @param traceId Trace id | Optional
   */
  public async update(item: Template, traceId?: string): Promise<Template> {
    Logger().info(`Edit Entity on Memory by ${this.key} ${traceId !== undefined ? `. Trace: ${traceId}` : ''}`);

    // Get index
    const itemIndex = this.templateSource.findIndex((x) => x.id === item.id);

    if (itemIndex > -1) {
      this.templateSource[itemIndex] = item;

      return this.templateSource[itemIndex];
    }

    // return error
    throw new ErrorResponse(new InternalError(ErrorStatus.INTERNAL_SERVER_ERROR,
                                              `Oops! Error on uptate entity`, ErrorCode.INTERNAL_SERVER_ERROR_BASE));
  }

  /**
   * Delete the template
   * @param id Template id
   * @param traceId Trace id | Optional
   */
  public async  delete(id: any, traceId?: string): Promise<boolean> {
    Logger().info(`Delete by Id on Memory by ${this.key} ${traceId !== undefined ? `. Trace: ${traceId}` : ''}`);

    // Get index
    const itemIndex = this.templateSource.findIndex((x) => x.id === id);

    if (itemIndex > -1) {
      this.templateSource.splice(itemIndex, 1);

      return true;
    }

    return false;
  }

  /**
   * Get the template
   * @param id Template id
   * @param filter Filter | Optional
   * @param traceId Trace id | Optional
   */
  public async findOne(id: any, _: Filter[] | undefined, traceId?: string): Promise<Template> {
    Logger().info(`Get by Id on Filter on Memory by ${this.key} ${traceId !== undefined ? `. Trace: ${traceId}` : ''}`);

    // Get index
    const itemIndex = this.templateSource.findIndex((x) => x.id === id);

    if (itemIndex > -1 && this.templateSource[itemIndex] !== undefined) {
      return this.templateSource[itemIndex];
    }

    // return error
    throw new ErrorResponse(new InternalError(ErrorStatus.INTERNAL_SERVER_ERROR,
      `Oops! You're trying to get an invalid data. Please check it and try again`,
      ErrorCode.INTERNAL_SERVER_ERROR_BASE));
  }

  /**
   * Get templates by filter
   * @param filter Filter | Optional
   * @param order Order | Optional
   * @param page Page | Optional
   * @param pageCount Page Count
   * @param traceId Trace id | Optional
   */
  public async findBy(filters: Filter[] | undefined, order: Order | undefined, page: number | 0, pageCount: number | 0,
                      traceId?: string): Promise<BaseList<Template>> {
    Logger().info(`Get Entities List by Filter on Memory by ${this.key} ` +
                  `${traceId !== undefined ? `. Trace: ${traceId}` : ''}`);
    let templateSourceCopy = this.templateSource.slice();

    // Apply filters
    if (filters !== undefined) {
      filters.forEach((item) => {
        switch (item.operator) {
          // Equal to operator
          case OperatorType.EQUAL:
            templateSourceCopy = templateSourceCopy.filter((i: any) => i[item.property] === item.value);
            break;

          // Less than operator
          case OperatorType.LESS_THAN:
            templateSourceCopy = templateSourceCopy.filter((i: any) => i[item.property] < item.value);
            break;

          // Greater than operator
          case OperatorType.GREATER_THAN:
            templateSourceCopy = templateSourceCopy.filter((i: any) => i[item.property] > item.value);
            break;

          // Not equal to operator
          case OperatorType.NOT_EQUAL:
            templateSourceCopy = templateSourceCopy.filter((i: any) => i[item.property] !== item.value);
            break;

          default:
            break;
        }
      });
    }

    // Apply order
    if (order !== undefined) {
      templateSourceCopy = order.sort === SortType.ASCENDING
        ? templateSourceCopy.sort((item1: any, item2: any) => (item1[order.property] > item2[order.property])
                                                                ? 1
                                                                : ((item2[order.property] > item1[order.property])
                                                                  ? -1
                                                                  : 0))
        : templateSourceCopy.sort((item1: any, item2: any) => (item1[order.property] < item2[order.property])
                                                                ? 1
                                                                : ((item2[order.property] < item1[order.property])
                                                                  ? -1
                                                                  : 0));
    } else {
      templateSourceCopy = templateSourceCopy.sort((item1: any, item2: any) => (item1.id > item2.id)
                                                                ? 1
                                                                : ((item2.id > item1.id)
                                                                  ? -1
                                                                  : 0));
    }

    // Apply pagginate
    if (page !== undefined && pageCount !== undefined && page > 0 && pageCount > 0) {
      templateSourceCopy = templateSourceCopy.slice((page - 1) * pageCount, page * pageCount);
    }

    // get Count
    const count = await this.count(filters, traceId);

    return new BaseList<Template>(count, templateSourceCopy);
  }

  /**
   * Get Count template
   * @param filters Filter | Optional
   * @param traceId Trace id | Optional
   */
  public async count(filters: Filter[] | undefined, traceId?: string): Promise<number> {
    Logger().info(`Get Count element by ${this.key} ${traceId !== undefined ? `. Trace: ${traceId}` : ''}`);
    let templateSourceCopy = this.templateSource.slice();

    // Apply filters
    if (filters !== undefined) {
      filters.forEach((item) => {
        switch (item.operator) {
          // Equal to operator
          case OperatorType.EQUAL:
            templateSourceCopy = templateSourceCopy.filter((i: any) => i[item.property] === item.value);
            break;

          // Less than operator
          case OperatorType.LESS_THAN:
            templateSourceCopy = templateSourceCopy.filter((i: any) => i[item.property] < item.value);
            break;

          // Greater than operator
          case OperatorType.GREATER_THAN:
            templateSourceCopy = templateSourceCopy.filter((i: any) => i[item.property] > item.value);
            break;

          // Not equal to operator
          case OperatorType.NOT_EQUAL:
            templateSourceCopy = templateSourceCopy.filter((i: any) => i[item.property] !== item.value);
            break;

          default:
            break;
        }
      });
    }

    return templateSourceCopy.length;
  }
}
