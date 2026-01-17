import { useState, useEffect } from "react";
import {
  Image,
  Text,
  Group,
  Badge,
  Stack,
  Container,
  Title,
  List,
  Divider,
  ActionIcon,
  NumberInput,
  Loader,
  Center,
} from "@mantine/core";
import { IconClock, IconArrowLeft, IconMinus, IconPlus } from "@tabler/icons-react";
import { Link, useParams } from "react-router";
import { getRecipeById } from "~/lib/queries";
import type { Recipe } from "~/types/recipe";

function scaleAmount(amount: string | undefined, scale: number): string {
  if (!amount) return "";
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  const scaled = num * scale;
  if (Number.isInteger(scaled)) return scaled.toString();
  return scaled.toFixed(2).replace(/\.?0+$/, "");
}

export default function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [portions, setPortions] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getRecipeById(id)
      .then((data) => {
        if (data) {
          setRecipe(data);
          setPortions(data.portions ?? 1);
        } else {
          setNotFound(true);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Center py="xl" style={{ minHeight: "50vh" }}>
        <Loader />
      </Center>
    );
  }

  if (notFound || !recipe) {
    return (
      <Container size="xs" py="md">
        <Stack gap="md">
          <Group>
            <ActionIcon
              component={Link}
              to="/"
              variant="subtle"
              size="lg"
              aria-label="Back to recipes"
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
          </Group>
          <Text ta="center" py="xl">Recipe not found</Text>
        </Stack>
      </Container>
    );
  }

  const originalPortions = recipe.portions ?? 1;
  const scale = portions / originalPortions;

  return (
    <>
      {recipe.imageUrl && (
        <Image
          src={recipe.imageUrl}
          height={250}
          alt={recipe.title}
          style={{ width: "100%" }}
        />
      )}

      <Container size="xs" py="md">
        <Stack gap="md">
          <Group>
            <ActionIcon
              component={Link}
              to="/"
              variant="subtle"
              size="lg"
              aria-label="Back to recipes"
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
          </Group>

          <Title order={1} size="h2">
            {recipe.title}
          </Title>

          {recipe.description && (
            <Text c="dimmed">{recipe.description}</Text>
          )}

          <Group gap="sm">
            {recipe.prepTime && (
              <Badge
                size="lg"
                variant="light"
                leftSection={<IconClock size={14} />}
              >
                {recipe.prepTime} min
              </Badge>
            )}
          </Group>

          {recipe.portions && (
            <Group gap="xs" align="center">
              <Text size="sm" fw={500}>Portions:</Text>
              <ActionIcon
                variant="light"
                size="lg"
                onClick={() => setPortions((p) => Math.max(1, p - 1))}
                disabled={portions <= 1}
                aria-label="Decrease portions"
              >
                <IconMinus size={16} />
              </ActionIcon>
              <NumberInput
                value={portions}
                onChange={(val) => setPortions(Math.max(1, Number(val) || 1))}
                min={1}
                max={100}
                size="sm"
                w={60}
                hideControls
                styles={{ input: { textAlign: "center" } }}
              />
              <ActionIcon
                variant="light"
                size="lg"
                onClick={() => setPortions((p) => p + 1)}
                aria-label="Increase portions"
              >
                <IconPlus size={16} />
              </ActionIcon>
            </Group>
          )}

          <Divider />

          {recipe.ingredientGroups && recipe.ingredientGroups.length > 0 && (
            <Stack gap="md">
              <Title order={2} size="h4">
                Ingredients
              </Title>

              {recipe.ingredientGroups.map((group, groupIndex) => (
                <Stack key={groupIndex} gap="xs">
                  {group.groupName && (
                    <Text fw={600} size="sm" c="dimmed">
                      {group.groupName}
                    </Text>
                  )}
                  <List spacing="xs">
                    {group.ingredients.map((ingredient, ingredientIndex) => (
                      <List.Item key={ingredientIndex}>
                        {[
                          scaleAmount(ingredient.amount, scale),
                          ingredient.unit,
                          ingredient.name,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      </List.Item>
                    ))}
                  </List>
                </Stack>
              ))}
            </Stack>
          )}

          {recipe.steps && recipe.steps.length > 0 && (
            <>
              <Divider />
              <Stack gap="md">
                <Title order={2} size="h4">
                  Steps
                </Title>

                <List type="ordered" spacing="md">
                  {recipe.steps.map((step, index) => (
                    <List.Item key={index}>
                      <Text>{step}</Text>
                    </List.Item>
                  ))}
                </List>
              </Stack>
            </>
          )}
        </Stack>
      </Container>
    </>
  );
}
