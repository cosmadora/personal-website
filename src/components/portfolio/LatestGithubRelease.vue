<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    repo: string;
    instance?: string;
  }>(),
  {
    instance: 'https://api.github.com',
  }
);

const status = ref<'idle' | 'loading' | 'success' | 'error'>('idle');
const version = ref('');
const releaseUrl = ref<string | null>(null);

const apiUrl = computed(() => {
  const [owner, repoName] = props.repo.split('/');

  if (!owner || !repoName) {
    return null;
  }

  const base = props.instance.replace(/\/$/, '');


  // 
  return `${base}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repoName)}/releases/latest`;
});

async function loadLatestGithubRelease() {
  if (!apiUrl.value) {
    status.value = 'error';
    version.value = 'invalid repo';
    return;
  }

  status.value = 'loading';

  try {
    const response = await fetch(apiUrl.value, {
      headers: {
        "Accept": 'application/vnd.github+json',
        "User-Agent": 'Adoras Website +https://adora.codes',
        "X-GitHub-Api-Version": "2026-03-10"
      },
    });

    if (!response.ok) {
      throw new Error(`github returned ${response.status}`);
    }

    const data = await response.json();

    version.value = data.tag_name ?? data.name ?? 'currently unavailable';
    releaseUrl.value = data.html_url ?? data.url ?? null;
    status.value = 'success';
  } catch (error) {
    console.error(`[github] Could not load latest release for ${props.repo}`, error);

    version.value = 'currently unavailable';
    releaseUrl.value = null;
    status.value = 'error';
  }
}

onMounted(loadLatestGithubRelease);
</script>

<template>
  <span
    class="github-version"
    :data-github-repo="repo"
    :data-status="status"
  >
    <span
      v-if="status === 'idle' || status === 'loading'"
      class="github-version__loading"
      aria-live="polite"
    >
      <span class="github-version__spinner" aria-hidden="true"></span>
      <span>loading...</span>
    </span>

    <a
      v-else-if="releaseUrl && status === 'success'"
      :href="releaseUrl"
    >
      {{ version }}
    </a>

    <template v-else>
      {{ version }}
    </template>
  </span>
</template>

<style scoped>
.github-version__loading {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
}

.github-version__spinner {
  display: inline-block;
  width: 0.85em;
  height: 0.85em;
  border: 0.15em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: github-version-spin 0.75s linear infinite;
}

@keyframes github-version-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
