import type { FormCompletionAssistant } from "./FormCompletionAssistant";

export type CreationClosure<Model, ComposedModels extends any[]> = (...models: ComposedModels) => Model;

export type AssistantsFor<Models extends any[], ContainerModel> = {
  [Index in keyof Models]: FormCompletionAssistant<Models[Index], ContainerModel>;
};

/**
 * Describes how to get a model from another that serves as a container.
 * @see {@link FormCompletionAssistant}
 * @example This example shows how to get a Time model from a Customer container.
 *
 * ```ts
 * const fromWorkingHours: ModelFromContainer<Time, Customer> =
 *    (customer) => customer.getFromWorkingHours();
 * ```
 * @see {@link https://github.com/hernanwilkinson/disenioALaGorra/blob/a6d90a0044bf69f98fb50584872b226bf678e67b/Temporada01/Episodio03%20-%20Modelar%20los%20Conjuntos%20de%20Objetos/validation/src/Customers/View/CustomerView.js#L51 Original example}
 */
export type ModelFromContainer<Model, ContainerModel> = (containerModel: ContainerModel) => Model;
