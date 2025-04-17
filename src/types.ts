import type { SelfContainedAssertion } from "@/assertion";
import type { FormCompletionAssistant } from "./FormCompletionAssistant";

/**
 * Changes to an assistant's model can be observed by mirrors.
 */
export interface AssistantMirror<Model = unknown> {
  /**
   * Reflects changes to the model.
   */
  reflect?: (anImage: Model) => void;

  /**
   * Receives notifications about failed assertions.
   */
  onFailure?: (aFailedAsserion: SelfContainedAssertion) => void;

  /**
   * Receives notifications when the model's failed assertions are cleared.
   */
  onFailureReset?: () => void;
}

/**
 * Maps an array of models to the assistants that handle them.
 *
 * @see {@link FormSectionCompletionAssistant}
 *
 * @example
 * Suppose a Customer has only a firstName and a lastName.
 *
 * ```ts
 * const assistants: AssistantsFor<[string, string], Customer> = [
 *    getFirstNameCompletionAssistant(),
 *    getLastNameCompletionAssistant()
 * ]
 * ```
 */
export type AssistantsIn<Models extends unknown[], ContainerModel> = {
  [Index in keyof Models]: FormCompletionAssistant<Models[Index], ContainerModel>;
};

/**
 * Describes how to get a model from another that serves as a container.
 *
 * @see
 * {@link FormCompletionAssistant},
 * {@link https://github.com/hernanwilkinson/disenioALaGorra/blob/a6d90a0044bf69f98fb50584872b226bf678e67b/Temporada01/Episodio03%20-%20Modelar%20los%20Conjuntos%20de%20Objetos/validation/src/Customers/View/CustomerView.js#L51 Original webinar example}
 *
 * @example
 * This example shows how to get a Time model from a Customer container.
 *
 * ```ts
 * const fromWorkingHours: ModelFromContainer<Time, Customer> =
 *    (customer) => customer.getFromWorkingHours();
 * ```
 */
export type ModelFromContainer<Model, ContainerModel> = (containerModel: ContainerModel) => Model;
