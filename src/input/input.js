import { bindable, customElement } from 'aurelia-templating';
import { bindingMode } from 'aurelia-binding';
import { inject } from 'aurelia-dependency-injection';
import { TaskQueue } from 'aurelia-task-queue';
import { getBooleanFromAttributeValue } from '../common/attributes';
import { MdInputUpdateService } from './input-update-service';
import { fireEvent } from '../common/events';

@customElement('md-input')
@inject(Element, TaskQueue, MdInputUpdateService)
export class MdInput {
  static id = 0;

  @bindable() mdLabel = '';
  @bindable() mdName = '';
  @bindable() mdDisabled = false;
  @bindable({
    defaultBindingMode: bindingMode.oneTime
  }) mdPlaceholder = '';
  @bindable({
    defaultBindingMode: bindingMode.oneTime
  }) mdTextArea = false;
  @bindable({
    defaultBindingMode: bindingMode.oneTime
  }) mdType = 'text';
  @bindable({
    defaultBindingMode: bindingMode.oneTime
  }) mdStep = 'any';
  @bindable({
    defaultBindingMode: bindingMode.oneTime
  }) mdValidate = false;
  @bindable({
    defaultBindingMode: bindingMode.oneTime
  }) mdShowErrortext = true;
  @bindable() mdValidateError;
  @bindable() mdValidateSuccess;
  @bindable({
    defaultBindingMode: bindingMode.twoWay
  }) mdValue = '';

  _suspendUpdate = false;

  constructor(element, taskQueue, updateService) {
    this.element = element;
    this.taskQueue = taskQueue;
    this.controlId = `md-input-${MdInput.id++}`;
    this.updateService = updateService;
  }

  bind() {
    this.mdTextArea = getBooleanFromAttributeValue(this.mdTextArea);
    this.mdShowErrortext = getBooleanFromAttributeValue(this.mdShowErrortext);
  }

  attached() {
    if (getBooleanFromAttributeValue(this.mdValidate)) {
      this.input.classList.add('validate');
    }
    if (this.mdValidateError)  {
      this.label.setAttribute('data-error', this.mdValidateError);
    }
    if (this.mdValidateSuccess)  {
      this.label.setAttribute('data-success', this.mdValidateSuccess);
    }
    if (this.mdPlaceholder) {
      this.input.setAttribute('placeholder', this.mdPlaceholder);
    }
    if (this.mdShowErrortext) {
      this.input.setAttribute('data-show-errortext', this.mdShowErrortext);
    }
    this.updateService.update();
  }

  blur() {
    fireEvent(this.element, 'blur');
  }

  mdValueChanged() {
    if (!$(this.input).is(':focus')) {
      this.updateService.update();
    }
    if (this.mdTextArea) {
      $(this.input).trigger('autoresize');
    }
  }
}
