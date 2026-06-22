import Foundation

enum RecipePersistenceMapper {
    static func makePersistentRecipe(from recipe: Recipe) -> PersistentRecipe {
        PersistentRecipe(
            id: recipe.id,
            title: recipe.title,
            ingredients: makePersistentIngredients(from: recipe.ingredients),
            steps: makePersistentSteps(from: recipe.steps),
            memo: recipe.memo,
            estimatedTime: recipe.estimatedTime,
            sourceRawValue: recipe.source.rawValue,
            syncStatusRawValue: recipe.syncStatus.rawValue,
            ownerId: recipe.ownerId,
            createdAt: recipe.createdAt,
            updatedAt: recipe.updatedAt
        )
    }

    static func update(_ persistentRecipe: PersistentRecipe, from recipe: Recipe) {
        persistentRecipe.title = recipe.title
        persistentRecipe.ingredients = makePersistentIngredients(from: recipe.ingredients)
        persistentRecipe.steps = makePersistentSteps(from: recipe.steps)
        persistentRecipe.memo = recipe.memo
        persistentRecipe.estimatedTime = recipe.estimatedTime
        persistentRecipe.sourceRawValue = recipe.source.rawValue
        persistentRecipe.syncStatusRawValue = recipe.syncStatus.rawValue
        persistentRecipe.ownerId = recipe.ownerId
        persistentRecipe.createdAt = recipe.createdAt
        persistentRecipe.updatedAt = recipe.updatedAt
    }

    static func makeRecipe(from persistentRecipe: PersistentRecipe) -> Recipe {
        Recipe(
            id: persistentRecipe.id,
            title: persistentRecipe.title,
            ingredients: persistentRecipe.ingredients
                .sorted { $0.order < $1.order }
                .map(makeIngredient),
            steps: persistentRecipe.steps
                .sorted { $0.order < $1.order }
                .map(makeRecipeStep),
            memo: persistentRecipe.memo,
            estimatedTime: persistentRecipe.estimatedTime,
            source: RecipeSource(rawValue: persistentRecipe.sourceRawValue) ?? .voiceLog,
            syncStatus: SyncStatus(rawValue: persistentRecipe.syncStatusRawValue) ?? .localOnly,
            ownerId: persistentRecipe.ownerId,
            createdAt: persistentRecipe.createdAt,
            updatedAt: persistentRecipe.updatedAt
        )
    }

    private static func makePersistentIngredients(from ingredients: [Ingredient]) -> [PersistentIngredient] {
        ingredients.enumerated().map { index, ingredient in
            PersistentIngredient(
                id: ingredient.id,
                name: ingredient.name,
                amountText: ingredient.amountText,
                order: index
            )
        }
    }

    private static func makePersistentSteps(from steps: [RecipeStep]) -> [PersistentRecipeStep] {
        steps.map { step in
            PersistentRecipeStep(
                id: step.id,
                order: step.order,
                text: step.text,
                duration: step.duration,
                note: step.note
            )
        }
    }

    private static func makeIngredient(from persistentIngredient: PersistentIngredient) -> Ingredient {
        Ingredient(
            id: persistentIngredient.id,
            name: persistentIngredient.name,
            amountText: persistentIngredient.amountText
        )
    }

    private static func makeRecipeStep(from persistentStep: PersistentRecipeStep) -> RecipeStep {
        RecipeStep(
            id: persistentStep.id,
            order: persistentStep.order,
            text: persistentStep.text,
            duration: persistentStep.duration,
            note: persistentStep.note
        )
    }
}
