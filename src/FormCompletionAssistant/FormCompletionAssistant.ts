import type { Assertion, AssertionId } from "../Assertion/Assertion";

/**** FormCompletionAssistant model ****
 * Este código es provisto as-is. No ha sido probado en producción y
 * fue desarrollado con el propósito de ejemplificar lo mostrado en el webinar
 * de Diseño a la gorra.
 * Le cambie los nombres a los mostrados en el webinar para utilizar unos más
 * relacionados al dominio de negocio y tanto a la implementación. Para ello utilicé
 * la metáfora de un assistente que ayuda a completar un formulario
 */
export abstract class FormCompletionAssistant<T = unknown> {
  /**
   * @link https://github.com/microsoft/TypeScript/issues/3841
   */
  declare ["constructor"]: typeof FormCompletionAssistant;

  // Este objeto es usado como token de modelo inválido y de esta
  // manera poder correr todas las validaciones en objetos compuestos
  static INVALID_MODEL = new Object();

  protected failedAssertions!: Assertion[];

  static isInvalidModel(potentialModel: unknown) {
    return potentialModel === FormCompletionAssistant.INVALID_MODEL;
  }

  /**
   * @todo type this
   */
  constructor(
    protected assertionIds: AssertionId[],
    protected fromContainerModelGetter: (containerModel: unknown) => T
  ) {
    this.removeFailedAssertions();
  }

  abstract createModel(): T;

  abstract getModel(): T;

  abstract setModel(newModel: T): void;

  abstract resetModel(): void;

  withCreatedModelDo<S>(
    validModelClosure: (model: T) => S,
    invalidModelClosure: () => S
  ) {
    const createdModel = this.createModel();
    if (this.constructor.isInvalidModel(createdModel))
      return invalidModelClosure();

    return validModelClosure(createdModel);
  }

  setModelFrom(containerModel) {
    return this.setModel(this.fromContainerModelGetter(containerModel));
  }

  removeFailedAssertions() {
    this.failedAssertions = [];
  }

  handles(assertion: Assertion) {
    return this.assertionIds.some((assertionId) =>
      assertion.isIdentifiedAs(assertionId)
    );
  }

  hasOnlyOneAssertionFailedIdentifiedAs(assertionId: AssertionId) {
    return (
      this.failedAssertions.length === 1 &&
      this.failedAssertions[0].isIdentifiedAs(assertionId)
    );
  }

  addFailedAssertion(assertionFailed: Assertion) {
    this.failedAssertions.push(assertionFailed);
  }

  doesNotHaveFailedAssertions() {
    return !this.hasFailedAssertions();
  }

  hasFailedAssertions() {
    return this.failedAssertions.length > 0;
  }

  failedAssertionsDescriptions() {
    return this.failedAssertions
      .map((failedAssertion) => failedAssertion.getDescription())
      .filter((description) => description !== "");
  }

  addAssertionId(anAssertionId: AssertionId) {
    this.assertionIds.push(anAssertionId);
  }
}
