import { useState, useEffect } from "react";
import {
  TextInput,
  Card,
  Image,
  Text,
  Group,
  Badge,
  Stack,
  Container,
  Loader,
  Center,
} from "@mantine/core";
import { IconSearch, IconClock, IconUsers } from "@tabler/icons-react";
import { Link, useSearchParams } from "react-router";
import { getAllRecipes, searchRecipes } from "~/lib/queries";
import type { RecipeListItem } from "~/types/recipe";

export default function Recipes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") || "";
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchRecipes = search ? searchRecipes(search) : getAllRecipes();
    fetchRecipes.then(setRecipes).finally(() => setLoading(false));
  }, [search]);

  const handleSearch = (value: string) => {
    if (value) {
      setSearchParams({ q: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <Container size="xs" py="xs">
      <Stack gap="xs">
        <Card padding={0} radius="sm" withBorder>
          <TextInput
            placeholder="Search recipes..."
            leftSection={<IconSearch size={16} />}
            defaultValue={search}
            onChange={(e) => handleSearch(e.currentTarget.value)}
            size="md"
            variant="unstyled"
            styles={{ input: { paddingLeft: 36, paddingRight: 12 } }}
          />
        </Card>

        {loading ? (
          <Center py="xl">
            <Loader />
          </Center>
        ) : recipes.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            {search ? "No recipes found" : "No recipes yet"}
          </Text>
        ) : (
          <Stack gap="xs">
            {recipes.map((recipe) => (
              <Card
                key={recipe._id}
                component={Link}
                to={`/${recipe._id}`}
                padding="xs"
                radius="sm"
                withBorder
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {recipe.imageUrl && (
                  <Card.Section>
                    <Image
                      src={recipe.imageUrl}
                      height={160}
                      alt={recipe.title}
                    />
                  </Card.Section>
                )}

                <Stack gap="xs">
                  <Text fw={600} size="lg" lineClamp={1}>
                    {recipe.title}
                  </Text>

                  {recipe.description && (
                    <Text size="sm" c="dimmed" lineClamp={2}>
                      {recipe.description}
                    </Text>
                  )}

                  <Group gap="sm">
                    {recipe.prepTime && (
                      <Badge
                        variant="light"
                        leftSection={<IconClock size={12} />}
                      >
                        {recipe.prepTime} min
                      </Badge>
                    )}
                    {recipe.portions && (
                      <Badge
                        variant="light"
                        leftSection={<IconUsers size={12} />}
                      >
                        {recipe.portions} portions
                      </Badge>
                    )}
                  </Group>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
