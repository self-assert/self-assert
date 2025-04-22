import type { LabeledRule } from "./rule";
import type { DraftAssistant } from "./draft-assistant";

/**
 * Changes to a draft can be observed by viewers.
 * Viewers can be notified about changes to the draft or about failed assertions.
 */
export interface DraftViewer<Model = any> {
  /**
   * Receives notifications about changes to the draft's model.
   */
  onDraftChanged?: (aModel: Model) => void;

  /**
   * Receives notifications about failed assertions.
   */
  onFailure?: (aFailedAsserion: LabeledRule) => void;

  /**
   * Receives notifications when the model's failed assertions are cleared.
   */
  onFailuresReset?: () => void;
}

/**
 * Maps an array of models to the assistants that handle them.
 *
 * @example
 * Suppose a Customer has only a `firstName` and a `lastName`.
 *
 * ```ts
 * const assistants: AssistantsFor<[string, string], Customer> = [
 *    firstNameDraftAssistant,
 *    lastNameDraftAssistant
 * ]
 * ```
 */
export type AssistantsIn<Models extends unknown[], ContainerModel> = {
  [Index in keyof Models]: DraftAssistant<Models[Index], ContainerModel>;
};

/**
 * Describes how to get a model from another that serves as a container.
 *
 * @see
 * {@link DraftAssistant},
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
