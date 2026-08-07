<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { previews } from "../../../content/projects/previews";
import { locale } from "../../../i18n/store";
import PreviewCard from "../../projects/components/PreviewCard.vue";
import NotchSection from "../../../components/NotchSection.vue";
import Banner from "../../../components/Banner.vue";
import { t } from "../../../i18n/utils/translate";
import { isFeatureEnabled } from "../../../utils/features";

import type { ProjectPreview, ProjectCategory } from "../../../content/types";

type FilterId = "all" | ProjectCategory;

// Full list of filters in display order. All pills are always shown; selecting a
// category with no projects yet renders an empty state (see `filteredPreviews`).
const FILTERS: { id: FilterId; labelKey: string }[] = [
  { id: "all", labelKey: "filter-all" },
  { id: "web-design", labelKey: "filter-web-design" },
  { id: "app-design", labelKey: "filter-app-design" },
  { id: "branding", labelKey: "filter-branding" },
  { id: "packaging", labelKey: "filter-packaging" },
];

const loadedPreviews = ref<ProjectPreview[] | null>(null);
const activeFilter = ref<FilterId>("all");

const emit = defineEmits<{
  (e: "loaded", previews: ProjectPreview[]): void;
}>();

const filteredPreviews = computed(() => {
  const items = loadedPreviews.value ?? [];
  if (activeFilter.value === "all") return items;
  return items.filter((p) => p.category === activeFilter.value);
});

const isEmpty = computed(() => loadedPreviews.value !== null && filteredPreviews.value.length === 0);

const loadPreviews = async () => {
  if (!locale.value) return;
  const func = previews[locale.value as keyof typeof previews];
  if (!func) return;
  const module = await func();
  loadedPreviews.value = module.default;
  emit("loaded", module.default);
};

watch(locale, loadPreviews);

onMounted(loadPreviews);
</script>

<template>
  <div class="projects">
    <NotchSection class="projects-notch-start" />
    <NotchSection class="projects-notch-end" />
    <div class="grid">
      <div class="projects-title">
        <Banner class="projects-title-banner" :copy="t('selected')" size="sm" animated />
        <h2 class="projects-title-copy">{{ t("projects") }}</h2>
      </div>
    </div>
    <div class="grid">
      <div class="projects-filters" role="tablist" :aria-label="t('projects')">
        <button
          v-for="filter in FILTERS"
          :key="filter.id"
          type="button"
          role="tab"
          :aria-selected="activeFilter === filter.id"
          :class="['projects-filter', { 'projects-filter-active': activeFilter === filter.id }]"
          data-cursor="pointer"
          data-sound="click"
          data-hoversound="hover"
          @click="activeFilter = filter.id"
        >
          {{ t(filter.labelKey) }}
        </button>
      </div>
    </div>
    <div class="grid">
      <TransitionGroup tag="div" name="card-list" class="projects-cards">
        <PreviewCard v-for="preview in filteredPreviews" :key="preview.slug" :preview="preview" />
        <PreviewCard v-if="isFeatureEnabled('startProject')" key="start-project" />
      </TransitionGroup>
    </div>
    <div class="grid" v-if="isEmpty">
      <p class="projects-empty">{{ t("no-projects-in-category") }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.projects {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  gap: var(--space-xl);
  padding-left: var(--space-outer);
  padding-right: var(--space-outer);
  background-color: var(--color-beige-400);
  min-height: calc(var(--lvh) * 100 + var(--radius-xxl));
  padding-top: 96px;
  padding-bottom: 96px;

  @include mixins.mq("md") {
    padding-top: 144px;
    padding-bottom: 144px;
    gap: var(--space-xxl);
  }

  @include mixins.mq("lg") {
    gap: var(--space-xxxl);
  }

  &-title {
    position: relative;
    padding-top: var(--space-md);
    grid-column: 1 / 13;

    @include mixins.mq("md") {
      grid-column: 1 / 10;
    }

    @include mixins.mq("lg") {
      grid-column: 3 / 8;
    }

    &-copy {
      font-weight: 900;
      letter-spacing: 0.02em;
      font-size: var(--font-size-title-md);

      @include mixins.mq("sm") {
        font-size: var(--font-size-title-lg);
      }

      @include mixins.mq("xl") {
        font-size: var(--font-size-title-xl);
      }
    }

    &-banner {
      position: absolute;
      top: 0;
      left: -8px;
      transform: translate(0, -20%) rotate(-4deg);

      @include mixins.mq("lg") {
        left: -16px;
        transform: translate(0, -20%) rotate(-6deg);
      }
    }
  }

  &-empty {
    grid-column: 1 / 13;
    text-align: center;
    padding: var(--space-xl) 0;
    font-size: var(--font-size-lg);
    font-weight: 500;
    color: var(--color-text-300);

    @include mixins.mq("lg") {
      grid-column: 3 / 11;
    }
  }

  &-filters {
    grid-column: 1 / 13;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);

    @include mixins.mq("md") {
      grid-column: 1 / 10;
    }

    @include mixins.mq("lg") {
      grid-column: 3 / 11;
    }
  }

  &-filter {
    appearance: none;
    cursor: pointer;
    white-space: nowrap;
    border: var(--stroke-md) solid var(--color-grayscale-500);
    background-color: transparent;
    color: var(--color-text-300);
    border-radius: 999px;
    padding: var(--space-xs) var(--space-md);
    font-size: var(--font-size-sm);
    font-weight: 600;
    line-height: 1;
    transition:
      background-color 0.25s var(--ease-smooth),
      border-color 0.25s var(--ease-smooth),
      color 0.25s var(--ease-smooth);

    @include mixins.mq("lg") {
      font-size: var(--font-size-md);
    }

    @include mixins.hover {
      &:hover {
        border-color: var(--color-text-400);
        color: var(--color-text-400);
      }
    }

    &-active {
      background-color: var(--color-text-400);
      border-color: var(--color-text-400);
      color: var(--color-beige-400);

      @include mixins.hover {
        &:hover {
          color: var(--color-beige-400);
        }
      }
    }
  }

  &-notch {
    &-start {
      position: absolute;
      top: 0;
      left: 0;
      transform: translateY(-100%);
      color: var(--color-beige-400);
      --icon-color: var(--color-beige-400);
    }

    &-end {
      position: absolute;
      bottom: 0;
      left: 0;
      color: var(--color-beige-600);
      --icon-color: var(--color-beige-600);
    }
  }

  &-cards {
    position: relative;
    max-width: 100%;
    flex: 1;
    grid-column: 1 / span 12;
    display: grid;
    gap: var(--space-lg);
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));

    @include mixins.mq("md") {
      grid-column: 1 / span 12;
    }

    @include mixins.mq("lg") {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      grid-column: 3 / span 8;
    }

    @include mixins.mq("xl") {
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
    }
  }
}

// TransitionGroup: fade + scale on enter/leave, FLIP "move" when cards rearrange.
.card-list-move,
.card-list-enter-active,
.card-list-leave-active {
  transition:
    opacity 0.4s var(--ease-smooth),
    transform 0.4s var(--ease-smooth);
}

.card-list-enter-from,
.card-list-leave-to {
  opacity: 0;
  transform: scale(0.92);
}

// Take leaving cards out of flow so remaining cards animate to their new spots.
.card-list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
